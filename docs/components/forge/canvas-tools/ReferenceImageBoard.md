---
name: "ReferenceImageBoard"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/canvas-tools/ReferenceImageBoard"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["ReferenceImageBoard.font.18", "border.2", "color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "opacity.0_35", "opacity.0_45", "radius.card", "radius.control", "space.0.5", "space.1", "space.1.5", "space.2", "space.3"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# ReferenceImageBoard

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas-tools/ReferenceImageBoard.tsx -->
Reference images (B-31) pinned beside or floating over the canvas, or laid over it for tracing.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas-tools/ReferenceImageBoard.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ReferenceImageBoard } from "@nyc-tron/ui/forge/canvas-tools/ReferenceImageBoard";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/canvas-tools/ReferenceImageBoard
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas-tools/ReferenceImageBoard.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `references` | `readonly ReferenceImage[]` | not recorded | yes |  |
| `selectedId` | `string \| undefined` | not recorded | no | The reference whose settings the inspector shows. |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onUpdate` | `(id: string, patch: ReferencePatch, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | One call per drag release, key press or control change. |
| `onPreview` | `(id: string, frame: BoardRect \| undefined) => void` | not recorded | no | The frame drawn during a drag, then `undefined` on release or cancel. |
| `onAdd` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Ask the host to pick an image and add it. |
| `onRemove` | `(id: string, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `renderImage` | `(reference: ReferenceImage) => ReactNode` | not recorded | yes | Draws a reference's picture. The node should fill its parent; the board sizes and clips it. |
| `width` | `number` | not recorded | yes | Board (canvas area) size in layout units. Floating windows stay inside it. |
| `height` | `number` | not recorded | yes |  |
| `sideWidth` | `number` | `168` | no | Width of the side column that holds `side` references. |
| `children` | `ReactNode` | not recorded | no | The host's canvas, drawn under overlays and floating windows. |
| `label` | `string` | `"Reference images"` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas-tools/ReferenceImageBoard.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "adjustable"
- `aria-label`: "Fit", "Opacity", "Placement"
- `aria-level`: set from an expression
- `aria-live`: "polite"
- `aria-selected`: set from an expression
- `aria-valuemax`: set from an expression
- `aria-valuemin`: set from an expression
- `aria-valuenow`: set from an expression
- `aria-valuetext`: set from an expression
- `role`: "button", "group", "heading"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
