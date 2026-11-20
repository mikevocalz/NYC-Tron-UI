---
name: "AnchoredPopoverTypesModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/overlays/anchored-popover-types"
tier: 2
docs: "generated"
platforms: []
category: "overlay"
tokens: []
registryDependencies: []
a11yStatus: "declared"
---

# AnchoredPopoverTypesModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/overlays/anchored-popover-types.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/overlays/anchored-popover-types.ts -->
- Package: @nyc-tron/ui
- Import: `import { isTriggerPopover, popoverTriggerState, renderPopoverTrigger } from "@nyc-tron/ui/overlays/anchored-popover-types";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/overlays/anchored-popover-types
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/overlays/anchored-popover-types.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `PopoverAnchorProps` | interface | `interface PopoverAnchorProps extends PopoverBaseProps { readonly anchor: Rect2D; readonly usableRegions: readonly Rect2D[]; readonly trigger?: undefined; }` |
| `PopoverBaseProps` | interface | `interface PopoverBaseProps { readonly scope?: string; readonly open: boolean; readonly onOpenChange: (open: boolean) => void; readonly accessibilityLabel: st...` |
| `PopoverProps` | type | `type PopoverProps = PopoverAnchorProps \| PopoverTriggerProps;` |
| `PopoverTriggerProps` | interface | `interface PopoverTriggerProps extends PopoverBaseProps { readonly trigger: ReactNode \| ((state: PopoverTriggerState) => ReactNode); readonly usableRegions?: ...` |
| `PopoverTriggerState` | interface | `interface PopoverTriggerState { readonly open: boolean; readonly toggle: () => void; readonly triggerProps: { readonly accessibilityState: { readonly expande...` |
| `isTriggerPopover` | function | `function isTriggerPopover(props: PopoverProps): props is PopoverTriggerProps;` |
| `popoverTriggerState` | function | `function popoverTriggerState(open: boolean, onOpenChange: (open: boolean) => void): PopoverTriggerState;` |
| `renderPopoverTrigger` | function | `function renderPopoverTrigger(trigger: PopoverTriggerProps["trigger"], state: PopoverTriggerState): ReactNode;` |
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

<!-- generated:begin a11y source=packages/ui/src/components/overlays/anchored-popover-types.ts -->
- `accessibilityLabel`: set from an expression
- `accessibilityState`: set from an expression
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
