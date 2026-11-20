---
name: "ViewCubeAndAxisGizmo"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/cad/ViewCubeAndAxisGizmo"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# ViewCubeAndAxisGizmo

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/ViewCubeAndAxisGizmo.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/ViewCubeAndAxisGizmo.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ViewCubeAndAxisGizmo } from "@nyc-tron/ui/components/forge/cad/ViewCubeAndAxisGizmo";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/cad/ViewCubeAndAxisGizmo
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/ViewCubeAndAxisGizmo.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `view` | `Standard3DView \| 'custom'` | not recorded | yes |  |
| `projection` | `'orthographic' \| 'perspective'` | not recorded | yes |  |
| `axisLabels` | `{ x: string; y: string; z: string; }` | not recorded | yes |  |
| `renderOrientation` | `() => ReactNode` | not recorded | yes |  |
| `onView` | `(view: Standard3DView, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onProjection` | `(mode: 'orthographic' \| 'perspective', signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onFit` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/ViewCubeAndAxisGizmo.tsx -->
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
