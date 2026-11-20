---
name: "PageSetupPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/PageSetupPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# PageSetupPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/PageSetupPanel.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/PageSetupPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PageSetupPanel } from "@nyc-tron/ui/components/forge/document/PageSetupPanel";`
- Peers: react, react-native
- Requires: @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/document/PageSetupPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/PageSetupPanel.tsx -->
Extends: `Omit<PropertyInspectorProps, 'label' | 'fields' | 'onCommit'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `PageSetup` | not recorded | yes |  |
| `papers` | `readonly { id: string; label: string; width: number; height: number; }[]` | not recorded | yes |  |
| `onCommit` | `(value: PageSetup, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/PageSetupPanel.tsx -->
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
