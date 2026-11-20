---
name: "GradientOnCanvasHandles"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/vector/GradientOnCanvasHandles"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# GradientOnCanvasHandles

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/vector/GradientOnCanvasHandles.tsx -->
On-canvas gradient editor (B-24).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/vector/GradientOnCanvasHandles.tsx -->
- Package: @nyc-tron/ui
- Import: `import { GradientOnCanvasHandles } from "@nyc-tron/ui/components/forge/vector/GradientOnCanvasHandles";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/vector/GradientOnCanvasHandles
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/vector/GradientOnCanvasHandles.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `paint` | `GradientPaint` | not recorded | yes | The layer's linear or radial fill. |
| `width` | `number` | not recorded | yes | Overlay size in points. |
| `height` | `number` | not recorded | yes |  |
| `transform` | `ViewTransform` | `identity` | no | Content to view mapping. |
| `selectedStop` | `number \| undefined` | not recorded | yes | Index of the selected stop, or `undefined`. |
| `onSelectStop` | `(index: number \| undefined) => void` | not recorded | yes |  |
| `onPreview` | `(paint: GradientPaint \| undefined) => void` | not recorded | no | Paint to draw during a drag; `undefined` when it ends or is cancelled. |
| `onSetFill` | `(paint: GradientPaint, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | One call per drag release, key press, added or deleted stop. Maps to `setFill {id, fill}`. |
| `children` | `ReactNode` | not recorded | no | Canvas content drawn under the handles; it never takes touches while they are mounted. |
| `showCommands` | `boolean` | `true` | no | Show the stop and focal commands under the overlay. |
| `geometryOnly` | `boolean` | not recorded | no | Geometry-only overlays (e.g. photo masks) do not expose or add paint stops. |
| `label` | `string` | `"Gradient"` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/vector/GradientOnCanvasHandles.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "toolbar"
- `aria-label`: "Gradient commands"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
