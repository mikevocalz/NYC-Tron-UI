---
name: "TextureSetPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/cad/TextureSetPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# TextureSetPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/TextureSetPanel.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/TextureSetPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TextureSetPanel } from "@nyc-tron/ui/components/forge/cad/TextureSetPanel";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/cad/TextureSetPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/TextureSetPanel.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `sets` | `readonly TextureSet[]` | not recorded | yes |  |
| `selectedSetId` | `string \| null` | not recorded | yes |  |
| `selectedChannelId` | `string \| null` | not recorded | yes |  |
| `onSelect` | `(setId: string, channelId: string \| null) => void` | not recorded | yes |  |
| `onVisibility` | `(setId: string, channelId: string, visible: boolean, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onReplace` | `(setId: string, channelId: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `renderChannelPreview` | `(setId: string, channelId: string) => ReactNode` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/TextureSetPanel.tsx -->
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
