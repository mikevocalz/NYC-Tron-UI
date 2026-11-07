# P08 transport and frame navigation

Reviewed rows: D-04 and D-06 through D-13. The existing owners provide played/buffered seek ranges, preview/commit seeking, frame transport, capability-gated reverse/pitch/rates, SMPTE/drop-frame/sample-clock entry, JKL shuttle/frame stepping, ruler marks, playhead, in/out marks and looping.

Each owner now accepts document scope/revision and guards requests against replaced sources or changed permissions/geometry. Pending operations and rejected host callbacks are handled by the shared scoped request owner. Pure scrub/range previews remain synchronous so a final preview cannot consume the release transaction. Timecode format changes abandon the old parse draft; disabled entries cannot submit.

NativeSeekBar keeps its actual SwiftUI/Compose sliders on the existing verified SDK 58 contract and its universal web slider. Its shared model now invalidates old callbacks/previews and replaces the slider host at source boundaries. The web change listener captures the matching model generation so an old element cannot commit into a new source. Buffered custom seeking remains the existing independent SeekBar owner. No native package/configuration or window contract changed.

Validation: the combined @nyc-tron/ui TypeScript build passed. Full interaction/native/device testing remains deferred until the user's implementation review. Accurate decoded playback, physical keyboard/screen-reader behavior and all platform acceptance require later evidence. Implementation review is 134/341; P08 remains in progress.
