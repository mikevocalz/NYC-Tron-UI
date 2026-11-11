# NYC-Tron Expo Controls (SDK 58)

Optional native-control leaf package. It is not installed when an app imports
`@nyc-tron/ui/components/Button`. It is not linked to Nitro Forge engines.

`NativeDropdown`: a SwiftUI `Picker` on iOS, a Material 3 exposed dropdown
in Compose on Android, and Expo's universal `Picker` (a `<select>`) on web.
Controlled single-select; values and labels must be unique. The `label` is
what screen readers announce: on iOS it is the SwiftUI picker label, on
Android the anchor field's content description, and on web the name of the
group around the `<select>`. The visible caption is hidden from assistive
tech on native so it is not read twice.

Pass `groups` instead of `options` to put choices under headings:
`groups={[{heading:"Sans serif",options:[...]},...]}`. On iOS each group is a
SwiftUI `Section` inside the picker; the `menu` style shows the headers, the
`wheel` rotor lists the options without them. On Android each group starts
with a heading row (Material `labelLarge`, not selectable) and groups are
split by dividers. On web the universal `<select>` cannot render
`<optgroup>`, so grouped dropdowns use the kit's `Select`, whose list is a
grouped listbox with each group named by its heading. Headings must not be
blank, every group needs an option, and values stay unique across groups.
`options` and `groups` together throw.

`NativeActionMenu`: `@expo/ui/community/menu` for **real SwiftUI Menu or
ContextMenu and Compose DropdownMenu** on iOS/Android. On web uses an
independent working React Native Modal (because Expo's native MenuView web
implementation has no action callbacks); not an OS-native menu on web.
Native `.native` file imported only by native bundlers.
On web a `longPress` menu also opens on a plain press, because keyboard and
screen-reader activation only send a press there.

`NativePopover`: a SwiftUI `.popover` on iOS (through @expo/ui `Popover`) and a
Material 3 `DropdownMenu` surface on Android, both holding your React Native
content. Controlled with `open` and `onOpenChange`. It has two forms:

- **Rect form**: the same `anchor` rect and `usableRegions` as `placePopover`
  in `@nyc-tron/ui`. Mount it in the view whose coordinates those rects use,
  normally the screen root.
- **Trigger form**: pass `trigger` (a node, or a function that receives
  `{open, toggle, triggerProps}`) and no `anchor`. The popover renders the
  trigger, measures it in window coordinates each time it opens and anchors
  to it, so the app never measures anything. Mount it where the trigger
  belongs. `usableRegions` is optional and defaults to the whole window; on
  a foldable pass the layout owner's window-space regions. Spread
  `triggerProps` on your pressable so screen readers hear that it opens a
  dialog and whether it is open.

On native an invisible anchor sits over the rect or the trigger and the OS
places and dismisses the surface; `placePopover` only picks which side of the
anchor has room in the usable region. On web the surface is the kit's
`AnchoredPopover`, placed by `placePopover` directly.

`Tooltip`: a Material 3 plain tooltip (Compose `TooltipBox`) on Android. iOS has
no touch tooltip, so on iOS nothing is drawn and the text goes into the
anchor's `accessibilityHint` for VoiceOver. On web it shows after a hover or
keyboard-focus delay, hides on leave, blur or Escape, and is linked to the
control with `aria-describedby`. Keep anything sighted touch users need out of
tooltips.

Web keyboard behavior for `NativeActionMenu` and `NativePopover`: Tab and
Shift+Tab cycle inside the open overlay, Escape closes it, and focus returns to
the element that opened it.

