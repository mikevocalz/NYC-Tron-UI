---
name: "JKLShuttleController"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/JKLShuttleController"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# JKLShuttleController

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/JKLShuttleController.tsx -->
J/K/L shuttle (D-09): three 44pt keys and the current rate.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/JKLShuttleController.tsx -->
- Package: @nyc-tron/ui
- Import: `import { JKLShuttleController } from "@nyc-tron/ui/components/forge/timeline/JKLShuttleController";`
- Peers: react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/JKLShuttleController
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/JKLShuttleController.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `rate` | `number` | not recorded | yes | The player's reported rate: 0 stopped, negative in reverse. |
| `onRateChange` | `(rate: number) => void` | not recorded | yes |  |
| `ladder` | `readonly number[]` | `[1, 2, 4, 8]` | no | Forward rates L climbs through, ascending. |
| `supportsReverse` | `boolean` | not recorded | no | Lets J play in reverse. Pass only when the player can. |
| `onStep` | `(delta: -1 \| 1) => void` | not recorded | no | Frame step while K is held: J steps back, L forward. Omit when the player cannot step. |
| `disabledReason` | `string` | not recorded | no | Disables the controller and is read out as the reason, e.g. "No media loaded". |
| `className` | `string` | not recorded | no |  |
| `unstyled` | `boolean` | not recorded | no |  |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/JKLShuttleController.tsx -->
- `accessibilityHint`: set from an expression
- `accessibilityLabel`: "Shuttle"
- `accessibilityLiveRegion`: "polite"
- `accessibilityRole`: "button", "toolbar"
- `accessibilityState`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
```tsx example=JKLShuttleController
import { JKLShuttleController } from "@nyc-tron/ui/components/forge/timeline/JKLShuttleController";

export function Example() {
  return <JKLShuttleController rate={0} onRateChange={() => {}} />;
}
```
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
