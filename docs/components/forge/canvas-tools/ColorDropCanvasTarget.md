---
name: "ColorDropCanvasTarget"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/canvas-tools/ColorDropCanvasTarget"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# ColorDropCanvasTarget

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas-tools/ColorDropCanvasTarget.tsx -->
ColorDrop (B-30): drag the colour chip onto the canvas to flood-fill there.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas-tools/ColorDropCanvasTarget.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/canvas-tools/ColorDropCanvasTarget
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ColorDropCanvasTarget } from "@/components/nyc-tron/ui/components/forge/canvas-tools/ColorDropCanvasTarget";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ColorDropCanvasTarget } from "@nyc-tron/ui/components/forge/canvas-tools/ColorDropCanvasTarget";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas-tools/ColorDropCanvasTarget.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `color` | `string` | not recorded | yes | The colour on the chip, in any form the platform draws and the host's fill accepts. |
| `colorLabel` | `string` | not recorded | yes | Spoken and shown name of the colour, e.g. "Coral". |
| `tolerance` | `number` | not recorded | yes | Fill tolerance 0..255 sent with each drop. |
| `contiguous` | `boolean` | not recorded | yes | Fill only the connected region, or every matching pixel. |
| `width` | `number` | not recorded | yes | Size of the canvas target in layout units; the host draws its canvas at this size. |
| `height` | `number` | not recorded | yes |  |
| `documentWidth` | `number` | not recorded | yes | Document size in pixels; drops are reported in document pixels. |
| `documentHeight` | `number` | not recorded | yes |  |
| `onFill` | `(request: FillRequest, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Exactly once per drop on the canvas. Maps to `floodFill` on the host's current layer. |
| `onPreview` | `(target: DropPoint \| undefined) => void` | not recorded | no | Live target in document pixels during a drag or keyboard aim; `undefined` when off the canvas or ended. |
| `onChipPress` | `() => void` | not recorded | no | A tap on the chip without dragging, e.g. to open the colour picker. |
| `disabledReason` | `string` | not recorded | no | Why filling is unavailable (for example "Fill needs a pixel layer"). Drags are refused and this is shown. |
| `children` | `ReactNode` | not recorded | no | The host's canvas, drawn inside the target. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas-tools/ColorDropCanvasTarget.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityState`: set from an expression
- `aria-label`: set from an expression
- `aria-live`: "polite"
- `role`: "button"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
