---
name: "PDFReadAloudTransport"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/PDFReadAloudTransport"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: ["@nyc-tron/forge/office/ReadAloudTransport", "@nyc-tron/forge/office/office-controls"]
a11yStatus: "unverified"
---

# PDFReadAloudTransport

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/PDFReadAloudTransport.tsx -->
Read Aloud for a PDF (K-18): the shared transport plus the page being read and previous/next page.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/PDFReadAloudTransport.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/forge/office/ReadAloudTransport, @nyc-tron/forge/office/office-controls

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/PDFReadAloudTransport
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PDFReadAloudTransport } from "@/components/nyc-tron/ui/components/forge/pdf/PDFReadAloudTransport";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PDFReadAloudTransport } from "@nyc-tron/ui/components/forge/pdf/PDFReadAloudTransport";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/PDFReadAloudTransport.tsx -->
Extends: `Omit<ReadAloudTransportProps, "context" | "label" | "accessory">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `pageCount` | `number` | not recorded | yes |  |
| `onJumpToPage` | `(page: number) => void` | not recorded | no | Restarts reading at the first sentence of `page` (0-based). The page buttons render only when this is passed. |
| `label` | `string` | `"Read PDF aloud"` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/PDFReadAloudTransport.tsx -->
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
