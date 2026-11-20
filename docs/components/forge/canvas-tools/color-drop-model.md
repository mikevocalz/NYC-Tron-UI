---
name: "ColorDropModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/canvas-tools/color-drop-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ColorDropModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas-tools/color-drop-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas-tools/color-drop-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { DROP_DOT_SIZE, DROP_KEY_STEP, DROP_SLOP, MAX_FILL_TOLERANCE, buildFill, clampToTarget, classifyPress, describeDropTarget } from "@nyc-tron/ui/forge/canvas-tools/color-drop-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/canvas-tools/color-drop-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas-tools/color-drop-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `DROP_DOT_SIZE` | const | `const DROP_DOT_SIZE = 56;` |
| `DROP_KEY_STEP` | const | `const DROP_KEY_STEP = 8;` |
| `DROP_SLOP` | const | `const DROP_SLOP = 8;` |
| `DropPoint` | interface | `interface DropPoint { readonly x: number; readonly y: number; }` |
| `DropPress` | type | `type DropPress = "tap" \| "drag";` |
| `DropRect` | interface | `interface DropRect extends DropPoint { readonly width: number; readonly height: number; }` |
| `FillRequest` | interface | `interface FillRequest { readonly x: number; readonly y: number; readonly color: string; readonly tolerance: number; readonly contiguous: boolean; }` |
| `MAX_FILL_TOLERANCE` | const | `const MAX_FILL_TOLERANCE = 255;` |
| `buildFill` | function | `function buildFill(at: DropPoint, color: string, tolerance: number, contiguous: boolean): FillRequest;` |
| `clampToTarget` | function | `function clampToTarget(p: DropPoint, width: number, height: number): DropPoint;` |
| `classifyPress` | function | `function classifyPress(dx: number, dy: number, slop?: number): DropPress;` |
| `describeDropTarget` | function | `function describeDropTarget(at: DropPoint \| undefined, colorLabel: string, tolerance: number): string;` |
| `dropKeyMove` | function | `function dropKeyMove(key: string \| undefined, alt?: boolean): DropPoint \| undefined;` |
| `dropToDocument` | function | `function dropToDocument(p: DropPoint, r: DropRect, docWidth: number, docHeight: number): DropPoint \| undefined;` |
| `isInside` | function | `function isInside(p: DropPoint, r: DropRect): boolean;` |
| `thresholdLabel` | function | `function thresholdLabel(tolerance: number): string;` |
| `validateDrop` | function | `function validateDrop(p: { color: string; tolerance: number; width: number; height: number; documentWidth: number; documentHeight: number; }): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas-tools/color-drop-model.ts -->
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
