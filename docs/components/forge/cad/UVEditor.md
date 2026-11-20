---
name: "UVEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/cad/UVEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PointEditor2D"]
a11yStatus: "unverified"
---

# UVEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/UVEditor.tsx -->
The host supplies the active normalized tile and selected vertex subset; mesh seams, packing and synchronized model projection stay engine-owned.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/UVEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { UVEditor } from "@nyc-tron/ui/components/forge/cad/UVEditor";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PointEditor2D

```sh
npx shadcn@latest add @nyc-tron/forge/cad/UVEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/UVEditor.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `islands` | `readonly { id: string; label: string; selected: boolean; }[]` | not recorded | yes |  |
| `points` | `readonly EditorPoint2D[]` | not recorded | yes |  |
| `selectedPointId` | `string \| null` | not recorded | yes |  |
| `selectionEdges` | `readonly string[]` | not recorded | yes |  |
| `renderUV` | `(points: readonly EditorPoint2D[]) => ReactNode` | not recorded | yes |  |
| `renderModelSelection` | `() => ReactNode` | not recorded | yes |  |
| `onSelectIsland` | `(id: string) => void` | not recorded | yes |  |
| `onSelectPoint` | `(id: string) => void` | not recorded | yes |  |
| `onMovePoint` | `(point: EditorPoint2D, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onSeams` | `(edges: readonly string[], marked: boolean, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onPack` | `(islandIds: readonly string[], signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `status` | `'idle' \| 'packing' \| 'error'` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/UVEditor.tsx -->
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
