---
name: "WindowLifecycleModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/core/window-lifecycle"
tier: 2
docs: "generated"
platforms: []
category: "primitive"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# WindowLifecycleModule

## Purpose

<!-- generated:begin purpose source=packages/core/src/window-lifecycle.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/core/package.json,packages/core/src/window-lifecycle.ts -->
- Package: @nyc-tron/core
- Peers: none
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/core/window-lifecycle
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { MAX_WINDOWS, beginDrag, cancelDrag, closeWindow, createWindowRegistry, dragOver, dropDrag, focusWindow } from "@/lib/nyc-tron/core/window-lifecycle";`

### Tarball install

Install @nyc-tron/core from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { MAX_WINDOWS, beginDrag, cancelDrag, closeWindow, createWindowRegistry, dragOver, dropDrag, focusWindow } from "@nyc-tron/core/window-lifecycle";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/core/src/window-lifecycle.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `DisplayInfo` | interface | `interface DisplayInfo { readonly id: string; readonly bounds: Rect; readonly reserved?: readonly Rect[]; readonly primary?: boolean; }` |
| `DragOffer` | interface | `interface DragOffer { readonly sourceId: string; readonly targetId: string; readonly payload: unknown; }` |
| `DragSession` | interface | `interface DragSession { readonly token: string; readonly sourceId: string; readonly targetId: string \| null; readonly phase: "dragging" \| "dropping"; readonl...` |
| `LayoutSnapshot` | interface | `interface LayoutSnapshot { readonly version: 1; readonly windows: readonly SnapshotWindow[]; readonly focusedId: string \| null; }` |
| `MAX_WINDOWS` | const | `const MAX_WINDOWS = 256;` |
| `OpenWindowSpec` | interface | `interface OpenWindowSpec { readonly id: string; readonly displayId: string; readonly rect: Rect; }` |
| `Outcome` | interface | `interface Outcome { readonly state: WindowRegistryState; readonly ok: boolean; readonly reason?: RejectReason; readonly token?: string; readonly offer?: Drag...` |
| `ReflowResult` | interface | `interface ReflowResult { readonly state: WindowRegistryState; readonly relocated: readonly string[]; }` |
| `RejectReason` | type | `type RejectReason = "invalid-id" \| "invalid-rect" \| "duplicate-id" \| "budget" \| "unknown-window" \| "minimized" \| "already-minimized" \| "not-minimized" \| "dra...` |
| `SnapshotWindow` | interface | `interface SnapshotWindow { readonly id: string; readonly displayId: string; readonly rect: Rect; readonly status: WindowStatus; readonly home?: WindowHome; }` |
| `WindowHome` | interface | `interface WindowHome { readonly displayId: string; readonly rect: Rect; }` |
| `WindowRecord` | interface | `interface WindowRecord { readonly id: string; readonly displayId: string; readonly rect: Rect; readonly status: WindowStatus; readonly home?: WindowHome; }` |
| `WindowRegistryState` | interface | `interface WindowRegistryState { readonly windows: readonly WindowRecord[]; readonly focusedId: string \| null; readonly drag: DragSession \| null; readonly tok...` |
| `WindowStatus` | type | `type WindowStatus = "open" \| "minimized";` |
| `beginDrag` | function | `function beginDrag(state: WindowRegistryState, input: { readonly sourceId: string; readonly payload: unknown; }): Outcome;` |
| `cancelDrag` | function | `function cancelDrag(state: WindowRegistryState, token: string \| undefined): Outcome;` |
| `closeWindow` | function | `function closeWindow(state: WindowRegistryState, id: string): Outcome;` |
| `createWindowRegistry` | function | `function createWindowRegistry(): WindowRegistryState;` |
| `dragOver` | function | `function dragOver(state: WindowRegistryState, token: string \| undefined, targetId: string \| null): Outcome;` |
| `dropDrag` | function | `function dropDrag(state: WindowRegistryState, token: string \| undefined, targetId: string \| null): Outcome;` |
| `focusWindow` | function | `function focusWindow(state: WindowRegistryState, id: string): Outcome;` |
| `minimizeWindow` | function | `function minimizeWindow(state: WindowRegistryState, id: string): Outcome;` |
| `moveWindow` | function | `function moveWindow(state: WindowRegistryState, id: string, to: { readonly displayId: string; readonly rect: Rect; }): Outcome;` |
| `openWindow` | function | `function openWindow(state: WindowRegistryState, spec: OpenWindowSpec): Outcome;` |
| `parseLayoutSnapshot` | function | `function parseLayoutSnapshot(value: unknown): LayoutSnapshot \| null;` |
| `reflowWindows` | function | `function reflowWindows(state: WindowRegistryState, displays: readonly DisplayInfo[]): ReflowResult;` |
| `reservedFromFolds` | function | `function reservedFromFolds(features: readonly FoldFeature[]): Rect[];` |
| `resolveDrop` | function | `function resolveDrop(state: WindowRegistryState, token: string \| undefined, accepted: boolean): Outcome;` |
| `restoreLayout` | function | `function restoreLayout(snapshot: LayoutSnapshot, displays: readonly DisplayInfo[], previous?: WindowRegistryState): ReflowResult;` |
| `restoreWindow` | function | `function restoreWindow(state: WindowRegistryState, id: string): Outcome;` |
| `snapshotLayout` | function | `function snapshotLayout(state: WindowRegistryState): LayoutSnapshot;` |
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

<!-- generated:begin a11y source=packages/core/src/window-lifecycle.ts -->
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
