---
name: "NumericScrubFieldModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/NumericScrubField"
tier: 2
docs: "generated"
platforms: []
category: "shell"
tokens: []
registryDependencies: ["@nyc-tron/forge/inputs/PrecisionScrubber"]
a11yStatus: "unverified"
---

# NumericScrubFieldModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/shell/NumericScrubField.tsx -->
Canonical shell name for the shared precision scrubber.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/shell/NumericScrubField.tsx -->
- Package: @nyc-tron/ui
- Import: `import { NumericScrubField } from "@nyc-tron/ui/components/shell/NumericScrubField";`
- Peers: react, react-native
- Requires: @nyc-tron/forge/inputs/PrecisionScrubber

```sh
npx shadcn@latest add @nyc-tron/shell/NumericScrubField
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/shell/NumericScrubField.tsx -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `NumericScrubField` | function | `function PrecisionScrubber({ scope, revision, ...props }: PrecisionScrubberProps): import("react").JSX.Element;` |
| `NumericScrubFieldProps` | interface | `interface PrecisionScrubberProps extends Omit<ViewProps, "children">, RangeConfig { label: string; targetSize?: number; labels?: Partial<{ increase: string; ...` |
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

<!-- generated:begin a11y source=packages/ui/src/components/shell/NumericScrubField.tsx -->
_Not documented._
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
