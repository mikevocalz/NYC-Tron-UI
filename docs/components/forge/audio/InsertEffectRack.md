---
name: "InsertEffectRack"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/InsertEffectRack"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# InsertEffectRack

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/InsertEffectRack.tsx -->
Controlled insert chain for one track or bus.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/InsertEffectRack.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/InsertEffectRack
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { InsertEffectRack } from "@/components/nyc-tron/ui/components/forge/audio/InsertEffectRack";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { InsertEffectRack } from "@nyc-tron/ui/components/forge/audio/InsertEffectRack";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/InsertEffectRack.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `inserts` | `readonly InsertSlot[]` | not recorded | yes | Committed insert chain, first slot processes first. |
| `label` | `string` | not recorded | yes | Track or bus name, used in the heading and accessible names. |
| `maxInserts` | `number` | `MAX_INSERTS (8)` | no | Slot limit. |
| `selectedId` | `string` | not recorded | no | Slot whose parameters the app is showing, if any. |
| `onSelect` | `(id: string) => void` | not recorded | no | Called when a slot is pressed, e.g. to open its editor or preset browser. |
| `onAdd` | `(kind: InsertKind) => void \| Promise<unknown>` | not recorded | yes | Once per pick from the "Add effect" picker. The new slot goes at the end. |
| `onRemove` | `(id: string) => void \| Promise<unknown>` | not recorded | yes | Once per remove button press, Delete key or screen-reader action. |
| `onMove` | `(id: string, index: number) => void \| Promise<unknown>` | not recorded | yes | Once per move button press, Alt+Arrow key or screen-reader action, with the slot's requested index in the chain. |
| `onBypassCommit` | `(id: string, bypassed: boolean) => void \| Promise<unknown>` | not recorded | yes | Once per bypass toggle press with the requested state. The rack keeps showing `inserts`, so a rejected promise leaves the old state visible. |
| `disabled` | `boolean` | `false` | no |  |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no | Drop the default token recipe; supply a full app recipe via `className`. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/InsertEffectRack.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Add ", "Add effect to ", "Bypass ", "Effect type", "Move ", "Remove "
- `accessibilityRole`: "togglebutton"
- `accessibilityState`: set from an expression
- `role`: "button", "group", "heading", "list", "listitem"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
