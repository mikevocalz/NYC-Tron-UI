# NYC-Tron UI readiness

Updated 2026-11-10 for the v1.0.0 candidate. Scope and tiers: [v1.0.0 decisions](V1_DECISIONS.md)
and [Support policy](SUPPORT.md).

## Current candidate

The current source candidate and exact CI/runtime results are recorded in
[candidate verification](completion/reports/V1-RELEASE-GATES.md). The complete
341-ID inventory now has 332 local implementations plus nine pinned external
implementations. The twelve native/service rows are included, and the earlier
blanket deferral is superseded. Complete eight-platform acceptance and owner
distribution review remain open; stable publication is blocked by those records.

The following CI table is retained as historical evidence for its own commit.

## Earlier CI checkpoint

Head commit `d5207cc7` (branch `codex/complete-all-components`, PR #54). Runs
read with `gh run list -R mikevocalz/NYC-Tron-UI -c d5207cc72d17b952d3e13f48faf00717aa31672c` on 2026-11-09:

| Workflow | Run | Date (UTC) | Jobs | Result |
| --- | --- | --- | --- | --- |
| NYC-Tron source, exports and types (`ci.yml`) | [42399288256](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42399288256) | 2026-11-07 | workspace TypeScript; pure contracts and dependency boundaries | success |
| NYC-Tron native controls (`native-controls-port.yml`) | [42399288117](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42399288117) | 2026-11-07 | iOS SwiftUI simulator compile; Android Compose compile; TypeScript, source contracts and independent pack | success |
| NYC-Tron rendered web overlay acceptance (`menu-browser.yml`) | [42399288206](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42399288206) | 2026-11-07 | chromium | success |
| NYC-Tron rendered web instrument acceptance (`ui-browser.yml`) | [42399288296](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42399288296) | 2026-11-07 | chromium | success |

The Windows workflows filter on paths under `packages/windows-fluent`, which
have not changed since `e95f2be1`. Their latest runs, both success:

| Workflow | Run | Date (UTC) | Commit |
| --- | --- | --- | --- |
| WinUI 3 NavigationView in RNW Fabric (`winui-fabric.yml`, `windows-2025`) | [42158305089](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42158305089) | 2026-11-06 | `e95f2be1` |
| WinUI 3 native host compile (`winui-native.yml`) | [42158305408](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42158305408) | 2026-11-06 | `e95f2be1` |

The v1.0.0 preparation edits on `release/v1.0.0-prep` (license files, tooling,
new paste and row-height tests) were uncommitted when this table was written,
so no run above covers them.

## Current gates

| Gate | Status |
| --- | --- |
| Source implementation | All 341 canonical rows have reviewed owners: 332 local plus nine pinned external (`docs/completion/library-progress.json`) |
| Device acceptance | 0 of 341 rows; every row is `acceptance: "unverified"` |
| Core navigation / hinge / spatial contracts | Node unit tests in `ci.yml` |
| Corner-cut and overlay-placement geometry | Node unit tests in `ci.yml` |
| Per-component package exports | Built `dist/` ESM and declarations; every export condition checked by `tooling/verify-packages.mjs`; tarballs packed in CI |
| iOS SwiftUI / Android Compose controls | Clean installed-tarball native compile and media/UI runtime gates; see exact current receipts in the candidate report |
| iOS / Android native overlays | 28-step scenario passed twice on an iOS target and twice on Android `emulator-5554` (`docs/completion/P04-native-overlays-proof.json`); no screen-reader speech |
| Windows Fluent NavigationView (Fabric) | Actual candidate consumer compilation, deployment and keyboard UIA passed in run 42765513976. Wider Narrator/high-contrast/RTL/resize/physical-input acceptance remains unverified |
| Windows host-shell transport | RNW Fabric navigation binding implemented in the isolated Windows package; new native consumer evidence required for this revision |
| macOS AppKit native adapter | Spark/AppKit package and clean consumer implemented in a separate Expo 55 / RN macOS lane; native control/window evidence required for this revision |
| Native multi-window bridge | Native desktop adapters connect window ownership, display geometry and lifecycle to the shared registry; physical cross-window dragging/display changes retain separate acceptance |
| Moyo / NYC-MON theme consumption | Example contracts written, **not visually tested** |
| Forge suite real consumer and packaging | Actual MMKV/Yjs and generated native object receipts are retained from the owning Forge workflow; see the candidate report |
| Surface Duo / multi-hinge hardware | **NOT RUN** |
| Viro / PICO / visionOS / Quest panel runtime | Pinned XR/Muse source implemented; physical platform runtime and input acceptance **NOT RUN** |
| npm publishing | Deferred; releases are GitHub Release tarballs with `SHA256SUMS` |

Maintain this table from evidence, not from intent. If a check does not run,
it is not a pass. GitHub CI source/typecheck checks do not demonstrate
native AppKit/WinUI/Compose/SwiftUI behavior.

## History

The sections below record earlier checkpoints. Commit and run citations in
them describe those commits, not the current head.

## Responsive table extraction (November 4, 2026)

- `DataTable` auto cards/columns by **host pane width**, sorting chips and
  labeled records: source and TypeScript checks passed; native visual tests pending.
- `SpreadsheetGrid` compact stacked formula bar, touch-height rows,
  noncollapsing spreadsheet columns and measured container: source, metrics
  tests and TypeScript passed; device scrolling/IME acceptance pending.
- Nitro Forge Tally PR #39: Rust-backed viewport adapter; separate Rust
  integration workflow passed before this responsive update.
- Details: [Responsive tables](RESPONSIVE_TABLES.md).

## Advanced instrument extraction (PR #2, November 4, 2026)

- Passed: source/type/build/pack CI on commit `1c3e745b`: [GitHub Actions run 41902026128](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/41902026128).
  That run passed while 13 new `react-native` export targets pointed at files that are never emitted, because the pack check at that commit skipped the `react-native` condition. Fixed in `6c87b8b`; the check now covers every condition.
- Passed: source-level RN InstrumentKnob, InstrumentXYPad, TreeGrid, PatchGraph, ImageCropOverlay, CommandPopover and pure spatial/hinge/math contracts. `@nyc-tron/core/advanced-catalog` distinguishes source prototypes from planned ports.
- NOT RUN at that commit: native iOS/Android/Windows/macOS builds, physical-device stylus/foldable/XR input, audio/media/GPU decoder integration and real consumer visual acceptance.
- Caution: source-port candidates cataloged only; zero upstream code copied or licensed into these components. Real source ports remain separate issues and require file-level audit.

## Adaptive navigation and pane host (PR #9)

- Built `@nyc-tron/panes` Master/Detail/Inspector controlled RN host, native `NavigationRail` fallback, and controlled LEFT `CollapsibleDrawer` with three pane modes.
- Pure window-origin, multi-hinge, book/tabletop and RTL planner tests added.
- Native Windows WinUI was not implemented at this checkpoint (issue #11). It later landed as `@nyc-tron/windows-fluent-fabric` in PRs #14 and #50; see the Gates table.
- CI pure tests, TypeScript, emitted ESM/declarations and all npm pack checks **passed** at commit `38b814405b09430e91ef4e7fa2a08b78a3523ff5`.
- Physical Surface Duo, WinUI build, Mac AppKit and XR native acceptance **NOT RUN**.
- Agent role profiles at `.github/agents/` are committed but no external coding subagent session was launched.

## Native SwiftUI/Compose dropdown and menus (PR #10)

- Isolated `@nyc-tron/expo-controls` package, `NativeDropdown` via Expo 58 universal Picker and real native action menu via `@expo/ui/community/menu`.
- Working React Native web fallback for action menus because Expo's web native MenuView has no action callbacks.
- Checks for unique menu IDs, disabled actions and nested groups; exact `browser` and `react-native` export files verified per Metro's package exports rules.
- Source tests, TypeScript, emitted package builds and npm pack checks **passed** on commit `8a3482bb1207ca2dd128b66092fbf2e7db59a38c`.
- Actual Compose/SwiftUI on-device menu placement, keyboard and screen-reader verification **NOT RUN**. No production/publish claim.



## Native popover, tooltip, command palette and overlay focus (issue #4)

- `@nyc-tron/expo-controls/NativePopover`: @expo/ui SwiftUI `Popover` on iOS, Compose `DropdownMenu` surface on Android, `placePopover` on web. Same `anchor` + `usableRegions` contract everywhere.
- `@nyc-tron/expo-controls/Tooltip`: Compose `TooltipBox` on Android; `accessibilityHint` only on iOS (no touch tooltip exists); delayed hover/focus tooltip with Escape on web.
- `@nyc-tron/ui/components/overlays/CommandPalette` with `command-filter`: controlled, searchable, arrows/Enter/Escape, placed by `placePopover`. The app owns the shortcut that opens it; a shortcut registry is deferred.
- Web Tab/Shift+Tab stay inside `NativeActionMenu`, `CommandPopover`, `NativePopover` and `CommandPalette`; focus returns to the opener on close.
- Chromium Playwright checks cover the web keyboard paths. `examples/native-instruments` renders them and the native-controls workflow compiles it for Android and iOS.
- NOT RUN: any device or simulator session, screen-reader output, native popover placement on foldables.
