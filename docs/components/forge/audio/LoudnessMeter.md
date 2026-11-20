---
name: "LoudnessMeter"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/LoudnessMeter"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["LoudnessMeter.font.30", "LoudnessMeter.leading.34", "color.accent", "color.border", "color.danger", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "font.11", "font.12", "font.13", "font.14", "font.15", "font.16", "radius.1", "radius.card", "radius.control", "space.0.5", "space.1", "space.1.5", "space.2", "space.2.5", "space.3", "space.3.5", "space.4"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# LoudnessMeter

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/LoudnessMeter.tsx -->
Loudness readout for a rendered range: gated integrated loudness against a target, short-term and momentary maxima, sample peak with an overs warning, and the momentary history on a fixed -60..0 LUFS scale with the target line.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/LoudnessMeter.tsx -->
- Package: @nyc-tron/ui
- Import: `import { LoudnessMeter } from "@nyc-tron/ui/forge/audio/LoudnessMeter";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/audio/LoudnessMeter
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/LoudnessMeter.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | not recorded | yes | Name of the measured range, for example "Master, bars 1-17". Used as the group label. |
| `status` | `LoudnessStatus` | not recorded | yes | What to draw: a placeholder, the readings, an error or the silent message. |
| `rmsDbfs` | `number \| null` | not recorded | no | Gated integrated loudness, LUFS. `null` when silent or shorter than one block. |
| `onReset` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | no |  |
| `integratedLufs` | `number \| null` | not recorded | yes |  |
| `shortTermMaxLufs` | `number \| null` | not recorded | yes | Highest 3 s short-term loudness, LUFS. |
| `momentaryMaxLufs` | `number \| null` | not recorded | yes | Highest 400 ms momentary loudness, LUFS. |
| `samplePeakDbfs` | `number \| null` | not recorded | yes | Highest sample magnitude, dBFS. This is sample peak, not true peak. |
| `momentaryLufs` | `readonly (number \| null)[]` | not recorded | yes | Momentary loudness per 400 ms block, one block every `stepSeconds`. `null` blocks are silent. |
| `stepSeconds` | `number` | not recorded | yes | Seconds between momentary blocks (the engine reports 0.1). |
| `target` | `number` | `-14` | no | Integrated target in LUFS, drawn as a line on the history. |
| `onTargetChange` | `(lufs: number) => void \| Promise<unknown>` | not recorded | no | Called when the person picks another target. Without it the target is shown as text and cannot be changed here. A rejected Promise leaves the `target` prop, and so the selection, unchanged. |
| `targets` | `readonly LoudnessTarget[]` | `LOUDNESS_TARGETS (-14, -16, -23 LUFS)` | no | Target choices. |
| `error` | `string` | not recorded | no | Shown when `status` is `"error"`: what failed, in the app's words. |
| `onRetry` | `() => void` | not recorded | no | Shown as a Retry button when `status` is `"error"`. |
| `disabled` | `boolean` | not recorded | no | Disables the target choice and Retry. |
| `historyHeight` | `number` | `112` | no | Height of the momentary history, in pt. |
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
| `disabled` | `disabled` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/LoudnessMeter.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "alert"
- `aria-busy`: set from an expression
- `aria-checked`: set from an expression
- `aria-disabled`: set from an expression
- `aria-label`: "Loudness target"
- `aria-level`: set from an expression
- `role`: "group", "heading", "img", "radio", "radiogroup"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
