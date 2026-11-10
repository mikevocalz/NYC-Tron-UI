# Windows c6c1826 stale native fragment failure

The installed native Fabric library, Windows consumer executable and packaged
deployment passed. The strict rapid-text, controlled rejection, close/reopen,
scope and dismissal-veto assertions passed again. The complete native gate
failed when traversing the lifecycle screen after the overlay components were
removed. Tested-package retention and upload remained skipped.

- [Workflow run 42877934390](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42877934390)
- [Native job 130046638820](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42877934390/job/130046638820)
- [Original UIA artifact 13794125200](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42877934390/artifacts/13794125200)
- PR60 head: `c6c18268f51d3930c55bc206689fc0d25ae33650`
- Actual checkout: `b585be689796c598a037d14260f17490d94e48e1`
- Both trees: `f30c7b6f3d5dfe308daf8849acb2f9d8f7279ee2`

## Observed boundary

The exact failure remained:

> UIA element named 'Windows navigation acceptance' did not appear within 30 s

The original `failure.png` visibly renders that header and the lifecycle controls.
The diagnostic now records provider identities before removal, after removal
through the retained root, and after reacquiring the same owned HWND. The fresh
reference did not restore traversal.

| Observation | Before removal | Retained root afterward | Fresh same-HWND root |
| --- | --- | --- | --- |
| Descendants | 46 | 17 | 17 |
| Command-menu island `42,262660` | Named native button under InputSiteWindowClass | Empty provider with original runtime ID | Same empty provider |
| Native NavigationView `42,66072` | Present | Present | Present |
| Ordinary React stage buttons | Present | Absent from traversal | Absent from traversal |

All snapshots concern process `6404`, top-level HWND `917694`, root runtime ID
`42,917694`. The React InputSite remains `42,131460`; the enclosing desktop bridge
remains `42,262236`. The final timeout snapshot still contains 17 descendants.
The matching stale runtime ID identifies the removed menu's fragment. It does
not establish the precise lower-level retention mechanism.

## Inspector checkpoints and screenshot limit

The unchanged sequential
[tested driver](https://github.com/mikevocalz/NYC-Tron-UI/blob/c6c18268f51d3930c55bc206689fc0d25ae33650/packages/windows-fluent/rnw-fabric/example/scripts/uia-smoke.ps1)
reached the later stage-transition wait only after these assertions passed:

- Rapid keyboard typing produced exact `NativeRapid123abc` in the application
  and native ValuePattern, without replacing the field's runtime ID.
- The application rejected `Rejected!`; the following ValuePattern assertion
  observed exact `NativeRapid123abc`.
- A real close/reopen again returned that accepted value.
- Disable/reenable, replacement scope with acknowledgment zero, and first
  Escape veto followed by a later accepted Escape passed.

The immediate original `09-native-inspector.png` still visibly contains
`Rejected!` in the field while the application label contains
`NativeRapid123abc` and acknowledgment 18. That image is **not visual proof of
the restored field text**. Its property assertions passed, but the popup capture
has no compositor completion barrier. A paint-timing explanation is possible
and unproven. The next diagnostic retains this immediate capture and adds a
separately named capture after the existing close/reopen check; production edit
logic is unchanged.

Inspector return/remount/edit, real OS cross-window drag and the navigation
accessibility extension were not reached. They remain unaccepted by this run.

## Concrete source follow-up

Calling `XamlIsland.Close` from Fabric `Destroying` was present in this tested
candidate and did not resolve the traversal failure. The pinned
[RNW 0.85 ContentIslandComponentView](https://github.com/microsoft/react-native-windows/blob/react-native-windows_v0.85.0/vnext/Microsoft.ReactNative/Fabric/Composition/ContentIslandComponentView.cpp)
clears `m_islandToConnect` after connection. Its unmount handler removes event
subscriptions but does not close `m_childSiteLink`; the destructor closes only
the remaining pending island. Its public ChildSiteLink getter is unavailable
after unmount. The installed package source confirms these paths.

The follow-up retains the ContentIsland before connection and captures the
ChildSiteLink while mounted. At `Destroying`, overlay, drag and navigation
adapters dispose XAML and independently close both retained connection objects.
Ownership is cleared before close callbacks. Navigation also rejects late
queued writes, focus commands and event delivery after disposal.

Microsoft's
[ContentIsland cleanup example](https://learn.microsoft.com/en-us/windows/apps/develop/composition/content-island)
closes both island and link. The
[ChildSiteLink contract](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.ui.content.childsitelink?view=windows-app-sdk-1.8)
also documents implicit closure when its connected island closes. Both `Close`
and `IsClosed` were verified directly in the pinned InteractiveExperiences
1.8.260430001 `Microsoft.UI.winmd`. The downloaded NuGet archive is 26,273,721
bytes with SHA-256
`9b724bb856ca893f156a4ca4ff1864e7e3ce48e93e80fc6b5f18490f25e46c6a`.

The public WinUI 1.8 wrapper delegates XamlIsland disposal to a core implementation
that is absent from that public release tree; no claim about its deeper cleanup
is inferred. The explicit connection correction still requires actual MSVC and
the unchanged native UIA gate.

## Original evidence

The original decoded native log is 312,085 bytes with SHA-256
`d73a770f95c9d4e259e7d5f5b94bb07f468f352f596ac2ac63da4ac2b0bcc048`.
The 256,411-byte original UIA ZIP has SHA-256
`40aeb4566e5ba8aea3459b5e16f6321be314c8c6fc4f53ebab007e142172dcd9`.
`artifact-files.json` inventories all fifteen original files and PNG dimensions.
All fifteen original files, including the ten PNG captures, are retained here
with unchanged bytes alongside checkout proof, job metadata and compact log
excerpts. The complete original artifact was independently checked against its
ZIP digest and every entry in `artifact-files.json` before inclusion. Full logs
and the original ZIP remain preserved outside this evidence directory and in
the cited Actions artifact. No passing native package was emitted.
