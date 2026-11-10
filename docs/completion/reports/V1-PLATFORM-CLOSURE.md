# V1 platform closure and evidence boundaries

Updated 2026-11-10. The approved completion target retains every one of the original
341 component IDs, its requirements and all eight required platforms. The prior
blanket deferral of twelve native/service rows is superseded. The work is tracked
across the owners that actually implement each capability.

## Candidate and immutable source

- NYC-Tron candidate: [PR 57](https://github.com/mikevocalz/NYC-Tron-UI/pull/57), stacked on the Exact/native-feel reference in PR 56.
- Forge candidate: [PR 70](https://github.com/mikevocalz/nitro-forge/pull/70), based on the existing Board renderer in PR 69. The first implementation checkpoint is `23f08c3b050c766222e5a8f33386fcca7bb8b6ac`.
- Actual Muse provider: [Viro PR 86](https://github.com/mikevocalz/viro/pull/86), checkpoint `e84a1a9a37168a835f7730e09016917b9d49c6ef`.

The machine-readable source paths, independent imports and external revisions are
in [library-progress.json](../library-progress.json). There are 332 reviewed local
implementations and eight pinned external implementations. N-10 has an owned
MMKV adapter, but remains pending until its native MMKV v4 binding is compatible
with the host's pinned Nitro ABI. This is a source inventory, not a claim that
341 components have passed every required platform gate.

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
| N-10 OfflineCheckpointAndAutosave | Forge `@nitro-forge/ignition/autosave` and `@nitro-forge/board/offline/mmkv` | Final queued autosave; scoped single-record MMKV checkpoint; bounds/checksum/corruption handling; dirty state and retry | MMKV v4 native binding compatibility is actively being completed; process termination/relaunch and power-loss durability are separate proofs |
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

Evidence already observed at the first checkpoints:

- [Tron source/exports/types](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42752976035) passed for head `7b5b3deca420dcc9c7986ff93996f1f3a0a9b1df`.
- [Clean installed browser consumers](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42752975794) passed for that head. The reports record the actual tested merge commit separately.
- [Reference browser run](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42752976059) produced all ten new captures and the render measurements; 28/29 checks passed. Its one failure was a missing fixture-only family setter, repaired in the next candidate. This failed run is not recorded as a passed suite.
- [Broad browser run](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42752975842) recorded 685/686 passes with the same fixture failure.
- [Muse native Swift pose test](https://github.com/mikevocalz/viro/actions/runs/42753171666) passed against the actual pose helper at Viro checkpoint `e84a1a9a37168a835f7730e09016917b9d49c6ef`.

Local Forge evidence and exact commands are retained in its
`docs/recovery/V1_INFRASTRUCTURE_ACCEPTANCE.md`. Native compile success is not
reported as runtime proof. A report from an earlier revision remains attached to
that revision; the final candidate must rerun its required gates.

## The Exact-inspired reference and v1 release conditions

[Exact native-feel guidance](../../EXACT_NATIVE_FEEL.md) remains the design contract:
platform-native behavior, stable app-owned state, independent imports, adaptive
layout and an observable interface that agents can reason about. The shared
reference now covers Settings, library/detail, editor/inspector and media, including
loading, empty, retry and error behavior. A phone uses bottom navigation; the wider
native/fold shell keeps its rail on the physical right, including RTL. Resizing or
changing routes does not recreate the editor's draft input.

The performance artifact records React Profiler render-work samples and p50/p95,
fixture and runtime in the browser test. These development-render timings are not
end-to-end input latency, native frame time or an Exact performance comparison.
Hardware performance and screen-reader speech need their own reproducible records.

No stable tag, release publication, physical-device acceptance or owner licensing
attestation is inferred from a source count. [V1 decisions](../../V1_DECISIONS.md)
retain the precise release requirements. Completing the implementation and automated
gates makes those remaining approvals and device runs concrete and reviewable.
