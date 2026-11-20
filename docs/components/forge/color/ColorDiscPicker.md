---
name: "ColorDiscPicker"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/ColorDiscPicker"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.text", "color.textMuted"]
registryDependencies: []
a11yStatus: "unverified"
---

# ColorDiscPicker

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/ColorDiscPicker.tsx -->
Controlled hue/saturation disc with a brightness track (C-27): angle is hue, distance from the center is saturation.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/ColorDiscPicker.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/color/ColorDiscPicker
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ColorDiscPicker } from "@/components/nyc-tron/ui/components/forge/color/ColorDiscPicker";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ColorDiscPicker } from "@nyc-tron/ui/components/forge/color/ColorDiscPicker";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/ColorDiscPicker.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `HsvColor` | not recorded | yes | The committed color. Keep it as HSV in the host so grays keep their hue. |
| `onPreview` | `(next: HsvColor) => void` | not recorded | no | Every drag move on the disc or the brightness track. |
| `onCommit` | `(next: HsvColor) => void` | not recorded | yes | Once per drag release, key press or screen-reader action that changes the color. |
| `maxSize` | `number` | `240` | no | Largest disc diameter in layout units. |
| `showBrightness` | `boolean` | `true` | no | Omit the separate brightness track when embedding the disc in grading controls. |
| `renderDisc` | `(props: { size: number; value: HsvColor; }) => ReactNode` | not recorded | no | Optional color-managed background. Receives the live value; owns no input or document state. |
| `disabled` | `boolean` | not recorded | no |  |
| `rtl` | `boolean` | `I18nManager.isRTL` | no | Brightness track runs right to left. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/ColorDiscPicker.tsx -->
- `accessibilityHint`: "Drag on the disc. Swipe up or down to change saturation; use the actions menu for hue."
- `accessibilityLabel`: "Hue and saturation"
- `accessibilityRole`: "adjustable"
- `aria-disabled`: set from an expression
- `aria-valuemax`: set from an expression
- `aria-valuemin`: set from an expression
- `aria-valuenow`: set from an expression
- `aria-valuetext`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
