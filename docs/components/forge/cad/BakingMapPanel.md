---
name: "BakingMapPanel"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/cad/BakingMapPanel"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# BakingMapPanel

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/BakingMapPanel.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/BakingMapPanel.tsx -->
- Package: @nyc-tron/ui
- Import: `import { BakingMapPanel } from "@nyc-tron/ui/components/forge/cad/BakingMapPanel";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

```sh
npx shadcn@latest add @nyc-tron/forge/cad/BakingMapPanel
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/BakingMapPanel.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `maps` | `readonly { id: string; label: string; kind: 'ao' \| 'curvature' \| 'thickness' \| 'normal' \| 'position' \| 'custom'; selected: boolean; unavailableReason?: string; }[]` | not recorded | yes |  |
| `settings` | `BakeSettings` | not recorded | yes |  |
| `maxResolution` | `number` | not recorded | yes |  |
| `status` | `'idle' \| 'running' \| 'complete' \| 'error'` | not recorded | yes |  |
| `progress` | `number` | not recorded | yes |  |
| `outputs` | `readonly { id: string; mapId: string; label: string; width: number; height: number; }[]` | not recorded | yes |  |
| `onSettings` | `(value: BakeSettings, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onMapChange` | `(id: string, selected: boolean) => void` | not recorded | yes |  |
| `onBake` | `(mapIds: readonly string[], settings: BakeSettings, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onCancel` | `() => unknown` | not recorded | yes |  |
| `onReveal` | `(id: string) => void` | not recorded | yes |  |
| `renderOutput` | `(id: string) => ReactNode` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/BakingMapPanel.tsx -->
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
