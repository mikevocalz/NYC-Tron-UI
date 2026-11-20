---
name: "TakePlaylistAndComping"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/TakePlaylistAndComping"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.1.5", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/WaveformLane", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "declared"
---

# TakePlaylistAndComping

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/TakePlaylistAndComping.tsx -->
Swipe a take lane to request a comp range; host performs edits and crossfades transactionally.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/TakePlaylistAndComping.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TakePlaylistAndComping } from "@nyc-tron/ui/forge/audio/TakePlaylistAndComping";`
- Peers: react, react-native, react-native-gesture-handler
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/WaveformLane, @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/forge/audio/TakePlaylistAndComping
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/TakePlaylistAndComping.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `takes` | `readonly AudioTake[]` | not recorded | yes |  |
| `regions` | `readonly CompRegion[]` | not recorded | yes |  |
| `durationSamples` | `number` | not recorded | yes |  |
| `selection` | `{ startSample: number; endSample: number; }` | not recorded | yes |  |
| `selectedTakeId` | `string \| null` | not recorded | yes |  |
| `recording` | `boolean` | not recorded | yes |  |
| `onSelectionChange` | `(range: { startSample: number; endSample: number; }) => void` | not recorded | yes |  |
| `onSelectTake` | `(id: string) => void` | not recorded | yes |  |
| `onAudition` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onComp` | `(takeId: string, startSample: number, endSample: number, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRemoveRegion` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/TakePlaylistAndComping.tsx -->
- `accessibilityLabel`: "Take playlist and comping"
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
