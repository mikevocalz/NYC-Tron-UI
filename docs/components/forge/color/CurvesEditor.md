---
name: "CurvesEditor"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/color/CurvesEditor"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.border", "color.focus", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/gestures/PanResponderDrag", "@nyc-tron/shell/UnitInput"]
a11yStatus: "unverified"
---

# CurvesEditor

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/color/CurvesEditor.tsx -->
Editable normalized transfer curve with pointer preview, single release commit and keyboard/numeric alternatives.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/color/CurvesEditor.tsx -->
- Package: @nyc-tron/ui
- Import: `import { CurvesEditor } from "@nyc-tron/ui/components/forge/color/CurvesEditor";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/gestures/PanResponderDrag, @nyc-tron/shell/UnitInput

```sh
npx shadcn@latest add @nyc-tron/forge/color/CurvesEditor
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/color/CurvesEditor.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | yes |  |
| `value` | `ColorCurve` | not recorded | yes |  |
| `selectedId` | `string` | not recorded | yes |  |
| `onSelect` | `(id: string) => void` | not recorded | yes |  |
| `onPreview` | `(value: ColorCurve \| undefined) => void` | not recorded | no |  |
| `onCommit` | `(value: ColorCurve, selectedId: string) => void` | not recorded | yes |  |
| `createPointId` | `() => string` | not recorded | yes | Stable IDs are allocated by the host, not inferred from point coordinates. |
| `presets` | `readonly { readonly id: string; readonly label: string; readonly curve: ColorCurve; }[]` | not recorded | no | Application-specific curve presets; an identity reset is always available. |
| `channelSelection` | `{ readonly channels: readonly { readonly id: string; readonly label: string; }[]; readonly value: string; readonly onChange: (id: string) => void; }` | not recorded | no | Optional multi-channel selector; all three fields are required together. |
| `height` | `number` | not recorded | no |  |
| `disabled` | `boolean` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
| `transport` | `DragTransport` | not recorded | no | Native consumers with GestureHandlerRootView can supply GestureHandlerDrag. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/color/CurvesEditor.tsx -->
- `accessibilityLabel`: "Curve point output"
- `accessibilityRole`: "adjustable"
- `aria-disabled`: set from an expression
- `aria-valuemax`: set from an expression
- `aria-valuemin`: set from an expression
- `aria-valuenow`: set from an expression
- `aria-valuetext`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
