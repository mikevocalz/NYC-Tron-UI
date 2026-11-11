# AppKit a957d40: current tooltip stage passed; inspector status wait timed out

This receipt records the completed [AppKit workflow 42979226147](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42979226147) for external helper `a957d4059b8a86735f2c152371eb7a2c2bd4e4ae`. The application compiled, the initial native activation succeeded, and this candidate's tooltip summary records `passed`. The overall native runtime failed later while waiting for the application status label to include **Native inspector dismissed** after an Escape command.

The candidate's expected-text collector permits a private AppKit ivar read. Its tooltip result belongs to that exact source; it is not public-accessibility-only text evidence or approval of a different candidate. The console projects the final outside-after-hover observation, so it does not independently expose the earlier shown tag or the provenance of the text that matched.

## Exact source and run

- Event: `pull_request`; helper head `a957d4059b8a86735f2c152371eb7a2c2bd4e4ae`.
- Helper sole parent: `1283fd6dea6cead03be7d0eb22863e02dbe648fd`.
- Actual merge checkout: `b296b206f7bcc7740f46e1e7435f490a138935ce`.
- Actual merge ordered parents: `ac5d69585a52a6e945dc996ea08030e190574699`, then the helper.
- Shared exact tree: `8cf08b5ce3331bad684f2efa33d9570b3e9702ed`; 2,050 leaves and 284 tree objects independently verified.
- Source job [130385691230](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42979226147/job/130385691230): actual checkout at source-log line 123.
- Native job [130385864600](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42979226147/job/130385864600): actual checkout at native-log line 113.
- Executed acceptance driver blob: `b87bf12633490c1e0f4c17ee081fcd8fcc165919`.
- Executed verifier blob: `f21e9349b35922ad689a2f6320ed651b5557de64`.

The helper changes three paths relative to its parent: the private acceptance driver, the verifier and the Spark README. The cancelled 1283 run and the direct-head 79a run remain separate outcomes.

## Completed gates and first failure

| Gate | Result |
| --- | --- |
| Source checks | 13 passed; 0 failed, cancelled or skipped; reported duration 470.190204 ms |
| Installed-consumer tests | 16 passed, 0 failed |
| Installed public API | Matched 15 typed subpaths and 33 reachable declarations |
| Native Foundation/socketpair transport probe | Seven original/patched cases, trace privacy and explicit closed-peer failure passed |
| Application compile | Success; build result exit code 0 |
| Current-candidate tooltip summary | Passed under source that permits the private text read |
| Overall runtime acceptance | Failed at the inspector application-status wait |
| Tested-distribution upload | Skipped |

These are separate gates and declaration counts, not an additive native-acceptance total.

Native-log line 537 contains the exact first runtime error:

> Timed out waiting for Native inspector dismissed

The stack identifies `waitFor` at verifier line 954 and the caller at line 1176. At that source line, the verifier first awaits `popover('main', 'escape')`, then awaits `status('Native inspector dismissed')`. The status helper at line 972 checks `label.includes(text)`; this is not an exact-equality assertion.

The separate next statement at line 1177 waits for the native popover's `shown` value to become false. It was **not reached**. This failure therefore does not establish whether the native popover remained visible, had closed without the expected application status, or failed along another path. The Escape response payload and the relevant full command history were not independently inspected. Later focus restoration, reopening and drag checks were not reached.

The preceding edit, ordinary React responder, owner-resize and editor-preservation assertions occur before this line in the executed verifier. Reaching this failure is a control-flow observation; this receipt does not substitute it for the uninspected detailed artifacts from those interactions.

## Tooltip result and evidence limits

The typed summary reports `status: passed` for this candidate. Both event-posting and accessibility permissions are true. Initial leave, enter and final leave requests report success.

The selected last observation is `outside-after-hover`: cursor (529, 514) is outside trigger (249, 366, 160, 36), the pointer-sequence flag is cleared, and no help tags are present. Window 41 is invisible and offscreen. The owner remains visible, key and active.

This final observation supports the reported outside/dismissed condition. The earlier shown tag, its string collection and the private read's provenance are absent from this console selection. The current source permits reading `_attributedString` from `NSCustomToolTipDrawView` into the same collected-string path. Consequently, the reported stage pass cannot establish that public accessibility getters supplied the expected text. It also does not independently identify which getter or private field supplied it in this run.

The producer reports the original `tooltip-hover.json` as 32,230 bytes with SHA-256 `4d06cab0430aef11ce389c7219ba53eff14ac375f3e03bf965d76115285ad9a1`. That file and its captures remain uninspected. No broad claim that all public accessibility text attributes are unavailable follows from this receipt.

## Startup and failure diagnostics

Request 2, `tron.window`, began at 07:43:25.969 UTC and returned successfully at 07:43:26.595 UTC: **0.626 seconds** between recorded timestamps. The native records report the same process and bundle, with visible, key and active true.

The monotonic timings report 0.0001042916665028315 seconds around the completion trace and 0.48336349999999584 seconds from immediately before dispatch submission to first main-block entry. They exclude system sleep and do not isolate queue residence or establish the cause of historical startup delays. No predeadline sample envelope was emitted.

The later failure reporter retained a live app-log snapshot. That snapshot is complete at its read boundary, not a final app-log hash. The command-file projection read 262,145 bytes from a 522,703-byte file; 260,558 bytes remain outside that bounded projection. It is not a complete command history.

A post-failure sample is producer-reported with eight thread groups and SHA-256 `af174115ee3b41d8d98b0be6b5800019b3f59f4f135958e532526da3b04cb63b`. The raw sample was not inspected. The two-second sampling argument is requested duration, not independently measured collection duration or evidence of process health.

## Retained originals

The complete decoded source and native job logs retain their original newlines and ANSI bytes:

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| source-job.log | 19,698 | `e0686022f3e90dbf59fa8c9466bb6a23c8d1a32f9ac1d6d6e99024b40530ce85` |
| native-job.log | 79,104 | `e12a0d72d65bf247ddf83b318001afbf3066f12ee9162f2030049d099cbd4881` |

Each JSON payload is the exact substring from its original console line, without its timestamp prefix or terminating line ending. Each companion envelope retains the exact complete timestamped BEGIN-through-END bytes. Build and tooltip envelopes have no interleaving; the startup envelope contains one interleaved source-location line. The remainder of the runtime error appears after that envelope and is preserved in the complete native log.

The producer reports a complete 12,329,229-byte compiler transcript with SHA-256 `23c71fb31b455f62fa5a327f8c93e65c13b26a2e46d5cdadb93391d3eda646be`. This is a producer-recorded file identity, distinct from the independently verified build-result JSON.

Native artifact [13837767030](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42979226147/artifacts/13837767030) is reported as 1,583,707 bytes, SHA-256 `67481b1aec4076fbb42fbf7a16baf1d5ad1d525041d28e1f00efc5a2eb3ecb18`, with 51 uploaded files. The ZIP, compiler transcript, original tooltip JSON, raw process sample and other members were not extracted or inspected. Their identities remain producer/API-reported.

See [provenance.json](provenance.json) for all retained identities and [workflow-metadata.json](workflow-metadata.json) for normalized completed metadata. No source changes, dispatch, rerun, cancellation, ref update or PR change was performed by this receipt's author. This failed native run establishes no passed package, complete release or eight-platform acceptance.
