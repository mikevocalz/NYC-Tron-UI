---
name: "VariablesAndModes"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/design/VariablesAndModes"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# VariablesAndModes

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/design/VariablesAndModes.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/design/VariablesAndModes.tsx -->
- Package: @nyc-tron/ui
- Import: `import { VariablesAndModes } from "@nyc-tron/ui/components/forge/design/VariablesAndModes";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/design/VariablesAndModes
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/design/VariablesAndModes.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `variables` | `readonly DesignVariable[]` | not recorded | yes |  |
| `modes` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `activeModeId` | `string` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `onModeChange` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onCommit` | `(id: string, modeId: string, value: DesignVariableValue, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRevealBinding` | `(id: string) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/design/VariablesAndModes.tsx -->
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
