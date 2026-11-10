# v1.0.0 status of issues #4, #7 and #11

## Current completion work — November 10, 2026

The November 9 dispositions below are a historical snapshot. The subsequent
user approval includes all twelve remaining service rows and feasible desktop
host work; the earlier AppKit and native-window deferrals no longer describe
the approved scope. Current source ownership covers all 341 original IDs:
332 local and nine pinned external implementations.

[PR #57](https://github.com/mikevocalz/NYC-Tron-UI/pull/57) contains the four
reference flows, native pointer/media work, clean consumers and release gates.
The peer-free window lifecycle model is committed under
`@nyc-tron/core/window-lifecycle`; the panes export remains compatible.
The [keyboard follow-up](reports/V1-NATIVE-KEYBOARD.md) records the exact
failed iOS interaction and its repair without promoting the failure.

Desktop integration adds the isolated AppKit/Spark and Windows Fabric host
adapters, with actual native window ownership and dedicated consumer gates.
Their native results belong to their tested commits; read
[the current support table](../SUPPORT.md) and
[candidate evidence](reports/V1-RELEASE-GATES.md) before claiming acceptance.
Issues #4, #7 and #11 retain their remaining platform-specific interaction,
accessibility and hardware requirements. A source implementation or passing
unit suite does not close those requirements.

## Historical snapshot — November 9, 2026

Recorded 2026-11-09 against commit `d5207cc7` plus the uncommitted v1.0.0
preparation working tree on `release/v1.0.0-prep`. Dispositions follow
[v1.0.0 decisions](../V1_DECISIONS.md).

Status values:

- **DONE**: code is in the repository and its stated checks exist. Device
  acceptance is a separate gate; every ledger row keeps
  `acceptance: "unverified"`.
- **PARTIAL**: part of the checkbox is done; the rest is listed.
- **DEFERRED**: not in v1.0.0; the condition to revisit is given.

None of the three issues should be closed on this release alone. Each has at
least one DEFERRED or PARTIAL item.

## #11 WinUI 3 NavigationView Fabric adapter

| Checkbox | Status | Evidence |
|---|---|---|
| Compiled C++/WinRT Fabric native component, native event registration, typed codegen | DONE | `packages/windows-fluent/rnw-fabric/windows/NYCTronFluentFabric/TronNavigationView.cpp`, `src/TronNavigationViewNativeComponent.ts`; codegen and C++/WinRT build steps pass in `winui-fabric.yml` run [42158305089](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42158305089) (2026-11-06, `e95f2be1`) |
| Real WinUI 3 auto/left/compact/minimal behavior; Narrator, keyboard, high contrast, RTL labels, resize | PARTIAL | Pane modes are in the source (`rnw-fabric/README.md`). The UIA smoke test covers keyboard selection and UIA names. DEFERRED until a Windows machine with a desktop session runs them: Narrator speech, high contrast, an RTL run (`isRTL` is wired but not exercised), resize, compact-mode collapse |
| Stable route selection and focus, no duplicate app router or state | PARTIAL | Reject keeps Home selected and accept moves to Workspace in the UIA smoke test (`docs/completion/evidence/windows/README.md`). Focus return after Settings and focus recovery after item removal are not run |
| Windows CI on compatible runner; missing SDK/hardware called out | DONE | `winui-fabric.yml` and `winui-native.yml` run on `windows-2025`; untested items are listed in `rnw-fabric/README.md` and `docs/WINDOWS_NATIVE_HOST.md` |
| Native demo screenshots, source attribution, optional package manifest | DONE | Screenshots and hashes in `docs/completion/evidence/windows/` (uncommitted at time of writing); `rnw-fabric/THIRD_PARTY_NOTICES.md`; `rnw-fabric/package.json` (`@nyc-tron/windows-fluent-fabric`) |
| Separate draft PR for review | DONE | PR #14 (Fabric island) and PR #50 (pane restore), both merged 2026-11-05 |

The host-shell package `@nyc-tron/windows-fluent` (PRs #12, #46) still has no
RNW implementation of `WindowsNativeNavigationTransport`. That is outside the
issue's checkboxes but should not be read as connected.

## #7 Charts, TreeGrid, spreadsheet panes and clipboard

| Checkbox | Status | Evidence |
|---|---|---|
| TreeGrid: multi-selection, column reorder/pinning, virtual dynamic row heights, hierarchy a11y and keyboard | DONE | `packages/ui/src/components/data/TreeGrid.tsx` (`selectedIds`, `pinnedColumnIds`, reorder, `role="treegrid"`, `aria-expanded`). Dynamic row heights added in this release: `src/components/data/tree-row-heights.ts`, tests `tests/tree-row-heights.test.mjs` and `tests/tree-grid-row-heights-wiring.test.mjs`. Screen-reader output on a device not run |
| Vico-informed native charts with Skia/desktop renderers | PARTIAL | `@nyc-tron/native-charts`: Swift Charts on iOS, Vico 3.2.3 on Android. Skia and desktop renderers DEFERRED until rendering checks run on Windows and macOS |
| Freeze panes and split viewport, keyboard navigation, paste/fill, copy large ranges, formula reference highlight | DONE | `forge/spreadsheet/FreezeSplitControls`, `SplitSpreadsheetView`, `freeze-split-model`; `forge/spreadsheet/fill-handle`, `FillHandleAndAutoFill`; `SpreadsheetGrid` `onCopyRange` with `maxCopyCells` (default 1,000,000); `forge/spreadsheet/ReferenceColorizer`, `reference-colors`. Paste added in this release: `src/components/forge/range-paste.ts`, tests `tests/range-paste.test.mjs`, `tests/spreadsheet-paste-wiring.test.mjs` |
| Narrow phone keeps all columns with horizontal scroll and 44px touch targets; DataTable switches to cards in compact panes | DONE | `forge/sheet-window.ts` `responsiveSheetMetrics` (`touchTarget = 44`); `components/data/DataTable` cards per `docs/RESPONSIVE_TABLES.md`. Device scrolling and IME not run |
| Tests for 1,048,576 x 16,384, stable selection on rotation/hinge resize, prefetch, screen-reader table semantics | PARTIAL | Sheet-size math: `tests/contracts.test.mjs`, `tests/sheet-range.test.mjs`. Rotation and resize selection stability added in this release: `tests/sheet-viewport-stability.test.mjs` (Node model and source tests; no device rotation). `SpreadsheetGrid` renders `role="grid"`. DEFERRED: performance budgets at full sheet size (device benchmarking) and screen-reader speech checks (hardware) |

The five test files named "added in this release" were present and untracked
when this was written. They ran with Node 26.13.0 on 2026-11-09: 48 tests, 48
passed. No CI run covers them yet.

## #4 Native overlays, docks and multi-window

| Checkbox | Status | Evidence |
|---|---|---|
| Native anchored dropdown/context menu/popover, command palette, tooltips, focus trap, shortcuts, VoiceOver/TalkBack | PARTIAL | iOS/Android: `@nyc-tron/expo-controls` (`NativeDropdown`, `NativeActionMenu`, `NativePopover`, `Tooltip`, `ContextMenu`). The 28-step `qa-tron-native-overlays` scenario passed twice on iOS and twice on Android `emulator-5554` (`docs/completion/P04-native-overlays-proof.json`). Command palette (`@nyc-tron/ui/components/overlays/CommandPalette`) and shortcuts (`components/shell/KeyboardShortcutHUD`, `@nyc-tron/hardware-keys`) are portable React Native, not OS-native. DEFERRED: VoiceOver/TalkBack speech (screen reader on hardware) |
| SwiftUI/iOS, Compose/Android, WinUI 3, AppKit/macOS adapters behind independent exports | PARTIAL | SwiftUI and Compose: DONE, as above. WinUI menus, popovers and tooltips: DEFERRED until Narrator and focus checks run on a Windows machine with a desktop session. AppKit/macOS: struck for v1; revisit with a macOS runner and an Apple desktop for sign-off |
| Native dock/snap rails/floating palettes and multi-window lifecycle; hardware-right rail on dual-screen Android | PARTIAL | Docks and rails are portable RN: `components/shell/AdaptiveDock`, `components/shell/ToolRail`, `components/forge/color/FloatingColorPalette`. Right-rail policy is in `@nyc-tron/core/navigation`. A pure TypeScript window lifecycle contract is being added at `packages/panes/src/window-lifecycle.ts` (export `@nyc-tron/panes/window-lifecycle`, test `packages/panes/tests/window-lifecycle.test.mjs`), uncommitted and not yet built when this was written. Native multi-window bridge: not started; DEFERRED until a device run. `@nyc-tron/core/advanced-catalog` lists `NativeMultiWindowDragDrop` as planned |
| Validate hinge/occlusion regions, safe areas, RTL, focus, touch/mouse/stylus, reduced motion | PARTIAL | Region math and pane plans have Node tests; `@nyc-tron/reserved-regions` compiles for iOS and Android in CI. DEFERRED: foldable hinge runs and stylus input (foldable device or Surface Duo; a stylus), iOS 27.1 `reservedRegions` runtime run |
| App-owned Uniwind/Tailwind theme, no raw HTML/WebView, no duplicate Forge UI | DONE | AGENTS.md rules 1, 2 and 6; `tooling/verify-packages.mjs` boundary checks in `ci.yml` |

The window lifecycle contract above is the one V1_DECISIONS.md refers to as
"the pure TypeScript lifecycle contract is in v1". At the time of writing its
`dist/window-lifecycle.*` output was not built, so `node tooling/verify-packages.mjs`
reported three missing-file violations for `@nyc-tron/panes`. Confirm it is
built, tested and committed before citing it as done.
