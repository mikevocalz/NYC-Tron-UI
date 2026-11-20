---
name: "AudioPreview"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/AudioPreview"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.danger", "color.surfaceRaised", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/forge/WaveformLane"]
a11yStatus: "unverified"
---

# AudioPreview

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/AudioPreview.tsx -->
Controlled clip preview: status, position, play/stop and an optional waveform.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/AudioPreview.tsx -->
- Package: @nyc-tron/ui
- Import: `import { AudioPreview } from "@nyc-tron/ui/components/forge/audio/AudioPreview";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/forge/WaveformLane

```sh
npx shadcn@latest add @nyc-tron/forge/audio/AudioPreview
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/AudioPreview.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `state` | `PreviewViewState` | not recorded | yes | Player phase, mapped by the app from its own playback controller. |
| `onPlay` | `() => void` | not recorded | yes |  |
| `onStop` | `() => void` | not recorded | yes |  |
| `onRetry` | `() => void` | `onPlay` | no | Retry after an error. |
| `peaks` | `readonly WaveformPeak[]` | not recorded | no | Measured peaks of the clip; omit to hide the lane. |
| `onSeekNormalized` | `(position: number) => void` | not recorded | no | Seek while playing; makes the lane adjustable. |
| `disabled` | `boolean` | not recorded | no |  |
| `height` | `number` | `48` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/AudioPreview.tsx -->
- `accessibilityLabel`: "Clip waveform"
- `accessibilityLiveRegion`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
