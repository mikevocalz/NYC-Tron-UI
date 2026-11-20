---
name: "FootnoteCitationEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/FootnoteCitationEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# FootnoteCitationEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/FootnoteCitationEditor.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/FootnoteCitationEditor.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/document/FootnoteCitationEditor
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { FootnoteCitationEditor } from "@/components/nyc-tron/ui/components/forge/document/FootnoteCitationEditor";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { FootnoteCitationEditor } from "@nyc-tron/ui/components/forge/document/FootnoteCitationEditor";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/FootnoteCitationEditor.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `sources` | `readonly CitationSource[]` | not recorded | yes |  |
| `notes` | `readonly { id: string; numberLabel: string; text: string; kind: 'footnote' \| 'endnote'; }[]` | not recorded | yes |  |
| `styleId` | `string` | not recorded | yes |  |
| `styles` | `readonly { id: string; label: string; }[]` | not recorded | yes |  |
| `onStyleCommit` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onInsertCitation` | `(sourceId: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onInsertNote` | `(kind: 'footnote' \| 'endnote', signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onNoteCommit` | `(id: string, text: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onJumpToNote` | `(id: string) => void` | not recorded | yes |  |
| `onUpdateBibliography` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/FootnoteCitationEditor.tsx -->
- `accessibilityLabel`: "Footnotes and citations", "Search reference sources"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
