---
name: "LinearRadialGradientMask"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/photo/LinearRadialGradientMask"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/forge/vector/GradientOnCanvasHandles", "@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# LinearRadialGradientMask

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/LinearRadialGradientMask.tsx -->
Actual bounded mask-coverage preview plus the shared native geometry handles.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/LinearRadialGradientMask.tsx -->
- Package: @nyc-tron/ui
- Import: `import { LinearRadialGradientMask } from "@nyc-tron/ui/components/forge/photo/LinearRadialGradientMask";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Select, @nyc-tron/forge/vector/GradientOnCanvasHandles, @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/photo/LinearRadialGradientMask
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/LinearRadialGradientMask.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes | Photo identity and revision. Changing scope abandons an in-progress geometry edit. |
| `value` | `PhotoGradientMask` | not recorded | yes |  |
| `imageSize` | `PhotoImageSize` | not recorded | yes |  |
| `width` | `number` | not recorded | yes |  |
| `onCommit` | `(mask: PhotoGradientMask) => void` | not recorded | yes |  |
| `onPreview` | `(mask: PhotoGradientMask \| undefined) => void` | not recorded | no |  |
| `children` | `ReactNode` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/LinearRadialGradientMask.tsx -->
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
