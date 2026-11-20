---
name: "SliderModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/slider-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# SliderModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/slider-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/slider-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/slider-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { angleAround, applySliderKey, fractionOf, knobAngle, moveRangeThumb, nearestThumb, normalizeRange, sliderKeyAction } from "@/components/nyc-tron/ui/components/shell/slider-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { angleAround, applySliderKey, fractionOf, knobAngle, moveRangeThumb, nearestThumb, normalizeRange, sliderKeyAction } from "@nyc-tron/ui/components/shell/slider-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/slider-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `RangeConfig` | type | `type RangeConfig = Readonly<{ min: number; max: number; step: number; detents?: readonly number[]; }>;` |
| `RangeThumb` | type | `type RangeThumb = "low" \| "high";` |
| `RangeValue` | type | `type RangeValue = readonly [ low: number, high: number ];` |
| `SliderKeyAction` | type | `type SliderKeyAction = { readonly kind: "step"; readonly steps: number; } \| { readonly kind: "min"; } \| { readonly kind: "max"; };` |
| `angleAround` | function | `function angleAround(point: { x: number; y: number; }, center: { x: number; y: number; }): number;` |
| `applySliderKey` | function | `function applySliderKey(value: number, action: SliderKeyAction, range: RangeConfig): number;` |
| `fractionOf` | function | `function fractionOf(value: number, range: RangeConfig): number;` |
| `knobAngle` | function | `function knobAngle(value: number, range: RangeConfig): number;` |
| `moveRangeThumb` | function | `function moveRangeThumb(values: RangeValue, thumb: RangeThumb, next: number, range: RangeConfig, minGap?: number): RangeValue;` |
| `nearestThumb` | function | `function nearestThumb([low, high]: RangeValue, value: number): RangeThumb;` |
| `normalizeRange` | function | `function normalizeRange([a, b]: RangeValue, range: RangeConfig, minGap?: number): RangeValue;` |
| `sliderKeyAction` | function | `function sliderKeyAction(key: string, { rtl, shift, alt }?: { rtl?: boolean; shift?: boolean; alt?: boolean; }): SliderKeyAction \| null;` |
| `valueAtOffset` | function | `function valueAtOffset(offset: number, length: number, range: RangeConfig, rtl?: boolean): number;` |
| `valueFromAngle` | function | `function valueFromAngle(angle: number, previous: number, range: RangeConfig): number;` |
| `valueFromDrag` | function | `function valueFromDrag(start: number, dx: number, dy: number, range: RangeConfig, { pixelsPerRange, fine }?: { pixelsPerRange?: number; fine?: boolean; }): n...` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/slider-model.ts -->
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
