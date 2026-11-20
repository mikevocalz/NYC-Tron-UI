---
name: "RealtimePeakMeter"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/RealtimePeakMeter"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/forge/audio/LevelMeter"]
a11yStatus: "declared"
---

# RealtimePeakMeter

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/RealtimePeakMeter.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/RealtimePeakMeter.tsx -->
- Package: @nyc-tron/ui
- Import: `import { RealtimePeakMeter } from "@nyc-tron/ui/forge/audio/RealtimePeakMeter";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/forge/audio/LevelMeter

```sh
npx shadcn@latest add @nyc-tron/forge/audio/RealtimePeakMeter
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/RealtimePeakMeter.tsx -->
Extends: `Omit<ViewProps, 'children'>, PeakHoldOptions`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | no |  |
| `revision` | `string \| number` | not recorded | no |  |
| `measurement` | `RealtimePeakMeasurement \| null` | not recorded | yes |  |
| `clockMs` | `number` | not recorded | yes | Same monotonic clock as measurement.timeMs; host drives visual falloff ticks. |
| `length` | `number` | not recorded | no |  |
| `mode` | `'sample' \| 'true'` | not recorded | no |  |
| `orientation` | `'horizontal' \| 'vertical'` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/RealtimePeakMeter.tsx -->
- `accessibilityLabel`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
