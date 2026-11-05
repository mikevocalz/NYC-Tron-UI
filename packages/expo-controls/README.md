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

`NativeActionMenu`: `@expo/ui/community/menu` for **real SwiftUI Menu or
ContextMenu and Compose DropdownMenu** on iOS/Android. On web uses an
independent working React Native Modal (because Expo's native MenuView web
implementation has no action callbacks); not an OS-native menu on web.
Native `.native` file imported only by native bundlers.
On web a `longPress` menu also opens on a plain press, because keyboard and
screen-reader activation only send a press there.

`NativePopover`: a SwiftUI `.popover` on iOS (through @expo/ui `Popover`) and a
Material 3 `DropdownMenu` surface on Android, both holding your React Native
content. It takes the same `anchor` rect and `usableRegions` as `placePopover`
in `@nyc-tron/ui`. Mount it in the view whose coordinates those rects use,
normally the screen root. On native an invisible anchor sits over the rect and
the OS places and dismisses the surface; `placePopover` only picks which side
of the anchor has room in the usable region. On web the surface is placed by
`placePopover` directly. Controlled with `open` and `onOpenChange`.

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

<NativePopover open={open} onOpenChange={setOpen}
  anchor={triggerRect} usableRegions={layout.usableRegions}
  accessibilityLabel="Layer settings">
  <LayerSettings />
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

Reference: https://docs.expo.dev/versions/latest/sdk/ui/universal/picker/ and
https://docs.expo.dev/versions/latest/sdk/ui/drop-in-replacements/menu/ .
https://docs.expo.dev/versions/latest/sdk/ui/swift-ui/popover/ and
https://docs.expo.dev/versions/latest/sdk/ui/jetpack-compose/tooltip/ .
