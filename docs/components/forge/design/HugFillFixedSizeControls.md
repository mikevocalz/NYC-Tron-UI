---
name: "HugFillFixedSizeControls"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/design/HugFillFixedSizeControls"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# HugFillFixedSizeControls

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/design/HugFillFixedSizeControls.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/design/HugFillFixedSizeControls.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/forge/inputs/PropertyInspector

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/design/HugFillFixedSizeControls
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { HugFillFixedSizeControls } from "@/components/nyc-tron/ui/components/forge/design/HugFillFixedSizeControls";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { HugFillFixedSizeControls } from "@nyc-tron/ui/components/forge/design/HugFillFixedSizeControls";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/design/HugFillFixedSizeControls.tsx -->
Extends: `Omit<PropertyInspectorProps, 'label' | 'fields' | 'onCommit'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `x` | `AxisSizing` | not recorded | yes |  |
| `y` | `AxisSizing` | not recorded | yes |  |
| `onCommit` | `(axis: 'x' \| 'y', value: AxisSizing, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/design/HugFillFixedSizeControls.tsx -->
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
