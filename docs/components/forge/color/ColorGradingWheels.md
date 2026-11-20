---
name: "ColorGradingWheels"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/ColorGradingWheels"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/SegmentedControl", "@nyc-tron/forge/color/ColorDiscPicker", "@nyc-tron/shell/SliderField"]
a11yStatus: "unverified"
---

# ColorGradingWheels

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/ColorGradingWheels.tsx -->
Tonal hue/saturation wheels and explicit exposure, balance and blending controls.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/ColorGradingWheels.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/SegmentedControl, @nyc-tron/forge/color/ColorDiscPicker, @nyc-tron/shell/SliderField

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/color/ColorGradingWheels
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ColorGradingWheels } from "@/components/nyc-tron/ui/components/forge/color/ColorGradingWheels";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ColorGradingWheels } from "@nyc-tron/ui/components/forge/color/ColorGradingWheels";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/ColorGradingWheels.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `ColorGrade` | not recorded | yes |  |
| `onCommit` | `(value: ColorGrade) => void` | not recorded | yes |  |
| `onPreview` | `(value: ColorGrade \| undefined) => void` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/ColorGradingWheels.tsx -->
- `accessibilityRole`: "header"
- `aria-label`: "Grading model"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
