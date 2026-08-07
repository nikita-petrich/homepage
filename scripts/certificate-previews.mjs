#!/usr/bin/env node
/* Pre-renders the first page of every certificate PDF in public/certificates to
   WebP images in public/assets/certificates, so the gallery tiles and the
   certificate dialog show the actual document instead of a placeholder.
 *
 * Two derivatives per certificate:
 *
 *   <slug>.webp       the whole page, uniform border trimmed — the dialog shows
 *                     this contained, so nothing of the document is cut off
 *   <slug>-tile.webp  cropped to the gallery tile's aspect ratio, so a tile is
 *                     filled edge to edge with the part that carries the
 *                     information instead of letterboxing the page
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
 * Both crops are measured on a cheap 72-dpi probe render with nothing but
 * node:zlib, then the page is re-rendered cropped at full resolution.
 *
 * Finding the tile crop needs more than trimming a uniform border: Scrimba
 * prints its certificate onto a full-bleed A4 gradient, where the text occupies
 * a band in the middle and the rest is empty colour — there is no border to
 * trim. So the tile crop is measured by edge energy (how much a pixel differs
 * from its left and upper neighbour): text and line art score high, a smooth
 * gradient scores near zero. The resulting "ink box" is then grown to the tile
 * aspect ratio around its own centre. */

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";

import { decodePng } from "./lib/png.mjs";

const PDF_DIR = "public/certificates";
const OUT_DIR = "public/assets/certificates";
/** Longest side of the committed preview — 2× the widest on-screen use. */
const MAX_PX = 1400;
/** Per-channel distance from the page's border colour that still counts as border. */
const TOLERANCE = 6;
const WEBP_QUALITY = 86;
/** Aspect ratio of the gallery tile the -tile.webp crop has to fill. */
const TILE_ASPECT = 4 / 3;
/** A row or column counts as "ink" above this share of the page's busiest one. */
const INK_THRESHOLD = 0.06;
/** Breathing room around the ink box, as a share of the page's shorter side. */
const INK_PADDING = 0.03;

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

/* Box around everything that looks like text or line art, measured by how much
   each pixel differs from its left and upper neighbour. A smooth background —
   white paper or Scrimba's full-page gradient — contributes almost nothing, so
   what remains is the part of the page worth putting in a tile. */
function inkBox({ width, height, channels, pixels }) {
  const luma = new Float32Array(width * height);
  for (let i = 0, p = 0; i < luma.length; i++, p += channels) {
    luma[i] = 0.299 * pixels[p] + 0.587 * pixels[p + 1] + 0.114 * pixels[p + 2];
  }

  const rows = new Float64Array(height);
  const cols = new Float64Array(width);
  for (let y = 1; y < height; y++) {
    for (let x = 1; x < width; x++) {
      const i = y * width + x;
      const d =
        Math.abs(luma[i] - luma[i - 1]) + Math.abs(luma[i] - luma[i - width]);
      rows[y] += d;
      cols[x] += d;
    }
  }

  /* Normalise per pixel count so the threshold means the same for a row of a
     wide page and a column of a tall one. */
  const span = (energy, length, limit) => {
    const perPixel = Array.from(energy, (e) => e / limit);
    const peak = Math.max(...perPixel);
    if (peak === 0) return { from: 0, to: length - 1 };
    const min = peak * INK_THRESHOLD;
    let from = 0;
    let to = length - 1;
    while (from < to && perPixel[from] < min) from++;
    while (to > from && perPixel[to] < min) to--;
    return { from, to };
  };

  const v = span(rows, height, width);
  const h = span(cols, width, height);
  const pad = Math.round(Math.min(width, height) * INK_PADDING);

  const x = Math.max(0, h.from - pad);
  const y = Math.max(0, v.from - pad);
  return {
    x,
    y,
    w: Math.min(width, h.to + pad + 1) - x,
    h: Math.min(height, v.to + pad + 1) - y,
  };
}

/* Grows (or shrinks) a box to the wanted aspect ratio around its own centre,
   then slides it back inside `bounds` instead of letting it hang over an edge.
 *
 * Bounding it by the trimmed content box rather than the whole page is what
 * keeps a tile free of paper: Code with Mosh centres a framed certificate on an
 * A4 page, and a crop allowed to run to the page edge would put a white margin
 * around the frame instead of filling the tile with it. */
function fitAspect(box, aspect, bounds) {
  let w = box.w;
  let h = box.h;
  if (w / h < aspect) w = h * aspect;
  else h = w / aspect;

  if (w > bounds.w) {
    w = bounds.w;
    h = w / aspect;
  }
  if (h > bounds.h) {
    h = bounds.h;
    w = h * aspect;
  }

  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const x = Math.min(Math.max(bounds.x, cx - w / 2), bounds.x + bounds.w - w);
  const y = Math.min(Math.max(bounds.y, cy - h / 2), bounds.y + bounds.h - h);

  return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
}

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });

/* Renders a region of the first page (measured in 72-dpi pixels = points) so
   its longest side lands on MAX_PX, and encodes it as WebP — text stays crisp
   where a JPEG would ring. */
function renderCrop(src, box, out, tmpBase) {
  const scale = MAX_PX / Math.max(box.w, box.h);
  const dpi = Math.round(72 * scale);
  run("pdftoppm", [
    "-png", "-r", String(dpi), "-f", "1", "-l", "1", "-singlefile",
    "-x", String(Math.round(box.x * scale)),
    "-y", String(Math.round(box.y * scale)),
    "-W", String(Math.round(box.w * scale)),
    "-H", String(Math.round(box.h * scale)),
    src, tmpBase,
  ]);
  run("cwebp", ["-q", String(WEBP_QUALITY), "-m", "6", "-quiet", `${tmpBase}.png`, "-o", out]);
  const { width, height } = decodePng(readFileSync(`${tmpBase}.png`));
  return { width, height, kb: Math.round(readFileSync(out).length / 1024) };
}

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

    // 1. Cheap probe render, measured in 72-dpi pixels = PDF points.
    const probe = join(tmp, `${slug}-probe`);
    run("pdftoppm", ["-png", "-r", "72", "-f", "1", "-l", "1", "-singlefile", src, probe]);
    const page = decodePng(readFileSync(`${probe}.png`));

    // 2. Whole page for the dialog: uniform border trimmed, nothing cut off.
    const content = contentBox(page);
    const full = renderCrop(
      src,
      content,
      join(OUT_DIR, `${slug}.webp`),
      join(tmp, slug),
    );

    // 3. Tile crop: the ink box grown to the tile's aspect ratio, kept inside
    //    the trimmed page so no paper margin creeps into the tile.
    const tileBox = fitAspect(inkBox(page), TILE_ASPECT, content);
    const tile = renderCrop(
      src,
      tileBox,
      join(OUT_DIR, `${slug}-tile.webp`),
      join(tmp, `${slug}-tile`),
    );

    console.log(
      `${slug}\n` +
        `  page: ${full.width}×${full.height} px, ${full.kb} kB\n` +
        `  tile: ${tile.width}×${tile.height} px, ${tile.kb} kB ` +
        `(crop ${tileBox.w}×${tileBox.h} pt at ${tileBox.x},${tileBox.y})`,
    );
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
