# @nyc-tron/platform-services

Platform services for creative editors. Import each service by subpath.

| Subpath | Roster ID | iOS | Android | Web |
| --- | --- | --- | --- | --- |
| `/haptics` | N-05 HapticsAndFeedback | `UIFeedbackGenerator` (selection, impact, notification), prepared generators | `View.performHapticFeedback`; no VIBRATE permission | unavailable; the opt-out still persists |
| `/documents` | N-12 NativeFileAndShareAdapter | `UIDocumentPickerViewController` (import or open-in-place), security-scoped access, bookmarks; `UIActivityViewController` | `ACTION_OPEN_DOCUMENT` through the Activity Result API, persisted URI grants; share chooser through the kit's own `FileProvider` | pick through `@nyc-tron/ui`'s FilePicker; share through the Web Share API |
| `/playback` | N-17 NativePlaybackLifecycle | `AVAudioSession` activation, interruptions, old-device-unavailable route changes, media-services resets | `AudioManager` focus (lost, transient, duckable, regained); `AudioDeviceCallback` for wired and Bluetooth outputs going away | unavailable; the policy still runs on events the app dispatches |

| `/checkpoints` | N-10 document recovery storage | Immutable files through Expo FileSystem | Immutable files through Expo FileSystem | IndexedDB transactions |
| `/media` | N-19 media decoder | AVFoundation probe, timestamped JPEG frames and Float32 PCM files | MediaExtractor/MediaCodec probe, timestamped JPEG frames and Float32 PCM files | Browser video seeking and Web Audio PCM |
| `/scheduler` | N-13 long-task scheduling | Cooperative FIFO queue; identical on every host | Same | Same |
| `/media-cache` | N-14 media cache | Bounded LRU for host-supplied derived bytes; identical on every host | Same | Same |
| `/speech` | ASR provider (Forge P-asr decision) | `SFSpeechRecognizer` + `AVAudioEngine` tap; `requiresOnDeviceRecognition` when `onDeviceOnly` | `SpeechRecognizer` with `EXTRA_PREFER_OFFLINE` / on-device API (31+); system owns the mic | `SpeechRecognition`/`webkitSpeechRecognition`; no on-device mode — consent required |

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
// When the sole app owner closes its player:
await session.dispose({ releaseFocus: true });
```

The policy (`nextPlaybackState`, also at `/playback-policy`) is a pure
function. An interruption pauses and resumes only when the OS says
`shouldResume`. A duckable focus loss lowers the volume, a transient one
pauses until focus returns, and a permanent one pauses for good. Losing the
headset or Bluetooth output pauses and never resumes by itself, so audio does
not jump to the speaker. A media-services reset asks the app to rebuild its
players.

Disposal stops callbacks immediately and drains accepted operations. Shared
preview/recording owners retain their focus coordinator and leave `releaseFocus`
unset.

Background audio is not configured here. iOS needs `UIBackgroundModes: audio`
in the app's Info.plist; Android needs the app's own foreground media service.

## Media decoding

```ts
import { createPlatformMediaDecoder } from "@nyc-tron/platform-services/media";
const decoder = createPlatformMediaDecoder();
const probe = await decoder.probe(localUri);
const frame = await decoder.decodeFrame(localUri, { timeUs: 125000, maxWidth: 960, maxHeight: 540 });
const audio = await decoder.decodeAudio(localUri, { startUs: 250000, durationUs: 500000, sampleRate: 24000 });
await decoder.clearCache();
```

Times are integer microseconds. Frame results report the native presentation
timestamp; the browser fallback reports its settled seek target. Native audio
stays in little-endian interleaved Float32 files. Output URIs are cache entries
and can be evicted. Keep source access grants open while decoding content URIs.

Android accepts local file/content sources, SDR flexible 8-bit YUV frames and
supported platform audio codecs. It resamples PCM linearly, bounds one output at
128 MiB, keeps at most 256 MiB/256 output files, and stops a request after 30
seconds. HDR, DRM and unsupported format/timestamp changes reject explicitly.
These limits do not imply acceptance of every codec or color profile.

## Checkpoints

`createPlatformCheckpointStorage(namespace)` provides owned binary reads and
atomic replacement. Native storage retains immutable generations; web storage
waits for IndexedDB transaction completion. Corrupt/torn records fall back to a
prior generation. Await `close()` to drain writes. This supports process recovery;
OS power-loss fsync is not established.

## Scheduler

`createLongTaskScheduler()` from `/scheduler` runs host-supplied decode,
export and render work as a cooperative FIFO queue, one task at a time, with a
yield to the event loop before each start. Each task gets a `TaskContext`:
`checkpoint()` yields and throws `TaskCancelledError` once cancelled,
`throwIfCancelled()` checks synchronously, and `reportProgress()` delivers
clamped 0..1 progress to the submit options. `cancel(id)` rejects queued work
immediately and marks running work; `close()` rejects the queue and resolves
when running work next yields.

JavaScript cannot preempt synchronous work, so a task that never checkpoints
keeps the scheduler open and `close()` waits for it. Native codec offload,
worker threads and cancellation of already-submitted decode stay with the
engine/host — this module owns ordering, bounds, progress and settled results.

## Media cache

`createMediaCache({ maxBytes, maxEntries?, estimate?, onEvict? })` from
`/media-cache` is a bounded least-recently-used store for derived bytes the
host generates and keys: waveform peaks, preview frames, thumbnails. `get`
refreshes recency, `peek` does not, `set` evicts oldest-first until both bounds
hold, and values larger than `maxBytes` are rejected. The default estimator
measures `ArrayBuffer`, views and `{ bytes }` wrappers; pass `estimate` for
other shapes. `close()` drops every retained reference. The cache never
decodes media and holds no document state.

## Speech recognition

```ts
import { createPlatformSpeechRecognizer, createSpeechConsent } from "@nyc-tron/platform-services/speech";

