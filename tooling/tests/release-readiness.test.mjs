import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { libraryFixture } from "./fixtures/library-release.mjs";
import { distributionApprovalStatement, releaseChannel, validateReleaseReadiness, verifyReleaseInventory } from "../release-readiness.mjs";

const sha = bytes => createHash("sha256").update(bytes).digest("hex");
const pendingReview = () => ({ schemaVersion: 1, repository: "mikevocalz/NYC-Tron-UI", releaseVersion: "1.0.0", status: "pending", approval: null });

function fixture(t, options = {}) {
  const f = libraryFixture(t, options), {rootDir,artifacts,manifest,evidence,documentation,source} = f;
  const checksumBytes = readFileSync(join(artifacts,"SHA256SUMS"));
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
    { version: options.version ?? "1.0.0", manifest, evidence, documentation, review, artifacts, ...input }, { rootDir, loadApproval, source });
  return { ...f, review, response, validate };
}

test("release versions distinguish stable from actual prereleases and reject malformed semver", () => {
  assert.equal(releaseChannel("1.0.0"), "stable");
  assert.equal(releaseChannel("1.0.0-rc.1"), "prerelease");
  for (const value of [undefined, "1.0.0-", "01.0.0", "1.0.0-rc..1", "1.0.0-01", "1.0.0+candidate", "v1.0.0", "1.0.0\n"]) {
    assert.throws(() => releaseChannel(value), /invalid release version/);
  }
});

test("prerelease packaging reports library blockers without fetching or inventing owner approval", async t => {
  const f=fixture(t),review=pendingReview(),before=JSON.stringify({manifest:f.manifest,review});
  const result=await f.validate({version:"1.0.0-rc.1",artifacts:undefined,review},async()=>assert.fail("candidate cannot claim owner approval"));
  assert.equal(result.status,"candidate");assert.equal(result.library.componentCount,16);
  assert.equal(JSON.stringify({manifest:f.manifest,review}),before);
});

test("stable requires real evidence for its own stable export instead of historic program rows", async t => {
  const f=fixture(t);await assert.rejects(f.validate({evidence:{schemaVersion:1,receipts:[]}},async()=>assert.fail("missing evidence must fail before lookup")),/lacks exports, declarations, unit, accessibility, web, ios, android/);
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
  const f = fixture(t), before = JSON.stringify({ manifest: f.manifest, review: f.review });
  let requests = 0;
  const result = await f.validate({}, async url => {
    requests++; assert.equal(url, "https://api.github.com/repos/mikevocalz/NYC-Tron-UI/issues/comments/12345");
    return f.response;
  });
  assert.equal(requests, 1); assert.equal(result.status, "ready");
  assert.equal(result.library.componentCount, 16); assert.equal(result.inventory.archiveCount, 16);
  assert.equal(JSON.stringify({ manifest: f.manifest, review: f.review }), before);
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

test('explicit prerelease library requirement blocks missing proof but never authenticates stable distribution',async t=>{
 const f=fixture(t,{version:'1.0.0-rc.3'}),review=pendingReview();
 const optional=await f.validate({evidence:{schemaVersion:1,receipts:[]},review},async()=>assert.fail('prerelease must not authenticate distribution'));
 assert.equal(optional.status,'candidate');assert.equal(optional.library.status,'blocked');
 await assert.rejects(f.validate({requireLibrary:true,evidence:{schemaVersion:1,receipts:[]},review},async()=>assert.fail('missing library proof must fail')),/required library publication checks blocked/);
 const complete=await f.validate({requireLibrary:true,review},async()=>assert.fail('complete prerelease still does not authenticate stable approval'));
 assert.equal(complete.status,'candidate');assert.equal(complete.library.status,'passed');assert.equal(complete.distributionReview,'pending');
});
