---
name: "PreviewModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/preview-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PreviewModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/preview-model.ts -->
Presentational playback states for `AudioPreview`.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/preview-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { presentPreview } from "@nyc-tron/ui/components/forge/audio/preview-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/audio/preview-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/preview-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `PreviewAction` | type | `type PreviewAction = "play" \| "stop" \| "retry";` |
| `PreviewPresentation` | interface | `interface PreviewPresentation { readonly status: string; readonly action?: { readonly kind: PreviewAction; readonly label: string; }; readonly isBusy: boolea...` |
| `PreviewViewState` | type | `type PreviewViewState = { readonly kind: "empty"; readonly message?: string; } \| { readonly kind: "ready"; readonly durationMs: number; } \| { readonly kind: ...` |
| `presentPreview` | function | `function presentPreview(state: PreviewViewState): PreviewPresentation;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/preview-model.ts -->
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
