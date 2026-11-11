# AppKit 12e35b4: initial-show timeout with measured dispatch interval

The standalone native build passed, then the first `tron.window` show request timed out again. This run **actually emitted the new timing fields**: the callback-trace interval was `0.0001507500001025619` seconds (about **0.151 ms**), and the interval from immediately before dispatch submission to main-block entry was `35.40724549999982` seconds (about **35.407 seconds**). These are observations from this run; they do not isolate queue residence, identify a blocked stack or establish the timeout cause.

The client recorded a **35.003-second** request interval before failing. A later reply matched the process and bundle and reported `visible: true`, `applicationActive: false` and `key: false`. That late reply did not satisfy the initial-show gate. The verifier did not reach `mounted('root-main')`, so **actual React mounting remains unknown**. Tooltip evidence was not allocated and no tooltip envelope was emitted. The new tooltip collector compiled but was not exercised.

## Exact source and completed workflow

| Field | Value |
| --- | --- |
| PR59 helper head | `12e35b48f75408ac4da4f8130853148ef00a5881` |
| Helper's sole parent | `5340d2d96412d0fcc5dc7cce21ced037d2de5c7b` |
| Actual merge checkout | `96e7558fbb859a2430b0f192bb5f11e940229cfa` |
| Actual tree | `d4352a6aba7cca7a9b898b6c25c9e4a5d729587d` |
| Ordered merge parents | `0edd5f302e99877191ba9a412c5c060571a5f6c9`, then `12e35b48f75408ac4da4f8130853148ef00a5881` |
| Workflow | [Run 42958884494](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42958884494), attempt 1, completed failure |
| Source job | [130320429814](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42958884494/job/130320429814), success |
| Native job | [130320556894](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42958884494/job/130320556894), failure in runtime acceptance |
| Owned app PID | `45188` |

Both complete job logs identify the actual merge checkout. The complete 2,048-leaf tree and all 284 directory objects, including the root, were independently recomputed. Only the two reviewed diagnostic source files differ from helper 5340: native driver blob `209e0ebfee4b9ba7fe902b64ec1bd09ae108b000` and verifier blob `2d9efdb7834b3ee461bf00e3fecbcc5c11b43964`.

[Completed metadata](github-metadata.json) retains exact source identities, selected API fields and step conclusions. Source tests passed **11**, installed-consumer tests passed **16**, and both sets reported zero failures, skips or cancellations. The installed API check matched **15 subpaths / 33 reachable declarations**. The native Foundation/socketpair probe passed seven cases. Standalone compilation returned exit code zero. These checks remain separate from application runtime acceptance, which failed with:

```text
Native driver response timed out awaiting tron.window (request 2)
```

The native evidence upload succeeded and reported **45 files**. Passed-only tested-distribution retention was skipped. Later native interaction gates and release acceptance remain held.

## Actual timing fields and their scope

The exact emitted [startup JSON line](startup-console-summary.json) contains one main-continuation record with these values:

| Field | Observed value |
| --- | --- |
| `clock` | `CACurrentMediaTime` |
| `clockExcludesSystemSleep` | `true` |
| `intervalsAreNotQueueResidence` | `true` |
| `intervalsDoNotEstablishCause` | `true` |
| `completionTraceElapsedSeconds` | `0.0001507500001025619` |
| `submissionStartToMainEntrySeconds` | `35.40724549999982` |

The reviewed native source samples the clock immediately before the existing callback trace, immediately before the unchanged `dispatch_async` call, and as the first statement inside its main block. There is no logger or metadata collection between the second sample and dispatch. The first interval includes the callback trace and possible descheduling. The second includes dispatch work and possible descheduling; it is **not isolated queue-wait time**. The clock excludes system sleep under the reported clock contract.

The first measured interval is short **in this run**. It does not prove that logging is never causal in other operations or explain earlier failures. Neither interval identifies a blocked stack, starvation, blocking, a framework defect or the precise cause of this timeout.

The accompanying wall-clock sequence is retained separately:

