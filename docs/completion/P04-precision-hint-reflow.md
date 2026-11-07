# Precision scrubber hint reflow

The fixed-width Prism inspector exposed overlapping keyboard-help and numeric-range text. The shared PrecisionScrubber footer now wraps its two bounded text items with an 8px column gap and 4px row gap. Inspector width, numeric type size, value handling and gestures are unchanged.

Validation: `pnpm --filter @nyc-tron/ui build` passed. Forge's linked-source browser preview demonstrates the footer in the 280px inspector across compact, standard and comfortable density. This is source-preview evidence; Forge's published alpha.4 dependency is unchanged. Native acceptance and the full component test pass remain pending user review. Library implementation scope remains 329/329; this change does not close separate engine/platform integration gates.
