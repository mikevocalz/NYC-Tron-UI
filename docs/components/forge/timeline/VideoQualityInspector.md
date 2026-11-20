---
name: "VideoQualityInspector"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/VideoQualityInspector"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# VideoQualityInspector

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/VideoQualityInspector.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/VideoQualityInspector.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/VideoQualityInspector
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { VideoQualityInspector } from "@/components/nyc-tron/ui/components/forge/timeline/VideoQualityInspector";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { VideoQualityInspector } from "@nyc-tron/ui/components/forge/timeline/VideoQualityInspector";`
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
