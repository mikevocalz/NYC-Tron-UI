---
name: "RangeTsvModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/range-tsv"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# RangeTsvModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/range-tsv.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/range-tsv.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/range-tsv
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { rangeToTsv, tsvField } from "@/components/nyc-tron/ui/components/forge/range-tsv";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { rangeToTsv, tsvField } from "@nyc-tron/ui/components/forge/range-tsv";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/range-tsv.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `RangeTooLargeError` | class | `class RangeTooLargeError extends RangeError { readonly cellCount: number; readonly maxCells: number; constructor(cellCount: number, maxCells: number); }` |
| `RangeTsvOptions` | interface | `interface RangeTsvOptions { readonly maxCells?: number; readonly lineEnding?: "\n" \| "\r\n"; }` |
| `TsvValue` | type | `type TsvValue = string \| number \| boolean \| null \| undefined;` |
| `rangeToTsv` | function | `function rangeToTsv(range: SheetRange, read: (row: number, column: number) => TsvValue, options?: RangeTsvOptions): string;` |
| `tsvField` | function | `function tsvField(value: TsvValue): string;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/range-tsv.ts -->
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
