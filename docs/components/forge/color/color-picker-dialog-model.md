---
name: "ColorPickerDialogModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/color-picker-dialog-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# ColorPickerDialogModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/color-picker-dialog-model.ts -->
Pure state rules for `ColorPickerDialog` (C-01): title and labels, the original/new comparison, key handling and the contrast readout.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/color-picker-dialog-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { colorChanged, colorDialogTitle, comparisonContrast, comparisonLabel, describeColor, dialogKeyIntent, draftFromRgba, draftWithAlpha } from "@nyc-tron/ui/components/forge/color/color-picker-dialog-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/color/color-picker-dialog-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/color-picker-dialog-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `ColorComparisonSide` | type | `type ColorComparisonSide = "original" \| "new";` |
| `ComparisonContrast` | interface | `interface ComparisonContrast extends ContrastRating { readonly text: string; }` |
| `DialogKeyIntent` | type | `type DialogKeyIntent = "commit" \| "cancel" \| "none";` |
| `DialogKeyTarget` | type | `type DialogKeyTarget = "text-field" \| "control" \| "surface";` |
| `colorChanged` | function | `function colorChanged(original: HsvColor, draft: HsvColor): boolean;` |
| `colorDialogTitle` | function | `function colorDialogTitle(target?: string): string;` |
| `comparisonContrast` | function | `function comparisonContrast(draft: HsvColor, original: HsvColor, backdrop?: RgbaColor): ComparisonContrast;` |
| `comparisonLabel` | function | `function comparisonLabel(side: ColorComparisonSide, color: HsvColor, changed: boolean): string;` |
| `describeColor` | function | `function describeColor(color: HsvColor): string;` |
| `dialogKeyIntent` | function | `function dialogKeyIntent(key: string \| undefined, target: DialogKeyTarget): DialogKeyIntent;` |
| `draftFromRgba` | function | `function draftFromRgba(color: RgbaColor, draft: HsvColor): HsvColor;` |
| `draftWithAlpha` | function | `function draftWithAlpha(draft: HsvColor, alpha: number): HsvColor;` |
| `revertDraft` | function | `function revertDraft(original: HsvColor): HsvColor;` |
| `sameHsv` | function | `function sameHsv(a: HsvColor, b: HsvColor): boolean;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/color-picker-dialog-model.ts -->
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
