---
name: "ParagraphRuler"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/ParagraphRuler"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.textMuted"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# ParagraphRuler

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/ParagraphRuler.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/ParagraphRuler.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, react-native-gesture-handler, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/document/ParagraphRuler
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ParagraphRuler } from "@/components/nyc-tron/ui/components/forge/document/ParagraphRuler";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ParagraphRuler } from "@nyc-tron/ui/components/forge/document/ParagraphRuler";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/ParagraphRuler.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `textWidth` | `number` | not recorded | yes |  |
| `value` | `ParagraphRulerValue` | not recorded | yes |  |
| `onCommit` | `(value: ParagraphRulerValue, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onAddTab` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/ParagraphRuler.tsx -->
- `accessibilityLabel`: "Paragraph ruler"
- `accessibilityRole`: "adjustable"
- `accessibilityState`: set from an expression
- `accessibilityValue`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
