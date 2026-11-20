---
name: "VelocityLineModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/midi/velocity-line"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# VelocityLineModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/midi/velocity-line.ts -->
Batch velocity edits for {@linkcode MIDIVelocityLane}: the line tool (drag a straight line across the bars) and the keyboard ramp.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/midi/velocity-line.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/midi/velocity-line
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { describeVelocityBatch, noteLaneX, notesInTimeOrder, rampRoom, rampVelocities, velocityAtY, velocityLineChanges } from "@/components/nyc-tron/ui/components/forge/midi/velocity-line";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { describeVelocityBatch, noteLaneX, notesInTimeOrder, rampRoom, rampVelocities, velocityAtY, velocityLineChanges } from "@nyc-tron/ui/components/forge/midi/velocity-line";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/midi/velocity-line.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `LanePoint` | interface | `interface LanePoint { readonly x: number; readonly y: number; }` |
| `VelocityChange` | interface | `interface VelocityChange { readonly index: number; readonly velocity: number; }` |
| `VelocityLaneGeometry` | interface | `interface VelocityLaneGeometry { readonly pixelsPerTick: number; readonly inset: number; readonly scrollX: number; readonly height: number; }` |
| `describeVelocityBatch` | function | `function describeVelocityBatch(changes: readonly VelocityChange[]): string;` |
| `noteLaneX` | function | `function noteLaneX(note: MidiNote, g: VelocityLaneGeometry): number;` |
| `notesInTimeOrder` | function | `function notesInTimeOrder(notes: readonly MidiNote[]): number[];` |
| `rampRoom` | function | `function rampRoom(notes: readonly MidiNote[], fromIndex: number): number;` |
| `rampVelocities` | function | `function rampVelocities(notes: readonly MidiNote[], fromIndex: number, count: number, endVelocity: number): VelocityChange[];` |
| `velocityAtY` | function | `function velocityAtY(y: number, height: number): number;` |
| `velocityLineChanges` | function | `function velocityLineChanges(notes: readonly MidiNote[], geometry: VelocityLaneGeometry, start: LanePoint, end: LanePoint, reach?: number): VelocityChange[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/midi/velocity-line.ts -->
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
