---
name: "TextureBrush3D"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/cad/TextureBrush3D"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# TextureBrush3D

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/TextureBrush3D.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/TextureBrush3D.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TextureBrush3D } from "@nyc-tron/ui/components/forge/cad/TextureBrush3D";`
- Peers: @nyc-tron/core, react, react-native, react-native-gesture-handler, zustand
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/cad/TextureBrush3D
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/TextureBrush3D.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `surface` | `ReactNode` | not recorded | yes |  |
| `cameraRevision` | `string \| number` | not recorded | yes |  |
| `settings` | `TextureBrushSettings` | not recorded | yes |  |
| `channels` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `projectToSurface` | `(point: { x: number; y: number; }) => SurfaceBrushHit \| null` | not recorded | yes | Synchronous native/JSI ray projection. A miss returns null, preserving gaps across the model silhouette. |
| `onStroke` | `(sample: { phase: 'begin' \| 'update' \| 'end' \| 'cancel'; hit: SurfaceBrushHit \| null; pressure: number; settings: TextureBrushSettings; }) => void` | not recorded | yes |  |
| `onSettings` | `(settings: TextureBrushSettings, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `canPaint` | `boolean` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
| State | How it is set |
|---|---|
| `error` | `error` prop, type `string` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/TextureBrush3D.tsx -->
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
