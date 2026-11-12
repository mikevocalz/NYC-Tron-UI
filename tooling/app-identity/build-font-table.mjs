#!/usr/bin/env node
// Writes an advance-width table (font units per codepoint, Basic Latin through
// Latin Extended-B plus General Punctuation) for a font whose licence allows
// redistribution, so the launcher check can measure on machines without the font.
// Usage: node build-font-table.mjs <font.ttf> <out.json> --source "<where it came from>" --license "<licence>"
import { writeFileSync } from "node:fs";
import { loadFont } from "./font-metrics.mjs";

const [fontPath, outPath, ...rest] = process.argv.slice(2);
const flag = (name) => {
  const i = rest.indexOf(name);
  return i >= 0 ? rest[i + 1] : undefined;
};
if (!fontPath || !outPath || !flag("--source") || !flag("--license")) {
  console.error('usage: build-font-table.mjs <font> <out.json> --source "<origin>" --license "<licence>"');
  process.exit(2);
}
const font = loadFont(fontPath);
const advances = {};
const ranges = [[0x20, 0x7e], [0xa0, 0x24f], [0x2010, 0x2027]];
for (const [first, last] of ranges) {
  for (let c = first; c <= last; c++) if (font.hasGlyph(c)) advances[c.toString(16)] = font.advanceOf(c);
}
writeFileSync(
  outPath,
  JSON.stringify(
    {
      family: font.family,
      postscriptName: font.postscriptName,
      unitsPerEm: font.unitsPerEm,
      fallbackAdvance: font.advanceOf(0x6d), // 'm' for codepoints outside the table
      source: flag("--source"),
      license: flag("--license"),
      advances,
    },
    null,
    1,
  ) + "\n",
);
console.log(`wrote ${Object.keys(advances).length} advances for ${font.postscriptName} to ${outPath}`);
