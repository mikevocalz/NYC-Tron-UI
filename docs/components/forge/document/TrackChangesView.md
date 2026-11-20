---
name: "TrackChangesView"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/TrackChangesView"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# TrackChangesView

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/TrackChangesView.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/TrackChangesView.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TrackChangesView } from "@nyc-tron/ui/components/forge/document/TrackChangesView";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/document/TrackChangesView
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/TrackChangesView.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `changes` | `readonly DocumentChange[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `tracking` | `boolean` | not recorded | yes |  |
| `filter` | `'all' \| 'insert' \| 'delete' \| 'format'` | not recorded | yes |  |
| `onFilterChange` | `(value: TrackChangesViewProps['filter']) => void` | not recorded | yes |  |
| `onTrackingChange` | `(enabled: boolean, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onReview` | `(ids: readonly string[], decision: 'accept' \| 'reject', signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `unstyled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/TrackChangesView.tsx -->
- `accessibilityLabel`: "Previous text: ", "Proposed text: ", "Tracked changes"
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
