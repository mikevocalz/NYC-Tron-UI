---
name: "MixingConsole"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/MixingConsole"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.surfaceRaised", "radius.card"]
registryDependencies: ["@nyc-tron/feedback/EmptyState", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/audio/BusAndRoutingMatrix", "@nyc-tron/forge/audio/ChannelStrip", "@nyc-tron/forge/audio/InsertEffectRack", "@nyc-tron/forge/audio/MixGroupBar"]
a11yStatus: "unverified"
---

# MixingConsole

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/MixingConsole.tsx -->
Controlled channel-strip console for tracks and buses.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/MixingConsole.tsx -->
- Package: @nyc-tron/ui
- Import: `import { MixingConsole } from "@nyc-tron/ui/components/forge/audio/MixingConsole";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/feedback/EmptyState, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/audio/BusAndRoutingMatrix, @nyc-tron/forge/audio/ChannelStrip, @nyc-tron/forge/audio/InsertEffectRack, @nyc-tron/forge/audio/MixGroupBar

```sh
npx shadcn@latest add @nyc-tron/forge/audio/MixingConsole
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/MixingConsole.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `targetSize` | `number` | not recorded | no | App-owned minimum interaction target. Defaults to 44 points. |
| `channelLabels` | `ChannelStripProps["labels"]` | not recorded | no |  |
| `groupLabels` | `MixGroupBarProps["labels"]` | not recorded | no |  |
| `emptyLabels` | `{ title?: string; description?: string; }` | not recorded | no |  |
| `channels` | `readonly MixerChannel[]` | not recorded | yes | Committed channel state from the engine, tracks and buses in strip order. |
| `insertRacks` | `Readonly<Record<string, Omit<InsertEffectRackProps, 'label' \| 'scope' \| 'revision' \| 'disabled' \| 'unstyled'>>>` | not recorded | no |  |
| `routing` | `Omit<BusAndRoutingMatrixProps, 'scope' \| 'revision' \| 'disabled' \| 'unstyled'>` | not recorded | no |  |
| `onGainCommit` | `(id: Id, gain: number) => void \| Promise<unknown>` | not recorded | yes |  |
| `onPanCommit` | `(id: Id, pan: number) => void \| Promise<unknown>` | not recorded | yes | Pan on a track, balance on a bus. |
| `onMutedCommit` | `(id: Id, muted: boolean) => void \| Promise<unknown>` | not recorded | yes |  |
| `onSoloCommit` | `(id: Id, solo: boolean) => void \| Promise<unknown>` | not recorded | yes |  |
| `onSoloSafeCommit` | `(id: Id, safe: boolean) => void \| Promise<unknown>` | not recorded | no | When given, every strip draws a solo-safe toggle. |
| `onGroupSoloCommit` | `(group: string, solo: boolean) => void \| Promise<unknown>` | not recorded | no | Group solo for every member as one engine step. With {@linkcode MixingConsoleProps.onGroupMutedCommit} and at least one grouped channel, a group bar is drawn above the strips. |
| `onGroupMutedCommit` | `(group: string, muted: boolean) => void \| Promise<unknown>` | not recorded | no | Group mute for every member as one engine step. |
| `onGainChange` | `(id: Id, gain: number) => void` | not recorded | no | Live gain preview, e.g. for an audio graph that follows the drag. |
| `onPanChange` | `(id: Id, pan: number) => void` | not recorded | no |  |
| `meters` | `Readonly<Record<string, ChannelMeter>>` | not recorded | no | Meter values keyed by `String(channel.id)`: linear sample peak from the Cadence `meter` op, after `createPeakHold`. Omit it and no meters are drawn; a channel missing from the record draws an empty meter. |
| `range` | `FaderRange` | `FADER_RANGES.UNITY` | no |  |
| `faderLength` | `number` | `160` | no |  |
| `emptyAction` | `EmptyStateExit` | not recorded | no | The way out when there are no channels, e.g. "Add track". Without it the empty state only explains what is missing. |
| `disabled` | `boolean` | `false` | no |  |
| `label` | `string` | `"Mixer"` | no | Accessible name of the console region. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/MixingConsole.tsx -->
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
