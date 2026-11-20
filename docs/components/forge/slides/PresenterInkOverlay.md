---
name: "PresenterInkOverlay"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/slides/PresenterInkOverlay"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.danger", "color.surfaceRaised", "color.text", "radius.5"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# PresenterInkOverlay

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/PresenterInkOverlay.tsx -->
Shared native recognizer/ink state owner.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/PresenterInkOverlay.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PresenterInkOverlay } from "@nyc-tron/ui/forge/slides/PresenterInkOverlay";`
- Peers: react, react-native, react-native-gesture-handler, zustand
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/slides/PresenterInkOverlay
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/PresenterInkOverlay.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `mode` | `PresenterInkMode` | not recorded | yes |  |
| `color` | `string` | not recorded | yes |  |
| `size` | `InkSize` | not recorded | yes |  |
| `strokes` | `readonly PresenterInkStroke[]` | not recorded | yes |  |
| `onStrokeCommit` | `(stroke: PresenterInkStroke, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onRemoveStrokes` | `(ids: readonly string[], signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onModeChange` | `(mode: PresenterInkMode) => void` | not recorded | yes |  |
| `onLaserPoint` | `(point: PresenterInkPoint \| null) => void` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `reducedMotion` | `boolean` | not recorded | no |  |
| `renderInk` | `(frame: PresenterInkFrame) => ReactNode` | not recorded | no | Optional renderer adapter; default portable Views are limited to 4096 points. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/PresenterInkOverlay.tsx -->
- `accessibilityLabel`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
