---
name: "TempoAndMetronome"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/audio/TempoAndMetronome"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# TempoAndMetronome

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/audio/TempoAndMetronome.tsx -->
Tempo, tap tempo, time signature and metronome.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/audio/TempoAndMetronome.tsx -->
- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/inputs/PrecisionScrubber

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/audio/TempoAndMetronome
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { TempoAndMetronome } from "@/components/nyc-tron/ui/components/forge/audio/TempoAndMetronome";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { TempoAndMetronome } from "@nyc-tron/ui/components/forge/audio/TempoAndMetronome";`
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/audio/TempoAndMetronome.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `targetSize` | `number` | not recorded | no | App-owned minimum interaction target. Defaults to 44 points. |
| `labels` | `Partial<TempoLabels>` | not recorded | no |  |
| `bpm` | `number` | not recorded | yes | Committed tempo, 20..400 BPM. |
| `timeSignature` | `TimeSignature` | not recorded | yes | Committed time signature, `[numerator, denominator]`. |
| `onTempoCommit` | `(bpm: number) => void \| Promise<unknown>` | not recorded | yes | Once per drag, step, text entry or finished tap sequence. |
| `onTimeSignatureCommit` | `(timeSignature: TimeSignature) => void \| Promise<unknown>` | not recorded | yes | Once per numerator step or denominator choice. |
| `metronome` | `MetronomeBinding` | not recorded | no | The click switch. Leave it out when nothing can play a click: the control is then not drawn, rather than drawn and dead. |
| `beat` | `number` | not recorded | no | Zero-based beat in the bar while the transport runs, for the visual click. Leave it out when stopped. |
| `now` | `() => number` | `Date.now` | no | Clock for tap tempo, ms. |
| `disabled` | `boolean` | `false` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/audio/TempoAndMetronome.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: set from an expression
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "adjustable", "button", "radio", "radiogroup", "switch", "text"
- `accessibilityState`: set from an expression
- `accessibilityValue`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
