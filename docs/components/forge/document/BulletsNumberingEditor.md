---
name: "BulletsNumberingEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/document/BulletsNumberingEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control", "space.1", "space.1.5", "space.2", "space.2.5", "space.3"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/office/office-controls"]
a11yStatus: "declared"
---

# BulletsNumberingEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/BulletsNumberingEditor.tsx -->
Bullets and numbering (H-07): pick the list kind, indent or outdent under the nesting policy in `list-model` (one level deeper than the item above at most, nine levels), pick a format per level, and preview the markers the result produces.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/BulletsNumberingEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { BulletsNumberingEditor } from "@nyc-tron/ui/forge/document/BulletsNumberingEditor";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/office/office-controls

```sh
npx shadcn@latest add @nyc-tron/forge/document/BulletsNumberingEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/BulletsNumberingEditor.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `items` | `readonly ListPreviewItem[]` | not recorded | yes | The list as it stands; the selected paragraphs are `[selectionStart, selectionEnd]`. |
| `selectionStart` | `number` | not recorded | yes |  |
| `selectionEnd` | `number` | not recorded | yes |  |
| `kind` | `ListKind \| "mixed"` | not recorded | yes | What the selection is now. |
| `kinds` | `readonly ListKind[]` | not recorded | yes | List kinds the host can store, in order. `none` is "Not a list". |
| `onKindChange` | `(kind: ListKind) => void` | not recorded | yes |  |
| `levelFormats` | `readonly ListFormat[]` | not recorded | no | Per-level formats, index = level. Defaults to bullets everywhere. |
| `onLevelFormatChange` | `(level: number, format: ListFormat) => void` | not recorded | no | Changes one level's format; renders the level picker. |
| `onShiftLevel` | `(direction: 1 \| -1) => void` | not recorded | no | Moves the selection one level deeper (+1) or shallower (-1); renders the indent pair. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/BulletsNumberingEditor.tsx -->
- `accessibilityLabel`: "Bullets and numbering", "Level ", "List kind", "Preview"
- `accessibilityRole`: "radio", "radiogroup"
- `accessibilityState`: set from an expression
- `role`: "group", "list", "listitem", "radiogroup"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
