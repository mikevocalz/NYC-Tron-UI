---
name: "SpectrogramView"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/SpectrogramView"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "font.11", "font.13", "font.14", "font.15", "radius.card", "radius.control", "space.1.5", "space.2", "space.3", "space.4"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# SpectrogramView

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/SpectrogramView.tsx -->
Spectrogram drawn with plain Views: time runs left to right (also in RTL), low frequencies at the bottom.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/SpectrogramView.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SpectrogramView } from "@nyc-tron/ui/forge/audio/SpectrogramView";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/audio/SpectrogramView
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/SpectrogramView.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | not recorded | yes | Name of the analysed range, used as the group label. |
| `status` | `SpectrogramStatus` | not recorded | yes | What to draw: a placeholder, the grid, an error or the empty message. |
| `frames` | `readonly (readonly number[])[]` | not recorded | yes | One row per hop, one dB value per band (floored at -120, full-scale sine about 0). |
| `bandsHz` | `readonly number[]` | not recorded | yes | Band centres in Hz, low to high, log-spaced. |
| `hopSeconds` | `number` | not recorded | yes | Seconds between frames. |
| `height` | `number` | `160` | no | Plot height in pt. |
| `visibleRange` | `WaveformRange` | not recorded | no |  |
| `onVisibleRangeCommit` | `(range: WaveformRange) => void \| Promise<unknown>` | not recorded | no |  |
| `error` | `string` | not recorded | no | Shown when `status` is `"error"`. |
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
| `error` | `error` prop, type `string` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/SpectrogramView.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "alert"
- `aria-busy`: set from an expression
- `aria-label`: set from an expression
- `aria-level`: set from an expression
- `role`: "group", "heading", "img"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
