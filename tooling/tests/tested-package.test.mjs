import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { mergeTestedPackage } from "../merge-tested-package.mjs";

function fixture(t, platform = "macos") {
  const root = mkdtempSync(join(tmpdir(), "tron-tested-package-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const input = join(root, "native"), output = join(root, "candidate"), staging = join(root, "staging");
  for (const directory of [input, output, join(staging, "package")]) mkdirSync(directory, { recursive: true });
  const packageName = platform === "windows" ? "@nyc-tron/windows-fluent-fabric" : "@nyc-tron/macos-appkit";
  const version = "1.0.0", revision = "a".repeat(40);
  const filename = packageName.slice(1).replace("/", "-") + "-" + version + ".tgz";
  writeFileSync(join(staging, "package/package.json"), JSON.stringify({ name: packageName, version, private: true }));
  execFileSync("tar", ["-czf", join(input, filename), "-C", staging, "package"]);
  const bytes = readFileSync(join(input, filename));
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const dependencies = [];
  const peers = platform === "windows" ? ["@nyc-tron/core", "@nyc-tron/windows-fluent"] : ["@nyc-tron/core"];
  for (const name of peers) {
    const peerFilename = name.slice(1).replace("/", "-") + "-" + version + ".tgz";
    writeFileSync(join(staging, "package/package.json"), JSON.stringify({ name, version, private: true }));
    execFileSync("tar", ["-czf", join(output, peerFilename), "-C", staging, "package"]);
    const peerHash = createHash("sha256").update(readFileSync(join(output, peerFilename))).digest("hex");
    dependencies.push({ packageName: name, filename: peerFilename, sha256: peerHash });
  }
  const receipt = { schemaVersion: 1, status: "passed", platform, packageName, version, filename, sha256,
    sourceRevision: revision, dependencies, checks: ["native-window-open-close"] };
  writeFileSync(join(input, "tested-package.json"), JSON.stringify(receipt));
  writeFileSync(join(input, "SHA256SUMS"), sha256 + "  " + filename + "\n");
  const previous = dependencies.map(peer => peer.sha256 + "  " + peer.filename + "\n").join("");
  writeFileSync(join(output, "SHA256SUMS"), previous);
  const merge = () => mergeTestedPackage(input, output, { packageName, version, revision });
  return { input, output, bytes, receipt, previous, merge };
}

for (const platform of ["macos", "windows"]) {
  test(platform + " merges the exact tested bytes and retains the original native receipt", t => {
    const f = fixture(t, platform), result = f.merge();
    assert.deepEqual(readFileSync(join(f.output, result.filename)), f.bytes);
    assert.equal(readFileSync(join(f.output, "SHA256SUMS"), "utf8"), f.previous + result.sha256 + "  " + result.filename + "\n");
    assert.deepEqual(JSON.parse(readFileSync(join(f.output, platform + "-tested-package.json"))), f.receipt);
    assert.throws(f.merge, /replacement is forbidden/);
  });
}

test("failed, stale, incomplete or mismatched native receipts cannot contribute a release archive", t => {
  const f = fixture(t);
  for (const mutation of [
    { status: "failed" }, { sourceRevision: "c".repeat(40) }, { platform: "windows" },
    { packageName: "@nyc-tron/ui" }, { version: "0.9.0" }, { checks: [] }, { filename: "other.tgz" },
  ]) {
    writeFileSync(join(f.input, "tested-package.json"), JSON.stringify({ ...f.receipt, ...mutation }));
    assert.throws(f.merge, /native receipt/);
    assert.equal(readFileSync(join(f.output, "SHA256SUMS"), "utf8"), f.previous);
  }
});

test("changed archive bytes cannot be released under the successful native job's checksum", t => {
  const f = fixture(t);
  writeFileSync(join(f.input, f.receipt.filename), "different package");
  assert.throws(f.merge, /checksum mismatch/);
  assert.equal(readFileSync(join(f.output, "SHA256SUMS"), "utf8"), f.previous);
});

test("native acceptance binds the release's shared dependencies as well as the desktop adapter", t => {
  const f = fixture(t, "windows");
  for (const dependencies of [[], [f.receipt.dependencies[0]], [f.receipt.dependencies[0], f.receipt.dependencies[0]],
    f.receipt.dependencies.map(peer => ({ ...peer, sha256: "d".repeat(64) }))]) {
    writeFileSync(join(f.input, "tested-package.json"), JSON.stringify({ ...f.receipt, dependencies }));
    assert.throws(f.merge, /shared dependency|candidate dependency/);
    assert.equal(readFileSync(join(f.output, "SHA256SUMS"), "utf8"), f.previous);
  }
  writeFileSync(join(f.input, "tested-package.json"), JSON.stringify(f.receipt));
  writeFileSync(join(f.output, f.receipt.dependencies[0].filename), "changed shared package");
  assert.throws(f.merge, /checksum mismatch/);
  assert.equal(readFileSync(join(f.output, "SHA256SUMS"), "utf8"), f.previous);
});

test("the passed Windows artifact preserves the exact installed npm lock for independent archive verification", t => {
  const f = fixture(t, "windows"), consumer = join(f.input, "consumer"), evidence = join(f.input, "uia"), retained = join(f.input, "retained");
  const vendor = join(consumer, "vendor");
  mkdirSync(vendor, { recursive: true });
  mkdirSync(evidence);
  const archives = [], packages = {};
  for (const item of [f.receipt, ...f.receipt.dependencies]) {
    const from = item === f.receipt ? f.input : f.output, archive = join(from, item.filename);
    cpSync(archive, join(vendor, item.filename));
    const manifest = execFileSync("tar", ["-xzOf", archive, "package/package.json"]);
    const installed = join(consumer, "node_modules", item.packageName);
    mkdirSync(installed, { recursive: true });
    writeFileSync(join(installed, "package.json"), manifest);
    archives.push({ name: item.packageName, filename: item.filename, sha256: item.sha256,
      files: [{ path: "package.json", sha256: createHash("sha256").update(manifest).digest("hex") }] });
    packages["node_modules/" + item.packageName] = { version: f.receipt.version, resolved: "file:vendor/" + item.filename,
      integrity: "sha512-" + createHash("sha512").update(readFileSync(archive)).digest("base64") };
  }
  writeFileSync(join(consumer, "package-preparation.json"), JSON.stringify({ sourceRevision: f.receipt.sourceRevision, installedFromArchives: true, archives }));
  // Non-default formatting makes a parse-and-rewrite fail byte preservation.
  const originalLock = Buffer.from(JSON.stringify({ name: "native-consumer", lockfileVersion: 3, packages }, null, 3).replaceAll("\n", "\r\n") + "\r\n");
  writeFileSync(join(consumer, "package-lock.json"), originalLock);
  const checks = ["controlled-native-navigation", "shared-runtime-two-windows", "shared-document-state", "native-minimize-restore", "native-close-veto", "native-close-accept", "native-window-reopen", "native-menu-disabled-command", "native-context-menu-keyboard", "native-tooltip", "native-inspector-rapid-controlled-edit", "native-inspector-rejection-and-scope", "native-inspector-dismissal-veto-retry", "native-inspector-remount-edit", "native-cross-window-drag-rejected", "native-cross-window-drag-escape", "native-cross-window-drag-close-cancellation", "native-cross-window-drag-accepted", "native-navigation-accessibility"];
  const acceptance = { status: "passed", sourceRevision: f.receipt.sourceRevision, processId: 4242, checks };
  writeFileSync(join(evidence, "result.json"), JSON.stringify(acceptance));
  writeFileSync(join(evidence, "navigation-accessibility-result.json"), JSON.stringify({ ...acceptance,
    checks: ["settings-focus-return", "resize-retains-selection-and-focus", "native-rtl-and-physical-left-pane", "native-pane-collapse-and-restore", "high-contrast-native-repaint-and-input"].map(name => ({ name })) }));
  const script = fileURLToPath(new URL("../../packages/windows-fluent/rnw-fabric/scripts/retain-tested-package.mjs", import.meta.url));
  execFileSync(process.execPath, [script, consumer, evidence, retained]);
  const retainedLock = readFileSync(join(retained, "package-lock.json"));
  assert.deepEqual(retainedLock, originalLock);
  const proof = JSON.parse(retainedLock);
  for (const item of [f.receipt, ...f.receipt.dependencies]) {
    const entry = proof.packages["node_modules/" + item.packageName];
    assert.equal(entry.resolved, "file:vendor/" + item.filename);
    assert.equal(entry.integrity, "sha512-" + createHash("sha512").update(readFileSync(join(vendor, item.filename))).digest("base64"));
  }
});
