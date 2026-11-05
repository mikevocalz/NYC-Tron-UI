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

```tsx
import { NativeDropdown } from "@nyc-tron/expo-controls/NativeDropdown";
import { NativeActionMenu } from "@nyc-tron/expo-controls/NativeActionMenu";

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
```

These require Expo SDK 58/React Native 0.88 on an actual Expo host. Never
install this into the isolated Legend Spark SDK 55/RN0.83 macOS build or RNW
0.85/WinUI host; those need their own native adapter packages.

No global theme CSS is installed. The host app keeps its own Tailwind v4,
Uniwind, text ramp and brand colors. Expo's OS-managed menu appearance cannot
take arbitrary Tailwind CSS effects. Tests prove source contracts but NOT
physical native-menu behavior, keyboard focus or screen-reader UX.

Reference: https://docs.expo.dev/versions/latest/sdk/ui/universal/picker/ and
https://docs.expo.dev/versions/latest/sdk/ui/drop-in-replacements/menu/ .
