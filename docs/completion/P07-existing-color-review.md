# P07 existing color contract review

Reviewed the remaining canonical color requirements against their source, models and browser journeys:

| ID | Contract and existing implementation |
| --- | --- |
| C-01 | ColorPickerDialog compares original/draft, previews through a frame throttle, restores on cancel and commits once on Apply; workspace5 browser checks cover cancel and apply |
| C-03 | ColorWheel retains saturation/value/alpha, wraps hue, and switches to one-fifth rotation in the ring hole; drag geometry and browser precision path are tested |
| C-05 | AlphaSlider renders a checkerboard, preview/one-release commit and percent entry; invalid values remain editable with an error |
| C-06 | ColorChannelFields provides RGB, HSL, HSV, HEX and alpha; existing ColorChannels remains the slider adapter, avoiding a duplicate model |
| C-12 | ForegroundBackgroundChips keeps host-owned colors/active slot, swap and explicit default reset |
| C-13 | SwatchGrid accepts recent/document/saved/named groups, name/hex filtering and keyboard focus navigation |
| C-18 | ColorHarmonyAssistant provides complementary/analogous/triadic/split/square rules and composited WCAG contrast; alpha now matches the visible sample |
| C-26 | FloatingColorPalette preserves the host color through compact/classic/palette content and docking; position is bounded around host-supplied fold obstacles |

The review fixed opaque harmony samples being compared using translucent contrast, rejected invalid hue step sizes, prevented a disabled opacity draft from committing on blur, and disabled Clear search with the swatch control. Source and model review do not prove native narration or physical input coverage.

Validation: 26 relevant model tests, 13 color browser checks, 8 workspace/dialog browser checks and UI TypeScript passed. Earlier whole-workspace verification passed 760 tests plus builds, types and artifact validation. All 27 color IDs now have reviewed reusable implementations, with remaining platform acceptance explicitly unverified. Processing transforms remain app/engine-owned callbacks; they are not fabricated by the controls.
