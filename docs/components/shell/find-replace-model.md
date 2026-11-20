---
name: "FindReplaceModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/find-replace-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# FindReplaceModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/find-replace-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/find-replace-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { findLiteralText, literalSearchToken, replaceLiteralText, validateFindResponse } from "@nyc-tron/ui/shell/find-replace-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/find-replace-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/find-replace-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FindDocument` | interface | `interface FindDocument { readonly id: string; readonly revision: string; }` |
| `FindMatch` | interface | `interface FindMatch { readonly id: string; readonly start: number; readonly end: number; readonly before: string; readonly text: string; readonly after: stri...` |
| `FindQuery` | interface | `interface FindQuery { readonly document: FindDocument; readonly text: string; readonly caseSensitive: boolean; readonly wholeWord: boolean; }` |
| `FindResponse` | interface | `interface FindResponse { readonly token: string; readonly total: number; readonly matches: readonly FindMatch[]; }` |
| `ReplaceRequest` | type | `type ReplaceRequest = { readonly query: FindQuery; readonly searchToken: string; readonly replacement: string; } & ({ readonly kind: "one"; readonly matchId:...` |
| `findLiteralText` | function | `function findLiteralText(text: string, query: FindQuery, limit?: number): FindResponse;` |
| `literalSearchToken` | const | `const literalSearchToken: (query: FindQuery) => string;` |
| `replaceLiteralText` | function | `function replaceLiteralText(document: FindDocument & { readonly text: string; }, request: ReplaceRequest): string;` |
| `validateFindResponse` | function | `function validateFindResponse(response: FindResponse): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/find-replace-model.ts -->
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
