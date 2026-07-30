#!/usr/bin/env node
/* Pre-renders the first page of every certificate PDF in public/zertifikate to
   a WebP preview in public/assets/zertifikate, so the gallery tiles and the
   certificate dialog show the actual document instead of a placeholder.
 *
 * Run after adding a certificate PDF:
 *
 *   node scripts/certificate-previews.mjs
 *
 * Prerequisites (system tools, deliberately not npm dependencies — the
 * previews are generated once and committed, so the website build needs
 * nothing):
 *
 *   poppler-utils  (pdftoppm)  — PDF page → PNG
 *   webp           (cwebp)     — PNG → WebP
 *
 * The uniform border around the page content (Code with Mosh prints an A4 page
 * with wide white margins) is trimmed so every preview is filled edge to edge.
 * The bounding box is measured on a cheap 72-dpi render with nothing but
 * node:zlib, then the page is re-rendered cropped at full resolution. */

import { execFileSync } from "node:child_process";
import { inflateSync } from "node:zlib";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";

const PDF_DIR = "public/zertifikate";
const OUT_DIR = "public/assets/zertifikate";
/** Longest side of the committed preview — 2× the widest on-screen use. */
const MAX_PX = 1400;
/** Per-channel distance from the page's border colour that still counts as border. */
const TOLERANCE = 6;
const WEBP_QUALITY = 86;

/* Minimal PNG reader for 8-bit RGB/RGBA images (what pdftoppm writes): parse
   IHDR, inflate the concatenated IDAT stream and undo the per-scanline
   filters. Returns the raw pixel rows. */
function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("kein PNG");
  let pos = 8;
  let width = 0;
  let height = 0;
  let channels = 0;
  const idat = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      const depth = data[8];
      const colorType = data[9];
      if (depth !== 8 || (colorType !== 2 && colorType !== 6)) {
        throw new Error(`unerwartetes PNG-Format (depth ${depth}, color ${colorType})`);
      }
      channels = colorType === 2 ? 3 : 4;
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    pos += len + 12;
  }

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const pixels = Buffer.alloc(height * stride);
  let src = 0;

  for (let y = 0; y < height; y++) {
    const filter = raw[src++];
    const row = y * stride;
    const prev = row - stride;
    for (let x = 0; x < stride; x++) {
      const cur = raw[src + x];
      const a = x >= channels ? pixels[row + x - channels] : 0;
      const b = y > 0 ? pixels[prev + x] : 0;
      const c = x >= channels && y > 0 ? pixels[prev + x - channels] : 0;
      let value;
      switch (filter) {
        case 0: value = cur; break;
        case 1: value = cur + a; break;
        case 2: value = cur + b; break;
        case 3: value = cur + ((a + b) >> 1); break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          value = cur + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
          break;
        }
        default: throw new Error(`unbekannter PNG-Filter ${filter}`);
      }
      pixels[row + x] = value & 0xff;
    }
    src += stride;
  }

  return { width, height, channels, pixels };
}

/* Bounding box of everything that differs from the page's border colour (read
   from the top-left pixel). Full-bleed designs simply yield the whole page. */
function contentBox({ width, height, channels, pixels }) {
  const at = (x, y) => (y * width + x) * channels;
  const bg = [pixels[0], pixels[1], pixels[2]];
  const isBg = (i) =>
    Math.abs(pixels[i] - bg[0]) <= TOLERANCE &&
    Math.abs(pixels[i + 1] - bg[1]) <= TOLERANCE &&
    Math.abs(pixels[i + 2] - bg[2]) <= TOLERANCE;

  let top = 0;
  let bottom = height - 1;
  let left = 0;
  let right = width - 1;

  const rowIsBg = (y) => {
    for (let x = 0; x < width; x++) if (!isBg(at(x, y))) return false;
    return true;
  };
  const colIsBg = (x) => {
    for (let y = top; y <= bottom; y++) if (!isBg(at(x, y))) return false;
    return true;
  };

  while (top < bottom && rowIsBg(top)) top++;
  while (bottom > top && rowIsBg(bottom)) bottom--;
  while (left < right && colIsBg(left)) left++;
  while (right > left && colIsBg(right)) right--;

  return { x: left, y: top, w: right - left + 1, h: bottom - top + 1 };
}

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });

const pdfs = readdirSync(PDF_DIR)
  .filter((f) => f.endsWith(".pdf"))
  .sort();

if (pdfs.length === 0) {
  console.error(`Keine PDFs in ${PDF_DIR} gefunden.`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), "cert-previews-"));

try {
  for (const pdf of pdfs) {
    const slug = basename(pdf, ".pdf");
    const src = join(PDF_DIR, pdf);

    // 1. Cheap probe render to find the content box (in 72-dpi pixels = points).
    const probe = join(tmp, `${slug}-probe`);
    run("pdftoppm", ["-png", "-r", "72", "-f", "1", "-l", "1", "-singlefile", src, probe]);
    const box = contentBox(decodePng(readFileSync(`${probe}.png`)));

    // 2. Re-render just that box, scaled so its longest side is MAX_PX.
    const scale = MAX_PX / Math.max(box.w, box.h);
    const dpi = Math.round(72 * scale);
    const full = join(tmp, slug);
    run("pdftoppm", [
      "-png", "-r", String(dpi), "-f", "1", "-l", "1", "-singlefile",
      "-x", String(Math.round(box.x * scale)),
      "-y", String(Math.round(box.y * scale)),
      "-W", String(Math.round(box.w * scale)),
      "-H", String(Math.round(box.h * scale)),
      src, full,
    ]);

    // 3. Encode as WebP — text stays crisp where a JPEG would ring.
    const out = join(OUT_DIR, `${slug}.webp`);
    run("cwebp", ["-q", String(WEBP_QUALITY), "-m", "6", "-quiet", `${full}.png`, "-o", out]);

    const { width, height } = decodePng(readFileSync(`${full}.png`));
    const kb = Math.round(readFileSync(out).length / 1024);
    console.log(`${slug}: ${width}×${height} px, ${kb} kB → ${out}`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
