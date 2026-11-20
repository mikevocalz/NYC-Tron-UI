---
name: "MaskModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/layers/mask-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MaskModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/layers/mask-model.ts -->
Engine-neutral layer-mask contract for `MaskThumbnailAndEditor` (B-12).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/layers/mask-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { FEATHER_RANGE, GROW_RANGE, MASK_FILLS, NO_REFINE, maskBlockedReason, maskFillReason, maskStateLabel, maskStatusText } from "@nyc-tron/ui/components/forge/layers/mask-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/layers/mask-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/layers/mask-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `AddMaskOp` | interface | `interface AddMaskOp { readonly id: string; readonly fill: MaskFill; }` |
| `FEATHER_RANGE` | const | `const FEATHER_RANGE: { readonly min: 0; readonly max: 250; readonly step: 1; };` |
| `GROW_RANGE` | const | `const GROW_RANGE: { readonly min: -250; readonly max: 250; readonly step: 1; };` |
| `InvertMaskOp` | interface | `interface InvertMaskOp { readonly id: string; }` |
| `MASK_FILLS` | const | `const MASK_FILLS: readonly [ { readonly fill: "reveal"; readonly label: "Reveal all"; }, { readonly fill: "hide"; readonly label: "Hide all"; }, { readonly f...` |
| `MaskFill` | type | `type MaskFill = "reveal" \| "hide" \| "selection";` |
| `MaskInfo` | interface | `interface MaskInfo { readonly enabled: boolean; readonly inverted: boolean; readonly revision: number; }` |
| `NO_REFINE` | const | `const NO_REFINE: RefineDraft;` |
| `RefineDraft` | interface | `interface RefineDraft { readonly feather: number; readonly grow: number; }` |
| `RefineMaskOp` | interface | `interface RefineMaskOp { readonly id: string; readonly feather: number; readonly grow: number; }` |
| `RemoveMaskOp` | interface | `interface RemoveMaskOp { readonly id: string; readonly apply: boolean; }` |
| `SetMaskEnabledOp` | interface | `interface SetMaskEnabledOp { readonly id: string; readonly enabled: boolean; }` |
| `maskBlockedReason` | function | `function maskBlockedReason(locked: boolean): string \| undefined;` |
| `maskFillReason` | function | `function maskFillReason(fill: MaskFill, { locked, hasSelection }: { locked: boolean; hasSelection: boolean; }): string \| undefined;` |
| `maskStateLabel` | function | `function maskStateLabel(mask: MaskInfo \| null): string;` |
| `maskStatusText` | function | `function maskStatusText(mask: MaskInfo): string;` |
| `maskThumbnailId` | function | `function maskThumbnailId(layerId: string): string;` |
| `normalizeRefine` | function | `function normalizeRefine(draft: RefineDraft): RefineDraft;` |
| `refineOp` | function | `function refineOp(id: string, draft: RefineDraft): RefineMaskOp;` |
| `refineReason` | function | `function refineReason(draft: RefineDraft, locked: boolean): string \| undefined;` |
| `validateMaskInfo` | function | `function validateMaskInfo(mask: MaskInfo \| null): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/layers/mask-model.ts -->
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
