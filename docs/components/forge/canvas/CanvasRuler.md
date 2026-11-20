---
name: "CanvasRuler"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/canvas/CanvasRuler"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.info", "color.surfaceRaised", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# CanvasRuler

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas/CanvasRuler.tsx -->
Canvas rulers and guides (B-03): a top ruler counting x and a side ruler counting y in px, in, cm, mm or pt, with ticks that re-space as you zoom and labels counted from a movable origin.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas/CanvasRuler.tsx -->
- Package: @nyc-tron/ui
- Import: `import { CanvasRuler } from "@nyc-tron/ui/components/forge/canvas/CanvasRuler";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/canvas/CanvasRuler
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas/CanvasRuler.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | no |  |
| `revision` | `string \| number` | not recorded | no |  |
| `viewport` | `CanvasViewport` | not recorded | yes |  |
| `unit` | `RulerUnit` | not recorded | yes |  |
| `dpi` | `number` | `72` | no | Document resolution for in, cm, mm and pt. |
| `origin` | `DocPoint` | `{x:0,y:0}` | no | Document point where both rulers read zero. |
| `guides` | `readonly CanvasGuide[]` | not recorded | yes | The document's guides. The host stores them; this component only previews drags. |
| `onAddGuide` | `(guide: NewCanvasGuide) => void` | not recorded | yes | A drag out of a ruler, or Enter on a focused ruler, placed a guide. One call per release or key press. |
| `onMoveGuide` | `(id: string, position: number) => void` | not recorded | yes | A guide was dragged or nudged to a new whole-pixel position. One call per release or key press. |
| `onRemoveGuide` | `(id: string) => void` | not recorded | yes | A guide was dropped back on its ruler, or Delete was pressed on it. |
| `onGuidePreview` | `(preview: GuidePreview \| undefined) => void` | not recorded | no | Each move of a guide drag, then `undefined` when it ends or is cancelled. |
| `onOriginChange` | `(origin: DocPoint) => void` | not recorded | no | The corner was dragged to set a new zero point, or pressed to reset it. Omit to fix the origin. |
| `pointer` | `DocPoint` | not recorded | no | Document point under the host's pointer, marked on both rulers. |
| `thickness` | `number` | `24` | no | Visible ruler thickness; the touch band is always at least 44. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas/CanvasRuler.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "adjustable", "button"
- `aria-disabled`: set from an expression
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
