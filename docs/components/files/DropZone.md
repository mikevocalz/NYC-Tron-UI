---
name: "DropZone"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/files/DropZone"
tier: 2
docs: "generated"
platforms: ["ios", "android", "web"]
category: "primitive"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card"]
registryDependencies: ["@nyc-tron/files/FilePicker"]
a11yStatus: "unverified"
---

# DropZone

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/files/DropZone.native.tsx,packages/ui/src/components/files/DropZone.shared.tsx,packages/ui/src/components/files/DropZone.types.ts,packages/ui/src/components/files/DropZone.web.tsx -->
iOS and Android drop target over expo-drag-drop-content-view (optional peer, needs a dev or production build; Expo Go does not include it).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/files/DropZone.native.tsx,packages/ui/src/components/files/DropZone.shared.tsx,packages/ui/src/components/files/DropZone.types.ts,packages/ui/src/components/files/DropZone.web.tsx -->
- Package: @nyc-tron/ui
- Import: `import { DropZone } from "@nyc-tron/ui/components/files/DropZone";`
- Peers: @nyc-tron/core, expo-drag-drop-content-view, react, react-native, zustand
- Requires: @nyc-tron/files/FilePicker

```sh
npx shadcn@latest add @nyc-tron/files/DropZone
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/files/DropZone.native.tsx,packages/ui/src/components/files/DropZone.shared.tsx,packages/ui/src/components/files/DropZone.types.ts,packages/ui/src/components/files/DropZone.web.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | not recorded | no | Replaces the default copy and browse control. |
| `onDrop` | `(event: DropAssets) => void` | not recorded | no | One call per drop (or web pick), after `accept` and `allowedMimeTypes` filtering. |
| `onEnter` | `() => void` | not recorded | no | A drag carrying content entered the zone. |
| `onExit` | `() => void` | not recorded | no | The drag left, was dropped or was cancelled. |
| `onError` | `(error: Error, file: File) => void` | not recorded | no | Web: a dropped or picked file could not be read (base64). The others still arrive through `onDrop`. |
| `multiple` | `boolean` | `false` | no | Web: lets the built-in browse control pick several files. Drops always accept several. |
| `accept` | `string` | not recorded | no | HTML input syntax, e.g. ".docx,.nfd" or "image/*". Applied to drops and picks. |
| `allowedMimeTypes` | `(string \| RegExp)[]` | not recorded | no | Exact strings or RegExps, as in expo-drag-drop-content-view. |
| `includeBase64` | `boolean` | `false` | no |  |
| `disableObjectUrl` | `boolean` | `false` | no | Web only: skip creating blob URLs (the app reads `file` instead). |
| `disabled` | `boolean` | not recorded | no |  |
| `title` | `string` | `"Drop a file here"` | no | Default content headline. |
| `description` | `string` | not recorded | no |  |
| `browseLabel` | `string` | `"Choose a file"` | no | Web only: label of the file picker shown with the default content, the path for people who cannot drag (WCAG 2.5.7). |
| `className` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/files/DropZone.native.tsx,packages/ui/src/components/files/DropZone.shared.tsx,packages/ui/src/components/files/DropZone.types.ts,packages/ui/src/components/files/DropZone.web.tsx -->
- `aria-disabled`: set from an expression
- `aria-label`: set from an expression
- `role`: "group"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
```tsx example=DropZone
import { DropZone } from "@nyc-tron/ui/components/files/DropZone";

export function Example() {
  return <DropZone />;
}
```
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
