---
name: "CanvasPanZoom"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/canvas/CanvasPanZoom"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.focus"]
registryDependencies: []
a11yStatus: "declared"
---

# CanvasPanZoom

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/CanvasPanZoom.tsx -->
Native RNGH v3 pan/pinch recognition, non-passive browser wheel, and keyboard/accessibility navigation.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/CanvasPanZoom.tsx -->
- Package: @nyc-tron/ui
- Import: `import { CanvasPanZoom } from "@nyc-tron/ui/forge/canvas/CanvasPanZoom";`
- Peers: react, react-native, react-native-gesture-handler, zustand
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/CanvasPanZoom
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/CanvasPanZoom.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes | Document/viewport identity. Resources and authoritative document state stay above this control. |
| `revision` | `string \| number` | not recorded | no |  |
| `viewport` | `CanvasViewport` | not recorded | yes |  |
| `onPreview` | `(viewport: CanvasViewport) => void` | not recorded | no |  |
| `onCommit` | `(viewport: CanvasViewport) => void` | not recorded | yes | One call per completed touch/wheel gesture or keyboard/accessibility command. |
| `children` | `(viewport: CanvasViewport) => ReactNode` | not recorded | yes | Render using this viewport so previews do not become authoritative host state. |
| `minZoom` | `number` | not recorded | no |  |
| `maxZoom` | `number` | not recorded | no |  |
| `contentBounds` | `DocRect` | not recorded | no |  |
| `fitPadding` | `number` | not recorded | no |  |
| `keyboardStep` | `number` | not recorded | no |  |
| `panWithOnePointer` | `boolean` | not recorded | no | Enable for an app's pan tool. Otherwise a single pointer remains available to document editing. |
| `usableRegions` | `readonly Rect2D[]` | not recorded | no | Local overlay coordinates; get nonoccluded panes from the existing layout owner. |
| `disabled` | `boolean` | not recorded | no |  |
| `label` | `string` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
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
| `disabled` | `disabled` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/CanvasPanZoom.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "adjustable"
- `accessibilityState`: set from an expression
- `accessibilityValue`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
