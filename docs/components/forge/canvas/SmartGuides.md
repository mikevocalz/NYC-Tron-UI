---
name: "SmartGuides"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/canvas/SmartGuides"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.surfaceRaised", "font.10", "leading.14", "radius.control", "space.1"]
registryDependencies: []
a11yStatus: "declared"
---

# SmartGuides

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/SmartGuides.tsx -->
Live smart-guide layer (B-05): alignment lines through the edges and centres the moving layer shares with others, and equal-spacing bars with their gap, in the accent color.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/SmartGuides.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SmartGuides } from "@nyc-tron/ui/forge/canvas/SmartGuides";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/SmartGuides
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/SmartGuides.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `viewport` | `CanvasViewport` | not recorded | yes |  |
| `result` | `SmartGuideResult \| undefined` | not recorded | yes | The current drag's guides from `computeSmartGuides`, or `undefined` when nothing is moving. The host commits `result.rect` on release, so what is drawn is what lands. |
| `names` | `Readonly<Record<string, string>>` | not recorded | no | Layer names by id, for the spoken summary. |
| `formatGap` | `(gap: number) => string` | `whole or decimal document pixels, e.g. "24"` | no | Formats a gap label. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/SmartGuides.tsx -->
- `accessibilityLiveRegion`: "polite"
- `aria-live`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
