---
name: "SheetTabsModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/sheet-tabs-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# SheetTabsModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/sheet-tabs-model.ts -->
Tone of a sheet tab's color stripe.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/sheet-tabs-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/sheet-tabs-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { MAX_SHEET_NAME_LENGTH, SHEET_TAB_TONES, duplicateSheetName, nextSheetName, sheetNameError, sheetTabKeyTarget, sheetTabMoveIndex } from "@/components/nyc-tron/ui/components/forge/spreadsheet/sheet-tabs-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { MAX_SHEET_NAME_LENGTH, SHEET_TAB_TONES, duplicateSheetName, nextSheetName, sheetNameError, sheetTabKeyTarget, sheetTabMoveIndex } from "@nyc-tron/ui/components/forge/spreadsheet/sheet-tabs-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/sheet-tabs-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `MAX_SHEET_NAME_LENGTH` | const | `const MAX_SHEET_NAME_LENGTH = 31;` |
| `SHEET_TAB_TONES` | const | `const SHEET_TAB_TONES: readonly SheetTabTone[];` |
| `SheetTab` | interface | `interface SheetTab { readonly id: string; readonly name: string; readonly tone?: SheetTabTone; readonly isProtected?: boolean; }` |
| `SheetTabTone` | type | `type SheetTabTone = "primary" \| "accent" \| "success" \| "info" \| "muted";` |
| `duplicateSheetName` | function | `function duplicateSheetName(name: string, tabs: readonly SheetTab[]): string;` |
| `nextSheetName` | function | `function nextSheetName(tabs: readonly SheetTab[], base?: string): string;` |
| `sheetNameError` | function | `function sheetNameError(name: string, tabs: readonly SheetTab[], exceptId?: string): string \| undefined;` |
| `sheetTabKeyTarget` | function | `function sheetTabKeyTarget(tabs: readonly SheetTab[], currentId: string, key: string, rtl?: boolean): string \| undefined;` |
| `sheetTabMoveIndex` | function | `function sheetTabMoveIndex(tabs: readonly SheetTab[], id: string, step: -1 \| 1): number \| undefined;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/sheet-tabs-model.ts -->
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
