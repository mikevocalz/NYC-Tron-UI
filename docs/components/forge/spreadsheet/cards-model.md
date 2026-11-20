---
name: "CardsModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/cards-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# CardsModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/cards-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/cards-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { CARD_PREVIEW_FIELDS, sheetCardAt, sheetCards } from "@nyc-tron/ui/components/forge/spreadsheet/cards-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/cards-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/cards-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `CARD_PREVIEW_FIELDS` | const | `const CARD_PREVIEW_FIELDS = 3;` |
| `CardCellValues` | type | `type CardCellValues = Readonly<Record<string, { readonly raw: string; readonly computed: string \| number \| boolean \| null; } \| undefined>>;` |
| `SheetCard` | interface | `interface SheetCard { readonly row: number; readonly title: string; readonly fields: readonly SheetCardField[]; }` |
| `SheetCardField` | interface | `interface SheetCardField { readonly name: string; readonly address: string; readonly raw: string; readonly display: string; }` |
| `sheetCardAt` | function | `function sheetCardAt(table: SheetRange, cells: CardCellValues, index: number): SheetCard;` |
| `sheetCards` | function | `function sheetCards(table: SheetRange, cells: CardCellValues): SheetCard[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/cards-model.ts -->
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
