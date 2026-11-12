#!/usr/bin/env node
// Derives every launcher icon format an NYC-Tron example needs from one
// 1024x1024 square PNG with a solid ground:
//   android/adaptive-foreground.png  the source at 72/108 of a transparent
//                                    108 dp canvas (Expo's foregroundImage)
//   android/adaptive-monochrome.png  glyph only, white, for themed icons
//   web/favicon.png                  48 px (Expo web.favicon)
//   macos/AppIcon.icns               824 px rounded tile on the 1024 grid
//   windows/app.ico                  16-256 px PNG-in-ICO
//   windows/Assets/*.png             MSIX tile and logo sizes (RNW template names)
// It also refuses a source whose glyph leaves the Android safe zone (the
// 66 dp circle of the 108 dp canvas), reporting how far it reaches.
//
// Usage: node derive-icons.mjs <icon.png> --out <dir> [--formats android,web,macos,windows] [--json]
// --formats limits the output to the platforms the app ships on (default: all).
import { mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { composite, createImage, decodePng, encodePng, resize } from "./png.mjs";

export const ANDROID = { canvasDp: 108, viewportDp: 72, safeDp: 66 };
export const FORMATS = ["android", "web", "macos", "windows"];
const TOLERANCE = 10;

const toHex = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
const pixel = (image, x, y) => Array.from(image.data.subarray((y * image.width + x) * 4, (y * image.width + x) * 4 + 4));
const differs = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]), Math.abs(a[3] - b[3]));

export function inspectSource(image) {
  const problems = [];
  if (image.width !== image.height) problems.push(`source is ${image.width}x${image.height}; it must be square`);
  if (image.width !== 1024) problems.push(`source is ${image.width} px; it must be 1024 px`);
  const n = image.width - 1;
  const corners = [pixel(image, 0, 0), pixel(image, n, 0), pixel(image, 0, n), pixel(image, n, n)];
  const ground = corners[0];
  if (ground[3] !== 255) problems.push("source corners are transparent; the ground must be opaque");
  if (corners.some((c) => differs(c, ground) > TOLERANCE)) problems.push("source corners differ; the ground must be one solid colour");
  // Android safe zone, measured in source pixels: the source fills the 72 dp
  // viewport, so the 66 dp safe circle has radius (66/72)/2 of the side.
  const safeRadius = (ANDROID.safeDp / ANDROID.viewportDp / 2) * image.width;
  const centre = image.width / 2;
  let reach = 0;
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      if (differs(pixel(image, x, y), ground) <= TOLERANCE) continue;
      reach = Math.max(reach, Math.hypot(x + 0.5 - centre, y + 0.5 - centre));
    }
  }
  if (reach > safeRadius) {
    problems.push(
      `glyph reaches ${reach.toFixed(1)} px from the centre; the Android safe zone ends at ${safeRadius.toFixed(1)} px ` +
        `(over by ${(reach - safeRadius).toFixed(1)} px)`,
    );
  }
  return { ground: toHex(ground.slice(0, 3)), groundRgba: ground, glyphReachPx: Number(reach.toFixed(1)), safeRadiusPx: Number(safeRadius.toFixed(1)), problems };
}

function roundedMask(image, radius) {
  const out = { width: image.width, height: image.height, data: new Uint8ClampedArray(image.data) };
  const h = image.width / 2;
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const qx = Math.abs(x + 0.5 - h) - h + radius;
      const qy = Math.abs(y + 0.5 - h) - h + radius;
      const d = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
      const coverage = Math.max(0, Math.min(1, 0.5 - d));
      out.data[(y * image.width + x) * 4 + 3] *= coverage;
    }
  }
  return out;
}

function onCanvas(source, canvasW, canvasH, size, fill = [0, 0, 0, 0]) {
  const canvas = createImage(canvasW, canvasH, fill);
  return composite(canvas, resize(source, size, size), Math.round((canvasW - size) / 2), Math.round((canvasH - size) / 2));
}

function icns(entries) {
  const parts = entries.map(([type, png]) => {
    const head = Buffer.alloc(8);
    head.write(type, 0, "ascii");
    head.writeUInt32BE(png.length + 8, 4);
    return Buffer.concat([head, png]);
  });
  const head = Buffer.alloc(8);
  head.write("icns", 0, "ascii");
  head.writeUInt32BE(8 + parts.reduce((n, p) => n + p.length, 0), 4);
  return Buffer.concat([head, ...parts]);
}

function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const dir = images.map(([size, png]) => {
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size;
    entry[1] = size >= 256 ? 0 : size;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...dir, ...images.map(([, png]) => png)]);
}

