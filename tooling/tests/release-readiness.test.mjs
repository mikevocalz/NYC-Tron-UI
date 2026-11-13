import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { CANONICAL_BASELINE_SHA256, REQUIRED_PLATFORMS, parseCanonicalBaseline } from "../verify-component-program.mjs";
import { distributionApprovalStatement, releaseChannel, validateReleaseReadiness, verifyReleaseInventory } from "../release-readiness.mjs";

const baseline = fileURLToPath(new URL("../../docs/completion/baseline-roster.tsv", import.meta.url));
const canonical = parseCanonicalBaseline(readFileSync(baseline));
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
const pendingReview = () => ({ schemaVersion: 1, repository: "mikevocalz/NYC-Tron-UI", releaseVersion: "1.0.0", status: "pending", approval: null });

function fixture(t) {
  const rootDir = mkdtempSync(join(tmpdir(), "nyc-tron-release-"));
  t.after(() => rmSync(rootDir, { recursive: true, force: true }));
  mkdirSync(join(rootDir, "docs/completion/reports"), { recursive: true });
  copyFileSync(baseline, join(rootDir, "docs/completion/baseline-roster.tsv"));
  writeFileSync(join(rootDir, "docs/completion/reports/test-proof.md"), "Test fixture only. This is not repository acceptance evidence.\n");
  const artifacts = join(rootDir, "artifacts");
  mkdirSync(artifacts);
  const checksums = [];
  for (let index = 0; index < 16; index++) {
    const relative = index === 14 ? "windows-fluent/rnw-fabric" : index === 15 ? "macos-appkit/spark" : "example" + index;
    const name = index === 14 ? "windows-fluent-fabric" : index === 15 ? "macos-appkit" : "example" + index;
    const directory = join(rootDir, "packages", relative);
    mkdirSync(join(directory, "src"), { recursive: true });
    writeFileSync(join(directory, "package.json"), JSON.stringify({
      name: "@nyc-tron/" + name, private: true, version: "1.0.0", exports: { "./Control": "./dist/Control.js" },
    }));
    writeFileSync(join(directory, "src/Control.ts"), "export function Control() {}\n");
    const file = "nyc-tron-" + name + "-1.0.0.tgz", bytes = Buffer.from("Archive hash fixture " + index);
    writeFileSync(join(artifacts, file), bytes);
    checksums.push(sha(bytes) + "  " + file);
  }
  const checksumBytes = checksums.join("\n") + "\n";
  writeFileSync(join(artifacts, "SHA256SUMS"), checksumBytes);
  const ledger = {
    schemaVersion: 1, baselineSha256: CANONICAL_BASELINE_SHA256, requiredPlatforms: [...REQUIRED_PLATFORMS],
    components: canonical.map(({ id, name }) => ({
      id, name, phase: "P04", requirement: "Test fixture capability.", libraryScope: true,
      sourceCandidates: ["packages/example0/src/Control.ts"], evidence: ["reports/test-proof.md"],
      implementationReview: "implemented", acceptance: "accepted",
      platformEvidence: Object.fromEntries(REQUIRED_PLATFORMS.map(platform => [platform, { status: "passed", evidence: ["reports/test-proof.md"] }])),
    })),
    additions: ["W-01", "W-02"].map(id => ({
      id, name: "AddedControl" + id, phase: "P04", gate: "T2", decision: "reports/test-proof.md",
      requirement: "Test fixture added capability.", libraryScope: true,
      sourceCandidates: ["packages/example0/src/Control.ts"], evidence: ["reports/test-proof.md"],
      implementationReview: "implemented", acceptance: "accepted",
      platformEvidence: Object.fromEntries(REQUIRED_PLATFORMS.map(platform => [platform, { status: "passed", evidence: ["reports/test-proof.md"] }])),
    })),
  };
  const manifestSha256 = sha(checksumBytes);
  const review = { ...pendingReview(), status: "approved", approval: {
    reviewer: "mikevocalz", manifestSha256,
    commentUrl: "https://github.com/mikevocalz/NYC-Tron-UI/pull/57#issuecomment-12345",
  } };
  const response = { id: 12345, html_url: review.approval.commentUrl,
    issue_url: "https://api.github.com/repos/mikevocalz/NYC-Tron-UI/issues/57",
    user: { login: "mikevocalz", type: "User" }, author_association: "OWNER", created_at: "2026-11-10T12:00:00Z",
    body: distributionApprovalStatement("1.0.0", manifestSha256),
  };
  const validate = (input = {}, loadApproval = async () => response) => validateReleaseReadiness(
    { version: "1.0.0", ledger, review, artifacts, ...input }, { rootDir, loadApproval, recordedAdditions: ["W-01", "W-02"] });
  return { rootDir, artifacts, ledger, review, response, validate };
}

