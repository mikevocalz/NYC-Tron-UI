---
name: "SavedSheetViewManager"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/SavedSheetViewManager"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/spreadsheet/SortFilterHeader"]
a11yStatus: "unverified"
---

# SavedSheetViewManager

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/SavedSheetViewManager.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/SavedSheetViewManager.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/spreadsheet/SortFilterHeader

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/SavedSheetViewManager
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { SavedSheetViewManager } from "@/components/nyc-tron/ui/components/forge/spreadsheet/SavedSheetViewManager";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { SavedSheetViewManager } from "@nyc-tron/ui/components/forge/spreadsheet/SavedSheetViewManager";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/SavedSheetViewManager.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `sheetId` | `string` | not recorded | yes |  |
| `views` | `readonly SavedSheetView[]` | not recorded | yes |  |
| `activeId` | `string \| null` | not recorded | yes |  |
| `snapshot` | `SheetViewSnapshot` | not recorded | yes |  |
| `onSave` | `(name: string, snapshot: SheetViewSnapshot, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRestore` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRename` | `(id: string, name: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onDelete` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/SavedSheetViewManager.tsx -->
- `accessibilityLabel`: "Saved sheet views"
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
