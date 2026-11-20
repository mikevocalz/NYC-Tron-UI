---
name: "OutlineModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/outline-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# OutlineModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/outline-model.ts -->
A heading in a document outline.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/outline-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { headingAtBlock, headingsByPage, rowForHeading, validateOutline, visibleOutline } from "@nyc-tron/ui/components/forge/document/outline-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/document/outline-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/outline-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `OutlineHeading` | interface | `interface OutlineHeading { readonly id: string; readonly level: number; readonly text: string; readonly block: number; readonly page?: number; }` |
| `OutlineRow` | interface | `interface OutlineRow { readonly heading: OutlineHeading; readonly index: number; readonly depth: number; readonly hasChildren: boolean; readonly collapsed: b...` |
| `headingAtBlock` | function | `function headingAtBlock(headings: readonly OutlineHeading[], block: number): number;` |
| `headingsByPage` | function | `function headingsByPage(headings: readonly OutlineHeading[], pageCount: number): Array<OutlineHeading \| undefined>;` |
| `rowForHeading` | function | `function rowForHeading(rows: readonly OutlineRow[], index: number): number;` |
| `validateOutline` | function | `function validateOutline(headings: readonly OutlineHeading[]): void;` |
| `visibleOutline` | function | `function visibleOutline(headings: readonly OutlineHeading[], collapsed: ReadonlySet<string>, showLevel?: number): OutlineRow[];` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/outline-model.ts -->
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
