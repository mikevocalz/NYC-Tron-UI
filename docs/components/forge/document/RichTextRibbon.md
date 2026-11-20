---
name: "RichTextRibbon"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/RichTextRibbon"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/office/office-controls"]
a11yStatus: "unverified"
---

# RichTextRibbon

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/RichTextRibbon.tsx -->
Home-tab formatting ribbon for text documents (H-03): paragraph style, font family and size, character toggles with mixed state, text and highlight color, and case.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/RichTextRibbon.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/office/office-controls

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/document/RichTextRibbon
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { RichTextRibbon } from "@/components/nyc-tron/ui/components/forge/document/RichTextRibbon";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { RichTextRibbon } from "@nyc-tron/ui/components/forge/document/RichTextRibbon";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/RichTextRibbon.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `state` | `RibbonState` | not recorded | yes | Character state of the selection, from `ribbonStateFor`. |
| `onToggle` | `(toggle: InlineToggle, on: boolean) => void` | not recorded | no | Bold, italic, underline and strikethrough. |
| `toggles` | `readonly InlineToggle[]` | `all four` | no | Toggles to show, in order. |
| `colors` | `readonly RibbonColor[]` | not recorded | no |  |
| `onColorChange` | `(color: string \| undefined) => void` | not recorded | no | `undefined` clears the color back to automatic. |
| `highlights` | `readonly RibbonColor[]` | not recorded | no |  |
| `highlight` | `SharedValue<string>` | not recorded | no |  |
| `onHighlightChange` | `(color: string \| undefined) => void` | not recorded | no |  |
| `fontFamilies` | `readonly string[]` | not recorded | no |  |
| `fontFamily` | `SharedValue<string>` | not recorded | no |  |
| `onFontFamilyChange` | `(family: string) => void` | not recorded | no |  |
| `fontSize` | `SharedValue<number>` | not recorded | no |  |
| `onFontSizeChange` | `(size: number) => void` | not recorded | no |  |
| `onChangeCase` | `(mode: TextCase) => void` | not recorded | no |  |
| `paragraphStyles` | `readonly RibbonParagraphStyle[]` | not recorded | no |  |
| `paragraphStyle` | `SharedValue<string>` | not recorded | no |  |
| `onParagraphStyleChange` | `(id: string) => void` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no | Disables every control, e.g. while the document is read-only. |
| `label` | `string` | `"Formatting"` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/RichTextRibbon.tsx -->
- `accessibilityLabel`: "Font size "
- `accessibilityRole`: "radio", "toolbar"
- `accessibilityState`: set from an expression
- `role`: "group"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
