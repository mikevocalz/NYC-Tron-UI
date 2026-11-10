import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, lstatSync, rmSync } from "node:fs";
import { dirname, relative, resolve, join, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const root = resolve(dirname(fileURLToPath(import.meta.url)), ".."), repo = resolve(root, "../../..");
const output = process.argv[2] && resolve(process.argv[2]);
const shared = process.argv[3] && resolve(process.argv[3]);
const relation = output && relative(repo, output);
if (!output || !shared || (!relation.startsWith("..") && !isAbsolute(relation)) || existsSync(output)) throw new Error("Usage: prepare-consumer new-directory-outside-repository canonical-shared-archives-directory");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: process.platform === "win32" && command.endsWith(".cmd") });
  if (result.error || result.status !== 0) throw result.error ?? new Error(`${command} failed (${result.status})`);
}
mkdirSync(output, { recursive: true });
cpSync(join(root, "example"), output, { recursive: true, filter: path => !/(?:^|[/\\])(?:node_modules|windows|vendor)(?:[/\\]|$)/.test(relative(join(root, "example"), path)) });
const vendor = join(output, "vendor"); mkdirSync(vendor);
// The release packer supplies normalized manifests and all required notices.
// Use its Ubuntu-built peer bytes instead of repacking peers on Windows.
const checksums = new Map();
for (const line of readFileSync(join(shared, "SHA256SUMS"), "utf8").trim().split(/\r?\n/)) {
  const match = /^([a-f0-9]{64})  ([a-z0-9][a-z0-9.-]*\.tgz)$/.exec(line);
  if (!match || checksums.has(match[2])) throw new Error("Malformed canonical shared-package checksums");
  checksums.set(match[2], match[1]);
}
for (const name of ["core", "windows-fluent"]) {
  const pkg = JSON.parse(readFileSync(join(repo, "packages", name, "package.json"), "utf8"));
  const filename = `nyc-tron-${name}-${pkg.version}.tgz`, path = join(shared, filename);
  const sha256 = createHash("sha256").update(readFileSync(path)).digest("hex");
  if (checksums.get(filename) !== sha256) throw new Error(`Canonical shared-package hash mismatch: ${filename}`);
  cpSync(path, join(vendor, filename));
}
run(npm, ["pack", "--ignore-scripts", "--pack-destination", vendor], root);
const manifestPath = join(output, "package.json"), manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const archives = [];
for (const filename of readdirSync(vendor).filter(f => f.endsWith(".tgz"))) {
  const name = filename.startsWith("nyc-tron-windows-fluent-fabric-") ? "@nyc-tron/windows-fluent-fabric" : filename.startsWith("nyc-tron-windows-fluent-") ? "@nyc-tron/windows-fluent" : "@nyc-tron/core";
  manifest.dependencies[name] = "file:vendor/" + filename;
  const bytes = readFileSync(join(vendor, filename));
  archives.push({ name, filename, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
run(npm, ["install", "--no-audit", "--no-fund"], output);
for (const name of ["@nyc-tron/core", "@nyc-tron/windows-fluent", "@nyc-tron/windows-fluent-fabric"]) {
  if (lstatSync(join(output, "node_modules", name)).isSymbolicLink()) throw new Error(`Consumer dependency is a source link: ${name}`);
}
const lock = JSON.parse(readFileSync(join(output, "package-lock.json"), "utf8"));
const verification = join(output, ".archive-verification");
for (const archive of archives) {
  const bytes = readFileSync(join(vendor, archive.filename));
  const entry = lock.packages["node_modules/" + archive.name];
  if (entry?.link || entry?.resolved !== "file:vendor/" + archive.filename || entry?.integrity !== "sha512-" + createHash("sha512").update(bytes).digest("base64")) throw new Error(`Installed lock differs from candidate archive: ${archive.name}`);
  const unpacked = join(verification, archive.name.split("/")[1]); mkdirSync(unpacked, { recursive: true });
  run("tar", ["-xzf", join(vendor, archive.filename), "-C", unpacked], output);
  archive.files = [];
  function compare(directory, prefix = "") {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name), local = join(prefix, entry.name);
      if (entry.isDirectory()) { compare(path, local); continue; }
      if (!entry.isFile()) throw new Error(`Unexpected candidate archive entry: ${local}`);
      const expected = readFileSync(path), actual = readFileSync(join(output, "node_modules", archive.name, local));
      if (!expected.equals(actual)) throw new Error(`Installed source bytes differ: ${archive.name}/${local}`);
      archive.files.push({ path: local.replaceAll("\\", "/"), bytes: actual.length, sha256: createHash("sha256").update(actual).digest("hex") });
    }
  }
  compare(join(unpacked, "package"));
}
rmSync(verification, { recursive: true });
const head = spawnSync("git", ["rev-parse", "HEAD"], { cwd: repo, encoding: "utf8" });
if (head.status !== 0) throw new Error("Cannot identify consumer source revision");
writeFileSync(join(output, "package-preparation.json"), JSON.stringify({ schemaVersion: 1, sourceRevision: head.stdout.trim(), archives, installedFromArchives: true }, null, 2) + "\n");
console.info(`Prepared actual-tarball Windows consumer: ${output}`);
