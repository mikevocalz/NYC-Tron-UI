---
name: "CellSelectionOverlay"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/CellSelectionOverlay"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.primary", "color.surfaceRaised"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# CellSelectionOverlay

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/CellSelectionOverlay.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/CellSelectionOverlay.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, react-native-gesture-handler, zustand
- Requires: @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/CellSelectionOverlay
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { CellSelectionOverlay } from "@/components/nyc-tron/ui/components/forge/spreadsheet/CellSelectionOverlay";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { CellSelectionOverlay } from "@nyc-tron/ui/components/forge/spreadsheet/CellSelectionOverlay";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/CellSelectionOverlay.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `range` | `SheetRange` | not recorded | yes |  |
| `rowCount` | `number` | not recorded | yes |  |
| `columnCount` | `number` | not recorded | yes |  |
| `rowHeight` | `number` | not recorded | yes |  |
| `columnWidth` | `number` | not recorded | yes |  |
| `panes` | `readonly SelectionPane[]` | not recorded | yes | Separate nonoccluded grid/frozen-pane rectangles supplied by the layout owner. |
| `interaction` | `'resize' \| 'fill'` | not recorded | no |  |
| `onPreview` | `(range: SheetRange \| null) => void` | not recorded | no |  |
| `onRangeCommit` | `(range: SheetRange, signal?: AbortSignal) => unknown` | not recorded | no |  |
| `onFillCommit` | `(plan: FillPlan, signal?: AbortSignal) => unknown` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/CellSelectionOverlay.tsx -->
- `accessibilityLabel`: "Cell range overlay"
- `accessibilityRole`: "adjustable"
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
