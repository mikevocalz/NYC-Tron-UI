---
name: "BrushModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/ink/brush-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# BrushModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/ink/brush-model.ts -->
Engine-neutral brush settings.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/ink/brush-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { BRUSH_DYNAMICS_FIELDS, MAX_INK_PREVIEW_SAMPLES, stabilizePreview, validateBrushDynamics, validateBrushTaper, validateInkSamples, validateStabilization } from "@nyc-tron/ui/components/forge/ink/brush-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/ink/brush-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/ink/brush-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `BRUSH_DYNAMICS_FIELDS` | const | `const BRUSH_DYNAMICS_FIELDS: readonly [ { readonly key: 'size'; readonly label: 'Brush size'; readonly min: 0.1; readonly max: 4096; readonly step: 0.1; read...` |
| `BrushDynamics` | interface | `interface BrushDynamics { size: number; hardness: number; flow: number; spacing: number; stabilizer: number; scatter: number; }` |
| `BrushStabilization` | interface | `interface BrushStabilization { streamline: number; stabilization: number; motionFilter: number; }` |
| `BrushTaper` | interface | `interface BrushTaper { start: number; end: number; minimumSize: number; pressure: boolean; tip: 'round' \| 'linear' \| 'sharp'; }` |
| `BrushTaperSettings` | interface | `interface BrushTaperSettings { pen: BrushTaper; touch: BrushTaper; }` |
| `InkSample` | interface | `interface InkSample { readonly x: number; readonly y: number; readonly timeMs: number; readonly pressure?: number; readonly tiltX?: number; readonly tiltY?: ...` |
| `MAX_INK_PREVIEW_SAMPLES` | const | `const MAX_INK_PREVIEW_SAMPLES = 2048;` |
| `stabilizePreview` | function | `function stabilizePreview(samples: readonly InkSample[], value: BrushStabilization): readonly InkSample[];` |
| `validateBrushDynamics` | function | `function validateBrushDynamics(value: BrushDynamics): void;` |
| `validateBrushTaper` | function | `function validateBrushTaper(value: BrushTaperSettings): void;` |
| `validateInkSamples` | function | `function validateInkSamples(samples: readonly InkSample[]): void;` |
| `validateStabilization` | function | `function validateStabilization(value: BrushStabilization): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/ink/brush-model.ts -->
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
