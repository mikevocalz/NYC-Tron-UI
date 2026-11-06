# Workspace shell checkpoint

A-01 WorkspaceHost, A-02 WorkspacePresetSwitcher, A-03 AdaptiveDock and A-04 PaneSplitter are reviewed reusable implementations with independent public exports. The remaining P04 rows are still open.

WorkspaceHost retains its canvas instance across modes and viewport changes, owns separate saved layouts per mode and remounts document-specific content when document identity changes. Document/mode/revision/disabled boundaries reject obsolete actions. Stored layout lookup rejects inherited object keys. The native/browser consumer stores document state above the layout and exercises six modes, actual preset layout snapshots and two documents.

Preset dialogs capture a stable session and intended preset ID. Rapid input reads the current session draft; document, revision, permission or active-preset replacement closes it. Rename/delete revalidate the captured subject before invoking the host. Unicode limits count code points. Copy-name search and preset lists are bounded. Dialogs use the caller's nonoccluded window region and scroll to keep their actions accessible on short panes. Menus reject delayed measurements from obsolete scopes while retaining the trigger instance. Web overlays restore focus on close or conditional unmount without overriding a newer visible focus choice.

AdaptiveDock reuses core fold-region resolution and clamps displayed/default/dragged floating rectangles into a usable region. Canvas coordinates remain distinct from window coordinates. Floating drags and splitter interactions cancel across scope/viewport/revision changes. Native layout events remain valid independently of edit scope so initial and subsequent measurements cannot be lost. PaneSplitter retains keyboard focus across controlled size acknowledgements, exposes resolved accessibility ranges and ignores disabled/stale native, keyboard and gesture actions. App tokens own panel shadows and expression input typography/borders.

Verification passed 803 source tests, workspace builds/types, independent exports and 13 validation packs. All 548 browser tests passed, including six new shared-consumer tests for canvas identity, actual saved layouts, Unicode preset names, rename/delete isolation, held-drag cancellation and repeated keyboard resizing. The UI validation pack SHA-256 is 52a821059cdd251debbbb101b29185563fd3da18e54a9a4228ee03520e1f72df. This is a local validation artifact, not a release.

| Native contract | Executable evidence |
| --- | --- |
| Deterministic launch and workspace baseline | Search assets, then Harbor and Canvas edits 0 |
| Edit persists across mode change | Canvas edits 1 before and after Color; controlled mode state |
| Documents have isolated state | Studio starts at 0; reopening Harbor restores 1 |
| Preset dialog fits the usable cover pane | Inspected dialog and actions with keyboard open; Preset name and default draft checks |
| Save commits actual preset | Workspace preset: Custom layout copy after Save |

The recorded 31-step iOS test passed unchanged twice: 21.9s and 15.8s. Pass 1 used fresh device-scoped Argent services. Every transition has identity and idle checks. Heading/default-input checks retain raw await-ui-element because the native and accessibility projections differ. Final taps use semantic labels; no points remain. Full outputs and limits are in P04-workspace-native-proof.json. Initial transport failure, disk-space interruption and recovered walkthrough do not count as acceptance. Only task-owned rebuildable native intermediates were removed to recover disk space.

Small-region idle warnings remain on the menu/focused field. Loaded controls and the exact default draft were checked; no loading indicator was observed, but the runner does not identify the changing region. The native scenario saves the offered name; Unicode/rapid typing has browser evidence only. Android workspace replay, desktop/headset runtime, physical accessibility, performance and production engine integration remain unverified. Established orientation/window and reserved-region ownership are preserved. This checkpoint is not complete eight-platform acceptance or completion of the 341-component program.
