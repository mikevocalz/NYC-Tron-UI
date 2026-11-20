---
name: "NodeGraphEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/motion/NodeGraphEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.textMuted", "space.1.5", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/graph/PatchGraph", "@nyc-tron/shell/UnitInput"]
a11yStatus: "declared"
---

# NodeGraphEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/NodeGraphEditor.tsx -->
Typed, bounded graph editor.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/NodeGraphEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { NodeGraphEditor } from "@nyc-tron/ui/forge/motion/NodeGraphEditor";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/graph/PatchGraph, @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/motion/NodeGraphEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/NodeGraphEditor.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `revision` | `string \| number` | not recorded | yes |  |
| `nodes` | `readonly GraphNode[]` | not recorded | yes |  |
| `edges` | `readonly GraphEdge[]` | not recorded | yes |  |
| `selectedNodeId` | `string \| null` | not recorded | yes |  |
| `onSelectNode` | `(id: string) => void` | not recorded | yes |  |
| `onMutation` | `(mutation: NodeGraphMutation, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
| `availableNodeTypes` | `readonly { readonly id: string; readonly label: string; }[]` | not recorded | no |  |
| `policy` | `NodeGraphPolicy` | not recorded | no |  |
| `width` | `number` | not recorded | yes |  |
| `height` | `number` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/NodeGraphEditor.tsx -->
- `accessibilityLabel`: "Available node types", "Graph links", "Typed graph ports"
- `aria-label`: "Node graph panel section"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
