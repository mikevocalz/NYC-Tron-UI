---
name: "AudioClipWaveform"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/AudioClipWaveform"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/WaveformLane"]
a11yStatus: "unverified"
---

# AudioClipWaveform

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/AudioClipWaveform.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/AudioClipWaveform.tsx -->
- Package: @nyc-tron/ui
- Import: `import { AudioClipWaveform } from "@nyc-tron/ui/components/forge/timeline/AudioClipWaveform";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/WaveformLane

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/AudioClipWaveform
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/AudioClipWaveform.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `sourceId` | `string` | not recorded | yes |  |
| `sourceRevision` | `number` | not recorded | yes |  |
| `range` | `WaveformRange` | not recorded | yes |  |
| `columns` | `number` | not recorded | no |  |
| `height` | `number` | not recorded | no |  |
| `position` | `number` | not recorded | no |  |
| `loadPeaks` | `(range: WaveformRange, columns: number, signal: AbortSignal) => Promise<readonly WaveformPeak[]>` | not recorded | yes | Real decoded min/max peaks for the requested source interval. |
| `onSeek` | `(sourcePosition: number, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | no |  |
| `cache` | `ReturnType<typeof createWaveformCache>` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/AudioClipWaveform.tsx -->
- `accessibilityLabel`: "Audio clip waveform"
- `accessibilityRole`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
