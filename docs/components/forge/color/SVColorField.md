---
name: "SVColorField"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/SVColorField"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.focus", "color.text", "color.textMuted", "opacity.0_5"]
registryDependencies: []
a11yStatus: "unverified"
---

# SVColorField

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/SVColorField.tsx -->
Two-dimensional saturation/value field with one commit on release and cancellation restoration.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/SVColorField.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/color/SVColorField
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { SVColorField } from "@/components/nyc-tron/ui/components/forge/color/SVColorField";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { SVColorField } from "@nyc-tron/ui/components/forge/color/SVColorField";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/SVColorField.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `HsvColor` | not recorded | yes |  |
| `onPreview` | `(value: HsvColor) => void` | not recorded | no |  |
| `onCommit` | `(value: HsvColor) => void` | not recorded | yes |  |
| `height` | `number` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/SVColorField.tsx -->
- `accessibilityLabel`: "Saturation and brightness"
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
