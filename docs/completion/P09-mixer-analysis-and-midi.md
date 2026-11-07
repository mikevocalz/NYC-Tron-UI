# Mixer, analysis and MIDI editors

Reviewed the remaining 13 P09 rows: E-05, E-13, E-17 through E-27. All 41 audio/MIDI library rows now have implementation reviews. Runtime acceptance remains unverified.

Existing owners now guard document/revision changes and asynchronous mutations, disable pending edits and display errors. MixingConsole composes optional shared InsertEffectRack and BusAndRoutingMatrix controls alongside existing gain, pan, groups and measured peak meters. Routing includes supplied input and sidechain choices, rechecks destination admission and supports Master when no buses exist. Solo/mute retains group and solo-safe semantics.

SpectrogramView adds controlled zoom/panning over the actual bounded time-frequency matrix and retains the labelled token intensity scale. LoudnessMeter adds explicit host RMS and integration-reset capability. EQ adds a host Q editor alongside frequency/gain/pass-band handles; dynamics adds host knee/makeup editors and separately reported gain reduction. Responses and measurements remain host supplied. PluginPresetBrowser adds save and host-owned A/B capture/recall with a unique undo-group token per preset application. Insert slots retain ordering/bypass/settings selection.

The piano roll, velocity bars/curves/channel edits and step sequencer retain their existing gesture adapters. Note rosters and beat-line allocation are bounded; changing indexed note data invalidates old responders. Scroll offsets remain above the remounted gesture body, and the velocity tool uses a persistent per-instance Zustand store. Tempo/metronome gates async mutations and stale tap sequences; native click production remains host owned.

Nested audio input scopes now use short per-instance boundary identities so long document IDs or device/take rosters cannot overflow child input scope validation. No app window or native manifest configuration changed.

Validation: combined UI TypeScript build passed. Full source/browser/device tests, keyboard/focus continuity, native services, DSP and audio hardware acceptance remain deferred until user review. Legacy responder migrations are not claimed as RNGH/native-runtime passes.
