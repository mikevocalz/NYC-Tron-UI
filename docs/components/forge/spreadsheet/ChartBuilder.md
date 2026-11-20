---
name: "ChartBuilder"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/ChartBuilder"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# ChartBuilder

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/ChartBuilder.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/ChartBuilder.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/ChartBuilder
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ChartBuilder } from "@/components/nyc-tron/ui/components/forge/spreadsheet/ChartBuilder";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ChartBuilder } from "@nyc-tron/ui/components/forge/spreadsheet/ChartBuilder";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/ChartBuilder.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `spec` | `SheetChartSpec` | not recorded | yes |  |
| `presentation` | `ChartPresentation` | not recorded | no |  |
| `chartColors` | `readonly { id: string; label: string; }[]` | not recorded | no |  |
| `onPresentationChange` | `(value: ChartPresentation) => unknown` | not recorded | no |  |
| `onSpecChange` | `(spec: SheetChartSpec) => void` | not recorded | yes |  |
| `cells` | `ChartCellValues` | not recorded | yes | Values for `spec.range`, keyed by A1 address. |
| `selection` | `SheetRange` | not recorded | no | The grid's current selection; adds a "Use selection" button. |
| `renderPreview` | `(spec: SheetChartSpec, data: SheetChartData) => ReactNode` | not recorded | no | Draws the chart. Receives series already validated and labeled. |
| `onInsert` | `(spec: SheetChartSpec, data: SheetChartData) => unknown` | not recorded | no |  |
| `loading` | `boolean` | not recorded | no | `true` while the app is still loading `cells` for the range. |
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
| `loading` | `loading` prop, type `boolean` |
| `disabled` | `disabled` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/ChartBuilder.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
