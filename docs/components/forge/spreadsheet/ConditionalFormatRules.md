---
name: "ConditionalFormatRules"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/ConditionalFormatRules"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# ConditionalFormatRules

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/ConditionalFormatRules.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/ConditionalFormatRules.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/ConditionalFormatRules
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ConditionalFormatRules } from "@/components/nyc-tron/ui/components/forge/spreadsheet/ConditionalFormatRules";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ConditionalFormatRules } from "@nyc-tron/ui/components/forge/spreadsheet/ConditionalFormatRules";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/ConditionalFormatRules.tsx -->
Extends: `ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `rules` | `readonly ConditionalRule[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `styles` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onAdd` | `(kind: ConditionalRule['kind'], signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCommit` | `(id: string, value: ConditionalRule, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onOrder` | `(ids: readonly string[], signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRemove` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/ConditionalFormatRules.tsx -->
- `accessibilityLabel`: "Conditional formatting rules"
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
