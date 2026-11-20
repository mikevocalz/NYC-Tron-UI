---
name: "RecordingTrack"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/RecordingTrack"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.danger", "color.surfaceRaised", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/forge/WaveformLane", "@nyc-tron/forge/audio/LevelMeter"]
a11yStatus: "unverified"
---

# RecordingTrack

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/RecordingTrack.tsx -->
Controlled recording lane: status, elapsed time, one primary action, an input meter while recording and the measured waveform.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/RecordingTrack.tsx -->
- Package: @nyc-tron/ui
- Import: `import { RecordingTrack } from "@nyc-tron/ui/components/forge/audio/RecordingTrack";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/forge/WaveformLane, @nyc-tron/forge/audio/LevelMeter

```sh
npx shadcn@latest add @nyc-tron/forge/audio/RecordingTrack
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/RecordingTrack.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `state` | `RecordingViewState` | not recorded | yes | Recorder phase, mapped by the app from its own controller. |
| `peaks` | `readonly WaveformPeak[]` | not recorded | yes | Measured peaks: live history while recording, the saved take afterwards. |
| `level` | `number` | not recorded | no | Current linear input peak in [0, 1]. The meter shows only while recording. |
| `peakHold` | `number` | not recorded | no | Held input peak in [0, 1]. |
| `title` | `string` | not recorded | no | Track name shown above the status, e.g. "Vocals". |
| `onStart` | `() => void` | not recorded | yes |  |
| `onStop` | `() => void` | not recorded | yes |  |
| `onSaveInterrupted` | `() => void` | `onStop` | no | Save an interrupted take. |
| `onRetry` | `() => void` | `onStart` | no | Retry after an error, missing device or denied permission. |
| `onOpenSettings` | `() => void` | not recorded | no | Open system settings after a permission denial. Hides "Ask again" when set. |
| `onSeekNormalized` | `(position: number) => void` | not recorded | no | Seek inside a saved take; makes the lane adjustable. |
| `position` | `number` | not recorded | no | Playhead in [0, 1] for a saved take. |
| `disabled` | `boolean` | not recorded | no | Blocks starting, retrying and opening Settings. "Stop and save" and "Save what was recorded" stay enabled, so a take can never be trapped recording. |
| `columns` | `number` | `96` | no |  |
| `height` | `number` | `72` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/RecordingTrack.tsx -->
- `accessibilityLabel`: "Elapsed "
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "header"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
