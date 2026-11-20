---
name: "MotionTrackingOverlay"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/MotionTrackingOverlay"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/selection/SelectionBounds"]
a11yStatus: "unverified"
---

# MotionTrackingOverlay

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/MotionTrackingOverlay.tsx -->
Actual tracking measurements over the host frame, plus scoped manual correction.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/MotionTrackingOverlay.tsx -->
- Package: @nyc-tron/ui
- Import: `import { MotionTrackingOverlay } from "@nyc-tron/ui/components/forge/timeline/MotionTrackingOverlay";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/selection/SelectionBounds

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/MotionTrackingOverlay
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/MotionTrackingOverlay.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `frame` | `number` | not recorded | yes |  |
| `playing` | `boolean` | not recorded | yes |  |
| `viewport` | `CanvasViewport` | not recorded | yes |  |
| `usableRegions` | `readonly Rect2D[]` | not recorded | no |  |
| `surface` | `ReactNode` | not recorded | yes |  |
| `seed` | `SelectionFrame` | not recorded | yes |  |
| `measurement` | `{ frame: number; bounds: SelectionFrame; confidence: number; } \| null` | not recorded | yes |  |
| `tracking` | `{ status: 'idle' \| 'running' \| 'ready' \| 'lost' \| 'error'; progress?: number; error?: string; }` | not recorded | yes |  |
| `onPreview` | `(frame: number, bounds: SelectionFrame \| undefined) => void` | not recorded | no |  |
| `onCorrect` | `(frame: number, bounds: SelectionFrame, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onTrack` | `(direction: 'forward' \| 'backward', frame: number, seed: SelectionFrame, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onStop` | `() => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/MotionTrackingOverlay.tsx -->
- `accessibilityLabel`: "Motion tracking"
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
