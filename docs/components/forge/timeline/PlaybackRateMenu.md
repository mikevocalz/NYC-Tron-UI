---
name: "PlaybackRateMenu"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/timeline/PlaybackRateMenu"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "opacity.0_4", "radius.control", "space.0.5", "space.3"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "declared"
---

# PlaybackRateMenu

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/PlaybackRateMenu.tsx -->
Playback speed picker (D-07): a 44pt button showing the rate that opens a list of rates, plus reverse and a preserve-pitch switch when the player supports them.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/PlaybackRateMenu.tsx -->
- Package: @nyc-tron/ui
- Import: `import { PlaybackRateMenu } from "@nyc-tron/ui/forge/timeline/PlaybackRateMenu";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/PlaybackRateMenu
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/PlaybackRateMenu.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `rate` | `number` | not recorded | yes | Current playback rate; negative plays in reverse. |
| `onRateChange` | `(rate: number) => void` | not recorded | yes |  |
| `rates` | `readonly number[]` | `[0.25, 0.5, 1, 1.5, 2]` | no | Forward rates offered, ascending. |
| `supportsReverse` | `boolean` | not recorded | no | Adds reverse (-1x). Pass only when the player can play backwards. |
| `preservePitch` | `boolean` | not recorded | no | Pitch policy at rates other than 1x. The switch shows only when a handler is passed. |
| `onPreservePitchChange` | `(preserve: boolean) => void` | not recorded | no |  |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/PlaybackRateMenu.tsx -->
- `accessibilityLabel`: "Playback speed", "Preserve pitch"
- `accessibilityRole`: "button", "radio", "radiogroup"
- `accessibilityState`: set from an expression
- `aria-checked`: set from an expression
- `aria-expanded`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
```tsx example=PlaybackRateMenu
import { PlaybackRateMenu } from "@nyc-tron/ui/forge/timeline/PlaybackRateMenu";

export function Example() {
  return <PlaybackRateMenu rate={0} onRateChange={() => {}} />;
}
```
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
