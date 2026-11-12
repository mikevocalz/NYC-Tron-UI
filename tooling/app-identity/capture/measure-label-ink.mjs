#!/usr/bin/env node
// Measures launcher label ink in a launcher screenshot. CI only; not shipped.
//
//   node measure-label-ink.mjs --image screen.png --icons icons.json --target <id>
//        --probe "<long name>" --app "<launcher name>" --font-size <units> --out result.json [--crop crop.png]
//
// icons.json: { "unit": "pt"|"dp"|"px", "pxPerUnit": n, "icons": [{ "name", "x", "y", "width", "height" }] }
// in the launcher's unit. Labels are found as the lowest band of near-white
// rows under each icon (run the launcher in dark mode so labels are white).
// The label box is the ink width of the probe's label, which the launcher
// truncates; that is how the boxes in launcher-targets.json were measured.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createImage, decodePng, encodePng } from "../png.mjs";
import { checkLabels } from "../launcher-label-check.mjs";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const image = decodePng(readFileSync(opt("--image")));
const layout = JSON.parse(readFileSync(opt("--icons"), "utf8"));
const k = Number(layout.pxPerUnit);
const fontPx = Number(opt("--font-size")) * k;
const targetId = opt("--target");
const probe = opt("--probe");
const app = opt("--app");
const icons = layout.icons.filter((i) => i.found !== false && i.width > 0);

const at = (x, y) => (y * image.width + x) * 4;
const whiteish = (x, y) => {
  const p = at(x, y);
  const r = image.data[p], g = image.data[p + 1], b = image.data[p + 2];
  return Math.min(r, g, b) >= 185 && Math.max(r, g, b) - Math.min(r, g, b) <= 50;
};

function measure(icon) {
  const cx = (icon.x + icon.width / 2) * k;
  const cy = (icon.y + icon.height / 2) * k;
  const sameRow = icons.filter((o) => o !== icon && Math.abs((o.y + o.height / 2) * k - cy) < (icon.height * k) / 2);
  const gaps = sameRow.map((o) => Math.abs((o.x + o.width / 2) * k - cx) / 2);
  const half = Math.floor(Math.min(...gaps, Math.max((icon.width * k) / 2, 60 * k)));
  const left = Math.max(0, Math.round(cx - half)), right = Math.min(image.width - 1, Math.round(cx + half));
  const top = Math.round((icon.y + Math.min(icon.width, icon.height) * 0.5) * k);
  const bottom = Math.min(image.height - 1, Math.round((icon.y + icon.height) * k + fontPx * 2));
  const rows = [];
  for (let y = top; y <= bottom; y++) {
    let n = 0;
    for (let x = left; x <= right; x++) if (whiteish(x, y)) n++;
    rows.push(n >= 2);
  }
  const clusters = [];
  for (let i = 0; i < rows.length; i++) {
    if (!rows[i]) continue;
    const last = clusters.at(-1);
    if (last && i - last.end <= 2) last.end = i;
    else clusters.push({ start: i, end: i });
  }
  const text = clusters.filter((c) => c.end - c.start + 1 >= fontPx * 0.35 && c.end - c.start + 1 <= fontPx * 1.6);
  const label = text.at(-1);
  if (!label) return { name: icon.name, error: "no label ink found under the icon" };
  let lines = 1;
  for (let i = text.length - 2; i >= 0; i--) {
    if (text[i + 1].start - text[i].end <= fontPx * 0.6) lines++;
    else break;
  }
  let minX = Infinity, maxX = -Infinity;
  for (let y = top + label.start; y <= top + label.end; y++) {
    for (let x = left; x <= right; x++) if (whiteish(x, y)) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
  }
  return {
    name: icon.name,
    inkWidth: Math.round(((maxX - minX + 1) / k) * 10) / 10,
    inkPx: maxX - minX + 1,
    lines,
    rowsPx: [top + label.start, top + label.end],
    bandPx: [left, right],
    clippedAtBand: minX === left || maxX === right,
    tile: { width: icon.width, height: icon.height },
  };
}

const measured = icons.map(measure);
const byName = Object.fromEntries(measured.map((m) => [m.name, m]));
const tiles = icons.map((i) => `${Math.round(i.width * 10) / 10}x${Math.round(i.height * 10) / 10}`);
const result = {
  target: targetId,
  unit: layout.unit,
  pxPerUnit: k,
  commit: process.env.GITHUB_SHA ?? null,
  runId: process.env.GITHUB_RUN_ID ?? null,
  screenshot: { width: image.width, height: image.height },
  labels: measured,
  tilesIdentical: new Set(tiles).size === 1,
  tiles: Object.fromEntries(icons.map((i, n) => [i.name, tiles[n]])),
};
if (probe && byName[probe] && !byName[probe].error) result.boxWidth = byName[probe].inkWidth;
if (app && byName[app] && !byName[app].error) {
  result.app = { name: app, inkWidth: byName[app].inkWidth, lines: byName[app].lines };
  const row = checkLabels([{ source: "capture", platform: layout.platform, label: app }]).find((r) => r.target === targetId);
  if (row?.width !== undefined) result.app.predictedWidth = row.width;
}
const targets = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../launcher-targets.json"), "utf8")).targets;
const recorded = targets.find((t) => t.id === targetId);
if (recorded?.boxWidth !== undefined) result.recordedBoxWidth = recorded.boxWidth;

const crop = opt("--crop");
if (crop && measured.some((m) => !m.error)) {
  const ok = measured.filter((m) => !m.error);
  const x0 = Math.max(0, Math.min(...ok.map((m) => m.bandPx[0])) - 10);
  const x1 = Math.min(image.width - 1, Math.max(...ok.map((m) => m.bandPx[1])) + 10);
  const y0 = Math.max(0, Math.round(Math.min(...icons.map((i) => i.y)) * k) - 10);
  const y1 = Math.min(image.height - 1, Math.max(...ok.map((m) => m.rowsPx[1])) + 10);
  const out = createImage(x1 - x0 + 1, y1 - y0 + 1);
  for (let y = y0; y <= y1; y++) out.data.set(image.data.subarray(at(x0, y), at(x1, y) + 4), (y - y0) * out.width * 4);
  writeFileSync(crop, encodePng(out));
}
writeFileSync(opt("--out"), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
if (measured.some((m) => m.error)) process.exitCode = 1;
