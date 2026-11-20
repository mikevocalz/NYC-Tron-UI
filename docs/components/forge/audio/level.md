---
name: "LevelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/level"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# LevelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/level.ts -->
Level math for `LevelFader`.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/level.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/level
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { FADER_RANGES, assertFaderRange, clampGain, dbToGain, dragToGain, formatDb, gainToDb, gainToPosition } from "@/components/nyc-tron/ui/components/forge/audio/level";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { FADER_RANGES, assertFaderRange, clampGain, dbToGain, dragToGain, formatDb, gainToDb, gainToPosition } from "@nyc-tron/ui/components/forge/audio/level";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/level.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FADER_RANGES` | const | `const FADER_RANGES: { readonly UNITY: { readonly minDb: -60; readonly maxDb: 0; }; readonly CHANNEL: { readonly minDb: -60; readonly maxDb: 6; }; readonly BU...` |
| `FaderRange` | interface | `interface FaderRange { readonly minDb: number; readonly maxDb: number; }` |
| `assertFaderRange` | function | `function assertFaderRange(range: FaderRange): void;` |
| `clampGain` | function | `function clampGain(gain: number, range: FaderRange): number;` |
| `dbToGain` | function | `function dbToGain(db: number): number;` |
| `dragToGain` | function | `function dragToGain(startPosition: number, deltaPx: number, trackPx: number, range: FaderRange): number;` |
| `formatDb` | function | `function formatDb(gain: number): string;` |
| `gainToDb` | function | `function gainToDb(gain: number): number;` |
| `gainToPosition` | function | `function gainToPosition(gain: number, range: FaderRange): number;` |
| `maxGain` | function | `function maxGain(range: FaderRange): number;` |
| `positionToGain` | function | `function positionToGain(position: number, range: FaderRange): number;` |
| `stepGain` | function | `function stepGain(gain: number, direction: -1 \| 1, stepDb: number, range: FaderRange): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/level.ts -->
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
