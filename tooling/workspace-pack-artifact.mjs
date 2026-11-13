// A single Ubuntu producer supplies the workspace bytes to installed consumers
// and release assembly. The producer's job output binds this manifest; a copied
// archive and a rewritten local checksum file cannot establish that identity.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, existsSync, lstatSync, readFileSync, readdirSync, realpathSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exactPin, releaseChecksums, verifyArchiveHash } from "./consumer-model.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
export const WORKSPACE_PACK_MANIFEST = "workspace-packages.json";
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const fail = message => { throw new Error("Canonical workspace packages: " + message); };
const archiveFilename = (name, version) => name.slice(1).replace("/", "-") + "-" + version + ".tgz";

export function checkoutRevision(rootDir = root) {
  const revision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: rootDir, encoding: "utf8" }).trim();
  if (!/^[a-f0-9]{40}$/.test(revision) || (process.env.GITHUB_SHA && process.env.GITHUB_SHA !== revision)) {
    fail("workflow and checked out source revisions differ");
  }
  return revision;
}

function regularFile(directory, filename) {
  const path = join(directory, filename);
  if (!lstatSync(path).isFile()) fail("artifact must contain a regular file: " + filename);
  return readFileSync(path);
}

function packageInventory(rootDir, version) {
  const packages = join(rootDir, "packages");
  const manifests = readdirSync(packages, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && existsSync(join(packages, entry.name, "package.json")))
    .map(entry => JSON.parse(readFileSync(join(packages, entry.name, "package.json"), "utf8")))
    .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  const expectedVersion = version ?? manifests[0]?.version;
  exactPin("workspace release version", expectedVersion);
  const inventory = new Map();
  for (const manifest of manifests) {
    if (!/^@nyc-tron\/[a-z0-9-]+$/.test(manifest.name ?? "") || manifest.private !== true || manifest.version !== expectedVersion) {
      fail("checkout package identity, private distribution or version differs: " + manifest.name);
    }
    if (inventory.has(manifest.name)) fail("duplicate checkout package " + manifest.name);
    inventory.set(manifest.name, { filename: archiveFilename(manifest.name, expectedVersion), version: expectedVersion });
  }
  if (inventory.size !== 14) fail("the checkout must identify exactly fourteen workspace packages");
  return { inventory, version: expectedVersion };
}

function inspectArchives(directory, inventory, { release = false } = {}) {
  const checksumBytes = regularFile(directory, "SHA256SUMS");
  const hashes = releaseChecksums(checksumBytes.toString("utf8"));
  const expected = new Set([...inventory.values()].map(pkg => pkg.filename));
  if (release) {
    const version = inventory.values().next().value.version;
    expected.add(archiveFilename("@nyc-tron/windows-fluent-fabric", version));
    expected.add(archiveFilename("@nyc-tron/macos-appkit", version));
  }
  const archives = readdirSync(directory).filter(name => name.endsWith(".tgz"));
  if (hashes.size !== expected.size || archives.length !== expected.size ||
      [...hashes.keys(), ...archives].some(file => !expected.has(file))) {
    fail(release ? "assembled release must retain the fourteen workspace archives and two desktop archives" :
      "artifact and SHA256SUMS must identify exactly the fourteen workspace archives");
  }
  const records = [];
  for (const [packageName, { filename, version }] of inventory) {
    const bytes = regularFile(directory, filename);
    verifyArchiveHash(filename, bytes, hashes.get(filename));
    const manifest = JSON.parse(execFileSync("tar", ["-xzOf", join(directory, filename), "package/package.json"], {
      encoding: "utf8", maxBuffer: 1024 * 1024,
    }));
    if (manifest.name !== packageName || manifest.version !== version || manifest.private !== true) {
      fail("archive package identity, private distribution or version differs: " + filename);
    }
    records.push({ packageName, version, filename, bytes: bytes.length, sha256: hashes.get(filename) });
  }
  return { records, checksumBytes };
}

