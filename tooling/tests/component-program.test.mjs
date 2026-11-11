import assert from "node:assert/strict";
import test from "node:test";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { CANONICAL_BASELINE_SHA256, REQUIRED_PLATFORMS, parseCanonicalBaseline, validateComponentProgram } from "../verify-component-program.mjs";

const baselinePath = fileURLToPath(new URL("../../docs/completion/baseline-roster.tsv", import.meta.url));
const baselineBytes = readFileSync(baselinePath);
const canonical = parseCanonicalBaseline(baselineBytes);

function fixture(t) {
  const rootDir = mkdtempSync(join(tmpdir(), "nyc-tron-program-"));
  t.after(() => rmSync(rootDir, { recursive: true, force: true }));
  mkdirSync(join(rootDir, "docs/completion/reports"), { recursive: true });
  mkdirSync(join(rootDir, "packages/example/src"), { recursive: true });
  copyFileSync(baselinePath, join(rootDir, "docs/completion/baseline-roster.tsv"));
  writeFileSync(join(rootDir, "docs/completion/reports/proof.md"), "# Test fixture evidence\n");
  writeFileSync(join(rootDir, "packages/example/src/Control.ts"), "export function Control() {}\n");
  writeFileSync(join(rootDir, "packages/example/package.json"), JSON.stringify({
    name: "@fixture/example", exports: { "./Control": { default: "./dist/Control.js" } },
  }));
  const ledger = {
    schemaVersion: 1, baselineSha256: CANONICAL_BASELINE_SHA256, requiredPlatforms: [...REQUIRED_PLATFORMS],
    components: canonical.map(({ id, name }) => ({
      id, name, phase: "P04", requirement: "Test the canonical capability.", libraryScope: true,
      sourceCandidates: [], evidence: [], implementationReview: "pending", acceptance: "unverified",
    })),
  };
  const row = id => ledger.components.find(value => value.id === id);
  const local = row("A-01");
  Object.assign(local, { implementationReview: "implemented", sourceCandidates: ["packages/example/src/Control.ts"], evidence: ["reports/proof.md"] });
  const external = row("N-03");
  Object.assign(external, {
    libraryScope: false, implementationReview: "implemented-external", evidence: ["reports/proof.md"],
    externalImplementation: { owners: [{
      repository: "mikevocalz/nitro-forge", revision: "a".repeat(40),
      sourcePaths: ["packages/muse/src/pose.ts"], publicExports: ["@nitro-forge/muse/pose"],
    }, {
      repository: "mikevocalz/viro", revision: "b".repeat(40),
      sourcePaths: ["src/TrackedPose.ts"], publicExports: ["TrackedPosePublisher"],
    }] },
  });
  return { rootDir, ledger, row, validate: value => validateComponentProgram(value ?? ledger, { rootDir }) };
}

test("local and pinned external implementations count separately from pending external work", t => {
  const f = fixture(t), pending = f.row("N-10");
  Object.assign(pending, { libraryScope: false, evidence: ["reports/proof.md"], externalImplementation: structuredClone(f.row("N-03").externalImplementation) });
  assert.deepEqual(f.validate(), { canonical: 341, localImplemented: 1, localPartial: 0, externalImplemented: 1, pending: 339, accepted: 0 });
  delete pending.externalImplementation.owners[0].revision;
  assert.throws(() => f.validate(), /pinned external revision/, "pending metadata must be valid without claiming completion");
});

test("external completion requires revision, actual source paths, public exports and an existing report", t => {
  const f = fixture(t);
  const mutations = [
    [row => delete row.externalImplementation, /metadata/],
    [row => row.externalImplementation.owners = [], /external owners/],
    [row => delete row.externalImplementation.owners[0].revision, /revision/],
    [row => row.externalImplementation.owners[0].sourcePaths = [], /sourcePaths/],
    [row => row.externalImplementation.owners[0].publicExports = [], /publicExports/],
    [row => row.evidence = [], /evidence/],
    [row => row.evidence = ["reports/missing.md"], /missing file/],
  ];
  for (const [mutate, message] of mutations) {
    const ledger = structuredClone(f.ledger);
    mutate(ledger.components.find(row => row.id === "N-03"));
    assert.throws(() => f.validate(ledger), message);
  }
});

test("external repositories, paths and immutable revisions cannot be unsafe or mutable references", t => {
  const f = fixture(t);
  for (const repository of ["https://github.com/owner/repo", "../repo", "owner/repo/extra", "owner/repo?ref=main", "/owner/repo"]) {
    const ledger = structuredClone(f.ledger);ledger.components.find(row => row.id === "N-03").externalImplementation.owners[0].repository = repository;
    assert.throws(() => f.validate(ledger), /unsafe external repository/);
  }
  for (const path of ["../outside.ts", "/tmp/source.ts", "C:\\source.ts", "packages/../source.ts", "packages/%2e%2e/source.ts", "packages//source.ts", "packages/./source.ts", "source.ts?ref=main"]) {
    const ledger = structuredClone(f.ledger);ledger.components.find(row => row.id === "N-03").externalImplementation.owners[0].sourcePaths = [path];
    assert.throws(() => f.validate(ledger), /unsafe external source path/);
  }
  for (const revision of ["main", "v1.0.0", "A".repeat(40), "a".repeat(39), "0".repeat(40)]) {
    const ledger = structuredClone(f.ledger);ledger.components.find(row => row.id === "N-03").externalImplementation.owners[0].revision = revision;
    assert.throws(() => f.validate(ledger), /pinned external revision/);
  }
});

