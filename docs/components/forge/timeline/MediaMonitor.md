---
name: "MediaMonitor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/timeline/MediaMonitor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/timeline/SafeAreaOverlay", "@nyc-tron/forge/timeline/SeekBar", "@nyc-tron/forge/timeline/TimecodeDisplay", "@nyc-tron/forge/timeline/TransportControls"]
a11yStatus: "declared"
---

# MediaMonitor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/MediaMonitor.tsx -->
Shared monitor chrome.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/MediaMonitor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { MediaMonitor } from "@nyc-tron/ui/forge/timeline/MediaMonitor";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/timeline/SafeAreaOverlay, @nyc-tron/forge/timeline/SeekBar, @nyc-tron/forge/timeline/TimecodeDisplay, @nyc-tron/forge/timeline/TransportControls

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/MediaMonitor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/MediaMonitor.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `kind` | `'source' \| 'program'` | not recorded | yes |  |
| `sourceId` | `string \| null` | not recorded | yes |  |
| `label` | `string` | not recorded | yes |  |
| `frame` | `number` | not recorded | yes |  |
| `durationFrames` | `number` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `playing` | `boolean` | not recorded | yes |  |
| `presentedFrame` | `number` | not recorded | no | Last decoded frame actually presented, separate from the requested/clock frame. |
| `status` | `'empty' \| 'loading' \| 'ready' \| 'error'` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
| `surface` | `ReactNode` | not recorded | yes | Actual native video/compositor surface owned by the consuming host. |
| `aspectRatio` | `number` | not recorded | yes |  |
| `overlays` | `ReactNode` | not recorded | no |  |
| `onPlayPause` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onStop` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onSeek` | `(frame: number, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onScrub` | `(frame: number) => void` | not recorded | no |  |
| `onOpenSource` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | no |  |
| `range` | `InOutRange` | not recorded | no |  |
| `onRangeChange` | `(range: InOutRange, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | no |  |
| `safeArea` | `Omit<SafeAreaOverlayProps, 'aspect'>` | not recorded | no |  |
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
| `error` | `error` prop, type `string` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/MediaMonitor.tsx -->
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
