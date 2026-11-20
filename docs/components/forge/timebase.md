---
name: "TimebaseModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timebase"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# TimebaseModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timebase.ts -->
Controlled frame math from Nitro Forge media-ui PR #25.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timebase.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timebase
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { FRAME_RATES, assertFrameRate, clampFrame, formatTimecode, frameToPosition, framesToSeconds, positionToFrame, secondsToFrame } from "@/components/nyc-tron/ui/components/forge/timebase";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { FRAME_RATES, assertFrameRate, clampFrame, formatTimecode, frameToPosition, framesToSeconds, positionToFrame, secondsToFrame } from "@nyc-tron/ui/components/forge/timebase";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timebase.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FRAME_RATES` | const | `const FRAME_RATES: { readonly FILM_24: { readonly numerator: 24; readonly denominator: 1; }; readonly PAL_25: { readonly numerator: 25; readonly denominator:...` |
| `FrameRate` | interface | `interface FrameRate { readonly numerator: number; readonly denominator: number; }` |
| `assertFrameRate` | function | `function assertFrameRate(r: FrameRate): void;` |
| `clampFrame` | function | `function clampFrame(frame: number, durationFrames: number): number;` |
| `formatTimecode` | function | `function formatTimecode(frame: number, rate: FrameRate, opts?: { dropFrame?: boolean; }): string;` |
| `frameToPosition` | function | `function frameToPosition(frame: number, durationFrames: number): number;` |
| `framesToSeconds` | function | `function framesToSeconds(frame: number, rate: FrameRate): number;` |
| `positionToFrame` | function | `function positionToFrame(position: number, durationFrames: number): number;` |
| `secondsToFrame` | function | `function secondsToFrame(seconds: number, rate: FrameRate): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timebase.ts -->
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
