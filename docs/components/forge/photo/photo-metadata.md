---
name: "PhotoMetadataModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/photo/photo-metadata"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# PhotoMetadataModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/photo-metadata.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/photo-metadata.ts -->
- Package: @nyc-tron/ui
- Import: `import { validatePhotoMetadata } from "@nyc-tron/ui/forge/photo/photo-metadata";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/photo/photo-metadata
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/photo-metadata.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `PhotoMetadata` | interface | `interface PhotoMetadata { readonly photoId: string; readonly revision: string \| number; readonly fileName: string; readonly mimeType: string \| null; readonly...` |
| `PhotoProvenanceEntry` | interface | `interface PhotoProvenanceEntry { readonly id: string; readonly label: string; readonly value: string; }` |
| `validatePhotoMetadata` | function | `function validatePhotoMetadata(value: PhotoMetadata): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/photo-metadata.ts -->
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
