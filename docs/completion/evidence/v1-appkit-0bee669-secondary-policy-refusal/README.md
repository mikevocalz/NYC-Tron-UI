# AppKit 0bee attempt 1: inspector checks returned, secondary show refused

## Result and exact source

Completed [run 42985584907, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42985584907/attempts/1) compiled the standalone native application and passed the earlier inspector sequence. Runtime stopped at the later `show('document-1')` call with:

> tron.window: The native test host refused interactive activation policy

This was a structured native failure response, not a client timeout. Full native acceptance failed and the tested-distribution upload was skipped. This receipt concerns attempt 1 only. The outer run can represent a later externally started attempt; no result from another attempt is assigned here.

| Identity | Value |
| --- | --- |
| Helper head | `0bee669639a5d9ffaa7c456343344ccd42283c04` |
| Head parent | `27b9d27000a7d02192e70e8c6eeed502f6f578a8` |
| Source tree | `9ac7c175174b52dbb0bdc987ea199f30214d4c62` |
| Actual source/native checkout | `3f9d3ad376bd6b4514ca691997c56dfc74888bec` |
| Merge parents, in order | `ac5d69585a52a6e945dc996ea08030e190574699`, then `0bee669639a5d9ffaa7c456343344ccd42283c04` |
| Source job | `130405869688` |
| Native job | `130406050238` |
| Attempt-specific metadata | `attempts/1` and `attempts/1/jobs`, observed 2026-11-11 08:32:39 UTC |

Both complete original job logs record the actual merge checkout: source log line 123 and native log line 113. Commit/merge metadata independently agrees on tree and ordered parents. Root separately verified the complete 2,050-leaf map and 284 tree-object hashes before this receipt.

Relative to the preceding 8e source, the two external commits add close-state diagnostics and replace blanket notification-observer removal with named old-owner-window removals. The shipping popover is blob `9e00e3d966569b5fc2c03dac2432fdfe67548177`; the acceptance driver is `6f119bca252082f18f573370e853bf2e86128934`. The verifier remains `f21e9349b35922ad689a2f6320ed651b5557de64`. This outcome does not independently establish the author's claimed historical notification-removal cause.

## Separate completed gates

| Gate | Original evidence |
| --- | --- |
| Source and preparation guards | 13 passed; zero failed/cancelled/skipped; reported 473.210467 ms |
| Installed consumer | 16 passed; zero failed/cancelled/skipped; reported 75.59575 ms |
| Installed declaration snapshot | 15 typed subpaths / 33 reachable declarations matched |
| Actual Foundation/socketpair transport probe | Seven original/patched native cases passed, with privacy and closed-peer checks |
| Standalone native compile | Build-result exit code 0; native compile step succeeded |
| Native interactions | Failed at secondary-window policy refusal |
| Evidence upload | Succeeded |
| Tested native distribution | Skipped |

These counts are different gates. They are not the full workspace test total, physical-device evidence, a passed native package, or final combined-release verification.

## Initial show and later refusal

The typed startup projection identifies owned PID **25836**. Initial `tron.window` request 2 started at **08:27:46.449 UTC** and returned `ok:true` at **08:27:46.665 UTC**, a recorded **0.216-second** interval. Its activation records verify the same process and bundle, with the owner visible, key and application active. The monotonic diagnostic reports a 0.00012249999997493433-second completion-trace interval and 0.14556766666669319 seconds from submission-start to main entry. Those intervals exclude system sleep; they do not establish queue residence or explain historical delays. No predeadline sample envelope was emitted.

Later `tron.window` request **164** started at **08:27:52.704 UTC** and returned `ok:false` at **08:27:52.705 UTC**. Executed verifier line **1212** binds that call to `show('document-1')`. Activation operation **2** records numeric policy **0** before and after the policy call, with `accepted:false`; the application was active while this window was non-key and not visible in both observations. These are the observed return/state values. They do not identify a host-policy restriction, a permission problem, an AppKit defect or the reason for refusal.

The exact first error is native log line **533**. Its stack locates the show helper at verifier line **959** and the caller at line **1212**. Runtime exit code 1 appears at native log line **544**. Later assertions for the secondary window's shared state, focus/resize identity and cross-window drag were not reached.

## Inspector progress and its evidence limit

The first failure at line 1212, together with the unchanged sequential verifier, establishes that the preceding assertions returned:

- Lines 1139–1163 exercised ordinary React measurement, move and press/release through the synthetic native responder path. This is not physical pointer-gesture evidence.
- Lines 1164–1175 checked inspector edits, owner resize, retained content/editor identity and continuing native field editing.
- Lines 1176–1178 awaited Escape, observed the application dismissal status, awaited native `shown === false`, and checked the original opener's first-responder identity.
- Lines 1179–1187 reopened the popover, checked retained content/field identity and value, then awaited controlled-close status and native `shown === false`.
- Lines 1190–1208 completed controlled sidebar/native appearance, accepted and rejected native text, and collection-selection assertions.
- Lines 1210–1211 observed the document-1 root and the two-real-window count before requesting its show/activation.

