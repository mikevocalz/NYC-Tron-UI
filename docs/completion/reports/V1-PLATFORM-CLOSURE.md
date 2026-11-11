# V1 platform closure and evidence boundaries

Updated 2026-11-10. The approved completion target retains every one of the original
341 component IDs, its requirements and all eight required platforms. The prior
blanket deferral of twelve native/service rows is superseded. The work is tracked
across the owners that actually implement each capability.

## Candidate and immutable source

- NYC-Tron candidate: [PR 57](https://github.com/mikevocalz/NYC-Tron-UI/pull/57), stacked on the Exact/native-feel reference in PR 56.
- Forge candidate: [PR 70](https://github.com/mikevocalz/nitro-forge/pull/70), based on the existing Board renderer in PR 69. The native/MMKV implementation checkpoint is `cc4893b29f6182c71705a64785a41f5bbf3f5507` (following the first checkpoint `23f08c3b050c766222e5a8f33386fcca7bb8b6ac`).
- Actual Muse provider: [Viro PR 86](https://github.com/mikevocalz/viro/pull/86), checkpoint `e84a1a9a37168a835f7730e09016917b9d49c6ef`.

The machine-readable source paths, independent imports and external revisions are
in [library-progress.json](../library-progress.json). There are 332 reviewed local
implementations and nine pinned external implementations: all 341 original IDs
now have reviewed source ownership. N-10 includes the actual MMKV 4.3.2 binding
port to the pinned Nitro 120 ABI, plus Board and all-eleven-engine storage adapters.
Its native build and process-relaunch gates passed on both iOS and Android at
that checkpoint; the exact receipts are linked below. This source
inventory does not claim that 341 components have passed every required platform gate.

The immutable roster is copied without changes from Forge's
`docs/completion/baseline-roster.tsv`; its SHA-256 is
`a1fd6593a84f899dc2946e6337fde7c59897607701516b6d64732d51d44b75db`.
The validator checks the exact IDs and platform scope, rejects fabricated external
ownership, and continues to require platform evidence before an accepted status.

## The twelve rows

| ID | Implementation and public entry point | Behavior established by source and focused tests | Acceptance that needs its own record |
|---|---|---|---|
| N-01 NativePointerRouter | NYC-Tron `native-controls/NativePointerInput` and `native-controls/pointer-input`; actual UIKit/Compose/DOM capture | Touch, mouse, keyboard, stylus, hover, observed pressure; pointer ownership, cancellation, key cleanup and focus loss | Physical input/device matrix, hardware keyboard and assistive technology |
| N-03 LogitechMuseSpatialInk | Forge `@nitro-forge/spatial-ink`; Viro's existing ARKit + GCStylus provider | Actual tracked translation/quaternion and tip pressure; distinguishes untracked, position-only and six-DoF; tracking loss terminates input once | Logitech Muse on a supported visionOS host; headset loss and measured input latency |
| N-04 PalmRejectionAndPrediction | NYC-Tron pure pointer router plus UIKit coalesced/predicted touches and Android API 34 MotionPredictor | Pen admission suppresses palm input; coalesced observations are committed; predictions remain temporary and separate; zero pressure remains zero | Hardware pressure/tilt, palm behavior and SDK prediction availability |
| N-09 XRPresentationAdapter | Forge `@nitro-forge/board/xr` and optional `@nitro-forge/board/xr/viro` | One authoritative document; one render in flight; latest-revision coalescing; image leases survive until actual Viro load or detach | Viro rendering on visionOS/Quest/PICO, interaction mapping, GPU/device performance |
| N-10 OfflineCheckpointAndAutosave | Forge `@nitro-forge/ignition/autosave`, `autosave/mmkv` and `@nitro-forge/board/offline/mmkv` | Actual MMKV 4.3.2 Nitro 120 port; all-eleven-engine storage/recovery; final queued autosave; scoped single-record checkpoint, bounds/checksum/corruption handling and retry | Installed iOS/Android binding and process termination/relaunch passed at `cc4893b`; sudden-power-loss durability and the remaining platform matrix need separate proof |
| N-11 CollaborationAdapter | Forge `@nitro-forge/ignition/collaboration`, `collaboration-http`, Board `offline/yjs` and `offline/sync` | Owned request bytes, revision/ACK boundaries, all engine envelopes; real Yjs merge/reopen/reconnect using the host's existing document | Authenticated product transport, multi-device failure/reconnect and device persistence |
| N-13 LongTaskScheduler | Generated ForgeTask and native serial queue through `@nitro-forge/ignition/nitro` | Native worker execution, FIFO ownership, cancellation and close lifetime; actual Rust/C++ workload checks | The app-launch gate exercises generated objects in Hermes; per-device latency and suspend/resume remain separate |
| N-14 MediaCache | Generated ForgeMediaCache + bounded native ByteCache | Byte and metadata budgets, LRU/eviction, allocation-failure safety, failed-read behavior and owned bytes | App launch uses the actual native cache; product-derived preview/waveform generation and device pressure budgets |
| N-15 UndoTransactionCoordinator | Forge `@nitro-forge/ignition/transactions` and real engine batch operations | One committed undo transaction per accepted gesture; reentrant teardown; engine-side batch behavior across all eleven engines | Full product interaction/undo/reopen acceptance on each claimed host |
| N-16 NativeBinaryTransport | Generated ForgeDocument + C++ ArrayBuffer ownership | Owned request/result/checkpoint bytes; snapshots survive close; no giant base64 bridge; no zero-copy claim | Generated-object runtime reports and large-payload device memory/latency measurements |
| N-18 TestAndTelemetryAdapter | Forge `@nitro-forge/telemetry` and `/testing` | Consent-period ownership, bounded queues, redacted error codes, revoke drops unsent records, one active sink | Product consent UX, actual configured sink and device traces; no invented telemetry backend |
| N-19 NativeMediaDecoderSurface | NYC-Tron `platform-services/media` + `native-controls/NativeVideoPlayer`; AVFoundation and AndroidMediaDecoder | Real time-based probe/frame/audio decode, cache and error contract; seekable playback surface; browser decode uses an actual media fixture | Native launch report verifies decoded JPEG/PCM and time coordinates; physical audio/output and lifecycle remain device gates |

Native services and engines remain in Forge; NYC-Tron does not import
`@nitro-forge/*`. The UI exposes reusable controlled inputs and presentation.
The app owns the document, permissions, navigation, theme, storage scope,
authentication and immersion. The XR adapter never creates another editable
document or undo history.

## Native input and six-DoF details

The pointer adapters report observed platform fields. Unknown pressure, tilt or
orientation remains unavailable; it is not filled with invented motion. UIKit
coalesced samples and Android historical MotionEvents preserve observed timing.
UIKit predicted touches and Android's supported MotionPredictor samples go to a
separate temporary-preview callback and never enter committed document strokes.

Android prediction is capability-checked on API 34 and later. The display refresh
interval determines the requested prediction horizon. A platform without prediction
still provides observed input. Browser coalesced/predicted events are consumed only
where supplied by the browser. The browser test that constructs a pen event proves
routing/lifetime behavior; it is explicitly not a physical pen test.

The Viro pose helper serializes the provider's actual right-handed rigid transform,
checks finite/orthonormal data and reports a normalized quaternion. Invalid or missing
tracking has no fallback identity pose. Tip pressure remains distinct from the older
aggregate button/squeeze pressure. This is Logitech Muse through the existing
platform provider, not an Interaxon EEG integration or a new Bluetooth stack.

## Persistence and collaboration

MMKV stores checkpoint metadata and encoded document bytes in one bounded value
scoped to the account/organization and document. Its synchronous single-key write
is not an assertion of fsync under sudden power loss. The host's actual MMKV instance
and encryption/storage configuration remain app-owned.

The pinned Forge candidate includes the actual MMKV v4 package patch, generated
Nitro classes, SwiftPM/JNI registration and existing upstream core versions. Its
Linux gate checks installed C++ against the actual runtime and reopens real
MMKVCore storage in a second process. The mobile gate shares one MMKV instance
with Board and all eleven engines, writes through `DocumentAutosave`, then requires
OS termination and recovery from a new process before accepting the final fifteen
checks. Both native jobs passed at `cc4893b` in
[Forge run 42759521341](https://github.com/mikevocalz/nitro-forge/actions/runs/42759521341),
tested merge `aa11c3b3b3b9170a48c4ecfef8ae2a1ad3ed0533`. The retained
[iOS](https://github.com/mikevocalz/nitro-forge/blob/codex/v1-platform-completion/docs/completion/evidence/v1-native-cc4893b/ios/provenance.json)
and [Android](https://github.com/mikevocalz/nitro-forge/blob/codex/v1-platform-completion/docs/completion/evidence/v1-native-cc4893b/android/provenance.json)
receipts record distinct process identities and all eleven recovered engine kinds.
These scoped runtime passes do not promote the full eight-platform ledger.

The Yjs adapter operates on the existing Y.Doc. It merges updates rather than
pretending a CRDT merge can destructively roll back a document. A failed persistence
write leaves the edit visibly unsaved. Uploaded revision acknowledgements cannot
mark newer local edits as uploaded. Transport buffers are copied before asynchronous
queueing. Closing drains accepted edits, and invalid/partially throwing merges are
quarantined rather than saved as a successful recovery.

The all-engine autosave and transaction services remain independent of Board's Yjs
path. The Board source was reused from the existing reviewed Board work and repaired
for the candidate; a second parallel document system was not introduced.

## Runtime gates and reproducible evidence

[Release-gate evidence](V1-RELEASE-GATES.md) records clean actual-tarball consumers,
API signatures, tested pins and archive checks. The native-control workflow builds
those installed archives, then launches the application and requires a fresh
candidate/fixture-bound decoder report. Forge's native-cadence workflow likewise
launches the generated native Factory and checks task, cache and binary ownership.
Logs, reports and screenshots are retained even when a gate fails.

Evidence observed for the earlier `fe397c02` checkpoint:

- [Tron source/exports/types](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42760177947) and [clean installed browser consumers](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42760178220) passed for head `fe397c02bab746ef4ecbcae0cf9d42176a2e53df`.
- [Reference browser acceptance](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42760178255) passed all 29 browser checks and three model tests. The actual tested merge was `fa1ba2dfbfa08e610ed33f5731542aa8c734af0b`. Its four editor captures are byte-identical to the retained `10f3df2` captures below; older artifacts remain labeled with their original revision.
- [Broad browser acceptance](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42760177931) passed all 686 checks at that head.
- [WinUI native acceptance](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42760178261) passed source/codegen, the actual native C++ consumer build, package registration and keyboard UI Automation. This does not establish Narrator speech or physical-device input.
- [Installed iOS decoder runtime](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42760178196) compiled, launched and passed all eleven strict checks at head `fe397c02`, including 32,000 full-length and 4,000 tail resampled PCM frames. [Retained native evidence](../evidence/v1-native-ios-fe397c0/provenance.json) identifies the actual merge, fixture and original artifact. The UI step failed separately; the whole job is not represented as green.
- Android compiled and launched in that native run, but its media probe failed because the extractor exposed the encoded audio duration. The next candidate reads bounded authored per-track MP4 metadata instead of globally trimming audio or loosening the expected output counts. Its Java parser passes eight focused JVM groups; actual codec execution remains required.
- [Forge native acceptance](https://github.com/mikevocalz/nitro-forge/actions/runs/42759521341) passed on both iOS and Android at `cc4893b`, including MMKV/Yjs process recovery, all eleven engine checkpoints, binary/cache ownership, FIFO close and task cancellation. All fourteen other Forge source/adapter/ledger workflows also passed at that checkpoint.
- [Muse native Swift pose test](https://github.com/mikevocalz/viro/actions/runs/42753171666) and [Viro convergence](https://github.com/mikevocalz/viro/actions/runs/42753171447) passed at `e84a1a9a37168a835f7730e09016917b9d49c6ef`.

The actual iOS UI failure exposed two reference-host defects: double subtraction
of the measured safe-area origin, and a virtualized Library nested in a plain
vertical ScrollView. The follow-up uses container-local regions directly and one
native FlatList with heading/detail slots. A new geometry gate checks the observed
OS rectangles. These fixes require a fresh native run; no failed flow has been
reclassified as a pass.

Complete native artifact identity now fingerprints every iOS app payload file,
including its debug dylib, and the Android APK. Historical launcher-only hashes
remain labeled; the retained strict-iOS artifact additionally has a complete
manifest computed after verified download and extraction.

Local Forge evidence and exact commands are retained in its
`docs/recovery/V1_INFRASTRUCTURE_ACCEPTANCE.md`. Native compile success is not
reported as runtime proof. A report from an earlier revision remains attached to
that revision; the final candidate must rerun its required gates.

## Final Forge service runtime checkpoint

[Forge run 42765520077](https://github.com/mikevocalz/nitro-forge/actions/runs/42765520077)
passed all three jobs at head `f5469d03cf2153a8f694ae61d911861264e9216d`, tested
merge `7cc6c15805b20ae69804be9cbf526ae48a4f1a63`. Both
[iOS](../evidence/v1-forge-f5469d0/ios/provenance.json) and
[Android](../evidence/v1-forge-f5469d0/android/provenance.json) record three initial
write checks, OS termination, a different process identity, and fifteen final
checks covering all eleven engine kinds. Full native payload manifests and their
hashes are retained with the original receipts. Native binaries were hashed by
CI; local verification independently checked the downloaded manifest and receipt
integrity. The iOS report artifact has no screenshot because its multi-display
simulator rejected the optional capture command; no visual acceptance is inferred.
All fourteen other Forge source/adapter/ledger workflows passed at this head.

## The `7aec1ec1` native follow-up

At source head `7aec1ec1`, all six source/browser/consumer/WinUI workflows passed:
1,169 Windows unit/contract/render tests, 686 browser cases, 29 reference cases
plus three model tests, clean consumers, and the actual WinUI app/UIA. The
reference images are byte-identical to the retained editor captures.

The [Android evidence](../evidence/v1-native-7aec1ec/android/provenance.json)
records successful actual Settings and Editor flows, including header/tab
geometry inside the measured safe host. Its later pointer status was clipped,
and its full-start audio interval exposed a double trim after `seekTo(0)` skipped
AAC priming data. The next candidate retains the original first packet and
keeps all strict PCM counts and initial-gap rejection.

The [iOS evidence](../evidence/v1-native-7aec1ec/ios/provenance.json) records an
app still bundling when the media receipt timed out, followed by a real SwiftUI
Slider raw-label error in the reference UI. The follow-up prepares the actual
Metro bundle before launching, renders Slider labels through SwiftUI Text,
and keeps pointer feedback visible. These failures remain failed records;
fresh native execution is required for the corrections.

At that checkpoint, AppKit/native host bridges were still implementation gaps.
The subsequent desktop follow-up implements those owners in isolated runtime
packages. [Support](../../SUPPORT.md) records their current evidence and limits;
source coverage does not substitute for the complete eight-platform proof.

## The `e2b65dd5` decoder and browser checkpoint

All six nonmobile workflows passed at `e2b65dd5`; the
[retained record](../evidence/v1-automated-e2b65dd5/nonmobile/ci.json) names their
exact runs, jobs and artifacts. Both native decoders also passed all eleven
strict checks, with the same 32,000 full-interval and 4,000 tail frame counts.
The original [iOS](../evidence/v1-native-e2b65dd5/ios/provenance.json) and
[Android](../evidence/v1-native-e2b65dd5/android/provenance.json) records include
verified archives and independently rehashed complete native payloads.

The native UI jobs remained failed. Android's first Maestro launch lost the
emulator transport before any app assertion. The iOS simulator cancelled the
first Settings touch; the original log ties the cancellation to that contact,
app and command time. These results establish the decoder corrections and
preserve the UI failures. The next candidate adds the narrowly bounded
[transport recovery](../../../tooling/native/UI_ACCEPTANCE.md) and still needs
fresh successful Settings, Editor and pointer receipts.

The pure window lifecycle model now has a peer-free core subpath, with its
existing panes entry retained as a compatibility re-export. Its thirty-nine
tests and prior signatures are preserved. Separate AppKit/Spark and supported
Windows Fabric host work uses this same model; implementation and native
runtime evidence must precede any new desktop support claim.

## The Exact-inspired reference and v1 release conditions

[Exact native-feel guidance](../../EXACT_NATIVE_FEEL.md) remains the design contract:
platform-native behavior, stable app-owned state, independent imports, adaptive
layout and an observable interface that agents can reason about. The shared
reference now covers Settings, library/detail, editor/inspector and media, including
loading, empty, retry and error behavior. A phone uses bottom navigation; the wider
native/fold shell keeps its rail on the physical right, including RTL. Resizing or
changing routes does not recreate the editor's draft input.

The [performance artifact](../evidence/v1-automated-e2b65dd5/reference/reference-render-timings.json)
records React Profiler render-work samples and p50/p95, fixture hash, actual tested
merge SHA, browser/Node versions and runner hardware. On Chromium 151.0.7922.34,
Node 24.19.0 and the four-logical-CPU Xeon Platinum 8573C Linux runner, ten navigation
repetitions produced these development-render measurements:

| Route | Committed update samples | p50 | p95 |
|---|---:|---:|---:|
| Library |58|0.1ms|24.6ms|
| Editor |100|0.7ms|18.5ms|
| Settings |88|0.4ms|24.9ms|

The raw samples and exact runtime identity are retained with the four editor captures.
This establishes a reproducible initial measurement; it is not a production latency
budget or a promise about physical-device frame rates. These development-render timings are not
end-to-end input latency, native frame time or an Exact performance comparison.
Hardware performance and screen-reader speech need their own reproducible records.

No stable tag, release publication, physical-device acceptance or owner licensing
attestation is inferred from a source count. [V1 decisions](../../V1_DECISIONS.md)
retain the precise release requirements. Completing the implementation and automated
gates makes those remaining approvals and device runs concrete and reviewable.
