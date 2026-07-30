/* Minimal PNG reader shared by the certificate scripts: enough to read what
   pdftoppm writes and what a browser screenshot produces, with nothing but
   node:zlib — the certificate assets are generated once and committed, so the
   website build must not gain a dependency for them. */

import { inflateSync } from "node:zlib";

/* Minimal PNG reader for 8-bit RGB/RGBA images (what pdftoppm writes): parse
   IHDR, inflate the concatenated IDAT stream and undo the per-scanline
   filters. Returns the raw pixel rows. */
export function decodePng(buf) {
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
