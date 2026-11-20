---
name: "MIDIVelocityLane"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/midi/MIDIVelocityLane"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "opacity.0_45", "radius.1", "radius.2", "radius.5", "radius.card", "radius.control", "space.0.5", "space.1.5", "space.2", "space.3", "space.3.5"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/midi/MIDIPianoRoll", "@nyc-tron/forge/midi/MidiChannelPicker"]
a11yStatus: "declared"
---

# MIDIVelocityLane

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/midi/MIDIVelocityLane.tsx -->
Controlled per-note velocity bars under a {@linkcode MIDIPianoRoll}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/midi/MIDIVelocityLane.tsx -->
- Package: @nyc-tron/ui
- Import: `import { MIDIVelocityLane } from "@nyc-tron/ui/forge/midi/MIDIVelocityLane";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/midi/MIDIPianoRoll, @nyc-tron/forge/midi/MidiChannelPicker

```sh
npx shadcn@latest add @nyc-tron/forge/midi/MIDIVelocityLane
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/midi/MIDIVelocityLane.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `notes` | `readonly MidiNote[]` | not recorded | yes | The same notes, in the same order, as the piano roll above. |
| `clipTicks` | `number` | not recorded | yes |  |
| `pixelsPerTick` | `number` | `0.1` | no | Must match the piano roll. |
| `height` | `number` | `96` | no | Height of the bar area, points (the tool row adds to it). |
| `inset` | `number` | `0` | no | Leading space so bars line up with the roll's grid, e.g. `PIANO_ROLL_KEY_COLUMN`. |
| `scrollX` | `number` | not recorded | no | Follow another view's horizontal scroll (the roll's `onScrollX`). When omitted the lane scrolls on its own. |
| `step` | `number` | `4` | no | Arrow-key and screen-reader step. |
| `selectedIndex` | `number` | not recorded | no |  |
| `onSelect` | `(index: number) => void` | not recorded | no |  |
| `onVelocityCommit` | `(index: number, velocity: number) => void \| Promise<unknown>` | not recorded | yes | Once per finished bar drag or step. |
| `onVelocitiesCommit` | `(changes: readonly VelocityChange[]) => void \| Promise<unknown>` | not recorded | no | Batch edit: once per finished line drawing or ramp, with the changes sorted by note index, no duplicate index, never empty. Maps onto the Cadence `setVelocities` op, so one gesture is one undo step. Giving it shows the Bars / Line tool row; leaving it out keeps the lane bar-only. A rejected promise leaves the committed velocities as they are. |
| `tool` | `VelocityTool` | not recorded | no | Current tool. Leave out to let the lane keep its own (starting at `"bars"`). |
| `onToolChange` | `(tool: VelocityTool) => void` | not recorded | no | Called when the person picks the other tool. |
| `disabled` | `boolean` | `false` | no |  |
| `label` | `string` | `"Velocity"` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/midi/MIDIVelocityLane.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Ramp", "Velocity tool"
- `accessibilityRole`: "adjustable", "button", "radio", "radiogroup"
- `accessibilityState`: set from an expression
- `accessibilityValue`: set from an expression
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
