---
name: "StereoMultichannelWaveform"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/StereoMultichannelWaveform"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/SegmentedControl", "@nyc-tron/forge/WaveformLane"]
a11yStatus: "unverified"
---

# StereoMultichannelWaveform

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/StereoMultichannelWaveform.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/StereoMultichannelWaveform.tsx -->
- Package: @nyc-tron/ui
- Import: `import { StereoMultichannelWaveform } from "@nyc-tron/ui/components/forge/audio/StereoMultichannelWaveform";`
- Peers: @nyc-tron/core, react, react-native, react-native-gesture-handler
- Requires: @nyc-tron/SegmentedControl, @nyc-tron/forge/WaveformLane

```sh
npx shadcn@latest add @nyc-tron/forge/audio/StereoMultichannelWaveform
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/StereoMultichannelWaveform.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `channels` | `readonly AudioWaveformChannel[]` | not recorded | yes |  |
| `mode` | `'peak' \| 'rms'` | not recorded | yes |  |
| `onModeChange` | `(mode: 'peak' \| 'rms') => void` | not recorded | yes |  |
| `position` | `number` | not recorded | no |  |
| `onSeek` | `(position: number) => void` | not recorded | no |  |
| `heightPerChannel` | `number` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/StereoMultichannelWaveform.tsx -->
- `accessibilityLabel`: "Channel waveforms"
- `aria-label`: "Waveform measurement"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
