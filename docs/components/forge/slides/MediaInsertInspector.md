---
name: "MediaInsertInspector"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/MediaInsertInspector"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector", "@nyc-tron/forge/timeline/InOutRangeHandles"]
a11yStatus: "unverified"
---

# MediaInsertInspector

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/MediaInsertInspector.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/MediaInsertInspector.tsx -->
- Package: @nyc-tron/ui
- Import: `import { MediaInsertInspector } from "@nyc-tron/ui/components/forge/slides/MediaInsertInspector";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector, @nyc-tron/forge/timeline/InOutRangeHandles

```sh
npx shadcn@latest add @nyc-tron/forge/slides/MediaInsertInspector
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/MediaInsertInspector.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `mediaId` | `string` | not recorded | yes |  |
| `kind` | `'video' \| 'audio'` | not recorded | yes |  |
| `sourceLabel` | `string` | not recorded | yes |  |
| `surface` | `ReactNode` | not recorded | yes |  |
| `aspectRatio` | `number` | not recorded | yes |  |
| `settings` | `SlideMediaSettings` | not recorded | yes |  |
| `durationFrames` | `number` | not recorded | yes |  |
| `frame` | `number` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `range` | `InOutRange` | not recorded | yes |  |
| `timelineWidth` | `number` | not recorded | yes |  |
| `status` | `'loading' \| 'ready' \| 'error'` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
| `onSettingsCommit` | `(value: SlideMediaSettings, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRangeCommit` | `(range: InOutRange, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onReplace` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onPreview` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/MediaInsertInspector.tsx -->
- `accessibilityLabel`: "Slide media settings"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
