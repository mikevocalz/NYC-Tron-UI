# Design layout, styles and variables

Reviewed L-01 through L-07.

FrameAndComponentTree shares the native-focus virtual OutlineTree and validates instance-to-component references. AutoLayoutInspector exposes direction, independent padding, gap, wrapping and alignment. Axis sizing preserves separate hug/fill/fixed capabilities; ConstraintsPanel validates min/max sizes and reference targets. Component variants separate variant properties from instance overrides and reset requests.

ReusableStylesPanel shares the source-backed virtual preset gallery for colors, text, effects and assets. VariablesAndModes edits typed literals, modes and aliases, detects alias cycles/type mismatches, and exposes actual binding reveal requests. Document layout/evaluation remains with the host; changing these controls never changes app window dimensions or orientation.

Validation: combined UI TypeScript build passed. Runtime layout, native focus, alias resolution, persistence and accessibility acceptance remain deferred until user review.
