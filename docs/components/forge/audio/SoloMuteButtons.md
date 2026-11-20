---
name: "SoloMuteButtons"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/SoloMuteButtons"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["border.2", "color.accent", "color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "opacity.0_45", "radius.control", "space.1", "space.2"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# SoloMuteButtons

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/SoloMuteButtons.tsx -->
Controlled mute and solo toggles for one channel.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/SoloMuteButtons.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SoloMuteButtons } from "@nyc-tron/ui/forge/audio/SoloMuteButtons";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/audio/SoloMuteButtons
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/SoloMuteButtons.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `targetSize` | `number` | not recorded | no | App-owned minimum interaction target. Defaults to 44 points. |
| `labels` | `Partial<SoloMuteLabels>` | not recorded | no |  |
| `label` | `string` | not recorded | yes | Channel name used in the accessible names, e.g. `"Mute Bass"`. |
| `muted` | `boolean` | not recorded | yes | Committed mute state. |
| `solo` | `boolean` | not recorded | yes | Committed solo state. |
| `audibility` | `Audibility` | `derived from `muted` alone` | no | Whether the channel is heard, from {@linkcode audibility}. Pass it so a channel silenced by another channel's solo shows that state on its mute button. |
| `onMutedCommit` | `(muted: boolean) => void \| Promise<unknown>` | not recorded | yes | Once per press with the requested mute state. |
| `onSoloCommit` | `(solo: boolean) => void \| Promise<unknown>` | not recorded | yes | Once per press with the requested solo state. |
| `soloSafe` | `boolean` | `false` | no | Committed solo-safe state. |
| `onSoloSafeCommit` | `(safe: boolean) => void \| Promise<unknown>` | not recorded | no | Once per press with the requested solo-safe state. When given, a third toggle named `"Solo safe <label>"` is drawn under mute and solo. |
| `direction` | `"row" \| "column"` | `"row"` | no |  |
| `disabled` | `boolean` | `false` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/SoloMuteButtons.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "togglebutton"
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
