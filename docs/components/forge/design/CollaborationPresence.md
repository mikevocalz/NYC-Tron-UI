---
name: "CollaborationPresence"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/design/CollaborationPresence"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["border.1", "border.3", "color.surfaceRaised", "color.text", "space.1", "space.2"]
registryDependencies: ["@nyc-tron/Button"]
a11yStatus: "declared"
---

# CollaborationPresence

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/design/CollaborationPresence.tsx -->
Geometry is already mapped into viewport points by the collaboration host; no wall-clock freshness inference.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/design/CollaborationPresence.tsx -->
- Package: @nyc-tron/ui
- Import: `import { CollaborationPresence } from "@nyc-tron/ui/forge/design/CollaborationPresence";`
- Peers: react, react-native
- Requires: @nyc-tron/Button

```sh
npx shadcn@latest add @nyc-tron/forge/design/CollaborationPresence
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/design/CollaborationPresence.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `participants` | `readonly DesignPresence[]` | not recorded | yes |  |
| `viewport` | `{ width: number; height: number; }` | not recorded | yes |  |
| `onFollow` | `(id: string) => void` | not recorded | yes |  |
| `followingId` | `string` | not recorded | no |  |
| `connection` | `'connected' \| 'reconnecting' \| 'offline'` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/design/CollaborationPresence.tsx -->
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
