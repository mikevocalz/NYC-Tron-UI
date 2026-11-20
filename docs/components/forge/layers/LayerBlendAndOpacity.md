---
name: "LayerBlendAndOpacity"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/layers/LayerBlendAndOpacity"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber", "@nyc-tron/shell/MenuButton"]
a11yStatus: "unverified"
---

# LayerBlendAndOpacity

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/layers/LayerBlendAndOpacity.tsx -->
Compositing policy requests, not document-profile assignment or pixel conversion.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/layers/LayerBlendAndOpacity.tsx -->
- Package: @nyc-tron/ui
- Import: `import { LayerBlendAndOpacity } from "@nyc-tron/ui/components/forge/layers/LayerBlendAndOpacity";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber, @nyc-tron/shell/MenuButton

```sh
npx shadcn@latest add @nyc-tron/forge/layers/LayerBlendAndOpacity
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/layers/LayerBlendAndOpacity.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `revision` | `string \| number` | not recorded | no |  |
| `layerId` | `string` | not recorded | yes |  |
| `value` | `LayerBlendValue` | not recorded | yes |  |
| `modes` | `readonly LayerBlendMode[]` | not recorded | yes |  |
| `spaces` | `readonly LayerBlendSpace[]` | not recorded | yes |  |
| `alphaModes` | `readonly LayerAlphaOption[]` | `defaultAlphaModes (Straight and Premultiplied, both available)` | no | Alpha representations the compositor accepts, one or two entries. One entry renders as plain text instead of a menu. An entry with `unavailableReason` is listed disabled with its reason. When every entry is unavailable the control renders as text too, so no menu opens onto nothing. `value.alphaMode` must be in the catalog. |
| `onPreview` | `(value: LayerBlendValue) => void` | not recorded | no |  |
| `onCommit` | `(value: LayerBlendValue, detail: { kind: 'mode' \| 'opacity' \| 'space' \| 'alpha'; }, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes | One host transaction. Respect the signal before applying an asynchronous result. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/layers/LayerBlendAndOpacity.tsx -->
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "alert"
- `accessibilityValue`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
