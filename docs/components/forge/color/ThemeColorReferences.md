---
name: "ThemeColorReferences"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/ThemeColorReferences"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.textMuted"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select"]
a11yStatus: "unverified"
---

# ThemeColorReferences

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/ThemeColorReferences.tsx -->
Binds theme tokens by identity; previews never replace references with literal colors.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/ThemeColorReferences.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ThemeColorReferences } from "@nyc-tron/ui/components/forge/color/ThemeColorReferences";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/Select

```sh
npx shadcn@latest add @nyc-tron/forge/color/ThemeColorReferences
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/ThemeColorReferences.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `references` | `readonly ThemeColorReference[]` | not recorded | yes |  |
| `referenceId` | `string \| null` | not recorded | yes |  |
| `onBind` | `(id: string) => void` | not recorded | yes |  |
| `onDetach` | `() => void` | not recorded | yes | Host materializes its current resolved color before removing the binding. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/ThemeColorReferences.tsx -->
- `accessibilityLiveRegion`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
