# Account screen reference

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
