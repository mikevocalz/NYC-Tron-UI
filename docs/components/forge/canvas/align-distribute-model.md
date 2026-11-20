---
name: "AlignDistributeModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/canvas/align-distribute-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# AlignDistributeModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/align-distribute-model.ts -->
Align, distribute and arrange rules for {@linkcode AlignDistributePanel} (B-25).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/align-distribute-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { ALIGN_EDGES, ARRANGE_ACTIONS, DISTRIBUTE_MAX_SPACING, alignAvailability, alignReference, arrangeAvailability, arrangeTarget, distributeAvailability } from "@nyc-tron/ui/components/forge/canvas/align-distribute-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/align-distribute-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/align-distribute-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ALIGN_EDGES` | const | `const ALIGN_EDGES: readonly [ { readonly edge: "left"; readonly label: "Align left edges"; }, { readonly edge: "hcenter"; readonly label: "Align horizontal c...` |
| `ARRANGE_ACTIONS` | const | `const ARRANGE_ACTIONS: readonly [ { readonly action: "front"; readonly label: "Bring to front"; }, { readonly action: "forward"; readonly label: "Bring forwa...` |
| `AlignCommand` | interface | `interface AlignCommand { readonly ids: readonly string[]; readonly align: AlignEdge; readonly to: AlignReference; }` |
| `AlignEdge` | type | `type AlignEdge = "left" \| "hcenter" \| "right" \| "top" \| "vcenter" \| "bottom";` |
| `AlignItem` | interface | `interface AlignItem { readonly id: string; readonly name: string; readonly locked?: boolean; }` |
| `AlignReference` | type | `type AlignReference = "selection" \| "canvas" \| { readonly artboard: string; };` |
| `AlignReferenceKind` | type | `type AlignReferenceKind = "selection" \| "canvas" \| "artboard";` |
| `ArrangeAction` | type | `type ArrangeAction = "front" \| "forward" \| "backward" \| "back";` |
| `Availability` | type | `type Availability = { readonly enabled: true; } \| { readonly enabled: false; readonly reason: string; };` |
| `DISTRIBUTE_MAX_SPACING` | const | `const DISTRIBUTE_MAX_SPACING = 10000;` |
| `DistributeAxis` | type | `type DistributeAxis = "horizontal" \| "vertical";` |
| `DistributeCommand` | interface | `interface DistributeCommand { readonly ids: readonly string[]; readonly axis: DistributeAxis; readonly mode: DistributeMode; readonly spacing?: number; }` |
| `DistributeMode` | type | `type DistributeMode = "centers" \| "spacing";` |
| `MoveLayerCommand` | interface | `interface MoveLayerCommand { readonly id: string; readonly to_index: number; }` |
| `StackPosition` | interface | `interface StackPosition { readonly index: number; readonly count: number; }` |
| `alignAvailability` | function | `function alignAvailability(items: readonly AlignItem[], reference: AlignReferenceKind, hasArtboard?: boolean): Availability;` |
| `alignReference` | function | `function alignReference(kind: AlignReferenceKind, artboardId?: string): AlignReference;` |
| `arrangeAvailability` | function | `function arrangeAvailability(items: readonly AlignItem[], stack: StackPosition \| undefined): Availability;` |
| `arrangeTarget` | function | `function arrangeTarget(stack: StackPosition, action: ArrangeAction): { readonly to_index: number; } \| { readonly reason: string; };` |
| `distributeAvailability` | function | `function distributeAvailability(items: readonly AlignItem[]): Availability;` |
| `planAlign` | function | `function planAlign(items: readonly AlignItem[], align: AlignEdge, kind: AlignReferenceKind, artboardId?: string): AlignCommand;` |
| `planDistribute` | function | `function planDistribute(items: readonly AlignItem[], axis: DistributeAxis, mode: DistributeMode, spacing?: number): DistributeCommand;` |
| `validateAlignItems` | function | `function validateAlignItems(items: readonly AlignItem[]): void;` |
| `validateSpacing` | function | `function validateSpacing(spacing: number): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/align-distribute-model.ts -->
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
