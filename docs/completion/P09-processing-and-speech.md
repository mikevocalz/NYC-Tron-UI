# Processing, speech and sound library controls

Reviewed E-34 through E-41 as original library implementations. No external candidate source was copied, and no new third-party license was admitted.

Voice isolation, noise cleanup and auto ducking share AudioProcessingPanel: admitted host capability, actual job progress/error, cancellation, original/processed audition and explicit apply/revert requests. Each exposes its own bounded settings. Ducking displays the editable host-generated gain envelope through the shared automation editor. Native separation, cleanup and dialogue analysis are host services, not fabricated local algorithms.

Beat detection shares TimelineMarkers for actual marker editing and receives host BPM/progress. SoundEffectsLibrary searches/categories/virtualizes host metadata; insertion rechecks license admission and supplied availability at action time. Required attribution remains visible and must be recorded by the host insertion transaction.

Speech review shares the transcript and word-timing owners, including speaker/text correction, take selection and boundary edits. Voiceover follows host countdown and capture telemetry, displays the live recording meter, provides stop/save, take audition, retry and explicit per-take discard confirmation. It creates no second timer or audio capture session.

Corrected the prior clip-workflow export paths to use the package's existing components/forge/audio convention and compiled native entrypoints.

Validation: combined UI TypeScript build passed. Broad source/browser/native-service/device acceptance is deferred until the user's review. These UI implementations do not certify native audio models, capture timing, licenses of external media or DSP output quality.
