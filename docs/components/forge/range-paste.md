---
name: "RangePasteModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/range-paste"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# RangePasteModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/range-paste.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/range-paste.ts -->
- Package: @nyc-tron/ui
- Import: `import { MAX_SHEET_COLUMNS, MAX_SHEET_ROWS, parseTsv, tsvToRange } from "@nyc-tron/ui/forge/range-paste";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/range-paste
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/range-paste.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MAX_SHEET_COLUMNS` | const | `const MAX_SHEET_COLUMNS = 16384;` |
| `MAX_SHEET_ROWS` | const | `const MAX_SHEET_ROWS = 1048576;` |
| `PasteCell` | interface | `interface PasteCell { readonly row: number; readonly column: number; readonly value: string; }` |
| `PasteTooLargeError` | class | `class PasteTooLargeError extends RangeError { readonly cellCount: number; readonly maxCells: number; constructor(cellCount: number, maxCells: number); }` |
| `TsvPaste` | interface | `interface TsvPaste { readonly cells: readonly PasteCell[]; readonly range: SheetRange \| null; readonly clamped: boolean; }` |
| `TsvToRangeOptions` | interface | `interface TsvToRangeOptions { readonly maxCells?: number; readonly rowCount?: number; readonly columnCount?: number; }` |
| `parseTsv` | function | `function parseTsv(text: string): string[][];` |
| `tsvToRange` | function | `function tsvToRange(text: string, anchor: CellPosition, options?: TsvToRangeOptions): TsvPaste;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/range-paste.ts -->
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