test("release versions distinguish stable from actual prereleases and reject malformed semver", () => {
  assert.equal(releaseChannel("1.0.0"), "stable");
  assert.equal(releaseChannel("1.0.0-rc.1"), "prerelease");
  for (const value of [undefined, "1.0.0-", "01.0.0", "1.0.0-rc..1", "1.0.0-01", "1.0.0+candidate", "v1.0.0", "1.0.0\n"]) {
    assert.throws(() => releaseChannel(value), /invalid release version/);
  }
});

test("prerelease candidate packaging preserves pending acceptance and never fetches or invents owner approval", async t => {
  const f = fixture(t);
  for (const row of f.ledger.components) row.acceptance = "unverified";
  const review = pendingReview(), before = JSON.stringify({ ledger: f.ledger, review });
  const result = await f.validate({ version: "1.0.0-rc.1", artifacts: undefined, review }, async () => assert.fail("candidate must not claim owner approval"));
  assert.equal(result.status, "candidate"); assert.equal(result.program.accepted, 0);
  assert.equal(JSON.stringify({ ledger: f.ledger, review }), before);
});

test("stable cannot publish with any of the 341 rows unverified or with invented platform acceptance", async t => {
  const f = fixture(t);
  f.ledger.components[340].acceptance = "unverified";
  await assert.rejects(f.validate({}, async () => assert.fail("unverified scope must fail before owner lookup")), /1 of 341.*eight-platform proof/);
  f.ledger.components[340].acceptance = "accepted";
  delete f.ledger.components[340].platformEvidence.pico;
  await assert.rejects(f.validate(), /cannot be accepted without pico proof/);
});

test("rows added after the baseline block stable exactly like canonical rows and cannot be dropped to pass", async t => {
  const f = fixture(t);
  f.ledger.additions[1].acceptance = "unverified";
  await assert.rejects(f.validate({}, async () => assert.fail("an unverified addition must fail before owner lookup")), /1 of 2 added rows lack accepted eight-platform proof/);
  f.ledger.additions[1].acceptance = "accepted";
  delete f.ledger.additions[1].platformEvidence.quest;
  await assert.rejects(f.validate(), /W-02 cannot be accepted without quest proof/);
  const dropped = structuredClone(f.ledger);dropped.additions.pop();
  await assert.rejects(f.validate({ ledger: dropped }), /W-02 was removed/);
  const candidate = structuredClone(f.ledger);
  for (const row of [...candidate.components, ...candidate.additions]) row.acceptance = "unverified";
  const result = await f.validate({ version: "1.0.0-rc.2", ledger: candidate, review: pendingReview(), artifacts: undefined },
    async () => assert.fail("a prerelease never claims approval"));
  assert.equal(result.status, "candidate");
  assert.deepEqual([result.program.accepted, result.program.additions.accepted, result.program.additions.total], [0, 0, 2]);
});

test("stable cannot publish from pending, incomplete or locally forged distribution review", async t => {
  const f = fixture(t);
  await assert.rejects(f.validate({ review: pendingReview() }), /owner distribution review is pending/);
  for (const mutate of [
    record => { record.approval = null; },
    record => { delete record.approval.reviewer; },
    record => { record.approval.reviewer = "github-actions[bot]"; },
    record => { delete record.approval.commentUrl; },
    record => { record.approval.commentUrl = "https://example.org/approval"; },
    record => { record.approval.commentUrl = "https://github.com/other/repo/pull/57#issuecomment-12345"; },
    record => { delete record.approval.manifestSha256; },
    record => { record.status = "waived"; },
  ]) {
    const review = structuredClone(f.review); mutate(review);
    await assert.rejects(f.validate({ review }, async () => assert.fail("unsigned record must fail before lookup")), /distribution|approval|owner/);
  }
});

test("stable owner approval must authenticate the exact author, repository, statement, version and bytes", async t => {
  const f = fixture(t);
  for (const mutate of [
    response => { response.user.login = "someone-else"; },
    response => { response.user.type = "Bot"; },
    response => { response.author_association = "COLLABORATOR"; },
    response => { response.id = 12346; },
    response => { response.issue_url = "https://api.github.com/repos/mikevocalz/NYC-Tron-UI/issues/58"; },
    response => { response.html_url = response.html_url.replace("/57#", "/58#"); },
    response => { response.created_at = "not submitted"; },
    response => { response.body = "I have not approved this candidate."; },
    response => { response.body = "Not approved:\n\n" + response.body; },
    response => { response.body = response.body.replace("1.0.0", "1.0.1"); },
    response => { response.body = response.body.replace(f.review.approval.manifestSha256, "a".repeat(64)); },
  ]) {
    const response = structuredClone(f.response); mutate(response);
    await assert.rejects(f.validate({}, async () => response), /does not authenticate/);
  }
  await assert.rejects(f.validate({}, async () => { throw new Error("GitHub unavailable"); }), /GitHub unavailable/);
});

