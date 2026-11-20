---
name: "ReadAloudTransport"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/office/ReadAloudTransport"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/office/office-controls"]
a11yStatus: "unverified"
---

# ReadAloudTransport

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/office/ReadAloudTransport.tsx -->
Controlled read-aloud transport shared by H-21 and K-18: the current sentence with its spoken word marked, previous/play-pause/next, a speed control and an optional stop.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/office/ReadAloudTransport.tsx -->
- Package: @nyc-tron/ui
- Import: `import { ReadAloudTransport } from "@nyc-tron/ui/components/forge/office/ReadAloudTransport";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/office/office-controls

```sh
npx shadcn@latest add @nyc-tron/forge/office/ReadAloudTransport
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/office/ReadAloudTransport.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `sentences` | `readonly ReadAloudSentence[]` | not recorded | yes | The reading queue, from `readAloudSentences`. |
| `index` | `number` | not recorded | yes | Index into `sentences` of the sentence being read or about to be read. |
| `wordIndex` | `number` | not recorded | no | Word being spoken inside the current sentence (from the voice's word-boundary event), if known. |
| `status` | `ReadAloudStatus` | not recorded | yes |  |
| `unavailableReason` | `string` | `"No voice is available on this device."` | no | Shown when `status` is `unavailable`. |
| `rate` | `number` | not recorded | yes | Speed, 0.5–3 times the voice's normal rate. |
| `onRateChange` | `(rate: number) => void` | not recorded | yes |  |
| `onPlay` | `() => void` | not recorded | yes |  |
| `onPause` | `() => void` | not recorded | yes |  |
| `onSkip` | `(direction: -1 \| 1) => void` | not recorded | yes | Moves one sentence back (-1) or forward (1). Not called past either end. |
| `onStop` | `() => void` | not recorded | no | Ends the session. The stop control renders only when this is passed. |
| `context` | `string` | not recorded | no | Line above the sentence naming where the reader is: a heading, "Page 3 of 12". |
| `accessory` | `ReactNode` | not recorded | no | Extra controls after the transport, such as page steppers. |
| `announceSentences` | `boolean` | `false` | no | Repeat each new sentence through the screen reader. Off by default: with a screen reader on, the voice and the reader would talk over each other. |
| `label` | `string` | `"Read aloud"` | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/office/ReadAloudTransport.tsx -->
- `accessibilityHint`: "Tap for the next speed"
- `accessibilityLabel`: "Reading speed"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "adjustable", "button"
- `accessibilityState`: set from an expression
- `accessibilityValue`: set from an expression
- `role`: "region"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
