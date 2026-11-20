---
name: "PDFCompareOverlay"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/PDFCompareOverlay"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# PDFCompareOverlay

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/PDFCompareOverlay.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/PDFCompareOverlay.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/PDFCompareOverlay
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PDFCompareOverlay } from "@/components/nyc-tron/ui/components/forge/pdf/PDFCompareOverlay";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PDFCompareOverlay } from "@nyc-tron/ui/components/forge/pdf/PDFCompareOverlay";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/PDFCompareOverlay.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `leftDocumentId` | `string` | not recorded | yes |  |
| `rightDocumentId` | `string` | not recorded | yes |  |
| `beforeSurface` | `ReactNode` | not recorded | yes |  |
| `afterSurface` | `ReactNode` | not recorded | yes |  |
| `differenceSurface` | `ReactNode` | not recorded | no |  |
| `aspectRatio` | `number` | not recorded | yes |  |
| `mode` | `'overlay' \| 'side-by-side' \| 'difference'` | not recorded | yes |  |
| `opacity` | `number` | not recorded | yes |  |
| `changes` | `readonly { id: string; pageLabel: string; kind: 'insert' \| 'delete' \| 'change'; before: string; after: string; }[]` | not recorded | yes |  |
| `status` | `'comparing' \| 'ready' \| 'error'` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
| `onModeChange` | `(mode: PDFCompareOverlayProps['mode']) => void` | not recorded | yes |  |
| `onOpacityChange` | `(opacity: number) => void` | not recorded | yes |  |
| `onJump` | `(changeId: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/PDFCompareOverlay.tsx -->
- `accessibilityLabel`: "After PDF", "Before PDF", "PDF visual and text comparison"
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
