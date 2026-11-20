---
name: "SlideNotesEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/SlideNotesEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/forge/document/RichTextRibbon", "@nyc-tron/forge/document/TextSelectionAndCaret"]
a11yStatus: "unverified"
---

# SlideNotesEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/SlideNotesEditor.tsx -->
Native notes buffer or an explicit rich-text native editor, sharing the formatting ribbon.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/SlideNotesEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SlideNotesEditor } from "@nyc-tron/ui/components/forge/slides/SlideNotesEditor";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/forge/document/RichTextRibbon, @nyc-tron/forge/document/TextSelectionAndCaret

```sh
npx shadcn@latest add @nyc-tron/forge/slides/SlideNotesEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/SlideNotesEditor.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `slideLabel` | `string` | not recorded | yes |  |
| `editor` | `TextSelectionAndCaretProps` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/SlideNotesEditor.tsx -->
- `accessibilityLabel`: "Speaker notes: "
- `accessibilityRole`: "header"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
