# Independent native CI setup follow-up review

Verdict: PASS for the reviewed draft CI setup correction. Hosted native runtime results remain pending.

Reviewer: skill_discovery, independent of implementation by argent_environment_inspector. Applied standalone engineering code-review skill knowledge-work-plugins/engineering/1.2.0/skills/code-review/SKILL.md. No implementation edits or device actions by reviewer.

The Android workflow uses the action's documented KVM udev permissions, checks readable/writable character device access, explicitly requires hardware acceleration and performs the supported pre-launch acceleration check. It fails instead of selecting unsupported TCG emulation. API level, architecture, installed candidate and both import-path acceptance scenarios remain unchanged. Independently consulted the [upstream action documentation](https://github.com/ReactiveCircus/android-emulator-runner), which documents these permissions and action inputs.

Actual pinned Maestro startup reproductions distinguish an analytics initialization failure from a version mismatch, then an otherwise successful promotion banner from exact version output. The correction disables telemetry/promotions with the switches documented by the pinned CLI itself and preserves exact stdout.trim() equality to 2.12.1. It does not accept a version substring or strip unknown output. Both version and flow subprocesses get these switches; HOME and existing JVM configuration are preserved. Failure diagnostics are bounded, status/signal/error/time are retained, and the version probe remains time-limited. Exclusive output ownership is established before diagnostics; prior outputs cannot be reused. Archive identity, JUnit executed/failure/skipped checks and fresh per-stage screenshot checks are preserved.

Independent checks: 24 targeted collector/workflow tests passed, zero failed/skipped. Negatives include 2.12.10, duplicate/promotion output, correct stdout with nonzero exit, timeout, excessive output, missing executable, foreign/unindexed archives, stale screenshots, absent new screenshot and missing/failed/skipped JUnit. Workflow integration guards continue requiring all native evidence and strict library publication checks. git diff --check passed.

Independently verified the actual task-owned Maestro ZIP SHA-256 54dbb0716425626604973cbb374c585ca30272375d9ce15177a1152765ddd9d7 against the preserved pin. Invoked only its --version via the new helper using Java17 and reviewer-owned Java state: status0, stdout exactly 2.12.1 plus newline, empty stderr, no error, 1126ms. No emulator, simulator or app was launched. This establishes CLI startup, not native application acceptance.

No dependency, native source, application window/orientation, API baseline, owner label or distribution approval is changed or inferred. The previously failed Android emulator and iOS collector runs remain failures; compile success alone is not runtime proof. No release/tag/merge/publication occurred in this review.

## File SHA-256 bindings

```json
{
  ".github/workflows/kitchen-sink.yml": "1ee51f31ee2a4dcf3d9ce62b5aa115007383fdff26d16577d82c2c0de6141251",
  "tooling/kitchen-sink/native-proof.mjs": "e5f7347c39555c2ea40e6d0d3edddf317fc0a6446107f72abcb03db17dd67c92",
  "tooling/kitchen-sink/proof.test.mjs": "ad99a97e6898e77acb8893213a26ca78915e648418811e0907f57ef2985e1b91",
  "tooling/kitchen-sink/maestro-version.mjs": "d6326d3f8df6d952b8f1eae09dd26720927e89b1166c690c1946a089b9671c30",
  "tooling/kitchen-sink/maestro-version.test.mjs": "5bd4c8dd3aaea6a25cac10da5cddfa351581a8b0912e4f8c8347682cf1069b68",
  "tooling/kitchen-sink/native-ci.test.mjs": "8ce57a035b1f6fc413fbec579ca9bff0faa96ae60f83522af79196aaedd366b7",
  "docs/completion/reports/standalone-v1-2026-11-23-NATIVE-CI.md": "52a046f2e0ae19f8fa1884da18247507f6a885d4b602ea5b70ff6e43b2623583",
  "docs/completion/reports/standalone-v1-2026-11-23-NATIVE-CI-version-repro.json": "1019fbbb114ab204a2c6f3678a8dca211058fdbaf0884a1e07dcb16cf34b7c14"
}
```

Final portable implementation report and actual diagnostic records reviewed. Machine home prefix is explicitly redacted in the published failing stream; original raw local evidence remains separate. Successful receipts now hash the version diagnostic as an artifact. Final eight-file freeze reviewed; no further finding.

Final CI discovery correction independently reviewed: the Ubuntu candidate now executes node --test tooling/kitchen-sink/*.test.mjs before candidate packing, covering all three kitchen regression files. A focused contract guards this command and Ubuntu job. The exact candidate command independently passed20tests; the combined candidate plus five release-integration tests independently passed25tests, zero failures/skips. This replaces reliance on global tooling/tests discovery, which does not discover kitchen test files. Final workflow/test/report SHA bindings above supersede the earlier24-test freeze; helper/acceptance code is unchanged.
