import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { deriveIcons, inspectSource } from "../app-identity/derive-icons.mjs";
import { checkLabels, describeConfig, run } from "../app-identity/launcher-label-check.mjs";
import { createImage, decodePng, encodePng, resize } from "../app-identity/png.mjs";

const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));
// Each example derives only the formats of the platforms it ships on.
const examples = {
  "examples/native-instruments": ["android"],
  "examples/macos-appkit/spark": ["macos"],
  "packages/windows-fluent/rnw-fabric/example": ["windows"],
};
const configs = [
  "examples/native-instruments/app.json",
  "examples/macos-appkit/spark/desktop.config.json",
  "packages/windows-fluent/rnw-fabric/example/app.json",
];
const targets = JSON.parse(readFileSync(join(root, "tooling/app-identity/launcher-targets.json"), "utf8")).targets;

function listFiles(dir, base = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listFiles(join(dir, e.name), base) : [relative(base, join(dir, e.name)).split("\\").join("/")],
  );
}

// ICNS and ICO hold PNGs; compare their entries' decoded pixels, as for plain PNGs.
function containerImages(file, buffer) {
  const images = [];
  if (file.endsWith(".icns")) {
    assert.equal(buffer.toString("ascii", 0, 4), "icns", file);
    assert.equal(buffer.readUInt32BE(4), buffer.length, file);
    for (let at = 8; at < buffer.length; ) {
      const length = buffer.readUInt32BE(at + 4);
      images.push([buffer.toString("ascii", at, at + 4), decodePng(buffer.subarray(at + 8, at + length))]);
      at += length;
    }
  } else {
    assert.equal(buffer.readUInt16LE(2), 1, file);
    const count = buffer.readUInt16LE(4);
    for (let i = 0; i < count; i++) {
      const entry = 6 + i * 16;
      const length = buffer.readUInt32LE(entry + 8);
      const offset = buffer.readUInt32LE(entry + 12);
      images.push([`${buffer[entry] || 256}`, decodePng(buffer.subarray(offset, offset + length))]);
    }
  }
  return images;
}

const samePixels = (a, b) => a.width === b.width && a.height === b.height && Buffer.from(a.data).equals(Buffer.from(b.data));

test("PNG codec round-trips RGBA and downsamples by area", () => {
  const image = createImage(4, 4, [10, 20, 30, 255]);
  image.data.set([200, 100, 50, 128], 0);
  const back = decodePng(encodePng(image));
  assert.deepEqual(Array.from(back.data), Array.from(image.data));
  const half = resize(createImage(4, 4, [255, 0, 0, 255]), 2, 2);
  assert.deepEqual(Array.from(half.data.subarray(0, 4)), [255, 0, 0, 255]);
});

for (const [example, formats] of Object.entries(examples)) {
  test(`${example}: one 1024 px source with a glyph inside the Android safe zone`, () => {
    const source = decodePng(readFileSync(join(root, example, "assets/icon.png")));
    const report = inspectSource(source);
    assert.deepEqual(report.problems, []);
    assert.equal(source.width, 1024);
    assert.ok(report.glyphReachPx < report.safeRadiusPx);
  });

  test(`${example}: committed derived icons match a fresh derivation`, () => {
    const out = mkdtempSync(join(tmpdir(), "tron-icons-"));
    const result = deriveIcons(join(root, example, "assets/icon.png"), out, { formats });
    assert.deepEqual(result.problems, []);
    const committed = join(root, example, "assets/icon");
    assert.deepEqual(listFiles(committed).sort(), [...result.files].sort());
    // Compare decoded pixels, not bytes: deflate output can differ between zlib builds.
    for (const file of result.files) {
      const fresh = readFileSync(join(out, file));
      const kept = readFileSync(join(committed, file));
      if (file.endsWith(".png")) {
        assert.ok(samePixels(decodePng(fresh), decodePng(kept)), `${file} is stale; run derive-icons.mjs`);
        continue;
      }
      const freshImages = containerImages(file, fresh);
      const keptImages = containerImages(file, kept);
      assert.deepEqual(keptImages.map(([key]) => key), freshImages.map(([key]) => key), `${file} entries differ`);
      freshImages.forEach(([key, image], i) => assert.ok(samePixels(image, keptImages[i][1]), `${file} ${key} is stale; run derive-icons.mjs`));
    }
  });
}

test("derive-icons writes valid ICNS and ICO containers", () => {
  const icnsFile = "examples/macos-appkit/spark/assets/icon/macos/AppIcon.icns";
  const icns = containerImages(icnsFile, readFileSync(join(root, icnsFile)));
  assert.equal(icns.length, 11);
  assert.deepEqual(icns.find(([type]) => type === "ic10")[1].width, 1024);
  const icoFile = "packages/windows-fluent/rnw-fabric/example/assets/icon/windows/app.ico";
  const ico = containerImages(icoFile, readFileSync(join(root, icoFile)));
  assert.deepEqual(ico.map(([size, image]) => [size, image.width]), [["16", 16], ["24", 24], ["32", 32], ["48", 48], ["64", 64], ["256", 256]]);
});

