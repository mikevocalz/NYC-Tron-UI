# @nyc-tron/platform-services

Three native services a creative app needs around its editors. Each one is a
subpath, so an app takes only what it uses.

| Subpath | Roster ID | iOS | Android | Web |
| --- | --- | --- | --- | --- |
| `/haptics` | N-05 HapticsAndFeedback | `UIFeedbackGenerator` (selection, impact, notification), prepared generators | `View.performHapticFeedback`; no VIBRATE permission | unavailable; the opt-out still persists |
| `/documents` | N-12 NativeFileAndShareAdapter | `UIDocumentPickerViewController` (import or open-in-place), security-scoped access, bookmarks; `UIActivityViewController` | `ACTION_OPEN_DOCUMENT` through the Activity Result API, persisted URI grants; share chooser through the kit's own `FileProvider` | pick through `@nyc-tron/ui`'s FilePicker; share through the Web Share API |
| `/playback` | N-17 NativePlaybackLifecycle | `AVAudioSession` activation, interruptions, old-device-unavailable route changes, media-services resets | `AudioManager` focus (lost, transient, duckable, regained); `AudioDeviceCallback` for wired and Bluetooth outputs going away | unavailable; the policy still runs on events the app dispatches |

## Haptics

```ts
import { createPlatformHaptics, useHapticsEnabled } from "@nyc-tron/platform-services/haptics";

export const haptics = createPlatformHaptics({ storage: mmkv }); // MMKV: getString / set
haptics.prepare("detent");        // before a drag
haptics.play("detent");           // each snap point
const [on, setOn] = useHapticsEnabled(haptics); // bind the app's own settings Switch
```

Kinds describe meaning (`selection`, `detent`, `success`, `gesture-start`, …),
not motor strength. The person's opt-out wins over every call, and the OS
setting still applies underneath (System Haptics on iOS, touch feedback on
Android). Repeats of one kind inside `minIntervalMs` (30 ms) are dropped so a
fast scrub does not queue taps.

## Documents

```ts
import { createPlatformDocuments, documentPickerSource } from "@nyc-tron/platform-services/documents";
import { FilePicker } from "@nyc-tron/ui/components/files/FilePicker";

const documents = createPlatformDocuments();
<FilePicker label="Open" accept=".nfd,image/png" onFiles={webFiles}
  documentSource={documentPickerSource(documents, "open-in-place")} onDocuments={openNative} />

const [doc] = await documents.pick({ types: [".nfd"], mode: "open-in-place" });
store(doc.bookmark);                                   // later launch:
const access = await documents.restoreAccess(saved);   // undefined when the file is gone
if (access?.stale) store(access.bookmark);
await documents.releaseAccess(access.uri);             // when the document closes
await documents.share({ uris: [exportedFileUri], title: "Export" });
```

`import` gives the app its own copy (Android copies into
`cache/nyctron-imports/`). `open-in-place` keeps the original: iOS starts the
security scope and returns a bookmark; Android persists the read grant (and
write, when the provider gives it) and the content URI is the bookmark.
Android's share sheet does not report completion, so `share` resolves true
there once the sheet opens; iOS resolves whether the person finished.

## Playback lifecycle

```ts
import { createPlatformPlaybackSession } from "@nyc-tron/platform-services/playback";

const session = createPlatformPlaybackSession({
  onAction: action => player[action](), // pause | resume | duck | unduck | reactivate
});
await session.activate({ category: "playback" });
session.setIntent("playing");
```

The policy (`nextPlaybackState`, also at `/playback-policy`) is a pure
function. An interruption pauses and resumes only when the OS says
`shouldResume`. A duckable focus loss lowers the volume, a transient one
pauses until focus returns, and a permanent one pauses for good. Losing the
headset or Bluetooth output pauses and never resumes by itself, so audio does
not jump to the speaker. A media-services reset asks the app to rebuild its
players.

Background audio is not configured here. iOS needs `UIBackgroundModes: audio`
in the app's Info.plist; Android needs the app's own foreground media service.

## Native module

Three Expo Modules 2 modules in one pod (`NYCTronPlatformServices`) and one
Gradle library: `NYCTronHaptics`, `NYCTronDocuments` and
`NYCTronPlaybackSession`. Swift uses the `@ExpoModule` / `@JS` / `@Record` /
`@Event` macros and does not import ExpoUI. Kotlin is built by the `v2 true`
Gradle plugin; the classes stay out of `android.modules` in
`expo-module.config.json`. The Android library declares no permissions.

Peers: `expo` 58, `react`, `react-native`, `zustand`.

## Verified so far

JS behavior tests with fake native modules, source contracts for both
platforms, a mocked-host render test of the native FilePicker, a local
`swiftc -swift-version 6` typecheck of the non-macro Swift against the
iOS 27.1 simulator SDK, and CI compiles of both native sides into the example
app (APK dex and merged-manifest check, iOS simulator build). Nothing has run
on a device yet: no haptic has been felt, no document picked, no call has
interrupted playback.

## Provenance

Original NYC-Tron UI source. MIT, see `LICENSE`. N-17 is not ported from
FilmCraft `Voiceover.kt`; no ArtCraft source is used.
