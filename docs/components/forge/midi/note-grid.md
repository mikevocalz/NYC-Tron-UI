---
name: "NoteGridModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/midi/note-grid"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# NoteGridModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/midi/note-grid.ts -->
Note geometry for {@linkcode MIDIPianoRoll}, {@linkcode MIDIVelocityLane} and {@linkcode StepSequencer}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/midi/note-grid.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/midi/note-grid
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { MAX_MIDI_CHANNEL, assertGrid, assertMidiNotes, cellAt, channelLabel, clampVelocity, describeNote, dragNote } from "@/components/nyc-tron/ui/components/forge/midi/note-grid";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { MAX_MIDI_CHANNEL, assertGrid, assertMidiNotes, cellAt, channelLabel, clampVelocity, describeNote, dragNote } from "@nyc-tron/ui/components/forge/midi/note-grid";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/midi/note-grid.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MAX_MIDI_CHANNEL` | const | `const MAX_MIDI_CHANNEL = 15;` |
| `MidiGridLine` | interface | `interface MidiGridLine { readonly ticks: number; readonly bar: boolean; }` |
| `MidiNote` | interface | `interface MidiNote { readonly pitch: number; readonly velocity: number; readonly startTicks: number; readonly lengthTicks: number; readonly channel?: number; }` |
| `NoteGrid` | interface | `interface NoteGrid { readonly clipTicks: number; readonly lowestPitch: number; readonly highestPitch: number; readonly pixelsPerTick: number; readonly rowHei...` |
| `NoteKeyEdit` | type | `type NoteKeyEdit = { readonly kind: "move"; readonly startTicks: number; readonly pitch: number; } \| { readonly kind: "resize"; readonly lengthTicks: number;...` |
| `NoteRect` | interface | `interface NoteRect { readonly x: number; readonly y: number; readonly width: number; readonly height: number; }` |
| `StepCell` | type | `type StepCell = { readonly on: false; } \| { readonly on: true; readonly noteIndex: number; readonly accent: boolean; };` |
| `StepLane` | interface | `interface StepLane { readonly pitch: number; readonly name: string; }` |
| `assertGrid` | function | `function assertGrid(g: NoteGrid): void;` |
| `assertMidiNotes` | function | `function assertMidiNotes(notes: readonly MidiNote[], clipTicks: number): void;` |
| `cellAt` | function | `function cellAt(x: number, y: number, g: NoteGrid): { startTicks: number; lengthTicks: number; pitch: number; } \| undefined;` |
| `channelLabel` | function | `function channelLabel(channel: number): string;` |
| `clampVelocity` | function | `function clampVelocity(v: number): number;` |
| `describeNote` | function | `function describeNote(n: MidiNote, ppq: number, withChannel?: boolean): string;` |
| `dragNote` | function | `function dragNote(n: MidiNote, dx: number, dy: number, g: NoteGrid): { startTicks: number; pitch: number; };` |
| `dragNoteEnd` | function | `function dragNoteEnd(n: MidiNote, dx: number, g: NoteGrid): number;` |
| `dragVelocity` | function | `function dragVelocity(start: number, dy: number, laneHeight: number): number;` |
| `gridSize` | function | `function gridSize(g: NoteGrid): { width: number; height: number; };` |
| `isMidiChannel` | function | `function isMidiChannel(channel: number): boolean;` |
| `isSharp` | function | `function isSharp(pitch: number): boolean;` |
| `midiGridLines` | function | `function midiGridLines(clipTicks: number, ppq: number, beatsPerBar?: number, timeSignature?: readonly [ number, number ], limit?: number): readonly MidiGridL...` |
| `noteKeyEdit` | function | `function noteKeyEdit(n: MidiNote, key: string, shift: boolean, g: NoteGrid): NoteKeyEdit \| undefined;` |
| `noteRect` | function | `function noteRect(n: MidiNote, g: NoteGrid): NoteRect \| undefined;` |
| `pitchName` | function | `function pitchName(pitch: number): string;` |
| `stepCells` | function | `function stepCells(notes: readonly MidiNote[], lanes: readonly StepLane[], steps: number, stepTicks: number, accentVelocity: number): StepCell[][];` |
| `usesSeveralChannels` | function | `function usesSeveralChannels(notes: readonly MidiNote[]): boolean;` |
| `velocityToHeight` | function | `function velocityToHeight(velocity: number, laneHeight: number): number;` |
| `visiblePitches` | function | `function visiblePitches(g: NoteGrid): number[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/midi/note-grid.ts -->
_Not documented._
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