const consent = createSpeechConsent({ storage: mmkv }); // separate from telemetry consent
const speech = createPlatformSpeechRecognizer({ consent });
const probe = await speech.probe(); // { available, onDevice, networkPossible }

const session = await speech.start({ locale: "en-US", hints: ["NYC-Tron"] }); // onDeviceOnly: true by default
session.addListener(event => {
  if (event.type === "partial") preview(event.text);
  if (event.type === "final") commit(event.text);       // words? when the platform supplies timings
  if (event.type === "end") finish(event.reason);
  if (event.type === "error") report(event.error.code);
});
await session.stop();  // flush: resolves on the terminal "end"/"error" event
// or session.abort() to cancel immediately
```

On-device is the default (`onDeviceOnly: true`). Passing
`onDeviceOnly: false` — or any recognition on web — may route audio to a
network recognizer and requires `consent.networkRecognition`, granted only
through `createSpeechConsent`'s explicit `grantNetworkRecognition()` from
the app's own settings UI. This consent is **not** the N-18 telemetry
consent; neither authorizes the other.

Platform notes and honest limits:

- **iOS:** requests `NSSpeechRecognitionUsageDescription` and
  `NSMicrophoneUsageDescription` (both must be in the host Info.plist) and
  activates a `.playAndRecord` audio session for the session's lifetime —
  coordinate with `NYCTronPlaybackSession` so the two do not fight over
  `AVAudioSession`. `requiresOnDeviceRecognition` is set for
  `onDeviceOnly`; server recognition only runs when it is false *and*
  consent is granted. Word timings come from
  `SFSpeechRecognitionResult.segments`.
- **Android:** declares `RECORD_AUDIO`; the host must grant it at runtime
  (`start` rejects `"permission"` otherwise). `onDeviceOnly` (the default)
  requires `createOnDeviceSpeechRecognizer` on API 31+ — when it is
  unavailable `start` rejects `"unsupported-format"` rather than falling
  back to a network path. `onDeviceOnly: false` uses the network-capable
  recognizer and requires speech consent at the JS layer.
  `probe().networkPossible` stays
  true. No word timings. `hints` map to `EXTRA_BIASING_STRINGS` on API 33+.
- **Web:** every browser path is treated as cloud-class — there is no API
  to verify on-device routing, so `onDeviceOnly: true` rejects
  `"unsupported-format"` and `onDeviceOnly: false` requires consent.
- **Windows/Linux:** no backend in this package; `isAvailable` is false
  and calls reject `"unsupported-format"`.

Sessions are capped at 4 per recognizer and bounded by `maxSessionMs`
(default 10 minutes); past it the session aborts with `"recognition-failed"`.
Nothing here is journaled or snapshotted — committed transcript text is the
host's data to feed engines through their normal ops.

## Native module

Six Expo Modules 2 modules in one pod (`NYCTronPlatformServices`) and one
Gradle library: `NYCTronHaptics`, `NYCTronDocuments`,
`NYCTronPlaybackSession`, `NYCTronMediaDecoder`, `NYCTronMediaEncoder` and
`NYCTronSpeech`. Swift uses the `@ExpoModule` / `@JS` / `@Record` /
`@Event` macros and does not import ExpoUI. Kotlin is built by the `v2 true`
Gradle plugin; the classes stay out of `android.modules` in
`expo-module.config.json`. The Android library declares exactly one
permission, `RECORD_AUDIO`, for speech recognition.

Peers: `expo` 58, `react`, `react-native`, `zustand`.

## Verified so far

982 repository source tests pass, including the scheduler and media-cache
suites. Fresh iOS/Android simulator builds and native
checks cover generated media frame/PCM decoding, picker import/bookmark recovery,
local diagnostic export and checkpoint process relaunch. The media fixture returns
12000 samples at 24000 Hz for its half-second span on both platforms.

Physical haptics, calls, output-route changes, screen readers, wider codec/color
profiles, real speech-recognition sessions on any platform (the Swift/Kotlin
backends are contract-tested but unrun on device) and the other required
hosts still need acceptance. See the companion
[Forge phase reports](https://github.com/mikevocalz/nitro-forge/tree/codex/complete-all-components/docs/completion/reports)
for commands, artifacts and limits.

## Provenance

Original NYC-Tron UI source. MIT, see `LICENSE`. N-17 is not ported from
FilmCraft `Voiceover.kt`; no ArtCraft source is used.
