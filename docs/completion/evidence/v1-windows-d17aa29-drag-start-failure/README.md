# Windows drag start: live process and original geometry discrepancy

[Run 42894410312](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42894410312)
passed source/codegen/API, installed native library compilation, the actual
consumer executable build and packaged deployment. The complete native gate
failed during its first real pointer drag, when the unchanged ten-second wait
for `Native drag phase: dragging` expired. No passed-only Windows archive was
produced.

Head `d17aa297098a8e81b778ce2b04d0db148651882d` and actual checkout
`327e93dfbfd2e8bdb58ca71262ca6450f3f179dc` independently match tree
`6d160fd5cecdb7c21fe6b469825089e4441b36f4`. This candidate changes native drag
readiness and disposed-event handling. The scene and actual OS-input assertions
are unchanged.

## Observed native result

Overlay removal again left 49 descendants through both retained and fresh
owned UIA roots. The strict inspector remount assertions then completed,
including retained draft, new acknowledgment count zero, first edit accepted at
one, matching native value and close. The driver found the drag-scene header
and successfully arranged the two windows before attempting the first drag.

Unlike the preceding crash, the owned PID 5968 remained alive; HWND 589990
existed and belonged to that process. The bounded Application Error/WER query
completed without errors and found zero matching records. The final tree
contains 51 descendants. This establishes that the executed transition got
past the earlier crash point, not that every lifecycle path is accepted.

The native source button reports UIA bounds `72,266,260,56`. In the original
failure image it is drawn approximately 45 pixels lower, beginning near Y311.
The React phase label reports Y280 and appears in its expected row. The source
button's reported bounds therefore overlap React text above its rendered
position. The driver derives its real pointer start from those native bounds;
it does not use a fixed fixture coordinate. The screenshot and tree establish
that geometry discrepancy, but do not alone prove all causes of the missing
drag-start event. The adapter layout path requires separate source analysis
and a new native run.

## Original evidence and independent verification

`original-uia-artifact.zip` retains all 21 original artifact members, without
repacking: 316,854 bytes, SHA-256
`fec59e58c828363904348e9d37478837d83192235821498c9a36526e13d8bd00`.
Every member was independently compared byte for byte and is also retained
directly here. The complete original native job log is 312,731 bytes, SHA-256
`dac7ccd77420def7027f77b43ecdde8227b84d01cd7e6ecf30c700cc37790d04`.
The file manifest, checkout and provenance receipts record those identities.

The primary assertion, process/window status, empty matching crash-event set,
UIA tree and app-window screenshot remain unchanged. The run did not complete
an OS drag or reach rejection, transfer, cancellation or the navigation
accessibility extension. It does not promote the eight-platform ledger.
