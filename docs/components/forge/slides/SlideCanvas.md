---
name: "SlideCanvas"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/SlideCanvas"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/office/office-controls", "@nyc-tron/forge/slides/SlideThumbnail"]
a11yStatus: "unverified"
---

# SlideCanvas

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/SlideCanvas.tsx -->
Editable slide (J-05): objects drawn to scale, press to select, drag to move with snapping guides, corner handle to resize (Shift keeps the ratio on web), arrows to nudge (Shift for 10), `[`/`]` to rotate, Delete to remove, double press to edit text.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/SlideCanvas.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SlideCanvas } from "@nyc-tron/ui/components/forge/slides/SlideCanvas";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/office/office-controls, @nyc-tron/forge/slides/SlideThumbnail

```sh
npx shadcn@latest add @nyc-tron/forge/slides/SlideCanvas
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/SlideCanvas.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `slide` | `SlideSummary` | not recorded | yes |  |
| `size` | `SlideSize` | not recorded | no |  |
| `selectedObjectId` | `string` | not recorded | no |  |
| `onSelectObject` | `(id: string \| undefined) => void` | not recorded | yes | `undefined` clears the selection (press on empty canvas, Escape). |
| `onMoveObject` | `(id: string, x: number, y: number) => void \| Promise<unknown>` | not recorded | no | Called once per drag or nudge with the new top-left corner. Renders drag handling. |
| `onResizeObject` | `(id: string, w: number, h: number) => void \| Promise<unknown>` | not recorded | no | Called once per resize with the new size. Renders the corner handle. |
| `onRotateObject` | `(id: string, degrees: number) => void \| Promise<unknown>` | not recorded | no | Called with absolute degrees (`[` and `]` step 15°). |
| `onSetText` | `(id: string, text: string) => void \| Promise<unknown>` | not recorded | no | Commits edited text of a text box. Double press or Enter starts editing. |
| `onRemoveObject` | `(id: string) => void \| Promise<unknown>` | not recorded | no |  |
| `snap` | `boolean` | `true` | no | Snap to slide edges and center and to other objects. |
| `renderImage` | `(src: string, object: SlideObject) => ReactNode` | not recorded | no |  |
| `label` | `string` | `"Slide"` | no |  |
| `disabled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/SlideCanvas.tsx -->
- `accessibilityLabel`: "Text box contents"
- `accessibilityRole`: "button"
- `accessibilityState`: set from an expression
- `role`: "group"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
