---
name: "DevHandoffInspector"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/design/DevHandoffInspector"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# DevHandoffInspector

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/design/DevHandoffInspector.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/design/DevHandoffInspector.tsx -->
- Package: @nyc-tron/ui
- Import: `import { DevHandoffInspector } from "@nyc-tron/ui/components/forge/design/DevHandoffInspector";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/design/DevHandoffInspector
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/design/DevHandoffInspector.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `objectId` | `string` | not recorded | yes |  |
| `measurements` | `readonly { id: string; label: string; value: string; unit: string; }[]` | not recorded | yes |  |
| `typography` | `readonly { id: string; label: string; value: string; }[]` | not recorded | yes |  |
| `assets` | `readonly { id: string; label: string; format: string; available: boolean; }[]` | not recorded | yes |  |
| `snippets` | `readonly { id: string; language: string; code: string; sourceRevision: string \| number; }[]` | not recorded | yes |  |
| `renderMeasurements` | `() => ReactNode` | not recorded | yes |  |
| `onCopy` | `(text: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onExportAsset` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/design/DevHandoffInspector.tsx -->
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
