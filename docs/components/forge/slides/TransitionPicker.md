---
name: "TransitionPicker"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/TransitionPicker"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# TransitionPicker

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/TransitionPicker.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/TransitionPicker.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/slides/TransitionPicker
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { TransitionPicker } from "@/components/nyc-tron/ui/components/forge/slides/TransitionPicker";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { TransitionPicker } from "@nyc-tron/ui/components/forge/slides/TransitionPicker";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/TransitionPicker.tsx -->
Extends: `Omit<PropertyInspectorProps, 'label' | 'fields' | 'onCommit'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `SlideTransition` | not recorded | yes |  |
| `effects` | `readonly { id: string; label: string; minDurationMs: number; maxDurationMs: number; unavailableReason?: string; }[]` | not recorded | yes |  |
| `previewProgress` | `number` | not recorded | yes |  |
| `renderPreview` | `(value: SlideTransition, progress: number) => ReactNode` | not recorded | yes |  |
| `onCommit` | `(value: SlideTransition, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onPreview` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/TransitionPicker.tsx -->
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
