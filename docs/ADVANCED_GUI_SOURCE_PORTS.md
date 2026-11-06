# Advanced GUI source ports — 2026-11-05

This change opens source-backed port workstreams and implements only the small Floating UI
placement algorithm. It does not implement native Expo v2 overlays or certify any platform.
The original 341 IDs remain stable. Extend existing owners instead of creating duplicate UI.

## Source evidence

advanced-gui-sources.json records each source file and license blob hash and the commit at
which both blobs were re-checked on 2026-11-05 (`verifiedAtCommit`; URLs are pinned to it).
Only the listed file and root license were reviewed. Pin and review the dependency closure
before any further source import.

| Source | License reviewed | Capability | Port boundary |
| --- | --- | --- | --- |
| [superlistapp/super_native_extensions](https://github.com/superlistapp/super_native_extensions) | MIT | Clipboard, drag/drop, menus and shortcut keyboard layout | Extract platform services; replace Flutter/irondash ownership and message channels with Expo v2 lifecycle on compatible hosts; use dedicated Win32/AppKit adapters. Web clipboard/drag APIs and XR integration are separate. |
| [caplin/FlexLayout](https://github.com/caplin/FlexLayout) | MIT | Docking, detachable panes, workspace persistence | Reuse model algorithms selectively in existing pane owner; do not embed React DOM renderer or create a second layout engine. |
| [tauri-apps/tao](https://github.com/tauri-apps/tao) | Apache-2.0 | Desktop windows and external displays | Study/port native window and monitor operations; never introduce a competing Tao event loop into RN. Mobile scenes/displays and XR compositor windows need their own adapters. |
| [floating-ui/floating-ui](https://github.com/floating-ui/floating-ui) | MIT | Overlay anchoring | Small coordinate port implemented here; focus, safe clipping, hinge selection and native overlay hosts still pending. |
| [TanStack/virtual](https://github.com/TanStack/virtual) | MIT | Virtualized outline/tree-grid | Reuse range/measurement concepts with native scroll measurements; audit DOM globals and retain existing list ownership. Tree semantics and accessibility require authored integration. |
| [xyflow/xyflow](https://github.com/xyflow/xyflow) | MIT | Graph navigation, minimap and connections | Reuse selected geometry/topology logic only; keep RN/Skia presentation and engine-authoritative edits. Do not import the DOM React Flow shell. |
| [kando-menu/kando](https://github.com/kando-menu/kando) | MIT (selected source file) | Radial/marking menus | Reuse angle/wedge math; exclude Electron shell, global input injection and differently licensed art. Add native input and keyboard-equivalent actions. |
| [react/react-native](https://github.com/react/react-native) | MIT | IME text composition | Extend existing RN text input behavior; avoid transplanting a second RN input manager. Apple TextKit, Windows text services and browser composition remain separate. |

## All GUI gap mappings

| Gap from Forge #45 | Existing contracts | Source / remaining authored work |
| --- | --- | --- |
| Multiwindow | A-01/A-03/A-05 | FlexLayout model + Tao native references; existing pane session owner |
| External display | A-01/J-12/N-09 | Tao monitor/window APIs; Apple scenes and Android Presentation adapters |
| Unified commands/native menus | A-18/A-19/A-27/N-07 | Superlist native menus/hotkeys; original shared command registry |
| Rich clipboard and drag/drop | B-07/I-07/N-12 | Superlist platform services; typed engine clipboard serialization |
| IME | H-01/H-02/H-04 | Existing RN input composition; native marked text/range integration |
| Fonts | H-04 | Fontations variation metadata; Forge source follow-up and OS discovery |
| Tree-grid | B-09/G-01/L-01 | TanStack virtual core selective reuse; authored hierarchy/a11y |
| Expressions | A-12/A-13 | Original bounded unit-expression parser still needed; no source admitted |
| Radial menu | A-06/A-19/B-34 | Kando MIT angle/wedge math; native gestures/presentation |
| Minimap | B-14/G-14/M-10 | XYFlow geometry; RN/Skia viewport overlay |
| Accessible graphs | G-14/M-10 | XYFlow topology; authored keyboard port navigation/engine commands |
| Resource relink | A-22/D-29/N-14 | Native file access patterns + Forge asset identity; no complete source admitted |
| Recovery/conflicts | A-24/N-10/N-11 | Forge Automerge evaluation; original recovery dialog and NFD1 authority |
| Overlay coordinator | A-19/A-20/N-08/N-09 | Floating UI coordinates; native portals/focus/hinge clipping pending |
| Toolbar shortcuts | A-06/A-07/A-27/N-07 | Superlist keyboard layout; shared registry and customization UI |
| Pen calibration | B-17/N-03/N-04 | google/ink input model; existing Muse SDK integration |
| HDR diagnostics | C-08/C-09/C-25 | OpenColorIO processor; native display capabilities and authored UI |
| Job monitor | A-26/D-29/G-15/N-13 | p-queue policy; Forge native scheduling/persistence |

## Expo Modules v2 integration contract

Use the existing Expo 58 host and module package; pin its installed API and codegen.
The Expo Modules API docs (https://docs.expo.dev/modules/overview/) separate the established
view DSL from any v2 macro migration.
Do not label a DSL wrapper as a macro migration or invent v2 custom-view APIs.
Swift/Kotlin OS services use Expo v2 where supported. Rust/C++ cores use the existing
reviewed native FFI/Nitro v1 boundary; putting Rust under an Expo wrapper does not remove
thread, ownership or ABI requirements. Swift/Kotlin ports do not automatically cover web,
WinUI, AppKit or XR.

Required adapters: iOS/iPadOS, Android/tablet/Duo, web, macOS, Windows, visionOS,
Meta Quest and PICO. Each has an explicit build + interaction + accessibility + lifecycle
gate. Browser permission denial and unavailable device hardware must be truthful; required
editing workflows cannot disappear. Watch and QNX/Linux surfaces need separately scoped APIs.
Keep Spark (Expo SDK 55 / RN 0.83, per Forge PR #38) separate from the Expo58 host.

For Superlist replace irondash/Flutter engine and message-channel dependencies, implement
owned native handles, main-thread dispatch, cancellation and teardown. Do not embed Flutter.
For web-derived sources extract pure algorithms, never raw HTML/DOM editor shells.
Keep Zustand/refs, existing foldable geometry and app-supplied styling.

## Implemented slice and validation

- @nyc-tron/geometry/overlay-placement: Floating UI-derived coordinate calculation,
  standalone types, finite/nonnegative bounds validation, RTL alignment and overflow rejection.
- MIT copyright/license retained under packages/geometry/licenses.
- Four Node tests cover all 12 placements, RTL physical edges, oversized/zero-width anchors
  and invalid/overflow input. `pnpm verify` (156 tests, build, typecheck, verify-packages,
  pack-release) passed locally on Node 26.13.0; the geometry tarball ships
  `dist/overlay-placement.*`, `THIRD_PARTY_NOTICES.md` and `licenses/floating-ui-MIT.txt`.
- No native consumer, browser overlay or device tests run. The function has no UI, so
  accessibility and theme tokens belong to the overlay host that consumes it.
- This function does not flip/shift into safe regions or manage focus. The caller must select
  a valid hinge-safe region and a real overlay host before this is a usable popover.

## Sources excluded from automatic admission

Dockview Enterprise is commercial; its MIT core is separate.
Current STTextView is GPL/commercial, despite older downstream descriptions saying BSD.
KeyboardKit's README badges it as commercially licensed (KeyboardKit Pro needs a license key).
No code/assets from these packages are copied here. Kando assets have separate licenses.
Root license review never substitutes for dependency/file notices.

## Recovery integration checkpoint

PR #26 was updated by merging current main (including #53 / alpha.4) into its preserved history. The Floating UI calculation, inlined utility helpers and MIT license were checked against their exact pinned upstream blobs. This is a pure geometry subpath; the other source candidates remain unported. Existing app window/navigation/state contracts are unchanged. The published alpha.4 assets are immutable and do not include this later subpath; it is available from source until a subsequent release. Current build/type/export/tarball checks are rerun for this integration rather than inferred from the earlier 156-test checkpoint.
