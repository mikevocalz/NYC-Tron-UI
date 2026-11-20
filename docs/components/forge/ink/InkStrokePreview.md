---
name: "InkStrokePreview"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/forge/ink/InkStrokePreview"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: ["color.text", "space.2"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage", "@nyc-tron/forge/canvas/GPUCanvasViewport"]
a11yStatus: "declared"
---

# InkStrokePreview

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/ink/InkStrokePreview.tsx -->
A bounded pressure-sensitive Graphite test stroke, independent of the production brush engine.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/ink/InkStrokePreview.tsx -->
- Package: @nyc-tron/ui
- Import: `import { InkStrokePreview } from "@nyc-tron/ui/forge/ink/InkStrokePreview";`
- Peers: react, react-native, react-native-gesture-handler, react-native-skia, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage, @nyc-tron/forge/canvas/GPUCanvasViewport

```sh
npx shadcn@latest add @nyc-tron/forge/ink/InkStrokePreview
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/ink/InkStrokePreview.tsx -->
Extends: `Omit<ViewProps, 'children'>, ScopedControlProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `width` | `number` | not recorded | yes |  |
| `height` | `number` | not recorded | yes |  |
| `strokeWidth` | `number` | not recorded | yes |  |
| `inkColor` | `string` | not recorded | yes |  |
| `samples` | `readonly InkSample[]` | not recorded | no | External/native-adapter samples. Omit for the local test pad. |
| `onStroke` | `(samples: readonly InkSample[], signal?: AbortSignal) => void \| Promise<unknown>` | not recorded | no |  |
| `onSamples` | `(samples: readonly InkSample[] \| undefined) => void` | not recorded | no |  |
| `filterSamples` | `(samples: readonly InkSample[]) => readonly InkSample[]` | not recorded | no | Optional position filter. Pressure, tilt, twist and timestamps must be preserved. |
| `latencyMs` | `number` | not recorded | no | Measured end-to-end latency from the host's presentation clock; never inferred from RN receipt time. |
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

<!-- generated:begin a11y source=packages/ui/src/components/forge/ink/InkStrokePreview.tsx -->
- `accessibilityLabel`: "Test stroke"
- `accessibilityLiveRegion`: "polite"
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
```tsx example=InkStrokePreview
import { InkStrokePreview } from "@nyc-tron/ui/forge/ink/InkStrokePreview";

export function Example() {
  return <InkStrokePreview width={0} height={0} strokeWidth={0} inkColor="" />;
}
```
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
