# Windows 4b73093 inspector pass and provider transition failure

The installed Fabric library, actual Windows executable and packaged deployment
passed. The strict rapid inspector edit, rejection, close/reopen, scope and
dismissal-veto checks also passed. The complete native gate failed while finding
the lifecycle header after the overlay components were unmounted. Tested-package
retention and upload remained skipped.

- [Workflow run 42872779548](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42872779548)
- [Native job 130028655985](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42872779548/job/130028655985)
- [Original UIA artifact 13792075070](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42872779548/artifacts/13792075070)
- PR60 head: `4b730937b5eae8356227738bb0f422dce7bd8e47`
- Actual checkout: `0de9dad88e15d99231fb3f8ba3b83db15a9aa70e`
- Both trees: `a6b2be83a900830b5ebcccf73be470445df762bd`

## Observed native behavior

The controlled route, two-window lifecycle, native menu, context menu and tooltip
checkpoints passed. The native inspector then retained the entire rapid input
`NativeRapid123abc` in the application and the TextBox without replacing the native
field. Setting `Rejected!` through its native ValuePattern restored the exact
accepted value. `09-native-inspector.png` captures that value and the application's
rejection status.

The driver subsequently verified retained text after close/reopen, disabled
anchor behavior, replacement scope with acknowledgment zero, and a first Escape
veto followed by an accepted Escape. These assertions remained strict in the
[tested driver](https://github.com/mikevocalz/NYC-Tron-UI/blob/4b730937b5eae8356227738bb0f422dce7bd8e47/packages/windows-fluent/rnw-fabric/example/scripts/uia-smoke.ps1).
Reaching the later stage-transition assertion proves those preceding sequential
checks completed; the script did not emit a separate success receipt for each.

## Exact failure and its limit

At 18:22:01 UTC the driver activated `Show lifecycle checks`. At 18:22:31 UTC its
exact-name wait failed:

> UIA element named 'Windows navigation acceptance' did not appear within 30 s

The original `failure.png` visibly contains that header and the lifecycle controls.
This was a missing automation traversal, not a blank visual screen. The original
`uia-tree.txt` contains 17 descendants: the native NavigationView subtree and two
entries without control type, name, ID or class. It omits the React content.

The failed run did not record those providers' runtime IDs or compare a fresh
automation reference to the same HWND. This evidence does not establish whether
the underlying cause is a client reference or the server's provider lifetime.
Inspector return/remount/edit, actual OS drag and the navigation accessibility
extension were not reached and remain unaccepted by this run.

## Bounded follow-up

The pinned
[RNW 0.85 native custom-component sample](https://github.com/microsoft/react-native-windows/blob/react-native-windows_v0.85.0/packages/playground/windows/playground-composition/CustomComponent.cpp)
closes its XamlIsland from the ComponentView's `Destroying` event. The follow-up
aligns overlay and drag cleanup with that event, while the component still
exists, and retains an idempotent final-release fallback.
Disposed drag surfaces cannot start or accept new work.

The next driver retains provider identities before removal and after it, then
reacquires only the same owned HWND, verifying both handle and process. The exact
lifecycle header, hidden old anchor, fresh mount count, retained draft and first
accepted remount edit remain required. This correction and diagnostic require a
new native run; no passing outcome is inferred from source checks.

## Provenance

The original decoded native log is 311,098 bytes with SHA-256
`2184aecc64e6ba6b1f960b5693c1afe8707bedf73660a662e7f0430c44059139`.
The 254,006-byte original UIA ZIP has SHA-256
`47b3d8203235ab07752bef9a58463ef6fda281ca48df757b624308915a7ded87`.
`artifact-files.json` inventories all twelve original files, their hashes and
PNG dimensions. All twelve original artifact files, including every PNG, are retained here
byte-for-byte alongside job metadata, checkout proof and compact log excerpts.
Full logs and the original ZIP remain in the cited Actions artifact and the
independently verified local download.
