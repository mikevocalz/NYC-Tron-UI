---
name: "ClipToggle"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/layers/ClippingMaskControls"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.textMuted", "radius.1"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# ClipToggle

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/layers/ClippingMaskControls.tsx -->
Clip/unclip switch for one layer (B-13).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/layers/ClippingMaskControls.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ClipToggle, ClipIndicator } from "@nyc-tron/ui/forge/layers/ClippingMaskControls";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/layers/ClippingMaskControls
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/layers/ClippingMaskControls.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | no |  |
| `revision` | `string \| number` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `layers` | `readonly ClipLayer[]` | not recorded | yes | Layers top to bottom (index 0 is the top), as in `LayerStack`. |
| `layerId` | `string` | not recorded | yes | The layer the switch acts on. |
| `onSetClipped` | `(op: SetClippedOp, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | `setClipped`. |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |

### ClipIndicator

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `unstyled` | `boolean` | not recorded | no |  |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
| State | How it is set |
|---|---|
| `disabled` | `disabled` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/layers/ClippingMaskControls.tsx -->
- `role`: "switch"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
