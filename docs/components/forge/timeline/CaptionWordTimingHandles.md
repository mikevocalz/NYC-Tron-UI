---
name: "CaptionWordTimingHandles"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/CaptionWordTimingHandles"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/timeline/InOutRangeHandles"]
a11yStatus: "unverified"
---

# CaptionWordTimingHandles

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/CaptionWordTimingHandles.tsx -->
Frame-snapped word boundaries with neighboring-word collision checks.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/CaptionWordTimingHandles.tsx -->
- Package: @nyc-tron/ui
- Import: `import { CaptionWordTimingHandles } from "@nyc-tron/ui/components/forge/timeline/CaptionWordTimingHandles";`
- Peers: react, react-native, react-native-gesture-handler, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/timeline/InOutRangeHandles

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/CaptionWordTimingHandles
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/CaptionWordTimingHandles.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `words` | `readonly CaptionWord[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `durationFrames` | `number` | not recorded | yes |  |
| `frame` | `number` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `viewport` | `TimelineViewport` | not recorded | yes |  |
| `onPreview` | `(id: string, range: InOutRange \| undefined) => void` | not recorded | no |  |
| `onCommit` | `(id: string, timing: { startFrame: number; endFrame: number; }, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/CaptionWordTimingHandles.tsx -->
- `accessibilityLabel`: "Caption word timing"
- `accessibilityLiveRegion`: "polite"
- `accessibilityState`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
