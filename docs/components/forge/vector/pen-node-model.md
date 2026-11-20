---
name: "PenNodeModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/vector/pen-node-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PenNodeModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/vector/pen-node-model.ts -->
Pure geometry and command planning for {@linkcode PenNodeEditor} (B-21).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/vector/pen-node-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { NODE_KINDS, PEN_HANDLE_SIZE, PEN_INSERT_TOLERANCE, PEN_MAX_NODES, PEN_NODE_SIZE, PEN_TAP_SLOP, PEN_TOUCH_TARGET, closeAvailability } from "@nyc-tron/ui/forge/vector/pen-node-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/vector/pen-node-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/vector/pen-node-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `HandleSide` | type | `type HandleSide = "in" \| "out";` |
| `InsertNodeIntent` | interface | `interface InsertNodeIntent { readonly subpath: number; readonly index: number; readonly node: PathNode; readonly subpaths: Subpath[]; readonly neighborsChang...` |
| `NODE_KINDS` | const | `const NODE_KINDS: readonly [ { readonly value: "corner"; readonly label: "Corner"; }, { readonly value: "smooth"; readonly label: "Smooth"; }, { readonly val...` |
| `NodeKindIntent` | interface | `interface NodeKindIntent { readonly subpath: number; readonly index: number; readonly kind: NodeKind; readonly node: PathNode; readonly handlesChanged: boole...` |
| `PEN_HANDLE_SIZE` | const | `const PEN_HANDLE_SIZE = 10;` |
| `PEN_INSERT_TOLERANCE` | const | `const PEN_INSERT_TOLERANCE = 12;` |
| `PEN_MAX_NODES` | const | `const PEN_MAX_NODES = 1000;` |
| `PEN_NODE_SIZE` | const | `const PEN_NODE_SIZE = 12;` |
| `PEN_TAP_SLOP` | const | `const PEN_TAP_SLOP = 3;` |
| `PEN_TOUCH_TARGET` | const | `const PEN_TOUCH_TARGET = 44;` |
| `PathHit` | interface | `interface PathHit { readonly subpath: number; readonly segment: number; readonly t: number; readonly point: Point; readonly distance: number; }` |
| `SegmentControls` | interface | `interface SegmentControls { readonly p0: Point; readonly p1: Point; readonly p2: Point; readonly p3: Point; readonly line: boolean; }` |
| `closeAvailability` | function | `function closeAvailability(subpaths: readonly Subpath[], ref: NodeRef \| undefined): Availability;` |
| `convertNodeKind` | function | `function convertNodeKind(subpaths: readonly Subpath[], ref: NodeRef, kind: NodeKind): NodeKindIntent;` |
| `hitPath` | function | `function hitPath(subpaths: readonly Subpath[], p: Point, tolerance: number, project?: (q: Point) => Point): PathHit \| undefined;` |
| `insertAfterAvailability` | function | `function insertAfterAvailability(subpaths: readonly Subpath[], ref: NodeRef \| undefined): Availability;` |
| `isNodeRef` | function | `function isNodeRef(subpaths: readonly Subpath[], ref: NodeRef \| undefined): ref is NodeRef;` |
| `kindAvailability` | function | `function kindAvailability(subpaths: readonly Subpath[], ref: NodeRef \| undefined): Availability;` |
| `moveHandle` | function | `function moveHandle(node: PathNode, side: HandleSide, handle: HandleOffset, breakHandles?: boolean): PathNode;` |
| `moveNode` | function | `function moveNode(node: PathNode, dx: number, dy: number): PathNode;` |
| `nodeAccessibilityLabel` | function | `function nodeAccessibilityLabel(subpaths: readonly Subpath[], ref: NodeRef): string;` |
| `nodeAt` | function | `function nodeAt(subpaths: readonly Subpath[], ref: NodeRef): PathNode;` |
| `nodeKindLabel` | function | `function nodeKindLabel(kind: NodeKind): string;` |
| `pointOnSegment` | function | `function pointOnSegment(c: SegmentControls, t: number): Point;` |
| `removeAvailability` | function | `function removeAvailability(subpaths: readonly Subpath[], ref: NodeRef \| undefined): Availability;` |
| `replaceNode` | function | `function replaceNode(subpaths: readonly Subpath[], ref: NodeRef, node: PathNode): Subpath[];` |
| `sampleSegment` | function | `function sampleSegment(c: SegmentControls, maxPiece?: number): Point[];` |
| `segmentControls` | function | `function segmentControls(sp: Subpath, segment: number): SegmentControls;` |
| `segmentCount` | function | `function segmentCount(sp: Subpath): number;` |
| `splitSegment` | function | `function splitSegment(subpaths: readonly Subpath[], subpath: number, segment: number, t: number): InsertNodeIntent;` |
| `stepSelection` | function | `function stepSelection(subpaths: readonly Subpath[], ref: NodeRef \| undefined, direction: -1 \| 1): NodeRef;` |
| `validateSubpaths` | function | `function validateSubpaths(subpaths: readonly Subpath[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/vector/pen-node-model.ts -->
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
