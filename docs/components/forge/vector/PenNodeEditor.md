---
name: "PenNodeEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/vector/PenNodeEditor"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.surfaceRaised", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# PenNodeEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/vector/PenNodeEditor.tsx -->
On-canvas node editor for one path layer (B-21).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/vector/PenNodeEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PenNodeEditor } from "@nyc-tron/ui/components/forge/vector/PenNodeEditor";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/vector/PenNodeEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/vector/PenNodeEditor.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `subpaths` | `readonly Subpath[]` | not recorded | yes | The path layer's subpaths, in content coordinates. |
| `editScope` | `string` | not recorded | no | Optional content-coordinate snapping. The host must return finite coordinates. |
| `editRevision` | `string \| number` | not recorded | no |  |
| `snapPoint` | `(point: Point, ref: NodeRef) => Point` | not recorded | no |  |
| `snapHandle` | `(offset: HandleOffset, node: PathNode, ref: NodeRef) => HandleOffset` | not recorded | no |  |
| `width` | `number` | not recorded | yes | Overlay size in points; place it over the canvas region the transform maps into. |
| `height` | `number` | not recorded | yes |  |
| `transform` | `ViewTransform` | `identity` | no | Content to view mapping (zoom, pan, layer transform). |
| `selection` | `NodeRef \| undefined` | not recorded | yes | The selected node, or `undefined`. |
| `onSelectionChange` | `(ref: NodeRef \| undefined) => void` | not recorded | yes |  |
| `onPreview` | `(subpaths: readonly Subpath[] \| undefined) => void` | not recorded | no | The path to draw during a drag; `undefined` when the drag ends or is cancelled. Never persist here. |
| `onSetPathNode` | `(intent: SetPathNodeIntent, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | A node or handle was dragged and released, or nudged by one key press. Maps to `setPathNode`. |
| `onInsertNode` | `(intent: InsertNodeIntent, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | A tap on the outline or the "Add node" command split a segment. Maps to `insertPathNode` when {@linkcode InsertNodeIntent.neighborsChanged} is false, otherwise `setPathNodes` with {@linkcode InsertNodeIntent.subpaths}. |
| `onRemoveNode` | `(ref: NodeRef, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Delete, Backspace or the command removed a node. Maps to `removePathNode`. |
| `onSetNodeKind` | `(intent: NodeKindIntent, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | The node kind changed. Maps to `setNodeKind`, or to `setPathNode` with {@linkcode NodeKindIntent.node} when {@linkcode NodeKindIntent.handlesChanged}. |
| `onSetClosed` | `(intent: SetClosedIntent, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | The selected node's subpath was closed or opened. Maps to `setSubpathClosed`. |
| `children` | `ReactNode` | not recorded | no | Canvas content drawn under the overlay. It never takes touches while the editor is mounted. |
| `showCommands` | `boolean` | `true` | no | Show the node command bar under the overlay. |
| `label` | `string` | `"Path nodes"` | no |  |
| `accentColor` | `string` | not recorded | no | Optional override; defaults to the theme's accent token. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/vector/PenNodeEditor.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "toolbar"
- `aria-label`: "Node commands", "Node kind"
- `role`: "radio", "radiogroup"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
