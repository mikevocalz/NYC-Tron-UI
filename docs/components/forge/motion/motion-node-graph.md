---
name: "MotionNodeGraphModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/motion/motion-node-graph"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# MotionNodeGraphModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/motion-node-graph.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/motion-node-graph.ts -->
- Package: @nyc-tron/ui
- Import: `import { motionGraphCanvasSize, validateMotionConnection, validateMotionNodeGraph } from "@nyc-tron/ui/forge/motion/motion-node-graph";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/motion/motion-node-graph
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/motion-node-graph.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `NodeGraphPolicy` | interface | `interface NodeGraphPolicy { readonly allowCycles?: boolean; readonly multipleInputs?: boolean; }` |
| `motionGraphCanvasSize` | function | `function motionGraphCanvasSize(nodes: readonly GraphNode[], width: number, height: number): { width: number; height: number; };` |
| `validateMotionConnection` | function | `function validateMotionConnection(nodes: readonly GraphNode[], edges: readonly GraphEdge[], from: GraphEndpoint, to: GraphEndpoint, policy?: NodeGraphPolicy)...` |
| `validateMotionNodeGraph` | function | `function validateMotionNodeGraph(nodes: readonly GraphNode[], edges: readonly GraphEdge[], policy?: NodeGraphPolicy): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/motion-node-graph.ts -->
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
