# Native feel references

## Workspace app

`ReferenceApp.tsx` composes four working screens from the public NYC-Tron package
subpaths. It is a small local workspace, with one Zustand owner above its routes
and adaptive pane. Switching routes hides existing children; resizing does not
replace an input, its selection, or a decoder owner.

| Screen | Working interactions |
| --- | --- |
| Library and detail | Load and retry a catalog; distinguish loading, failed and empty reads; search and select; keep or remove saved items; open the related editor or media review. |
| Editor and inspector | Edit a cover's headline and subtitle; filter properties; change alignment and opacity; save a valid draft or restore its saved state. Slider preview is separate from the committed document. |
| Media detail | Request a real decoded frame, recover from a failed read, change review position, and save a note against the decoder's reported timestamp. |
| Settings | Validate a workspace name, choose a starting route, preview System/Light/Dark, save locally and restore saved preferences. |

The default library contains three local sample records. Hosts can pass
`loadLibrary(signal)` to read their own source. Errors remain errors, and a late
completion from an aborted or disposed request cannot replace current data.
`mediaSource` supplies `loadFrame(timeUs, signal)` and owns the actual decoder.
The shared recipe does not import an engine. Without a source, the media screen
shows a recoverable error instead of inventing decoded frames or playback.

```tsx
import { ReferenceApp } from "./ReferenceApp";

<ReferenceApp
  initialAppearance="system"
  navigation={{ runtime: "web", family: "unknown" }}
  loadLibrary={readCatalog}
  mediaSource={reviewSource}
/>
```

The app owns tokens and supplies a usable container. Web keeps a header and
adds bottom tabs at the app's compact breakpoint. Native navigation takes a
verified `NavigationInput`, never a family inferred from live window width.
The optional `renderNativeRail` lets a host supply its real platform rail.
Windows and macOS need their own native navigation adapter; this recipe does
not turn shared RN navigation into AppKit or WinUI.

### Native entry

The same screens are mounted by `examples/native-instruments/reference-app.js`.
Run that Expo SDK 58 host with `NYC_TRON_ACCEPTANCE=reference`. Metro selects
`reference.css`, and the app config allows automatic system appearance for this
entry. Its public native dropdown and slider use SwiftUI/Compose adapters. The
native rail uses `@nyc-tron/native-navigation` when verified capability chooses
a physical-right rail.

The standalone entry explicitly selects the ordinary-phone acceptance host.
A tablet or headset runner must pass its verified family into
`NativeReferenceApp`; the example does not infer it from width. Reported folds
are retained as a capability and current reserved regions determine safe
placement. This reference uses one safe region for the whole workspace. The
physical-right region selector keeps a foldable rail on the right in RTL and
tabletop arrangements; it does not claim a multi-pane spanning editor.

The native media host uses Expo Asset for the bundled generated MP4 and the
public platform-services decoder. The browser fixture uses the existing
generated WebM. The screen displays decoder-reported frame timing, including
the distinction between native presentation time and a browser seek target.
There is no synthetic playback clock. Native cache cleanup waits for the
owner's outstanding work and does not run over a renewed effect lifetime.

### Repeatable checks

Run `node --test examples/native-feel/tests/reference-model.test.mjs` for request
ownership and recovery. The browser fixture is `/reference-app`, with tests in
`packages/ui/tests/browser/reference-app.spec.mjs`. It covers real interactions,
input identity, resize, nested containers, RTL, large text, decoded frames,
validation and theme changes, and captures desktop and phone appearances.

The optional `onRenderSample` reports React Profiler `actualDuration`.
The browser suite records ten warm route cycles and writes per-route p50/p95
and raw samples to `shots/reference-render-timings.json`. These numbers measure
React render work in a development Chromium build. They do not measure native
presentation, production startup, decoder performance, or physical-device UX.
There is no guessed performance threshold.

Browser interaction, packaged consumer bundling, native compilation and native
device interaction are separate results. Device checks must still exercise
keyboard dismissal, narration, native picker/slider behavior, physical input,
fold changes and route continuity on the intended hardware.

## Account screen

`AccountScreen.tsx` is a shared React Native recipe for NYC-Tron's native-feel
direction. It uses the same mounted form and preview on small and large
containers. `ContentFrame` caps the reading width at 1024 layout units;
`AdaptiveColumns` wraps the form and preview according to their content widths.
The form is capped at 560 units. Increased text scale raises the preferred
column widths so the content wraps sooner.

The screen has working local interactions: edit the display name, choose a
default workspace, switch appearance, save to the visible preview, and reset
an unsaved draft. Blank names produce an inline error. Save trims surrounding
whitespace. State belongs to one Zustand store per mounted screen, so resizing
does not create a second form or discard an edit. Closing or reloading the
screen discards this demo's data; there is no account service or persistent
storage behind it.

## Use in a host

Import the `AccountScreen` recipe into an existing Expo SDK 58 / RN 0.88 or
compatible web host. This folder is a recipe, not a standalone Expo application.

```tsx
import { AccountScreen } from "./AccountScreen";

<AccountScreen initialDisplayName="Alex Morgan" initialAppearance="system" />
```

The optional props initialize a mounted instance. Subsequent prop changes do
not replace its draft. The app owns navigation, route state and shell selection.
Mount this content inside an existing usable pane and handle hinges with
`AdaptivePaneHost`; the intrinsic columns do not resolve fold geometry.

The host supplies Uniwind and its light/dark token definitions, including
`surface-sunken`, `surface-raised`, `text`, `text-muted`, `border`, `primary`,
`on-primary`, `danger`, `focus`, and `radius-control`. Keep `radius-control`
small for this reference. Include this folder and NYC-Tron's installed
`dist/components` in the host's Tailwind `@source` paths. `NightScope` selects
the matching app-owned token scope; it does not install a palette.

The appearance selector applies immediately. An explicit Light or Dark choice
also reaches `NativeDropdown` through `colorScheme`; System leaves that prop
undefined so its native Host follows the device. The surrounding token scope
uses React Native's current color scheme. On web the flat dropdown uses Expo's
universal picker. On iOS and Android it uses the existing native adapter.

`Button`, `TextField`, `SegmentedControl` and the layout containers are shared
React Native controls. They are not claimed to be AppKit, WinUI or SwiftUI
widgets. The Expo native dropdown requires the compatible Expo host; this
recipe does not establish Windows, macOS, QNX or headset adapter support.

## Acceptance

Check a narrow and wide container, intermediate sizes, light/dark/system
appearance, large text, keyboard access, blank-name validation, saving and
resetting. Resize during an unsaved edit and verify that the same input keeps
its draft. A browser result is separate from native simulator or device
evidence; native dropdown placement, keyboard and screen-reader behavior need
their own platform checks.
