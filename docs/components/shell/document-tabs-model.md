---
name: "DocumentTabsModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/document-tabs-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# DocumentTabsModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/document-tabs-model.ts -->
One open document in a {@linkcode DocumentTabBar}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/document-tabs-model.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/document-tabs-model
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { activeAfterClose, documentTabLabel, moveDocument, validateDocumentTabs } from "@/components/nyc-tron/ui/components/shell/document-tabs-model";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { activeAfterClose, documentTabLabel, moveDocument, validateDocumentTabs } from "@nyc-tron/ui/components/shell/document-tabs-model";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/document-tabs-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `DocumentTab` | interface | `interface DocumentTab { readonly id: string; readonly title: string; readonly dirty?: boolean; readonly closable?: boolean; }` |
| `activeAfterClose` | function | `function activeAfterClose(ids: readonly string[], closing: string, active: string \| undefined): string \| undefined;` |
| `documentTabLabel` | function | `function documentTabLabel(tab: DocumentTab): string;` |
| `moveDocument` | function | `function moveDocument(ids: readonly string[], id: string, toIndex: number): readonly string[];` |
| `validateDocumentTabs` | function | `function validateDocumentTabs(tabs: readonly DocumentTab[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/document-tabs-model.ts -->
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
