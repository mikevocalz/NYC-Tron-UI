---
name: "MultiSelectionControls"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/selection/MultiSelectionControls"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control", "space.1", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/Select", "@nyc-tron/shell/PropertyRow", "@nyc-tron/shell/UnitInput"]
a11yStatus: "declared"
---

# MultiSelectionControls

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/selection/MultiSelectionControls.tsx -->
Ordered range/toggle selection, group commands and honest shared-property state.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/selection/MultiSelectionControls.tsx -->
- Package: @nyc-tron/ui
- Import: `import { MultiSelectionControls } from "@nyc-tron/ui/forge/selection/MultiSelectionControls";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/Select, @nyc-tron/shell/PropertyRow, @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/selection/MultiSelectionControls
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/selection/MultiSelectionControls.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `revision` | `string \| number` | not recorded | no |  |
| `items` | `readonly SelectableObject[]` | not recorded | yes |  |
| `selection` | `ObjectSelection` | not recorded | yes |  |
| `onSelectionChange` | `(selection: ObjectSelection) => void` | not recorded | yes |  |
| `tool` | `'pick' \| 'lasso'` | not recorded | yes | Lasso geometry is supplied by SelectionMarquee or the host's canvas hit-test owner. |
| `onToolChange` | `(tool: 'pick' \| 'lasso') => void` | not recorded | yes |  |
| `onGroup` | `(request: { action: 'group' \| 'ungroup'; ids: readonly string[]; }) => void` | not recorded | no |  |
| `properties` | `readonly SharedPropertyDefinition[]` | not recorded | no |  |
| `onPropertyChange` | `(request: { ids: readonly string[]; key: string; value: SharedValue; }) => void` | not recorded | no | One transaction across the selected objects, never one callback per object. |
| `disabled` | `boolean` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
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
| `disabled` | `disabled` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/selection/MultiSelectionControls.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Selectable objects"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "checkbox", "list"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
- `aria-disabled`: set from an expression
- `aria-label`: "Object selection tool"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
