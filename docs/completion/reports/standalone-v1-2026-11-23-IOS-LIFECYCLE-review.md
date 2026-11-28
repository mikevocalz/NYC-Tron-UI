# Independent iOS lifecycle follow-up review

Verdict: PASS for the draft setup/lifecycle correction; a complete hosted native rerun remains required.

Reviewer: skill_discovery, independent of implementation by argent_environment_inspector. Applied standalone engineering code-review skill knowledge-work-plugins/engineering/1.2.0/skills/code-review/SKILL.md. No implementation edits or local device commands by reviewer.

Independently inspected the actual prior proof: direct JUnit succeeded in234.638seconds; root failed at sequence2 launchApp(clearState=true), before any root UI assertion, after81138ms with unreachable terminateApp. XCTest's HTTP server started, received terminateApp, failed terminating the application and tore down; client then saw EOF/connection refusal. Both cases identify iPhone Duo/iOS27.2. These facts establish a second-session transport failure, not its underlying OS/driver cause, and do not make root assertions passed.

The new kitchen-only setup strictly selects available iPhone17/iOS27.0, prefers an already booted exact match and otherwise boots that exact UDID. It waits for boot completion, rereads inventory and verifies the same UDID/name/runtime/availability/state before exporting it. Missing targets fail without latest/Duo/tablet/physical fallback. Inventories, boot logs and selection are retained separately. Its executable is guarded to hosted macOS CI; tests only import the pure selector. The successfully compiled Xcode27.1 SDK remains separately pinned. Other generic prewarmers are untouched.

Independently consulted the [official runner inventory](https://github.com/actions/runner-images/blob/main/images/macos/xcode-27-arm64-Readme.md): iPhone17 exists on27.0, while27.1 lists Duo only. Also inspected the [exact pinned Maestro source](https://raw.githubusercontent.com/mobile-dev-inc/Maestro/67d8a677029261fa424a45a10d08eacd6aa0deed/maestro-cli/src/main/java/maestro/cli/command/TestCommand.kt): reinstall-driver defaults true. Removing the prior iOS opt-out therefore requests a fresh driver for each separate mode invocation. Android retains its previous arguments. Neither the target pin nor reinstall is asserted to have cured the failure before a hosted run.

Independent targeted execution:38 tests passed, zero failed/skipped. Seven new tests cover exact selection over a booted newer Duo, booted preference, missing/unavailable targets, mode-specific driver arguments, clearState preservation and workflow/artifact wiring. Existing startup, KVM, archive/JUnit/fresh screenshot guards and five strict release integration contracts pass. git diff --check passed. All five file hashes and the patch digest match the final frozen manifest below.

All direct/root selectors/assertions, clearState, exact archive/version identities, platform binding, fresh output/screenshots and real JUnit requirements remain mandatory. No retries, skipped acceptance, fallback evidence, owner approval, release/tag/merge/publication or new hosted native pass is introduced or inferred. Setup/driver execution still requires validation on the real hosted target; physical/foldable and full screen-reader coverage remain unverified.

## Frozen bindings

```json
{
  "schemaVersion": 1,
  "base": "f0dd6ddf6358391ae5a358155c9497c0b92d66ab",
  "files": {
    ".github/workflows/kitchen-sink.yml": "ccf95e937bec876fb10792082456c660099c1981274095c9c480101c098bb504",
    "docs/completion/reports/standalone-v1-2026-11-23-IOS-LIFECYCLE.md": "83f519ee870c3d67c6be439e003f21b2a647499becddb09ebf2e45c310c8f9ed",
    "tooling/kitchen-sink/ios-target.test.mjs": "879b24296611c0f6527bd8cb3703340293bd7039448bf5de833388f4b50d02b4",
    "tooling/kitchen-sink/native-proof.mjs": "b361d0e6c39536d45e36a247974a879ef517c462dcc23daa6fd8efa07eb165b5",
    "tooling/kitchen-sink/prepare-ios.mjs": "0113e14edf1fc9742b27987855fce66e1d9e2d34cbfbb6f2b369332dfd56d13b"
  },
  "patchSha256": "ef3a88f38704c060ebba79eb47ecd5662159f63ca450be38dd7c9a0b632bdb95",
  "validation": {
    "focusedTests": 38,
    "candidateTests": 33,
    "failed": 0,
    "skipped": 0,
    "newHostedLifecycle": "NOT RUN"
  }
}
```
