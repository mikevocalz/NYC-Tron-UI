---
name: "ReferenceColorizer"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/ReferenceColorizer"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/forge/spreadsheet/FormulaReferenceText"]
a11yStatus: "unverified"
---

# ReferenceColorizer

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/ReferenceColorizer.tsx -->
Shared licensed tokenizer/tone owner; the host places on-sheet range outlines in grid coordinates.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/ReferenceColorizer.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/forge/spreadsheet/FormulaReferenceText

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/ReferenceColorizer
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ReferenceColorizer } from "@/components/nyc-tron/ui/components/forge/spreadsheet/ReferenceColorizer";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ReferenceColorizer } from "@nyc-tron/ui/components/forge/spreadsheet/ReferenceColorizer";`
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
import { ReferenceColorizer } from "@/components/nyc-tron/ui/components/forge/spreadsheet/ReferenceColorizer";

export function Example() {
  return <ReferenceColorizer formula="" onHighlight={() => {}} renderRangeHighlight={() => null} />;
}
```
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
