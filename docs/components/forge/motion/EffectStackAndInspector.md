---
name: "EffectStackAndInspector"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/motion/EffectStackAndInspector"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "color.textMuted"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/Select", "@nyc-tron/TextField", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# EffectStackAndInspector

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/motion/EffectStackAndInspector.tsx -->
Host-controlled effect order and schema-driven settings.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/motion/EffectStackAndInspector.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/Select, @nyc-tron/TextField, @nyc-tron/feedback/ErrorMessage, @nyc-tron/shell/UnitInput

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/motion/EffectStackAndInspector
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { EffectStackAndInspector } from "@/components/nyc-tron/ui/components/forge/motion/EffectStackAndInspector";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { EffectStackAndInspector } from "@nyc-tron/ui/components/forge/motion/EffectStackAndInspector";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/motion/EffectStackAndInspector.tsx -->
Extends: `Omit<ViewProps, 'children'>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `revision` | `string \| number` | not recorded | yes |  |
| `effects` | `readonly MotionEffect[]` | not recorded | yes |  |
| `selectedId` | `string \| null` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `availableEffects` | `readonly { readonly id: string; readonly label: string; }[]` | not recorded | yes |  |
| `onMutation` | `(mutation: MotionEffectMutation, signal: AbortSignal) => void \| Promise<void>` | not recorded | yes |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/motion/EffectStackAndInspector.tsx -->
- `accessibilityLabel`: "Available effect types", "Effect panel section", "Ordered effect stack"
- `accessibilityRole`: "header"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
