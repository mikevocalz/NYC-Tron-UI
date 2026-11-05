# NYC-Tron UI readiness — initial extraction

| Gate | Status |
| --- | --- |
| Git branch / extracted source | Authored, draft PR pending |
| Core navigation / hinge / spatial theme contract | Source added; Node unit assertions included |
| Corner-cut pure geometry | Source added; Node unit assertions included |
| RN Button / Card / NavigationRail | Source only; native runtime not yet validated |
| Professional WaveformLane | Source only; native runtime not yet validated |
| Expo 58 native seek and RGBA sliders | Source only; build/device integration not yet validated |
| TanStack v9 DataTable / Tally SpreadsheetGrid | Added with custom RN UI, two-axis virtual window and controlled formula bar; TypeScript/source/pack CI passed. Native interaction NOT RUN |
| Forge Tally Rust viewport adapter | [Forge PR #39](https://github.com/mikevocalz/nitro-forge/pull/39): Ubuntu CI passed mock + live nf-cli Rust formula recalculation and undo. Native UI still NOT RUN |
| Correct per-component package exports | ESM/dist and declarations built; independent package tarballs built in CI |
| Moyo neubrutalist theme consumption | Example contract written, **not visually tested** |
| NYC-MON neon/district theme consumption | Example contract written, **not visually tested** |
| Forge suite real consumer and packaging | **NOT RUN** |
| Windows Fluent NavigationView left collapsible rail | **NOT IMPLEMENTED** |
| macOS Spark AppKit native adapter | **NOT IMPLEMENTED** |
| iOS / Android platform-native wrappers | **NOT IMPLEMENTED** |
| Surface Duo / multi-hinge hardware | **NOT RUN** |
| Viro / PICO / visionOS panel runtime | **NOT RUN** |
| Signed npm publishing / semver release | **NOT RUN** |

Maintain this table from evidence, not from intent. If a check does not run,
it is not a pass. GitHub CI source/typecheck checks do not demonstrate
native AppKit/WinUI/Compose/SwiftUI behavior.

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

- ✅ Source/type/build/pack CI on commit `1c3e745b`: [GitHub Actions run 41902026128](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/41902026128).
  That run passed while 13 new `react-native` export targets pointed at files that are never emitted, because the pack check at that commit skipped the `react-native` condition. Fixed in `6c87b8b`; the check now covers every condition.
- ✅ Source-level RN InstrumentKnob, InstrumentXYPad, TreeGrid, PatchGraph, ImageCropOverlay, CommandPopover and pure spatial/hinge/math contracts. `@nyc-tron/core/advanced-catalog` distinguishes source prototypes from planned ports.
- ❌ NOT RUN: native iOS/Android/Windows/macOS builds, physical-device stylus/foldable/XR input, audio/media/GPU decoder integration and real consumer visual acceptance.
- ⚠️ Source-port candidates cataloged only; zero upstream code copied or licensed into these components. Real source ports remain separate issues and require file-level audit.

## Native SwiftUI/Compose dropdown and menus — PR #10

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
- Chromium Playwright checks cover the web keyboard paths. `examples/native-overlays` is compiled for Android and iOS in CI.
- NOT RUN: any device or simulator session, screen-reader output, native popover placement on foldables.
