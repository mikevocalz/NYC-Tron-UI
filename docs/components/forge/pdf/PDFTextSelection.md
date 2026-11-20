---
name: "PDFTextSelection"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/pdf/PDFTextSelection"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# PDFTextSelection

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/PDFTextSelection.tsx -->
Native PDF reading order and glyph rectangles are supplied by the renderer; Unicode offsets stay explicitly typed.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/PDFTextSelection.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/PDFTextSelection
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PDFTextSelection } from "@/components/nyc-tron/ui/components/forge/pdf/PDFTextSelection";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PDFTextSelection } from "@nyc-tron/ui/components/forge/pdf/PDFTextSelection";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/PDFTextSelection.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `surface` | `ReactNode` | not recorded | yes |  |
| `pageId` | `string` | not recorded | yes |  |
| `selection` | `{ text: string; start: number; end: number; rects: readonly PDFRect[]; offsetUnit: 'utf16' \| 'unicode-scalar'; } \| null` | not recorded | yes |  |
| `textLength` | `number` | not recorded | yes |  |
| `canCopy` | `boolean` | not recorded | yes |  |
| `copyRestriction` | `string` | not recorded | no |  |
| `scale` | `number` | not recorded | yes |  |
| `onCopy` | `(text: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRangeCommit` | `(start: number, end: number, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `unstyled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/PDFTextSelection.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "PDF text selection"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
