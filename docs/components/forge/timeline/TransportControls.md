---
name: "TransportControls"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/timeline/TransportControls"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.border", "color.focus", "color.surfaceSunken", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "unverified"
---

# TransportControls

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/timeline/TransportControls.tsx -->
Play/pause, stop, jump to start/end and previous/next frame (D-06), each a 44pt button.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/timeline/TransportControls.tsx -->
- Package: @nyc-tron/ui
- Import: `import { TransportControls } from "@nyc-tron/ui/components/forge/timeline/TransportControls";`
- Peers: @nyc-tron/core, react, react-native
- Requires: @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/forge/timeline/TransportControls
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/timeline/TransportControls.tsx -->
Extends: `Omit<ViewProps, "children">, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `playing` | `boolean` | not recorded | yes | What the player reports, not what was last requested. |
| `frame` | `number` | not recorded | yes |  |
| `durationFrames` | `number` | not recorded | yes |  |
| `onPlayPause` | `() => void` | not recorded | yes |  |
| `onStop` | `() => void` | not recorded | yes | Stop: pause and return to the start (or the in mark; the host decides). |
| `onSeek` | `(frame: number) => void` | not recorded | yes | Jumps and frame steps. One call per press. |
| `disabledReason` | `string` | not recorded | no | Disables every control and is read out as the reason, e.g. "No media loaded". |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/timeline/TransportControls.tsx -->
- `accessibilityLabel`: "Transport"
- `accessibilityRole`: "button", "toolbar"
- `accessibilityState`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
```tsx example=TransportControls
import { TransportControls } from "@nyc-tron/ui/components/forge/timeline/TransportControls";

export function Example() {
  return <TransportControls playing={false} frame={0} durationFrames={0} onPlayPause={() => {}} onStop={() => {}} onSeek={() => {}} />;
}
```
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
