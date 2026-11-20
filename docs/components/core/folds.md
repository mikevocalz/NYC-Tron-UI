---
name: "FoldsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/core/folds"
tier: 2
docs: "generated"
platforms: []
category: "primitive"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# FoldsModule

## Purpose

<!-- generated:begin purpose source=packages/core/src/folds.ts -->
Pure hinge/occlusion geometry.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/core/package.json,packages/core/src/folds.ts -->
- Package: @nyc-tron/core
- Peers: none
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/core/folds
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { foldFeaturesFromRegions, foldLayoutFromRegions, foldLayoutsFromRegions, foldLayoutsIntersectingRow, foldPostureFromRegions, resolveTrailingInspectorLayout, resolveUsableRegions, resolveVerticalFoldPanePlan } from "@/lib/nyc-tron/core/folds";`

### Tarball install

Install @nyc-tron/core from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { foldFeaturesFromRegions, foldLayoutFromRegions, foldLayoutsFromRegions, foldLayoutsIntersectingRow, foldPostureFromRegions, resolveTrailingInspectorLayout, resolveUsableRegions, resolveVerticalFoldPanePlan } from "@nyc-tron/core/folds";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/core/src/folds.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FoldFeature` | interface | `interface FoldFeature { readonly bounds: Rect; readonly orientation: "vertical" \| "horizontal"; readonly separating: boolean; readonly occlusion: "none" \| "f...` |
| `FoldLayout` | interface | `interface FoldLayout { orientation: FoldOrientation; state: FoldState; posture: FoldPosture; occlusionType?: FoldOcclusionType \| undefined; separating: boole...` |
| `FoldOcclusionType` | type | `type FoldOcclusionType = "none" \| "full";` |
| `FoldOrientation` | type | `type FoldOrientation = "vertical" \| "horizontal";` |
| `FoldPosture` | type | `type FoldPosture = "flat" \| "book" \| "tabletop";` |
| `FoldState` | type | `type FoldState = "flat" \| "halfOpened";` |
| `Rect` | interface | `interface Rect { readonly x: number; readonly y: number; readonly width: number; readonly height: number; }` |
| `ReservedRegion` | interface | `interface ReservedRegion { kind: "division" \| "occlusion"; x: number; y: number; width: number; height: number; margins: { top: number; left: number; bottom:...` |
| `TrailingInspectorLayout` | interface | `interface TrailingInspectorLayout { width: number; edge: "left" \| "right"; closedX: number; }` |
| `TrailingInspectorLayoutInput` | interface | `interface TrailingInspectorLayoutInput { folds: readonly FoldLayout[]; rowWidth: number \| null; preferredWidth: number; isRTL: boolean; }` |
| `UsableRect` | type | `type UsableRect = Rect;` |
| `UsableRegionsInput` | interface | `interface UsableRegionsInput { readonly container: Rect; readonly features: readonly FoldFeature[]; }` |
| `VerticalFoldPanePlan` | interface | `interface VerticalFoldPanePlan { splitAfter: "primary" \| "supplementary"; primaryWidth: number; supplementaryWidth: number; gapWidth: number; }` |
| `VerticalFoldPanePlanInput` | interface | `interface VerticalFoldPanePlanInput { fold: FoldLayout \| null; rowWidth: number \| null; primaryVisible: boolean; supplementaryVisible: boolean; detailVisible...` |
| `VerticalMultiFoldPanePlan` | interface | `interface VerticalMultiFoldPanePlan { primaryWidth: number; supplementaryWidth: number; gapAfterPrimary: number; gapAfterSupplementary: number; }` |
| `VerticalMultiFoldPanePlanInput` | interface | `interface VerticalMultiFoldPanePlanInput extends Omit<VerticalFoldPanePlanInput, "fold"> { folds: readonly FoldLayout[]; }` |
| `foldFeaturesFromRegions` | function | `function foldFeaturesFromRegions(regions: readonly ReservedRegion[], options?: { includeOcclusions?: boolean; }): FoldFeature[];` |
| `foldLayoutFromRegions` | function | `function foldLayoutFromRegions(regions: readonly ReservedRegion[], windowOriginX?: number): FoldLayout \| null;` |
| `foldLayoutsFromRegions` | function | `function foldLayoutsFromRegions(regions: readonly ReservedRegion[], windowOriginX?: number): FoldLayout[];` |
| `foldLayoutsIntersectingRow` | function | `function foldLayoutsIntersectingRow(folds: readonly FoldLayout[], rowWidth: number \| null): FoldLayout[];` |
| `foldPostureFromRegions` | function | `function foldPostureFromRegions(regions: readonly ReservedRegion[]): FoldPosture;` |
| `resolveTrailingInspectorLayout` | function | `function resolveTrailingInspectorLayout(input: TrailingInspectorLayoutInput): TrailingInspectorLayout;` |
| `resolveUsableRegions` | function | `function resolveUsableRegions(input: UsableRegionsInput): UsableRect[];` |
| `resolveVerticalFoldPanePlan` | function | `function resolveVerticalFoldPanePlan(input: VerticalFoldPanePlanInput): VerticalFoldPanePlan \| null;` |
| `resolveVerticalMultiFoldPanePlan` | function | `function resolveVerticalMultiFoldPanePlan(input: VerticalMultiFoldPanePlanInput): VerticalMultiFoldPanePlan \| null;` |
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

<!-- generated:begin a11y source=packages/core/src/folds.ts -->
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
