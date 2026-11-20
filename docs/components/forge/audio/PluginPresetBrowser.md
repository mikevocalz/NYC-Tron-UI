---
name: "PluginPresetBrowser"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/PluginPresetBrowser"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.border", "color.focus", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# PluginPresetBrowser

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/PluginPresetBrowser.tsx -->
Controlled preset list for one insert effect, with a label search.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/PluginPresetBrowser.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/PluginPresetBrowser
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PluginPresetBrowser } from "@/components/nyc-tron/ui/components/forge/audio/PluginPresetBrowser";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PluginPresetBrowser } from "@nyc-tron/ui/components/forge/audio/PluginPresetBrowser";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/PluginPresetBrowser.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `kind` | `InsertKind` | not recorded | yes | Effect type whose presets are listed. Names the heading and the list. |
| `presets` | `readonly InsertPreset[]` | not recorded | yes | Presets for `kind`, factory first, in display order. |
| `currentId` | `string` | not recorded | no | Preset the slot was last set from. Marked as the checked radio. |
| `onApply` | `(presetId: string, transaction?: { undoGroup: string; }) => void \| Promise<unknown>` | not recorded | yes | Once per press or arrow key with the chosen preset. Pressing the current preset applies it again, which resets parameters edited since. A rejected promise leaves `currentId` unchanged on screen. |
| `status` | `PresetListStatus` | `"ready"` | no |  |
| `onSave` | `(name: string) => void \| Promise<unknown>` | not recorded | no |  |
| `comparison` | `{ active: 'A' \| 'B'; hasA: boolean; hasB: boolean; onCapture: (slot: 'A' \| 'B') => void \| Promise<unknown>; onRecall: (slot: 'A' \| 'B') => void \| Promise<unknown>; }` | not recorded | no |  |
| `onRetry` | `() => void` | not recorded | no | Shown as a Retry button when `status` is `"error"`. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/PluginPresetBrowser.tsx -->
- `accessibilityLabel`: "New preset name"
- `accessibilityLiveRegion`: "polite"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
- `role`: "button", "group", "heading", "radio", "radiogroup"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
