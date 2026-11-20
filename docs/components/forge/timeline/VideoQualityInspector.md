---
name: "VideoQualityInspector"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/timeline/VideoQualityInspector"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.2"]
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# VideoQualityInspector

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/VideoQualityInspector.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/VideoQualityInspector.tsx -->
- Package: @nyc-tron/ui
- Import: `import { VideoQualityInspector } from "@nyc-tron/ui/forge/timeline/VideoQualityInspector";`
- Peers: react, react-native
- Requires: @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/VideoQualityInspector
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/VideoQualityInspector.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `media` | `{ width: number; height: number; bitDepth: number; frameRate: FrameRate; codec: string; colorSpace: string; bitrate?: number; }` | not recorded | yes |  |
| `preview` | `{ supported: boolean; reason?: string; }` | not recorded | yes |  |
| `profileId` | `string` | not recorded | yes |  |
| `profiles` | `readonly { id: string; label: string; unavailableReason?: string; }[]` | not recorded | yes |  |
| `warnings` | `readonly string[]` | not recorded | yes |  |
| `onProfileChange` | `(id: string, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/VideoQualityInspector.tsx -->
- `accessibilityLabel`: "Video quality"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
