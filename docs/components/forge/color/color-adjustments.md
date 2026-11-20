---
name: "ColorAdjustmentsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/color/color-adjustments"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ColorAdjustmentsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/color-adjustments.ts -->
Normalized point used by CurvesEditor; x is input and y is output.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/color-adjustments.ts -->
- Package: @nyc-tron/ui
- Import: `import { bounded, evaluateCurve, moveCurvePoint, poolHistogram, poolScope, validateCurve, validateGrade, validateHSLSecondary } from "@nyc-tron/ui/forge/color/color-adjustments";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/color-adjustments
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/color-adjustments.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ColorCurve` | interface | `interface ColorCurve { readonly interpolation: "linear" \| "monotone"; readonly points: readonly CurvePoint[]; }` |
| `ColorGrade` | interface | `interface ColorGrade { readonly model?: "tonal" \| "lift-gamma-gain"; readonly liftGammaGain?: { readonly lift: number; readonly gamma: number; readonly gain:...` |
| `ColorLevels` | interface | `interface ColorLevels { readonly inputBlack: number; readonly inputWhite: number; readonly gamma: number; readonly outputBlack: number; readonly outputWhite:...` |
| `CurvePoint` | interface | `interface CurvePoint { readonly id: string; readonly x: number; readonly y: number; }` |
| `GradingBand` | interface | `interface GradingBand { readonly hue: number; readonly saturation: number; readonly exposureEv: number; }` |
| `HSLSecondary` | interface | `interface HSLSecondary { readonly enabled: boolean; readonly hueStart: number; readonly hueEnd: number; readonly hueFeather: number; readonly saturationMin: ...` |
| `HistogramChannel` | interface | `interface HistogramChannel { readonly id: string; readonly label: string; readonly bins: readonly number[]; readonly clipping?: { readonly low: number; reado...` |
| `ScopeSample` | interface | `interface ScopeSample { readonly x: number; readonly y: number; readonly intensity: number; }` |
| `bounded` | function | `function bounded(value: number, min: number, max: number, label: string): void;` |
| `evaluateCurve` | function | `function evaluateCurve(curve: ColorCurve, input: number): number;` |
| `moveCurvePoint` | function | `function moveCurvePoint(curve: ColorCurve, id: string, x: number, y: number): ColorCurve;` |
| `poolHistogram` | function | `function poolHistogram(bins: readonly number[], columns?: number): number[];` |
| `poolScope` | function | `function poolScope(samples: readonly ScopeSample[], size?: number): number[];` |
| `validateCurve` | function | `function validateCurve(curve: ColorCurve): void;` |
| `validateGrade` | function | `function validateGrade(value: ColorGrade): void;` |
| `validateHSLSecondary` | function | `function validateHSLSecondary(value: HSLSecondary): void;` |
| `validateLevels` | function | `function validateLevels(value: ColorLevels): void;` |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/color-adjustments.ts -->
_Not documented._
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
