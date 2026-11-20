---
name: "CoverFramePicker"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/CoverFramePicker"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/layers/LayerThumbnail", "@nyc-tron/forge/timeline/VideoFilmstrip"]
a11yStatus: "unverified"
---

# CoverFramePicker

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/CoverFramePicker.tsx -->
Chooses actual source frames/assets; applying the exported cover remains an engine transaction.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/CoverFramePicker.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/layers/LayerThumbnail, @nyc-tron/forge/timeline/VideoFilmstrip

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/CoverFramePicker
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { CoverFramePicker } from "@/components/nyc-tron/ui/components/forge/timeline/CoverFramePicker";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { CoverFramePicker } from "@nyc-tron/ui/components/forge/timeline/CoverFramePicker";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/CoverFramePicker.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `VideoCover \| null` | not recorded | yes |  |
| `frame` | `number` | not recorded | yes |  |
| `preview` | `ReactNode` | not recorded | yes |  |
| `filmstrip` | `Omit<VideoFilmstripProps, 'scope' \| 'revision' \| 'onSeek'>` | not recorded | yes |  |
| `images` | `readonly { id: string; label: string; source: ThumbnailSource; }[]` | not recorded | yes |  |
| `onSeek` | `(frame: number, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onPickImage` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onCommit` | `(cover: VideoCover, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/CoverFramePicker.tsx -->
- `accessibilityLabel`: "Video cover"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
