---
name: "ReferenceColorizer"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/spreadsheet/ReferenceColorizer"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["space.1.5"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/forge/spreadsheet/FormulaReferenceText"]
a11yStatus: "declared"
---

# ReferenceColorizer

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/ReferenceColorizer.tsx -->
Shared licensed tokenizer/tone owner; the host places on-sheet range outlines in grid coordinates.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/ReferenceColorizer.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ReferenceColorizer } from "@nyc-tron/ui/forge/spreadsheet/ReferenceColorizer";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/forge/spreadsheet/FormulaReferenceText

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/ReferenceColorizer
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/ReferenceColorizer.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `formula` | `string` | not recorded | yes |  |
| `sheetName` | `string` | not recorded | no |  |
| `onHighlight` | `(reference: ColoredReference) => void` | not recorded | yes |  |
| `renderRangeHighlight` | `(reference: ColoredReference) => ReactNode` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/ReferenceColorizer.tsx -->
- `accessibilityLabel`: "Formula reference colors"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
```tsx example=ReferenceColorizer
import { ReferenceColorizer } from "@nyc-tron/ui/forge/spreadsheet/ReferenceColorizer";

export function Example() {
  return <ReferenceColorizer formula="" onHighlight={() => {}} renderRangeHighlight={() => {}} />;
}
```
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
