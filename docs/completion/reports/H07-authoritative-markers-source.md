# H-07 authoritative list preview markers

`ListPreviewItem.marker` optionally supplies host-authoritative marker text. An explicit empty string means no marker. Omission preserves the existing `listMarkers` behavior and existing callers. The exported frozen `BULLETS_NUMBERING_CAPABILITIES` advertises version 1 with authoritative marker support; consumers must inspect the actual linked module before relying on this addition.

`listPreviewMarkers` uses supplied marker text exactly, with no counter inference for those rows. Missing overrides still use the established default helper. All-overridden previews avoid calculating unused default counters. Markers reject control, format, surrogate and line-separator characters and are bounded to 4096 UTF-16 units. This admits Quill's bounded repeated-letter numbering without allowing multiline or bidi-control marker content.

The component renders these markers in its existing preview. No local state, window dimensions, geometry keys, write semantics or engine dependency was introduced. Host-provided markers allow truthful nondefault starts and mixed/nonlist rows; the host remains responsible for deriving them from authoritative document state.

Validation: office-cluster pure tests 16/16 passed, including new default compatibility, explicit marker/empty-marker, long valid marker and malformed marker cases. UI and slots TypeScript checks passed. Native UI acceptance and publication remain pending; this source capability is not claimed for the released alpha.4 package.
