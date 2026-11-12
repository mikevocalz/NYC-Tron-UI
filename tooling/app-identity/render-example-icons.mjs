// Draws the 1024x1024 source icon for each example app. One construction for
// the family: a solid graphite ground (so the edge colour is uniform, which the
// Android adaptive-icon derivation relies on) and one line glyph in the
// example's colour, kept inside the central circle that stays visible under
// every launcher mask. Run: node tooling/app-identity/render-example-icons.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { encodePng } from "./png.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const SIZE = 1024;
const C = SIZE / 2;
const GROUND = [21, 23, 28];
const STEEL = [196, 202, 212];

const hex = (value) => [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));

// Signed distance helpers (negative inside).
const circle = (x, y, cx, cy, r) => Math.hypot(x - cx, y - cy) - r;
function roundedBox(x, y, cx, cy, hw, hh, r) {
  const qx = Math.abs(x - cx) - hw + r;
  const qy = Math.abs(y - cy) - hh + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}
function segment(x, y, ax, ay, bx, by, r) {
  const px = x - ax, py = y - ay, dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - dx * t, py - dy * t) - r;
}
const stroke = (d, width) => Math.abs(d) - width / 2;
// Arc of a ring between start and end angle (radians, 0 = +x, clockwise in screen space).
function arc(x, y, cx, cy, r, width, start, end) {
  let angle = Math.atan2(y - cy, x - cx);
  if (angle < start) angle += Math.PI * 2;
  if (angle >= start && angle <= end) return stroke(circle(x, y, cx, cy, r), width);
  const cap = (a) => Math.hypot(x - (cx + r * Math.cos(a)), y - (cy + r * Math.sin(a))) - width / 2;
  return Math.min(cap(start), cap(end));
}

function paint(layers) {
  const data = new Uint8ClampedArray(SIZE * SIZE * 4);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const px = x + 0.5, py = y + 0.5;
      let colour = [...GROUND];
      for (const { sdf, rgb } of layers) {
        const coverage = Math.max(0, Math.min(1, 0.5 - sdf(px, py)));
        if (coverage > 0) colour = colour.map((c, k) => c + (rgb[k] - c) * coverage);
      }
      data.set([...colour.map(Math.round), 255], (y * SIZE + x) * 4);
    }
  }
  return { width: SIZE, height: SIZE, data };
}

const W = 64; // form weight
const D = 44; // detail weight

const icons = {
  // Instruments: a knob, a 270 degree value arc with its pointer.
  "examples/native-instruments/assets/icon.png": () => {
    const accent = hex("#f2a33a");
    const start = Math.PI * 0.75, end = Math.PI * 2.25;
    const value = start + (end - start) * 0.68;
    return paint([
      { sdf: (x, y) => arc(x, y, C, C, 300, W, start, end), rgb: [58, 62, 72] },
      { sdf: (x, y) => arc(x, y, C, C, 300, W, start, value), rgb: accent },
      { sdf: (x, y) => stroke(circle(x, y, C, C, 150), D), rgb: STEEL },
      { sdf: (x, y) => segment(x, y, C, C, C + 150 * Math.cos(value), C + 150 * Math.sin(value), D / 2), rgb: accent },
    ]);
  },
  // AppKit reference: a window with a leading sidebar.
  "examples/macos-appkit/spark/assets/icon.png": () => {
    const accent = hex("#4cc3d9");
    return paint([
      { sdf: (x, y) => stroke(roundedBox(x, y, C, C, 300, 230, 56), W), rgb: accent },
      { sdf: (x, y) => segment(x, y, C - 120, C - 198, C - 120, C + 198, D / 2), rgb: STEEL },
      { sdf: (x, y) => segment(x, y, C - 236, C - 130, C - 176, C - 130, D / 2), rgb: STEEL },
      { sdf: (x, y) => segment(x, y, C - 236, C - 40, C - 176, C - 40, D / 2), rgb: STEEL },
    ]);
  },
  // Windows reference: a window with trailing caption marks.
  "packages/windows-fluent/rnw-fabric/example/assets/icon.png": () => {
    const accent = hex("#7aa7ff");
    return paint([
      { sdf: (x, y) => stroke(roundedBox(x, y, C, C, 300, 230, 28), W), rgb: accent },
      { sdf: (x, y) => segment(x, y, C - 268, C - 110, C + 268, C - 110, D / 2), rgb: STEEL },
      { sdf: (x, y) => segment(x, y, C + 60, C - 172, C + 100, C - 172, D / 2.2), rgb: STEEL },
      { sdf: (x, y) => segment(x, y, C + 150, C - 172, C + 190, C - 172, D / 2.2), rgb: STEEL },
    ]);
  },
};

for (const [path, draw] of Object.entries(icons)) {
  const target = resolve(root, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, encodePng(draw()));
  console.log(`wrote ${path}`);
}
