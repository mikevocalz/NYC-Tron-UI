---
name: "SmartGuidesModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/canvas/smart-guides-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# SmartGuidesModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/smart-guides-model.ts -->
Smart guide math for {@linkcode SmartGuides} (B-05): while a layer moves, find where its edges or centre line up with other layers' bounds, and where the gap to a neighbour equals a gap already on the canvas, then pull the move onto the nearest of those.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/smart-guides-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { SMART_GUIDE_MAX_OTHERS, SMART_GUIDE_THRESHOLD, computeSmartGuides, smartGuideSummary, validateSmartGuideResult } from "@nyc-tron/ui/forge/canvas/smart-guides-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/smart-guides-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/smart-guides-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `AlignmentGuide` | interface | `interface AlignmentGuide { readonly axis: CanvasAxis; readonly value: number; readonly from: number; readonly to: number; readonly feature: GuideFeature; rea...` |
| `GapMark` | interface | `interface GapMark { readonly from: number; readonly to: number; readonly at: number; }` |
| `GuideFeature` | type | `type GuideFeature = "start" \| "center" \| "end";` |
| `LayerBounds` | type | `type LayerBounds = Extract<LayerBoundsEntry, { x: number; }>;` |
| `LayerBoundsEntry` | type | `type LayerBoundsEntry = { readonly id: string; readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly corners?: readonly (r...` |
| `SMART_GUIDE_MAX_OTHERS` | const | `const SMART_GUIDE_MAX_OTHERS = 200;` |
| `SMART_GUIDE_THRESHOLD` | const | `const SMART_GUIDE_THRESHOLD = 6;` |
| `SmartGuideInput` | interface | `interface SmartGuideInput { readonly moving: DocRect; readonly others: readonly LayerBoundsEntry[]; readonly movingIds?: readonly string[]; readonly zoom: nu...` |
| `SmartGuideResult` | interface | `interface SmartGuideResult { readonly rect: DocRect; readonly dx: number; readonly dy: number; readonly alignments: readonly AlignmentGuide[]; readonly spaci...` |
| `SpacingGuide` | interface | `interface SpacingGuide { readonly axis: CanvasAxis; readonly gap: number; readonly gaps: readonly GapMark[]; }` |
| `computeSmartGuides` | function | `function computeSmartGuides({ moving, others, movingIds, zoom, thresholdPx, enabled }: SmartGuideInput): SmartGuideResult;` |
| `smartGuideSummary` | function | `function smartGuideSummary(result: SmartGuideResult, names?: Readonly<Record<string, string>>): string \| undefined;` |
| `validateSmartGuideResult` | function | `function validateSmartGuideResult(result: SmartGuideResult): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/smart-guides-model.ts -->
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