test("stable requires and verifies all sixteen archive hashes, including both isolated desktop packages", async t => {
  const f = fixture(t);
  assert.equal(verifyReleaseInventory(f.artifacts, "1.0.0", { rootDir: f.rootDir }).archiveCount, 16);
  await assert.rejects(f.validate({ artifacts: undefined }), /sixteen actual release archives/);
  const windows = join(f.artifacts, "nyc-tron-windows-fluent-fabric-1.0.0.tgz");
  writeFileSync(windows, "changed native archive");
  await assert.rejects(f.validate(), /checksum mismatch/);
  rmSync(windows);
  const sums = join(f.artifacts, "SHA256SUMS");
  writeFileSync(sums, readFileSync(sums, "utf8").split("\n").filter(line => !line.includes("windows-fluent-fabric")).join("\n"));
  await assert.rejects(f.validate(), /exact sixteen/);
});

test("omitting the AppKit archive cannot silently restore the older fourteen-package inventory", async t => {
  const f = fixture(t);
  rmSync(join(f.artifacts, "nyc-tron-macos-appkit-1.0.0.tgz"));
  const sums = join(f.artifacts, "SHA256SUMS");
  writeFileSync(sums, readFileSync(sums, "utf8").split("\n").filter(line => !line.includes("macos-appkit")).join("\n"));
  await assert.rejects(f.validate(), /exact sixteen/);
});

test("an authenticated approval for prior checksums cannot authorize a later artifact inventory", async t => {
  const f = fixture(t), review = structuredClone(f.review);
  review.approval.manifestSha256 = "b".repeat(64);
  await assert.rejects(f.validate({ review }, async () => assert.fail("different bytes must fail before owner lookup")), /different version\/archive bytes/);
  review.approval.manifestSha256 = f.review.approval.manifestSha256;
  review.releaseVersion = "1.0.1";
  await assert.rejects(f.validate({ review }), /different version\/archive bytes/);
});

test("only complete platform acceptance and a live exact owner approval can make stable ready without mutation", async t => {
  const f = fixture(t), before = JSON.stringify({ ledger: f.ledger, review: f.review });
  let requests = 0;
  const result = await f.validate({}, async url => {
    requests++; assert.equal(url, "https://api.github.com/repos/mikevocalz/NYC-Tron-UI/issues/comments/12345");
    return f.response;
  });
  assert.equal(requests, 1); assert.equal(result.status, "ready");
  assert.equal(result.program.accepted, 341); assert.equal(result.inventory.archiveCount, 16);
  assert.equal(result.program.additions.accepted, result.program.additions.total);
  assert.equal(JSON.stringify({ ledger: f.ledger, review: f.review }), before);
});

test("release retains candidate archives before readiness and requires both native desktop hosts plus reference evidence", () => {
  const workflow = readFileSync(new URL("../../.github/workflows/release.yml", import.meta.url), "utf8");
  const needs = workflow.match(/needs: \[([^\]]+)\]/)?.[1].split(",").map(value => value.trim());
  assert.ok(needs?.includes("windows-native")); assert.ok(needs?.includes("macos-appkit")); assert.ok(needs?.includes("native-feel"));
  const archiveStep = workflow.indexOf("name: Retain the candidate archives and checksums");
  const readiness = workflow.indexOf("run: node tooling/release-readiness.mjs");
  assert.ok(archiveStep > 0 && archiveStep < readiness && readiness < workflow.indexOf("gh release create"));
  assert.match(workflow, /name: Retain the readiness result[\s\S]*?if: always\(\)/);
  for (const name of ["winui-fabric", "macos-appkit", "native-feel-preview"]) {
    const reusable = readFileSync(new URL("../../.github/workflows/" + name + ".yml", import.meta.url), "utf8");
    assert.match(reusable, /^  workflow_call:/m);
  }
  assert.match(workflow, /name: windows-fabric-tested-package/);
  assert.match(workflow, /name: macos-appkit-tested-package/);
  assert.match(workflow, /merge-tested-package\.mjs[^\n]+windows-fluent-fabric/);
  assert.match(workflow, /merge-tested-package\.mjs[^\n]+macos-appkit/);
});
