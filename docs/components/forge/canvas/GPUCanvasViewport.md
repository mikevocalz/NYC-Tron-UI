---
name: "GPUCanvasViewport"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/canvas/GPUCanvasViewport"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.surfaceSunken", "color.text"]
registryDependencies: []
a11yStatus: "unverified"
---

# GPUCanvasViewport

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/GPUCanvasViewport.tsx -->
Actual Skia 3 Graphite surface.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/GPUCanvasViewport.tsx -->
- Package: @nyc-tron/ui
- Import: `import { GPUCanvasViewport } from "@nyc-tron/ui/components/forge/canvas/GPUCanvasViewport";`
- Peers: react, react-native, react-native-skia, zustand
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/GPUCanvasViewport
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/GPUCanvasViewport.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `revision` | `string \| number` | not recorded | no |  |
| `viewport` | `CanvasViewport` | not recorded | yes |  |
| `drawFrame` | `(canvas: SkCanvas, viewport: CanvasViewport) => void` | not recorded | yes | Draw a complete document frame synchronously. Canvas is borrowed until this call returns. |
| `clearColor` | `string` | not recorded | no | App-authored clear color; transparent by default. |
| `paused` | `boolean` | not recorded | no |  |
| `onGpuChange` | `(status: CanvasGpuStatus) => void` | not recorded | no |  |
| `onFrameSubmitted` | `(revision: string \| number) => void` | not recorded | no | Submission is queued for a display frame; this is not a presentation acknowledgement. |
| `onRenderError` | `(error: Error) => void` | not recorded | no |  |
| `renderUnavailable` | `(status: CanvasGpuStatus) => ReactNode` | not recorded | no |  |
| `label` | `string` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/GPUCanvasViewport.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "alert"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
