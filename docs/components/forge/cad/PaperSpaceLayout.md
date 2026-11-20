---
name: "PaperSpaceLayout"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/cad/PaperSpaceLayout"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/document/PageSetupPanel", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# PaperSpaceLayout

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/PaperSpaceLayout.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/PaperSpaceLayout.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PaperSpaceLayout } from "@nyc-tron/ui/components/forge/cad/PaperSpaceLayout";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/document/PageSetupPanel, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/cad/PaperSpaceLayout
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/PaperSpaceLayout.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `pageSetup` | `Omit<PageSetupPanelProps, 'scope' \| 'revision'>` | not recorded | yes |  |
| `viewports` | `readonly PaperViewport[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `templates` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `templateId` | `string` | not recorded | yes |  |
| `renderSheet` | `() => ReactNode` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onViewport` | `(value: PaperViewport, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onTemplate` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onPrint` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `printReady` | `boolean` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/PaperSpaceLayout.tsx -->
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
