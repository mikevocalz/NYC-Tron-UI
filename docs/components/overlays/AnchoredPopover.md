---
name: "AnchoredPopover"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/overlays/AnchoredPopover"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "overlay"
tokens: ["color.border", "color.surfaceRaised", "radius.control"]
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# AnchoredPopover

## Purpose

Modal popover placed against an anchor rectangle or trigger element and clamped to usable regions, for React Native; web Tab cycling.

## Install

- Package: @nyc-tron/ui
- Import: `import { AnchoredPopover } from "@nyc-tron/ui/components/overlays/AnchoredPopover";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/overlays/AnchoredPopover
```

### Dependencies

- `react-native`: `Modal`, `Platform`, `Pressable`, `View`, `useWindowDimensions`.
- `./popover-position.ts` (re-exports `placePopover`, `hasUsableRegion`, `Rect2D` from `@nyc-tron/core/overlays`), `./focus-cycle.ts` (`cycleFocusIndex`), `./focus-restore.ts` (`useRestoreFocus`), `./useTriggerAnchor.ts`, `./measure-anchor.ts` (`windowRegions`), `./anchored-popover-types.ts`, `../styles.ts` (`joinClasses`).
- No optional peers imported directly.

## Props

Tier-1 reason: R2 core family (overlays)
Import count: 4

`PopoverProps = PopoverAnchorProps | PopoverTriggerProps`. Exactly one of `anchor` and `trigger` must be set; `isTriggerPopover` throws `TypeError` for both or neither.

Shared (`PopoverBaseProps`, all readonly):

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| scope | string | "popover" | no | Identity token; a change discards the committed state. |
| open | boolean | none | yes | Controlled. |
| onOpenChange | (open: boolean) => void | none | yes | Called with `false` on Escape, backdrop press and Android back; `toggle` calls it with `!open`. |
| accessibilityLabel | string | none | yes | Used as `aria-label` of the dialog. |
| children | ReactNode | none | yes |  |
| width | number | 320 | no | Preferred; clamped by `placePopover`. |
| maxHeight | number | 420 | no | Preferred; clamped. |
| className | string | none | no | Joined onto the surface classes. |
| testID | string | none | no | On the surface. |

Rect form adds `anchor: Rect2D` (required) and `usableRegions: readonly Rect2D[]` (required). Trigger form adds `trigger: ReactNode | ((state: PopoverTriggerState) => ReactNode)` (required) and `usableRegions?` (default: the whole window as one region from `windowRegions`).

`Rect2D` (core overlays): `x`, `y`, `width`, `height`, all number. `PopoverTriggerState`: `open: boolean`, `toggle: () => void`, `triggerProps: { accessibilityState: { expanded }, "aria-expanded", "aria-haspopup": "dialog" }`.

### Tokens

`node tokenuse.mjs` output:
- `color.surfaceRaised` via `bg-surface-raised` (x1), `color.border` via `border-border` (x1), `radius.control` via `rounded-control` (x1)

Tailwind default classes (no token): `border` (x3, includes the `border-border` prefix match), `rounded-control`. Unmapped literals: `position:"absolute"` offsets, `overflow:"hidden"`.

### Unverified

- UNVERIFIED: where `placePopover` puts the surface for a given anchor and regions; its body in `@nyc-tron/core/overlays` was not read.
- UNVERIFIED: focus return to the opener (`useRestoreFocus`) and anchor measurement (`useTriggerAnchor`); those files were not read.

## Variants

- Rect form: draws from the given `anchor` and `usableRegions`.
- Trigger form: renders `trigger` in a `collapsable={false}` `View`, measures it on open through `useTriggerAnchor`, and keeps the surface mounted after the first measurement so closing can restore focus.

## States

| State | How it is set | What the code does |
|---|---|---|
| `open` | derived in code | `Modal visible={open}`. In the trigger form `visible` is `open && measured`. |
| `no usable region` | derived in code | `hasUsableRegion` false gives no position and the component renders `null`. |
| `trigger expanded` | derived in code | `triggerProps` carry `accessibilityState.expanded`, `aria-expanded` and `aria-haspopup="dialog"`. |
| `guarded callbacks` | derived in code | `close` runs only while open, with the committed token matching, and with a usable region. |

No hover, disabled, loading or error styling.

### Motion

none in source (`animationType="none"`).

### Platform notes

- `Platform.OS !== "web"` returns early from the Tab handler: only web gets Tab and Shift+Tab cycling through `querySelectorAll` of tabbable elements. The comment says native hosts own their Tab chain.
- The type docs say `className` is web only.
- The doc comment names `@nyc-tron/expo-controls/NativePopover` as the SwiftUI and Compose variant for iOS and Android; it is not imported.
- `Modal animationType="none"` always, per the comment about the web focus trap while fading.

## A11y

- Contrast: Surface bg-surface-raised with border-border 1.58/1.58:1; content is the caller's.
- Keyboard and focus: Web: Tab and Shift+Tab cycle inside the popover (:56-65), initial focus onShow focusFirst (:81). Escape through Modal onRequestClose. The scrim Close popover Pressable has focusable={false}. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Not a control; scrim covers the screen.
- Screen reader: Modal with accessibilityViewIsModal; surface role=dialog, aria-modal, aria-label (:86). Scrim has accessibilityLabel "Close popover".
- Motion: animationType="none" (:80), no fade.
- Review status: **PASS**. Dialog role, focus trap, Escape and instant open.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=AnchoredPopover
import { useState } from "react";
import { Pressable, Text } from "react-native";
import { AnchoredPopover } from "@nyc-tron/ui/components/overlays/AnchoredPopover";

export const Example = () => {
  const [open, setOpen] = useState(false);
  return (
    <AnchoredPopover open={open} onOpenChange={setOpen} accessibilityLabel="Filter options"
      width={280}
      trigger={({ toggle, triggerProps }) => (
        <Pressable {...triggerProps} accessibilityRole="button" onPress={toggle}>
          <Text>Filters</Text>
        </Pressable>
      )}>
      <Text>Popover content</Text>
    </AnchoredPopover>
  );
};
```

## Do/Don't

### Do

- Pass exactly one of `anchor` or `trigger`, because `isTriggerPopover` throws `TypeError` for both or neither.
- Set `accessibilityLabel` on every popover, since it becomes the `aria-label` of the dialog.
- Spread `triggerProps` onto the trigger element so it carries `aria-expanded` and `aria-haspopup="dialog"`.

### Don't

- Don't pass `anchor` without `usableRegions`; the rect form requires both, and with no usable region the component renders `null`.
- Don't state where `placePopover` puts the surface for a given anchor; the page marks that placement `UNVERIFIED`.
