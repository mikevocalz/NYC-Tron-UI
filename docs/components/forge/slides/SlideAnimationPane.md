---
name: "SlideAnimationPane"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/slides/SlideAnimationPane"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.danger", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PropertyInspector", "@nyc-tron/forge/office/office-controls"]
a11yStatus: "unverified"
---

# SlideAnimationPane

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/slides/SlideAnimationPane.tsx -->
Animation pane for a slide (J-09): the slide's animations in play order with object, effect and timing; an add form (effect grouped by entrance, emphasis and exit, start and duration in seconds) for the object selected on the canvas; remove; and preview.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/slides/SlideAnimationPane.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PropertyInspector, @nyc-tron/forge/office/office-controls

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/slides/SlideAnimationPane
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { SlideAnimationPane } from "@/components/nyc-tron/ui/components/forge/slides/SlideAnimationPane";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { SlideAnimationPane } from "@nyc-tron/ui/components/forge/slides/SlideAnimationPane";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/slides/SlideAnimationPane.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `animations` | `readonly SlideAnimation[]` | not recorded | yes |  |
| `effects` | `readonly AnimationEffect[]` | not recorded | yes | Effects the host's engine plays. Categories with no effect are not shown. |
| `objectLabel` | `(objectId: string) => string` | not recorded | yes | Names an object for the list ("Title", "Rectangle 2"). |
| `selectedObjectId` | `string` | not recorded | no | The object selected on the canvas; new animations apply to it. |
| `onAdd` | `(animation: { objectId: string; kind: string; startS: number; durationS: number; }) => void \| Promise<unknown>` | not recorded | no | Adds an animation. Rejecting keeps the form and shows the message. |
| `onRemove` | `(index: number) => void \| Promise<unknown>` | not recorded | no | Removes the animation at the engine's `index`. |
| `onPreview` | `() => void` | not recorded | no | Plays the slide's animations once on the canvas. |
| `onTimingCommit` | `(index: number, value: { startS: number; durationS: number; trigger: 'on-click' \| 'with-previous' \| 'after-previous'; }) => unknown` | not recorded | no |  |
| `onOrderCommit` | `(indices: readonly number[]) => unknown` | not recorded | no |  |
| `supportedTriggers` | `readonly ('on-click' \| 'with-previous' \| 'after-previous')[]` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/slides/SlideAnimationPane.tsx -->
- `accessibilityLabel`: "Animations", "Duration, in seconds", "Remove ", "Start, in seconds"
- `accessibilityLiveRegion`: "assertive"
- `accessibilityRole`: "button", "header", "radio"
- `accessibilityState`: set from an expression
- `role`: "radiogroup", "region"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
