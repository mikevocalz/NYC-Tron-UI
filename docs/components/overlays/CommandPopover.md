---
name: "CommandPopover"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/overlays/CommandPopover"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "overlay"
tokens: ["CommandPopover.space.1_75", "color.border", "color.danger", "color.primary", "color.surfaceRaised", "color.text", "color.textMuted", "font.12", "opacity.0_4", "radius.control", "space.3"]
registryDependencies: []
a11yStatus: "unverified"
---

# CommandPopover

## Purpose

Anchored popover menu of command items, with disabled and danger items, for React Native, web and QNX.

## Install

- Package: @nyc-tron/ui
- Import: `import { CommandPopover } from "@nyc-tron/ui/overlays/CommandPopover";`
- Peers: @nyc-tron/core, react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/overlays/CommandPopover
```

### Dependencies

- `react-native`: `Modal`, `Platform`, `Pressable`, `ScrollView`, `Text`, `View`.
- `./popover-position.ts`, `./focus-cycle.ts` (`cycleFocusTarget`), `./focus-restore.ts` (`useRestoreFocus`), `../styles.ts`.
- `@nyc-tron/core/overlays`: `CommandMenuItem` (type; `@nyc-tron/core` is an optional peer).

## Props

Tier-1 reason: R2 core family (overlays)
Import count: 6

`CommandPopoverProps` (own interface, no `extends`).

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | "commands" | no | Part of the open token. |
| `visible` | `boolean` | none | yes |  |
| `onDismiss` | `() => void` | none | yes | Called on dismissal and after a selection. |
| `onSelect` | `(id: string) => void` | none | yes |  |
| `anchor` | `Rect2D` | none | yes |  |
| `usableRegions` | `readonly Rect2D[]` | none | yes |  |
| `items` | `readonly CommandMenuItem[]` | none | yes |  |
| `width` | `number` | 268 | no |  |
| `maxHeight` | `number` | 420 | no | Capped by `max(56, items x 60 + 16)`. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | false | no |  |
| `surfaceColor` | `string` | none | no | Background override, applied only when styled. |
| `borderColor` | `string` | none | no | Border override (surface and items), styled only. |
| `textColor` | `string` | none | no | Label colour, styled only. |
| `mutedTextColor` | `string` | none | no | Description colour, styled only. |
| `dangerColor` | `string` | none | no | Colour for `danger` items, styled only. |
| `accessibilityLabel` | `string` | "Commands" | no | Menu label. |
| `testID` | `string` | none | no | Surface id; items get `<testID>-item-<id>`. |

`CommandMenuItem` (from `@nyc-tron/core/overlays`): `id: string`, `label: string`, `description?: string`, `disabled?: boolean`, `danger?: boolean`.

### Tokens

`node tokenuse.mjs` output:
- `space.3` from `paddingHorizontal: 12` (x1), `<Component>.space.1_75` from `paddingVertical: 7` (x1)
- `font.12` (x1), `opacity.0_4` (x1)
- `color.text` (x2), `color.border` (x2), `color.surfaceRaised` (x1), `color.primary` (x1), `color.danger` (x1), `color.textMuted` (x1)
- `radius.control` (x1)
- `minHeight: 56`: no token

Tailwind default classes (no token): `border` (x7), `rounded-control`, `border-b`. Unmapped: `bg-text/25` scrim, `fontWeight: "600"`.

### Unverified

- UNVERIFIED: placement result of `placePopover` and focus restore on close (`useRestoreFocus`); neither body was read.

## Variants

none.

## States

| State | How it is set | What the code does |
|---|---|---|
| `disabled item` | class `opacity: 0.4` | `disabled`, `accessibilityState.disabled`, `opacity: 0.4`, skipped by keyboard focus. |
| `danger item` | derived in code | `text-danger` or `dangerColor`. |
| `focus` | class `focus-visible:bg-primary/10` | `focus-visible:bg-primary/10` (styled). |
| `once settled` | derived in code | after a dismiss or select the open token is marked settled, so a second call in the same open does nothing. |
| `no usable region` | derived in code | renders `null`. |
| `Keyboard (onKeyDown on items)` | derived in code | Escape dismisses, Enter, Space and Spacebar select, Tab and arrows cycle, Home and End jump; modifier keys are ignored. |

### Motion

`Modal` fade on non-desktop platforms; none on desktop. No Animated or Reanimated.

### Platform notes

- `desktop = Platform.OS === "web" || String(Platform.OS) === "qnx" || String(Platform.OS) === "marathon"`. On desktop the `Modal` uses `animationType="none"` and `onShow` focuses the first enabled item; elsewhere `"fade"`.
- The doc comment says WinUI, AppKit, SwiftUI and Compose menu adapters are separate.

## A11y

- Contrast: Items text-text 17.79/13.83:1, destructive text-danger 6.57/7.24:1. Focus style is `focus-visible:bg-primary/10` only (:109): 1.15/1.2:1 (F12).
- Keyboard and focus: Arrow-key item navigation through onItemKey (:108); Modal Escape. Items are real focus targets, so a host outline may also draw (not checked). Desktop, QNX and marathon branch at :48 (no fade, keyboard menu). Windows and macOS follow the web or native branch of Platform.OS.
- Touch target: Items minHeight 56 (:110, no token). Passes both.
- Screen reader: role menu with label, items role menuitem with disabled state (:95-105). Scrim label "Dismiss menu".
- Motion: animationType fade on non-desktop (:87), not tied to reduce motion (F09).
- Review status: **UNVERIFIED**. Only focus cue in source is a 1.15/1.2:1 tint (F12).
  - UNVERIFIED: Whether a host outline draws on the focused menu item (F12). Test: Open a menu in a browser, press ArrowDown, screenshot the focused item; repeat on Windows and QNX.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=CommandPopover
import { useState } from "react";
import { CommandPopover } from "@nyc-tron/ui/components/overlays/CommandPopover";

export const Example = () => {
  const [visible, setVisible] = useState(true);
  return (
    <CommandPopover visible={visible} onDismiss={() => setVisible(false)}
      onSelect={id => console.log(id)}
      anchor={{ x: 40, y: 40, width: 120, height: 36 }}
      usableRegions={[{ x: 0, y: 0, width: 800, height: 600 }]}
      items={[
        { id: "rename", label: "Rename", description: "Change the file name" },
        { id: "delete", label: "Delete", danger: true },
      ]} />
  );
};
```

## Do/Don't

### Do

- Provide `onDismiss` and flip `visible` to false inside it, since it runs on dismissal and after every selection.
- Mark destructive items with `danger` so they use `text-danger`, which measures 6.57/7.24:1.

### Don't

- Don't count on the focused item being visible: the only source cue is `focus-visible:bg-primary/10` at 1.15/1.2:1 (F12), and a host outline is `UNVERIFIED`.
- Don't pass an `anchor` with no matching `usableRegions`; with no usable region it renders `null`.
- Don't expect a second `onSelect` in the same open; the open token is marked settled after the first dismiss or select.
