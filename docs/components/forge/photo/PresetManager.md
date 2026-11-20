---
name: "PresetManager"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/photo/PresetManager"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# PresetManager

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/PresetManager.tsx -->
Versioned preset transfer with validation before any host write, plus rename/delete.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/PresetManager.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/photo/PresetManager
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PresetManager } from "@/components/nyc-tron/ui/components/forge/photo/PresetManager";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PresetManager } from "@nyc-tron/ui/components/forge/photo/PresetManager";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/PresetManager.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `presets` | `readonly PhotoPreset[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onRename` | `(id: string, name: string, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
| `onDelete` | `(id: string, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
| `onReadImport` | `(signal: AbortSignal) => string \| Promise<string>` | not recorded | yes |  |
| `onImport` | `(preset: PhotoPreset, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
| `onExport` | `(payload: string, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/PresetManager.tsx -->
- `accessibilityLabel`: "Photo preset name"
- `aria-disabled`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
