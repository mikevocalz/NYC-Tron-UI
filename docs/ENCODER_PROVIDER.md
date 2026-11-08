# Media encoder provider

`@nyc-tron/platform-services/encoder` is the host-side media encoder decided
in the encoder-provider decision record
(`forge-complete/docs/completion/reports/P-encoder-provider-decision.md`,
2026-11-11): a sibling of the media decoder, owned by platform-services, not
inside any engine. Engines stay synchronous, I/O-free state machines and hand
raw pixels/PCM to the host; this provider turns bounded raw sources into a
finished file.

## Contract (v1)

- `createPlatformMediaEncoder()` returns a `MediaEncoder` with `isAvailable`,
  `probe()`, `encode(request, {signal})` and `clearCache()`.
- v1 container/codec: **H.264 video + AAC audio in a faststart MP4**
  (`video/mp4`), matching the admitted decoder matrix. Other codecs and
  containers are out of scope.
- Sources are uncompressed files the host wrote itself:
  - video: tightly packed **RGBA8** frames (`frameCount × width × height × 4`
    bytes), rational `frameRateNum/frameRateDen`;
  - audio: little-endian interleaved PCM, `f32` or `s16`, mono or stereo.
- At least one track is required; video-only, audio-only and A/V are all
  accepted. All sizes are bounded (`MAX_*` constants in `encoder.ts`) and
  validated before any native or browser codec sees them.
- Errors are `MediaEncodeError` with codes `not-found`, `unsupported-format`,
  `encode-failed`, `out-of-range`, `permission`, `cancelled`. Native modules
  throw with the same `[code]` prefix convention as the decoder.
- `AbortSignal` detaches the consumer only; codec work already submitted
  drains on its native owner. The signal never crosses the bridge.

## Platforms

| Platform | Backend | Status |
| --- | --- | --- |
| iOS | AVAssetWriter H.264 + AAC; RGBA→BGRA CVPixelBuffer feed, LPCM→AAC CMSampleBuffers | implemented, **unverified** — no Xcode/simulator run |
| Android | MediaCodec `video/avc` + `audio/mp4a-latm` + MediaMuxer; RGBA→NV12/I420 conversion, f32→s16 PCM | implemented, **unverified** — no Gradle/device run |
| Web | WebCodecs `VideoEncoder`/`AudioEncoder` through unmodified Mediabunny 1.65.2 (MPL-2.0, see `THIRD_PARTY.md`), faststart MP4 in memory returned as a `data:` URL | implemented, **unverified** — no browser run |
| macOS / Windows / visionOS / XR | none — `findNativeModule` returns null and calls reject `unsupported-format`; the podspec pins `ios: '16.4'` only, so visionOS targets cannot link the module at all despite the Expo config's `apple` umbrella | **not implemented** |

## Honest limits

- The Swift and Kotlin encoders are source-reviewed but have never been
  compiled or executed on a device, simulator or emulator. The web path has
  not run in a browser. `platformEvidence` stays `unverified` everywhere;
  `acceptance` is not claimed.
- Android H.264 requires even width/height and accepts `file://`/`content://`
  URIs; iOS accepts `file://` only for sources; the web path fetches whole
  files under the same 64 MiB cap as the decoder, so web encodes are limited
  to small clips.
- `probe()` reports codec/container availability, not per-device success at a
  given size or frame rate. Hardware-acceleration status is not reported.
- Android accepts only `COLOR_FormatYUV420SemiPlanar` (NV12) or
  `COLOR_FormatYUV420Planar` (I420) H.264 inputs; a device whose encoders
  expose only `COLOR_FormatYUV420Flexible` rejects with `unsupported-format`,
  because the flexible plane layout cannot be expressed through the
  ByteBuffer input API.
- The web path's 120 s deadline covers the whole encode, including stalls
  inside Mediabunny `add()`/`start()`/`finalize()` awaits; an overrun reports
  `encode-failed`, a caller abort reports `cancelled`.
- No encoder was benchmarked; RGBA→YUV conversion cost, bitrate behavior,
  cancellation drain time and memory use are unmeasured.
- Windows (Media Foundation) and desktop Linux/XR targets named in the
  decision doc have no implementation here.
