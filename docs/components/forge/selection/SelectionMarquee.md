---
name: "SelectionMarquee"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/selection/SelectionMarquee"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.border", "color.focus", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# SelectionMarquee

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/selection/SelectionMarquee.tsx -->
Marquee selection over a host canvas (B-19): rectangle, ellipse, polygon (click points; click the first point or press Enter to close) and freehand lasso.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/selection/SelectionMarquee.tsx -->
- Package: @nyc-tron/ui
- Import: `import { SelectionMarquee } from "@nyc-tron/ui/components/forge/selection/SelectionMarquee";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/selection/SelectionMarquee
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/selection/SelectionMarquee.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | not recorded | no |  |
| `revision` | `string \| number` | not recorded | no |  |
| `usableRegions` | `readonly Rect2D[]` | not recorded | no | Canvas-local usable panes. The app positions its toolbar through its existing layout owner. |
| `renderToolbar` | `(controls: ReactNode) => ReactNode` | not recorded | no |  |
| `tool` | `SelectionTool` | not recorded | yes | The active marquee tool. |
| `onToolChange` | `(tool: SelectionTool) => void` | not recorded | yes |  |
| `mode` | `SelectionMode` | not recorded | yes | The toolbar's combine mode. Shift, Alt or both override it for one gesture. |
| `onModeChange` | `(mode: SelectionMode) => void` | not recorded | yes |  |
| `feather` | `number` | not recorded | yes | Feather radius sent with each region, in document pixels (0..250). |
| `width` | `number` | not recorded | yes | Size of the canvas surface in layout units. The host draws its canvas at this size. |
| `height` | `number` | not recorded | yes |  |
| `documentWidth` | `number` | not recorded | yes | Document size in pixels; regions are reported in document pixels. |
| `documentHeight` | `number` | not recorded | yes |  |
| `selectionBounds` | `DocRect \| undefined` | not recorded | no | Bounds of the committed selection (from the editor's `getSelection`), or `undefined` when empty. |
| `onSelectRegion` | `(request: SelectRegionRequest, signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Exactly once per completed gesture or keyboard commit. Maps to `selectRegion`. |
| `onPreview` | `(shape: SelectionShape \| undefined) => void` | not recorded | no | The in-progress shape during a gesture, then `undefined` on commit or cancel. Never persist it. |
| `onSelectAll` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Maps to `selectAll`. |
| `onDeselect` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Maps to `deselect`. |
| `onInvertSelection` | `(signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | yes | Maps to `invertSelection`. |
| `disabledReason` | `string` | not recorded | no | Why selecting is unavailable right now (for example "The active layer is hidden"). The surface then refuses gestures and shows this text. |
| `children` | `ReactNode` | not recorded | no | The host's canvas, drawn under the marquee. |
| `label` | `string` | `"Selection"` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/selection/SelectionMarquee.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `aria-label`: "Selection mode", "Selection tool"
- `aria-live`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