```tsx
import { NativeDropdown } from "@nyc-tron/expo-controls/NativeDropdown";
import { NativeActionMenu } from "@nyc-tron/expo-controls/NativeActionMenu";
import { NativePopover } from "@nyc-tron/expo-controls/NativePopover";
import { Tooltip } from "@nyc-tron/expo-controls/Tooltip";

<NativeDropdown label="Lesson" value={lesson} options={lessonOptions}
  onValueChange={setLesson} />

<NativeActionMenu accessibilityLabel="Lesson actions"
  trigger={<Text>More actions</Text>}
  actions={[
    {id:"rename",title:"Rename"},
    {id:"pin",title:"Pin",checked:pinned},
    {id:"delete",title:"Delete",destructive:true}
  ]}
  onAction={action => executeLessonAction(action)} />

<NativeDropdown label="Typeface" value={font} onValueChange={setFont}
  groups={[
    {heading:"Sans serif",options:[{value:"inter",label:"Inter"}]},
    {heading:"Serif",options:[{value:"source",label:"Source Serif"}]},
  ]} />

<NativePopover open={open} onOpenChange={setOpen}
  anchor={triggerRect} usableRegions={layout.usableRegions}
  accessibilityLabel="Layer settings">
  <LayerSettings />
</NativePopover>

<NativePopover open={strokeOpen} onOpenChange={setStrokeOpen}
  accessibilityLabel="Stroke width"
  trigger={({toggle,triggerProps}) =>
    <Pressable {...triggerProps} accessibilityRole="button"
      accessibilityLabel="Stroke width" onPress={toggle}>
      <Text>Stroke width</Text>
    </Pressable>}>
  <StrokeWidthPicker />
</NativePopover>

<Tooltip label="Writes the lesson to disk">
  <Button onPress={save}>Save</Button>
</Tooltip>
```

`examples/native-instruments` renders all four components (`OverlayDemo.tsx`).
The `NYC-Tron native controls` workflow runs `expo prebuild` on it and compiles
the Android app with Gradle and the iOS app with Xcode, which proves the
@expo/ui views link. It does not run the app.

These require Expo SDK 58/React Native 0.88 on an actual Expo host. Never
install this into the isolated Legend Spark SDK 55/RN0.83 macOS build or RNW
0.85/WinUI host; those need their own native adapter packages.

No global theme CSS is installed. The host app keeps its own Tailwind v4,
Uniwind, text ramp and brand colors. Expo's OS-managed menu appearance cannot
take arbitrary Tailwind CSS effects. Tests prove source contracts and, in Chromium, the web keyboard paths. They do
NOT prove native menu or popover placement, touch behavior, hardware-keyboard
focus or screen-reader output on a device.

### App-selected appearance

`NativeDropdown`, `NativeSliderField`, `NativeSplitButton`, `NativePopover`
and Android `Tooltip` accept `colorScheme="light"` or `colorScheme="dark"`.
This forwards the app's choice to the existing Expo `Host`; omit it for the
platform setting. Switching this prop preserves the control's identity and
local interaction state. Keep app theme selection in the existing app store
and pass its resolved choice to the controls:

```tsx
<NativeDropdown label="Typeface" value={font} onValueChange={setFont}
  colorScheme={appearance === "system" ? undefined : appearance}
  options={typefaces} />
```

The flat web dropdown also passes the choice to Expo's universal Host.
Token-styled web fallbacks, grouped web dropdowns and surrounding RN content
use the app's CSS/theme as before; this prop does not install a global theme.
On iOS `Tooltip` only adds an accessibility hint, so it draws no surface to
theme. `NativeActionMenu` and `ContextMenu` retain platform appearance:
the pinned Expo 58.0.27 iOS `MenuView` does not forward a color scheme to its
Host. They therefore do not expose an override that would only work on Android.

Forwarding is checked against the installed Expo types and mocked render
tests. Native screenshots and device interaction remain separate acceptance
checks. See the [Expo Host API](https://docs.expo.dev/versions/latest/sdk/ui/universal/host/).

Reference: https://docs.expo.dev/versions/latest/sdk/ui/universal/picker/ and
https://docs.expo.dev/versions/latest/sdk/ui/drop-in-replacements/menu/ .
https://docs.expo.dev/versions/latest/sdk/ui/swift-ui/popover/ and
https://docs.expo.dev/versions/latest/sdk/ui/jetpack-compose/tooltip/ .
