---
name: "MidiChannelPicker"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/midi/MidiChannelPicker"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/forge/midi/MIDIPianoRoll"]
a11yStatus: "unverified"
---

# MidiChannelPicker

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/midi/MidiChannelPicker.tsx -->
Controlled MIDI channel stepper for one note or clip: a visible "Ch" label, the one-based channel and −/+ buttons.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/midi/MidiChannelPicker.tsx -->
- Package: @nyc-tron/ui
- Import: `import { MidiChannelPicker, MidiValueStepper } from "@nyc-tron/ui/components/forge/midi/MidiChannelPicker";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/forge/midi/MIDIPianoRoll

```sh
npx shadcn@latest add @nyc-tron/forge/midi/MidiChannelPicker
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/midi/MidiChannelPicker.tsx -->
Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `channel` | `number` | not recorded | yes | Committed channel, 0..15. Shown and spoken as 1..16. |
| `onChannelCommit` | `(channel: number) => void \| Promise<unknown>` | not recorded | yes | Once per press or key, with the new zero-based channel. |
| `disabled` | `boolean` | `false` | no |  |
| `label` | `string` | `"MIDI channel"` | no | Accessible name. |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |

### MidiValueStepper

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `number` | not recorded | yes | Committed value, an integer in `min..max`. |
| `min` | `number` | not recorded | yes |  |
| `max` | `number` | not recorded | yes |  |
| `label` | `string` | not recorded | yes | Accessible name of the whole stepper, e.g. `"Ramp end velocity"`. |
| `format` | `(value: number) => string` | `String(value)` | no | Visible text for the value. |
| `valueText` | `(value: number) => string` | `format(value)` | no | Spoken value, e.g. `"Channel 3"`. |
| `step` | `number` | `1` | no | Step for the buttons, arrows and screen-reader actions. |
| `pageStep` | `number` | `10 * step` | no | Step for PageUp/PageDown. |
| `onValueCommit` | `(value: number) => void \| Promise<unknown>` | not recorded | yes | Once per button press, key or screen-reader action, with the clamped new value. Never called with an unchanged value. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/midi/MidiChannelPicker.tsx -->
- `accessibilityLabel`: set from an expression
- `accessibilityRole`: "adjustable"
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
