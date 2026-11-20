---
name: "LiveNodeThumbnail"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/cad/LiveNodeThumbnail"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# LiveNodeThumbnail

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/LiveNodeThumbnail.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/LiveNodeThumbnail.tsx -->
- Package: @nyc-tron/ui
- Import: `import { LiveNodeThumbnail } from "@nyc-tron/ui/components/forge/cad/LiveNodeThumbnail";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/cad/LiveNodeThumbnail
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/LiveNodeThumbnail.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `nodeId` | `string` | not recorded | yes |  |
| `label` | `string` | not recorded | yes |  |
| `status` | `'dirty' \| 'waiting' \| 'cooking' \| 'ready' \| 'error'` | not recorded | yes |  |
| `progress` | `number` | not recorded | yes |  |
| `dependencyStatus` | `readonly { id: string; label: string; ready: boolean; }[]` | not recorded | yes |  |
| `preview` | `ReactNode` | not recorded | yes |  |
| `previewRevision` | `string \| number` | not recorded | no |  |
| `error` | `string` | not recorded | no |  |
| `onCook` | `(nodeId: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCancel` | `(nodeId: string) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/LiveNodeThumbnail.tsx -->
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
