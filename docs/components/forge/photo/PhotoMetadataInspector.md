---
name: "PhotoMetadataInspector"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/photo/PhotoMetadataInspector"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "color.textMuted", "radius.control", "space.0.5", "space.2"]
registryDependencies: ["@nyc-tron/Button"]
a11yStatus: "declared"
---

# PhotoMetadataInspector

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/PhotoMetadataInspector.tsx -->
Read-only original EXIF/provenance, with a separate host-owned editing annotation.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/PhotoMetadataInspector.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PhotoMetadataInspector } from "@nyc-tron/ui/forge/photo/PhotoMetadataInspector";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button

```sh
npx shadcn@latest add @nyc-tron/forge/photo/PhotoMetadataInspector
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/PhotoMetadataInspector.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `PhotoMetadata` | not recorded | yes |  |
| `annotation` | `string` | not recorded | yes |  |
| `onAnnotationCommit` | `(annotation: string) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/PhotoMetadataInspector.tsx -->
- `accessibilityLabel`: "Photo editing annotation"
- `accessibilityRole`: "header"
- `aria-disabled`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
