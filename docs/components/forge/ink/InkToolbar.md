---
name: "InkToolbar"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/ink/InkToolbar"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# InkToolbar

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/ink/InkToolbar.tsx -->
Controlled tool, size, color, opacity, pressure and history controls for a drawing board.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/ink/InkToolbar.tsx -->
- Package: @nyc-tron/ui
- Import: `import { InkToolbar } from "@nyc-tron/ui/components/forge/ink/InkToolbar";`
- Peers: react, react-native, zustand
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/ink/InkToolbar
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/ink/InkToolbar.tsx -->
Extends: `Omit<ViewProps, "children" | "onKeyDown">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | no | Lay controls out in a row (top or bottom bar) or a column (rail). |
| `edge` | `"left" \| "right" \| "top" \| "bottom"` | not recorded | no | Physical screen edge the toolbar sits against; draws the separating border on the opposite side. A foldable or tablet rail is `"right"` even in RTL, per the navigation shell policy. |
| `tools` | `readonly InkToolOption[]` | not recorded | yes | Tools the host board implements, in display order. |
| `tool` | `InkTool` | not recorded | yes | The active tool. Must be one of `tools`. |
| `onToolChange` | `(tool: InkTool) => void` | not recorded | yes | Called when the user picks an enabled tool other than the active one. |
| `size` | `InkSize` | not recorded | yes | The active stroke size. |
| `onSizeChange` | `(size: InkSize) => void` | not recorded | yes | Called with the next size step. |
| `swatches` | `readonly InkSwatch[]` | not recorded | no | Host palette. The color group is hidden when omitted or empty. |
| `color` | `string` | not recorded | no | Selected swatch id. Must match one of `swatches` when set. |
| `onColorChange` | `(id: string) => void` | not recorded | no | Called with a swatch id. Required to make swatches interactive. |
| `onRequestCustomColor` | `() => void` | not recorded | no | Shows a "Custom color" button that asks the host to open its own picker (for example `ColorChannels` in a popover). Hidden when omitted. |
| `opacity` | `number` | not recorded | no | Stroke opacity 0..1. The opacity control is hidden when omitted. |
| `onOpacityChange` | `(opacity: number) => void` | not recorded | no | Called with the stepped opacity. |
| `undo` | `InkAvailability` | not recorded | yes | Whether undo can run, and why not. |
| `redo` | `InkAvailability` | not recorded | yes | Whether redo can run, and why not. |
| `onUndo` | `() => void` | not recorded | yes |  |
| `onRedo` | `() => void` | not recorded | yes |  |
| `pressure` | `InkPressure` | not recorded | no | Pressure toggle. Pass it only when the current hardware reports measured pressure; the toggle is not rendered otherwise. |
| `onPressureChange` | `(enabled: boolean) => void` | not recorded | no |  |
| `icons` | `Partial<Record<InkToolbarIcon, ReactNode>>` | not recorded | no | Host-drawn glyphs. Each control shows its text label when its slot is empty. |
| `label` | `string` | `"Ink tools"` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/ink/InkToolbar.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "adjustable"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
- `aria-label`: "Color", "Tool"
- `aria-live`: "polite"
- `aria-orientation`: set from an expression
- `aria-valuenow`: set from an expression
- `aria-valuetext`: set from an expression
- `role`: "button", "radio", "radiogroup", "switch", "toolbar"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
