---
name: "TimelineMarkers"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/TimelineMarkers"
tier: 2
docs: "generated"
platforms: ["web"]
category: "forge"
tokens: ["color.border", "color.focus", "color.info", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/Select", "@nyc-tron/TextField", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# TimelineMarkers

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/TimelineMarkers.tsx -->
Sequence markers (D-24): a 44pt row (place it above the ruler) with a flag per marker and a band for range markers, plus Add marker at the playhead, previous and next, and an editor for the selected marker (name, note, length, jump, remove).
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/TimelineMarkers.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/Button, @nyc-tron/Select, @nyc-tron/TextField, @nyc-tron/feedback/ErrorMessage

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/TimelineMarkers
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { TimelineMarkers } from "@/components/nyc-tron/ui/components/forge/timeline/TimelineMarkers";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { TimelineMarkers } from "@nyc-tron/ui/components/forge/timeline/TimelineMarkers";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/TimelineMarkers.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `markers` | `readonly TimelineMarker[]` | not recorded | yes |  |
| `colors` | `readonly { id: string; label: string; value: string; }[]` | not recorded | no |  |
| `onColorChange` | `(id: string, colorId: string \| undefined) => void` | not recorded | no |  |
| `snapFrames` | `readonly number[]` | not recorded | no |  |
| `snapThreshold` | `number` | not recorded | no |  |
| `viewport` | `TimelineViewport` | not recorded | yes |  |
| `rate` | `FrameRate` | not recorded | yes |  |
| `durationFrames` | `number` | not recorded | yes |  |
| `playheadFrame` | `number` | not recorded | yes | Where Add marker puts one. |
| `selectedMarkerId` | `string` | not recorded | no |  |
| `onSelect` | `(id: string \| undefined) => void` | not recorded | yes |  |
| `onAdd` | `(at: { frame: number; seconds: number; }) => void` | not recorded | yes | Add at the playhead (Splice `addMarker`). |
| `onUpdate` | `(id: string, update: MarkerUpdate) => void` | not recorded | yes | Once per drag release, key press, button or committed text field (Splice `updateMarker`). |
| `onRemove` | `(id: string) => void` | not recorded | yes |  |
| `onSeek` | `(frame: number) => void` | not recorded | yes | Jump to a marker. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/TimelineMarkers.tsx -->
- `accessibilityHint`: "Drag or use arrow keys to move. Enter jumps to it. Delete removes it.", "One second longer; a point marker becomes a range", "One second shorter; at zero it becomes a point marker"
- `accessibilityLabel`: "Markers", "Next marker", "Previous marker"
- `accessibilityRole`: "adjustable", "list"
- `accessibilityState`: set from an expression
- `aria-disabled`: set from an expression
- `aria-valuemax`: set from an expression
- `aria-valuemin`: set from an expression
- `aria-valuenow`: set from an expression
- `aria-valuetext`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
