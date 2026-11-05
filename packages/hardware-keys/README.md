# @nyc-tron/hardware-keys

Hardware keyboard shortcuts on iOS, Android and web, dispatched through the
`KeyboardMap` in `@nyc-tron/ui/components/shell/keyboard-map`. React Native
delivers key events only on web; this package adds the native sources.

| Platform | Source | Notes |
| --- | --- | --- |
| iOS / iPadOS | `UIKeyCommand`s on the key window's root view controller; a hidden first responder reading `UIPress.key` while recording | Registered chords also appear in the Command-key overlay under their titles. Text editing chords (Mod+C, Mod+Z, …) do not take priority over a focused field. |
| Android 9+ | `View.addOnUnhandledKeyEventListener` on every window root (`WindowInspector`, Android 10+) | Only keys no view handled arrive, so a focused EditText keeps its own. A Modal's Dialog window is picked up when it takes focus. Android 9 covers the Activity window only; Android 8 and earlier report unavailable. |
| Web | `document` keydown in the capture phase | React Native Web's TextInput stops keydown from bubbling, hence capture. Keys inside an `aria-modal` dialog, IME composition and already-handled keys are skipped. |

```tsx
import { createKeyboardMap } from "@nyc-tron/ui/components/shell/keyboard-map";
import { KeyboardShortcutHUD } from "@nyc-tron/ui/components/shell/KeyboardShortcutHUD";
import { useHardwareKeyboard, getHardwareKeyRecorder } from "@nyc-tron/hardware-keys";

const map = useMemo(() => createKeyboardMap(commands, apple), [commands, apple]);
useHardwareKeyboard({ map, activeScopes: [focusedPane], enabled: !sheetOpen, onCommand: run });

<KeyboardShortcutHUD commands={commands} onRebind={rebind} recorder={getHardwareKeyRecorder()} … />
```

`useHardwareKeyboard` resolves each keydown with the map: the innermost active
scope wins, disabled commands never fire, and a focused text field keeps
typing and editing keys unless the command sets `allowInTextInput`. Mount it
once near the root. Several mounted hooks are merged into one native
registration, and the first one to register a chord keeps its overlay title.

`getHardwareKeyRecorder()` is what lets `KeyboardShortcutHUD` record a new
binding on iOS and Android; without it the sheet stays read-only there. It
returns `undefined` on web (the sheet records from the browser) and when the
module is not linked.

The map reports what will not work before anyone relies on it:
`map.conflicts()` (one chord, two commands, same scope) and `map.reserved()`
(chords the OS takes first, such as Command-Q or Alt-F4).

## Native module

One Expo Modules 2 module, `NYCTronHardwareKeys`, on both platforms:
`@ExpoModule` / `@JS` / `@Record` / `@Event` Swift macros with no ExpoUI
dependency, and a Kotlin `@ExpoModule` built by the `v2 true` Gradle plugin.
JS calls `setBindings`, `setRecording` and `isSupported` and listens for
`chord`. The Android class stays out of `android.modules` in
`expo-module.config.json`; v2 modules link through `ExpoModulesV2ModuleList`.

Peers: `@nyc-tron/ui`, `expo` 58, `react`, `react-native`.

## Verified so far

Unit and source-contract tests, a mocked-host render test of the sheet's
native recording path, and Chromium tests of web dispatch. CI compiles both
native modules into the example app (APK dex check, iOS simulator build).
Key delivery has not been run on an iPad or an Android device with a
hardware keyboard yet.

## Provenance

Original NYC-Tron UI source. MIT, see `LICENSE`.
