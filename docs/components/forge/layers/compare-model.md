---
name: "CompareModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/layers/compare-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# CompareModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/layers/compare-model.ts -->
Engine-neutral before/after comparison for `CanvasCompareView` (B-27).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/layers/compare-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/layers/compare-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { COMPARE_MODES, REFERENCE_SCALE, SIDE_BY_SIDE_MIN_WIDTH, SPLIT_STEP, SPLIT_STEP_LARGE, compareFrame, compareReason, normalizeFraction } from "@/components/nyc-tron/ui/components/forge/layers/compare-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { COMPARE_MODES, REFERENCE_SCALE, SIDE_BY_SIDE_MIN_WIDTH, SPLIT_STEP, SPLIT_STEP_LARGE, compareFrame, compareReason, normalizeFraction } from "@nyc-tron/ui/components/forge/layers/compare-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/layers/compare-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `COMPARE_MODES` | const | `const COMPARE_MODES: readonly [ { readonly value: "side-by-side"; readonly label: "Side by side"; }, { readonly value: "split"; readonly label: "Split"; }, {...` |
| `CompareImage` | interface | `interface CompareImage { readonly uri: string; readonly width: number; readonly height: number; }` |
| `CompareMode` | type | `type CompareMode = "side-by-side" \| "split" \| "overlay" \| "reference";` |
| `CompareSource` | type | `type CompareSource = { readonly kind: "pixels"; readonly raster: RasterPixels; } \| { readonly kind: "uri"; readonly uri: string; readonly width: number; read...` |
| `REFERENCE_SCALE` | const | `const REFERENCE_SCALE = 0.32;` |
| `SIDE_BY_SIDE_MIN_WIDTH` | const | `const SIDE_BY_SIDE_MIN_WIDTH = 560;` |
| `SPLIT_STEP` | const | `const SPLIT_STEP = 0.01;` |
| `SPLIT_STEP_LARGE` | const | `const SPLIT_STEP_LARGE = 0.1;` |
| `compareFrame` | function | `function compareFrame(primary: { width: number; height: number; }, boxWidth: number, boxHeight: number): { x: number; y: number; width: number; height: numbe...` |
| `compareReason` | function | `function compareReason(before: unknown, after: unknown, beforeLabel: string, afterLabel: string): string \| undefined;` |
| `normalizeFraction` | function | `function normalizeFraction(value: number): number;` |
| `resolveCompareSource` | function | `function resolveCompareSource(source: CompareSource): CompareImage;` |
| `sideBySideDirection` | function | `function sideBySideDirection(boxWidth: number, boxHeight: number): "row" \| "column";` |
| `splitFromDrag` | function | `function splitFromDrag(start: number, dx: number, frameWidth: number): number;` |
| `splitFromKey` | function | `function splitFromKey(value: number, key: string \| undefined, shift?: boolean): number \| null;` |
| `splitValueText` | function | `function splitValueText(split: number, beforeLabel: string, afterLabel: string): string;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/layers/compare-model.ts -->
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
