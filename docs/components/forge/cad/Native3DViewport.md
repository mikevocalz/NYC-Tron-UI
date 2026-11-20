---
name: "Native3DViewport"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/cad/Native3DViewport"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# Native3DViewport

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/Native3DViewport.tsx -->
Native gesture front end for an actual host 3D surface.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/Native3DViewport.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, react-native-gesture-handler, zustand
- Requires: @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/cad/Native3DViewport
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { Native3DViewport } from "@/components/nyc-tron/ui/components/forge/cad/Native3DViewport";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { Native3DViewport } from "@nyc-tron/ui/components/forge/cad/Native3DViewport";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/Native3DViewport.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `surface` | `ReactNode` | not recorded | yes |  |
| `interaction` | `'orbit' \| 'pan' \| 'select'` | not recorded | yes |  |
| `onInteractionChange` | `(mode: 'orbit' \| 'pan' \| 'select') => void` | not recorded | yes |  |
| `onCameraGesture` | `(event: ViewportCameraGesture) => void` | not recorded | yes |  |
| `onPick` | `(point: { x: number; y: number; }, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `materialModes` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `materialModeId` | `string` | not recorded | yes |  |
| `onMaterialModeChange` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `status` | `'loading' \| 'ready' \| 'error'` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/Native3DViewport.tsx -->
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
