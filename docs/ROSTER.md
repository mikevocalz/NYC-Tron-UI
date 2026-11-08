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

## Adaptive navigation and pane host — PR #9

- Built `@nyc-tron/panes` Master/Detail/Inspector controlled RN host, native `NavigationRail` fallback, and controlled LEFT `CollapsibleDrawer` with three pane modes.
- Pure window-origin, multi-hinge, book/tabletop and RTL planner tests added.
- Native Windows WinUI **NOT IMPLEMENTED**: tracked by issue #11; independent RNW v0.85 host required.
- CI pure tests, TypeScript, emitted ESM/declarations and all npm pack checks **passed** at commit `38b814405b09430e91ef4e7fa2a08b78a3523ff5`.
- Physical Surface Duo, WinUI build, Mac AppKit and XR native acceptance **NOT RUN**.
- Agent role profiles at `.github/agents/` are committed but no external coding subagent session was launched.

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
- Chromium Playwright checks cover the web keyboard paths. `examples/native-instruments` renders them and the native-controls workflow compiles it for Android and iOS.
- NOT RUN: any device or simulator session, screen-reader output, native popover placement on foldables.

## Media encoder provider (platform-services `/encoder`)

- `@nyc-tron/platform-services/encoder`: bounded raw RGBA8/PCM sources to H.264+AAC faststart MP4 per the encoder-provider decision record. iOS AVAssetWriter, Android MediaCodec+MediaMuxer, web WebCodecs+Mediabunny 1.65.2 (MPL-2.0, `THIRD_PARTY.md`).
- Contract/validation unit tests and native source-contract checks run in package CI; **no** iOS, Android, browser or desktop runtime executed the encoder. See [ENCODER_PROVIDER.md](ENCODER_PROVIDER.md) for the honest status table; `platformEvidence` remains `unverified` on every platform.
