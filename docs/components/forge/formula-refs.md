---
name: "FormulaRefsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/formula-refs"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# FormulaRefsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/formula-refs.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/formula-refs.ts -->
- Package: @nyc-tron/ui
- Import: `import { MAX_SHEET_COLUMNS, MAX_SHEET_ROWS, formulaReferences, referenceHighlights } from "@nyc-tron/ui/forge/formula-refs";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/formula-refs
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/formula-refs.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FormulaReference` | interface | `interface FormulaReference { readonly text: string; readonly start: number; readonly end: number; readonly sheet?: string; readonly range: SheetRange; }` |
| `MAX_SHEET_COLUMNS` | const | `const MAX_SHEET_COLUMNS = 16384;` |
| `MAX_SHEET_ROWS` | const | `const MAX_SHEET_ROWS = 1048576;` |
| `ReferenceHighlight` | interface | `interface ReferenceHighlight { readonly index: number; readonly text: string; readonly range: SheetRange; }` |
| `formulaReferences` | function | `function formulaReferences(text: string): FormulaReference[];` |
| `referenceHighlights` | function | `function referenceHighlights(formula: string, sheetName?: string): ReferenceHighlight[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/formula-refs.ts -->
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
