---
name: "PanControl"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/PanControl"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# PanControl

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/PanControl.tsx -->
Controlled mono pan control.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/PanControl.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/PanControl
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PanControl } from "@/components/nyc-tron/ui/components/forge/audio/PanControl";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PanControl } from "@nyc-tron/ui/components/forge/audio/PanControl";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/PanControl.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `targetSize` | `number` | not recorded | no | App-owned minimum interaction target. Defaults to 44 points. |
| `labels` | `PanControlLabels` | not recorded | no |  |
| `value` | `number` | not recorded | yes | Committed mono pan from the app or engine, -1 (left) .. 1 (right). |
| `label` | `string` | not recorded | yes | Channel name; the accessible name is `"<label> pan"`, or `"<label> balance"` in balance mode. |
| `mode` | `"pan" \| "balance"` | `"pan"` | no | `"pan"` positions a mono source; `"balance"` is for a stereo bus, where the engine attenuates the far side and keeps the near side. Changes the accessible name, the caption and the spoken value; the drawn track and the short readout are the same. |
| `onChange` | `(pan: number) => void` | not recorded | no | Live preview while dragging, and the restored value on cancel. |
| `onCommit` | `(pan: number) => void \| Promise<unknown>` | not recorded | yes | Once per completed drag, step or centre reset. Not called when the pan is unchanged. The control keeps showing `value`, so a rejected promise leaves the old position on screen. |
| `step` | `number` | `0.05` | no | One arrow-key or screen-reader step. |
| `width` | `number` | `120` | no | Track width, points. |
| `hideLabel` | `boolean` | `false` | no | Hide the visible channel name (strips already show it). |
| `disabled` | `boolean` | `false` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/PanControl.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "adjustable", "button"
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
