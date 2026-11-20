---
name: "PatchGraph"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/graph/PatchGraph"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# PatchGraph

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/graph/PatchGraph.tsx -->
Native RN graph interaction surface.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/graph/PatchGraph.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/graph/PatchGraph
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PatchGraph } from "@/components/nyc-tron/ui/components/forge/graph/PatchGraph";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PatchGraph } from "@nyc-tron/ui/components/forge/graph/PatchGraph";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/graph/PatchGraph.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `nodes` | `readonly GraphNode[]` | not recorded | yes |  |
| `edges` | `readonly GraphEdge[]` | not recorded | yes |  |
| `width` | `number` | not recorded | yes |  |
| `height` | `number` | not recorded | yes |  |
| `disabled` | `boolean` | not recorded | no |  |
| `scrollEnabled` | `boolean` | not recorded | no |  |
| `interactionScale` | `number` | not recorded | no |  |
| `interactionBoundary` | `string \| number` | not recorded | no | Geometry/source changes cancel gestures without replacing focused native views. |
| `onInteractionError` | `(message: string) => void` | not recorded | no |  |
| `onInvalidConnection` | `(message: string) => void` | not recorded | no |  |
| `selectedNodeId` | `string \| null` | not recorded | no |  |
| `onSelectNode` | `(id: string) => void` | not recorded | no |  |
| `onMoveNode` | `(id: string, point: GraphPoint) => void \| Promise<unknown>` | not recorded | no |  |
| `onConnect` | `(from: { nodeId: string; portId: string; }, to: { nodeId: string; portId: string; }) => void \| Promise<unknown>` | not recorded | no |  |
| `accentColor` | `string` | not recorded | no | Optional override; defaults to the theme's accent token. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/graph/PatchGraph.tsx -->
- `accessibilityHint`: "Drag to move. Double tap to select."
- `accessibilityLabel`: "Cancel cable connection", "Connect input ", "Select output "
- `accessibilityRole`: "button"
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
