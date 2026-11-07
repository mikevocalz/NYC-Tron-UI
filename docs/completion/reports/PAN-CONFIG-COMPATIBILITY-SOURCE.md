# Native pan configuration compatibility

The installed RNGH3.4.0 usePanGesture validator rejects minDistance combined with either active axis offsets or failure offsets. ParagraphRuler and TakePlaylistAndComping still supplied both. Each now retains its authored axis activation/failure offsets and drops the redundant minDistance; pointer limits, callbacks and runtime version are unchanged.

Two focused regressions pass. The configuration check reads the installed dependency's actual validatePanConfig/validateOffsetsArray functions and applies them to literal usePanGesture object sites in UI components. Its negative controls prove the pinned implementation rejects the conflicting configurations. This checks threshold compatibility; it does not execute native recognizers, validate dynamic/spread configuration objects or establish interaction/focus acceptance. UI and public-slot typechecks pass. No dependency, native build, window or orientation change.
