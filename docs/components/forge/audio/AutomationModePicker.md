---
name: "AutomationModePicker"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/AutomationModePicker"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.textMuted"]
registryDependencies: ["@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# AutomationModePicker

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/AutomationModePicker.tsx -->
Full mode picker with explicit live-transport capabilities and controlled acknowledgements.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/AutomationModePicker.tsx -->
- Package: @nyc-tron/ui
- Import: `import { AutomationModePicker } from "@nyc-tron/ui/forge/audio/AutomationModePicker";`
- Peers: react, react-native
- Requires: @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/audio/AutomationModePicker
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/AutomationModePicker.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `mode` | `AutomationMode` | not recorded | yes |  |
| `onModeCommit` | `(mode: AutomationMode, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes |  |
| `capabilities` | `readonly { mode: AutomationMode; disabledReason?: string; }[]` | not recorded | no | Only the host can enable live write/touch/latch/trim support. |
| `label` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/AutomationModePicker.tsx -->
- `aria-label`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
