---
name: "RoutingModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/routing"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# RoutingModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/routing.ts -->
Routing model for {@linkcode BusAndRoutingMatrix}.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/routing.ts -->
- Package: @nyc-tron/ui
- Import: `import { DEFAULT_SEND_LEVEL, ROUTING_COLUMNS, ROUTING_GRID_MIN_WIDTH, SEND_PAGE_STEP, SEND_STEP, clampSendLevel, cycleOutput, dragToSendLevel } from "@nyc-tron/ui/components/forge/audio/routing";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/audio/routing
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/routing.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `DEFAULT_SEND_LEVEL` | const | `const DEFAULT_SEND_LEVEL = 0.5;` |
| `ROUTING_COLUMNS` | const | `const ROUTING_COLUMNS: { readonly name: 132; readonly output: 236; readonly send: 208; };` |
| `ROUTING_GRID_MIN_WIDTH` | const | `const ROUTING_GRID_MIN_WIDTH = 600;` |
| `ResolvedOutput` | type | `type ResolvedOutput = { readonly kind: "master"; } \| { readonly kind: "bus"; readonly bus: RoutingBus; } \| { readonly kind: "missing"; readonly id: RouteId; };` |
| `RouteId` | type | `type RouteId = string \| number;` |
| `RoutingBus` | interface | `interface RoutingBus { readonly id: RouteId; readonly name: string; }` |
| `RoutingLayout` | type | `type RoutingLayout = "grid" \| "cards";` |
| `RoutingSend` | interface | `interface RoutingSend { readonly bus: RouteId; readonly level: number; }` |
| `RoutingSource` | interface | `interface RoutingSource { readonly id: RouteId; readonly name: string; readonly output: RouteId \| null; readonly sends: readonly RoutingSend[]; }` |
| `SEND_PAGE_STEP` | const | `const SEND_PAGE_STEP = 0.2;` |
| `SEND_STEP` | const | `const SEND_STEP = 0.05;` |
| `clampSendLevel` | function | `function clampSendLevel(level: number): number;` |
| `cycleOutput` | function | `function cycleOutput(current: RouteId \| null, buses: readonly RoutingBus[], direction: 1 \| -1): RouteId \| null;` |
| `dragToSendLevel` | function | `function dragToSendLevel(startLevel: number, deltaPt: number, trackPt: number): number;` |
| `formatSendLevel` | function | `function formatSendLevel(level: number): string;` |
| `outputName` | function | `function outputName(resolved: ResolvedOutput): string;` |
| `resolveOutput` | function | `function resolveOutput(output: RouteId \| null, buses: readonly RoutingBus[]): ResolvedOutput;` |
| `routingGridWidth` | function | `function routingGridWidth(busCount: number): number;` |
| `routingLayout` | function | `function routingLayout(widthPt: number, busCount: number): RoutingLayout;` |
| `sendLabel` | function | `function sendLabel(sourceName: string, busName: string): string;` |
| `sendLevel` | function | `function sendLevel(source: Pick<RoutingSource, "sends">, bus: RouteId): number \| undefined;` |
| `stepSendLevel` | function | `function stepSendLevel(level: number, direction: number, step?: number): number;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/routing.ts -->
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
