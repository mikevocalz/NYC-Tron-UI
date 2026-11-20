---
name: "PointEditor2D"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/inputs/PointEditor2D"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.focus", "color.surfaceRaised"]
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# PointEditor2D

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/inputs/PointEditor2D.tsx -->
Normalized point editor with one active 44pt native grip and equivalent numeric controls.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/inputs/PointEditor2D.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PointEditor2D } from "@nyc-tron/ui/components/forge/inputs/PointEditor2D";`
- Peers: @nyc-tron/core, react, react-native, react-native-gesture-handler, zustand
- Requires: @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/inputs/PointEditor2D
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/inputs/PointEditor2D.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `points` | `readonly EditorPoint2D[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onCommit` | `(point: EditorPoint2D, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `renderPreview` | `(points: readonly EditorPoint2D[]) => ReactNode` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/inputs/PointEditor2D.tsx -->
- `accessibilityLabel`: "Drag "
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
