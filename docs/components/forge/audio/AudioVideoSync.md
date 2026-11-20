---
name: "AudioVideoSync"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/AudioVideoSync"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# AudioVideoSync

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/AudioVideoSync.tsx -->
Actual presentation telemetry against the audio master clock, without a second UI timer.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/AudioVideoSync.tsx -->
- Package: @nyc-tron/ui
- Import: `import { AudioVideoSync } from "@nyc-tron/ui/forge/audio/AudioVideoSync";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/audio/AudioVideoSync
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/AudioVideoSync.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `surface` | `ReactNode` | not recorded | yes |  |
| `aspectRatio` | `number` | not recorded | yes |  |
| `sampleRate` | `number` | not recorded | yes |  |
| `audioSample` | `number` | not recorded | yes |  |
| `presentedFrame` | `number \| null` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `pictureOffsetSamples` | `number` | not recorded | yes |  |
| `toleranceSamples` | `number` | not recorded | yes |  |
| `playing` | `boolean` | not recorded | yes |  |
| `lockStatus` | `'unlocked' \| 'locking' \| 'locked' \| 'error'` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
| `onLock` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onUnlock` | `() => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/AudioVideoSync.tsx -->
- `accessibilityLabel`: "Audio picture synchronization"
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
