---
name: "WaveformLane"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/WaveformLane"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.surfaceSunken"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# WaveformLane

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/WaveformLane.tsx -->
Per-component import: no audio API, Forge engines, Skia or Nitro.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/WaveformLane.tsx -->
- Package: @nyc-tron/ui
- Import: `import { WaveformLane } from "@nyc-tron/ui/forge/WaveformLane";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/WaveformLane
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/WaveformLane.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `peaks` | `readonly WaveformPeak[]` | not recorded | yes | Measured real source signal extrema; not synthetic waves. |
| `columns` | `number` | not recorded | no |  |
| `height` | `number` | not recorded | no |  |
| `onSeekNormalized` | `(position: number) => void` | not recorded | no |  |
| `position` | `number` | not recorded | no | Current playhead in [0, 1]; screen-reader steps move from here. |
| `accessibilityStep` | `number` | not recorded | no | Normalized distance per accessibility increment/decrement. |
| `visibleRange` | `WaveformRange` | `FULL_RANGE` | no | Part of the clip to draw, normalized. Only the peaks inside it are resampled, so a zoomed-in view of a long clip costs the same as a short one. |
| `onVisibleRangeChange` | `(range: WaveformRange) => void` | not recorded | no | Live preview of the range while the lane is dragged sideways. |
| `onVisibleRangeCommit` | `(range: WaveformRange) => void` | not recorded | no | Once per finished sideways drag. Without it the lane does not scroll and every release seeks. |
| `className` | `string` | not recorded | no |  |
| `barClassName` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/WaveformLane.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: set from an expression
- `accessibilityState`: set from an expression
- `accessibilityValue`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
