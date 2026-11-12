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
const examples = [
  "examples/native-instruments",
  "examples/macos-appkit/spark",
  "packages/windows-fluent/rnw-fabric/example",
];
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

test("PNG codec round-trips RGBA and downsamples by area", () => {
  const image = createImage(4, 4, [10, 20, 30, 255]);
  image.data.set([200, 100, 50, 128], 0);
  const back = decodePng(encodePng(image));
  assert.deepEqual(Array.from(back.data), Array.from(image.data));
  const half = resize(createImage(4, 4, [255, 0, 0, 255]), 2, 2);
  assert.deepEqual(Array.from(half.data.subarray(0, 4)), [255, 0, 0, 255]);
});

for (const example of examples) {
  test(`${example}: one 1024 px source with a glyph inside the Android safe zone`, () => {
    const source = decodePng(readFileSync(join(root, example, "assets/icon.png")));
    const report = inspectSource(source);
    assert.deepEqual(report.problems, []);
    assert.equal(source.width, 1024);
    assert.ok(report.glyphReachPx < report.safeRadiusPx);
  });

  test(`${example}: committed derived icons match a fresh derivation`, () => {
    const out = mkdtempSync(join(tmpdir(), "tron-icons-"));
    const result = deriveIcons(join(root, example, "assets/icon.png"), out);
    assert.deepEqual(result.problems, []);
    const committed = join(root, example, "assets/icon");
    assert.deepEqual(listFiles(committed).sort(), [...result.files].sort());
    // Compare decoded pixels, not bytes: deflate output can differ between zlib builds.
    for (const file of result.files.filter((f) => f.endsWith(".png"))) {
      const fresh = decodePng(readFileSync(join(out, file)));
      const kept = decodePng(readFileSync(join(committed, file)));
      assert.ok(fresh.width === kept.width && Buffer.from(fresh.data).equals(Buffer.from(kept.data)), `${file} is stale; run derive-icons.mjs`);
    }
  });
}

test("derive-icons writes valid ICNS and ICO containers", () => {
  const icns = readFileSync(join(root, "examples/macos-appkit/spark/assets/icon/macos/AppIcon.icns"));
  assert.equal(icns.toString("ascii", 0, 4), "icns");
  assert.equal(icns.readUInt32BE(4), icns.length);
  const ico = readFileSync(join(root, "packages/windows-fluent/rnw-fabric/example/assets/icon/windows/app.ico"));
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 6);
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
