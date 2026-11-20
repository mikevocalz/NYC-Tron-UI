---
name: "LiveHistogram"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/LiveHistogram"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.danger", "color.primary", "color.text", "color.textMuted"]
registryDependencies: []
a11yStatus: "unverified"
---

# LiveHistogram

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/LiveHistogram.tsx -->
Renders bounded, count-preserving histograms; no fake signal or recurring UI timer.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/LiveHistogram.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/color/LiveHistogram
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { LiveHistogram } from "@/components/nyc-tron/ui/components/forge/color/LiveHistogram";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { LiveHistogram } from "@nyc-tron/ui/components/forge/color/LiveHistogram";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/LiveHistogram.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `channels` | `readonly HistogramChannel[]` | not recorded | yes |  |
| `domain` | `readonly [ number, number ]` | not recorded | yes |  |
| `logarithmic` | `boolean` | not recorded | no |  |
| `height` | `number` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/LiveHistogram.tsx -->
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
