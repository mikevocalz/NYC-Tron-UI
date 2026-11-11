# Windows navigation: borrowed scheme ownership, valid pane bounds and fixed checkpoints

This source checkpoint changes one private acceptance script from exact blob
`cb69ad47c11d6b868957a2a72feb8fb27319d975` to
`8c7632eeea23671646721ec7e96ecc386486e610`. It does not claim a native pass.

## Why these changes are supported

The original `ReadContrast` copied the returned scheme text and then called
`LocalFree`. Microsoft Learn's HIGHCONTRASTW page says to free that pointer.
The [official .NET implementation at an immutable revision](https://github.com/dotnet/dotnet/blob/461c220ba5d192fea95ca9249b22b96d3c9e9903/src/winforms/src/System.Private.Windows.Core/src/Windows/Win32/PInvokeCore.SystemParametersInfo.cs)
explicitly identifies that documentation as incorrect and performs
`SPI_GETHIGHCONTRAST` without freeing the returned pointer. Its exact blob is
`c52fc3df81c9eccd38a1db134d76457c49cb2b85`, 4,028 bytes, SHA-256
`efab1e24b2e1f665f6cea9e2df667844ceab04b005104e86cac5658f902e05f2`.

The correction copies the borrowed GET scheme into a managed string and removes
that free and its unused import. The separate SET path allocates its own buffer;
its complete `StringToHGlobalUni` / `FreeHGlobal` method is byte-identical.
This first-party implementation evidence revises the earlier documentation-only
review. It does not establish which call corrupted the heap in a recorded run.

The pane selector previously ranked rectangles only by width multiplied by
height. Empty rectangle dimensions can produce positive infinity, allowing a
hidden candidate to win. The guard rejects empty, offscreen, nonpositive or
nonfinite bounds and nonfinite computed area before the unchanged largest-area
comparison. Valid negative origins, finite compact and open panes, and existing
tie/order behavior remain supported. The exact selected bounds in the external
failed drawer run remain uninspected; this source defect is independently
demonstrated.

Twenty fixed secondary console checkpoints surround the existing RTL status,
toggle poll, pane/host bounds, selection and screenshot operations, plus catch,
finally, restoration and result serialization. They add no provider, process or
file query. Calls are outside loops, reporting errors remain secondary, and
all fixed emitted content together is at most 1,092 UTF-8 bytes with CRLF,
excluding runner decoration. Returned markers stay inside successful paths.

## Review and preservation

[edits.json](edits.json) composes two ownership edits, ten checkpoint edits and
one pane-selection insertion. Root and an independent reviewer reproduced all
six component orderings and their exact inverses to the original source.
The original 21 throw-bearing lines and 15 deadline/sleep lines remain.
The strict RTL, physical-left, collapse, high-contrast, selection and keyboard
requirements are unchanged. Shipping navigation layout and all workflows are
unchanged.

[review.json](review.json) records the source gate. The component manifests and
checkpoint check program are retained separately. Root reproduced the same four
checkpoint source-contract groups and the same eight source, seventeen geometry
and six selection checks described by their authors; repeated reviews are not
additional unique tests. These are V8/source/model checks, not PowerShell, C#,
UI Automation or native execution.

The external compact-width mutation, provider reacquisition, broad event-log
collection, stale-element suppression and host/security changes are absent.
The corrected candidate still needs its exact changed-source CI and native
outcome before any acceptance claim.
