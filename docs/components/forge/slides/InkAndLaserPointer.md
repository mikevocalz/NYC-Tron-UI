---
name: "InkAndLaserPointer"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/InkAndLaserPointer"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/canvas/GPUCanvasViewport", "@nyc-tron/forge/slides/PresenterInkOverlay"]
a11yStatus: "unverified"
---

# InkAndLaserPointer

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/InkAndLaserPointer.tsx -->
Native RNGH input with the shared Graphite renderer.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/InkAndLaserPointer.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, react-native-skia
- Requires: @nyc-tron/forge/canvas/GPUCanvasViewport, @nyc-tron/forge/slides/PresenterInkOverlay

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/slides/InkAndLaserPointer
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { InkAndLaserPointer } from "@/components/nyc-tron/ui/components/forge/slides/InkAndLaserPointer";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { InkAndLaserPointer } from "@nyc-tron/ui/components/forge/slides/InkAndLaserPointer";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/InkAndLaserPointer.tsx -->
Extends: `Omit<PresenterInkOverlayProps, 'renderInk'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `laserColor` | `string` | not recorded | yes |  |
| `capture` | `boolean` | not recorded | yes |  |
| `onCaptureStroke` | `(stroke: PresenterInkStroke, signal?: AbortSignal) => unknown` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/InkAndLaserPointer.tsx -->
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
