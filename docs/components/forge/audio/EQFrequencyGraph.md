---
name: "EQFrequencyGraph"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/EQFrequencyGraph"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# EQFrequencyGraph

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/EQFrequencyGraph.tsx -->
Controlled parametric EQ graph.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/EQFrequencyGraph.tsx -->
- Package: @nyc-tron/ui
- Import: `import { EQFrequencyGraph } from "@nyc-tron/ui/components/forge/audio/EQFrequencyGraph";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/forge/audio/EQFrequencyGraph
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/EQFrequencyGraph.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `bands` | `readonly EqBand[]` | not recorded | yes | Committed bands from the engine, at most 8, in band order. |
| `response` | `readonly EqResponsePoint[]` | not recorded | yes | The engine's combined magnitude response (`eqResponse`), log-spaced 20 Hz..20 kHz. Drawn as given. Pass a new array whenever the engine recomputes it: the graph dims the curve from the start of a drag until a different array arrives. Empty draws the grid and handles with a "Response unavailable" note. |
| `onBandCommit` | `(index: number, edit: EqBandEdit) => void \| Promise<unknown>` | not recorded | yes | Once per finished handle drag or key press, with the band's new frequency and gain. Not called when nothing changed. Q is edited through the separate onQCommit capability. A rejected promise keeps the committed band on screen. |
| `onBandChange` | `(index: number, edit: EqBandEdit) => void` | not recorded | no | Live values while a handle is dragged, and the committed values again on cancel. Never persisted. |
| `selectedIndex` | `number` | not recorded | no | The band shown in the readout row and drawn as selected. |
| `onSelect` | `(index: number) => void` | not recorded | no | A handle was pressed, focused or dragged, or a band chip was chosen. |
| `onQCommit` | `(index: number, q: number) => void \| Promise<unknown>` | not recorded | no | The readout's on/off toggle. Without it the toggle is hidden. |
| `onEnabledCommit` | `(index: number, enabled: boolean) => void \| Promise<unknown>` | not recorded | no |  |
| `range` | `number` | `18` | no | Half the visible dB span. |
| `height` | `number` | `200` | no | Plot height, points. |
| `disabled` | `boolean` | `false` | no |  |
| `label` | `string` | not recorded | yes | Name of the EQ, e.g. `"Vocal EQ"`; also the group's accessible name. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/EQFrequencyGraph.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Band "
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "adjustable", "radio", "radiogroup", "togglebutton"
- `accessibilityState`: set from an expression
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
