---
name: "AudioClipTrimAndFade"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/AudioClipTrimAndFade"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/WaveformLane", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# AudioClipTrimAndFade

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/AudioClipTrimAndFade.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/AudioClipTrimAndFade.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/WaveformLane, @nyc-tron/forge/inputs/PrecisionScrubber

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/AudioClipTrimAndFade
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { AudioClipTrimAndFade } from "@/components/nyc-tron/ui/components/forge/audio/AudioClipTrimAndFade";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { AudioClipTrimAndFade } from "@nyc-tron/ui/components/forge/audio/AudioClipTrimAndFade";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/AudioClipTrimAndFade.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `lengthSamples` | `number` | not recorded | yes |  |
| `sampleRate` | `number` | not recorded | yes |  |
| `region` | `AudioClipRegion` | not recorded | yes |  |
| `peaks` | `WaveformLaneProps['peaks']` | not recorded | yes |  |
| `onCommit` | `(region: AudioClipRegion, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onPreview` | `(region: AudioClipRegion) => void` | not recorded | no |  |
| `overlapSamples` | `number` | not recorded | no | Report a verified neighbouring overlap before enabling crossfade. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/AudioClipTrimAndFade.tsx -->
- `accessibilityLabel`: "Audio clip trim and fades"
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
