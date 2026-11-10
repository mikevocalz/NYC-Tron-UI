import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { releaseChecksums, verifyArchiveHash } from "./consumer-model.mjs";
import { validateComponentProgram } from "./verify-component-program.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const RELEASE_REPOSITORY = "mikevocalz/NYC-Tron-UI";
export const DISTRIBUTION_OWNER = "mikevocalz";
const fail = message => { throw new Error("Release readiness: " + message); };
const json = path => JSON.parse(readFileSync(path, "utf8"));
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

/** Release tags use semver without build metadata; numeric identifiers cannot have leading zeroes. */
export function releaseChannel(version) {
  const number = "(?:0|[1-9][0-9]*)";
  const match = new RegExp("^" + number + "\\." + number + "\\." + number + "(?:-([0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*))?$").exec(version);
  if (!match || match[1]?.split(".").some(part => /^[0-9]+$/.test(part) && part.length > 1 && part.startsWith("0"))) fail("invalid release version");
  return match[1] ? "prerelease" : "stable";
}

function approvalLocation(value) {
  const match = /^https:\/\/github\.com\/mikevocalz\/NYC-Tron-UI\/pull\/([1-9][0-9]*)#issuecomment-([1-9][0-9]*)$/.exec(value ?? "");
  if (!match || !Number.isSafeInteger(Number(match[1])) || !Number.isSafeInteger(Number(match[2]))) fail("approval must link an owner comment on this repository's pull request");
  return { pull: match[1], comment: match[2], url: value,
    apiUrl: "https://api.github.com/repos/" + RELEASE_REPOSITORY + "/issues/comments/" + match[2] };
}

/** A local status flag cannot act as an owner approval. */
export function validateDistributionRecord(record) {
  if (record?.schemaVersion !== 1 || record.repository !== RELEASE_REPOSITORY ||
      !["pending", "approved"].includes(record.status) || releaseChannel(record.releaseVersion) !== "stable") {
    fail("invalid tracked owner distribution-review record");
  }
  if (record.status === "pending") {
    if (record.approval !== null) fail("pending distribution review must not carry a claimed approval");
    return;
  }
  const approval = record.approval;
  if (!approval || approval.reviewer !== DISTRIBUTION_OWNER || !/^[a-f0-9]{64}$/.test(approval.manifestSha256 ?? "")) {
    fail("approved distribution review needs the actual owner, checksum identity and authenticated comment");
  }
  approvalLocation(approval.commentUrl);
}

/** Exact text an owner may choose to submit after reviewing the retained archives. Never posted by this tool. */
export function distributionApprovalStatement(version, manifestSha256) {
  return [
    "NYC-Tron distribution approval",
    "Version: " + version,
    "SHA256SUMS-SHA256: " + manifestSha256,
    "I approve distribution of these NYC-Tron release archives with their included licenses and source notices.",
  ].join("\n");
}

/** Verify every workspace and isolated desktop archive before binding an approval to SHA256SUMS. */
export function verifyReleaseInventory(artifacts, version, { rootDir = root } = {}) {
  const directory = realpathSync(resolve(artifacts));
  const manifestBytes = readFileSync(join(directory, "SHA256SUMS"));
  const hashes = releaseChecksums(manifestBytes.toString("utf8"));
  const packages = join(rootDir, "packages");
  const manifests = readdirSync(packages, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && existsSync(join(packages, entry.name, "package.json")))
    .map(entry => join(packages, entry.name, "package.json"));
  manifests.push(join(packages, "windows-fluent/rnw-fabric/package.json"));
  manifests.push(join(packages, "macos-appkit/spark/package.json"));
  const expected = new Set(manifests.map(path => {
    const manifest = json(path);
    if (!/^@nyc-tron\/[a-z0-9-]+$/.test(manifest.name ?? "") || manifest.version !== version || manifest.private !== true) {
      fail("package identity, private distribution or version differs from the candidate: " + path);
    }
    return manifest.name.slice(1).replace("/", "-") + "-" + version + ".tgz";
  }));
  if (expected.size !== 15 || manifests.length !== 15 || hashes.size !== expected.size || [...hashes.keys()].some(file => !expected.has(file))) {
    fail("SHA256SUMS must identify the exact fifteen candidate archives");
  }
  const archiveFiles = readdirSync(directory).filter(file => file.endsWith(".tgz"));
  if (archiveFiles.length !== expected.size || archiveFiles.some(file => !expected.has(file))) fail("candidate archive directory and SHA256SUMS differ");
  for (const [file, hash] of hashes) {
    const path = join(directory, file);
    if (!statSync(path).isFile() || !realpathSync(path).startsWith(directory + sep)) fail("archive escapes the candidate directory: " + file);
    verifyArchiveHash(file, readFileSync(path), hash);
  }
  return { archiveCount: hashes.size, manifestSha256: sha256(manifestBytes) };
}

