---
name: "LevelMeter"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/LevelMeter"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.danger", "color.surfaceSunken", "color.text"]
registryDependencies: []
a11yStatus: "unverified"
---

# LevelMeter

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/LevelMeter.tsx -->
Display-only input meter.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/LevelMeter.tsx -->
- Package: @nyc-tron/ui
- Import: `import { LevelMeter } from "@nyc-tron/ui/components/forge/audio/LevelMeter";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/audio/LevelMeter
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/LevelMeter.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `level` | `number` | not recorded | yes | Current linear input peak in [0, 1] from the app's audio engine. |
| `peakHold` | `number` | not recorded | no | Held peak in [0, 1], drawn as a thin marker. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | no |  |
| `thickness` | `number` | `8` | no | Thickness across the bar, in pt. |
| `announce` | `boolean` | `false` | no | Speak band changes ("Input clipping") through the screen reader, at most once per `announceIntervalMs`. Turn on only while a take is live. |
| `announceIntervalMs` | `number` | `2000` | no |  |
| `bandLabels` | `Readonly<Record<MeterBand, string>>` | `METER_BAND_LABELS` | no | Spoken band text, for localization. |
| `className` | `string` | not recorded | no |  |
| `fillClassName` | `string` | not recorded | no |  |
| `clipClassName` | `string` | not recorded | no | Applied to the fill instead of `fillClassName` while clipping. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/LevelMeter.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "progressbar"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
```tsx example=LevelMeter
import { LevelMeter } from "@nyc-tron/ui/components/forge/audio/LevelMeter";

export function Example() {
  return <LevelMeter level={0} />;
}
```
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
