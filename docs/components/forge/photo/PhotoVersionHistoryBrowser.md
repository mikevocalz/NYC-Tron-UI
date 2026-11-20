---
name: "PhotoVersionHistoryBrowser"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/photo/PhotoVersionHistoryBrowser"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# PhotoVersionHistoryBrowser

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/PhotoVersionHistoryBrowser.tsx -->
Read-only snapshots with explicit compare/restore; there is no original-delete operation.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/PhotoVersionHistoryBrowser.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/photo/PhotoVersionHistoryBrowser
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PhotoVersionHistoryBrowser } from "@/components/nyc-tron/ui/components/forge/photo/PhotoVersionHistoryBrowser";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PhotoVersionHistoryBrowser } from "@nyc-tron/ui/components/forge/photo/PhotoVersionHistoryBrowser";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/PhotoVersionHistoryBrowser.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `photoId` | `string` | not recorded | yes |  |
| `revision` | `string` | not recorded | yes |  |
| `versions` | `readonly PhotoVersion[]` | not recorded | yes |  |
| `originalVersionId` | `string \| null` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `currentId` | `string \| null` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onCompare` | `(version: PhotoVersion \| undefined) => void` | not recorded | yes |  |
| `onRestore` | `(version: PhotoVersion, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
| `height` | `number` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/PhotoVersionHistoryBrowser.tsx -->
- `accessibilityLabel`: "Photo edit versions"
- `accessibilityRole`: "radio"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
