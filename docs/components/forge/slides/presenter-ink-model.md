---
name: "PresenterInkModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/slides/presenter-ink-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PresenterInkModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/presenter-ink-model.ts -->
Pure rules for `PresenterInkOverlay` and `PresenterInkStrip` (J-14): tools, keyboard shortcuts, normalized stroke geometry, eraser hit tests and the laser trail.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/presenter-ink-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { ERASER_RADIUS, HIGHLIGHTER_OPACITY, HIGHLIGHTER_WIDTH_FACTOR, LASER_TRAIL_MAX, LASER_TRAIL_MS, MIN_POINT_SPACING, PRESENTER_INK_SHORTCUTS, PRESENTER_INK_TOOLS } from "@nyc-tron/ui/forge/slides/presenter-ink-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/slides/presenter-ink-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/presenter-ink-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ERASER_RADIUS` | const | `const ERASER_RADIUS = 12;` |
| `HIGHLIGHTER_OPACITY` | const | `const HIGHLIGHTER_OPACITY = 0.4;` |
| `HIGHLIGHTER_WIDTH_FACTOR` | const | `const HIGHLIGHTER_WIDTH_FACTOR = 4.5;` |
| `InkViewSize` | interface | `interface InkViewSize { readonly width: number; readonly height: number; }` |
| `LASER_TRAIL_MAX` | const | `const LASER_TRAIL_MAX = 24;` |
| `LASER_TRAIL_MS` | const | `const LASER_TRAIL_MS = 600;` |
| `LaserSample` | interface | `interface LaserSample extends PresenterInkPoint { readonly t: number; }` |
| `MIN_POINT_SPACING` | const | `const MIN_POINT_SPACING = 1.5;` |
| `PRESENTER_INK_SHORTCUTS` | const | `const PRESENTER_INK_SHORTCUTS: { readonly laser: "L"; readonly pen: "P"; readonly highlighter: "H"; readonly eraser: "E"; };` |
| `PRESENTER_INK_TOOLS` | const | `const PRESENTER_INK_TOOLS: readonly [ "laser", "pen", "highlighter", "eraser" ];` |
| `PRESENTER_INK_TOOL_LABELS` | const | `const PRESENTER_INK_TOOL_LABELS: { readonly laser: "Laser"; readonly pen: "Pen"; readonly highlighter: "Highlighter"; readonly eraser: "Eraser"; };` |
| `PRESENTER_REFERENCE_WIDTH` | const | `const PRESENTER_REFERENCE_WIDTH = 960;` |
| `PresenterInkCommand` | type | `type PresenterInkCommand = Readonly<{ type: "tool"; tool: PresenterInkTool; }> \| Readonly<{ type: "exit"; }> \| Readonly<{ type: "remove-last"; }>;` |
| `PresenterInkKeyEvent` | interface | `interface PresenterInkKeyEvent extends KeyEventLike { readonly metaKey?: boolean; readonly ctrlKey?: boolean; readonly shiftKey?: boolean; readonly altKey?: ...` |
| `PresenterInkMode` | type | `type PresenterInkMode = PresenterInkTool \| "off";` |
| `PresenterInkPoint` | interface | `interface PresenterInkPoint { readonly x: number; readonly y: number; readonly pressure?: number; }` |
| `PresenterInkStroke` | interface | `interface PresenterInkStroke { readonly id: string; readonly tool: PresenterStrokeTool; readonly color: string; readonly size: InkSize; readonly points: read...` |
| `PresenterInkTool` | type | `type PresenterInkTool = "laser" \| "pen" \| "highlighter" \| "eraser";` |
| `PresenterStrokeTool` | type | `type PresenterStrokeTool = "pen" \| "highlighter";` |
| `StrokeSegment` | interface | `interface StrokeSegment { readonly left: number; readonly top: number; readonly length: number; readonly thickness: number; readonly angle: number; }` |
| `appendPoint` | function | `function appendPoint(points: readonly PresenterInkPoint[], next: PresenterInkPoint, view: InkViewSize): readonly PresenterInkPoint[];` |
| `clearDisabledReason` | function | `function clearDisabledReason(strokes: readonly PresenterInkStroke[]): string \| undefined;` |
| `createStrokeIdFactory` | function | `function createStrokeIdFactory(now?: () => number): () => string;` |
| `laserTrailOpacity` | function | `function laserTrailOpacity(age: number, duration?: number): number;` |
| `normalizePoint` | function | `function normalizePoint(x: number, y: number, view: InkViewSize, pressure?: number): PresenterInkPoint;` |
| `presenterModeStatus` | function | `function presenterModeStatus(mode: PresenterInkMode): string;` |
| `pressureScale` | function | `function pressureScale(pressure: number \| undefined): number;` |
| `resolvePresenterInkKey` | function | `function resolvePresenterInkKey(event: PresenterInkKeyEvent): PresenterInkCommand \| undefined;` |
| `strokeHit` | function | `function strokeHit(stroke: PresenterInkStroke, point: PresenterInkPoint, view: InkViewSize, radius?: number): boolean;` |
| `strokeSegments` | function | `function strokeSegments(stroke: Pick<PresenterInkStroke, "points" \| "size" \| "tool">, view: InkViewSize): StrokeSegment[];` |
| `strokeWidth` | function | `function strokeWidth(size: InkSize, tool: PresenterStrokeTool, viewWidth: number): number;` |
| `strokesUnderEraser` | function | `function strokesUnderEraser(strokes: readonly PresenterInkStroke[], point: PresenterInkPoint, view: InkViewSize, already?: ReadonlySet<string>): string[];` |
| `trimLaserTrail` | function | `function trimLaserTrail(samples: readonly LaserSample[], now: number, duration?: number, max?: number): LaserSample[];` |
| `validatePresenterStrokes` | function | `function validatePresenterStrokes(strokes: readonly PresenterInkStroke[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/presenter-ink-model.ts -->
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
