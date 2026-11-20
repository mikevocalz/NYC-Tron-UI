---
name: "CompositionLayerTree"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/motion/CompositionLayerTree"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "color.textMuted", "space.0.5", "space.1", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# CompositionLayerTree

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/CompositionLayerTree.tsx -->
Virtualized nested composition/shape/text/footage/adjustment hierarchy with stable layer identity.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/CompositionLayerTree.tsx -->
- Package: @nyc-tron/ui
- Import: `import { CompositionLayerTree } from "@nyc-tron/ui/forge/motion/CompositionLayerTree";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/motion/CompositionLayerTree
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/CompositionLayerTree.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `revision` | `string \| number` | not recorded | no |  |
| `compositionId` | `string` | not recorded | yes |  |
| `layers` | `readonly CompositionLayer[]` | not recorded | yes |  |
| `expandedIds` | `readonly string[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `onExpandedChange` | `(ids: readonly string[]) => void` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onVisibilityChange` | `(id: string, visible: boolean, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
| `height` | `number` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/CompositionLayerTree.tsx -->
- `accessibilityLabel`: "Composition layer tree"
- `accessibilityRole`: "button"
- `accessibilityState`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
