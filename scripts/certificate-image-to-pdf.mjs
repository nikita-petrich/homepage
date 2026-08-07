#!/usr/bin/env node
/* Wraps a certificate that only exists as an image — a screenshot of the
   issuer's certificate page, for instance — into a PDF, so it can be served
   from public/certificates like every other certificate and gets the same tile
   preview and "open in a new tab" behaviour.
 *
 *   node scripts/certificate-image-to-pdf.mjs <image.jpg|image.png> <slug>
 *   node scripts/certificate-previews.mjs        # then generate the previews
 *
 * The image is embedded unchanged — never re-typeset and never lossily
 * re-encoded, so the PDF is a container around the original document rather
 * than a reconstruction of it:
 *
 *   JPEG  the file's own bytes become the image stream (/DCTDecode), so the
 *         result is byte-for-byte the picture that went in
 *   PNG   the pixels are re-deflated (/FlateDecode), which is lossless too
 *
 * The page takes the image's own aspect ratio, sized so its longer side matches
 * A4's: a sensible print size, and no white bands around the certificate.
 *
 * Accepts baseline JPEG (grayscale or colour) and 8-bit RGB/RGBA PNG — what
 * issuers hand out and what screenshots produce — using nothing but node:zlib:
 * the certificate assets are generated once and committed, so the website build
 * must not gain a dependency for them. */

import { deflateSync } from "node:zlib";
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

import { decodePng } from "./lib/png.mjs";

/** Longer page side in points — A4's long edge. */
const LONG_SIDE_PT = 841.89;
const OUT_DIR = "public/certificates";

const [imagePath, slugArg] = process.argv.slice(2);

if (!imagePath) {
  console.error(
    "Usage: node scripts/certificate-image-to-pdf.mjs <image.png> [slug]",
  );
  process.exit(1);
}

const slug = slugArg ?? basename(imagePath).replace(/\.[^.]+$/, "");
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error(
    `Slug "${slug}" is not usable as a file name — only a-z, 0-9 and hyphens.`,
  );
  process.exit(1);
}

/* Reads a JPEG's frame header: walk the marker segments to the start-of-frame,
   which carries the size and the number of colour components. Everything else
   in the file is left alone, because the file itself becomes the PDF stream. */
function readJpeg(buf) {
  let pos = 2;
  while (pos < buf.length - 1) {
    if (buf[pos] !== 0xff) {
      pos++;
      continue;
    }
    const marker = buf[pos + 1];
    // Markers that stand alone, without a length or a payload.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      pos += 2;
      continue;
    }
    const length = buf.readUInt16BE(pos + 2);
    const isFrame =
      marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isFrame) {
      if (marker !== 0xc0 && marker !== 0xc1) {
        throw new Error(
          "only baseline JPEG is supported (this file is progressive or " +
            "arithmetically coded) — please export it as PNG",
        );
      }
      const precision = buf[pos + 4];
      const components = buf[pos + 9];
      const space = { 1: "/DeviceGray", 3: "/DeviceRGB" }[components];
      if (precision !== 8 || !space) {
        throw new Error(
          `unexpected JPEG format (${precision} bit, ${components} components)` +
            " — please export it as PNG",
        );
      }
      return {
        width: buf.readUInt16BE(pos + 7),
        height: buf.readUInt16BE(pos + 5),
        colorSpace: space,
        filter: "/DCTDecode",
        stream: buf,
      };
    }
    pos += 2 + length;
  }
  throw new Error("no JPEG frame header found");
}

/* Decodes a PNG and re-deflates its pixels for the PDF. The alpha channel is
   dropped if there is one: a certificate is opaque, and keeping it would mean
   writing a separate soft-mask object. */
function readPng(buf) {
  const { width, height, channels, pixels } = decodePng(buf);
  let rgb = pixels;
  if (channels === 4) {
    rgb = Buffer.alloc(width * height * 3);
    for (let i = 0, o = 0; i < pixels.length; i += 4, o += 3) {
      rgb[o] = pixels[i];
      rgb[o + 1] = pixels[i + 1];
      rgb[o + 2] = pixels[i + 2];
    }
  }
  return {
    width,
    height,
    colorSpace: "/DeviceRGB",
    filter: "/FlateDecode",
    stream: deflateSync(rgb, { level: 9 }),
  };
}

const source = readFileSync(imagePath);
const isJpeg = source[0] === 0xff && source[1] === 0xd8;

let width, height, colorSpace, filter, image;
try {
  ({ width, height, colorSpace, filter, stream: image } = isJpeg
    ? readJpeg(source)
    : readPng(source));
} catch (error) {
  console.error(`${basename(imagePath)}: ${error.message}`);
  process.exit(1);
}

const scale = LONG_SIDE_PT / Math.max(width, height);
const pageW = +(width * scale).toFixed(2);
const pageH = +(height * scale).toFixed(2);

/* Draw the image across the whole page: scale it up from the unit square the
   PDF image space uses, then paint it. */
const content = Buffer.from(`q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`, "latin1");

const objects = [
  Buffer.from("<< /Type /Catalog /Pages 2 0 R >>", "latin1"),
  Buffer.from("<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "latin1"),
  Buffer.from(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] ` +
      `/Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
    "latin1",
  ),
  Buffer.concat([
    Buffer.from(
      `<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} ` +
        `/ColorSpace ${colorSpace} /BitsPerComponent 8 /Filter ${filter} ` +
        `/Length ${image.length} >>\nstream\n`,
      "latin1",
    ),
    image,
    Buffer.from("\nendstream", "latin1"),
  ]),
  Buffer.concat([
    Buffer.from(`<< /Length ${content.length} >>\nstream\n`, "latin1"),
    content,
    Buffer.from("\nendstream", "latin1"),
  ]),
];

const parts = [Buffer.from("%PDF-1.7\n%\xe2\xe3\xcf\xd3\n", "latin1")];
const offsets = [];
let position = parts[0].length;

objects.forEach((body, i) => {
  const obj = Buffer.concat([
    Buffer.from(`${i + 1} 0 obj\n`, "latin1"),
    body,
    Buffer.from("\nendobj\n", "latin1"),
  ]);
  offsets.push(position);
  position += obj.length;
  parts.push(obj);
});

const pad = (n) => String(n).padStart(10, "0");
const xref =
  `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n` +
  offsets.map((o) => `${pad(o)} 00000 n \n`).join("");
parts.push(
  Buffer.from(
    `${xref}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n` +
      `startxref\n${position}\n%%EOF\n`,
    "latin1",
  ),
);

const out = `${OUT_DIR}/${slug}.pdf`;
const pdf = Buffer.concat(parts);
writeFileSync(out, pdf);

console.log(
  `${basename(imagePath)}: ${width}×${height} px, ${filter.slice(1)} → ${out} ` +
    `(${pageW}×${pageH} pt, ${Math.round(pdf.length / 1024)} kB)`,
);
console.log("Next: node scripts/certificate-previews.mjs");