test("the staleness check catches a changed ICNS or ICO body", () => {
  const icoFile = "packages/windows-fluent/rnw-fabric/example/assets/icon/windows/app.ico";
  const bytes = Buffer.from(readFileSync(join(root, icoFile)));
  const entry = 6; // first directory entry, the 16 px image
  const offset = bytes.readUInt32LE(entry + 12);
  const image = decodePng(bytes.subarray(offset, offset + bytes.readUInt32LE(entry + 8)));
  image.data[0] ^= 0xff;
  const changed = encodePng(image);
  const patched = Buffer.concat([bytes.subarray(0, offset), changed, bytes.subarray(offset + bytes.readUInt32LE(entry + 8))]);
  patched.writeUInt32LE(changed.length, entry + 8);
  for (let i = 1; i < 6; i++) patched.writeUInt32LE(bytes.readUInt32LE(6 + i * 16 + 12) + changed.length - bytes.readUInt32LE(entry + 8), 6 + i * 16 + 12);
  const kept = containerImages(icoFile, bytes);
  const edited = containerImages(icoFile, patched);
  assert.ok(!samePixels(kept[0][1], edited[0][1]));
  assert.ok(kept.slice(1).every(([, img], i) => samePixels(img, edited[i + 1][1])));
});

test("derive-icons writes only the requested formats and rejects an unknown one", () => {
  const out = mkdtempSync(join(tmpdir(), "tron-icons-formats-"));
  const result = deriveIcons(join(root, "examples/native-instruments/assets/icon.png"), out, { formats: ["android"] });
  assert.deepEqual(result.files.sort(), ["android/adaptive-foreground.png", "android/adaptive-monochrome.png"]);
  const bad = deriveIcons(join(root, "examples/native-instruments/assets/icon.png"), out, { formats: ["tvos"] });
  assert.match(bad.problems.join("\n"), /unknown or empty --formats "tvos"/);
});

test("derive-icons refuses a glyph outside the Android safe zone and says by how much", () => {
  const image = createImage(1024, 1024, [21, 23, 28, 255]);
  for (let y = 0; y < 40; y++) for (let x = 492; x < 532; x++) image.data.set([255, 255, 255, 255], (y * 1024 + x) * 4);
  const dir = mkdtempSync(join(tmpdir(), "tron-icon-bad-"));
  writeFileSync(join(dir, "icon.png"), encodePng(image));
  const result = deriveIcons(join(dir, "icon.png"), join(dir, "out"));
  assert.equal(result.files.length, 0);
  assert.match(result.problems.join("\n"), /safe zone ends at 469\.3 px \(over by \d+\.\d px\)/);
});

test("derive-icons runs as a CLI when reached through a symlinked path", { skip: process.platform === "win32" && "symlinks need elevation on Windows" }, () => {
  const dir = mkdtempSync(join(tmpdir(), "tron-icon-link-"));
  symlinkSync(join(root, "tooling"), join(dir, "tooling"), "dir");
  const out = join(dir, "out");
  const result = spawnSync(process.execPath, [join(dir, "tooling/app-identity/derive-icons.mjs"), join(root, "examples/native-instruments/assets/icon.png"), "--out", out], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /wrote 28 files/);
  assert.equal(listFiles(out).length, 28);
});

test("every launcher target is either measured with a box, font and evidence or NOT RUN with a reason", () => {
  for (const t of targets) {
    if (t.status === "measured") {
      assert.ok(t.boxWidth > 0 && t.lines >= 1 && t.font.size > 0 && t.font.unit && t.evidence, t.id);
    } else {
      assert.equal(t.status, "not-run", t.id);
      assert.ok(t.reason?.length > 20, t.id);
    }
  }
});

test("every example declares a full and a launcher name and passes the check", () => {
  for (const file of configs) {
    const config = describeConfig(join(root, file));
    assert.ok(config.identity?.fullName && config.identity?.launcherName, file);
    assert.notEqual(config.identity.fullName, config.identity.launcherName, file);
  }
  const { code, output } = run(configs.map((c) => join(root, c)));
  assert.equal(code, 0, output);
  assert.doesNotMatch(output, /OVERFLOW|IDENTITY/);
});

