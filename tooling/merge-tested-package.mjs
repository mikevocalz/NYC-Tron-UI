import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { basename, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { releaseChecksums, verifyArchiveHash } from "./consumer-model.mjs";

const desktopPackages = new Map([
  ["@nyc-tron/windows-fluent-fabric", { platform: "windows", dependencies: ["@nyc-tron/core", "@nyc-tron/windows-fluent"] }],
  ["@nyc-tron/macos-appkit", { platform: "macos", dependencies: ["@nyc-tron/core"] }],
]);
const fail = message => { throw new Error("Tested desktop package: " + message); };

/** Preserve the exact archive used by a successful native consumer job. */
export function mergeTestedPackage(input, output, { packageName, version, revision }) {
  const desktop = desktopPackages.get(packageName);
  if (!desktop || !/^[a-f0-9]{40}$/.test(revision ?? "") || typeof version !== "string") {
    fail("an expected desktop package, version and full candidate revision are required");
  }
  const { platform, dependencies } = desktop;
  const source = realpathSync(resolve(input));
  const destination = realpathSync(resolve(output));
  const receipt = JSON.parse(readFileSync(join(source, "tested-package.json"), "utf8"));
  const filename = packageName.slice(1).replace("/", "-") + "-" + version + ".tgz";
  if (receipt.schemaVersion !== 1 || receipt.status !== "passed" || receipt.platform !== platform ||
      receipt.packageName !== packageName || receipt.version !== version || receipt.sourceRevision !== revision ||
      receipt.filename !== filename || basename(filename) !== filename || !/^[a-f0-9]{64}$/.test(receipt.sha256 ?? "") ||
      !Array.isArray(receipt.checks) || !receipt.checks.length || receipt.checks.some(value => typeof value !== "string" || !value.trim())) {
    fail("native receipt does not identify a passed run for this package and candidate");
  }
  const hashes = releaseChecksums(readFileSync(join(source, "SHA256SUMS"), "utf8"));
  const archives = readdirSync(source).filter(file => file.endsWith(".tgz"));
  if (hashes.size !== 1 || hashes.get(filename) !== receipt.sha256 || archives.length !== 1 || archives[0] !== filename) {
    fail("native artifact must contain exactly the archive identified by its receipt and checksum");
  }
  const archive = join(source, filename);
  if (!statSync(archive).isFile() || !realpathSync(archive).startsWith(source + sep)) fail("archive escapes the native artifact");
  verifyArchiveHash(filename, readFileSync(archive), receipt.sha256);
  const manifest = JSON.parse(execFileSync("tar", ["-xOf", archive, "package/package.json"], { encoding: "utf8", maxBuffer: 1024 * 1024 }));
  if (manifest.name !== packageName || manifest.version !== version || manifest.private !== true) {
    fail("archive package identity differs from its native receipt");
  }
  const checksumPath = join(destination, "SHA256SUMS");
  const candidateBytes = readFileSync(checksumPath, "utf8");
  const candidate = releaseChecksums(candidateBytes);
  if (candidate.has(filename) || existsSync(join(destination, filename))) fail("candidate already contains this archive; replacement is forbidden");
  if (!Array.isArray(receipt.dependencies) || receipt.dependencies.length !== dependencies.length ||
      new Set(receipt.dependencies.map(peer => peer.packageName)).size !== dependencies.length) {
    fail("native receipt must identify every tested shared dependency archive");
  }
  for (const peer of receipt.dependencies) {
    const peerFilename = peer.packageName?.slice(1).replace("/", "-") + "-" + version + ".tgz";
    if (!dependencies.includes(peer.packageName) || peer.filename !== peerFilename ||
        !/^[a-f0-9]{64}$/.test(peer.sha256 ?? "") || candidate.get(peerFilename) !== peer.sha256) {
      fail("candidate dependency differs from the archive used by native acceptance");
    }
    const peerPath = join(destination, peerFilename);
    if (!statSync(peerPath).isFile() || !realpathSync(peerPath).startsWith(destination + sep)) fail("dependency archive escapes the candidate directory");
    verifyArchiveHash(peerFilename, readFileSync(peerPath), peer.sha256);
  }
  copyFileSync(archive, join(destination, filename));
  writeFileSync(checksumPath, candidateBytes.trimEnd() + "\n" + receipt.sha256 + "  " + filename + "\n");
  copyFileSync(join(source, "tested-package.json"), join(destination, platform + "-tested-package.json"));
  return { packageName, version, filename, sha256: receipt.sha256, sourceRevision: revision, dependencies: receipt.dependencies, checks: receipt.checks };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [input, output, packageName, version, revision, ...extra] = process.argv.slice(2);
  if (!input || !output || extra.length) fail("usage: <native-artifact-directory> <candidate-directory> <package-name> <version> <revision>");
  console.log(JSON.stringify(mergeTestedPackage(input, output, { packageName, version, revision }), null, 2));
}
