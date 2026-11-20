---
name: "TransformGizmo3D"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/cad/TransformGizmo3D"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["space.2"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PointEditor2D", "@nyc-tron/forge/inputs/PropertyInspector", "@nyc-tron/forge/motion/Transform3DInspector"]
a11yStatus: "unverified"
---

# TransformGizmo3D

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/TransformGizmo3D.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/TransformGizmo3D.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TransformGizmo3D } from "@nyc-tron/ui/forge/cad/TransformGizmo3D";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PointEditor2D, @nyc-tron/forge/inputs/PropertyInspector, @nyc-tron/forge/motion/Transform3DInspector

```sh
npx shadcn@latest add @nyc-tron/forge/cad/TransformGizmo3D
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/TransformGizmo3D.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `objectId` | `string` | not recorded | yes |  |
| `value` | `MotionTransform3D` | not recorded | yes |  |
| `mode` | `'translate' \| 'rotate' \| 'scale'` | not recorded | yes |  |
| `axis` | `'x' \| 'y' \| 'z' \| 'xy' \| 'xz' \| 'yz' \| 'free'` | not recorded | yes |  |
| `space` | `'local' \| 'world'` | not recorded | yes |  |
| `projectedHandle` | `EditorPoint2D` | not recorded | yes |  |
| `cameraRevision` | `string \| number` | not recorded | yes |  |
| `renderPreview` | `(point: EditorPoint2D) => ReactNode` | not recorded | yes |  |
| `onOptions` | `(options: { mode: TransformGizmo3DProps['mode']; axis: TransformGizmo3DProps['axis']; space: 'local' \| 'world'; }, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onProjectedDrag` | `(request: { point: EditorPoint2D; mode: TransformGizmo3DProps['mode']; axis: TransformGizmo3DProps['axis']; space: 'local' \| 'world'; cameraRevision: string \| number; }, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCommit` | `(value: MotionTransform3D, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/TransformGizmo3D.tsx -->
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
