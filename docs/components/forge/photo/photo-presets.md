---
name: "PhotoPresetsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/photo/photo-presets"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PhotoPresetsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/photo-presets.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/photo-presets.ts -->
- Package: @nyc-tron/ui
- Import: `import { parsePhotoPreset, serializePhotoPreset, validatePhotoPreset, validatePhotoPresets, validatePhotoTargets } from "@nyc-tron/ui/forge/photo/photo-presets";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/photo/photo-presets
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/photo-presets.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `PhotoPreset` | interface | `interface PhotoPreset { readonly version: 1; readonly id: string; readonly name: string; readonly settings: PhotoDevelopSettings; }` |
| `parsePhotoPreset` | function | `function parsePhotoPreset(text: string): PhotoPreset;` |
| `serializePhotoPreset` | function | `function serializePhotoPreset(preset: PhotoPreset): string;` |
| `validatePhotoPreset` | function | `function validatePhotoPreset(preset: PhotoPreset): void;` |
| `validatePhotoPresets` | function | `function validatePhotoPresets(presets: readonly PhotoPreset[]): void;` |
| `validatePhotoTargets` | function | `function validatePhotoTargets(ids: readonly string[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/photo-presets.ts -->
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
