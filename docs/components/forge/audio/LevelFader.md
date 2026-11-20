---
name: "LevelFader"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/LevelFader"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# LevelFader

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/LevelFader.tsx -->
Controlled audio level fader.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/LevelFader.tsx -->
- Package: @nyc-tron/ui
- Import: `import { LevelFader } from "@nyc-tron/ui/components/forge/audio/LevelFader";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/audio/LevelFader
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/LevelFader.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `targetSize` | `number` | not recorded | no | App-owned minimum interaction target. Defaults to 44 points. |
| `labels` | `LevelFaderLabels` | not recorded | no |  |
| `value` | `number` | not recorded | yes | Committed linear gain from the app or engine (0 = silence, 1 = 0 dB). |
| `label` | `string` | not recorded | yes | Accessible name and visible label, e.g. `"Vocals"`. |
| `onChange` | `(gain: number) => void` | not recorded | no | Called with each new gain while a drag is in progress, with the restored `value` when a drag is cancelled, and with the stepped gain just before each step's `onCommit`. Use it for live preview only. |
| `onCommit` | `(gain: number, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Called once per completed drag on release, and once per step from the buttons, arrow keys or a screen-reader action. Not called when the gain is unchanged. The fader keeps showing `value`, so a rejected promise leaves the old level on screen; report the failure from the app. |
| `range` | `FaderRange` | `FADER_RANGES.UNITY (-60 dB to 0 dB)` | no | Decibel window of the travel. The bottom of travel is always silence. |
| `stepDb` | `number` | `1` | no | Size of one button or screen-reader step, in dB. |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | no |  |
| `length` | `number` | `160` | no | Track length along the travel axis, in points. |
| `disabled` | `boolean` | `false` | no |  |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no | Drop the default token recipe; supply a full app recipe via `className`. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/LevelFader.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "adjustable", "button"
- `accessibilityState`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
