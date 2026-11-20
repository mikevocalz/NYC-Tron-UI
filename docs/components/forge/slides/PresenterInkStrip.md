---
name: "PresenterInkStrip"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/PresenterInkStrip"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.focus", "color.onPrimary", "color.primary", "color.surfaceSunken", "color.text", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# PresenterInkStrip

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/PresenterInkStrip.tsx -->
Wraps on narrow panes; clear stays disabled until there are committed strokes.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/PresenterInkStrip.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PresenterInkStrip } from "@nyc-tron/ui/components/forge/slides/PresenterInkStrip";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/slides/PresenterInkStrip
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/PresenterInkStrip.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `mode` | `PresenterInkMode` | not recorded | yes |  |
| `onModeChange` | `(mode: PresenterInkMode) => void` | not recorded | yes |  |
| `capture` | `{ enabled: boolean; unavailableReason?: string; onChange: (enabled: boolean, signal?: AbortSignal) => unknown; }` | not recorded | no |  |
| `strokeCount` | `number` | not recorded | yes |  |
| `onClear` | `() => void` | not recorded | yes |  |
| `disabled` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/PresenterInkStrip.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Presenter ink"
- `accessibilityRole`: "button"
- `accessibilityState`: set from an expression
- `role`: "toolbar"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
