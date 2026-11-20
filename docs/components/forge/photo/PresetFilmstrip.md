---
name: "PresetFilmstrip"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/photo/PresetFilmstrip"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "color.textMuted", "space.1", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# PresetFilmstrip

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/photo/PresetFilmstrip.tsx -->
Horizontal photo preset previews with explicit cancellable apply to the selected photo set.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/photo/PresetFilmstrip.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PresetFilmstrip } from "@nyc-tron/ui/forge/photo/PresetFilmstrip";`
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/photo/PresetFilmstrip
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/photo/PresetFilmstrip.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `presets` | `readonly FilmstripPreset[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `photoIds` | `readonly string[]` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onPreview` | `(id: string \| undefined) => void` | not recorded | yes |  |
| `onFavoriteChange` | `(id: string, favorite: boolean) => void` | not recorded | yes |  |
| `onApply` | `(presetId: string, photoIds: readonly string[], signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/photo/PresetFilmstrip.tsx -->
- `accessibilityLabel`: "Photo preset filmstrip"
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
