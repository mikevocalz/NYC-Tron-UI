---
name: "ParametricConstraintEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/cad/ParametricConstraintEditor"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector"]
a11yStatus: "unverified"
---

# ParametricConstraintEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/cad/ParametricConstraintEditor.tsx -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/cad/ParametricConstraintEditor.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/cad/ParametricConstraintEditor
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { ParametricConstraintEditor } from "@/components/nyc-tron/ui/components/forge/cad/ParametricConstraintEditor";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { ParametricConstraintEditor } from "@nyc-tron/ui/components/forge/cad/ParametricConstraintEditor";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/cad/ParametricConstraintEditor.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `constraints` | `readonly ParametricConstraint[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `kinds` | `readonly { id: string; label: string; canCreate: boolean; }[]` | not recorded | yes |  |
| `solver` | `{ status: 'dirty' \| 'solving' \| 'solved' \| 'conflict' \| 'error'; revision: string \| number; degreesOfFreedom: number \| null; conflicts: readonly { id: string; label: string; constraintIds: readonly string[]; }[]; }` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onCommit` | `(value: ParametricConstraint, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onAdd` | `(kind: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRemove` | `(id: string, signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onSolve` | `(signal?: AbortSignal) => unknown` | not recorded | yes |  |
| `onRevealConflict` | `(ids: readonly string[]) => void` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/cad/ParametricConstraintEditor.tsx -->
- `accessibilityLiveRegion`: "polite"
- `accessibilityState`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
