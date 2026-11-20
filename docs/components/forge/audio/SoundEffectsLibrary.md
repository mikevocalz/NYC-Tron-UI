---
name: "SoundEffectsLibrary"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/SoundEffectsLibrary"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# SoundEffectsLibrary

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/SoundEffectsLibrary.tsx -->
Searches admitted sound metadata.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/SoundEffectsLibrary.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SoundEffectsLibrary } from "@nyc-tron/ui/components/forge/audio/SoundEffectsLibrary";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/audio/SoundEffectsLibrary
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/SoundEffectsLibrary.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `sounds` | `readonly LicensedSoundEffect[]` | not recorded | yes |  |
| `status` | `'loading' \| 'ready' \| 'error'` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
| `previewingId` | `string \| null` | not recorded | yes |  |
| `onPreview` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onStopPreview` | `() => void` | not recorded | yes |  |
| `onInsert` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRetry` | `() => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/SoundEffectsLibrary.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Search sound effects", "Sound effects library"
- `accessibilityLiveRegion`: "polite"
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
