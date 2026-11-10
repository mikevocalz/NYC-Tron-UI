# Windows drag start after native geometry correction

[Run 42898545855](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42898545855)
passed source/codegen/API, native library compilation, the consumer executable
build and packaged deployment. The unchanged ten-second wait for
`Native drag phase: dragging` failed on the first actual pointer drag. No
passed-only Windows package was produced.

Head `a0ea5e2ed98cd0a0df7a48a3f6b2d4a1f7fe9a90` and actual checkout
`e7ff60c23bdeb35517dd9d59cf223c8116590dee` independently match tree
`0aad0368744d2296b5c62008d5106e6e445e5b38`. The native candidate refreshes the
owned ChildSiteLink translation after its own new layout metrics, preserving
RNW's current ancestor/scroll offset and scale handling. Its production change
compiled successfully in the real Windows host.

## Observed result and remaining uncertainty

Both overlay-removal traversals again exposed 49 descendants. Strict inspector
remount/draft/new-edit assertions passed. The drag header and two-window
arrangement completed. PID 7052 and HWND 524688 remained alive and matched;
the crash-event query completed without errors and retained zero records.
The final tree contains 51 descendants.

The final native source button and its input site now report
`72,311,260,56`; the original screenshot paints the button at approximately
Y311–367. This closes the final-state 45-pixel discrepancy observed in d17,
whose native bounds started at Y266 for that painted row. It does not establish
the bounds used at the earlier button-down or their relationship to pending
resize/layout work.

The failed label reflects JavaScript owner state. These originals do not show
whether WinUI DragStarting fired, cancelled during native readiness checks,
or reached the JS binding. The driver also did not retain the initial cursor,
provider hit, actual source/target coordinates or their timing. Those are
observation gaps, not grounds to assign a new production cause. A bounded
owned-endpoint and ordered-input correction is being prepared without changing
the strict phase, actual transfer or cancellation assertions.

## Retained originals

`original-uia-artifact.zip` contains all 21 original members without repacking:
316,635 bytes, SHA-256
`fb3f08472c53148bfdd8c4f3b3851433b9b984797a64b4396196309e1e74e35b`.
Every member also appears directly here and was independently compared byte
for byte. The complete original native log is 313,610 bytes, SHA-256
`afed2981569420ed8d97221670cf64b3e25e31ae246d10759b21c1dd14747bf2`.
The file, checkout and provenance receipts retain these exact identities.

No drag completion, rejected/accepted transfer, cancellation, navigation
accessibility extension or full platform acceptance follows from this failure.
