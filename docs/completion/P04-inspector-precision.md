# Inspector and precision controls checkpoint

A-09 InspectorPanel, A-10 InspectorSection, A-11 PropertyRow, A-14 SliderField, A-15 RangeSlider, A-16 RotaryKnob and A-21 InspectorSearch have reviewed independent public exports. Existing component owners are retained.

InspectorPanel distinguishes empty/single/multiple selection, scrolls property groups and filters registered labels/keywords with announced match counts. A caller-supplied document/selection scope remounts transient property editors on replacement, including when selections share a title. Expansion and property values remain host-owned. Without an explicit scope, selection metadata supplies the fallback identity. Search expansion does not overwrite controlled disclosure state. Nested section enablement propagates through PropertyRow's editor state; reset/revert and toggle callbacks check mounted/current permissions. Mixed and inherited/overridden values retain accessible labels and a separate revert target. Metadata and search budgets are bounded.

Sliders, two-handle ranges and rotary controls capture document/parameter scope, revision, range, input mapping, units and committed value for an interaction. They cancel held gestures on replacement/disable/unmount, reject stale measurements and do not restore a preview into a new owner. Geometry changes cancel an active gesture. Typed-entry scopes follow those boundaries. Repeated controlled keyboard commits retain focus. Native accessibility actions expose disabled state and cannot commit while disabled. Range endpoints preserve ordering/minimum separation; rotary relative/circular mapping, fine adjustment, resets and exact entry retain their existing owner.

The prior log10-based entry precision rounded a 0.25 step to one decimal. Shared step formatting now accounts for the fractional mantissa and decimal exponent, retaining a further decimal place for fine adjustment. Regression coverage includes 0.25, fine 0.025 and 2.5e-7.

Verification passed 806 source tests, workspace builds/types and independent exports. The 17 focused inspector/precision browser tests passed. Disk exhaustion interrupted validation packing and the first full browser run; neither interrupted run counts as a pass. Only task-owned generated build caches and failed-run output were removed. Final rerun results are recorded below.

These checks prove controlled reusable UI behavior; native runtime, physical accessibility/narration, engine integration and eight-platform acceptance remain unverified. Remaining P04 rows stay open.

Final reruns passed all 558 browser tests (1.4 minutes) and all 13 validation packs. The UI pack SHA-256 is 5a51336220e090199dfa0720afa74ec7317bdd7f01cf08597546388d9e7fff3c. Browser tracing was disabled for the rerun to reduce temporary disk use; assertion coverage was unchanged. These are local validation artifacts, not a replacement release.
