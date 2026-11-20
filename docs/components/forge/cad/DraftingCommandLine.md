---
name: "DraftingCommandLine"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/cad/DraftingCommandLine"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.danger", "color.text", "color.textMuted", "radius.control", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# DraftingCommandLine

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/DraftingCommandLine.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/DraftingCommandLine.tsx -->
- Package: @nyc-tron/ui
- Import: `import { DraftingCommandLine } from "@nyc-tron/ui/forge/cad/DraftingCommandLine";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/cad/DraftingCommandLine
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/DraftingCommandLine.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `prompt` | `string` | not recorded | yes |  |
| `history` | `readonly { id: string; command: string; output: string; kind: 'result' \| 'error' \| 'info'; }[]` | not recorded | yes |  |
| `completions` | `readonly { id: string; label: string; replacement: string; }[]` | not recorded | yes |  |
| `onInput` | `(text: string) => void` | not recorded | yes |  |
| `onExecute` | `(command: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCancel` | `() => unknown` | not recorded | yes |  |
| `busy` | `boolean` | not recorded | yes |  |
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
| `busy` | `busy` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/DraftingCommandLine.tsx -->
- `accessibilityLabel`: "CAD command"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
