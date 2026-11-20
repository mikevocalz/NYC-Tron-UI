---
name: "TimeModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/time"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# TimeModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/time.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/time.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/time
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { SAMPLE_RATE_RANGE, assertSampleRate, formatSampleClock, formatTime, fps, framesToSamples, framesToSeconds, parseTime } from "@/components/nyc-tron/ui/components/forge/timeline/time";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { SAMPLE_RATE_RANGE, assertSampleRate, formatSampleClock, formatTime, fps, framesToSamples, framesToSeconds, parseTime } from "@nyc-tron/ui/components/forge/timeline/time";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/time.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FrameRate` | interface | `interface FrameRate { readonly numerator: number; readonly denominator: number; }` |
| `SAMPLE_RATE_RANGE` | const | `const SAMPLE_RATE_RANGE: { readonly min: 8000; readonly max: 768000; };` |
| `TimeFormat` | type | `type TimeFormat = "timecode" \| "frames" \| "seconds" \| "samples";` |
| `assertSampleRate` | function | `function assertSampleRate(rate: number): void;` |
| `formatSampleClock` | function | `function formatSampleClock(sample: number, sampleRate: number): string;` |
| `formatTime` | function | `function formatTime(frame: number, rate: FrameRate, format: TimeFormat, opts?: { dropFrame?: boolean; sampleRate?: number; }): string;` |
| `fps` | const | `const fps: (rate: FrameRate) => number;` |
| `framesToSamples` | function | `function framesToSamples(frame: number, rate: FrameRate, sampleRate: number): number;` |
| `framesToSeconds` | function | `function framesToSeconds(frame: number, rate: FrameRate): number;` |
| `parseTime` | function | `function parseTime(text: string, rate: FrameRate, format: TimeFormat, opts?: { dropFrame?: boolean; sampleRate?: number; }): number \| undefined;` |
| `parseTimecode` | function | `function parseTimecode(text: string, rate: FrameRate, opts?: { dropFrame?: boolean; }): number \| undefined;` |
| `positionToSeconds` | function | `function positionToSeconds(position: number, rate: FrameRate): number;` |
| `samplesToFrames` | function | `function samplesToFrames(sample: number, rate: FrameRate, sampleRate: number): number;` |
| `secondsToFrame` | function | `function secondsToFrame(seconds: number, rate: FrameRate): number;` |
| `supportsDropFrame` | const | `const supportsDropFrame: (rate: FrameRate) => boolean;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/time.ts -->
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
