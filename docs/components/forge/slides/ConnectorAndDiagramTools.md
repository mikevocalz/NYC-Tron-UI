---
name: "ConnectorAndDiagramTools"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/slides/ConnectorAndDiagramTools"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.surfaceRaised", "color.text", "space.1.5", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "declared"
---

# ConnectorAndDiagramTools

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/ConnectorAndDiagramTools.tsx -->
Sticky ends follow actual named object anchors; visual routing is presentation geometry, persistence stays host-owned.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/ConnectorAndDiagramTools.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ConnectorAndDiagramTools } from "@nyc-tron/ui/forge/slides/ConnectorAndDiagramTools";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/slides/ConnectorAndDiagramTools
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/ConnectorAndDiagramTools.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `targets` | `readonly DiagramTarget[]` | not recorded | yes |  |
| `connectors` | `readonly DiagramConnector[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `canvasSize` | `{ width: number; height: number; }` | not recorded | yes | Document-coordinate size; the host canvas renders in this same box. |
| `renderCanvas` | `() => ReactNode` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onCommit` | `(id: string, value: DiagramConnector, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onAdd` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/ConnectorAndDiagramTools.tsx -->
- `accessibilityLabel`: "Connectors and diagram tools"
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
