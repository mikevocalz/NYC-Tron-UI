import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const packageDir = join(root, "packages/app-identity");
const manifest = JSON.parse(readFileSync(join(packageDir, "package.json"), "utf8"));

function build(t) {
  const out = mkdtempSync(join(tmpdir(), "tron-app-identity-dist-"));
  t.after(() => rmSync(out, { recursive: true, force: true }));
  const result = spawnSync(process.execPath, [join(packageDir, "scripts/build.mjs"), out], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return out;
}

test("the archive ships both bins, the targets, the Roboto table and its own notice", (t) => {
  assert.deepEqual(Object.keys(manifest.bin).sort(), ["nyc-tron-derive-icons", "nyc-tron-launcher-check"]);
  assert.ok(manifest.files.includes("THIRD_PARTY_NOTICES.md") && manifest.files.includes("licenses"));
  assert.ok(existsSync(join(packageDir, "THIRD_PARTY_NOTICES.md")));
  assert.ok(existsSync(join(packageDir, "licenses/Roboto-Apache-2.0.txt")));
  const out = build(t);
  for (const bin of Object.values(manifest.bin)) {
    const file = join(out, bin.replace("./dist/", ""));
    assert.ok(existsSync(file), bin);
    assert.match(readFileSync(file, "utf8"), /^#!\/usr\/bin\/env node\r?\n/);
    if (process.platform !== "win32") assert.ok(statSync(file).mode & 0o111, `${bin} is not executable`);
  }
  for (const file of ["launcher-targets.json", "fonts/roboto-static-regular.json", "index.js", "index.d.ts"]) assert.ok(existsSync(join(out, file)), file);
  assert.doesNotMatch(readFileSync(join(out, "derive-icons.js"), "utf8"), /\.mjs["']/);
});

test("nyc-tron-launcher-check passes a short name and fails a long one with the measured overflow", (t) => {
  const out = build(t);
  const bin = join(out, "bin/nyc-tron-launcher-check.js");
  const short = spawnSync(process.execPath, [bin, "--name", "Tron Lab", "--platforms", "android"], { encoding: "utf8" });
  assert.equal(short.status, 0, short.stderr);
  assert.match(short.stdout, /PASS\s+android-launcher3\s+"Tron Lab"\s+55\.3 of 63\.6 dp/);
  const long = spawnSync(process.execPath, [bin, "--name", "NYC-Tron Instruments Demo", "--platforms", "android"], { encoding: "utf8" });
  assert.equal(long.status, 1);
  assert.match(long.stderr, /OVERFLOW\s+android-launcher3\s+"NYC-Tron Instruments Demo"\s+179\.1 dp in a 63\.6 dp box: over by 115\.5 dp/);
  const config = spawnSync(process.execPath, [bin, join(root, "examples/native-instruments/app.json")], { encoding: "utf8" });
  assert.notEqual(config.status, 1, config.stderr);
});

test("nyc-tron-derive-icons writes the requested formats", (t) => {
  const out = build(t);
  const icons = mkdtempSync(join(tmpdir(), "tron-app-identity-icons-"));
  t.after(() => rmSync(icons, { recursive: true, force: true }));
  const result = spawnSync(process.execPath, [join(out, "bin/nyc-tron-derive-icons.js"), join(root, "examples/native-instruments/assets/icon.png"), "--out", icons, "--formats", "android"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /wrote 2 files/);
});
