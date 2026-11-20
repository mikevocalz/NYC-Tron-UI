---
name: "MulticamAngleViewer"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/MulticamAngleViewer"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# MulticamAngleViewer

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/MulticamAngleViewer.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/MulticamAngleViewer.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/MulticamAngleViewer
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { MulticamAngleViewer } from "@/components/nyc-tron/ui/components/forge/timeline/MulticamAngleViewer";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { MulticamAngleViewer } from "@nyc-tron/ui/components/forge/timeline/MulticamAngleViewer";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/MulticamAngleViewer.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `angles` | `readonly MulticamAngle[]` | not recorded | yes |  |
| `selectedId` | `string` | not recorded | no |  |
| `frame` | `number` | not recorded | yes |  |
| `maxDriftFrames` | `number` | not recorded | no |  |
| `onSelect` | `(cut: { angleId: string; frame: number; offsetFrames: number; }, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/MulticamAngleViewer.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Multicam angles"
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