This is executed-source control-flow evidence. It is stronger than the preceding 8e status timeout, but the selected console records do not independently retain a `popoverDidClose` notification witness or every intervening command payload. The full app log, command file and captures remain uninspected. Successful earlier assertions do not establish the specific historical cause or which notification delivered the callback.

## Tooltip text boundary

The tooltip summary reports **passed** under source that permits a private `NSCustomToolTipDrawView._attributedString` read. Both event-posting permission and accessibility trust were `true`. Initial leave, enter and final leave requests report `ok:true`.

The console selects `lastObservation`, phase `outside-after-hover`: cursor **(529, 514)** is outside trigger **(249, 366, 160, 36)**; the pointer-sequence flag is cleared; there are zero help tags; window 41 is invisible/offscreen. The owner remains visible, key and active. The earlier shown tag and the matching text's private-read provenance are absent from this projection.

This result is not public-accessibility-only or VoiceOver text proof, nor validation of a separately reviewed future private-reader correction. The producer reports a complete 32,230-byte `tooltip-hover.json` with SHA-256 `0695d25673540a7d6bcd37161d66f4a419a42138eaab5b75ec888fcf5517bafb`; that original file and its images have not been independently inspected.

## What is retained

The eleven-file receipt contains both complete original job-log responses, three exact JSON lines, their full timestamped marker envelopes, normalized completed metadata, this README and provenance. JSON payloads are extracted without reserialization; envelopes retain original timestamps, line endings and interleaved stderr.

| Envelope | Native log lines | Exact JSON line | Interleaved stderr |
| --- | --- | --- | --- |
| Build result | 509–511 | 510 | 0 |
| Tooltip evidence | 527–540 | 528 | 11 |
| Startup evidence | 541–543 | 542 | 0 |

The tooltip envelope contains the original error and stack between its JSON line and end marker. These lines have not been removed or relocated. [provenance.json](provenance.json) records every retained file's byte count, Git blob and SHA-256; [workflow-metadata.json](workflow-metadata.json) binds the completed attempt, jobs, selected artifact IDs and executed-source observations.

The complete source log is **19,614 bytes**, SHA-256 `18930c31d6bc6a1c77f08c2af02efb70f6b19019ddc3a6ee9a6cc9bf8ac28442`. The complete native log is **80,367 bytes**, SHA-256 `1466980748f763d112ac54738a8092c6b690c4a934cbe6ba15ee0c70355a1bd1`. Both were independently retrieved, hashed and read back from immutable blobs.

## Original-file and projection limits

The producer reports a complete stable read of the **169,047-byte** command file, SHA-256 `5eb4ccd5f706b0c6edf23a65fa4d633f6a57c5d7e001977f84e37bffb7c25ae5`. The console nevertheless selects only **32 of 332 matching command rows**, omitting **300**. Complete file read does not mean complete command history is included here. Activation projects 12 of 12 matched records; transport projects 32 of 820, omitting 788.

The app-log snapshot is a producer-retained **194,760-byte read-time prefix** with SHA-256 `0733da0e450aa251734b193d5a1909250ca296bfb0c37a0ed0e148211bdd602a`. It was complete at the read boundary, but the live app log could later append; this is not its final hash. The producer's postfailure sample reports **13 thread groups** and SHA-256 `5884edd8a9416bb17c9d856acf28a9decf7efdf716fdc070cfba9b674acb4ef8`. The sample itself remains uninspected. Its requested two-second duration is not measured collection duration, and thread groups do not establish health or a failure cause.

The build marker reports **12,329,231 bytes** of original compiler transcript with SHA-256 `14018ce3353180bbfdd9800b907966c9c81fa34d0c4f93a4865bde5feccd36b5`. That transcript was not downloaded here; its digest remains producer-reported.

Native artifact **13839409875**, `macos-appkit-native-evidence`, is API-reported as **1,654,656 bytes** with SHA-256 `dc9acc0886c50878f04edd12427a3839f06fab9d946e0f18a5a0c9f02db1c6a6`. The attempt-1 upload reports **53 files**. Its ID/digest match the original upload lines and normalized metadata, but the ZIP hash has not been independently recomputed, no members were extracted, and no pixels were viewed.

No source, workflow, ref or PR was changed to create this receipt. Its author did not dispatch, rerun or cancel a job. Full native acceptance, actual cross-window OS drag, physical-platform evidence, final combined archives and owner distribution approval remain open.
