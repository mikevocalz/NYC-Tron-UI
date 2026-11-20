---
name: "OptionGroupsModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forms/option-groups"
tier: 2
docs: "generated"
platforms: []
category: "primitive"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# OptionGroupsModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forms/option-groups.ts -->
Options under a visible heading, as a select or dropdown shows them.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forms/option-groups.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forms/option-groups
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { flattenOptionGroups, validateOptionGroups } from "@/components/nyc-tron/ui/components/forms/option-groups";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { flattenOptionGroups, validateOptionGroups } from "@nyc-tron/ui/components/forms/option-groups";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forms/option-groups.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `OptionGroup` | interface | `interface OptionGroup<T> { readonly heading: string; readonly options: readonly T[]; }` |
| `flattenOptionGroups` | function | `function flattenOptionGroups<T>(groups: readonly OptionGroup<T>[]): T[];` |
| `validateOptionGroups` | function | `function validateOptionGroups<T>(groups: readonly OptionGroup<T>[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forms/option-groups.ts -->
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
