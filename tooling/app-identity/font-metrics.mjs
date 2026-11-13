// Reads horizontal advance widths from a TrueType/OpenType font (.ttf, .otf,
// .ttc) with no dependencies, and measures a string's advance width. Kerning
// and shaping are not applied, and a variable font is read at its default
// instance. Use a static face (as the committed Roboto table does).
import { readFileSync } from "node:fs";

function tables(buffer, offset) {
  const count = buffer.readUInt16BE(offset + 4);
  const map = {};
  for (let i = 0; i < count; i++) {
    const at = offset + 12 + i * 16;
    map[buffer.toString("ascii", at, at + 4)] = buffer.readUInt32BE(at + 8);
  }
  return map;
}

function readCmap(buffer, start) {
  const count = buffer.readUInt16BE(start + 2);
  let best;
  for (let i = 0; i < count; i++) {
    const platform = buffer.readUInt16BE(start + 4 + i * 8);
    const encoding = buffer.readUInt16BE(start + 6 + i * 8);
    const offset = start + buffer.readUInt32BE(start + 8 + i * 8);
    const format = buffer.readUInt16BE(offset);
    const unicode = platform === 0 || (platform === 3 && (encoding === 1 || encoding === 10));
    if (!unicode || (format !== 4 && format !== 12)) continue;
    if (!best || format === 12) best = { format, offset };
  }
  if (!best) throw new Error("font has no Unicode cmap (format 4 or 12)");
  const map = new Map();
  const { format, offset } = best;
  if (format === 12) {
    const groups = buffer.readUInt32BE(offset + 12);
    for (let g = 0; g < groups; g++) {
      const at = offset + 16 + g * 12;
      const first = buffer.readUInt32BE(at);
      const last = buffer.readUInt32BE(at + 4);
      const glyph = buffer.readUInt32BE(at + 8);
      for (let c = first; c <= last && c <= 0x2fff; c++) map.set(c, glyph + c - first);
    }
  } else {
    const segments = buffer.readUInt16BE(offset + 6) / 2;
    const ends = offset + 14;
    const starts = ends + segments * 2 + 2;
    const deltas = starts + segments * 2;
    const ranges = deltas + segments * 2;
    for (let s = 0; s < segments; s++) {
      const end = buffer.readUInt16BE(ends + s * 2);
      const first = buffer.readUInt16BE(starts + s * 2);
      const delta = buffer.readInt16BE(deltas + s * 2);
      const range = buffer.readUInt16BE(ranges + s * 2);
      for (let c = first; c <= end && c !== 0xffff; c++) {
        let glyph;
        if (range === 0) glyph = (c + delta) & 0xffff;
        else {
          const at = ranges + s * 2 + range + (c - first) * 2;
          glyph = buffer.readUInt16BE(at);
          if (glyph !== 0) glyph = (glyph + delta) & 0xffff;
        }
        map.set(c, glyph);
      }
    }
  }
  return map;
}

/**
 * @param {string} path font file
 * @param {{postscriptName?: string, index?: number}} [select] face in a collection
 */
export function loadFont(path, select = {}) {
  const buffer = readFileSync(path);
  const tag = buffer.toString("ascii", 0, 4);
  let offsets = [0];
  if (tag === "ttcf") {
    const n = buffer.readUInt32BE(8);
    offsets = Array.from({ length: n }, (_, i) => buffer.readUInt32BE(12 + i * 4));
  }
  const faces = offsets.map((offset) => {
    const t = tables(buffer, offset);
    return { t, name: readName(buffer, t.name) };
  });
  let face = faces[select.index ?? 0];
  if (select.postscriptName) {
    face = faces.find((f) => f.name.postscript === select.postscriptName);
    if (!face) throw new Error(`${path} has no face named ${select.postscriptName}`);
  }
  const { t } = face;
  const unitsPerEm = buffer.readUInt16BE(t.head + 18);
  const metrics = buffer.readUInt16BE(t.hhea + 34);
  const advances = [];
  for (let g = 0; g < metrics; g++) advances.push(buffer.readUInt16BE(t.hmtx + g * 4));
  const cmap = readCmap(buffer, t.cmap);
  const advanceOf = (codepoint) => {
    const glyph = cmap.get(codepoint) ?? 0;
    return advances[Math.min(glyph, advances.length - 1)];
  };
  return {
    family: face.name.family,
    postscriptName: face.name.postscript,
    unitsPerEm,
    hasGlyph: (codepoint) => (cmap.get(codepoint) ?? 0) !== 0,
    advanceOf,
    /** Advance width of `text` at `size` (same unit as size: pt, dp or px). */
    measure(text, size) {
      let units = 0;
      for (const char of text) units += advanceOf(char.codePointAt(0));
      return (units / unitsPerEm) * size;
    },
  };
}

function readName(buffer, start) {
  const count = buffer.readUInt16BE(start + 2);
  const storage = start + buffer.readUInt16BE(start + 4);
  const out = {};
  for (let i = 0; i < count; i++) {
    const at = start + 6 + i * 12;
    const platform = buffer.readUInt16BE(at);
    const id = buffer.readUInt16BE(at + 6);
    const length = buffer.readUInt16BE(at + 8);
    const offset = storage + buffer.readUInt16BE(at + 10);
    const key = id === 1 ? "family" : id === 6 ? "postscript" : null;
    if (!key || out[key]) continue;
    const raw = buffer.subarray(offset, offset + length);
    out[key] = platform === 1 ? raw.toString("latin1") : Buffer.from(raw).swap16().toString("utf16le");
  }
  return out;
}
