---
name: "ModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/graph/model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/graph/model.ts -->
Engine-neutral graph contract.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/graph/model.ts -->
- Package: @nyc-tron/ui
- Import: `import { GRAPH_HEADER_HEIGHT, GRAPH_PORT_ROW_HEIGHT, compatiblePorts, cubicGraphPoints, getPortAnchor, validatePatchGraph } from "@nyc-tron/ui/forge/graph/model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/graph/model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/graph/model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `GRAPH_HEADER_HEIGHT` | const | `const GRAPH_HEADER_HEIGHT = 44;` |
| `GRAPH_PORT_ROW_HEIGHT` | const | `const GRAPH_PORT_ROW_HEIGHT = 44;` |
| `GraphEdge` | type | `type GraphEdge = Readonly<{ id: string; from: GraphEndpoint; to: GraphEndpoint; }>;` |
| `GraphEndpoint` | type | `type GraphEndpoint = Readonly<{ nodeId: string; portId: string; }>;` |
| `GraphNode` | type | `type GraphNode = Readonly<{ id: string; title: string; x: number; y: number; width?: number; inputs: readonly GraphPort[]; outputs: readonly GraphPort[]; }>;` |
| `GraphPoint` | type | `type GraphPoint = Readonly<{ x: number; y: number; }>;` |
| `GraphPort` | type | `type GraphPort = Readonly<{ id: string; label: string; dataType: string; }>;` |
| `GraphSelection` | type | `type GraphSelection = Readonly<{ nodeId: string; portId: string; dataType: string; }>;` |
| `compatiblePorts` | function | `function compatiblePorts(output: GraphSelection, input: GraphSelection): boolean;` |
| `cubicGraphPoints` | function | `function cubicGraphPoints(from: GraphPoint, to: GraphPoint, segments?: number): GraphPoint[];` |
| `getPortAnchor` | function | `function getPortAnchor(node: GraphNode, portId: string, kind: "input" \| "output"): GraphPoint;` |
| `validatePatchGraph` | function | `function validatePatchGraph(nodes: readonly GraphNode[], edges: readonly GraphEdge[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/graph/model.ts -->
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