test("external ownership cannot masquerade as local implementation or source", t => {
  const f = fixture(t);
  for (const mutate of [
    row => row.libraryScope = true,
    row => row.sourceCandidates = ["packages/example/src/Control.ts"],
    row => row.implementationReview = "implemented",
  ]) {
    const ledger = structuredClone(f.ledger);mutate(ledger.components.find(row => row.id === "N-03"));
    assert.throws(() => f.validate(ledger), /external ownership/);
  }
});

test("local implementations need existing owned source, evidence and a public export", t => {
  const f = fixture(t);
  for (const [key, value, message] of [
    ["sourceCandidates", ["packages/example/src/Missing.ts"], /missing file/],
    ["sourceCandidates", ["packages/example/src/../src/Control.ts"], /unsafe path/],
    ["sourceCandidates", [], /owned source/],
    ["evidence", [], /owned source/],
    ["evidence", ["../../outside.md"], /unsafe path/],
  ]) {
    const ledger = structuredClone(f.ledger);ledger.components[0][key] = value;
    assert.throws(() => f.validate(ledger), message);
  }
  writeFileSync(join(f.rootDir, "packages/example/package.json"), JSON.stringify({ name: "@fixture/example", exports: {} }));
  assert.throws(() => f.validate(), /independent public export/);
});

test("the exact 341 canonical IDs and names cannot be replaced while retaining the count", t => {
  const f = fixture(t);
  const duplicate = structuredClone(f.ledger);duplicate.components[1].id = duplicate.components[0].id;
  assert.throws(() => f.validate(duplicate), /Duplicate/);
  const replacement = structuredClone(f.ledger);replacement.components[1].id = "ZZ-99";
  assert.throws(() => f.validate(replacement), /replaced canonical ID/);
  const removed = structuredClone(f.ledger);removed.components.pop();
  assert.throws(() => f.validate(removed), /341/);
  const renamed = structuredClone(f.ledger);renamed.components[0].name = "UnrelatedControl";
  assert.throws(() => f.validate(renamed), /canonical name/);
});

test("baseline contents and ledger baseline identity remain frozen", t => {
  const f = fixture(t), changed = structuredClone(f.ledger);
  changed.baselineSha256 = "a".repeat(64);
  assert.throws(() => f.validate(changed), /baseline hash changed/);
  writeFileSync(join(f.rootDir, "docs/completion/baseline-roster.tsv"), baselineBytes.toString().replace("WorkspaceHost", "DifferentHost"));
  assert.throws(() => f.validate(), /baseline SHA256/);
});

test("the required eight-platform scope cannot shrink, duplicate or substitute another platform", t => {
  const f = fixture(t);
  for (const requiredPlatforms of [REQUIRED_PLATFORMS.slice(0, 7), [...REQUIRED_PLATFORMS.slice(0, 7), "linux"], [...REQUIRED_PLATFORMS.slice(0, 7), "ios"]]) {
    assert.throws(() => f.validate({ ...f.ledger, requiredPlatforms }), /Required platform scope/);
  }
});

test("unknown implementation, acceptance and platform result statuses are rejected", t => {
  const f = fixture(t);
  for (const [key, value, message] of [
    ["implementationReview", "done-ish", /unknown implementation/],
    ["acceptance", "accepted-without-device", /unknown acceptance/],
    ["platformEvidence", { ios: { status: "probably-passed" } }, /unknown ios evidence status/],
    ["platformEvidence", { linux: { status: "passed", evidence: ["reports/proof.md"] } }, /unknown evidence platform/],
  ]) {
    const ledger = structuredClone(f.ledger);ledger.components[0][key] = value;
    assert.throws(() => f.validate(ledger), message);
  }
});

test("accepted rows require completed implementation and eight passing, existing proofs", t => {
  const f = fixture(t), row = f.row("A-01");row.acceptance = "accepted";
  assert.throws(() => f.validate(), /without ios proof/);
  row.platformEvidence = Object.fromEntries(REQUIRED_PLATFORMS.map(platform => [platform, { status: "passed", evidence: ["reports/proof.md"] }]));
  assert.equal(f.validate().accepted, 1);
  row.platformEvidence.pico.status = "partial";
  assert.throws(() => f.validate(), /without pico proof/);
  row.platformEvidence.pico = { status: "passed", evidence: [] };
  assert.throws(() => f.validate(), /pico evidence/);
  row.platformEvidence.pico = { status: "passed", evidence: ["reports/missing.md"] };
  assert.throws(() => f.validate(), /missing file/);
  row.platformEvidence.pico = { status: "passed", evidence: ["reports/proof.md"] };
  row.implementationReview = "pending";
  assert.throws(() => f.validate(), /before implementation review/);
});

test("partial work must stay visible and cannot be labeled implemented", t => {
  const f = fixture(t), row = f.row("A-01");row.implementationReview = "partial";
  assert.throws(() => f.validate(), /remaining library work/);
  row.remainingLibraryWork = ["Finish the native callback contract."];
  assert.equal(f.validate().localPartial, 1);
  row.implementationReview = "implemented";
  assert.throws(() => f.validate(), /unfinished library requirements/);
});
