---
name: "SlideThumbnail"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/SlideThumbnail"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.surfaceRaised", "color.text", "color.textMuted"]
registryDependencies: []
a11yStatus: "unverified"
---

# SlideThumbnail

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/SlideThumbnail.tsx -->
Small, non-interactive drawing of a slide built from its objects: text in place at scaled size, rectangles in their fill, images through `renderImage`.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/SlideThumbnail.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/slides/SlideThumbnail
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { SlideThumbnail, SlideObjectView } from "@/components/nyc-tron/ui/components/forge/slides/SlideThumbnail";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { SlideThumbnail, SlideObjectView } from "@nyc-tron/ui/components/forge/slides/SlideThumbnail";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/SlideThumbnail.tsx -->
| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `slide` | `SlideSummary` | not recorded | yes |  |
| `width` | `number` | not recorded | yes | Width in points; height follows the deck's aspect ratio. |
| `size` | `SlideSize` | not recorded | no |  |
| `renderImage` | `(src: string, object: SlideObject) => ReactNode` | not recorded | no | Draws an image object's picture; without it images show as a labelled frame. |
| `styled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/SlideThumbnail.tsx -->
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
