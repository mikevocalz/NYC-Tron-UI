---
name: "NodeGraphCanvas"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/cad/NodeGraphCanvas"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/canvas/CanvasPanZoom", "@nyc-tron/forge/graph/PatchGraph", "@nyc-tron/forge/motion/NodeGraphEditor"]
a11yStatus: "unverified"
---

# NodeGraphCanvas

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/NodeGraphCanvas.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/NodeGraphCanvas.tsx -->
- Package: @nyc-tron/ui
- Import: `import { NodeGraphCanvas } from "@nyc-tron/ui/components/forge/cad/NodeGraphCanvas";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/canvas/CanvasPanZoom, @nyc-tron/forge/graph/PatchGraph, @nyc-tron/forge/motion/NodeGraphEditor

```sh
npx shadcn@latest add @nyc-tron/forge/cad/NodeGraphCanvas
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/NodeGraphCanvas.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `nodes` | `PatchGraphProps['nodes']` | not recorded | yes |  |
| `edges` | `PatchGraphProps['edges']` | not recorded | yes |  |
| `selectedNodeId` | `string \| null` | not recorded | yes |  |
| `viewport` | `CanvasViewport` | not recorded | yes |  |
| `canvasSize` | `{ width: number; height: number; }` | not recorded | yes |  |
| `policy` | `NodeGraphPolicy` | not recorded | no |  |
| `onSelectNode` | `(id: string) => void` | not recorded | yes |  |
| `onMutation` | `(mutation: NodeGraphMutation, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onViewportCommit` | `(viewport: CanvasViewport) => void` | not recorded | yes |  |
| `renderGraph` | `(props: PatchGraphProps) => ReactNode` | not recorded | no | Optional native/GPU renderer adapter for the same validated graph contract. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/NodeGraphCanvas.tsx -->
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
