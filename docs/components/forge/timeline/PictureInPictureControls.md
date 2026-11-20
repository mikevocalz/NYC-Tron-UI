---
name: "PictureInPictureControls"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/timeline/PictureInPictureControls"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# PictureInPictureControls

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/PictureInPictureControls.tsx -->
Reflects the OS-reported PiP state.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/PictureInPictureControls.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PictureInPictureControls } from "@nyc-tron/ui/forge/timeline/PictureInPictureControls";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/PictureInPictureControls
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/PictureInPictureControls.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `supported` | `boolean` | not recorded | yes |  |
| `unsupportedReason` | `string` | not recorded | no |  |
| `active` | `boolean` | not recorded | yes |  |
| `backgrounded` | `boolean` | not recorded | yes |  |
| `onEnter` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onExit` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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
| `active` | `active` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/PictureInPictureControls.tsx -->
- `accessibilityLabel`: "Picture in picture"
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
