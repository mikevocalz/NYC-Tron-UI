---
name: "ChartModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/chart-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ChartModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/chart-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/chart-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { MAX_CHART_CELLS, SHEET_CHART_KINDS, chartSeriesFromCells, parseA1Range } from "@nyc-tron/ui/components/forge/spreadsheet/chart-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/chart-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/chart-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ChartCellValues` | type | `type ChartCellValues = Readonly<Record<string, { readonly computed: string \| number \| boolean \| null; } \| undefined>>;` |
| `MAX_CHART_CELLS` | const | `const MAX_CHART_CELLS = 4096;` |
| `SHEET_CHART_KINDS` | const | `const SHEET_CHART_KINDS: readonly SheetChartKind[];` |
| `SeriesOrientation` | type | `type SeriesOrientation = "columns" \| "rows";` |
| `SheetChartData` | interface | `interface SheetChartData { readonly series: readonly SheetChartSeries[]; readonly skippedCells: number; }` |
| `SheetChartKind` | type | `type SheetChartKind = "line" \| "column" \| "area";` |
| `SheetChartSeries` | interface | `interface SheetChartSeries { readonly id: string; readonly label: string; readonly points: readonly { readonly x: number; readonly y: number; }[]; }` |
| `SheetChartSpec` | interface | `interface SheetChartSpec { readonly kind: SheetChartKind; readonly range: string; readonly seriesIn: SeriesOrientation; readonly hasHeader: boolean; readonly...` |
| `chartSeriesFromCells` | function | `function chartSeriesFromCells(spec: SheetChartSpec, cells: ChartCellValues, maxCells?: number): SheetChartData;` |
| `parseA1Range` | function | `function parseA1Range(text: string): SheetRange \| undefined;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/chart-model.ts -->
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
