---
name: "TempoModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/tempo"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# TempoModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/tempo.ts -->
Tempo, tap-tempo and time-signature math for {@linkcode TempoAndMetronome}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/tempo.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/tempo
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { MAX_BPM, MAX_NUMERATOR, MIN_BPM, TAP_RESET_MS, TAP_WINDOW, TIME_SIG_DENOMINATORS, addTap, assertBpm } from "@/components/nyc-tron/ui/components/forge/audio/tempo";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { MAX_BPM, MAX_NUMERATOR, MIN_BPM, TAP_RESET_MS, TAP_WINDOW, TIME_SIG_DENOMINATORS, addTap, assertBpm } from "@nyc-tron/ui/components/forge/audio/tempo";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/tempo.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MAX_BPM` | const | `const MAX_BPM = 400;` |
| `MAX_NUMERATOR` | const | `const MAX_NUMERATOR = 32;` |
| `MIN_BPM` | const | `const MIN_BPM = 20;` |
| `TAP_RESET_MS` | const | `const TAP_RESET_MS = 2000;` |
| `TAP_WINDOW` | const | `const TAP_WINDOW = 8;` |
| `TIME_SIG_DENOMINATORS` | const | `const TIME_SIG_DENOMINATORS: readonly [ 2, 4, 8, 16 ];` |
| `TimeSignature` | type | `type TimeSignature = readonly [ number, number ];` |
| `addTap` | function | `function addTap(taps: readonly number[], atMs: number): number[];` |
| `assertBpm` | function | `function assertBpm(bpm: number): void;` |
| `beatInBar` | function | `function beatInBar(ticks: number, ppq: number, [n, d]: TimeSignature): number;` |
| `clampBpm` | function | `function clampBpm(bpm: number): number;` |
| `formatTimeSignature` | function | `function formatTimeSignature([n, d]: TimeSignature): string;` |
| `isValidTimeSignature` | function | `function isValidTimeSignature([n, d]: TimeSignature): boolean;` |
| `tapTempo` | function | `function tapTempo(taps: readonly number[]): number \| undefined;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/tempo.ts -->
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
