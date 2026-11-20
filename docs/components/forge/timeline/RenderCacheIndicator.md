---
name: "RenderCacheIndicator"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/RenderCacheIndicator"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# RenderCacheIndicator

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/RenderCacheIndicator.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/RenderCacheIndicator.tsx -->
- Package: @nyc-tron/ui
- Import: `import { RenderCacheIndicator } from "@nyc-tron/ui/components/forge/timeline/RenderCacheIndicator";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/RenderCacheIndicator
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/RenderCacheIndicator.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `jobs` | `readonly RenderCacheJob[]` | not recorded | yes |  |
| `quality` | `string` | not recorded | yes |  |
| `qualities` | `readonly { id: string; label: string; disabledReason?: string; }[]` | not recorded | yes |  |
| `onQualityChange` | `(quality: string, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onInvalidate` | `(id: string, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `onRetry` | `(id: string, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/RenderCacheIndicator.tsx -->
- `accessibilityLabel`: "Render cache"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
