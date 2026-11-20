---
name: "PrototypeConnectionTool"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/design/PrototypeConnectionTool"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PointEditor2D"]
a11yStatus: "unverified"
---

# PrototypeConnectionTool

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/design/PrototypeConnectionTool.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/design/PrototypeConnectionTool.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PrototypeConnectionTool } from "@nyc-tron/ui/components/forge/design/PrototypeConnectionTool";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PointEditor2D

```sh
npx shadcn@latest add @nyc-tron/forge/design/PrototypeConnectionTool
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/design/PrototypeConnectionTool.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `frames` | `readonly PrototypeFrameTarget[]` | not recorded | yes |  |
| `hotspots` | `readonly PrototypeHotspot[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onConnect` | `(hotspotId: string, destinationId: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onDisconnect` | `(hotspotId: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `renderCanvas` | `(drag?: { x: number; y: number; }) => ReactNode` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/design/PrototypeConnectionTool.tsx -->
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
