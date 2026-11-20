---
name: "AssetBrowserModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/asset-browser-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# AssetBrowserModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/asset-browser-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/asset-browser-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/asset-browser-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { assetDisplayName, filterAssets, formatAssetBytes, selectAsset } from "@/components/nyc-tron/ui/components/shell/asset-browser-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { assetDisplayName, filterAssets, formatAssetBytes, selectAsset } from "@nyc-tron/ui/components/shell/asset-browser-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/asset-browser-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `AssetEntry` | interface | `interface AssetEntry { readonly id: string; readonly name: string; readonly kind: "file" \| "folder"; readonly mediaType?: string; readonly byteLength?: numbe...` |
| `AssetLocation` | interface | `interface AssetLocation { readonly id: string; readonly label: string; }` |
| `AssetRequest` | interface | `interface AssetRequest { readonly locationId: string; readonly expectedRevision: string; readonly entry: AssetEntry; }` |
| `AssetSort` | type | `type AssetSort = "name" \| "modified" \| "size";` |
| `assetDisplayName` | const | `const assetDisplayName: (name: string) => string;` |
| `filterAssets` | function | `function filterAssets(entries: readonly AssetEntry[], query: string, sort: AssetSort): readonly AssetEntry[];` |
| `formatAssetBytes` | function | `function formatAssetBytes(bytes: number): string;` |
| `selectAsset` | function | `function selectAsset(visible: readonly AssetEntry[], selected: readonly string[], id: string, mode: "replace" \| "toggle" \| "range", anchor: string \| null): r...` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/asset-browser-model.ts -->
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
