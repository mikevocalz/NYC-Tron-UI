---
name: "PanAndBalanceControl"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/PanAndBalanceControl"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/audio/PanControl", "@nyc-tron/forge/audio/SurroundPanView"]
a11yStatus: "unverified"
---

# PanAndBalanceControl

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/PanAndBalanceControl.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/PanAndBalanceControl.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/audio/PanControl, @nyc-tron/forge/audio/SurroundPanView

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/PanAndBalanceControl
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PanAndBalanceControl } from "@/components/nyc-tron/ui/components/forge/audio/PanAndBalanceControl";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PanAndBalanceControl } from "@nyc-tron/ui/components/forge/audio/PanAndBalanceControl";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/PanAndBalanceControl.tsx -->
Extends: `StereoPanAndBalanceProps | (`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `mode` | `'surround'` | not recorded | yes |  |
| `surround` | `SurroundPanViewProps` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/PanAndBalanceControl.tsx -->
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
