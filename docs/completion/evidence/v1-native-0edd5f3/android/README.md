# Android cancellation failure at 0edd5f3

[Native workflow 42847217952](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42847217952)
failed Android job `129937839973` at step 19, **Execute the installed decoder
and OS-driven UI on Android**. PR head
`0edd5f302e99877191ba9a412c5c060571a5f6c9` produced tested merge
`e597d73757911e9a58005d577b3c2bf2496bd798`. Native compilation completed; the
failure occurred in the installed app's pointer cancellation assertion.

| Executed check | Original result |
| --- | --- |
| Native media decoder | All eleven strict checks passed |
| Settings edit and save | Passed |
| Editor draft route retention and save | Passed |
| Pointer touch, movement and release | Passed; one committed stroke |
| Pointer cancellation on Home and Activity resume | Failed; cancellation count remained zero |

Every listed UI case executed with a nonzero duration. There were no skipped
cases or transport recoveries. The UI runner stopped at the failed assertion
and did not produce a passing `ui/result.json`.

## Observed failure

The original [pointer cancellation JUnit report](ui/pointer-cancel/report.xml)
requires `Committed strokes: 1. Cancelled strokes: 1. Prediction samples: 0.`.
The [failure hierarchy](ui/failure-hierarchy.json) and [final screenshot](ui/final.png)
show one committed stroke, zero cancelled strokes and `Last event: cancel`.

The [command receipt](ui/commands.jsonl) records an OS touch-down at the observed
drawing surface center `(161, 433)`, a successful native hierarchy query,
`KEYCODE_HOME`, and a successful Activity resume. The
[pre-Home hierarchy](ui/pointer-down-hierarchy.json) confirms `Last event: down`.
No app state was injected into this sequence.

A [verbatim diagnostic excerpt](ui/pointer-diagnostic-excerpts.json) from the
original device log records `phase: cancel`, `lastStrokePhase: down`, coordinates
`(0, 0)`, one committed stroke and zero cancelled strokes. The excerpt includes
the source ZIP entry, full log hash, source line number, line hash and byte
offset. It proves that a native cancellation reached the app while the document
transaction remained active. This diagnostic does not expose pointer IDs or
timestamps, so it does not establish the exact incoming synthetic identity.

## Adapter correction to verify

Android's [MotionEvent contract](https://developer.android.com/reference/android/view/MotionEvent#ACTION_CANCEL)
ends all down pointers on `ACTION_CANCEL`. The API 35
[AOSP ViewGroup implementation](https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-15.0.0_r5/core/java/android/view/ViewGroup.java)
can synthesize cancellation at zero coordinates and dispatches cancellation
without filtering or transforming the event contents.

At the tested merge, `TronPointerCaptureView` samples cancellation using the
incoming event's device and pointer identity. The router accepts a cancellation
only for its active contact. The observed rejected transition and the platform
contract justify cancelling the adapter's retained contacts instead of treating
synthetic cancellation fields as a new observed sample.

Candidate source commit `5c2fef123097ba8c787582950a79bf1589dc7b0b` handles
`ACTION_CANCEL` before prediction and sampling. It clears retained contacts and
predictors before emitting their cancellation batches. Contact cancellation
does not release unrelated hover or held-key state; focus loss and detach still
perform the complete cleanup. The router, iOS implementation and strict OS
acceptance flow are unchanged. Twenty-four existing focused checks passed;
Android compilation and the original failing OS flow still require a fresh
native run. This directory preserves the failure and does not certify the fix.

## Artifact verification

The downloaded artifact `13782352795` matches GitHub's ZIP SHA-256:

`fd4750f00756a76168e427a11a16a76ce7197d0f7b2906bf8cfcee948e4aa410`

The archived APK was independently streamed and hashed. Its hash and size match
both native media and UI manifests, and the media receipt:

`f0689ffe7662a3cdf7a357c23951b851262742d9973509c25c19ca3d704cafd0`

Consumer and installed package hashes agree with the tested merge. The media
manifest and bundle-warmup hashes were independently checked. All 36 retained
original reports, receipts, hierarchy files and screenshots match their ZIP
entries byte for byte; [verification.json](verification.json) records each
mapping and hash. Original GitHub job and artifact responses are retained as
well. The APK and full device log are not committed.

Settings and Editor saved screenshots were visually inspected. Both now show
readable dark status-bar icons against the light reference background, along
with the saved workspace and retained/saved cover. These API 35 emulator results
do not establish physical pen, foldable, or spoken TalkBack acceptance.
