---
name: "GradientMeshEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/GradientMeshEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.primary", "color.text"]
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/color/ColorChannelFields", "@nyc-tron/gestures/PanResponderDrag", "@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# GradientMeshEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/GradientMeshEditor.tsx -->
Nonfolding mesh node editor with drag previews, exact coordinates and per-node color/alpha.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/GradientMeshEditor.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/color/ColorChannelFields, @nyc-tron/gestures/PanResponderDrag, @nyc-tron/shell/UnitInput

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/color/GradientMeshEditor
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { GradientMeshEditor } from "@/components/nyc-tron/ui/components/forge/color/GradientMeshEditor";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { GradientMeshEditor } from "@nyc-tron/ui/components/forge/color/GradientMeshEditor";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/GradientMeshEditor.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `value` | `GradientMesh` | not recorded | yes |  |
| `selectedId` | `string` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onPreview` | `(mesh: GradientMesh \| undefined) => void` | not recorded | no |  |
| `onCommit` | `(mesh: GradientMesh) => void` | not recorded | yes |  |
| `children` | `ReactNode` | not recorded | no | Optional color-managed surface replacing the default bilinear sRGB preview. |
| `height` | `number` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
| `transport` | `DragTransport` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/GradientMeshEditor.tsx -->
- `accessibilityLabel`: "Gradient mesh topology"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
