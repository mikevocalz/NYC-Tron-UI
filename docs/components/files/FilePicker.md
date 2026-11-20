---
name: "FilePicker"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/files/FilePicker"
tier: 2
docs: "generated"
platforms: ["ios", "android", "web"]
category: "primitive"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "radius.control"]
registryDependencies: []
a11yStatus: "declared"
---

# FilePicker

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/files/FilePicker.native.tsx,packages/ui/src/components/files/FilePicker.types.ts,packages/ui/src/components/files/FilePicker.web.tsx -->
iOS and Android: a button that opens the OS document picker through `documentSource` and hands the picked URIs to `onDocuments`.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/files/FilePicker.native.tsx,packages/ui/src/components/files/FilePicker.types.ts,packages/ui/src/components/files/FilePicker.web.tsx -->
- Package: @nyc-tron/ui
- Import: `import { FilePicker } from "@nyc-tron/ui/files/FilePicker";`
- Peers: react, react-native, zustand
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/files/FilePicker
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/files/FilePicker.native.tsx,packages/ui/src/components/files/FilePicker.types.ts,packages/ui/src/components/files/FilePicker.web.tsx -->
| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | not recorded | yes | Visible text and accessible name, e.g. "Open". |
| `accept` | `string` | not recorded | no | HTML input syntax, e.g. ".docx,.nfd". |
| `multiple` | `boolean` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `onFiles` | `(files: File[]) => void` | not recorded | no | Web: called once per pick with at least one file; cancelling calls nothing. Without it web renders nothing. |
| `documentSource` | `NativeDocumentSource` | not recorded | no | iOS and Android: the OS document picker, e.g. `documentPickerSource(createPlatformDocuments())` from `@nyc-tron/platform-services/documents`. Native renders the button only when this and `onDocuments` are both set. Web ignores it. |
| `onDocuments` | `(documents: readonly NativeDocument[]) => void` | not recorded | no | iOS and Android: called once per pick with at least one document; cancelling calls nothing. |
| `onError` | `(error: Error) => void` | not recorded | no | iOS and Android: the picker failed (not a cancel). Without it the error is rethrown. |
| `accessibilityHint` | `string` | not recorded | no |  |
| `testID` | `string` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
| `labelClassName` | `string` | not recorded | no |  |
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
| `disabled` | `disabled` prop, type `boolean` |
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/files/FilePicker.native.tsx,packages/ui/src/components/files/FilePicker.types.ts,packages/ui/src/components/files/FilePicker.web.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "button"
- `accessibilityState`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
```tsx example=FilePicker
import { FilePicker } from "@nyc-tron/ui/files/FilePicker";

export function Example() {
  return <FilePicker label="" />;
}
```
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
