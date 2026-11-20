---
name: "AnchoredPopoverTypesModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/overlays/anchored-popover-types"
tier: 2
docs: "generated"
platforms: []
category: "overlay"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# AnchoredPopoverTypesModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/overlays/anchored-popover-types.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/overlays/anchored-popover-types.ts -->
- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/overlays/anchored-popover-types
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { isTriggerPopover, popoverTriggerState, renderPopoverTrigger } from "@/components/nyc-tron/ui/components/overlays/anchored-popover-types";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { isTriggerPopover, popoverTriggerState, renderPopoverTrigger } from "@nyc-tron/ui/components/overlays/anchored-popover-types";`
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
