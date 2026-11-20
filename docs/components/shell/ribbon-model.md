---
name: "RibbonModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/ribbon-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: ["@nyc-tron/overlays/CommandPopover"]
a11yStatus: "unverified"
---

# RibbonModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/ribbon-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/ribbon-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { inlineGalleryItems, ribbonTabLabel, validateRibbon } from "@nyc-tron/ui/components/shell/ribbon-model";`
- Peers: react, react-native
- Requires: @nyc-tron/overlays/CommandPopover

```sh
npx shadcn@latest add @nyc-tron/shell/ribbon-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/ribbon-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `RibbonButton` | interface | `interface RibbonButton { readonly kind: "button"; readonly id: string; readonly label: string; readonly icon?: ReactNode; readonly pressed?: boolean; readonl...` |
| `RibbonCommand` | type | `type RibbonCommand = RibbonButton \| RibbonSplit \| RibbonGallery;` |
| `RibbonGallery` | interface | `interface RibbonGallery { readonly kind: "gallery"; readonly id: string; readonly label: string; readonly items: readonly RibbonGalleryItem[]; readonly selec...` |
| `RibbonGalleryItem` | interface | `interface RibbonGalleryItem { readonly id: string; readonly label: string; readonly preview: ReactNode; }` |
| `RibbonGroup` | interface | `interface RibbonGroup { readonly id: string; readonly label: string; readonly commands: readonly RibbonCommand[]; }` |
| `RibbonSplit` | interface | `interface RibbonSplit { readonly kind: "split"; readonly id: string; readonly label: string; readonly icon?: ReactNode; readonly items: readonly CommandMenuI...` |
| `RibbonTab` | interface | `interface RibbonTab { readonly id: string; readonly label: string; readonly contextualGroup?: string; readonly groups: readonly RibbonGroup[]; }` |
| `inlineGalleryItems` | function | `function inlineGalleryItems(gallery: RibbonGallery): readonly RibbonGalleryItem[];` |
| `ribbonTabLabel` | function | `function ribbonTabLabel(tab: RibbonTab): string;` |
| `validateRibbon` | function | `function validateRibbon(tabs: readonly RibbonTab[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/ribbon-model.ts -->
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
