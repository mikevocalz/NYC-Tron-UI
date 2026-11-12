// Minimal PNG codec and resampler with no dependencies, so consumers can run
// the icon tools from a plain Node install. Decodes 8-bit greyscale, grey+alpha,
// RGB, RGBA and palette images (non-interlaced); always encodes 8-bit RGBA.
import { deflateSync, inflateSync } from "node:zlib";

const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

/** @returns {{width:number,height:number,data:Uint8ClampedArray}} RGBA, not premultiplied */
export function decodePng(buffer) {
  if (!buffer.subarray(0, 8).equals(SIGNATURE)) throw new Error("not a PNG file");
  let offset = 8;
  let header;
  let palette;
  let transparency;
  const idat = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        depth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === "PLTE") palette = data;
    else if (type === "tRNS") transparency = data;
    else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    offset += 12 + length;
  }
  if (!header) throw new Error("PNG has no IHDR");
  const { width, height, depth, colorType, interlace } = header;
  if (depth !== 8) throw new Error(`PNG bit depth ${depth} is not supported; export 8-bit`);
  if (interlace) throw new Error("interlaced PNG is not supported; export non-interlaced");
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!channels) throw new Error(`PNG colour type ${colorType} is not supported`);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const pixels = Buffer.alloc(stride * height);
  let previous = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const out = pixels.subarray(y * stride, (y + 1) * stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? out[x - channels] : 0;
      const b = previous[x];
      const c = x >= channels ? previous[x - channels] : 0;
      let value = line[x];
      if (filter === 1) value += a;
      else if (filter === 2) value += b;
      else if (filter === 3) value += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        value += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      } else if (filter !== 0) throw new Error(`unknown PNG filter ${filter}`);
      out[x] = value & 0xff;
    }
    previous = out;
  }
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const s = i * channels;
    let r, g, b, alpha = 255;
    if (colorType === 0) r = g = b = pixels[s];
    else if (colorType === 4) { r = g = b = pixels[s]; alpha = pixels[s + 1]; }
    else if (colorType === 2) { r = pixels[s]; g = pixels[s + 1]; b = pixels[s + 2]; }
    else if (colorType === 6) { r = pixels[s]; g = pixels[s + 1]; b = pixels[s + 2]; alpha = pixels[s + 3]; }
    else {
      const index = pixels[s];
      r = palette[index * 3]; g = palette[index * 3 + 1]; b = palette[index * 3 + 2];
      alpha = transparency && index < transparency.length ? transparency[index] : 255;
    }
    data.set([r, g, b, alpha], i * 4);
  }
  return { width, height, data };
}

export function encodePng({ width, height, data }) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    Buffer.from(data.buffer, data.byteOffset + y * stride, stride).copy(raw, y * (stride + 1) + 1);
  }
  return Buffer.concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

export function createImage(width, height, rgba = [0, 0, 0, 0]) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) data.set(rgba, i * 4);
  return { width, height, data };
}

/** Area-average resample in premultiplied space; correct for downscaling. */
export function resize(image, width, height) {
  const { width: sw, height: sh, data: src } = image;
  const out = new Uint8ClampedArray(width * height * 4);
  const sx = sw / width;
  const sy = sh / height;
  for (let y = 0; y < height; y++) {
    const y0 = y * sy;
    const y1 = y0 + sy;
    for (let x = 0; x < width; x++) {
      const x0 = x * sx;
      const x1 = x0 + sx;
      let r = 0, g = 0, b = 0, a = 0, area = 0;
      for (let yy = Math.floor(y0); yy < Math.ceil(y1); yy++) {
        const wy = Math.min(y1, yy + 1) - Math.max(y0, yy);
        if (wy <= 0 || yy >= sh) continue;
        for (let xx = Math.floor(x0); xx < Math.ceil(x1); xx++) {
          const wx = Math.min(x1, xx + 1) - Math.max(x0, xx);
          if (wx <= 0 || xx >= sw) continue;
          const w = wx * wy;
          const i = (yy * sw + xx) * 4;
          const alpha = src[i + 3] / 255;
          r += src[i] * alpha * w;
          g += src[i + 1] * alpha * w;
          b += src[i + 2] * alpha * w;
          a += alpha * w;
          area += w;
        }
      }
      const o = (y * width + x) * 4;
      if (a > 0) {
        out[o] = Math.round(r / a);
        out[o + 1] = Math.round(g / a);
        out[o + 2] = Math.round(b / a);
      }
      out[o + 3] = Math.round((a / area) * 255);
    }
  }
  return { width, height, data: out };
}

/** Draw `image` scaled to `size` at (x, y) over `canvas` (source-over). */
export function composite(canvas, image, x, y) {
  for (let j = 0; j < image.height; j++) {
    const cy = y + j;
    if (cy < 0 || cy >= canvas.height) continue;
    for (let i = 0; i < image.width; i++) {
      const cx = x + i;
      if (cx < 0 || cx >= canvas.width) continue;
      const s = (j * image.width + i) * 4;
      const d = (cy * canvas.width + cx) * 4;
      const sa = image.data[s + 3] / 255;
      const da = canvas.data[d + 3] / 255;
      const oa = sa + da * (1 - sa);
      if (oa === 0) continue;
      for (let k = 0; k < 3; k++) {
        canvas.data[d + k] = Math.round((image.data[s + k] * sa + canvas.data[d + k] * da * (1 - sa)) / oa);
      }
      canvas.data[d + 3] = Math.round(oa * 255);
    }
  }
  return canvas;
}
