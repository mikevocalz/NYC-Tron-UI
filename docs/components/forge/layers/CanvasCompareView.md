---
name: "CanvasCompareView"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/layers/CanvasCompareView"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber", "@nyc-tron/gestures/PanResponderDrag"]
a11yStatus: "unverified"
---

# CanvasCompareView

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/layers/CanvasCompareView.tsx -->
Before/after comparison of two canvas images (B-27): side by side (stacked on narrow panes), split with a draggable divider (arrow keys, Page Up/Down, Home/End; Escape cancels a drag), overlay with an opacity scrubber, and reference, where the current image fills the view with the reference...
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/layers/CanvasCompareView.tsx -->
- Package: @nyc-tron/ui
- Import: `import { CanvasCompareView } from "@nyc-tron/ui/components/forge/layers/CanvasCompareView";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber, @nyc-tron/gestures/PanResponderDrag

```sh
npx shadcn@latest add @nyc-tron/forge/layers/CanvasCompareView
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/layers/CanvasCompareView.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `before` | `CompareSource \| null` | not recorded | yes | The earlier image (a snapshot `flatten`) or a reference picture; `null` until the host has one. |
| `after` | `CompareSource \| null` | not recorded | yes | The current image (the live `flatten`); `null` until the host has one. |
| `beforeLabel` | `string` | `"Before"` | no |  |
| `afterLabel` | `string` | `"After"` | no |  |
| `mode` | `CompareMode` | not recorded | yes |  |
| `onModeChange` | `(mode: CompareMode) => void` | not recorded | yes |  |
| `split` | `number` | not recorded | yes | Share of the frame showing `before`, from the left, 0..1. Canvas geometry stays left-to-right in RTL. |
| `onSplitPreview` | `(split: number) => void` | not recorded | no | Each divider move during a drag; a cancelled drag sends the original value once more. |
| `onSplitCommit` | `(split: number, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Once per drag release or key press. |
| `overlayOpacity` | `number` | not recorded | yes | Opacity of `before` drawn over `after` in overlay mode, 0..1. |
| `onOverlayOpacityPreview` | `(opacity: number) => void` | not recorded | no |  |
| `onOverlayOpacityCommit` | `(opacity: number, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Once per completed scrubber drag, nudge or typed value. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/layers/CanvasCompareView.tsx -->
- `accessibilityHint`: "Drag or use the arrow keys to move the divider. Escape cancels a drag."
- `accessibilityLabel`: "Split position"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "adjustable", "image"
- `aria-label`: "Compare mode"
- `aria-valuemax`: set from an expression
- `aria-valuemin`: set from an expression
- `aria-valuenow`: set from an expression
- `aria-valuetext`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
