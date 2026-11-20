---
name: "HistoryModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/history-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# HistoryModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/history-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/history-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { validateHistory } from "@nyc-tron/ui/shell/history-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/history-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/history-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `HistoryEntry` | interface | `interface HistoryEntry { readonly id: string; readonly label: string; readonly detail?: string; readonly timestampMs?: number; }` |
| `HistoryJump` | interface | `interface HistoryJump { readonly documentId: string; readonly expectedRevision: string; readonly cursor: number; }` |
| `validateHistory` | function | `function validateHistory(entries: readonly HistoryEntry[], cursor: number): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/history-model.ts -->
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
