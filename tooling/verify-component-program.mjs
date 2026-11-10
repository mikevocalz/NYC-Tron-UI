import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const CANONICAL_BASELINE_SHA256 = "a1fd6593a84f899dc2946e6337fde7c59897607701516b6d64732d51d44b75db";
export const REQUIRED_PLATFORMS = Object.freeze(["ios", "android", "web", "macos", "windows", "visionos", "quest", "pico"]);
const implementationStatuses = new Set(["pending", "partial", "implemented", "implemented-external"]);
const acceptanceStatuses = new Set(["unverified", "accepted"]);
const platformStatuses = new Set(["unverified", "not-run", "partial", "blocked", "failed", "passed"]);
const fail = message => { throw new Error("Component program: " + message); };
const nonempty = value => typeof value === "string" && value.length > 0 && value === value.trim() && !/[\u0000-\u001f\u007f]/.test(value);

function safePath(value) {
  return nonempty(value) && /^[A-Za-z0-9_@+./-]+$/.test(value) &&
    !value.startsWith("/") && value.split("/").every(part => part !== "" && part !== "." && part !== "..");
}
function stringList(value, label, required = false) {
  if (!Array.isArray(value) || required && value.length === 0 || value.some(item => !nonempty(item))) fail(label + " must be a nonempty-string list");
  if (new Set(value).size !== value.length) fail(label + " contains duplicates");
  return value;
}
function equalSet(actual, expected) {
  return actual.length === expected.length && new Set(actual).size === actual.length && expected.every(value => actual.includes(value));
}

/** The frozen upstream TSV is checked byte-for-byte, not just by row count. */
export function parseCanonicalBaseline(bytes) {
  if (createHash("sha256").update(bytes).digest("hex") !== CANONICAL_BASELINE_SHA256) fail("Canonical baseline SHA256 does not match the frozen original");
  const lines = bytes.toString().split(/\r?\n/).filter(Boolean);
  const columns = lines.shift().split("\t");
  const idIndex = columns.indexOf("id"), nameIndex = columns.indexOf("name");
  if (idIndex < 0 || nameIndex < 0) fail("Canonical baseline needs id/name columns");
  const rows = lines.map(line => { const values = line.split("\t"); return { id: values[idIndex], name: values[nameIndex] }; });
  if (rows.length !== 341 || new Set(rows.map(row => row.id)).size !== 341) fail("Canonical baseline must contain exactly 341 unique IDs");
  return rows;
}

function packageManifests(rootDir) {
  const packages = join(rootDir, "packages");
  if (!existsSync(packages)) return [];
  const paths = readdirSync(packages, { withFileTypes: true }).filter(entry => entry.isDirectory())
    .map(entry => join(packages, entry.name));
  paths.push(join(packages, "windows-fluent/rnw-fabric"));
  return paths.filter(directory => existsSync(join(directory, "package.json"))).map(directory => ({
    directory, manifest: JSON.parse(readFileSync(join(directory, "package.json"), "utf8")),
  }));
}
function exportTargets(value) {
  if (typeof value === "string") return [value];
  return value && typeof value === "object" ? Object.values(value).flatMap(exportTargets) : [];
}

/**
 * Validate local ownership and explicit, pinned external ownership without
 * treating either source review as eight-platform runtime acceptance.
 * Remote paths are syntactically checked here; reviewers verify their pinned
 * repository contents and record that provenance in the required report.
 */
