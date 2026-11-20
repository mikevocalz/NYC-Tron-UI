---
name: "DynamicsTransferGraph"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/DynamicsTransferGraph"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.primary", "color.success", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# DynamicsTransferGraph

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/DynamicsTransferGraph.tsx -->
Controlled compressor transfer graph: input level across, output level up, both -60..0 dBFS, with the 1:1 diagonal for reference, the engine's curve, a threshold marker and readouts.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/DynamicsTransferGraph.tsx -->
- Package: @nyc-tron/ui
- Import: `import { DynamicsTransferGraph } from "@nyc-tron/ui/components/forge/audio/DynamicsTransferGraph";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/forge/audio/DynamicsTransferGraph
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/DynamicsTransferGraph.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `params` | `DynamicsParams` | not recorded | yes | Committed compressor parameters from the engine. Attack and release are not drawn on a static curve. |
| `curve` | `readonly DynamicsCurvePoint[]` | not recorded | yes | The engine's static curve (`dynamicsCurve`), input -60..0 dB in 1 dB steps. Drawn as given. Pass a new array whenever the engine recomputes it: the graph dims the curve from the start of a threshold drag until a different array arrives. Empty draws the grid with "Curve unavailable". |
| `onThresholdCommit` | `(thresholdDb: number) => void \| Promise<unknown>` | not recorded | yes | Once per finished threshold drag or key press, whole dB in -60..0. A rejected promise keeps the committed value. |
| `onThresholdChange` | `(thresholdDb: number) => void` | not recorded | no | Live threshold while dragging, and the committed value again on cancel. Never persisted. |
| `onRatioCommit` | `(ratio: number) => void \| Promise<unknown>` | not recorded | yes | Once per stepper press, with the next ratio stop (1, 1.5, 2, 3, 4, 6, 8, 10, 20). |
| `inputLevelDb` | `number` | not recorded | no | Current input level from a meter, dBFS. Drawn as a dot on the curve; display only. |
| `gainReductionDb` | `number` | not recorded | no |  |
| `onKneeCommit` | `(db: number) => void \| Promise<unknown>` | not recorded | no |  |
| `onMakeupCommit` | `(db: number) => void \| Promise<unknown>` | not recorded | no |  |
| `maxSize` | `number` | `280` | no | Largest plot side, points. The plot shrinks to fit narrower containers. |
| `disabled` | `boolean` | `false` | no |  |
| `label` | `string` | `"Compressor"` | no | Name of the insert, e.g. `"Vocal compressor"`. |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
| State | How it is set |
|---|---|
| `disabled` | `disabled` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/DynamicsTransferGraph.tsx -->
- `accessibilityLabel`: "Lower ratio", "Raise ratio", "Ratio", "Ratio ", "Threshold"
- `accessibilityRole`: "adjustable", "button", "image"
- `accessibilityState`: set from an expression
- `role`: "group", "img"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
