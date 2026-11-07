# P06 brush, ink and pen library controls

All eight library-scoped P06 rows have controlled implementations and independent exports. NativePointerRouter, LogitechMuseSpatialInk and PalmRejectionAndPrediction remain engine/native input rows; this UI checkpoint does not mark their engine work done.

B-15 BrushPresetBrowser provides bounded search, favorites, selected preset state, virtualized lists and actual host-rendered stroke thumbnails. B-16 BrushDynamicsInspector edits size, hardness, flow, spacing, stabilizer and scatter through bounded, precise controls. B-18 EraserModePicker distinguishes pixel, vector, mask and object modes and disables unsupported capabilities with explicit reasons. The host must supply the corresponding processing engines.

B-17 InkStrokePreview provides a bounded local test pad using RNGH 3 single-contact gestures composed with canvas navigation and a real Skia Graphite surface. Pressure and tilt are drawn/read only from reported stylus measurements; unknown force is not labelled measured. Native-adapter sample arrays can also supply twist. The telemetry distinguishes RN receipt timestamps from measured end-to-end presentation latency, which is displayed only when the host supplies it. Per-frame preview delivery is throttled; drawing resources are disposed. Bounded samples and native handles follow Zustand/ref ownership.

B-29 BrushTaperControl separates pen and touch start/end/minimum-size, tip shape and pressure policy, with a required host-rendered live test stroke slot. B-33 BrushStabilizationPreview applies deterministic positional smoothing for the test pad while preserving pressure, tilt, twist, input kind and timestamps. It does not claim production prediction/palm rejection or replace the native brush engine.

B-32 TimelapsePlaybackExporter controls non-destructive history recording and real host playback, export dimensions/frame rate/format and encoder progress. It requires a host encoder that returns a nonempty media-file artifact; no file or progress is fabricated. Cancellation is signalled to that encoder and stale artifacts are ignored. Empty/unsupported/running history cannot export; malformed progress and failed operations are shown. Production encoding and actual file playback remain consumer acceptance work.

N-02 PenPairingDialog reuses DevicePairingDialog, with pen-specific defaults. The existing state machine distinguishes transport linkage from verified input and preserves stop-search versus close semantics. No second Bluetooth controller was created.

Validation: combined @nyc-tron/ui TypeScript build passed. Full source/browser/native tests and hardware claims remain deferred until the user's review. P06 has 8/8 library-scoped implementations; total review is 125/341. All required platform acceptance remains unverified. No native manifest, app window, orientation or deployment target was changed.
