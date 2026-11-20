---
name: "AnnotationToolbar"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/pdf/AnnotationToolbar"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.surfaceRaised", "color.text", "color.textMuted", "radius.control", "space.0.5", "space.0.75", "space.1", "space.1.5"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/office/office-controls"]
a11yStatus: "declared"
---

# AnnotationToolbar

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/pdf/AnnotationToolbar.tsx -->
PDF markup toolbar (K-06): one 44pt toggle per tool the engine can save, plus undo and redo.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/pdf/AnnotationToolbar.tsx -->
- Package: @nyc-tron/ui
- Import: `import { AnnotationToolbar } from "@nyc-tron/ui/forge/pdf/AnnotationToolbar";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/office/office-controls

```sh
npx shadcn@latest add @nyc-tron/forge/pdf/AnnotationToolbar
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/pdf/AnnotationToolbar.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `tools` | `readonly AnnotationTool[]` | not recorded | yes | Tools the host can save. Pass only subtypes the PDF engine writes; a tool the engine cannot store is left out, never drawn disabled. |
| `activeTool` | `AnnotationTool` | not recorded | yes |  |
| `onToolChange` | `(tool: AnnotationTool) => void` | not recorded | yes |  |
| `onUndo` | `() => void` | not recorded | no | Undo control; renders only when passed. |
| `canUndo` | `boolean` | not recorded | no |  |
| `onRedo` | `() => void` | not recorded | no | Redo control; renders only when passed. |
| `canRedo` | `boolean` | not recorded | no |  |
| `hint` | `string` | not recorded | no | One-line instruction for the active tool, e.g. "Drag across text to highlight it." |
| `label` | `string` | `"Markup tools"` | no |  |
| `className` | `string` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/pdf/AnnotationToolbar.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "toolbar"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
