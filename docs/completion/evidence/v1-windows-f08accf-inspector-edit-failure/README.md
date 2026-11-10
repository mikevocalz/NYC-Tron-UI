# Windows f08accf tooltip pass and inspector edit failure

The installed native Fabric library, actual consumer executable and packaged
deployment passed. Genuine ToolTip visibility and dismissal also passed. The
complete native gate failed when rapid inspector typing lost one character.
Tested-package retention and upload remained skipped.

- [Workflow run 42869763341](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42869763341)
- [Native job 130018159866](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42869763341/job/130018159866)
- [Original UIA artifact 13788698640](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42869763341/artifacts/13788698640)
- PR60 head: `f08accf14f5d23936000b815694947f784552e28`
- Actual checkout: `e025d1ae634423605f96a65e6302a8242573f567`
- Both trees: `c867566665676413d590601bd563e7c60f71cbee`

## Observed native behavior

The route, two-window lifecycle, native MenuFlyout and ContextFlyout checkpoints
passed their assertions. The pointer diagnostic confirmed real OS coordinates
inside the native tooltip anchor and the application in the foreground.
`FromPoint` returned the application's outer `DesktopChildSiteBridge`; its full
provider chain is preserved unchanged in `tooltip-pointer.json`.

The strict ToolTip lookup then succeeded, and `08-native-tooltip.png` captured
the native tooltip text. The driver moved the pointer outside the anchor and
waited until the tooltip was no longer visible before opening the inspector.
These are actual tooltip checkpoints, independent of the earlier provider
diagnostic and hovered-button appearance.

The native inspector TextBox received rapid keyboard input. The exact expected
value did not arrive:

| Observation | Value |
| --- | --- |
| Requested text | `NativeRapid123abc` |
| Native field and app-owned value | `NativeRapi123abc` |
| App acknowledgment | `15` |

The unchanged original UIA tree and failure screenshot preserve the missing
`d`. The per-mutation native trace was not recorded, so the exact sequence of
interleaved callbacks cannot be reconstructed from this run.

## Source correction and remaining gate

[Microsoft's WinUI 1.8 TextChanging documentation](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.controls.textbox.textchanging?view=windows-app-sdk-1.8)
states that `TextChanging` runs synchronously with the new `Text` value already
available, whereas `TextChanged` is asynchronous. The original edit counter
advanced in `TextChanged`. An older JS acknowledgment could therefore see the
old count after a newer native mutation and replace that unobserved character.

The correction advances text/count state synchronously in `TextChanging` and
queues the existing JS event. It performs no popup or visual-tree mutation in
that synchronous handler. A small production acknowledgment state machine has
portable C++ regressions for a native mutation before delayed notification,
rapid older acknowledgments, latest rejection and a fresh mount. Those checks
do not replace the unchanged real rapid-typing UIA gate on the next candidate.

Successful inspector typing, rejection, scope/mount behavior, native OS drag and
the navigation accessibility extension remain unaccepted by this run.

## Provenance

The provenance and checkout files identify the actual merge tree. Job metadata
retains completed and skipped steps. `artifact-files.json` inventories all 11
original artifact files with sizes, hashes and PNG dimensions. All eleven
original UIA files, including the nine PNG captures, are retained here unchanged.
The full job log and ZIP remain outside git and in the cited Actions artifact.

The original 310,040-byte decoded job log hashes to
`cba2c05cff1ec6b1f5e2d4d46f6349ba678449d073471badca8767ace2f042b0`.
The original 219,989-byte UIA ZIP hashes to
`ba30207f941a732580e166bf4ccf093b244858fd060d268dced849b8a07d42b5`.
