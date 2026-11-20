---
name: "SelectionBounds"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/selection/SelectionBounds"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.focus", "color.primary", "color.surfaceRaised", "color.text", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# SelectionBounds

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/selection/SelectionBounds.tsx -->
Scope-safe move/resize/rotation handles.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/selection/SelectionBounds.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, react-native-gesture-handler, zustand
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/selection/SelectionBounds
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { SelectionBounds } from "@/components/nyc-tron/ui/components/forge/selection/SelectionBounds";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { SelectionBounds } from "@nyc-tron/ui/components/forge/selection/SelectionBounds";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/selection/SelectionBounds.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `revision` | `string \| number` | not recorded | no |  |
| `frame` | `SelectionFrame` | not recorded | yes |  |
| `viewport` | `CanvasViewport` | not recorded | yes |  |
| `onPreview` | `(frame: SelectionFrame \| undefined) => void` | not recorded | no |  |
| `onCommit` | `(frame: SelectionFrame, detail: { handle: SelectionHandle; source: 'pointer' \| 'keyboard' \| 'accessibility'; }) => void` | not recorded | yes |  |
| `limits` | `SelectionEditLimits` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `usableRegions` | `readonly Rect2D[]` | not recorded | no | Local usable panes from the app's existing layout owner. |
| `renderHandle` | `(handle: SelectionHandle, editing: boolean) => ReactNode` | not recorded | no |  |
| `className` | `string` | not recorded | no |  |
| `handleClassName` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/selection/SelectionBounds.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "adjustable", "alert"
- `accessibilityState`: set from an expression
- `accessibilityValue`: set from an expression
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
