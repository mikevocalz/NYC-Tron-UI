---
name: "SelectionModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/selection/selection-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# SelectionModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/selection/selection-model.ts -->
Engine-neutral pixel-selection contract for {@linkcode SelectionMarquee} and {@linkcode MagicSelectionControls}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/selection/selection-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/selection/selection-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { KEYBOARD_STEP, LASSO_MAX_POINTS, LASSO_MIN_SPACING, MAX_DRAWN_SEGMENTS, MAX_SELECTION_RADIUS, POLYGON_CLOSE_RADIUS, SELECTION_MODES, SELECTION_TOOLS } from "@/components/nyc-tron/ui/components/forge/selection/selection-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { KEYBOARD_STEP, LASSO_MAX_POINTS, LASSO_MIN_SPACING, MAX_DRAWN_SEGMENTS, MAX_SELECTION_RADIUS, POLYGON_CLOSE_RADIUS, SELECTION_MODES, SELECTION_TOOLS } from "@nyc-tron/ui/components/forge/selection/selection-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/selection/selection-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `BoxShape` | interface | `interface BoxShape extends DocRect { readonly kind: "rect" \| "ellipse"; }` |
| `DocPoint` | type | `type DocPoint = readonly [ number, number ];` |
| `DocRect` | interface | `interface DocRect { readonly x: number; readonly y: number; readonly w: number; readonly h: number; }` |
| `KEYBOARD_STEP` | const | `const KEYBOARD_STEP = 10;` |
| `LASSO_MAX_POINTS` | const | `const LASSO_MAX_POINTS = 2000;` |
| `LASSO_MIN_SPACING` | const | `const LASSO_MIN_SPACING = 3;` |
| `MAX_DRAWN_SEGMENTS` | const | `const MAX_DRAWN_SEGMENTS = 400;` |
| `MAX_SELECTION_RADIUS` | const | `const MAX_SELECTION_RADIUS = 250;` |
| `POLYGON_CLOSE_RADIUS` | const | `const POLYGON_CLOSE_RADIUS = 12;` |
| `PolygonShape` | interface | `interface PolygonShape { readonly kind: "polygon"; readonly points: readonly DocPoint[]; }` |
| `SELECTION_MODES` | const | `const SELECTION_MODES: readonly [ { readonly mode: "replace"; readonly label: "New"; }, { readonly mode: "add"; readonly label: "Add"; }, { readonly mode: "s...` |
| `SELECTION_TOOLS` | const | `const SELECTION_TOOLS: readonly [ { readonly tool: "rect"; readonly label: "Rectangle"; }, { readonly tool: "ellipse"; readonly label: "Ellipse"; }, { readon...` |
| `SELECTION_TOUCH_TARGET` | const | `const SELECTION_TOUCH_TARGET = 44;` |
| `Segment` | interface | `interface Segment { readonly x: number; readonly y: number; readonly length: number; readonly angle: number; }` |
| `SelectRegionRequest` | interface | `interface SelectRegionRequest { readonly shape: SelectionShape; readonly mode: SelectionMode; readonly feather?: number; }` |
| `SelectionKey` | interface | `interface SelectionKey { readonly key?: string; readonly shiftKey?: boolean; readonly altKey?: boolean; readonly ctrlKey?: boolean; readonly metaKey?: boolea...` |
| `SelectionKeyCommand` | type | `type SelectionKeyCommand = { readonly type: "selectAll"; } \| { readonly type: "deselect"; } \| { readonly type: "invert"; } \| { readonly type: "start"; } \| { ...` |
| `SelectionMode` | type | `type SelectionMode = "replace" \| "add" \| "subtract" \| "intersect";` |
| `SelectionModifiers` | interface | `interface SelectionModifiers { readonly shift?: boolean; readonly alt?: boolean; }` |
| `SelectionShape` | type | `type SelectionShape = BoxShape \| PolygonShape;` |
| `SelectionTool` | type | `type SelectionTool = "rect" \| "ellipse" \| "polygon" \| "lasso";` |
| `ViewMapping` | interface | `interface ViewMapping { readonly viewWidth: number; readonly viewHeight: number; readonly docWidth: number; readonly docHeight: number; }` |
| `appendLassoPoint` | function | `function appendLassoPoint(points: readonly DocPoint[], p: DocPoint, minSpacing?: number): readonly DocPoint[];` |
| `boxFromCorners` | function | `function boxFromCorners(a: DocPoint, b: DocPoint, constrain?: boolean): DocRect;` |
| `buildSelectRegion` | function | `function buildSelectRegion(shape: SelectionShape, mode: SelectionMode, feather: number): SelectRegionRequest \| undefined;` |
| `clampRadius` | function | `function clampRadius(r: number): number;` |
| `closesPolygon` | function | `function closesPolygon(points: readonly DocPoint[], p: DocPoint, radius?: number): boolean;` |
| `describeSelection` | function | `function describeSelection(bounds: DocRect \| undefined): string;` |
| `describeShape` | function | `function describeShape(shape: SelectionShape): string;` |
| `docRectToView` | function | `function docRectToView(m: ViewMapping, r: DocRect): DocRect;` |
| `docToView` | function | `function docToView(m: ViewMapping, p: DocPoint): DocPoint;` |
| `initialKeyboardRect` | function | `function initialKeyboardRect(docWidth: number, docHeight: number): DocRect;` |
| `modeFromModifiers` | function | `function modeFromModifiers(base: SelectionMode, mods: SelectionModifiers): SelectionMode;` |
| `modeLabel` | function | `function modeLabel(mode: SelectionMode): string;` |
| `moveKeyboardRect` | function | `function moveKeyboardRect(r: DocRect, dx: number, dy: number, docWidth: number, docHeight: number): DocRect;` |
| `pathSegments` | function | `function pathSegments(points: readonly DocPoint[], closed: boolean): readonly Segment[];` |
| `pointsBounds` | function | `function pointsBounds(points: readonly DocPoint[]): DocRect;` |
| `resizeKeyboardRect` | function | `function resizeKeyboardRect(r: DocRect, dw: number, dh: number, docWidth: number, docHeight: number): DocRect;` |
| `resolveSelectionKey` | function | `function resolveSelectionKey(e: SelectionKey): SelectionKeyCommand \| undefined;` |
| `shapeBounds` | function | `function shapeBounds(shape: SelectionShape): DocRect;` |
| `shapeProblem` | function | `function shapeProblem(shape: SelectionShape): string \| undefined;` |
| `thinPoints` | function | `function thinPoints(points: readonly DocPoint[], max?: number): readonly DocPoint[];` |
| `toolHint` | function | `function toolHint(tool: SelectionTool): string;` |
| `toolLabel` | function | `function toolLabel(tool: SelectionTool): string;` |
| `validateMapping` | function | `function validateMapping(m: ViewMapping): void;` |
| `validateSelectionProps` | function | `function validateSelectionProps(p: { tool: string; mode: string; feather: number; bounds?: DocRect \| undefined; }): void;` |
| `viewToDoc` | function | `function viewToDoc(m: ViewMapping, x: number, y: number): DocPoint;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/selection/selection-model.ts -->
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
