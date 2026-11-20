---
name: "MorphPreview"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/MorphPreview"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# MorphPreview

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/MorphPreview.tsx -->
Correspondence editing and source-rendered morph frames; no second animation clock or substitute thumbnails.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/MorphPreview.tsx -->
- Package: @nyc-tron/ui
- Import: `import { MorphPreview } from "@nyc-tron/ui/components/forge/slides/MorphPreview";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/slides/MorphPreview
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/MorphPreview.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `sources` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `targets` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `matches` | `readonly MorphMatch[]` | not recorded | yes |  |
| `progress` | `number` | not recorded | yes |  |
| `playing` | `boolean` | not recorded | yes |  |
| `durationMs` | `number` | not recorded | yes |  |
| `unavailableReason` | `string` | not recorded | no |  |
| `renderFrame` | `(progress: number, matches: readonly MorphMatch[]) => ReactNode` | not recorded | yes |  |
| `onMatchCommit` | `(matches: readonly MorphMatch[], signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onScrub` | `(progress: number) => void` | not recorded | yes |  |
| `onPlay` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/MorphPreview.tsx -->
- `accessibilityLabel`: "Slide morph preview"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
