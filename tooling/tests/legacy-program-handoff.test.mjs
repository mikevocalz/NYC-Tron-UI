import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { LEGACY_PROGRAM_ARCHIVE, LEGACY_PROGRAM_LEDGER, readLegacyProgramSnapshot, validateComponentProgram } from "../../docs/completion/reports/2026-11-22-forge-program/historical-program-reader.mjs";
import { generateCrossReference } from "../library-cross-reference.mjs";

const root = fileURLToPath(new URL("../..", import.meta.url));
const json = path => JSON.parse(readFileSync(join(root, path), "utf8"));

test("old ledger links resolve to a pinned Forge home while the historical record retains all row fields", () => {
  const pointer = json("docs/completion/library-progress.json");
  assert.equal(pointer.status, "moved");
  assert.equal(pointer.owner, "mikevocalz/nitro-forge");
  assert.match(pointer.commit, /^[a-f0-9]{40}$/);
  assert.equal(pointer.url, `https://github.com/${pointer.owner}/blob/${pointer.commit}/${pointer.path}`);
  assert.equal(pointer.components, undefined, "the pointer must not masquerade as library inventory");
  const archive = json(LEGACY_PROGRAM_ARCHIVE + "/ARCHIVE.json");
  for (const [path, expected] of Object.entries(archive.sha256)) {
    assert.equal(createHash("sha256").update(readFileSync(join(root, LEGACY_PROGRAM_ARCHIVE, path))).digest("hex"), expected);
  }
  const ledger = readLegacyProgramSnapshot();
  assert.ok([...ledger.components, ...ledger.additions].every(row => row.acceptance === "unverified"));
  assert.equal(validateComponentProgram(ledger).accepted, 0);
  assert.equal(validateComponentProgram(ledger).additions.total, ledger.additions.length);
});

test("lookup accepts the adopted ledger's pinned source links without inventing external imports", () => {
  const original = readLegacyProgramSnapshot();
  const adopted = structuredClone(original);
  const prefix = "https://github.com/mikevocalz/NYC-Tron-UI/blob/0e09d3be8263b3dbb2eab1a78e5dd66b83b68e44/";
  for (const row of [...adopted.components, ...adopted.additions]) row.sourceCandidates = row.sourceCandidates.map(path => prefix + path);
  const local = generateCrossReference(original), remote = generateCrossReference(adopted);
  assert.deepEqual(Object.entries(local.rows).map(([id, row]) => [id, row.importPaths]), Object.entries(remote.rows).map(([id, row]) => [id, row.importPaths]));
  for (const row of Object.values(remote.rows).filter(row => row.ownership.startsWith("external"))) assert.deepEqual(row.importPaths, []);
  adopted.components[0].sourceCandidates[0] = prefix + "packages/../outside.ts";
  assert.throws(() => generateCrossReference(adopted), /Invalid pinned Tron source URL/);
});

test("archive checkout attributes preserve frozen bytes and the reader rejects changed historical values", t => {
  const fixture = mkdtempSync(join(tmpdir(), "tron-archive-bytes-"));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  writeFileSync(join(fixture, ".gitattributes"), readFileSync(join(root, ".gitattributes")));
  const records = Object.keys(json(LEGACY_PROGRAM_ARCHIVE + "/ARCHIVE.json").sha256);
  for (const record of records) {
    const path = join(LEGACY_PROGRAM_ARCHIVE, record);
    mkdirSync(join(fixture, path, ".."), { recursive: true });
    writeFileSync(join(fixture, path), readFileSync(join(root, path)));
  }
  const git = args => execFileSync("git", ["-C", fixture, ...args], { stdio: ["ignore", "pipe", "pipe"] });
  git(["init", "--quiet"]);
  git(["add", ".gitattributes", LEGACY_PROGRAM_ARCHIVE]);
  const checkout = join(fixture, "windows-checkout");
  git(["-c", "core.autocrlf=true", "checkout-index", "--all", "--prefix=" + checkout.replaceAll("\\", "/") + "/"]);
  for (const record of records) {
    const path = join(LEGACY_PROGRAM_ARCHIVE, record);
    assert.deepEqual(readFileSync(join(checkout, path)), readFileSync(join(root, path)), "autocrlf must preserve archived bytes: " + record);
  }
  const file = join(checkout, LEGACY_PROGRAM_LEDGER);
  const bytes = readFileSync(join(root, LEGACY_PROGRAM_LEDGER));
  assert.deepEqual(readLegacyProgramSnapshot(checkout), readLegacyProgramSnapshot());
  const changed = JSON.parse(bytes);
  changed.components[0].acceptance = "accepted";
  writeFileSync(file, JSON.stringify(changed, null, 2) + "\n");
  assert.throws(() => readLegacyProgramSnapshot(checkout), /Historical program snapshot changed/);
});

test("archive CLI validates through a symlink or Windows junction and rejects a tampered archive", t => {
  const fixture = mkdtempSync(join(tmpdir(), "tron-bridge-cli-"));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  const alias = join(fixture, "live-alias");
  try { symlinkSync(root, alias, process.platform === "win32" ? "junction" : "dir"); }
  catch (error) {
    if (["EPERM", "EACCES", "ENOSYS"].includes(error.code)) { t.skip("filesystem does not permit test directory aliases: " + error.code); return; }
    throw error;
  }
  const invoke = directory => spawnSync(process.execPath, [join(directory, LEGACY_PROGRAM_ARCHIVE + "/historical-program-reader.mjs")], { encoding: "utf8", timeout: 30000 });
  const valid = invoke(alias);
  assert.equal(valid.status, 0, valid.stderr);
  assert.match(valid.stdout, /Historical program archive check:/, "an alias must validate, not silently return success");

  const tampered = join(fixture, "tampered"), badAlias = join(fixture, "tampered-alias");
  for (const path of [LEGACY_PROGRAM_ARCHIVE + "/historical-program-reader.mjs", "tooling/library-components.mjs", LEGACY_PROGRAM_ARCHIVE + "/tooling/verify-component-program.mjs"]) {
    mkdirSync(join(tampered, path, ".."), { recursive: true });
    copyFileSync(join(root, path), join(tampered, path));
  }
  const ledger = structuredClone(readLegacyProgramSnapshot());
  ledger.components[0].acceptance = "accepted";
  mkdirSync(join(tampered, LEGACY_PROGRAM_LEDGER, ".."), { recursive: true });
  writeFileSync(join(tampered, LEGACY_PROGRAM_LEDGER), JSON.stringify(ledger, null, 2) + "\n");
  symlinkSync(tampered, badAlias, process.platform === "win32" ? "junction" : "dir");
  const invalid = invoke(badAlias);
  assert.equal(invalid.status, 1, "a changed archive must fail even through an alias");
  assert.match(invalid.stderr, /Historical program snapshot changed/);
});
