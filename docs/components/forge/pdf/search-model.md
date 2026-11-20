---
name: "SearchModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/search-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# SearchModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/search-model.ts -->
Most hits one search keeps.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/search-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/search-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PDF_SEARCH_MAX_HITS, PDF_SEARCH_SNIPPET_RADIUS, findInPageText, groupHitsByPage, insertPageHits, searchPageOrder, searchSummary, stepHit } from "@/components/nyc-tron/ui/components/forge/pdf/search-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PDF_SEARCH_MAX_HITS, PDF_SEARCH_SNIPPET_RADIUS, findInPageText, groupHitsByPage, insertPageHits, searchPageOrder, searchSummary, stepHit } from "@nyc-tron/ui/components/forge/pdf/search-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/search-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `PDF_SEARCH_MAX_HITS` | const | `const PDF_SEARCH_MAX_HITS = 1000;` |
| `PDF_SEARCH_SNIPPET_RADIUS` | const | `const PDF_SEARCH_SNIPPET_RADIUS = 40;` |
| `PdfSearchHit` | interface | `interface PdfSearchHit { readonly page: number; readonly start: number; readonly end: number; readonly before: string; readonly match: string; readonly after...` |
| `PdfSearchOptions` | interface | `interface PdfSearchOptions { readonly caseSensitive?: boolean; readonly wholeWords?: boolean; }` |
| `findInPageText` | function | `function findInPageText(page: number, text: string, query: string, options?: PdfSearchOptions): PdfSearchHit[];` |
| `groupHitsByPage` | function | `function groupHitsByPage(hits: readonly PdfSearchHit[]): Array<{ page: number; items: Array<{ hit: PdfSearchHit; index: number; }>; }>;` |
| `insertPageHits` | function | `function insertPageHits(hits: readonly PdfSearchHit[], found: readonly PdfSearchHit[], current: number): { hits: PdfSearchHit[]; current: number; capped: boo...` |
| `searchPageOrder` | function | `function searchPageOrder(pageCount: number, fromPage: number): number[];` |
| `searchSummary` | function | `function searchSummary(count: number, searched: number, pageCount: number, running: boolean, capped?: boolean): string;` |
| `stepHit` | function | `function stepHit(current: number, count: number, forward: boolean): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/search-model.ts -->
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
