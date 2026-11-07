# P03 presentation index: source implementation

The platform-services source now offers an optional, versioned presentation-index capability. This is not a released alpha.4 capability and is not native runtime acceptance evidence.

## Availability and backward compatibility

`MediaDecoder.presentationIndexVersion === 1` and an actual `presentationIndex` function advertise support. `createMediaDecoder` exposes them only when the linked Expo module has a callable `presentationIndexV1`. An old alpha.4 binary continues to support the existing decoder interface and exposes neither optional field. Consumers must detect the optional capability. The version belongs to this source contract; no dependency or package version was changed. A new native binary and package release are required before production consumers can depend on it. The web facade has no new capability.

The result contains a complete first-video-track `timesUs` array and media `durationUs`, both in integer microseconds. The array is sorted strictly and frozen by the JS facade. It is never generated from nominal frame rate. Invalid, duplicate, negative, unsafe or duration-exceeding timestamps reject. Exceeding a budget rejects the entire request instead of returning a partial index.

## Native implementation

- iOS uses `AVAssetReaderTrackOutput(outputSettings: nil)` to enumerate original compressed samples. AVFoundation returns these in decode order; the implementation sorts their actual presentation timestamps. Marker-only buffers are skipped. Aggregated samples, nondisplay samples and samples over 32 MiB reject explicitly. Only local files are accepted.
- Android uses `MediaExtractor` on a local file or granted content URI, selects the same first video track as the existing decoder and enumerates `sampleTime`/`advance` without decoding images. Encrypted or partial-frame samples and samples over 32 MiB reject explicitly. The extractor is released on every exit.
- Both use the module's existing serial worker. The frame cap defaults to 200,000 and cannot exceed it. iOS additionally caps visited buffers, and checks a 30-second cooperative deadline. Android uses the existing coroutine cancellation/deadline checks per sample. A blocking platform read cannot be forcibly interrupted by these checks.
- AbortSignal detaches the JS consumer and discards late completion. It does not cancel an already-running native enumeration. No native handle enters serialized React state.

## Verification and remaining acceptance

The installed Apple SDK headers were inspected for AVAssetReader's nil settings, decode order, sample-count semantics and CoreMedia timestamps/attachments. Android SDK 36's MediaExtractor signature was inspected with javap for sampleTime/sampleSize/sampleFlags/advance. `pnpm typecheck`, `pnpm build` and `git diff --check` pass for platform-services. These are TypeScript/source checks, not Swift/Kotlin compiler or runtime validation. No device, emulator or unit test suite was run, honoring the review gate.

Required before P03 completion: independent source review; native compiler checks after review; CFR/VFR and B-frame fixtures proving actual timestamp enumeration, duplicate/malformed/oversized rejection, cancellation/owner release and large-index bounds on iOS and Android; release availability; Forge consumer integration and full frame-step/player lifetime acceptance. The existing experimental v1 player evidence alone does not complete those exit criteria. Manifests, window configuration, default dependencies and locks were not changed.

Independent review follow-up: the public `toMediaPresentationIndex` parser validates its own integer 1–200,000 budget, including direct calls. Android now explicitly rejects API levels below 28 before reaching `MediaExtractor.getSampleSize` and rejects negative sample sizes paired with a valid PTS. The established Android minimum SDK was preserved. Native code remains uncompiled and unexecuted.

## Focused iOS follow-up

Subsequent authorized native validation compiled and ran the actual index/shared image-generator source on an iOS27.1 simulator. See P03-ios-producer-validation.md for actual CFR/VFR/B-frame evidence, the output-PTS edit-list fix, additive strict rational decode capability and precise remaining Expo bridge/Android/player gates. The earlier uncompiled statement records the initial source checkpoint, not the current producer-only evidence.
