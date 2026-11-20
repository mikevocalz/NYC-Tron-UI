---
name: "CameraAndLightControls"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/motion/CameraAndLightControls"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.textMuted"]
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# CameraAndLightControls

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/CameraAndLightControls.tsx -->
Lens/view/depth and lighting values, independent from native app window dimensions.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/CameraAndLightControls.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/shell/UnitInput

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/motion/CameraAndLightControls
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { CameraAndLightControls } from "@/components/nyc-tron/ui/components/forge/motion/CameraAndLightControls";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { CameraAndLightControls } from "@nyc-tron/ui/components/forge/motion/CameraAndLightControls";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/CameraAndLightControls.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `camera` | `MotionCamera` | not recorded | yes |  |
| `light` | `MotionLight` | not recorded | yes |  |
| `onCameraCommit` | `(value: MotionCamera) => void` | not recorded | yes |  |
| `onLightCommit` | `(value: MotionLight) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/CameraAndLightControls.tsx -->
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
