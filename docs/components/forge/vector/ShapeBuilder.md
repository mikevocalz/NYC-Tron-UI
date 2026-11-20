---
name: "ShapeBuilder"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/vector/ShapeBuilder"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# ShapeBuilder

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/vector/ShapeBuilder.tsx -->
Boolean shape builder (B-22).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/vector/ShapeBuilder.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ShapeBuilder } from "@nyc-tron/ui/components/forge/vector/ShapeBuilder";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/vector/ShapeBuilder
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/vector/ShapeBuilder.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `selection` | `readonly BuilderLayer[]` | not recorded | yes | The selected layers. Two or more sibling, unlocked shapes or paths can be combined. |
| `group` | `BooleanGroup` | not recorded | no | The boolean group to edit: the selected boolean, or the boolean holding the selected operand. |
| `onBoolean` | `(intent: { ids: LayerId[]; op: BooleanOp; }, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Combine the selection. Maps to `booleanLayers {ids, op}`. |
| `onSetBooleanOp` | `(intent: { id: LayerId; op: BooleanOp; }, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Change the group's operation. Maps to `setBooleanOp {id, op}`. |
| `onRelease` | `(intent: { id: LayerId; }, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Release the operands back into the parent. Maps to `ungroupLayer {id}`. |
| `onExpand` | `(intent: { id: LayerId; }, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Expand the result into pixels. Maps to `rasterizeLayer {id}`. |
| `onSelectOperand` | `(id: LayerId) => void` | not recorded | no | An operand row was pressed; the host selects that layer for editing (`selectLayers`). Rows are static text without it. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/vector/ShapeBuilder.tsx -->
- `accessibilityHint`: "Selects this shape for editing"
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "toolbar"
- `aria-label`: "Boolean operations", "Operation"
- `role`: "list", "listitem", "radio", "radiogroup"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
