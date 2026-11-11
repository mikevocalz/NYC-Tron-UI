# AppKit 8e5ee2e: popover source changed; inspector status wait still timed out

This receipt records [completed AppKit workflow 42982526723](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42982526723), which tested helper `8e5ee2e3c153d04f67f5d53983b308554a4f969c` through actual merge `d329a921bf3ee6183d94bc83204451bf2bc7cc93`.

Compilation and the initial native activation succeeded. The current private-enabled tooltip summary again reports `passed`. The overall runtime still failed at **Timed out waiting for Native inspector dismissed**, the same application-status predicate reached in the separate a957 run. The following native popover-visibility check was not reached. This result does not establish the failure's cause, the native popover's final visibility, or successful resolution by the shipping-source change.

## Exact tested source

- Helper sole parent: `a957d4059b8a86735f2c152371eb7a2c2bd4e4ae`.
- Actual merge ordered parents: `ac5d69585a52a6e945dc996ea08030e190574699`, then `8e5ee2e3c153d04f67f5d53983b308554a4f969c`.
- Shared exact tree: `04c43947361d463940ccfe7cbb02ca8b48382929`; all 2,050 leaves and 284 tree hashes independently verified.
- Source job [130396022726](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42982526723/job/130396022726): actual checkout at source-log line 123.
- Native job [130396236429](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42982526723/job/130396236429): actual checkout at native-log line 113.

There is exactly one changed path relative to a957: `packages/macos-appkit/spark/macos/NYCTronPopover.mm`, from blob `fc5da2316f654c491e39bdd0898f24e6d784d90a` to `ed832b570fff105114885e22dae134e1ac8597d4`. The acceptance driver remains `b87bf12633490c1e0f4c17ee081fcd8fcc165919`, and the verifier remains `f21e9349b35922ad689a2f6320ed651b5557de64`.

This run does not certify the separately prepared correction to private-text provenance and selected-window binding. It also does not substitute for the aggregate's source or native validation.

## Actual gates and first failure

| Gate | Result |
| --- | --- |
| AppKit source gate | 13 passed; 0 failed, cancelled or skipped; reported duration 466.133429 ms |
| Installed-consumer tests | 16 passed, 0 failed |
| Installed public API | Matched 15 typed subpaths and 33 reachable declarations |
| Native Foundation/socketpair probe | Seven original/patched cases, trace privacy and explicit closed-peer failure passed |
| Standalone application compilation | Success; build exit code 0 |
| Current-candidate tooltip summary | Passed under source permitting the private AppKit text read |
| Overall runtime acceptance | Failed at inspector application-status wait |
| Tested-distribution upload | Skipped |

These numbers describe separate gates. The 13-test AppKit preparation/source gate is also separate from the helper's broader 1,187-test source suites, retained in the [source/installed-browser receipt](../v1-source-8e5ee2e-installed-consumers/README.md).

Native-log line 536 contains the exact first runtime error:

> Timed out waiting for Native inspector dismissed

The stack identifies `waitFor` at verifier line 954 and the caller at line 1176. That caller awaits `popover('main', 'escape')`, then waits for the application status label to include `Native inspector dismissed`. The status helper at line 972 uses `label.includes(text)`.

The subsequent native `shown === false` check at line 1177 was not reached. The original Escape response payload and the relevant full command history were not independently inspected. Thus this receipt cannot decide whether the popover remained visible, closed without the expected application message, or followed another path. Later responder restoration, reopening and drag checks remain unexecuted.

The preceding responder, editing, resize and editor-preservation assertions occur earlier in the executed verifier. Reaching the later failure is a control-flow observation; their detailed raw interaction artifacts remain uninspected.

## Startup and tooltip observations

Request 2, `tron.window`, began at 08:10:47.383 UTC and returned successfully at 08:10:48.184 UTC: **0.801 seconds** between recorded timestamps. The native records report process 38237, matching process and bundle, with visible, key and active true.

The monotonic fields report 0.00013695833331439644 seconds around the completion trace and 0.6473059583333907 seconds from immediately before dispatch submission to first main-block entry. These intervals exclude system sleep and do not isolate queue residence or prove the cause of historical startup delays. No predeadline sample envelope was emitted.

The typed tooltip summary reports `passed`. Both permissions are true, and the initial leave, enter and final leave requests report success. The selected final observation is `outside-after-hover`: cursor (529, 514) outside trigger (249, 366, 160, 36), the pointer-sequence flag cleared, no help tags, and window 41 invisible/offscreen. The owner remains visible, key and active.

The earlier shown tag and the source of its matching text are absent from this console selection. The tested collector permits reading the private `_attributedString` field of `NSCustomToolTipDrawView`. Accordingly, the reported pass is not public-accessibility-only text evidence and does not independently identify which read supplied the matching text.

The producer reports the original `tooltip-hover.json` as 32,230 bytes with SHA-256 `797aad2ec2c9afc252966711a50dbb5205a63fce896029f8bcdad5bbcaab2f06`. That raw file and its captures remain uninspected.

## Original console records and raw-file limits

The complete decoded logs retain their original newlines and ANSI bytes:

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| source-job.log | 19,697 | `5fc9e7e876155573533e668048d9509461f3ae721087a18e0792175a6fda505b` |
| native-job.log | 79,095 | `fdef61604ff0e04f334feaf1ef8a5372de5fa2efee040be3510cde5b34aca0e9` |

The three JSON files are exact payload substrings from original console lines, without their timestamp prefixes or terminating line endings. Their companion envelopes preserve the complete original timestamped BEGIN-through-END bytes. Build and tooltip envelopes contain no interleaving; the startup envelope preserves nine interleaved stderr lines.

The failure reporter's live app-log snapshot is complete at that read boundary, not a final app-log hash. The command projection reads 262,145 bytes from a 515,483-byte file, leaving 253,338 bytes outside that bounded projection. It is not the full command history.

The post-failure process summary reports nine thread groups and sample SHA-256 `f0212899a24b22a141f06692ece1f55ee92e3d35d71609ba4d727b39fbdb7ca6`. The raw sample was not inspected. Its two-second argument is requested sampling duration, not independently measured collection duration or process-health evidence.

The build producer reports a complete 12,329,230-byte compiler transcript with SHA-256 `f3951717d36d874581738e7ecabd8c764dcd41a8ac2d0f359128a483975c7fda`. That original transcript was not retrieved.

Native artifact [13839381092](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42982526723/artifacts/13839381092) is reported as 1,579,848 bytes with SHA-256 `362b89206b6171d13f6172f8accf828ef6b00261bc9886e08c6c420df2c72c54`. The upload reports 51 files. The ZIP and its members were not extracted or viewed; original-file and archive identities remain producer/API-reported.

[provenance.json](provenance.json) contains all retained file identities, and [workflow-metadata.json](workflow-metadata.json) contains completed metadata and exact extraction locations. This receipt changes no source or gate, dispatches no run, and records no passed native distribution, complete release or eight-platform acceptance.
