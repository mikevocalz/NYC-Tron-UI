# NYC-Tron UI 1.0.0-rc.2 release checklist

Prepared 2026-11-13 for the integrator and independent R2 reviewer. This is a
prerelease preparation record. It does not authorize a tag, create archives,
record platform acceptance or satisfy the stable distribution gate.

## Candidate scope and dependencies

The release branch starts at T2's prospective head
`3fc325dd4bc8c3979f7462130e73c2d05331a07c` (PR #73). T1, T3, T4 and B-11
already landed on `main`; #73 must land before this release preparation merges.
If #73 lands with a different tree, reconcile that change and review this
candidate again. The release target is the final merged commit, with its own
passing checks, rather than the earlier T2 head.

Sixteen distributable manifests carry `1.0.0-rc.2`: fourteen direct workspace
packages and the isolated `@nyc-tron/windows-fluent-fabric` and
`@nyc-tron/macos-appkit` packages. Their exact internal peer pins and desktop
example archive filenames move together. The root's private tooling version
`0.1.0` remains separate, as in the rc.1 release (PR #67).

No dependency version or graph changed. The only three tracked lockfiles are
`pnpm-lock.yaml` and the UI/Expo browser `package-lock.json` files. None contains
the rc.1 package version: workspace links use `link:` and isolated desktop
consumer locks are generated from the actual archives in CI. There is no
committed nested desktop lockfile to regenerate. CI must confirm frozen
workspace installation and produce fresh isolated consumer locks.

Desktop API snapshots update only versioned dependency identities from rc.1
to rc.2, following PR #67. This is a metadata edit, not a claim that the local
declaration generator ran. Their compiler checks below must confirm the edit.
Historical acceptance reports and released rc.1 install links retain their
original versions and counts.

## Pre-release gates

- [ ] PR #73 is merged after independent R1 sign-off and required checks pass
  at its exact head. No unresolved blocker carries into the release candidate.
- [ ] R2 signs the exact release-preparation head, including version cohort,
  API metadata, lockfile rationale and this checklist.
- [ ] Required pull-request checks pass on the release-preparation head. The
  source, exports, declarations and component-ledger checks are separate from
  browser, simulator and desktop runtime results.
- [ ] The integrator merges with an exact-head guard after all checks pass.
  Record the resulting `main` commit as the prospective tag target.
- [ ] The owner explicitly approves tagging `v1.0.0-rc.2` at that reviewed
  target. No approval is inferred from this checklist or its status fields.
- [ ] Confirm the tag/release does not already exist. Never replace existing
  assets or move an existing release tag.

The release workflow must pass all eight reusable gate groups at its selected
commit: source/package/API checks; UI browser; overlay browser; installed
iOS/Android native compilation and runtime; installed release consumers;
Windows native compilation/UI Automation; AppKit controls/window lifecycle;
and reference flows, captures and render measurements. Checks on an earlier
commit do not satisfy this release run.

## Release execution and concrete packet

After owner tag approval, the integrator uses the existing
`.github/workflows/release.yml` at the exact approved commit. Its tag-triggered
path verifies the tag; its manual path creates the tag at the selected commit.
Both paths publish after the gates pass, so neither is a preparation-only run.

- [ ] Record the release run URL and source revision. Verify every gate group
  above passed and inspect failures before any retry.
- [ ] The packer produces fourteen workspace archives with the expected
  version and inspects their export targets, required licenses and notices.
- [ ] The merger retains the two exact desktop archives installed by passing
  native consumer jobs. Their source revision, version, archive hashes and
  shared-peer hashes match this candidate; neither archive is repacked.
- [ ] Inspect the retained `release-candidate-v1.0.0-rc.2` artifact: sixteen
  `.tgz` files, one `SHA256SUMS`, and both native tested-package receipts.
- [ ] Verify archive bytes against `SHA256SUMS`, inspect all sixteen bundled
  manifests and retain the packet identity with the release run.
- [ ] Inspect license/notice contents, including platform-services' MPL-2.0
  Mediabunny source-availability statement and app-identity's Roboto
  Apache-2.0 text. Packaging facts do not establish owner legal approval.
- [ ] Confirm readiness reports `candidate`/`prerelease`, and that the owner
  review and component-acceptance records were not promoted.
- [ ] Confirm the published release is a prerelease, has exactly the sixteen
  archives and `SHA256SUMS`, and every downloaded asset matches the retained
  packet. Record its URL and checksum-manifest hash.
- [ ] Verify fresh installed consumers from the published URLs, then permit
  Forge F2 to pin those immutable rc.2 URLs and verified hashes in its own PR.

No packet, checksum hash or published URL is asserted in this preparation.
Actual archives and their hash can only be recorded after the run produces
them. The unmodified workflow's retained candidate artifact is the review
packet, not a locally invented manifest.

## Stable-only follow-up

Stable `1.0.0` remains blocked. T5 must complete the reviewed Tier 1 acceptance
work and gate change. T6 needs the owner's own GitHub comment on the exact
stable version and checksum-manifest hash, after inspecting its sixteen
archives and included notices. The uncapped-peer policy question remains in
`V1_DECISIONS.md` D1/D5 and `SUPPORT.md`; this prerelease does not decide it.
No agent posts or simulates the owner's approval comment.

## Rollback triggers and response

Stop publication if a required check fails, a desktop receipt names another
revision, any archive/peer checksum or version differs, a required license or
notice is missing, or an existing tag/release would be replaced. Preserve the
failed run and artifacts, fix the source in a reviewed PR, and rerun against
the resulting candidate. Do not weaken a validator to make this candidate pass.

After publication, halt Forge adoption if a downloaded asset differs from the
retained packet, a clean consumer cannot install the pinned archives, a prior
public caller no longer compiles, or a required reference/window flow fails.
Keep existing tags and bytes immutable. Revert the affected consumer pin to
its previously verified version through a reviewed PR and prepare a new
prerelease version for corrected archives. State the failing platform and
reproduction in the replacement release notes. Hardware-only gaps remain
documented limitations, not evidence of a passing session.

There is no server rollout, database migration or feature-flag change here.
No application error-rate or latency baseline was measured, so no numeric
monitoring threshold is invented.

## Skills and preparation evidence

Applied `engineering:deploy-checklist` and `engineering:documentation` from
the installed engineering 1.2.0 skills, plus the repository's no-ai-slop writing
skill. Their output is the gate list, execution/packet steps and rollback
criteria above. Existing version/release tooling and native owners are reused.
No runtime, platform configuration, navigation or pane contract changed.

Local preparation checks and their real output are retained beside this
candidate's evidence record. Full installation, declaration generation,
packing, browser/native tests, tag creation and publication are NOT RUN by
this preparation. Passing source tests do not check archive contents.
