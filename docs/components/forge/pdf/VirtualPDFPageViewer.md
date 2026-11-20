---
name: "VirtualPDFPageViewer"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/VirtualPDFPageViewer"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# VirtualPDFPageViewer

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/VirtualPDFPageViewer.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/VirtualPDFPageViewer.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/VirtualPDFPageViewer
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { VirtualPDFPageViewer } from "@/components/nyc-tron/ui/components/forge/pdf/VirtualPDFPageViewer";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { VirtualPDFPageViewer } from "@nyc-tron/ui/components/forge/pdf/VirtualPDFPageViewer";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/VirtualPDFPageViewer.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `pages` | `readonly PDFPageDescriptor[]` | not recorded | yes |  |
| `currentPageId` | `string \| null` | not recorded | yes |  |
| `layout` | `PDFPageLayout` | not recorded | yes |  |
| `zoom` | `number` | not recorded | yes |  |
| `viewportHeight` | `number` | not recorded | no |  |
| `readingDirection` | `'ltr' \| 'rtl'` | not recorded | no |  |
| `renderPage` | `(page: PDFPageDescriptor, context: PDFPageSurfaceContext) => ReactNode` | not recorded | yes | Actual native PDF text/vector surface. The PDF document and renderer resources remain host owned. |
| `onVisiblePagesChange` | `(pageIds: readonly string[]) => void` | not recorded | yes |  |
| `onCurrentPageChange` | `(id: string) => void` | not recorded | yes |  |
| `revealRequest` | `{ pageId: string; token: string \| number; }` | not recorded | no |  |
| `status` | `'loading' \| 'ready' \| 'password-required' \| 'error'` | not recorded | yes |  |
| `error` | `string` | not recorded | no |  |
| `onRequestUnlock` | `() => void` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/VirtualPDFPageViewer.tsx -->
- `accessibilityLabel`: "PDF page viewer"
- `accessibilityLiveRegion`: "polite"
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
