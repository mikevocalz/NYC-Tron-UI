---
name: "FormulaAutocomplete"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/spreadsheet/FormulaAutocomplete"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "color.textMuted", "space.1", "space.1.5"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# FormulaAutocomplete

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/FormulaAutocomplete.tsx -->
Uses the host's parser/catalog replacement range; does not guess function semantics or evaluate formulas.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/FormulaAutocomplete.tsx -->
- Package: @nyc-tron/ui
- Import: `import { FormulaAutocomplete } from "@nyc-tron/ui/forge/spreadsheet/FormulaAutocomplete";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/FormulaAutocomplete
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/FormulaAutocomplete.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `formula` | `string` | not recorded | yes |  |
| `replacement` | `{ start: number; end: number; }` | not recorded | yes |  |
| `suggestions` | `readonly FormulaSuggestion[]` | not recorded | yes |  |
| `open` | `boolean` | not recorded | yes |  |
| `onAccept` | `(formula: string, caretUTF16: number, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onDismiss` | `() => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/FormulaAutocomplete.tsx -->
- `accessibilityLabel`: "Formula suggestions"
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
