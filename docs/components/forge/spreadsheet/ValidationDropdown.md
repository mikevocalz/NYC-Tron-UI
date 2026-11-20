---
name: "ValidationDropdown"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/spreadsheet/ValidationDropdown"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.text", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# ValidationDropdown

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/spreadsheet/ValidationDropdown.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/spreadsheet/ValidationDropdown.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/spreadsheet/ValidationDropdown
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ValidationDropdown } from "@/components/nyc-tron/ui/components/forge/spreadsheet/ValidationDropdown";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ValidationDropdown } from "@nyc-tron/ui/components/forge/spreadsheet/ValidationDropdown";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/spreadsheet/ValidationDropdown.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `string` | not recorded | yes |  |
| `choices` | `readonly { value: string; label: string; }[]` | not recorded | yes |  |
| `allowOther` | `boolean` | not recorded | yes |  |
| `allowBlank` | `boolean` | not recorded | yes |  |
| `validation` | `{ status: 'valid' \| 'invalid' \| 'checking'; message?: string; }` | not recorded | yes |  |
| `onCommit` | `(value: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/spreadsheet/ValidationDropdown.tsx -->
- `accessibilityLabel`: "Cell validation list", "Custom cell value"
- `accessibilityLiveRegion`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
