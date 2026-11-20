---
name: "LocalMaskBrush"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/photo/LocalMaskBrush"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# LocalMaskBrush

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/LocalMaskBrush.tsx -->
Native responder-backed add/subtract marks with bounded radius, feather and force-preserving samples.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/LocalMaskBrush.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/photo/LocalMaskBrush
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { LocalMaskBrush } from "@/components/nyc-tron/ui/components/forge/photo/LocalMaskBrush";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { LocalMaskBrush } from "@nyc-tron/ui/components/forge/photo/LocalMaskBrush";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/LocalMaskBrush.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `photoId` | `string` | not recorded | yes |  |
| `revision` | `string` | not recorded | yes |  |
| `imageSize` | `PhotoImageSize` | not recorded | yes |  |
| `value` | `PhotoMaskBrushSettings` | not recorded | yes |  |
| `onChange` | `(settings: PhotoMaskBrushSettings) => void` | not recorded | yes |  |
| `onPreview` | `(stroke: PhotoMaskStroke \| undefined) => void` | not recorded | no |  |
| `onStrokeCommit` | `(stroke: PhotoMaskStroke, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
| `children` | `ReactNode` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/LocalMaskBrush.tsx -->
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
