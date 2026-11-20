---
name: "ClippingModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/layers/clipping-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "declared"
---

# ClippingModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/layers/clipping-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/layers/clipping-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { CLIP_INDENT, GROUP_INDENT, clipAccessibilityPhrase, clipReason, clipTarget, clipToggleLabel, clippingParent, resolveClipping } from "@nyc-tron/ui/forge/layers/clipping-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/layers/clipping-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/layers/clipping-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `CLIP_INDENT` | const | `const CLIP_INDENT = 18;` |
| `ClipLayer` | interface | `interface ClipLayer { readonly id: string; readonly name: string; readonly clipped: boolean; readonly parent?: string \| null; readonly parentId?: string \| nu...` |
| `ClipRole` | type | `type ClipRole = { readonly kind: "none"; } \| { readonly kind: "base"; readonly clippedIds: readonly string[]; } \| { readonly kind: "clipped"; readonly baseId...` |
| `GROUP_INDENT` | const | `const GROUP_INDENT = 21;` |
| `SetClippedOp` | interface | `interface SetClippedOp { readonly id: string; readonly clipped: boolean; }` |
| `clipAccessibilityPhrase` | function | `function clipAccessibilityPhrase(role: ClipRole \| undefined): string \| undefined;` |
| `clipReason` | function | `function clipReason(layers: readonly ClipLayer[], id: string): string \| undefined;` |
| `clipTarget` | function | `function clipTarget(layers: readonly ClipLayer[], id: string): ClipLayer \| undefined;` |
| `clipToggleLabel` | function | `function clipToggleLabel(layers: readonly ClipLayer[], id: string): string;` |
| `clippingParent` | function | `function clippingParent(layer: ClipLayer): string \| null;` |
| `resolveClipping` | function | `function resolveClipping(layers: readonly ClipLayer[]): Map<string, ClipRole>;` |
| `validateClippingLayers` | function | `function validateClippingLayers(layers: readonly ClipLayer[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/layers/clipping-model.ts -->
- `role`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
