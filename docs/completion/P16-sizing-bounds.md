# Host-owned sizing bounds

2026-11-07. HugFillFixedSizeControls now accepts optional positive finite min/max/step per axis. Defaults remain 0.001, 1000000 and 1. A host can supply a larger supported range, including the Design backend's 1e7 extent limit, without silent numeric clamping. The exported version-1 capability marker advertises configurable bounds.

The control still delegates to the existing PropertyInspector. Its pure model validates field identity, allowed modes, capabilities, disabled state and numeric writes, returning a new controlled value without mutating host state. Fixed mode changes preserve the actual supplied dimension. Empty disabled reasons are treated as disabled, matching PropertyInspector; stale/direct commits cannot bypass that flag. No extra React state or engine dependency was introduced.

Three focused Node tests pass, including the larger host range, default fields, malformed bounds, invalid writes, capability/disabled enforcement and authoritative axis/metadata retention. UI source and public-slot TypeScript checks pass. Independent source review found the empty-reason consistency issue; it was corrected before commit.

This is source and data-behavior evidence. Native interaction, focus, screen readers and the full platform matrix remain after component review. The existing window/layout and release pins are preserved. The source count remains 329/329; no phase/platform acceptance is promoted.
