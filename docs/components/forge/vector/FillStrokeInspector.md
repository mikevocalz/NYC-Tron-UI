---
name: "FillStrokeInspector"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/vector/FillStrokeInspector"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.danger", "color.focus", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# FillStrokeInspector

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/vector/FillStrokeInspector.tsx -->
Fill and stroke inspector for one vector layer (B-23): fill type and color, fill rule, stroke on or off, width, join, cap, miter limit, dash pattern (presets that scale with the width, or a typed custom pattern), dash offset and paint order.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/vector/FillStrokeInspector.tsx -->
- Package: @nyc-tron/ui
- Import: `import { FillStrokeInspector } from "@nyc-tron/ui/components/forge/vector/FillStrokeInspector";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/forge/vector/FillStrokeInspector
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/vector/FillStrokeInspector.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `kind` | `PaintableKind` | not recorded | yes | The layer's content kind; shapes take a solid fill only and booleans a fill only. |
| `fill` | `Paint \| null` | not recorded | yes |  |
| `stroke` | `Stroke \| null` | not recorded | yes |  |
| `fillRule` | `FillRule` | not recorded | yes |  |
| `paintOrder` | `PaintOrder` | not recorded | yes |  |
| `bounds` | `ContentBounds` | not recorded | yes | Layer content bounds; new gradients span them. |
| `swatches` | `readonly PaintSwatch[]` | not recorded | yes | Colors offered for the fill and the stroke. |
| `selectedStop` | `number` | `0` | no | The gradient stop a fill swatch recolors (shared with the on-canvas handles). |
| `onSetFill` | `(fill: Paint \| null, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Maps to `setFill {id, fill}`. |
| `onSetStroke` | `(stroke: Stroke \| null, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Maps to `setStroke {id, stroke}`. One call per release, key press or submitted field. |
| `onPreviewStroke` | `(stroke: Stroke \| undefined) => void` | not recorded | no | Stroke to draw while a value is being scrubbed; `undefined` when the scrub ends. |
| `onSetFillRule` | `(rule: FillRule, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Maps to `setFillRule {id, rule}`. |
| `onSetPaintOrder` | `(order: PaintOrder, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Maps to `setPaintOrder {id, order}`. |
| `onRequestColor` | `(target: "fill" \| "stroke") => void` | not recorded | no | Opens the host's color picker for a color outside the swatches. The button shows only when this is passed. |
| `className` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/vector/FillStrokeInspector.tsx -->
- `accessibilityLabel`: "Custom dash pattern"
- `accessibilityLiveRegion`: "polite"
- `aria-checked`: set from an expression
- `aria-label`: "Cap", "Custom ", "Dash pattern", "Fill rule", "Fill type", "Join", "Paint order"
- `role`: "button", "radio", "radiogroup", "switch"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
