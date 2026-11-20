---
name: "InsertTableGrid"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/InsertTableGrid"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.surfaceRaised", "color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# InsertTableGrid

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/InsertTableGrid.tsx -->
Native touch selection plus numeric insertion for larger tables and keyboard/accessibility use.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/InsertTableGrid.tsx -->
- Package: @nyc-tron/ui
- Import: `import { InsertTableGrid } from "@nyc-tron/ui/components/forge/document/InsertTableGrid";`
- Peers: react, react-native, react-native-gesture-handler, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/document/InsertTableGrid
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/InsertTableGrid.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `maxRows` | `number` | not recorded | no |  |
| `maxColumns` | `number` | not recorded | no |  |
| `onInsert` | `(rows: number, columns: number, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/InsertTableGrid.tsx -->
- `accessibilityLabel`: "Insert table"
- `accessibilityLiveRegion`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
```tsx example=InsertTableGrid
import { InsertTableGrid } from "@nyc-tron/ui/components/forge/document/InsertTableGrid";

export function Example() {
  return <InsertTableGrid onInsert={() => {}} />;
}
```
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
