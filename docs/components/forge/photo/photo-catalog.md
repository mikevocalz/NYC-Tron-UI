---
name: "PhotoCatalogModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/photo/photo-catalog"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PhotoCatalogModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/photo-catalog.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/photo-catalog.ts -->
- Package: @nyc-tron/ui
- Import: `import { emptyPhotoCatalogFilter, togglePhotoSelection, validPhotoDate, validateCatalogChoices, validateCatalogFilter, validatePhotoCatalog } from "@nyc-tron/ui/components/forge/photo/photo-catalog";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/photo/photo-catalog
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/photo-catalog.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `CatalogChoice` | interface | `interface CatalogChoice { readonly id: string; readonly label: string; }` |
| `PhotoCatalogFilter` | interface | `interface PhotoCatalogFilter { readonly query: string; readonly cameraId: string \| null; readonly lensId: string \| null; readonly albumId: string \| null; rea...` |
| `PhotoCatalogItem` | interface | `interface PhotoCatalogItem { readonly id: string; readonly name: string; readonly thumbnailUri: string \| null; readonly rating: PhotoRating; }` |
| `emptyPhotoCatalogFilter` | function | `function emptyPhotoCatalogFilter(): PhotoCatalogFilter;` |
| `togglePhotoSelection` | function | `function togglePhotoSelection(selected: readonly string[], id: string): readonly string[];` |
| `validPhotoDate` | function | `function validPhotoDate(value: string): boolean;` |
| `validateCatalogChoices` | function | `function validateCatalogChoices(choices: readonly CatalogChoice[]): void;` |
| `validateCatalogFilter` | function | `function validateCatalogFilter(value: PhotoCatalogFilter): void;` |
| `validatePhotoCatalog` | function | `function validatePhotoCatalog(photos: readonly PhotoCatalogItem[], selectedIds: readonly string[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/photo-catalog.ts -->
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
