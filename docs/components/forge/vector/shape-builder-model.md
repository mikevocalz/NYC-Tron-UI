---
name: "ShapeBuilderModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/vector/shape-builder-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ShapeBuilderModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/vector/shape-builder-model.ts -->
Rules and labels for {@linkcode ShapeBuilder} (B-22).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/vector/shape-builder-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/vector/shape-builder-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { BOOLEAN_OPS, booleanAvailability, booleanIds, booleanOpLabel, groupAvailability, layerKindName, operandAccessibilityLabel, validateBooleanGroup } from "@/components/nyc-tron/ui/components/forge/vector/shape-builder-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { BOOLEAN_OPS, booleanAvailability, booleanIds, booleanOpLabel, groupAvailability, layerKindName, operandAccessibilityLabel, validateBooleanGroup } from "@nyc-tron/ui/components/forge/vector/shape-builder-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/vector/shape-builder-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `BOOLEAN_OPS` | const | `const BOOLEAN_OPS: readonly [ { readonly value: "union"; readonly label: "Union"; readonly description: "Merge the shapes into one outline"; }, { readonly va...` |
| `BooleanGroup` | interface | `interface BooleanGroup { readonly id: LayerId; readonly name: string; readonly op: BooleanOp; readonly locked: boolean; readonly operands: readonly BuilderLa...` |
| `BuilderLayer` | interface | `interface BuilderLayer { readonly id: LayerId; readonly name: string; readonly kind: BuilderLayerKind; readonly parent: LayerId \| null; readonly parentKind?:...` |
| `BuilderLayerKind` | type | `type BuilderLayerKind = "raster" \| "shape" \| "path" \| "group" \| "boolean";` |
| `LayerId` | type | `type LayerId = number;` |
| `booleanAvailability` | function | `function booleanAvailability(selection: readonly BuilderLayer[]): Availability;` |
| `booleanIds` | function | `function booleanIds(selection: readonly BuilderLayer[]): LayerId[];` |
| `booleanOpLabel` | function | `function booleanOpLabel(op: BooleanOp): string;` |
| `groupAvailability` | function | `function groupAvailability(group: BooleanGroup \| undefined): Availability;` |
| `layerKindName` | function | `function layerKindName(kind: BuilderLayerKind): string;` |
| `operandAccessibilityLabel` | function | `function operandAccessibilityLabel(operand: BuilderLayer, index: number, count: number): string;` |
| `validateBooleanGroup` | function | `function validateBooleanGroup(group: BooleanGroup): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/vector/shape-builder-model.ts -->
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
