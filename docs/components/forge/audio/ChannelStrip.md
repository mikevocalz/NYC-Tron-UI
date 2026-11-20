---
name: "ChannelStrip"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/ChannelStrip"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.danger", "color.surfaceSunken", "color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/forge/audio/LevelFader", "@nyc-tron/forge/audio/LevelMeter", "@nyc-tron/forge/audio/PanControl", "@nyc-tron/forge/audio/SoloMuteButtons"]
a11yStatus: "unverified"
---

# ChannelStrip

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/ChannelStrip.tsx -->
One mixer column: routing and group line, level fader with dB readout, optional sample-peak meter, pan (balance on a bus), mute, solo and optional solo safe.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/ChannelStrip.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/forge/audio/LevelFader, @nyc-tron/forge/audio/LevelMeter, @nyc-tron/forge/audio/PanControl, @nyc-tron/forge/audio/SoloMuteButtons

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/ChannelStrip
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ChannelStrip } from "@/components/nyc-tron/ui/components/forge/audio/ChannelStrip";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ChannelStrip } from "@nyc-tron/ui/components/forge/audio/ChannelStrip";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/ChannelStrip.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `targetSize` | `number` | not recorded | no | App-owned minimum interaction target. Defaults to 44 points. |
| `labels` | `{ fader?: LevelFaderProps["labels"]; pan?: PanControlProps["labels"]; toggles?: SoloMuteButtonsProps["labels"]; }` | not recorded | no |  |
| `channel` | `MixerChannel` | not recorded | yes |  |
| `audibility` | `Audibility` | `from `channel.muted`` | no | From {@linkcode audibility} across the whole console. |
| `onGainCommit` | `(gain: number) => void \| Promise<unknown>` | not recorded | yes |  |
| `onPanCommit` | `(pan: number) => void \| Promise<unknown>` | not recorded | yes |  |
| `onMutedCommit` | `(muted: boolean) => void \| Promise<unknown>` | not recorded | yes |  |
| `onSoloCommit` | `(solo: boolean) => void \| Promise<unknown>` | not recorded | yes |  |
| `onSoloSafeCommit` | `(safe: boolean) => void \| Promise<unknown>` | not recorded | no | When given, the strip draws a solo-safe toggle. |
| `onGainChange` | `(gain: number) => void` | not recorded | no | Live previews; never persist these. |
| `onPanChange` | `(pan: number) => void` | not recorded | no |  |
| `meter` | `ChannelMeter` | not recorded | no | Level meter beside the fader. Omit it and no meter is drawn; the strip never shows a placeholder level. |
| `outputName` | `string` | not recorded | no | Name of the bus `channel.output` points at, shown as `"to <name>"`. {@linkcode MixingConsole} resolves it from the channel list. |
| `routingLines` | `number` | `0` | no | Lines of routing text (bus tag, group, output) to reserve above the fader, so faders line up across strips with and without routing. {@linkcode MixingConsole} passes the console-wide maximum. |
| `range` | `FaderRange` | `FADER_RANGES.UNITY` | no | Fader window. The Cadence engine stores gain 0..1, so the default tops out at unity. |
| `faderLength` | `number` | `160` | no | Fader travel, points. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/ChannelStrip.tsx -->
- `accessibilityLabel`: set from an expression
- `role`: "group"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