| Observation | Reported timestamp or interval |
| --- | --- |
| Client starts request 2, `tron.window` | `2026-11-11T04:42:14.270Z` |
| Workspace-completion callback marker | epoch `1794372134.378285`; non-main, `hasApplication: true`, `hasError: false` |
| Client records failure | `2026-11-11T04:42:49.273Z`; recorded request interval **35.003 seconds** |
| Main-continuation marker | epoch `1794372169.7856889`; approximately **35.407404 seconds** after the callback marker |
| Identity checked | epoch `1794372169.788363`; `sameProcess: true`, `sameBundle: true` |
| Reply prepared | epoch `1794372169.789552`; `ok: true`, visible but neither active nor key |
| Transport send completed | epoch `1794372169.789856`; 158 bytes, `replacedWithFailure: false` |

These wall-clock timestamps do not independently establish monotonic elapsed time or causality. The raw startup projection reports all ten matching activation records, ten transport records and eight command records retained, without malformed or omitted matches. Authentication and ping succeeded before request 2.

## Complete log text and original interleaving

The following complete decoded GitHub job logs and exact extracted text were independently hashed over their UTF-8 bytes. The JSON lines were retained without reserialization or added newlines.

| Retained file | Bytes | Independently recomputed SHA-256 |
| --- | ---: | --- |
| [source-job.log](source-job.log) | 19,235 | `578ed358b08f6931451bd212cf17a80bd6de2ca58229658ec14bceba51f00086` |
| [native-job.log](native-job.log) | 65,531 | `ad562522d15fdf9a3c299a417c8e688fbb9d1742a42f2fcac6086ce7a30c6430` |
| [build-console-summary.json](build-console-summary.json) | 318 | `93f2356d6d435276d3735f3edf8cfc81a700e36cfe391bc4c7790f23ec457d32` |
| [startup-console-summary.json](startup-console-summary.json) | 12,142 | `2f6a6ef04b8241d668fb9456f1952642a5df2293849fe85bbbf3eb2277a253e4` |
| [startup-console-block.txt](startup-console-block.txt) | 13,141 | `8df49767e28089e7a93390d1f084cbf0b360f28520e3f2f605172987ac78d869` |

Extraction requires unique standalone markers after removing only the GitHub timestamp prefix; marker strings echoed inside build-wrapper source are not accepted as emitted markers.

The **13,141-byte original startup block** preserves ten interleaved stderr lines, including the primary exception, stack lines, blank lines and Node version. The complete JSON remains one independently retained line. No tooltip BEGIN or END marker occurs in this completed log.

## Original-file and sample boundary

The original files below have **producer-reported** sizes/hashes. Their bytes remain uninspected here:

- `build-console.log`: 12,329,323 bytes, reported complete/unnormalized, SHA-256 `9774e32d5d12266dea9f19d988151b1d7ec65078bab04d9575a4262eb9d3c193`.
- `startup-app-log-snapshot.log`: 5,380 bytes, SHA-256 `555c703949088b1d3acfb03fceec2b8d0b424fe5bee8c21d306a28bb9a45373b`. This is an exclusively retained read-time prefix of live `app.log`, not the eventual live-log hash. The producer reports stable identity and no observed unread bytes at that read; later appends remain possible.
- `commands.jsonl`: 841 bytes, SHA-256 `b339b4a8e049271dcf49f690de8d8be6edcd491090a3369332aab710ac0551f7`, reported complete stable read.
- `native-process-failure.json`: 1,321 bytes, SHA-256 `6fa223c7b63a1268489a7f54d9c53839437d9913bfb80fa068c38edcd3b9e7c6`, reported complete stable read.
- `native-process-sample.txt`: SHA-256 `055e74fd2c12be8aebbce31f420673c75b0f518c0d8f87c63f6995ab8ce67333`, recorded by the producer and not reread by the reporter.
- Native artifact `13828758845`: 1,406,086 bytes, 45 uploaded files reported, producer/API SHA-256 `2b25ff01c700aec4e92544dc34028e8e7eebfb8340220df50c8013a7e790ccfa`. Download returned a file reference; raw ZIP bytes and members were not extracted or independently hashed.

The post-timeout process projection records a null child exit code/signal at `04:42:49.276Z`. Before/after process queries reported exit code zero; the sample command reported exit code zero, a configured two-second duration at 10 ms intervals, 28 thread groups and thread stacks present. The original stack text remains uninspected. These metadata do not establish application health or explain the interval before timeout.

[provenance.json](provenance.json) separates independently inspected log/envelope hashes from producer-reported original-file hashes and records the exact timing semantics. This receipt changes no native behavior, permission, deadline, assertion or cleanup and triggers no retry. Earlier results remain historical observations of their own exact source; no earlier failure's cause is resolved by this run.
