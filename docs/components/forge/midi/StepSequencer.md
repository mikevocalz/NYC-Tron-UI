---
name: "StepSequencer"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/midi/StepSequencer"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# StepSequencer

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/midi/StepSequencer.tsx -->
Controlled beat grid over one clip's notes.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/midi/StepSequencer.tsx -->
- Package: @nyc-tron/ui
- Import: `import { StepSequencer } from "@nyc-tron/ui/components/forge/midi/StepSequencer";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/midi/StepSequencer
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/midi/StepSequencer.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `notes` | `readonly MidiNote[]` | not recorded | yes | Committed notes of the clip the grid edits. |
| `lanes` | `readonly StepLane[]` | not recorded | yes | One row per instrument, top to bottom. |
| `clipTicks` | `number` | not recorded | yes | Clip length, ticks. `steps * stepTicks` must fit. |
| `steps` | `number` | `16` | no |  |
| `stepTicks` | `number` | `240 (a sixteenth at 960 ppq)` | no | Ticks per step. |
| `stepsPerBeat` | `number` | `4` | no | Steps per beat group, for shading. |
| `velocity` | `number` | `96` | no | Velocity of a new step. |
| `accentVelocity` | `number` | `127` | no | Velocity of an accented step; a step at or above it shows as accented. |
| `currentStep` | `number` | not recorded | no | Step under the playhead while playing. |
| `onStepAdd` | `(pitch: number, startTicks: number, lengthTicks: number, velocity: number) => void \| Promise<unknown>` | not recorded | yes | Turn an empty step on. |
| `onStepRemove` | `(noteIndex: number) => void \| Promise<unknown>` | not recorded | yes | Turn a step off. `noteIndex` is the engine's note index. |
| `onStepVelocity` | `(noteIndex: number, velocity: number) => void \| Promise<unknown>` | not recorded | yes | Accent or un-accent a step (long press, the A key, or the screen-reader action). |
| `disabled` | `boolean` | `false` | no |  |
| `label` | `string` | `"Step sequencer"` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/midi/StepSequencer.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "togglebutton"
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
