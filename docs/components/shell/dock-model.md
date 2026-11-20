---
name: "DockModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/dock-model"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# DockModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/dock-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/dock-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { activatePanel, clampFloatingRect, closePanel, dockTargetAt, dockedPanelIds, movePanel, panelLocation, resizeStack } from "@nyc-tron/ui/components/shell/dock-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/dock-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/dock-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `DockDefaults` | interface | `interface DockDefaults { readonly edgeSize: number; readonly floatingRect: Rect2D; }` |
| `DockEdge` | type | `type DockEdge = "left" \| "right" \| "bottom";` |
| `DockLayout` | interface | `interface DockLayout { readonly left?: DockStack; readonly right?: DockStack; readonly bottom?: DockStack; readonly floating: readonly FloatingPanel[]; reado...` |
| `DockStack` | interface | `interface DockStack { readonly panels: readonly string[]; readonly active: string; readonly size: number; }` |
| `DockTarget` | type | `type DockTarget = DockEdge \| "floating";` |
| `FloatingPanel` | interface | `interface FloatingPanel { readonly id: string; readonly rect: Rect2D; }` |
| `activatePanel` | function | `function activatePanel(layout: DockLayout, id: string): DockLayout;` |
| `clampFloatingRect` | function | `function clampFloatingRect(rect: Rect2D, regions: readonly Rect2D[]): Rect2D;` |
| `closePanel` | function | `function closePanel(layout: DockLayout, id: string): DockLayout;` |
| `dockTargetAt` | function | `function dockTargetAt(point: { x: number; y: number; }, size: { width: number; height: number; }, edgeFraction?: number): DockTarget \| undefined;` |
| `dockedPanelIds` | function | `function dockedPanelIds(layout: DockLayout): string[];` |
| `movePanel` | function | `function movePanel(layout: DockLayout, id: string, target: DockTarget, defaults: DockDefaults): DockLayout;` |
| `panelLocation` | function | `function panelLocation(layout: DockLayout, id: string): DockTarget \| undefined;` |
| `resizeStack` | function | `function resizeStack(layout: DockLayout, edge: DockEdge, size: number): DockLayout;` |
| `validateDockLayout` | function | `function validateDockLayout(layout: DockLayout, known: readonly string[]): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/dock-model.ts -->
_Not documented._
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
