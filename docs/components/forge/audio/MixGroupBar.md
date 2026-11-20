---
name: "MixGroupBar"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/MixGroupBar"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# MixGroupBar

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/MixGroupBar.tsx -->
Controlled mix group chips: name, member count, and Solo and Mute toggles for the whole group.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/MixGroupBar.tsx -->
- Package: @nyc-tron/ui
- Import: `import { MixGroupBar } from "@nyc-tron/ui/components/forge/audio/MixGroupBar";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/audio/MixGroupBar
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/MixGroupBar.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `targetSize` | `number` | not recorded | no | App-owned minimum interaction target. Defaults to 44 points. |
| `labels` | `Partial<MixGroupLabels>` | not recorded | no |  |
| `groups` | `readonly MixGroup[]` | not recorded | yes | From {@linkcode mixGroups}, in display order. |
| `onGroupSoloCommit` | `(group: string, solo: boolean) => void \| Promise<unknown>` | not recorded | yes | Once per press. Requests `false` when every member is soloed, `true` otherwise (including the mixed state). The engine applies it to every member as one undo step. |
| `onGroupMutedCommit` | `(group: string, muted: boolean) => void \| Promise<unknown>` | not recorded | yes | Once per press, with the same rule as solo. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/MixGroupBar.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "togglebutton"
- `accessibilityState`: set from an expression
- `aria-pressed`: "mixed"
- `role`: "button", "group"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
