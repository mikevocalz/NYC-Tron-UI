---
name: "ReferenceColorsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/reference-colors"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.info", "color.primary", "color.success"]
registryDependencies: []
a11yStatus: "unverified"
---

# ReferenceColorsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/reference-colors.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/reference-colors.ts -->
- Package: @nyc-tron/ui
- Import: `import { REFERENCE_TONE_CLASSES, REFERENCE_TONE_COUNT, colorReferences, formulaSegments, referenceEdges } from "@nyc-tron/ui/components/forge/spreadsheet/reference-colors";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/reference-colors
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/reference-colors.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ColoredReference` | interface | `interface ColoredReference { readonly text: string; readonly start: number; readonly end: number; readonly sheet?: string; readonly range: SheetRange; readon...` |
| `FormulaSegment` | interface | `interface FormulaSegment { readonly text: string; readonly tone?: number; }` |
| `REFERENCE_TONE_CLASSES` | const | `const REFERENCE_TONE_CLASSES: readonly ReferenceToneClasses[];` |
| `REFERENCE_TONE_COUNT` | const | `const REFERENCE_TONE_COUNT = 8;` |
| `ReferenceToneClasses` | interface | `interface ReferenceToneClasses { readonly text: string; readonly fill: string; readonly top: string; readonly bottom: string; readonly start: string; readonl...` |
| `colorReferences` | function | `function colorReferences(formula: string, sheetName?: string): ColoredReference[];` |
| `formulaSegments` | function | `function formulaSegments(formula: string, references: readonly ColoredReference[]): FormulaSegment[];` |
| `referenceEdges` | function | `function referenceEdges(range: SheetRange, row: number, column: number): { top: boolean; bottom: boolean; start: boolean; end: boolean; };` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/reference-colors.ts -->
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