test("the check fails on a long name, reports the measured overflow and keeps the whole name", () => {
  const name = "NYC-Tron Instruments Demo";
  const rows = checkLabels([{ source: "test", platform: "android", label: name }]);
  const row = rows.find((r) => r.target === "android-launcher3");
  assert.equal(row.status, "OVERFLOW");
  assert.equal(row.label, name);
  assert.ok(row.overflow > 100, `overflow ${row.overflow}`);
  const { code, output } = run(["--name", name, "--platforms", "android"]);
  assert.equal(code, 1);
  assert.match(output, /OVERFLOW\s+android-launcher3\s+"NYC-Tron Instruments Demo"\s+179\.1 dp in a 63\.6 dp box: over by 115\.5 dp/);
});

test("the check fails when a config's launcher label disagrees with its declared launcher name", () => {
  const dir = mkdtempSync(join(tmpdir(), "tron-identity-"));
  const file = join(dir, "app.json");
  writeFileSync(file, JSON.stringify({ expo: { name: "Tron Lab", platforms: ["android"], extra: { appIdentity: { fullName: "X Y", launcherName: "Lab" } } } }));
  const { code, output } = run([file]);
  assert.equal(code, 1);
  assert.match(output, /android launcher label is "Tron Lab" but appIdentity.launcherName is "Lab"/);
});

test("a config with no launcher label is an identity error, reported once", () => {
  const dir = mkdtempSync(join(tmpdir(), "tron-label-none-"));
  const config = join(dir, "app.json");
  writeFileSync(config, JSON.stringify({ expo: { slug: "x", platforms: ["android"], extra: { appIdentity: { fullName: "X App", launcherName: "X" } } } }));
  const { code, output } = run([config]);
  assert.equal(code, 1);
  assert.match(output, /no android launcher label in the config/);
  assert.doesNotMatch(output, /undefined/);
});

test("a character the font table lacks is NOT RUN, never a pass", () => {
  const row = checkLabels([{ source: "test", platform: "android", label: "Tron \u6f22" }]).find((r) => r.target === "android-launcher3");
  assert.equal(row.status, "NOT RUN");
  assert.match(row.reason, /no metrics/);
  const { code } = run(["--name", "Tron \u6f22", "--platforms", "android", "--strict"]);
  assert.equal(code, 3);
});

test("an empty or whitespace-only name fails, never passes", () => {
  for (const name of ["", "   "]) {
    const rows = checkLabels([{ source: "test", platform: "ios", label: name }, { source: "test", platform: "android", label: name }]);
    assert.ok(rows.every((r) => r.status === "FAIL"), JSON.stringify(rows));
    const { code, output } = run(["--name", name]);
    assert.equal(code, 1, output);
    assert.match(output, /empty or only whitespace/);
  }
});

test("on Apple targets a name that needs font fallback is NOT RUN, never a pass", { skip: process.platform !== "darwin" && "AppKit needs macOS" }, () => {
  for (const name of ["Tron \u6771\u4eac", "Tron \u{1F680}"]) {
    const row = checkLabels([{ source: "test", platform: "ios", label: name }]).find((r) => r.target === "ios-home");
    assert.equal(row.status, "NOT RUN", name);
    assert.match(row.reason, /system font has no glyph/);
  }
});

test("Apple targets are measured with AppKit on macOS and reported NOT RUN elsewhere", () => {
  const [row] = checkLabels([{ source: "test", platform: "ios", label: "Settings" }]).filter((r) => r.target === "ios-home");
  if (process.platform === "darwin") {
    assert.equal(row.status, "PASS");
    // 46.7 pt of ink on the iOS 27.1 simulator; allow for a macOS font update on the runner.
    assert.ok(Math.abs(row.width - 46.8) <= 0.5, `Settings measured ${row.width} pt`);
  } else {
    assert.equal(row.status, "NOT RUN");
    assert.match(row.reason, /needs macOS/);
  }
});

test("the macOS label of a Spark config is CFBundleDisplayName, else the bundle file name, never CFBundleName", () => {
  const dir = mkdtempSync(join(tmpdir(), "tron-spark-label-"));
  const write = (infoPlist) => {
    writeFileSync(join(dir, "desktop.config.json"), JSON.stringify({ name: "NYCTronSparkThing", projectId: "X", platforms: ["macos"], macos: { bundleIdentifier: "org.x.y", infoPlist } }));
    writeFileSync(join(dir, "app.json"), JSON.stringify({ expo: { extra: { appIdentity: { fullName: "NYC-Tron Spark Thing", launcherName: "Tron Spark" } } } }));
    return describeConfig(join(dir, "desktop.config.json"));
  };
  assert.equal(write({ CFBundleName: "Tron Spark" }).labels.macos, "NYCTronSparkThing");
  const { code, output } = run([join(dir, "desktop.config.json")]);
  assert.equal(write({ CFBundleName: "Other", CFBundleDisplayName: "Tron Spark" }).labels.macos, "Tron Spark");
  assert.equal(code, 1);
  assert.match(output, /macos launcher label is "NYCTronSparkThing" but appIdentity.launcherName is "Tron Spark"/);
});
