---
name: "SparklineModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/sparkline-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# SparklineModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/sparkline-model.ts -->
In-cell chart family.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/sparkline-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/sparkline-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { SPARKLINE_KINDS, sparklineGeometry, sparklineSpecProblem } from "@/components/nyc-tron/ui/components/forge/spreadsheet/sparkline-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { SPARKLINE_KINDS, sparklineGeometry, sparklineSpecProblem } from "@nyc-tron/ui/components/forge/spreadsheet/sparkline-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/sparkline-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `SPARKLINE_KINDS` | const | `const SPARKLINE_KINDS: readonly SparklineKind[];` |
| `SparklineAxisMin` | type | `type SparklineAxisMin = "auto" \| "zero";` |
| `SparklineBar` | interface | `interface SparklineBar { readonly index: number; readonly left: number; readonly top: number; readonly width: number; readonly height: number; readonly tone:...` |
| `SparklineGeometry` | interface | `interface SparklineGeometry { readonly bars: readonly SparklineBar[]; readonly segments: readonly SparklineSegment[]; readonly markers: readonly SparklineMar...` |
| `SparklineGeometryOptions` | interface | `interface SparklineGeometryOptions { readonly kind: SparklineKind; readonly width: number; readonly height: number; readonly axisMin?: SparklineAxisMin; read...` |
| `SparklineKind` | type | `type SparklineKind = "line" \| "column" \| "winloss";` |
| `SparklineMarkTone` | type | `type SparklineMarkTone = "normal" \| "negative" \| "high" \| "low";` |
| `SparklineMarker` | interface | `interface SparklineMarker { readonly index: number; readonly x: number; readonly y: number; readonly tone: SparklineMarkTone; }` |
| `SparklineSegment` | interface | `interface SparklineSegment { readonly centerX: number; readonly centerY: number; readonly length: number; readonly angleDeg: number; }` |
| `SparklineSpec` | interface | `interface SparklineSpec { readonly kind: SparklineKind; readonly dataRange: string; readonly location: string; readonly showHigh: boolean; readonly showLow: ...` |
| `SparklineSpecProblem` | interface | `interface SparklineSpecProblem { readonly field: "dataRange" \| "location"; readonly message: string; }` |
| `sparklineGeometry` | function | `function sparklineGeometry(values: readonly (number \| undefined)[], options: SparklineGeometryOptions): SparklineGeometry;` |
| `sparklineSpecProblem` | function | `function sparklineSpecProblem(spec: SparklineSpec, parse: (range: string) => { startRow: number; endRow: number; startColumn: number; endColumn: number; } \| ...` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/sparkline-model.ts -->
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