/** Run once after the standard release packer, before uploading its artifact. */
export function recordWorkspacePackages(artifacts, { rootDir = root, revision, version } = {}) {
  if (!/^[a-f0-9]{40}$/.test(revision ?? "")) fail("a full checked out source revision is required");
  const directory = realpathSync(resolve(artifacts));
  const expected = packageInventory(rootDir, version);
  const { records, checksumBytes } = inspectArchives(directory, expected.inventory);
  const manifest = { schemaVersion: 1, sourceCommit: revision, version: expected.version,
    checksumsSha256: sha256(checksumBytes), archives: records };
  const bytes = JSON.stringify(manifest, null, 2) + "\n";
  writeFileSync(join(directory, WORKSPACE_PACK_MANIFEST), bytes, { flag: "wx" });
  return { manifest, manifestSha256: sha256(bytes) };
}

/** Verify against the producer's job output, never a hash supplied by this artifact itself. */
export function verifyWorkspacePackages(artifacts, { rootDir = root, revision, version, manifestSha256, release = false } = {}) {
  if (!/^[a-f0-9]{40}$/.test(revision ?? "") || !/^[a-f0-9]{64}$/.test(manifestSha256 ?? "")) {
    fail("the checked out source revision and producer manifest hash are required");
  }
  const directory = realpathSync(resolve(artifacts));
  const manifestBytes = regularFile(directory, WORKSPACE_PACK_MANIFEST);
  if (sha256(manifestBytes) !== manifestSha256) fail("producer manifest checksum mismatch");
  const manifest = JSON.parse(manifestBytes);
  const expected = packageInventory(rootDir, version);
  if (manifest.schemaVersion !== 1 || manifest.sourceCommit !== revision || manifest.version !== expected.version ||
      !/^[a-f0-9]{64}$/.test(manifest.checksumsSha256 ?? "") || !Array.isArray(manifest.archives) || manifest.archives.length !== 14) {
    fail("producer manifest does not identify this source revision and workspace version");
  }
  const { records, checksumBytes } = inspectArchives(directory, expected.inventory, { release });
  if (!release && sha256(checksumBytes) !== manifest.checksumsSha256) fail("original workspace SHA256SUMS changed");
  if (release && sha256(regularFile(directory, "workspace-SHA256SUMS")) !== manifest.checksumsSha256) {
    fail("retained workspace SHA256SUMS differs from the producer");
  }
  // Compare every field in each producer record, including its package identity
  // and size. The current SHA256SUMS alone could have been regenerated by a repack.
  if (records.some((record, index) => Object.entries(record).some(([key, value]) => manifest.archives[index]?.[key] !== value))) {
    fail("workspace archive bytes or identity differ from the producer manifest");
  }
  return { manifest, manifestSha256, archives: new Map(records.map(record => [record.packageName, {
    path: join(directory, record.filename), version: record.version, sha256: record.sha256,
  }])) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, directory, ...args] = process.argv.slice(2);
  const revision = checkoutRevision();
  let result;
  if (command === "record" && directory && !args.length) {
    result = recordWorkspacePackages(directory, { revision });
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, "manifest_sha256=" + result.manifestSha256 + "\n");
  } else if (command === "verify" && directory && args.length) {
    const manifestSha256 = args.shift();
    const options = {};
    while (args.length) {
      const option = args.shift();
      if (option === "--expect-version" && !options.version && args[0]) options.version = args.shift();
      else if (option === "--release" && !options.release) options.release = true;
      else fail("usage: verify <directory> <producer-manifest-sha256> [--expect-version <version>] [--release]");
    }
    result = verifyWorkspacePackages(directory, { revision, manifestSha256, ...options });
  } else fail("usage: record <directory> | verify <directory> <producer-manifest-sha256> [--expect-version <version>] [--release]");
  console.log(JSON.stringify({ sourceCommit: result.manifest.sourceCommit, version: result.manifest.version,
    archiveCount: result.manifest.archives.length, manifestSha256: result.manifestSha256 }, null, 2));
}
