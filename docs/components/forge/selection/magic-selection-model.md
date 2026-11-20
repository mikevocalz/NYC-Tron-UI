---
name: "MagicSelectionModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/selection/magic-selection-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MagicSelectionModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/selection/magic-selection-model.ts -->
Settings and request builders for {@linkcode MagicSelectionControls} and {@linkcode MagicWandCanvas}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/selection/magic-selection-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/selection/magic-selection-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { MAX_SELECTION_RADIUS, MAX_TOLERANCE, WAND_SAMPLES, buildMagicWand, buildModifySelection, describeWand, formatTolerance, modifyProblem } from "@/components/nyc-tron/ui/components/forge/selection/magic-selection-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { MAX_SELECTION_RADIUS, MAX_TOLERANCE, WAND_SAMPLES, buildMagicWand, buildModifySelection, describeWand, formatTolerance, modifyProblem } from "@nyc-tron/ui/components/forge/selection/magic-selection-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/selection/magic-selection-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MAX_SELECTION_RADIUS` | const | `const MAX_SELECTION_RADIUS = 250;` |
| `MAX_TOLERANCE` | const | `const MAX_TOLERANCE = 255;` |
| `MagicWandRequest` | interface | `interface MagicWandRequest { readonly x: number; readonly y: number; readonly tolerance: number; readonly contiguous: boolean; readonly sample: WandSampleReq...` |
| `MagicWandSettings` | interface | `interface MagicWandSettings { readonly tolerance: number; readonly contiguous: boolean; readonly sample: WandSample; }` |
| `ModifySelectionRequest` | interface | `interface ModifySelectionRequest { readonly op: "grow" \| "shrink" \| "feather"; readonly radius: number; }` |
| `RefineEdgeRequest` | interface | `interface RefineEdgeRequest { readonly smooth: number; readonly feather: number; }` |
| `WAND_SAMPLES` | const | `const WAND_SAMPLES: readonly [ { readonly value: "composite"; readonly label: "All layers"; }, { readonly value: "layer"; readonly label: "Current layer"; } ];` |
| `WandSample` | type | `type WandSample = "composite" \| "layer";` |
| `WandSampleRequest` | type | `type WandSampleRequest = "composite" \| { readonly layer: string \| number; };` |
| `buildMagicWand` | function | `function buildMagicWand(x: number, y: number, s: MagicWandSettings, mode: SelectionMode, currentLayerId: string \| number \| undefined): MagicWandRequest;` |
| `buildModifySelection` | function | `function buildModifySelection(op: ModifySelectionRequest["op"], radius: number, hasSelection: boolean): ModifySelectionRequest;` |
| `describeWand` | function | `function describeWand(s: MagicWandSettings): string;` |
| `formatTolerance` | function | `function formatTolerance(tolerance: number): string;` |
| `modifyProblem` | function | `function modifyProblem(hasSelection: boolean, radius: number): string \| undefined;` |
| `validateWandSettings` | function | `function validateWandSettings(s: MagicWandSettings): void;` |
| `wandProblem` | function | `function wandProblem(s: MagicWandSettings, currentLayerId: string \| number \| undefined): string \| undefined;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/selection/magic-selection-model.ts -->
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
