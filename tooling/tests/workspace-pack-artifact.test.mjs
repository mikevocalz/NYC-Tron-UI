import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { checkoutRevision, recordWorkspacePackages, verifyWorkspacePackages, WORKSPACE_PACK_MANIFEST } from "../workspace-pack-artifact.mjs";

const repo = fileURLToPath(new URL("../..", import.meta.url));
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const filename = (name, version) => name.slice(1).replace("/", "-") + "-" + version + ".tgz";

function fixture(t, { revision = "a".repeat(40) } = {}) {
  const directory = mkdtempSync(join(tmpdir(), "tron-workspace-artifact-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const rootDir = join(directory, "checkout"), artifacts = join(directory, "packs"), staging = join(directory, "staging");
  for (const path of [rootDir, artifacts, join(staging, "package")]) mkdirSync(path, { recursive: true });
  const packages = readdirSync(join(repo, "packages"), { withFileTypes: true })
    .filter(entry => entry.isDirectory() && existsSync(join(repo, "packages", entry.name, "package.json")))
    .map(entry => {
      const source = JSON.parse(readFileSync(join(repo, "packages", entry.name, "package.json"), "utf8"));
      const manifest = { name: source.name, version: source.version, private: true };
      const path = join(rootDir, "packages", entry.name);
      mkdirSync(path, { recursive: true });
      writeFileSync(join(path, "package.json"), JSON.stringify(manifest));
      return manifest;
    });
  const version = packages[0].version;
  const pack = (manifest, file = filename(manifest.name, version), payload = "original candidate") => {
    writeFileSync(join(staging, "package/package.json"), JSON.stringify(manifest));
    writeFileSync(join(staging, "package/payload.txt"), payload);
    execFileSync("tar", ["-czf", join(artifacts, file), "-C", staging, "package"]);
    return file;
  };
  const checksums = () => writeFileSync(join(artifacts, "SHA256SUMS"), readdirSync(artifacts)
    .filter(file => file.endsWith(".tgz")).sort().map(file => hash(readFileSync(join(artifacts, file))) + "  " + file + "\n").join(""));
  packages.forEach(manifest => pack(manifest));
  checksums();
  const options = { rootDir, revision, version };
  const recorded = recordWorkspacePackages(artifacts, options);
  const verify = overrides => verifyWorkspacePackages(artifacts, { ...options, manifestSha256: recorded.manifestSha256, ...overrides });
  return { directory, rootDir, artifacts, packages, pack, checksums, options, recorded, verify };
}

test("a relocated canonical artifact retains the producer's exact thirteen package identities", t => {
  const f = fixture(t), relocated = join(f.directory, "another-runner");
  cpSync(f.artifacts, relocated, { recursive: true });
  const result = verifyWorkspacePackages(relocated, { ...f.options, manifestSha256: f.recorded.manifestSha256 });
  assert.deepEqual(result.manifest, f.recorded.manifest);
  assert.equal(result.archives.size, 13);
  assert.equal(result.archives.get("@nyc-tron/core").path, join(relocated, filename("@nyc-tron/core", f.options.version)));
  assert.throws(() => recordWorkspacePackages(f.artifacts, f.options), /EEXIST/);
});

test("a prior checkout, wrong release version or absent producer hash cannot authorize these archives", t => {
  const f = fixture(t);
  assert.throws(() => f.verify({ revision: "b".repeat(40) }), /source revision and workspace version/);
  assert.throws(() => f.verify({ version: "0.9.0" }), /checkout package.*version differs/);
  assert.throws(() => f.verify({ manifestSha256: undefined }), /producer manifest hash are required/);
  assert.throws(() => f.verify({ manifestSha256: "0".repeat(64) }), /producer manifest checksum mismatch/);
});

test("changing the manifest cannot relabel old package bytes as another source revision", t => {
  const f = fixture(t);
  writeFileSync(join(f.artifacts, WORKSPACE_PACK_MANIFEST), JSON.stringify({ ...f.recorded.manifest, sourceCommit: "b".repeat(40) }));
  assert.throws(() => f.verify({ revision: "b".repeat(40) }), /producer manifest checksum mismatch/);
});

test("archive tampering and a valid same-version repack both fail the producer binding", t => {
  const f = fixture(t), manifest = f.packages[0], file = filename(manifest.name, manifest.version);
  writeFileSync(join(f.artifacts, file), "corrupted archive");
  assert.throws(f.verify, /checksum mismatch/);
  f.pack(manifest, file, "replacement candidate payload");
  f.checksums();
  assert.throws(f.verify, /original workspace SHA256SUMS changed/);
});

test("a tarball's embedded wrong version is rejected even with fresh valid checksums", t => {
  const f = fixture(t), manifest = f.packages[0];
  f.pack({ ...manifest, version: "0.9.0" });
  f.checksums();
  assert.throws(f.verify, /archive package identity.*version differs/);
  rmSync(join(f.artifacts, WORKSPACE_PACK_MANIFEST));
  assert.throws(() => recordWorkspacePackages(f.artifacts, f.options), /archive package identity.*version differs/);
});

test("missing, extra and symlinked workspace archives cannot enter the canonical set", t => {
  const f = fixture(t), file = filename(f.packages[0].name, f.options.version), bytes = readFileSync(join(f.artifacts, file));
  rmSync(join(f.artifacts, file));
  assert.throws(f.verify, /exactly the thirteen workspace archives/);
  writeFileSync(join(f.artifacts, file), bytes);
  writeFileSync(join(f.artifacts, "extra.tgz"), bytes);
  assert.throws(f.verify, /exactly the thirteen workspace archives/);
  rmSync(join(f.artifacts, "extra.tgz"));
  const external = join(f.directory, file);
  writeFileSync(external, bytes);
  rmSync(join(f.artifacts, file));
  symlinkSync(external, join(f.artifacts, file), "file");
  assert.throws(f.verify, /regular file/);
});

test("release assembly preserves all thirteen bytes while adding exactly the two desktop archives", t => {
  const f = fixture(t);
  cpSync(join(f.artifacts, "SHA256SUMS"), join(f.artifacts, "workspace-SHA256SUMS"));
  for (const name of ["@nyc-tron/windows-fluent-fabric", "@nyc-tron/macos-appkit"]) {
    f.pack({ name, version: f.options.version, private: true });
  }
  f.checksums();
  assert.equal(f.verify({ release: true }).archives.size, 13);
  f.pack(f.packages[0], undefined, "repacked after native acceptance");
  f.checksums();
  assert.throws(() => f.verify({ release: true }), /differ from the producer manifest/);
});

test("consumer preparation retains producer provenance and uses its exact local archives", t => {
  const f = fixture(t, { revision: checkoutRevision(repo) }), output = join(f.directory, "consumer");
  const result = spawnSync(process.execPath, [join(repo, "tooling/consumer-release.mjs"), "prepare", f.artifacts,
    output, "expo-native", "--workspace-manifest", f.recorded.manifestSha256], { cwd: repo, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const plan = JSON.parse(readFileSync(join(output, "consumer.json"), "utf8"));
  const app = JSON.parse(readFileSync(join(output, "app/package.json"), "utf8"));
  assert.equal(plan.sourceCommit, f.options.revision);
  assert.equal(plan.workspacePackages.manifestSha256, f.recorded.manifestSha256);
  assert.equal(plan.workspacePackages.archiveCount, 13);
  assert.deepEqual(readFileSync(join(output, WORKSPACE_PACK_MANIFEST)), readFileSync(join(f.artifacts, WORKSPACE_PACK_MANIFEST)));
  assert.deepEqual(readFileSync(join(output, "workspace-SHA256SUMS")), readFileSync(join(f.artifacts, "SHA256SUMS")));
  for (const [name, archive] of Object.entries(plan.packages)) {
    assert.equal(app.dependencies[name], "file:" + archive.path);
    assert.equal(archive.sha256, f.recorded.manifest.archives.find(pkg => pkg.packageName === name).sha256);
  }
});

test("consumer preparation rejects stale or changed artifacts before creating an app", t => {
  const f = fixture(t), output = join(f.directory, "consumer");
  const run = () => spawnSync(process.execPath, [join(repo, "tooling/consumer-release.mjs"), "prepare", f.artifacts,
    output, "expo-native", "--workspace-manifest", f.recorded.manifestSha256], { cwd: repo, encoding: "utf8" });
  const stale = run();
  assert.notEqual(stale.status, 0);
  assert.match(stale.stderr, /source revision and workspace version/);
  assert.equal(existsSync(output), false);
  writeFileSync(join(f.artifacts, WORKSPACE_PACK_MANIFEST), JSON.stringify({ ...f.recorded.manifest, sourceCommit: checkoutRevision(repo) }));
  const changed = run();
  assert.notEqual(changed.status, 0);
  assert.match(changed.stderr, /producer manifest checksum mismatch/);
  assert.equal(existsSync(output), false);
});

test("the producer CLI emits a hash for the actual checkout and rejects a different workflow revision", t => {
  const f = fixture(t), output = join(f.directory, "job-output");
  rmSync(join(f.artifacts, WORKSPACE_PACK_MANIFEST));
  const script = join(repo, "tooling/workspace-pack-artifact.mjs"), revision = checkoutRevision(repo);
  const result = spawnSync(process.execPath, [script, "record", f.artifacts], {
    cwd: repo, encoding: "utf8", env: { ...process.env, GITHUB_SHA: revision, GITHUB_OUTPUT: output },
  });
  assert.equal(result.status, 0, result.stderr);
  const manifest = readFileSync(join(f.artifacts, WORKSPACE_PACK_MANIFEST));
  assert.equal(JSON.parse(manifest).sourceCommit, revision);
  assert.equal(readFileSync(output, "utf8"), "manifest_sha256=" + hash(manifest) + "\n");
  const stale = spawnSync(process.execPath, [script, "verify", f.artifacts, hash(manifest)], {
    cwd: repo, encoding: "utf8", env: { ...process.env, GITHUB_SHA: "b".repeat(40) },
  });
  assert.notEqual(stale.status, 0);
  assert.match(stale.stderr, /workflow and checked out source revisions differ/);
});

test("an offline npm consumer records the canonical archive and rejects replacement after preparation", t => {
  const f = fixture(t, { revision: checkoutRevision(repo) }), output = join(f.directory, "installed-consumer"), project = join(output, "app");
  mkdirSync(project, { recursive: true });
  const name = "@nyc-tron/core", archive = f.verify().archives.get(name);
  writeFileSync(join(project, "package.json"), JSON.stringify({ name: "canonical-archive-test", version: "0.0.0", private: true,
    dependencies: { [name]: "file:" + archive.path } }));
  writeFileSync(join(output, "consumer.json"), JSON.stringify({ kind: "archive-fixture", sourceCommit: f.options.revision,
    workspacePackages: { manifestSha256: f.recorded.manifestSha256 }, packages: { [name]: archive }, absentPeers: [] }));
  execFileSync(process.platform === "win32" ? "npm.cmd" : "npm", ["install", "--offline", "--ignore-scripts", "--no-audit", "--no-fund"], {
    cwd: project, stdio: "pipe", shell: process.platform === "win32",
  });
  const check = () => spawnSync(process.execPath, [join(repo, "tooling/consumer-release.mjs"), "check-install", output], { cwd: repo, encoding: "utf8" });
  const passed = check();
  assert.equal(passed.status, 0, passed.stderr);
  const installed = JSON.parse(readFileSync(join(output, "installed-packages.json"), "utf8"));
  assert.equal(installed.packages[name].sha256, archive.sha256);
  f.pack(f.packages.find(pkg => pkg.name === name), undefined, "replacement after preparation");
  const failed = check();
  assert.notEqual(failed.status, 0);
  assert.match(failed.stderr, /checksum mismatch/);
});
