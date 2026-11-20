---
name: "LiveRecordingWaveform"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/LiveRecordingWaveform"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.text"]
registryDependencies: ["@nyc-tron/forge/audio/LevelMeter"]
a11yStatus: "unverified"
---

# LiveRecordingWaveform

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/LiveRecordingWaveform.tsx -->
A rolling view of measured capture windows.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/LiveRecordingWaveform.tsx -->
- Package: @nyc-tron/ui
- Import: `import { LiveRecordingWaveform } from "@nyc-tron/ui/components/forge/audio/LiveRecordingWaveform";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/forge/audio/LevelMeter

```sh
npx shadcn@latest add @nyc-tron/forge/audio/LiveRecordingWaveform
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/LiveRecordingWaveform.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `capturing` | `boolean` | not recorded | yes |  |
| `elapsedSamples` | `number` | not recorded | yes |  |
| `sampleRate` | `number` | not recorded | yes |  |
| `windows` | `readonly RecordingPeakWindow[]` | not recorded | yes |  |
| `windowStartMs` | `number` | not recorded | yes |  |
| `windowEndMs` | `number` | not recorded | yes |  |
| `level` | `number` | not recorded | no |  |
| `rms` | `number` | not recorded | no |  |
| `droppedWindows` | `number` | not recorded | no |  |
| `height` | `number` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/LiveRecordingWaveform.tsx -->
- `accessibilityLabel`: "Live recording waveform", "Measured recording input peak"
- `accessibilityRole`: "image"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
