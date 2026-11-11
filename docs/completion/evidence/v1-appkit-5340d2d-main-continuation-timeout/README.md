# AppKit 5340d2d: initial-show timeout between activation markers

The standalone native build passed, then the first `tron.window` show request timed out. The workspace-completion callback marker was recorded on a non-main thread; the main-continuation marker was recorded approximately **35.608 seconds later**, after the client's **35.004-second** recorded request interval. A later reply matched the process and bundle and reported the window visible, with `applicationActive: false` and `key: false`. The client had already failed. This receipt records the interval between those markers without assigning a blocked stack or cause.

The new tooltip getter diagnostics compiled but **were not exercised**: this run stopped during initial activation, before tooltip acceptance. There is no tooltip envelope for this run. The verifier did not reach its `mounted('root-main')` check, so **actual React mounting remains unknown**. The previous a685 run's tooltip observation remains a separate result.

## Exact source and completed workflow

| Field | Value |
| --- | --- |
| PR59 helper head | `5340d2d96412d0fcc5dc7cce21ced037d2de5c7b` |
| Actual merge checkout | `32e6234e6f00ff873132f81498d3f78f2488ad8f` |
| Actual tree | `bc0c0f2d8c96965ed54b429bd5269c4c7081bc64` |
| Ordered merge parents | `0edd5f302e99877191ba9a412c5c060571a5f6c9`, then `5340d2d96412d0fcc5dc7cce21ced037d2de5c7b` |
| Workflow | [Run 42951265207](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42951265207), attempt 1, completed failure |
| Source job | [130295860357](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42951265207/job/130295860357), success |
| Native job | [130296002996](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42951265207/job/130296002996), failure in native controls/window acceptance |
| Owned app PID | `43799` |

Both complete job logs identify the actual merge checkout. The untruncated tree was independently recomputed: 2,048 leaves and 284 tree objects including the root, with every directory hash matching. [Completed metadata](github-metadata.json) retains the selected API fields, full step conclusions, source blob identities and artifact metadata.

The source job passed **11 tests**, and the installed native consumer passed **16 tests**, with zero failures, skips or cancellations in each set. The installed public API check and the seven-case native Foundation/socketpair transport probe passed. The standalone native compilation returned exit code zero. Runtime then failed with:

```text
Native driver response timed out awaiting tron.window (request 2)
```

The native evidence upload succeeded and reported **45 files**. The passed-only tested distribution step was skipped. Later native gates and release acceptance remain held.

## Observed request and activation sequence

These times are reported wall-clock observations from the typed startup projection, not independently established monotonic durations. The exact emitted JSON is retained in [startup-console-summary.json](startup-console-summary.json).

In the exact native driver blob `5a7c3b5c293dced56ad7dc4d28cfee75015288a4`, `TraceActivation` captures the callback timestamp before JSON serialization and `NSLog`, and its call returns before `dispatch_async` enqueues the main continuation. There is **no enqueue marker**. The tracing duration and time before enqueue are unmeasured, so the approximately 35.608-second marker interval is **not a measurement of main-queue waiting** and does not prove queue starvation or blocking. The verifier blob `0b0555a2cb0c37867418600bf9c9fbfbd77e6566` awaits `show()` before its first React mount check.

| Observation | Reported time or interval |
| --- | --- |
| Client starts request 2, `tron.window` | `2026-11-11T03:34:11.314Z` |
| Workspace-completion callback marker, non-main thread | epoch `1794368051.428266`; `hasApplication: true`, `hasError: false` |
| Client records request failure | `2026-11-11T03:34:46.318Z`; recorded interval **35.004 seconds** |
| Main-continuation marker, main thread | epoch `1794368087.035872`; approximately **35.608 seconds** after the callback marker |
| Identity check | epoch `1794368087.03687`; `sameProcess: true`, `sameBundle: true` |
| Reply prepared | epoch `1794368087.041072`; `ok: true`, `visible: true`, `applicationActive: false`, `key: false` |
| Transport send completed | epoch `1794368087.042486`; 158 bytes, `replacedWithFailure: false` |

The snapshot reports all 10 matching activation records and all 10 matching transport records retained, without malformed, PID-mismatched or omitted records. The complete stable command-file read reports eight records; authentication and ping succeeded before request 2. The late native reply and send occurred after the client's recorded timeout and did not satisfy the initial-show gate.

