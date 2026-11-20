---
name: "ObjectSnapsAndOrtho"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/cad/ObjectSnapsAndOrtho"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# ObjectSnapsAndOrtho

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/ObjectSnapsAndOrtho.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/ObjectSnapsAndOrtho.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ObjectSnapsAndOrtho } from "@nyc-tron/ui/components/forge/cad/ObjectSnapsAndOrtho";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/cad/ObjectSnapsAndOrtho
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/ObjectSnapsAndOrtho.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `settings` | `DraftingSnapSettings` | not recorded | yes |  |
| `modes` | `readonly { id: string; label: string; available: boolean; }[]` | not recorded | yes |  |
| `candidate` | `{ kind: string; label: string; world: readonly [ number, number, number ]; distance: number; } \| null` | not recorded | yes |  |
| `renderFeedback` | `() => ReactNode` | not recorded | yes |  |
| `onCommit` | `(settings: DraftingSnapSettings, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/ObjectSnapsAndOrtho.tsx -->
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
