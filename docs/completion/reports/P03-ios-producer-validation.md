# Focused iOS presentation-index validation

The actual production AVAssetReader index and shared AVAssetImageGenerator implementation compiled with Swift 6 against iPhoneSimulator 27.1 and ran on the booted Forge Completion iPhone Duo simulator, UDID BBCC4078-E64D-4642-893B-ACF80ACB29A1. The task-owned UIKit host is ai.nyctron.p03producer. No existing product app, window contract, package manifest, lockfile or Metro was changed.

## Evidence

The simulator's p03-producer-result accessibility element reports P03 PRODUCER PASS, with all of these assertions completed:

- Exact rational half-microsecond lookup preserves the actual CMTime and excludes a missing target.
- CFR, VFR and H.264 B-frame fixtures each produce all 12 expected presentation timestamps. Expectations come from independent ffprobe output; the VFR fixture has nonuniform spacing and ffprobe confirms actual B frames.
- Every one of the 36 indexed frames passes the production shared image-generator path with zero tolerances at its exact rational timestamp. The returned actual presentation time compares equal to the exact source CMTime with CMTimeCompare and also rounds to the expected integer-microsecond index. Returned image dimensions are nonzero.
- A request shifted by 0.1us within the same integer-microsecond bucket rejects when its returned rational time differs, rather than passing only because rounded integers match.
- Each complete-index cap rejects instead of returning a truncated result. Invalid/fractional/infinite/oversized caps reject. Malformed local media and remote URLs reject.

Build output, complete expected arrays, ffprobe frame types and fixture SHA-256 values are preserved in docs/completion/evidence/P03-ios-producer-build.txt and P03-ios-fixtures.json. The actual passing accessibility screen is P03-ios-producer-pass.png. Reproduce the host build with python3 tooling/native/presentation-index-ios/build.py; install/launch through Argent. The app's own deterministic checks run once on launch. This was a focused native runtime check, not a saved two-pass Argent QA suite.

## Defects established and fixed

Compressed AVAssetReader raw PTS retained a B-frame edit offset: raw times extended to 0.433333s for a 0.4s asset. Output presentation timestamps mapped the track edit correctly to 0...0.366667s, agreeing with ffprobe. Production enumeration now uses CMSampleBufferGetOutputPresentationTimeStamp; the installed CoreMedia header documents decoded/trimmed/stretched presentation and edit mapping.

Integer-microsecond zero-tolerance image requests also returned the preceding frame for a 1/30s frame represented by 33333us. Tolerance and track-timescale shift experiments were not retained. The index now keeps exact output CMTime values on its native worker. The additive decodeIndexedFrameV1 path resolves an exact timestamp from the bounded index, sends that rational value to the real shared generator, and rejects either a rational actual-time mismatch or an integer-microsecond mapping mismatch. Ordinary decodeFrame keeps its existing request semantics. Invalid actual timestamps now reject instead of substituting the request time.

The JS facade advertises indexedFrameVersion:1/decodeIndexedFrame only when the linked bridge has the versioned method. It rejects fractional, unsafe or mismatched native timestamps without rounding them into success. Six focused facade tests passed, including abort detachment and original error-code preservation. Forge's frame session detects this strict capability; old binaries retain the existing actual-time comparison and rejection.

## Scope and remaining gates

A genuine full host build was attempted first and exited 74 at Xcode package resolution: examples/native-cadence/ios/build/generated/ios, generated/autolinking and xcframeworks are absent. Installed platform-services is the released alpha.4 package. Metro aliases alone cannot activate native source. No application source compiled in that attempt.

The smaller host compiles production MediaSource, error mapping, PresentationIndexData, AVAssetReader enumeration, DecodedImageData and the shared image-generator source directly. It does not compile the Expo Record/module macros, React Native graph, JPEG cache writer or full player. Those bridge, autolinking and player lifecycle gates remain open. Android's new strict method is source-only and has not been compiled or run in this batch. Retiming/reverse edits, broad format coverage, large-index performance and memory/lifecycle profiling remain open.

Strict decoding currently enumerates the complete bounded index per request, O(n), at most 200000 frames and the existing cooperative deadline. There is no stale-file cache or nominal-FPS shortcut. Cancellation detaches the JS consumer; in-flight native work may drain. This is correctness-first source, not a performance completion claim. Compiler warnings are the existing synchronous AVFoundation duration/tracks/image-copy API deprecations; no unchecked Sendable or compatibility shim was introduced.
