import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
