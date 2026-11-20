---
name: "FillHandleAndAutoFill"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/FillHandleAndAutoFill"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/forge/spreadsheet/CellSelectionOverlay"]
a11yStatus: "unverified"
---

# FillHandleAndAutoFill

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/FillHandleAndAutoFill.tsx -->
Shares the range recognizer and fill planner.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/FillHandleAndAutoFill.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Select, @nyc-tron/forge/spreadsheet/CellSelectionOverlay

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/FillHandleAndAutoFill
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { FillHandleAndAutoFill, AutoFillModePicker } from "@/components/nyc-tron/ui/components/forge/spreadsheet/FillHandleAndAutoFill";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { FillHandleAndAutoFill, AutoFillModePicker } from "@nyc-tron/ui/components/forge/spreadsheet/FillHandleAndAutoFill";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/FillHandleAndAutoFill.tsx -->
Extends: `Omit<CellSelectionOverlayProps, 'interaction' | 'onFillCommit' | 'onRangeCommit'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `mode` | `AutoFillMode` | not recorded | yes |  |
| `availableModes` | `readonly AutoFillMode[]` | not recorded | yes |  |
| `onFill` | `(plan: FillPlan, mode: AutoFillMode, signal?: AbortSignal) => unknown` | not recorded | yes |  |

### AutoFillModePicker

Extends: `ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `mode` | `AutoFillMode` | not recorded | yes |  |
| `availableModes` | `readonly AutoFillMode[]` | not recorded | yes |  |
| `onModeChange` | `(mode: AutoFillMode) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/FillHandleAndAutoFill.tsx -->
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