export function deriveIcons(sourcePath, outDir, { formats = FORMATS } = {}) {
  const unknown = formats.filter((f) => !FORMATS.includes(f));
  if (unknown.length || !formats.length) {
    return { problems: [`unknown or empty --formats ${JSON.stringify(unknown.join(","))}; use ${FORMATS.join(",")}`], files: [] };
  }
  const source = decodePng(readFileSync(sourcePath));
  const report = inspectSource(source);
  if (report.problems.length) return { ...report, files: [] };
  const files = [];
  const write = (relative, buffer) => {
    const target = join(outDir, relative);
    mkdirSync(join(target, ".."), { recursive: true });
    writeFileSync(target, buffer);
    files.push(relative);
  };
  const png = (image) => encodePng(image);

  // Android adaptive icon: foreground fills the 72 dp viewport of the 108 dp canvas.
  if (formats.includes("android")) {
    const fgSize = Math.round((ANDROID.viewportDp / ANDROID.canvasDp) * 1024);
    const foreground = onCanvas(source, 1024, 1024, fgSize);
    write("android/adaptive-foreground.png", png(foreground));
    const mono = createImage(1024, 1024);
    for (let i = 0; i < 1024 * 1024; i++) {
      const p = Array.from(foreground.data.subarray(i * 4, i * 4 + 4));
      if (p[3] === 0) continue;
      const delta = differs([p[0], p[1], p[2], 255], report.groundRgba);
      // Strokes 160 or more from the ground are solid; a dim stroke (the knob's
      // unfilled track, 91 from the ground) stays dim in the themed icon.
      const alpha = Math.max(0, Math.min(1, (delta - 40) / 120)) * (p[3] / 255);
      mono.data.set([255, 255, 255, Math.round(alpha * 255)], i * 4);
    }
    write("android/adaptive-monochrome.png", png(mono));
  }

  if (formats.includes("web")) write("web/favicon.png", png(resize(source, 48, 48)));

  // macOS: 824 px tile with a 185 px corner on the 1024 grid (Apple's macOS app icon template).
  if (formats.includes("macos")) {
    const tile = roundedMask(resize(source, 824, 824), 185);
    const mac = composite(createImage(1024, 1024), tile, 100, 100);
    const macAt = (size) => png(resize(mac, size, size));
    write("macos/AppIcon.icns", icns([
      ["icp4", macAt(16)], ["icp5", macAt(32)], ["icp6", macAt(64)], ["ic07", macAt(128)],
      ["ic08", macAt(256)], ["ic09", macAt(512)], ["ic10", macAt(1024)],
      ["ic11", macAt(32)], ["ic12", macAt(64)], ["ic13", macAt(256)], ["ic14", macAt(512)],
    ]));
  }

  // Windows: ICO for the executable and the MSIX asset names the RNW cpp-app template uses.
  if (formats.includes("windows")) {
    write("windows/app.ico", ico([16, 24, 32, 48, 64, 256].map((s) => [s, png(resize(source, s, s))])));
    const ground = report.groundRgba;
    const square = (s) => png(resize(source, s, s));
    for (const scale of [100, 125, 150, 200, 400]) {
      write(`windows/Assets/Square44x44Logo.scale-${scale}.png`, square(Math.round(44 * scale / 100)));
      write(`windows/Assets/Square150x150Logo.scale-${scale}.png`, square(Math.round(150 * scale / 100)));
      const w = Math.round(310 * scale / 100), h = Math.round(150 * scale / 100);
      write(`windows/Assets/Wide310x150Logo.scale-${scale}.png`, png(onCanvas(source, w, h, h, ground)));
    }
    for (const size of [16, 24, 32, 48, 256]) {
      write(`windows/Assets/Square44x44Logo.targetsize-${size}_altform-unplated.png`, square(size));
    }
    write("windows/Assets/StoreLogo.png", square(50));
    write("windows/Assets/LockScreenLogo.scale-200.png", square(48));
    write("windows/Assets/SplashScreen.scale-200.png", png(onCanvas(source, 1240, 600, 600, ground)));
  }
  return { ...report, files };
}

// Compare real paths: on macOS /tmp is a symlink to /private/tmp, and a CLI run
// through a symlinked path would otherwise exit 0 having written nothing.
const isEntry = (arg) => {
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(resolve(arg));
  } catch {
    return false;
  }
};
if (process.argv[1] && isEntry(process.argv[1])) {
  const args = process.argv.slice(2);
  const source = args.find((a) => !a.startsWith("--"));
  const outIndex = args.indexOf("--out");
  if (!source || outIndex < 0) {
    console.error("usage: derive-icons.mjs <icon.png> --out <dir> [--formats android,web,macos,windows] [--json]");
    process.exit(2);
  }
  const formatsIndex = args.indexOf("--formats");
  const formats = formatsIndex >= 0 ? (args[formatsIndex + 1] ?? "").split(",").filter(Boolean) : FORMATS;
  const result = deriveIcons(source, args[outIndex + 1], { formats });
  if (args.includes("--json")) console.log(JSON.stringify(result, null, 2));
  else {
    if (result.ground) console.log(`ground ${result.ground}; glyph reach ${result.glyphReachPx} px of ${result.safeRadiusPx} px safe radius`);
    for (const problem of result.problems) console.error(`FAIL ${problem}`);
    if (!result.problems.length) console.log(`wrote ${result.files.length} files to ${args[outIndex + 1]}`);
  }
  process.exit(result.problems.length ? 1 : 0);
}
