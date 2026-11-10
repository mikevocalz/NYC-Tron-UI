# Native consumer corrections — November 10, 2026

The Qt package changes retain the independent iOS and Android release-consumer
gates. This correction follows the actual artifacts from
[native-controls run 42768863672](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42768863672),
whose PR head was `014051593dc5465f2676c34e6e7d0d926616960f`. The native media
report identifies its checked-out candidate as
`4a6d3761a3447b9e323226c00749e2eb914c8dca`.

## Observed failures and changes

| Gate | Artifact evidence | Correction |
| --- | --- | --- |
| iOS reference UI | Settings cannot open because RN shows `Text strings must be rendered within a <Text> component.` The component stack is native View → Slot → Slider. | `NativeSliderField` supplies SwiftUI `Text` as the Slider's label. The pinned `@expo/ui` 58.0.27 implementation places the label ReactNode directly in a native Slot. |
| Android pointer UI | Settings and Editor flows pass. Pointer input commits exactly one stroke, but its last-event status is below the 320×640 screen. | Place the status before the drawing surface and make the native acceptance screen scrollable. The OS-touch, exact one-commit and Home-interruption cancellation assertions are unchanged. |
| Android media | The strict PCM writer rejects `Audio starts after the requested interval.` | Preserve the fresh audio extractor's initial packet sequence when preroll reaches time zero; seek only when audio preroll is positive. Keep the first-sample guard and include its actual/requested time and sample rate in failure messages. |

The audio change is based on the real fixture and Android's extractor source.
`ffprobe` reports the fixture's AAC priming packet at PTS −1024 at 48 kHz,
followed by the first presentation packet at PTS zero. The Android 15 extractor
starts at sample zero, applies the edit offset when seeking, and exposes
encoder delay to the codec. Seeking to presentation zero can omit priming
input while the newly configured codec still applies that delay. Starting with
the fresh packet sequence preserves it; the PCM writer still trims by decoded
presentation time and rejects missing or discontinuous audio.

Source inspection used AOSP `frameworks/av`, Android 15 tag
`android-15.0.0_r1`, commit
`1863cb0ea5a9e1340f11a435618ff863e017da29`: `MPEG4Extractor.cpp`,
`NuMediaExtractor.cpp` and `CCodecBuffers.cpp`. The same relevant edit/seek
behavior is visible in the current
[AOSP MP4 extractor](https://android.googlesource.com/platform/frameworks/av/+/refs/heads/main/media/module/extractors/mp4/MPEG4Extractor.cpp).
This source diagnosis is not a new Android codec runtime result. The existing
acceptance still requires exactly 32,000 output frames for the complete
two-second fixture at 16 kHz, finite PCM with a real signal, requested-rate
resampling and the bounded tail interval.

## Initial local validation

| Check | Result |
| --- | --- |
| Expo native appearance/Slider label and pointer router tests | 17 passed |
| Platform-services media and native source-contract tests | 13 passed |
| Actual JVM MP4 metadata reader against the real fixture, precise tracks, malformed bounds and cancellation | 8 groups passed |
| `packages/expo-controls` TypeScript check | Passed |
| Changed JS entry/browser test syntax and diff whitespace | Passed |
| Pointer browser acceptance, including the new 320×640 visibility case | Blocked before page startup: Chromium's local socket returned `Operation not permitted`; the environment rejected an elevated retry |
| Entire native example TypeScript check | Blocked by missing local React Native, Zustand and installed component dependencies |
| Corrected iOS/Android compile and simulator interaction | Pending at initial validation; the Android follow-up is recorded below |

The browser case asserts the exact touch/up receipt, its full viewport
visibility and reachable clear/remove controls. It is a browser layout check;
only the hosted native flow can establish the corrected emulator result.

The inspected artifact ZIP identities are:

- iOS artifact `13741297237`, SHA-256
  `5d48def986249d36fae24d2f3e2c2abe52638750a83a65fc2a0b1e5de37dd8b1`.
- Android artifact `13742131552`, SHA-256
  `b02cabba978b8e87558b3d1039f2c3d2e60dafe24af06fb29c71fdec6f421836`.

Applied guidance: the repository's pinned foldable layout and no-ai-slop
contracts, Margelo Kotlin at
`1e9e17be6f41c838db472d6a4b943fc26355a3be`, and the official Expo `expo-ui`
and `expo-native-ui` skills read on November 10. The decisions preserve native
SwiftUI ownership, scrollable content, the existing state owner and strict
decoded-media bounds. Physical device input and screen-reader output remain
separate gates.

## Hosted Android result and cancellation correction

[Native controls run 42840807450](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42840807450),
Android job `129916136357`, tested PR head
`1a7fc0d4fb561913a79ad3377b9a9b9f44201e4c`. The installed-consumer report
identifies source revision `a0e5e277032f4a0cd50e62b3ac448b4da09567f3`.
The job built and installed the packed Kotlin/Compose modules on Android API
35. Its artifact `13777745956`, `native-release-consumer-android`, has SHA-256
`f987e3b2c4a2c61ba7eadc7e717bfdf022e06f01eb1d1b44e13f1fbb6b0ff126`.

| Hosted gate | Result |
| --- | --- |
| Native media decoder | All 11 checks passed, including 24,000 requested PCM frames, 32,000 complete resampled frames and the 4,000-frame tail. The strict first-sample and continuity guards remain enabled. |
| Settings and Editor UI | Both Maestro flows passed. |
| Pointer touch UI | Passed, with exactly one committed stroke and the visible touch/up receipt. |
| Pointer cancellation after Home | Failed: one committed stroke and zero cancelled strokes; the raw event was `cancel`, while the last routed stroke was still `down`. |

The cancellation failure has a separate native cause. The captured observation
contains a cancel sample at `(0, 0)`. AndroidX
[`PointerInteropFilter.onCancel`](https://github.com/androidx/androidx/blob/androidx-main/compose/ui/ui/src/androidMain/kotlin/androidx/compose/ui/input/pointer/PointerInteropFilter.android.kt)
can invoke
[`emptyCancelMotionEventScope`](https://github.com/androidx/androidx/blob/androidx-main/compose/ui/ui/src/androidMain/kotlin/androidx/compose/ui/input/pointer/PointerInteropUtils.android.kt),
which creates a minimal event with unknown input source instead of the
original contact identity. Sampling that event as a new observed contact
does not preserve the identity required by the stroke router.

`TronPointerCaptureView` now handles `ACTION_CANCEL` before ordinary sampling
and prediction. It snapshots and clears all retained active contacts and
predictors, releases parent interception, then emits one cancellation per
retained contact with its original ID, input type, coordinates and latest
observed timestamp. No prediction is promoted to an observed sample.
Focus loss and detach share this contact cleanup and still clear hover and
held keys. Repeated cancellation has no retained contacts to emit again.
Touch cancellation alone leaves observed hover and key state intact.

The existing OS-driven Home-interruption flow still requires exactly one
cancelled stroke, one committed stroke and zero predictions. Its assertions,
the JS identity/time validation and the media bounds are unchanged. Local
verification after this correction passed all 22 native-controls JS/source
tests, the package TypeScript check and the package build. These checks do
not compile or run the changed Kotlin; a fresh installed APK must pass the
existing Android cancellation flow before this follow-up has native runtime
acceptance.
