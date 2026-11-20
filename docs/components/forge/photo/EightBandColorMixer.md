---
name: "EightBandColorMixer"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/photo/EightBandColorMixer"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# EightBandColorMixer

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/EightBandColorMixer.tsx -->
Eight explicit color ranges; edits retain every other band's exact values.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/EightBandColorMixer.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/shell/UnitInput

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/photo/EightBandColorMixer
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { EightBandColorMixer } from "@/components/nyc-tron/ui/components/forge/photo/EightBandColorMixer";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { EightBandColorMixer } from "@nyc-tron/ui/components/forge/photo/EightBandColorMixer";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/EightBandColorMixer.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `EightBandSettings` | not recorded | yes |  |
| `onCommit` | `(value: EightBandSettings) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/EightBandColorMixer.tsx -->
- `accessibilityRole`: "header"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