/** The live GitHub response authenticates the owner and the exact reviewed bytes. */
export function validateOwnerApproval(record, response, version, manifestSha256) {
  validateDistributionRecord(record);
  if (record.status !== "approved" || record.releaseVersion !== version || record.approval.manifestSha256 !== manifestSha256) {
    fail("owner distribution review does not approve this version and archive manifest");
  }
  const location = approvalLocation(record.approval.commentUrl);
  const statement = distributionApprovalStatement(version, manifestSha256);
  // Exact comment text avoids accepting a quoted or negated example as approval.
  const body = typeof response?.body === "string" ? response.body.replace(/\r\n/g, "\n").trim() : "";
  if (response?.html_url !== location.url || String(response?.id) !== location.comment ||
      response?.issue_url !== "https://api.github.com/repos/" + RELEASE_REPOSITORY + "/issues/" + location.pull ||
      response?.user?.login !== DISTRIBUTION_OWNER || response?.user?.type !== "User" || response?.author_association !== "OWNER" ||
      !Number.isFinite(Date.parse(response?.created_at ?? "")) || body !== statement) {
    fail("GitHub does not authenticate the owner's exact archive distribution approval");
  }
  return { reviewer: DISTRIBUTION_OWNER, commentUrl: location.url, createdAt: response.created_at };
}

async function loadOwnerComment(url) {
  const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2026-03-10",
      ...(token ? { Authorization: "Bearer " + token } : {}) },
    signal: AbortSignal.timeout(15000), redirect: "error",
  });
  if (!response.ok) fail("could not authenticate the owner comment with GitHub (HTTP " + response.status + ")");
  return response.json();
}

/** Read-only gate: packaging may proceed for a prerelease, but nothing promotes ledger/review status. */
export async function validateReleaseReadiness({ version, ledger, review, artifacts }, { rootDir = root, loadApproval = loadOwnerComment } = {}) {
  const channel = releaseChannel(version);
  const program = validateComponentProgram(ledger, { rootDir });
  validateDistributionRecord(review);
  const inventory = artifacts ? verifyReleaseInventory(artifacts, version, { rootDir }) : undefined;
  if (channel === "prerelease") {
    return { status: "candidate", channel, version, program, distributionReview: review.status, inventory,
      note: "Prerelease packaging does not claim stable acceptance or owner distribution approval." };
  }
  const blockers = [];
  if (program.accepted !== program.canonical) blockers.push((program.canonical - program.accepted) + " of 341 components lack accepted eight-platform proof");
  if (review.status !== "approved") blockers.push("owner distribution review is pending");
  if (!inventory) blockers.push("the fifteen actual release archives and SHA256SUMS are required");
  if (blockers.length) fail("stable publication blocked: " + blockers.join("; "));
  if (review.releaseVersion !== version || review.approval.manifestSha256 !== inventory.manifestSha256) fail("owner distribution approval is for different version/archive bytes");
  const response = await loadApproval(approvalLocation(review.approval.commentUrl).apiUrl);
  const approval = validateOwnerApproval(review, response, version, inventory.manifestSha256);
  return { status: "ready", channel, version, program, inventory, approval };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), options = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    if (!["--version", "--artifacts", "--output"].includes(key) || !args[i + 1] || options[key] !== undefined) fail("usage: --version <semver> [--artifacts <directory>] [--output <report.json>]");
    options[key] = args[i + 1];
  }
  let result;
  try {
    result = await validateReleaseReadiness({ version: options["--version"], artifacts: options["--artifacts"],
      ledger: json(join(root, "docs/completion/library-progress.json")), review: json(join(root, "docs/completion/distribution-review.json")) });
    console.log("Release readiness: " + result.status + " (" + result.channel + "); " + result.program.accepted + "/341 accepted; no acceptance or approval status changed.");
  } catch (error) {
    result = { status: "blocked", version: options["--version"], error: error.message };
    console.error(error.message);
    process.exitCode = 1;
  }
  if (options["--output"]) writeFileSync(resolve(options["--output"]), JSON.stringify(result, null, 2) + "\n");
}
