---
name: "TransitionPresetBrowser"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/TransitionPresetBrowser"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/SegmentedControl", "@nyc-tron/TextField", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# TransitionPresetBrowser

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/TransitionPresetBrowser.tsx -->
Transition chooser (D-37): search, a list of kinds with a drawn diagram each, a length (presets in seconds, or a frame at a time, shown as timecode) and Apply to the selected cut.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/TransitionPresetBrowser.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/SegmentedControl, @nyc-tron/TextField, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/TransitionPresetBrowser
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { TransitionPresetBrowser } from "@/components/nyc-tron/ui/components/forge/timeline/TransitionPresetBrowser";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { TransitionPresetBrowser } from "@nyc-tron/ui/components/forge/timeline/TransitionPresetBrowser";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/TransitionPresetBrowser.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `kinds` | `readonly TransitionKindInfo[]` | `TRANSITION_KINDS (the kinds Splice stores)` | no |  |
| `renderPreview` | `(kind: string, durationFrames: number) => ReactNode` | not recorded | no | Host compositor preview of actual source media. Static diagrams remain labelled diagrams. |
| `cut` | `PresetBrowserCut` | not recorded | no | The selected cut, or `undefined`; Apply is disabled with the reason shown until there is one. |
| `rate` | `FrameRate` | not recorded | yes |  |
| `presetsSeconds` | `readonly number[]` | `[0.5, 1, 2]` | no | Length presets in seconds. |
| `onApply` | `(kind: string, durationFrames: number, durationSeconds: number) => void` | not recorded | yes | Once per Apply press, with the length clamped to the cut. |
| `dropFrame` | `boolean` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/TransitionPresetBrowser.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Live transition preview", "One frame longer", "One frame shorter", "Transition"
- `accessibilityRole`: "radio", "radiogroup"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
- `aria-label`: "Transition length"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
