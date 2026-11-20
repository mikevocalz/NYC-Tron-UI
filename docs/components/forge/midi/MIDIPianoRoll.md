---
name: "MIDIPianoRoll"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/midi/MIDIPianoRoll"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/midi/MidiChannelPicker"]
a11yStatus: "unverified"
---

# MIDIPianoRoll

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/midi/MIDIPianoRoll.tsx -->
Controlled MIDI note editor for one clip.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/midi/MIDIPianoRoll.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/midi/MidiChannelPicker

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/midi/MIDIPianoRoll
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { MIDIPianoRoll } from "@/components/nyc-tron/ui/components/forge/midi/MIDIPianoRoll";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { MIDIPianoRoll } from "@nyc-tron/ui/components/forge/midi/MIDIPianoRoll";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/midi/MIDIPianoRoll.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `notes` | `readonly MidiNote[]` | not recorded | yes | Committed notes of one clip. A note's index is its engine identity. |
| `clipTicks` | `number` | not recorded | yes | Clip length, ticks. |
| `ppq` | `number` | `960` | no | Ticks per quarter note. |
| `beatsPerBar` | `number` | `4` | no | Quarter-note beats per bar for legacy callers. Ignored by timeSignature. |
| `timeSignature` | `readonly [ number, number ]` | not recorded | no | Musical numerator/denominator. Overrides beatsPerBar without rounding measure boundaries. |
| `lowestPitch` | `number` | `48 (C3)` | no |  |
| `highestPitch` | `number` | `72 (C5)` | no |  |
| `snapTicks` | `number` | `ppq / 4 (a sixteenth)` | no | Grid quantum for drags, keys and new notes. |
| `pixelsPerTick` | `number` | `0.1 (96 pt per beat at 960 ppq)` | no | Horizontal zoom, points per tick. |
| `rowHeight` | `number` | `44` | no | Pitch row height; 44 keeps rows at the touch-target floor. |
| `height` | `number` | `352` | no | Visible height before the rows scroll. |
| `selectedIndex` | `number` | not recorded | no | Highlighted note. |
| `onSelect` | `(index: number) => void` | not recorded | no |  |
| `onNoteMove` | `(index: number, startTicks: number, pitch: number) => void \| Promise<unknown>` | not recorded | yes | Once per finished body drag or arrow-key move: new start and pitch together. |
| `onNoteResize` | `(index: number, lengthTicks: number) => void \| Promise<unknown>` | not recorded | yes | Once per finished end-edge drag or Shift+arrow. |
| `onNoteAdd` | `(startTicks: number, lengthTicks: number, pitch: number) => void \| Promise<unknown>` | not recorded | no | Tap on an empty cell. Leave out to make the grid read-only for adding. |
| `onNoteRemove` | `(index: number) => void \| Promise<unknown>` | not recorded | no | Delete/Backspace on a focused note, or the screen-reader delete action. |
| `onAudition` | `(pitch: number) => void` | not recorded | no | Press on a key in the keyboard column. The UI plays nothing itself; the app routes this to its synth. Leave out and the keys are labels only. |
| `onScrollX` | `(x: number) => void` | not recorded | no | Horizontal scroll offset of the grid, points, so a velocity lane or ruler can follow it (see `MIDIVelocityLane.scrollX`). |
| `scrollX` | `number` | not recorded | no | Nonnegative requested horizontal offset in layout points, clamped after measuring the viewport. |
| `onNoteChannel` | `(index: number, channel: number) => void \| Promise<unknown>` | not recorded | no | Set the selected note's MIDI channel (0..15), once per press or key; maps onto the Cadence `setNoteChannel` op. Giving it shows a channel stepper above the grid while a note is selected. A note without `channel` shows as channel 1 (zero-based 0), which is where the engine plays it. |
| `disabled` | `boolean` | `false` | no |  |
| `label` | `string` | `"Piano roll"` | no | Accessible name. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/midi/MIDIPianoRoll.tsx -->
- `accessibilityLabel`: "Play "
- `accessibilityRole`: "button"
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
