# Android cancellation verified at 2899ffd

[Native workflow 42858538373](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42858538373)
completed Android job `129978087026` successfully for PR 61 head
`2899ffdedf98e2a86c077f15aa1baf6401c07b80`. The clean tarball consumer tested
merge `0576bea35225fde1437a50263c8154aca525ec8d`.

Native Kotlin/Compose compilation, all eleven installed media checks and all
four native UI flows passed. Settings edit/save, Editor draft route
retention/save, pointer touch/release and pointer cancellation each executed one
JUnit case with zero failures or skips. The original UI result records zero
transport recoveries.

## The original cancellation failure is closed

The [0edd5f3 failure](../../v1-native-0edd5f3/android/README.md) received a native
cancellation but left the document transaction at `down`, with zero cancelled
strokes. At this revision, the unchanged OS sequence executes touch-down at the
observed drawing surface center `(161, 433)`, Home, and Activity resume. The
original [command receipt](ui/commands.jsonl) records all three actions succeeding.

The [pre-Home hierarchy](ui/pointer-down-hierarchy.json) reports one committed
stroke, zero cancellations and the last event `down`. The completed
[pointer-cancel report](ui/pointer-cancel/report.xml), its captured hierarchy and
screenshot show **one committed stroke, one cancelled stroke, zero prediction
samples and the last event `cancel`**. The prior committed blue stroke remains
visible. The strict flow and router identity filters are unchanged.

A [verbatim device-log excerpt](ui/pointer-diagnostic-excerpts.json) also records
`phase: cancel` and `lastStrokePhase: cancel`, with retained contact coordinates
`(140, 140)`, one committed stroke and one cancellation. The excerpt includes the
original log's hash and its exact line and byte offset. The Android adapter now
cancels retained active contacts before parsing synthetic cancellation samples.
The [iOS native job at the same revision](../ios/README.md) also passed.

## Payload and receipt verification

Artifact `13786226974` matches GitHub's ZIP SHA-256 and byte count:

`459a093e437c9eac55185b97b24cfe1649a3dfbaabc295bdd4e6108485130522`

The APK was independently streamed and hashed. Its bytes and size match both
native manifests and the installed media/UI receipts:

`16a9d93049f6eb23bcad59cadea52c06bbec98a537995656b254cec5c02952bb`

Consumer, installed-package, media and UI source identities agree. Package
receipt hashes, warmup record hashes, JUnit hashes, native hierarchy hashes and
screenshot hashes were independently checked. [verification.json](verification.json)
maps all 36 retained original files to their ZIP entries and SHA-256 hashes.
Original GitHub job and artifact responses are included. APK binaries and full
compiler/device logs are omitted.

Native accessibility trees were reparsed, and reference safe-area geometry
matches the original UI report. Settings' saved confirmation executed before
the flow's final scroll back to the workspace-name field; its screenshot shows
the saved confirmation and workspace header. Editor shows the retained and
saved cover. Both reference screenshots retain readable dark status-bar icons
on the light background. The final pointer screenshot was visually checked
against the native counters and prior committed stroke.

These API 35 emulator results establish the executed flows at this revision.
Physical pen pressure, tilt and hover, palm rejection, foldable behavior and
spoken TalkBack output remain separate device gates.
