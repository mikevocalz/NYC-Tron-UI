# Color specification follow-through

The full canonical requirement text is now retained for every one of the 341 ledger entries. A present source file does not erase an unfinished requirement.

This checkpoint extends the first color controls with the following workflows:

| IDs | Added behavior |
| --- | --- |
| C-07 | CMYK and signed CIELAB entry, explicit profile identity, configurable Lab chroma bounds and controlled preserve-numbers/preserve-appearance policy |
| C-10 | Engine-produced mapped display preview beside untouched original profile/channel values |
| C-15 | Spot/global overprint intent retained in the named definition |
| C-16 | Midpoint hints, linear/radial type, angle, alpha and encoded-sRGB/linear-light interpolation in a single paint/options commit |
| C-17 | Default 48×48 bilinear multicolor preview with inverse cell mapping and premultiplied alpha, replacing the former empty surface; a host can still supply its color-managed renderer |
| C-19 | Actual measured low/high clipping counts, with unknown measurements distinct from zero |
| C-21 | Host-owned RGB/Luma channel selection, application presets and exact identity reset |
| C-22 | Explicit lift/gamma/gain levels and tint controls in addition to tonal-range exposure grading |
| C-24 | Separate measured red/green/blue parade channels on the decoded frame |
| C-25 | Controlled proof gamut-clipping overlay request |

GradientOptions is an explicit part of GradientStopEditor: consumers retain it with the paint and selected stop. Its midpoint uses a piecewise linear color hint whose specified position is half the color transition. Alpha interpolation is premultiplied. Linear-light transfer uses the sRGB functions documented by [W3C CSS Color 4](https://www.w3.org/TR/css-color-4/#color-conversion-code). No ICC conversion or RAW processing is approximated in the controls.

The mesh preview emits 9,216 RGBA bytes at its default size. A Node desktop check of a 16×16 control grid averaged about 1.34 ms over 20 renders. This is a bounded display preview, not native profiling or an engine render-quality claim. The rendered browser check decodes the real PNG and verifies its distinct corner colors and smoothly mixed center.

Validation passed 760 source tests, workspace builds/types, the independent export/ledger checks, all 13 packed artifacts, and 34 color browser tests. These include Lab, policy changes, overprint, mapped/original data, gradient hint/type/angle/interpolation, independent channel presets, lift/gamma/gain, RGB parade, and actual interpolated mesh pixels.

C-27 now has an injectable native Display P3 display path, described in P07-native-p3.md. All new color controls retain their unverified native/device, accessibility narration and desktop/headset acceptance gates. This report does not mark the full color phase accepted.
