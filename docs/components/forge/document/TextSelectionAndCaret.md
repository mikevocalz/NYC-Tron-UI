---
name: "TextSelectionAndCaret"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/document/TextSelectionAndCaret"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# TextSelectionAndCaret

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/document/TextSelectionAndCaret.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/document/TextSelectionAndCaret.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/forge/inputs/PropertyInspector

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/document/TextSelectionAndCaret
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { TextSelectionAndCaret } from "@/components/nyc-tron/ui/components/forge/document/TextSelectionAndCaret";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { TextSelectionAndCaret } from "@nyc-tron/ui/components/forge/document/TextSelectionAndCaret";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/document/TextSelectionAndCaret.tsx -->
Extends: `ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `initialText` | `string` | not recorded | yes | Native buffer seed. Change contentRevision to replace external content intentionally. |
| `contentRevision` | `string \| number` | not recorded | yes |  |
| `selection` | `DocumentTextSelection` | not recorded | yes |  |
| `onTextChange` | `(text: string) => void` | not recorded | yes |  |
| `onSelectionChange` | `(selection: DocumentTextSelection) => void` | not recorded | yes |  |
| `onContentSizeChange` | `(size: { width: number; height: number; }) => void` | not recorded | no |  |
| `onFocus` | `() => void` | not recorded | no |  |
| `onBlur` | `() => void` | not recorded | no |  |
| `label` | `string` | not recorded | yes |  |
| `readOnly` | `boolean` | not recorded | no |  |
| `direction` | `'auto' \| 'ltr' \| 'rtl'` | not recorded | no |  |
| `showSelectionFields` | `boolean` | not recorded | no |  |
| `editorRef` | `Ref<ComponentRef<typeof TextInput>>` | not recorded | no |  |
| `inputStyle` | `StyleProp<TextStyle>` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
| `nativeInputProps` | `Pick<TextInputProps, 'autoCorrect' \| 'spellCheck' \| 'autoCapitalize' \| 'keyboardType' \| 'returnKeyType' \| 'textContentType' \| 'scrollEnabled'>` | not recorded | no | Native IME/selection remain owned by this actual TextInput, not emulated handles. |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
| State | How it is set |
|---|---|
| `readOnly` | `readOnly` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/document/TextSelectionAndCaret.tsx -->
- `accessibilityLabel`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
