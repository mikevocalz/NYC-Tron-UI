---
name: "TextSearchResults"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/pdf/TextSearchResults"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["TextSearchResults.leading.20", "color.accent", "color.border", "color.focus", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control", "space.1", "space.1.5", "space.2", "space.2.5"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/office/office-controls"]
a11yStatus: "declared"
---

# TextSearchResults

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/TextSearchResults.tsx -->
Document-wide text search for PDFs (K-04): a query field, optional case and whole-word toggles, previous/next with wrap, and results grouped by page with the match in bold inside its context.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/TextSearchResults.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TextSearchResults } from "@nyc-tron/ui/forge/pdf/TextSearchResults";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/office/office-controls

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/TextSearchResults
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/TextSearchResults.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `query` | `string` | not recorded | yes |  |
| `onQueryChange` | `(query: string) => void` | not recorded | yes |  |
| `onSubmit` | `(query: string) => void` | not recorded | yes | Starts (or restarts) the search. Return key and the field's search action call it. |
| `searchedQuery` | `string` | not recorded | no | The query `hits` belong to; `undefined` before the first search. |
| `hits` | `readonly PdfSearchHit[]` | not recorded | yes | Hits in page order, from `insertPageHits`. |
| `current` | `number` | not recorded | yes | Index into `hits` of the hit the page view shows, or -1. |
| `onSelect` | `(index: number, hit: PdfSearchHit) => void` | not recorded | yes | Shows hit `index`: the host moves the page view there. |
| `progress` | `PdfSearchProgress` | not recorded | yes |  |
| `error` | `string` | not recorded | no | The text could not be read (as opposed to "no matches"). Shown instead of the results, with a retry that calls `onSubmit`. |
| `caseSensitive` | `boolean` | not recorded | no | The case toggle renders only with its callback. |
| `onCaseSensitiveChange` | `(value: boolean) => void` | not recorded | no |  |
| `wholeWords` | `boolean` | not recorded | no | The whole-word toggle renders only with its callback. |
| `onWholeWordsChange` | `(value: boolean) => void` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
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
| `error` | `error` prop, type `string` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/TextSearchResults.tsx -->
- `accessibilityLabel`: "Find in document", "Page ", "Search document"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "button", "header", "search"
- `accessibilityState`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
