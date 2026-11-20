---
name: "GestureMapModelModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/canvas-tools/gesture-map-model"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# GestureMapModelModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/canvas-tools/gesture-map-model.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/canvas-tools/gesture-map-model.ts -->
- Package: @nyc-tron/ui
- Import: `import { CANVAS_QUICK_ACTIONS, DEFAULT_GESTURE_MAP, DEFAULT_HOLD_DELAY_S, MAX_HOLD_DELAY_S, MIN_HOLD_DELAY_S, TABLET_GESTURES, assignGesture, clampHoldDelay } from "@nyc-tron/ui/components/forge/canvas-tools/gesture-map-model";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/canvas-tools/gesture-map-model
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/canvas-tools/gesture-map-model.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `CANVAS_QUICK_ACTIONS` | const | `const CANVAS_QUICK_ACTIONS: readonly [ { readonly id: "undo"; readonly label: "Undo"; }, { readonly id: "redo"; readonly label: "Redo"; }, { readonly id: "ey...` |
| `DEFAULT_GESTURE_MAP` | const | `const DEFAULT_GESTURE_MAP: GestureMap;` |
| `DEFAULT_HOLD_DELAY_S` | const | `const DEFAULT_HOLD_DELAY_S = 0.4;` |
| `GestureConflict` | type | `type GestureConflict = { readonly kind: "duplicate"; readonly gestureId: string; readonly actionIds: readonly string[]; } \| { readonly kind: "reserved"; read...` |
| `GestureDefinition` | interface | `interface GestureDefinition { readonly id: string; readonly label: string; readonly input: GestureInput; readonly reservedBy?: string; readonly unavailableRe...` |
| `GestureInput` | type | `type GestureInput = "touch" \| "stylus";` |
| `GestureMap` | interface | `interface GestureMap { readonly bindings: Readonly<Record<string, string \| undefined>>; readonly holdDelayS: number; }` |
| `MAX_HOLD_DELAY_S` | const | `const MAX_HOLD_DELAY_S = 1.5;` |
| `MIN_HOLD_DELAY_S` | const | `const MIN_HOLD_DELAY_S = 0.1;` |
| `QuickActionDefinition` | interface | `interface QuickActionDefinition { readonly id: string; readonly label: string; }` |
| `TABLET_GESTURES` | const | `const TABLET_GESTURES: readonly [ { readonly id: "two-finger-tap"; readonly label: "Two-finger tap"; readonly input: "touch"; }, { readonly id: "three-finger...` |
| `assignGesture` | function | `function assignGesture(map: GestureMap, actionId: string, gestureId: string \| undefined): GestureMap;` |
| `clampHoldDelay` | function | `function clampHoldDelay(s: number): number;` |
| `conflictMessage` | function | `function conflictMessage(c: GestureConflict, gestures: readonly GestureDefinition[], actions: readonly QuickActionDefinition[]): string;` |
| `conflictsForAction` | function | `function conflictsForAction(conflicts: readonly GestureConflict[], actionId: string): readonly GestureConflict[];` |
| `findGestureConflicts` | function | `function findGestureConflicts(map: GestureMap, gestures: readonly GestureDefinition[], actions: readonly QuickActionDefinition[]): readonly GestureConflict[];` |
| `formatHoldDelay` | function | `function formatHoldDelay(s: number): string;` |
| `keepGestureFor` | function | `function keepGestureFor(map: GestureMap, actionId: string, gestureId: string): GestureMap;` |
| `sameGestureMap` | function | `function sameGestureMap(a: GestureMap, b: GestureMap): boolean;` |
| `saveProblem` | function | `function saveProblem(draft: GestureMap, saved: GestureMap, conflicts: readonly GestureConflict[]): string \| undefined;` |
| `usesHeldGesture` | function | `function usesHeldGesture(map: GestureMap, gestures: readonly GestureDefinition[]): boolean;` |
| `validateGestureCatalog` | function | `function validateGestureCatalog(gestures: readonly GestureDefinition[], actions: readonly QuickActionDefinition[]): void;` |
| `validateGestureMap` | function | `function validateGestureMap(map: GestureMap): void;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/canvas-tools/gesture-map-model.ts -->
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
