---
name: "SpreadsheetGrid"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/SpreadsheetGrid"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.danger", "color.focus", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/spreadsheet/FormulaBar", "@nyc-tron/gestures/PanResponderDrag"]
a11yStatus: "unverified"
---

# SpreadsheetGrid

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/SpreadsheetGrid.tsx -->
Three-pane sheet: frozen headers and frozen rows/columns sit outside the body scroll views and follow them through native-driver transforms, so a fling never shows the strips a frame behind.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/SpreadsheetGrid.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SpreadsheetGrid } from "@nyc-tron/ui/components/forge/SpreadsheetGrid";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/spreadsheet/FormulaBar, @nyc-tron/gestures/PanResponderDrag

```sh
npx shadcn@latest add @nyc-tron/forge/SpreadsheetGrid
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/SpreadsheetGrid.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `sheetId` | `string` | not recorded | yes |  |
| `readOnly` | `boolean` | not recorded | no |  |
| `sheetName` | `string` | not recorded | no | Display name used to keep `'This Sheet'!A1` references highlighted; other sheets' references are not. |
| `rowCount` | `number` | not recorded | yes |  |
| `columnCount` | `number` | not recorded | yes |  |
| `cells` | `Readonly<Record<string, SpreadsheetCell>>` | not recorded | yes |  |
| `width` | `number` | not recorded | no | Width and height may be provided by the host or measured via onLayout. |
| `height` | `number` | not recorded | no |  |
| `compactBelow` | `number` | not recorded | no | Content breakpoint only: never changes foldable hardware navigation. |
| `rowHeight` | `number` | not recorded | no |  |
| `columnWidth` | `number` | not recorded | no |  |
| `frozenRows` | `number` | `0` | no | Leading rows kept visible above the scrolling body. |
| `frozenColumns` | `number` | `0` | no | Leading columns kept visible beside the scrolling body. |
| `selection` | `SheetSelection \| null` | not recorded | no | Controlled range selection. `focus` is the cell the formula bar edits. Omit to let the grid own selection; pass `null` for "nothing selected". |
| `onSelectionChange` | `(selection: SheetSelection) => void` | not recorded | no |  |
| `onCommitCell` | `(address: string, raw: string) => Promise<unknown> \| unknown` | not recorded | no |  |
| `onCopyRange` | `(range: SheetRange, tsv: string) => void` | not recorded | no | Ctrl/Cmd+C or the screen-reader "Copy" action. The kit builds the TSV from `cells` (absent addresses are empty fields) and never touches the clipboard; the app writes it. |
| `maxCopyCells` | `number` | `1_000_000` | no | Largest selection {@linkcode SpreadsheetGridProps.onCopyRange} serializes. |
| `onPasteRange` | `(anchor: CellPosition, cells: readonly PasteCell[]) => Promise<unknown> \| unknown` | not recorded | no | Ctrl/Cmd+V, the browser paste event or the screen-reader "Paste" action. `anchor` is the selection's top-left cell; `cells` are parsed from the clipboard TSV and clamped to this sheet. The grid never mutates `cells` data: the host applies the edits and reject shows the message. Ignored while `readOnly` or `disabledReason` is set. |
| `maxPasteCells` | `number` | `1_000_000` | no | Largest paste rectangle accepted. |
| `readClipboard` | `() => Promise<string> \| string` | not recorded | no | Supplies clipboard text for Ctrl/Cmd+V and the screen-reader "Paste" action, which carry no clipboard data. Browser paste events use their own `clipboardData` and do not need it. |
| `highlightReferences` | `boolean` | `true` | no | Outline the cells each reference in the formula bar points at, one theme tone per distinct reference (the same reference keeps its tone). |
| `onFillRange` | `(plan: FillPlan) => Promise<unknown> \| unknown` | not recorded | no | Fill the selection's contents into a neighbouring range. Supplying it shows the fill handle on the selection's bottom-trailing corner and enables Ctrl/Cmd+D (fill down) and Ctrl/Cmd+R (fill right). The app (the engine) does the fill; reject to show its message. Omit it when the engine has no fill operation, and the handle is not drawn. |
| `renderCellContent` | `(address: string, size: { readonly width: number; readonly height: number; }) => { readonly content: ReactNode; readonly contentLabel?: string; } \| undefined` | not recorded | no | Draw something other than the value in a cell, such as a `forge/spreadsheet/Sparkline`. Return `undefined` to show the value. The cell keeps its address and value as its accessibility label; pass `contentLabel` to add a description. `size` is the inner box in points. |
| `showFormulaBar` | `boolean` | `true` | no | Draw the address and formula bar. Turn it off for the second pane of a split view so both panes share one bar. |
| `fillTransport` | `DragTransport` | `PanResponderDrag` | no | Drag recognizer for the fill handle. |
| `onWindowChange` | `(range: SpreadsheetWindowRequest) => void` | not recorded | no | Ask the host's TallyDocument for just this range. |
| `className` | `string` | not recorded | no |  |
| `cellClassName` | `string` | not recorded | no |  |
| `headerClassName` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
| State | How it is set |
|---|---|
| `readOnly` | `readOnly` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/SpreadsheetGrid.tsx -->
- `accessibilityHint`: "Select the cell to edit its value in the formula bar. Long press to extend the selection."
- `accessibilityLabel`: "Spreadsheet grid, scroll sideways for additional columns"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "alert"
- `aria-label`: set from an expression
- `aria-selected`: set from an expression
- `role`: "cell", "columnheader", "grid", "row", "rowheader"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
