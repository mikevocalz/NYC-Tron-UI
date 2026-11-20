---
name: "FloatingPaletteUndockHandle"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/FloatingPaletteUndockHandle"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.focus", "radius.control"]
registryDependencies: ["@nyc-tron/DragGrabHandle", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/gestures/PanResponderDrag"]
a11yStatus: "unverified"
---

# FloatingPaletteUndockHandle

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/FloatingPaletteUndockHandle.tsx -->
Grip that undocks, moves and re-docks a palette (B-28), built on `DragGrabHandle`.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/FloatingPaletteUndockHandle.tsx -->
- Package: @nyc-tron/ui
- Import: `import { FloatingPaletteUndockHandle } from "@nyc-tron/ui/components/forge/color/FloatingPaletteUndockHandle";`
- Peers: react, react-native
- Requires: @nyc-tron/DragGrabHandle, @nyc-tron/feedback/ErrorMessage, @nyc-tron/gestures/PanResponderDrag

```sh
npx shadcn@latest add @nyc-tron/forge/color/FloatingPaletteUndockHandle
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/FloatingPaletteUndockHandle.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `docked` | `boolean` | not recorded | yes |  |
| `origin` | `PalettePosition` | not recorded | yes | The palette's current top-left in the host's coordinates: its docked spot, or its floating position. |
| `size` | `{ readonly width: number; readonly height: number; }` | not recorded | yes | The palette's size, for keeping it on screen. |
| `bounds` | `PaletteRect` | not recorded | yes | Area the floating palette must stay inside, in the same coordinates as `origin`. |
| `obstacles` | `readonly PaletteRect[]` | not recorded | no | Hinges, folds and cutouts the palette must not cover. |
| `onPreview` | `(position: PalettePosition \| undefined) => void` | not recorded | yes | Where to draw the palette during a drag; `undefined` when the drag ends or is cancelled. |
| `onUndock` | `(position: PalettePosition, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | A docked palette was dragged past the undock distance and released. One commit. |
| `onMove` | `(position: PalettePosition, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | A floating palette was dragged or nudged to a new spot. One commit per release or key press. |
| `onDock` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Enter, Space or the screen-reader action on a floating palette. |
| `label` | `string` | `"Color palette"` | no |  |
| `disabled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/FloatingPaletteUndockHandle.tsx -->
- `accessibilityLiveRegion`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
