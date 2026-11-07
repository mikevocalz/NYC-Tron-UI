# Clip and recording workflows

Reviewed E-02, E-09, E-10 and E-28 through E-32 as independently exported library controls.

WaveformLane now keeps local scroll state in Zustand and guards callbacks at document/revision boundaries. Clip trim/fades expose non-destructive sample boundaries, bounded fade lengths, explicit region gain and crossfade shape; crossfades require a reported neighbouring overlap. ClipGainEnvelope reuses the existing automation editor with sample-local integer positions.

Take playlists render supplied measured peaks and comp regions. Native RNGH horizontal swipes request a single range edit; vertical travel yields to scrolling. Geometry changes reject an in-flight swipe. Numeric selection controls and buttons provide alternative input. The host owns comp insertion, crossfade processing, audition and undo transactions.

Loop/punch controls use sample boundaries and pre/post-roll, locked while recording. SampleEditor shares region and loop controls and adds MIDI keyboard range/root/tuning requests. AudioVideoSync compares actual picture presentation telemetry with the host audio master sample clock. Latency calibration exposes supported device buffers, recording offset and actual loopback confidence/drift, with cancellation and no fabricated measurements.

Validation: combined UI TypeScript build passed. Full source/browser/device testing is deferred until user review. Native capture, DSP, picture clock scheduling, comp audio continuity and hardware calibration remain consuming-service acceptance, not claimed runtime passes.