The selected process receipt records null child exit code and signal at `03:34:46.321Z`. Its before/after process queries returned exit code zero, and the sample command reported exit code zero, a two-second requested sample duration at 10 ms intervals, 25 thread groups and thread stacks present. These are selected producer observations; the original sample stack text has not been inspected and cannot establish application health or explain the delayed main continuation.

## Preserved original log text and exact envelopes

The complete decoded GitHub job logs are retained byte-for-byte as retrieved text. SHA-256 and Git blob identities were independently computed over their UTF-8 bytes.

| Retained file | Bytes | Independently recomputed SHA-256 |
| --- | ---: | --- |
| [source-job.log](source-job.log) | 19,321 | `46b5adf608b75e167d4e2b8e82de9cdb3028d9b7b7561df60270a4b39a3a2641` |
| [native-job.log](native-job.log) | 65,275 | `9747c8f908041042c9d6c56986682ccfbea6479dee39cdc9c04a2fe4a42de17b` |
| [build-console-summary.json](build-console-summary.json) | 318 | `38aa8fa595b2804a1dcc552a3dfe9be0c8445b8c074872e5993144d26ebcaf03` |
| [startup-console-summary.json](startup-console-summary.json) | 11,885 | `3cc704cfc30b6bff333dbcd8ab284a7311bb2277a2c6fdae433b873a84848a61` |
| [startup-console-block.txt](startup-console-block.txt) | 12,140 | `115bb69181de5d23449e16ead38e8c03c1e31ffea22a822cf2948f12496215c7` |

Envelope extraction requires standalone marker lines after removing only each GitHub timestamp prefix. The build wrapper's echoed source contains marker strings and is not an emitted result. Each accepted envelope contains one complete JSON line, retained without reserialization or an added newline.

The startup markers enclose **one interleaved stderr line**, naming `driver-client.mjs:36`. The original timestamped block preserves that line and all original ordering. Its presence does not invalidate the separate complete JSON line. No tooltip markers occur in the completed native log.

## Producer-reported original-file boundary

The following original bytes have not been independently inspected here. Their sizes, hashes and completeness labels come from the runner's emitted summaries or GitHub artifact metadata:

- `build-console.log`: 12,329,156 bytes, producer-reported complete transcript, SHA-256 `fe6fe2cb4d52f2966af0dbd830d355d2928411daccb66473c43a2f7c9404404b`.
- `startup-app-log-snapshot.log`: 5,113 bytes, SHA-256 `1ae997d8ee76d4fd82c9e9af07fac58f373e78187cd15fd10804582dfc5f0965`. This binds an exclusively retained read-time prefix of live `app.log`, not the eventual original live log. The projection reports a stable identity and no observed unread bytes at that read; later appends remain possible.
- `commands.jsonl`: 841 bytes, SHA-256 `a739ac22b9ae7f58d4054d46d5dd98cd9e893bf64c269e35490486354fc97d9d`, reported complete stable read.
- `native-process-failure.json`: 1,321 bytes, SHA-256 `b7515b5f76ef4b7a66cddb6aea695b608be792e5f50e1aaa21579fb5be8bd326`, reported complete stable read.
- `native-process-sample.txt`: producer-recorded SHA-256 `1b0793a638829a1f05c75e2e31707c14b0bf9a67af5f6a9c97d4ea8710014d06`; its bytes and thread stacks remain uninspected.
- Native evidence artifact `13826131506`: 1,425,183 bytes, 45 files reported uploaded, producer/API SHA-256 `9a3ac4c5ef52911c0235d6ffd7ba274817c0546ceb9d9a3c8391eb5c9b8f3499`. Download returned a file reference, but raw ZIP bytes and members were not extracted or independently hashed.

[provenance.json](provenance.json) keeps independently inspected text hashes separate from all producer-reported original-file hashes. It also records the sample and projection limits explicitly.

The callback-marker-to-main-continuation-marker interval does not establish enqueue timing, main-queue wait duration, queue starvation, a blocked stack, deadlock, NSWorkspace defect, permission failure or activation root cause. This receipt changes no source, deadline, permission, activation, assertion or cleanup behavior and does not request an unchanged retry. The separate [32-case browser pass](../v1-web-5340d2d-overlay-pass/README.md) remains browser evidence; it does not replace the held native acceptance.
