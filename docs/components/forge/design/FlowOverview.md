---
name: "FlowOverview"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/design/FlowOverview"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# FlowOverview

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/design/FlowOverview.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/design/FlowOverview.tsx -->
- Package: @nyc-tron/ui
- Import: `import { FlowOverview } from "@nyc-tron/ui/forge/design/FlowOverview";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/design/FlowOverview
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/design/FlowOverview.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `frames` | `readonly { id: string; label: string; entry: boolean; }[]` | not recorded | yes |  |
| `links` | `readonly { id: string; sourceId: string; targetId: string; label: string; }[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `renderFlow` | `() => ReactNode` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onEntryChange` | `(id: string, entry: boolean, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onStart` | `(entryId: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/design/FlowOverview.tsx -->
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
