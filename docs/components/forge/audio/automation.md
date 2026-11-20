---
name: "AutomationModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/audio/automation"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# AutomationModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/automation.ts -->
Automation lane math for `AutomationLane` and `AutomationModePicker`.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/automation.ts -->
- Package: @nyc-tron/ui
- Import: `import { AUTOMATION_GAIN_FLOOR_DB, AUTOMATION_LANE_PAD, AUTOMATION_MODES, AUTOMATION_PPQ, DEFAULT_SNAP_TICKS, assertGeometry, automationKeyEdit, automationSegments } from "@nyc-tron/ui/forge/audio/automation";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/audio/automation
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/automation.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `AUTOMATION_GAIN_FLOOR_DB` | const | `const AUTOMATION_GAIN_FLOOR_DB = -90;` |
| `AUTOMATION_LANE_PAD` | const | `const AUTOMATION_LANE_PAD = 22;` |
| `AUTOMATION_MODES` | const | `const AUTOMATION_MODES: readonly AutomationMode[];` |
| `AUTOMATION_PPQ` | const | `const AUTOMATION_PPQ = 960;` |
| `AutomationGeometry` | interface | `interface AutomationGeometry { readonly param: AutomationParam; readonly height: number; readonly pixelsPerTick: number; readonly lengthTicks: number; }` |
| `AutomationKeyEdit` | type | `type AutomationKeyEdit = { readonly kind: "move"; readonly ticks: number; readonly value: number; } \| { readonly kind: "remove"; };` |
| `AutomationKeyOptions` | interface | `interface AutomationKeyOptions { readonly param: AutomationParam; readonly lengthTicks: number; readonly snapTicks?: number; readonly barTicks?: number; }` |
| `AutomationMode` | type | `type AutomationMode = "off" \| "read" \| "write" \| "touch" \| "latch" \| "trim";` |
| `AutomationParam` | type | `type AutomationParam = "gain" \| "pan" \| CustomAutomationParam;` |
| `AutomationPoint` | interface | `interface AutomationPoint { readonly ticks: number; readonly value: number; }` |
| `AutomationPointEdit` | interface | `interface AutomationPointEdit { readonly ticks: number; readonly value: number; }` |
| `AutomationSegment` | interface | `interface AutomationSegment { readonly centerX: number; readonly centerY: number; readonly length: number; readonly angleDeg: number; }` |
| `CustomAutomationParam` | interface | `interface CustomAutomationParam { readonly id: string; readonly label: string; readonly minimum: number; readonly maximum: number; readonly defaultValue: num...` |
| `DEFAULT_SNAP_TICKS` | const | `const DEFAULT_SNAP_TICKS = 240;` |
| `assertGeometry` | function | `function assertGeometry(g: AutomationGeometry): void;` |
| `automationKeyEdit` | function | `function automationKeyEdit(points: readonly AutomationPoint[], index: number, key: string, shift: boolean, o: AutomationKeyOptions): AutomationKeyEdit \| unde...` |
| `automationSegments` | function | `function automationSegments(points: readonly AutomationPoint[], g: AutomationGeometry): AutomationSegment[];` |
| `canAddPointAt` | function | `function canAddPointAt(points: readonly AutomationPoint[], ticks: number): boolean;` |
| `clampAutomationValue` | function | `function clampAutomationValue(param: AutomationParam, value: number): number;` |
| `clampPointTicks` | function | `function clampPointTicks(points: readonly AutomationPoint[], index: number, ticks: number, snapTicks: number, lengthTicks: number): number;` |
| `describeAutomationPoint` | function | `function describeAutomationPoint(point: AutomationPoint, param: AutomationParam, ppq?: number, beatsPerBar?: number): string;` |
| `dragPoint` | function | `function dragPoint(points: readonly AutomationPoint[], index: number, dx: number, dy: number, g: AutomationGeometry, snapTicks?: number): AutomationPointEdit;` |
| `formatAutomationValue` | function | `function formatAutomationValue(param: AutomationParam, value: number): string;` |
| `formatPosition` | function | `function formatPosition(ticks: number, ppq?: number, beatsPerBar?: number): string;` |
| `hitTestPoint` | function | `function hitTestPoint(points: readonly AutomationPoint[], x: number, y: number, g: AutomationGeometry, radius?: number): number \| undefined;` |
| `neutralValue` | function | `function neutralValue(param: AutomationParam): number;` |
| `paramRange` | function | `function paramRange(param: AutomationParam): { readonly min: number; readonly max: number; };` |
| `pointBounds` | function | `function pointBounds(points: readonly AutomationPoint[], index: number, lengthTicks: number): { readonly min: number; readonly max: number; };` |
| `positionToValue` | function | `function positionToValue(param: AutomationParam, position: number): number;` |
| `snapTicksTo` | function | `function snapTicksTo(ticks: number, snapTicks: number, lengthTicks: number): number;` |
| `stepAutomationValue` | function | `function stepAutomationValue(param: AutomationParam, value: number, direction: -1 \| 1, big?: boolean): number;` |
| `ticksToX` | function | `function ticksToX(ticks: number, pixelsPerTick: number): number;` |
| `validateAutomationParam` | function | `function validateAutomationParam(param: AutomationParam): void;` |
| `valueAt` | function | `function valueAt(points: readonly AutomationPoint[], ticks: number): number \| undefined;` |
| `valueToPosition` | function | `function valueToPosition(param: AutomationParam, value: number): number;` |
| `valueToY` | function | `function valueToY(value: number, g: Pick<AutomationGeometry, "param" \| "height">): number;` |
| `xToTicks` | function | `function xToTicks(x: number, g: Pick<AutomationGeometry, "pixelsPerTick" \| "lengthTicks">, snapTicks?: number, scrollX?: number): number;` |
| `yToValue` | function | `function yToValue(y: number, g: Pick<AutomationGeometry, "param" \| "height">): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/automation.ts -->
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
