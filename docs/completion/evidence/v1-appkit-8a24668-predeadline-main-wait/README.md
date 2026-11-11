# AppKit 8a24668: main-thread wait sampled before startup timeout

[Run 42964459265](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42964459265), native job [130338474296](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42964459265/job/130338474296), compiled successfully and then failed on the first `tron.window` show request:

> Native driver response timed out awaiting tron.window (request 2)

The watchdog fired while that request was pending and captured a sample before the deadline. The original driver timeout remained the reported error. **This run is diagnostic-only and establishes no native acceptance.** The tested-distribution upload was skipped.

This completed outcome supplements the [historical source-only checkpoint](../v1-appkit-8a24668-startup-watchdog-source/README.md). That checkpoint's source-review results and its contemporaneous unknown native outcome remain historical records. This receipt adds no source change and does not upgrade the ledger, distribution approval, physical-device acceptance or final combined-candidate status.

## Exact tested source

The actual checkout was `e72dcda68234a6506dfef07dc18ffd3b8de9f916`, confirmed in both original job logs. Its tree is `e2ea092f9d21a0a1e4a87cd9413ed39b0beb314a`, matching helper `8a2466835e14b579002a7fbaa3a240aaaf16e059`. The merge's ordered parents are `0edd5f302e99877191ba9a412c5c060571a5f6c9` and that helper. The complete helper tree was independently verified: 2,048 leaves and 284 directory object hashes.

The reviewed private verifier is blob `4507f860155746bb6f1a3a9528dd0e74de5d6492`. Its original 35-second client deadline, single request/session, activation operations and later native assertions remain the acceptance boundary. The watchdog latches diagnostic-only status before starting its observers.

## Completed gates

| Gate | Actual result and scope |
|---|---|
| Source job 130338332082 | 11 tests passed; 0 failed, cancelled or skipped. |
| Consumer preparation | 16 controller tests passed; 0 failed, cancelled or skipped. Package export/native-source/notice checks and archive-consumer preparation completed. |
| Installed public API comparison | Matched 15 typed subpaths and 33 reachable declarations. These are API inventory counts. |
| Native Foundation/socketpair transport probe | Seven original/patched cases, trace privacy and explicit closed-peer failure passed. |
| Standalone native build | Build envelope reports exit code 0 and success. |
| Native interaction verifier | Failed on initial show request 2; diagnostic-only. |
| Tested native distribution upload | Skipped. |

The [source log](source-job.log), [native log](native-job.log), and [completed metadata](workflow-metadata.json) retain these distinct results. They are not a combined count of product requirements or native UI checks.

## Timing and ownership observations

The app PID was **45713**, with parent PID **45695**. Preflight returned matching PID, parent and expected command. The recorded identity kind explicitly identifies `ps comm` as an `argv[0]` comparison; it does not claim an independent mapped-executable query.

| Observation | Recorded UTC time |
|---|---|
| Request 2 started; observer armed | 05:36:05.297 |
| Watchdog fired | 05:36:15.302 |
| Sampler process spawned | 05:36:15.322 |
| Sampler process closed | 05:36:20.585 |
| Original request rejected | 05:36:40.305 |
| Observer recorded original request settlement | 05:36:40.307 |
| Native main-continuation trace | Approximately 05:36:40.964 |

The sampler's recorded process lifetime was **5.263 seconds**, and it closed **19.720 seconds before command rejection**. Its requested collection duration was **2 seconds**, with a requested **10 ms** interval. The process lifetime does not measure the actual collection duration.

Command rejection occurred **35.008 seconds** after its recorded start; observer settlement was **35.010 seconds** after that start. These differences derive from the recorded wall-clock timestamps. The sampler exited with code 0 and confirmed close, with no timeout, termination signal or uncertain cleanup.

The native clock observations separately report completion-trace elapsed time `0.0001279166665426601` seconds and submission-start-to-main-entry elapsed time `35.33051962500008` seconds. These intervals do not isolate queue residence or establish cause. The late continuation matched the same PID and bundle; its owner was visible, while the application was inactive and the window was not key.

## What the sample establishes

The [exact typed sample payload](startup-sample.json) identifies one explicit matching main-thread group and **30 parsed, retained frame rows**. Every frame carries count **164**. Those counts belong to the same sampled branch; they must not be summed or interpreted as separate tests.

During the pending-request interval, the projected main-thread branch reaches `semaphore_wait_trap`. Its recorded frames include main-queue callback/drain and client-callout functions, an owned-application image-relative offset **355132**, Foundation frames and unidentified intermediate frames. **The unknown frames and offset do not identify a function or cause.**

This observation applies to the sampled points in this run. It does not establish a continuous wait throughout the 35-second request, explain historical runs, or demonstrate unperturbed startup. Sampling may affect scheduling.

The verifier had not reached its `root-main` mount check or later menu, tooltip and drag checks. Actual React mounting remains unknown. No tooltip observation or native gesture acceptance is inferred.

## Retained console evidence

The three JSON files preserve exact console-payload substrings, without their GitHub timestamp prefix or terminating line ending. They were not reserialized. The envelope files preserve the complete timestamped BEGIN-through-END substrings and their original line endings.

| Retained file | Bytes | Scope |
|---|---:|---|
| [source-job.log](source-job.log) | 19,325 | Complete decoded source-job log |
| [native-job.log](native-job.log) | 72,489 | Complete decoded native-job log |
| [workflow-metadata.json](workflow-metadata.json) | 7,611 | Normalized completed run, job and artifact metadata |
| [build-result.json](build-result.json) | 318 | Exact build console JSON payload |
| [build-result-envelope.log](build-result-envelope.log) | 472 | Native-log lines 510–512 |
| [startup-sample.json](startup-sample.json) | 6,712 | Exact watchdog console JSON payload |
| [startup-sample-envelope.log](startup-sample-envelope.log) | 6,856 | Native-log lines 528–530 |
| [startup-evidence.json](startup-evidence.json) | 12,140 | Exact startup-failure console JSON payload |
| [startup-evidence-envelope.log](startup-evidence-envelope.log) | 13,139 | Native-log lines 531–543, including 10 interleaved stderr lines |

[Provenance](provenance.json) binds the files, extraction positions, hashes, timing derivations and limits. The complete native log has SHA-256 `1d0d713361b449e5b7ca0ecc2c271ef810d49d2471c6abceb47538a5cd0c40b4`.

## Original-file and archive boundary

The following remain producer-reported observations from verified console/API bytes:

- The sampler reports a complete stable closed file of **231,664 bytes**, SHA-256 `3987635dfa5e3ed641cb1f2f4978833a53690f8ae71d073d6d15b0f8c602a461`. Its typed projection was inspected; the original sample file remains unextracted and uninspected.
- The successful build envelope reports a compiler transcript of **12,329,246 bytes**, SHA-256 `cd292a18b714cf9b514b397af816a490503956ffbc88b34befcfd74a849c956a`. The original transcript remains uninspected.
- Native-evidence artifact **13831257705** reports **1,477,151 bytes**, **47 uploaded files**, and SHA-256 `f356798f2fc54c9a1db1cedc08bd5aeb8eddf92c9ea8774a9900b4f1430f5394`. Upload output and artifact metadata agree. The original ZIP remains unretrieved and unextracted; its hash was not independently recomputed.

The complete job logs and extracted console payloads/blocks were independently fetched, hashed and read back exactly. Their verified bytes do not substitute for inspecting the original artifact members.
