---
name: "SlideSorter"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/SlideSorter"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/office/office-controls", "@nyc-tron/forge/slides/SlideThumbnail"]
a11yStatus: "unverified"
---

# SlideSorter

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/SlideSorter.tsx -->
Slide sorter grid (J-02) with multiselect: a press selects one slide, Cmd/Ctrl adds or removes, Shift selects a range, and "Select" mode makes presses toggle on touch screens.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/SlideSorter.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SlideSorter } from "@nyc-tron/ui/components/forge/slides/SlideSorter";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/office/office-controls, @nyc-tron/forge/slides/SlideThumbnail

```sh
npx shadcn@latest add @nyc-tron/forge/slides/SlideSorter
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/SlideSorter.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `slides` | `readonly SlideSummary[]` | not recorded | yes |  |
| `selectedIds` | `readonly string[]` | not recorded | yes |  |
| `onSelectionChange` | `(ids: string[]) => void` | not recorded | yes |  |
| `onOpen` | `(id: string) => void` | not recorded | no | Opens a slide in the editor (double press or Enter). |
| `onReorder` | `(order: string[]) => void \| Promise<unknown>` | not recorded | no | Applies a new deck order after the selection was moved as a block. The host turns it into engine moves (`planMoves` gives single from/to steps). |
| `onRemove` | `(ids: string[]) => void \| Promise<unknown>` | not recorded | no | Deletes the selected slides. Not offered when it would delete every slide. |
| `size` | `SlideSize` | not recorded | no |  |
| `renderImage` | `(src: string, object: SlideObject) => ReactNode` | not recorded | no |  |
| `minThumbnailWidth` | `number` | `160` | no | Smallest thumbnail width in points; columns are fitted to the measured width. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/SlideSorter.tsx -->
- `accessibilityHint`: "Presses add or remove slides from the selection"
- `accessibilityLabel`: "Slide sorter"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "checkbox"
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
