---
name: "ViewportModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/viewport"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ViewportModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/viewport.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/viewport.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/viewport
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { clampViewport, fitRange, followPlayhead, frameToX, minimapScroll, minimapWindow, scrollBy, visibleFrames } from "@/components/nyc-tron/ui/components/forge/timeline/viewport";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { clampViewport, fitRange, followPlayhead, frameToX, minimapScroll, minimapWindow, scrollBy, visibleFrames } from "@nyc-tron/ui/components/forge/timeline/viewport";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/viewport.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FrameRange` | interface | `interface FrameRange { readonly start: number; readonly end: number; }` |
| `TimelineViewport` | interface | `interface TimelineViewport { readonly startFrame: number; readonly pxPerFrame: number; readonly widthPx: number; }` |
| `clampViewport` | function | `function clampViewport(v: TimelineViewport, durationFrames: number): TimelineViewport;` |
| `fitRange` | function | `function fitRange(v: TimelineViewport, range: FrameRange, durationFrames: number, rate: FrameRate, paddingPx?: number): TimelineViewport;` |
| `followPlayhead` | function | `function followPlayhead(v: TimelineViewport, frame: number, durationFrames: number, mode?: "page" \| "center"): TimelineViewport;` |
| `frameToX` | function | `function frameToX(v: TimelineViewport, frame: number): number;` |
| `minimapScroll` | function | `function minimapScroll(v: TimelineViewport, leftPx: number, durationFrames: number, widthPx: number): TimelineViewport;` |
| `minimapWindow` | function | `function minimapWindow(v: TimelineViewport, durationFrames: number, widthPx: number): { left: number; width: number; };` |
| `scrollBy` | function | `function scrollBy(v: TimelineViewport, dx: number, durationFrames: number): TimelineViewport;` |
| `visibleFrames` | const | `const visibleFrames: (v: TimelineViewport) => number;` |
| `visibleRange` | function | `function visibleRange(v: TimelineViewport): FrameRange;` |
| `xToFrame` | function | `function xToFrame(v: TimelineViewport, x: number): number;` |
| `zoomAt` | function | `function zoomAt(v: TimelineViewport, anchorX: number, factor: number, durationFrames: number, rate: FrameRate): TimelineViewport;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/viewport.ts -->
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
