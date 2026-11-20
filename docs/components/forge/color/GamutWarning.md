---
name: "GamutWarning"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/GamutWarning"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button"]
a11yStatus: "unverified"
---

# GamutWarning

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/GamutWarning.tsx -->
Announces the actual measured sample count; no guessed gamut test or clipping.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/GamutWarning.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/color/GamutWarning
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { GamutWarning } from "@/components/nyc-tron/ui/components/forge/color/GamutWarning";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { GamutWarning } from "@nyc-tron/ui/components/forge/color/GamutWarning";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/GamutWarning.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `report` | `GamutReport \| null` | not recorded | yes | null means measurement has not arrived, not that every color is in gamut. |
| `onInspect` | `() => void` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/GamutWarning.tsx -->
- `accessibilityLabel`: set from an expression
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
