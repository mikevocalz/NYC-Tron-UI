# AppKit activation timing — source checkpoint

At **2026-11-11 04:23:08 UTC**, helper commit
[`12e35b48f75408ac4da4f8130853148ef00a5881`](https://github.com/mikevocalz/NYC-Tron-UI/commit/12e35b48f75408ac4da4f8130853148ef00a5881)
was published after independent source review. Its tree is
`d4352a6aba7cca7a9b898b6c25c9e4a5d729587d`; its sole parent is
`5340d2d96412d0fcc5dc7cce21ced037d2de5c7b`.

This is a **historical source-only checkpoint**. The actual PR merge and this
candidate's native compilation/runtime were unverified at publication. No
native acceptance, component ledger or release gate is promoted by this receipt.
The two immutable source files, exact inverses and review evidence are recorded
in [source-review.json](source-review.json).

## Why this observation is needed

The preceding run `42951265207`, native job `130296002996`, compiled successfully
but timed out awaiting the first `tron.window` show request, request 2. The
verifier had not reached its `root-main` mount check or allocated tooltip
evidence. Its exact checkout was `32e6234e6f00ff873132f81498d3f78f2488ad8f`.

The existing callback marker was timestamped before its own details
serialization and logging, and before dispatch to the main queue. The later
continuation marker therefore could not separate time spent around that trace
from elapsed time beginning at dispatch submission. It did not establish queue
starvation, a blocked main thread, or a logging cause. The original process
sample remains unextracted; a reported thread-group count is not a stack
diagnosis. The unchanged original log and selected startup projection identities
are listed in the JSON receipt.

## Two private source changes

The acceptance driver now imports `QuartzCore/CAMediaTiming.h` and takes exactly
three immutable `CFTimeInterval` samples:

1. At callback entry, before its existing completion trace.
2. Immediately before the unchanged `dispatch_async`, after that trace. There
   is no intervening logger or metadata work.
3. At the first statement in the main block, before its trace or AppKit getters.

Only the existing `workspace-main-continuation` trace gains timing metadata.
Its original window-state getter still runs exactly once inside the same
diagnostic guard. The two derived fields are:

| Field | Scope of the elapsed measurement |
| --- | --- |
| `completionTraceElapsedSeconds` | The existing callback trace and any descheduling before the submission sample |
| `submissionStartToMainEntrySeconds` | Caller descheduling, block-copy/submission work and elapsed time until main-block entry |

Neither field is pure queue residence or establishes a cause. No dispatch-return
marker, shared atomic or mutable block capture was added. The record explicitly
identifies `CACurrentMediaTime`, exclusion of system sleep, and these
interpretation limits. Raw monotonic samples are not emitted.

Apple documents [CACurrentMediaTime](https://developer.apple.com/documentation/quartzcore/cacurrentmediatime().md)
as the [mach absolute clock](https://developer.apple.com/documentation/driverkit/mach_absolute_time.md)
converted to seconds. That clock is monotonic and excludes system sleep.
[dispatch_async](https://developer.apple.com/documentation/dispatch/dispatch_async)
submits without waiting for invocation; it does not provide a queue-residence
measurement. The original [NSWorkspace completion/main-queue handoff](https://developer.apple.com/documentation/appkit/nsworkspace/openapplication(at:configuration:completionhandler:).md)
remains intact.

The verifier projects these fixed fields only for the continuation phase.
Missing, malformed or unrecognized clock data stays explicitly unknown.
Durations require finite nonnegative numbers without coercion; invalid native
values become `NSNull`, and invalid projected values become `null`.
Interpretation flags require literal `true`. Timings never participate in an
acceptance predicate.

Activation options, same-process/bundle and foreground checks, command order,
replies, deadlines, tooltip gates, error rethrow and cleanup are unchanged.
The native trace remains capped at 128 events and 2,048 serialized JSON bytes per record.
Startup reporting retains its 32 KiB full-envelope cap, fixed-file reads,
original hashes and exclusive snapshot creation. The separate tooltip envelope
remains 16 KiB. No shipping SDK/API, workflow, permission or retry change is
included.

## Reproducible source review

[review-checks.js](review-checks.js) contains ten author-designed groups covering
source identities/inverses; sample placement and whole-verifier V8 syntax;
valid/zero and unknown timing; strict numeric/metadata types; phase/privacy
boundaries; exact mocked snapshot/hash output; PID/selection limits;
snapshot/read/console failures; preservation of the primary error; and actual
report-loop trimming with wide timing records.

All ten groups passed in V8 with mocked synchronous IO. The ordinary emitted
envelope measured **4,311 bytes**. The wide-record case exercised trimming and
measured **32,614 bytes**, including markers and newlines, while retaining the
latest timing observation under the unchanged 32 KiB cap.

Root and the AppKit reviewer each reproduced those same ten designs with the
same measurements. These reproductions are not additional test designs.
Separately, root checked 34 selected cases, the AppKit reviewer ran seven
independent selector groups, and the verifier reviewer ran eight independent
selector groups. Root and the AppKit reviewer independently verified all 2,048
helper leaves, 284 tree objects, the sole parent and exactly two changed files.

To reproduce the author review, evaluate `review-checks.js` and call
`reviewActivationTiming(driverBefore, driverAfter, verifierBefore, verifierAfter)`
with the exact four Git-blob strings listed in `source-review.json`. The harness
checks those identities before exercising the extracted source.

These checks do **not** execute Node filesystem operations, compile Objective-C,
run AppKit or establish native timing values. A subsequent actual native run is
required to observe the new fields and continue the unchanged acceptance gates.
