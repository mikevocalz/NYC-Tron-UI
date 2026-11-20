---
name: "ColorPickerDialog"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/color/ColorPickerDialog"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.text", "color.textMuted", "radius.control", "space.1.5", "space.2", "space.3", "space.4"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/forge/color/AlphaSlider", "@nyc-tron/forge/color/ColorChannelFields", "@nyc-tron/forge/color/HsvPicker", "@nyc-tron/forge/color/SwatchGrid"]
a11yStatus: "declared"
---

# ColorPickerDialog

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/ColorPickerDialog.tsx -->
Color picker dialog (C-01).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/ColorPickerDialog.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ColorPickerDialog } from "@nyc-tron/ui/forge/color/ColorPickerDialog";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/forge/color/AlphaSlider, @nyc-tron/forge/color/ColorChannelFields, @nyc-tron/forge/color/HsvPicker, @nyc-tron/forge/color/SwatchGrid

```sh
npx shadcn@latest add @nyc-tron/forge/color/ColorPickerDialog
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/ColorPickerDialog.tsx -->
| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `visible` | `boolean` | not recorded | yes |  |
| `original` | `HsvColor` | not recorded | yes | The color in the document when the dialog opened. Shown at the start edge of the comparison. |
| `value` | `HsvColor` | not recorded | yes | The draft. Update it from `onValueChange`; it is shown at the end edge of the comparison. |
| `onValueChange` | `(next: HsvColor) => void` | not recorded | yes | Every draft change: field drag, hue, opacity, typed channel, swatch or revert. |
| `onPreview` | `(color: HsvColor) => void` | not recorded | no | Live preview for the canvas, at most once per animation frame. Never write it to the document or the undo history. Cancel sends `original` here before `onCancel`, so a preview never sticks. When absent, nothing is scheduled. |
| `onCommit` | `(color: HsvColor) => void` | not recorded | yes | Apply, or Enter on the dialog surface. Called once; commit one undo entry here. |
| `onCancel` | `() => void` | not recorded | yes | Cancel, Escape, Android back or a press on the backdrop. Close the dialog here. |
| `target` | `string` | not recorded | no | What the color is for, e.g. "Foreground" or "Shape fill". Shown in the title. |
| `title` | `string` | not recorded | no | Replaces the title built from `target`. |
| `swatchGroups` | `readonly SwatchGroup[]` | not recorded | no | Host swatch groups, e.g. one `recent` group. The swatch section is hidden when omitted or empty. |
| `channelModel` | `ChannelModel` | not recorded | no | Channel set for the typed fields. Without `onChannelModelChange` the dialog remembers the choice while open. |
| `onChannelModelChange` | `(model: ChannelModel) => void` | not recorded | no |  |
| `showAlpha` | `boolean` | `true` | no | Shows the opacity slider and field. |
| `showContrast` | `boolean` | `false` | no | Shows the WCAG contrast of the draft against the original. |
| `applyLabel` | `string` | `"Apply color"` | no |  |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
| `testID` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/ColorPickerDialog.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "button", "header"
- `accessibilityState`: set from an expression
- `aria-label`: set from an expression
- `role`: "adjustable", "button", "dialog", "radio", "slider", "switch", "tab"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
