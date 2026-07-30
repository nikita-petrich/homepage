#!/usr/bin/env node
/* Wraps a certificate that only exists as an image — a screenshot of the
   issuer's certificate page, for instance — into a PDF, so it can be served
   from public/zertifikate like every other certificate and gets the same tile
   preview and "open in a new tab" behaviour.
 *
 *   node scripts/certificate-image-to-pdf.mjs <bild.png> <slug>
 *   node scripts/certificate-previews.mjs        # then generate the previews
 *
 * The image is embedded unchanged: its pixels are re-deflated into the PDF as a
 * FlateDecode image, never re-typeset and never lossily re-encoded. The PDF is
 * therefore a container around the original document, not a reconstruction of
 * it. The page takes the image's own aspect ratio, sized so its longer side
 * matches A4's, which keeps the page a sensible print size without adding
 * white bands around the certificate.
 *
 * PNG only (8-bit RGB or RGBA, non-interlaced — what screenshots produce), with
 * nothing but node:zlib: the certificate assets are generated once and
 * committed, so the website build must not gain a dependency for them. */

import { deflateSync } from "node:zlib";
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

import { decodePng } from "./lib/png.mjs";

/** Longer page side in points — A4's long edge. */
const LONG_SIDE_PT = 841.89;
const OUT_DIR = "public/zertifikate";

const [imagePath, slugArg] = process.argv.slice(2);

if (!imagePath) {
  console.error(
    "Aufruf: node scripts/certificate-image-to-pdf.mjs <bild.png> [slug]",
  );
  process.exit(1);
}

const slug = slugArg ?? basename(imagePath).replace(/\.[^.]+$/, "");
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error(
    `Slug „${slug}“ ist nicht als Dateiname geeignet — nur a-z, 0-9 und Bindestriche.`,
  );
  process.exit(1);
}

const { width, height, channels, pixels } = decodePng(readFileSync(imagePath));

/* Drop the alpha channel if there is one: a certificate is opaque, and PDF
   would need a separate soft-mask object for it. */
let rgb = pixels;
if (channels === 4) {
  rgb = Buffer.alloc(width * height * 3);
  for (let i = 0, o = 0; i < pixels.length; i += 4, o += 3) {
    rgb[o] = pixels[i];
    rgb[o + 1] = pixels[i + 1];
    rgb[o + 2] = pixels[i + 2];
  }
}

const image = deflateSync(rgb, { level: 9 });

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
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode ` +
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
  `${basename(imagePath)}: ${width}×${height} px → ${out} ` +
    `(${pageW}×${pageH} pt, ${Math.round(pdf.length / 1024)} kB)`,
);
console.log("Danach: node scripts/certificate-previews.mjs");