export function validateComponentProgram(ledger, { rootDir = root } = {}) {
  rootDir = realpathSync(resolve(rootDir));
  const canonical = parseCanonicalBaseline(readFileSync(join(rootDir, "docs/completion/baseline-roster.tsv")));
  if (ledger?.schemaVersion !== 1) fail("Unknown ledger schema version");
  if (ledger.baselineSha256 !== CANONICAL_BASELINE_SHA256) fail("Ledger baseline hash changed");
  if (!Array.isArray(ledger.requiredPlatforms) || !equalSet(ledger.requiredPlatforms, REQUIRED_PLATFORMS)) {
    fail("Required platform scope must retain ios, android, web, macos, windows, visionos, quest and pico");
  }
  if (!Array.isArray(ledger.components) || ledger.components.length !== 341) fail("The canonical scope must retain all 341 IDs");
  const canonicalNames = new Map(canonical.map(row => [row.id, row.name]));
  const ids = new Set(), manifests = packageManifests(rootDir);
  const summary = { canonical: 341, localImplemented: 0, localPartial: 0, externalImplemented: 0, pending: 0, accepted: 0 };
  const localFile = (base, path, label) => {
    if (!safePath(path)) fail(label + " has an unsafe path: " + path);
    const basePath = join(rootDir, base), file = join(basePath, path);
    if (!existsSync(file) || !statSync(file).isFile()) fail(label + " has a missing file: " + path);
    if (!realpathSync(file).startsWith(realpathSync(basePath) + sep)) fail(label + " escapes its owned directory: " + path);
  };
  const evidence = (paths, label, required = false) => {
    for (const path of stringList(paths ?? [], label, required)) localFile("docs/completion", path, label);
  };
  const validateExternal = row => {
    if (row.libraryScope !== false || row.sourceCandidates.length !== 0) fail(row.id + " external ownership cannot masquerade as local source");
    const owners = row.externalImplementation?.owners;
    if (!Array.isArray(owners) || !owners.length) fail(row.id + " needs pinned external owners");
    evidence(row.evidence, row.id + " external evidence", true);
    const seen = new Set();
    for (const owner of owners) {
      if (!owner || !/^[A-Za-z0-9][A-Za-z0-9-]*\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(owner.repository ?? "")) {
        fail(row.id + " has an unsafe external repository");
      }
      if (!/^[a-f0-9]{40}$/.test(owner.revision ?? "") || /^0{40}$/.test(owner.revision)) fail(row.id + " needs a pinned external revision (40 lowercase hex characters)");
      const identity = owner.repository.toLowerCase();
      if (seen.has(identity)) fail(row.id + " repeats an external repository owner");
      seen.add(identity);
      for (const path of stringList(owner.sourcePaths, row.id + " external sourcePaths", true)) {
        if (!safePath(path)) fail(row.id + " has an unsafe external source path: " + path);
      }
      for (const value of stringList(owner.publicExports, row.id + " external publicExports", true)) {
        if (/^(?:[./]|file:|https?:)/.test(value) || value.includes("\\") || value.split("/").some(part => part === ".." || part === ".")) {
          fail(row.id + " has an unsafe external public export: " + value);
        }
      }
    }
  };

  for (const row of ledger.components) {
    if (!row || !row.id || ids.has(row.id)) fail("Duplicate/missing ID " + row?.id);
    if (!canonicalNames.has(row.id)) fail("Unknown/replaced canonical ID " + row.id);
    ids.add(row.id);
    if (row.name !== canonicalNames.get(row.id)) fail(row.id + " changed its canonical name");
    if (!/^P\d{2}$/.test(row.phase ?? "") || !nonempty(row.requirement) || typeof row.libraryScope !== "boolean") fail("Missing scope metadata for " + row.id);
    if (!implementationStatuses.has(row.implementationReview)) fail(row.id + " has an unknown implementation review status");
    if (!acceptanceStatuses.has(row.acceptance)) fail(row.id + " has an unknown acceptance status");
    stringList(row.sourceCandidates, row.id + " sourceCandidates");
    for (const source of row.sourceCandidates) {
      if (!source.startsWith("packages/")) fail(row.id + " has a source outside packages/");
      localFile("packages", source.slice("packages/".length), row.id + " source candidate");
    }
    evidence(row.evidence, row.id + " evidence");
    if (row.remainingLibraryWork !== undefined) stringList(row.remainingLibraryWork, row.id + " remaining library work");
    if (["implemented", "implemented-external"].includes(row.implementationReview) && row.remainingLibraryWork?.length) fail(row.id + " still has unfinished library requirements");

    if (row.externalImplementation !== undefined) {
      if (!["pending", "implemented-external"].includes(row.implementationReview)) fail(row.id + " has external ownership on a local implementation status");
      validateExternal(row);
    }
    if (row.implementationReview === "implemented-external") {
      if (!row.externalImplementation) fail(row.id + " needs pinned external implementation metadata");
      summary.externalImplemented++;
    } else if (["implemented", "partial"].includes(row.implementationReview)) {
      if (!row.libraryScope || !row.sourceCandidates.length || !row.evidence?.length) fail(row.id + " needs owned source and evidence");
      if (row.implementationReview === "partial" && !row.remainingLibraryWork?.length) fail(row.id + " must name its remaining library work");
      const exported = row.sourceCandidates.some(source => {
        const dist = resolve(rootDir, source.replace("/src/", "/dist/").replace(/\.tsx?$/, ".js"));
        return manifests.some(({ directory, manifest }) => exportTargets(manifest.exports).some(target => resolve(directory, target) === dist));
      });
      if (!exported) fail(row.id + " needs an independent public export");
      if (row.implementationReview === "partial") summary.localPartial++;
      else summary.localImplemented++;
    } else summary.pending++;

    if (row.platformEvidence !== undefined && (!row.platformEvidence || typeof row.platformEvidence !== "object" || Array.isArray(row.platformEvidence))) fail(row.id + " has invalid platform evidence");
    for (const [platform, gate] of Object.entries(row.platformEvidence ?? {})) {
      if (!REQUIRED_PLATFORMS.includes(platform)) fail(row.id + " has an unknown evidence platform " + platform);
      if (!gate || !platformStatuses.has(gate.status)) fail(row.id + " has an unknown " + platform + " evidence status");
      evidence(gate.evidence, row.id + " " + platform + " evidence", gate.status === "passed");
    }
    if (row.acceptance === "accepted") {
      if (!["implemented", "implemented-external"].includes(row.implementationReview)) fail(row.id + " cannot be accepted before implementation review is complete");
      for (const platform of REQUIRED_PLATFORMS) {
        const gate = row.platformEvidence?.[platform];
        if (gate?.status !== "passed" || !gate.evidence?.length) fail(row.id + " cannot be accepted without " + platform + " proof");
      }
      summary.accepted++;
    }
  }
  if (ids.size !== canonical.length) fail("The canonical ID set changed");
  return summary;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const ledger = JSON.parse(readFileSync(join(root, "docs/completion/library-progress.json"), "utf8"));
  const result = validateComponentProgram(ledger);
  console.log(`Component program: ${result.canonical} canonical IDs; ${result.localImplemented} local implementations, ${result.localPartial} partial, ${result.externalImplemented} pinned external implementations, ${result.pending} pending; ${result.accepted} accepted with all eight platform proofs.`);
}
