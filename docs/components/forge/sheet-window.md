---
name: "SheetWindowModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/sheet-window"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# SheetWindowModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/sheet-window.ts -->
The 2-D viewport policy for Tally's visible window.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/sheet-window.ts -->
- Package: @nyc-tron/ui
- Import: `import { cellAddress, columnName, frozenSheetWindow, moveSheetSelection, parseCellAddress, rangeAddress, rangeCellCount, rangeContains } from "@nyc-tron/ui/components/forge/sheet-window";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/sheet-window
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/sheet-window.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `CellPosition` | interface | `interface CellPosition { readonly row: number; readonly column: number; }` |
| `FrozenSheetWindow` | interface | `interface FrozenSheetWindow { readonly frozenRows: number; readonly frozenColumns: number; readonly body: SheetWindow; readonly frozenWidth: number; readonly...` |
| `FrozenSheetWindowOptions` | interface | `interface FrozenSheetWindowOptions extends SheetWindowOptions { readonly frozenRows?: number; readonly frozenColumns?: number; }` |
| `RevealCellOptions` | interface | `interface RevealCellOptions { readonly row: number; readonly column: number; readonly scrollX: number; readonly scrollY: number; readonly bodyWidth: number; ...` |
| `SheetBounds` | interface | `interface SheetBounds { readonly rowCount: number; readonly columnCount: number; readonly pageRows?: number; }` |
| `SheetKeyInput` | interface | `interface SheetKeyInput { readonly key: string; readonly shiftKey?: boolean; readonly ctrlKey?: boolean; readonly metaKey?: boolean; }` |
| `SheetPrefetchOptions` | interface | `interface SheetPrefetchOptions { readonly rowCount: number; readonly columnCount: number; readonly rowBlock?: number; readonly columnBlock?: number; }` |
| `SheetRange` | interface | `interface SheetRange { readonly startRow: number; readonly endRow: number; readonly startColumn: number; readonly endColumn: number; }` |
| `SheetResponsiveInput` | interface | `interface SheetResponsiveInput { readonly width: number; readonly rowHeight?: number; readonly columnWidth?: number; readonly compactBelow?: number; readonly...` |
| `SheetResponsiveMetrics` | interface | `interface SheetResponsiveMetrics { readonly compact: boolean; readonly rowHeight: number; readonly columnWidth: number; readonly rowHeaderWidth: number; read...` |
| `SheetScrollMetrics` | interface | `interface SheetScrollMetrics { readonly rowHeight: number; readonly columnWidth: number; readonly rowHeaderWidth: number; }` |
| `SheetScrollPosition` | interface | `interface SheetScrollPosition { readonly x: number; readonly y: number; }` |
| `SheetSelection` | interface | `interface SheetSelection { readonly anchor: string; readonly focus: string; }` |
| `SheetWindow` | interface | `interface SheetWindow { readonly rows: { start: number; end: number; }; readonly columns: { start: number; end: number; }; readonly totalWidth: number; reado...` |
| `SheetWindowOptions` | interface | `interface SheetWindowOptions { readonly rowCount: number; readonly columnCount: number; readonly scrollX: number; readonly scrollY: number; readonly viewport...` |
| `cellAddress` | function | `function cellAddress(row: number, column: number): string;` |
| `columnName` | function | `function columnName(index: number): string;` |
| `frozenSheetWindow` | function | `function frozenSheetWindow(options: FrozenSheetWindowOptions): FrozenSheetWindow;` |
| `moveSheetSelection` | function | `function moveSheetSelection(selection: SheetSelection, input: SheetKeyInput, bounds: SheetBounds): SheetSelection \| undefined;` |
| `parseCellAddress` | function | `function parseCellAddress(address: string): CellPosition \| undefined;` |
| `rangeAddress` | function | `function rangeAddress(range: SheetRange): string;` |
| `rangeCellCount` | function | `function rangeCellCount(range: SheetRange): number;` |
| `rangeContains` | function | `function rangeContains(range: SheetRange, row: number, column: number): boolean;` |
| `reanchorSheetScroll` | function | `function reanchorSheetScroll(position: SheetScrollPosition, before: SheetScrollMetrics, after: SheetScrollMetrics): SheetScrollPosition;` |
| `responsiveSheetMetrics` | function | `function responsiveSheetMetrics({ width, rowHeight, columnWidth, compactBelow, touchTarget, }: SheetResponsiveInput): SheetResponsiveMetrics;` |
| `revealCellScroll` | function | `function revealCellScroll(o: RevealCellOptions): { x: number; y: number; };` |
| `selectionRange` | function | `function selectionRange(selection: SheetSelection): SheetRange;` |
| `sheetPrefetchRange` | function | `function sheetPrefetchRange(window: { readonly rows: { start: number; end: number; }; readonly columns: { start: number; end: number; }; }, options: SheetPre...` |
| `sheetWindow` | function | `function sheetWindow(options: SheetWindowOptions): SheetWindow;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/sheet-window.ts -->
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
