import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isMainModule } from "../../../../tooling/library-components.mjs";
import { validateComponentProgram as validateHistoricalProgram } from "./tooling/verify-component-program.mjs";
export { CANONICAL_BASELINE_SHA256, RECORDED_ADDITION_IDS, REQUIRED_PLATFORMS, parseCanonicalBaseline }
  from "./tooling/verify-component-program.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
export const LEGACY_PROGRAM_ARCHIVE = "docs/completion/reports/2026-11-22-forge-program";
export const LEGACY_PROGRAM_LEDGER = LEGACY_PROGRAM_ARCHIVE + "/docs/completion/library-progress.json";
const SNAPSHOT_SHA256 = "802713806e66e69e892560084397d06d8dc5f9318ae6706eef60ce13a9108bc3";

export function readLegacyProgramSnapshot(rootDir = root) {
  const bytes = readFileSync(join(rootDir, LEGACY_PROGRAM_LEDGER));
  if (createHash("sha256").update(bytes).digest("hex") !== SNAPSHOT_SHA256) throw new Error("Historical program snapshot changed");
  return JSON.parse(bytes);
}

export function readLegacyProgramBaseline(rootDir = root) {
  return readFileSync(join(rootDir, LEGACY_PROGRAM_ARCHIVE, "docs/completion/baseline-roster.tsv"));
}

export function validateComponentProgram(ledger, options = {}) {
  return validateHistoricalProgram(ledger, { rootDir: root, ...options });
}

if (isMainModule(import.meta.url)) {
  const result = validateComponentProgram(readLegacyProgramSnapshot());
  console.log(`Historical program archive check: ${result.canonical} rows and ${result.additions.total} additions; no acceptance status changed. Active ownership: Nitro Forge. Historical case study only; not a library release gate.`);
}
