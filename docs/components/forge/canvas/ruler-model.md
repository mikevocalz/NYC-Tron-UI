---
name: "RulerModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/canvas/ruler-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# RulerModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/ruler-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/ruler-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/ruler-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { DEFAULT_DPI, RULER_GUIDE_PAGE_STEP, RULER_GUIDE_STEP, RULER_MAX_TICKS, RULER_MIN_LABEL_SPACING, RULER_MIN_TICK_SPACING, RULER_THICKNESS, RULER_TOUCH_BAND } from "@/components/nyc-tron/ui/components/forge/canvas/ruler-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { DEFAULT_DPI, RULER_GUIDE_PAGE_STEP, RULER_GUIDE_STEP, RULER_MAX_TICKS, RULER_MIN_LABEL_SPACING, RULER_MIN_TICK_SPACING, RULER_THICKNESS, RULER_TOUCH_BAND } from "@nyc-tron/ui/components/forge/canvas/ruler-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/ruler-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `CanvasGuide` | interface | `interface CanvasGuide { readonly id: string; readonly orientation: "horizontal" \| "vertical"; readonly position: number; }` |
| `DEFAULT_DPI` | const | `const DEFAULT_DPI = 72;` |
| `GuideKeyCommand` | type | `type GuideKeyCommand = { readonly kind: "move"; readonly delta: number; } \| { readonly kind: "remove"; };` |
| `NewCanvasGuide` | type | `type NewCanvasGuide = Omit<CanvasGuide, "id">;` |
| `RULER_GUIDE_PAGE_STEP` | const | `const RULER_GUIDE_PAGE_STEP = 10;` |
| `RULER_GUIDE_STEP` | const | `const RULER_GUIDE_STEP = 1;` |
| `RULER_MAX_TICKS` | const | `const RULER_MAX_TICKS = 1200;` |
| `RULER_MIN_LABEL_SPACING` | const | `const RULER_MIN_LABEL_SPACING = 56;` |
| `RULER_MIN_TICK_SPACING` | const | `const RULER_MIN_TICK_SPACING = 5;` |
| `RULER_THICKNESS` | const | `const RULER_THICKNESS = 24;` |
| `RULER_TOUCH_BAND` | const | `const RULER_TOUCH_BAND = 44;` |
| `RULER_UNITS` | const | `const RULER_UNITS: readonly [ { readonly unit: "px"; readonly label: "Pixels"; }, { readonly unit: "in"; readonly label: "Inches"; }, { readonly unit: "cm"; ...` |
| `RulerSpacing` | interface | `interface RulerSpacing { readonly majorUnits: number; readonly divisions: number; }` |
| `RulerTick` | interface | `interface RulerTick { readonly offset: number; readonly level: "major" \| "half" \| "minor"; readonly label?: string; }` |
| `RulerTickInput` | interface | `interface RulerTickInput { readonly viewport: CanvasViewport; readonly orientation: "horizontal" \| "vertical"; readonly unit: RulerUnit; readonly dpi?: numbe...` |
| `RulerUnit` | type | `type RulerUnit = "px" \| "in" \| "cm" \| "mm" \| "pt";` |
| `centerGuidePosition` | function | `function centerGuidePosition(viewport: CanvasViewport, orientation: CanvasGuide["orientation"]): number;` |
| `formatLength` | function | `function formatLength(px: number, unit: RulerUnit, dpi?: number): string;` |
| `formatRulerNumber` | function | `function formatRulerNumber(value: number): string;` |
| `fromPixels` | function | `function fromPixels(px: number, unit: RulerUnit, dpi?: number): number;` |
| `guideAccessibilityLabel` | function | `function guideAccessibilityLabel(guide: CanvasGuide, unit: RulerUnit, dpi?: number, origin?: DocPoint): string;` |
| `guideAxis` | const | `const guideAxis: (orientation: CanvasGuide["orientation"]) => "x" \| "y";` |
| `guideKeyCommand` | function | `function guideKeyCommand(orientation: CanvasGuide["orientation"], key: string \| undefined, shift?: boolean): GuideKeyCommand \| undefined;` |
| `guidePositionAt` | function | `function guidePositionAt(viewport: CanvasViewport, orientation: CanvasGuide["orientation"], point: DocPoint): number;` |
| `isOverOwnRuler` | function | `function isOverOwnRuler(orientation: CanvasGuide["orientation"], point: DocPoint, thickness?: number): boolean;` |
| `rulerSpacing` | function | `function rulerSpacing(zoom: number, unit: RulerUnit, dpi?: number, minLabelPx?: number): RulerSpacing;` |
| `rulerTicks` | function | `function rulerTicks({ viewport, orientation, unit, dpi, origin, minLabelPx }: RulerTickInput): RulerTick[];` |
| `toPixels` | function | `function toPixels(value: number, unit: RulerUnit, dpi?: number): number;` |
| `unitsPerInch` | function | `function unitsPerInch(unit: RulerUnit): number \| undefined;` |
| `validateGuides` | function | `function validateGuides(guides: readonly CanvasGuide[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/ruler-model.ts -->
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
