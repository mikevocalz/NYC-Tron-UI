---
name: "SplitButton"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/SplitButton"
tier: 1
docs: "handwritten"
platforms: []
category: "input"
tokens: ["-space.1", "border.1", "border.1_5", "color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "opacity.0_4", "opacity.0_5", "radius.control"]
registryDependencies: ["@nyc-tron/overlays/CommandPopover", "@nyc-tron/shell/MenuButton"]
a11yStatus: "unverified"
---

# SplitButton

## Purpose

Primary action button joined to a dropdown menu of command items, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { SplitButton } from "@nyc-tron/ui/shell/SplitButton";`
- Peers: react, react-native
- Requires: @nyc-tron/overlays/CommandPopover, @nyc-tron/shell/MenuButton

```sh
npx shadcn@latest add @nyc-tron/shell/SplitButton
```

### Dependencies

- Internal: `./MenuButton.tsx`, `../overlays/CommandPopover.tsx` (type), `../overlays/popover-position.ts` (type), `../styles.ts`.
- External: `react`, `react-native` (Pressable, Text, View).
- Optional peers: none directly; `MenuButton` uses `zustand` (optional peer).

## Props

Extends `ViewProps` minus `children`. `style` is appended after the opacity style; `testID` yields `<testID>-primary` and `<testID>-menu` on the two parts. Other ViewProps spread onto the group View.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `editScope` | `string` | `"split-button"` | no | Combined with `disabled` into the boundary and passed to `MenuButton` as its `editScope`. |
| `label` | `string` | none | yes | Primary text, primary button name and group `accessibilityLabel`. |
| `onPress` | `() => void` | none | yes | Skipped when disabled or the boundary changed. |
| `items` | `readonly CommandMenuItem[]` | none | yes | Flyout items. |
| `onSelect` | `(id: string) => void` | none | yes |  |
| `menuLabel` | `string` | `` `More ${label} options` `` | no |  |
| `icon` | `ReactNode` | none | no | Wrapped in a `pointerEvents="none"` View. |
| `variant` | `"primary" \| "secondary"` | `"secondary"` | no |  |
| `disabled` | `boolean` | `false` | no |  |
| `usableRegions` | `readonly Rect2D[]` | none | no | Passed to `MenuButton`. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no | The `MenuButton` is always rendered `unstyled`. |

### Tokens

- Colour classes: color.onPrimary (3), color.text (2), color.primary (2), color.border (2), color.focus (2), color.surfaceSunken (1), color.surfaceRaised (1).
- radius.control (1). opacity.0_5 (disabled), opacity.0_4 (primary divider). border.1 (divider), border.1_5 (chevron right and bottom). space `-space.1` (chevron marginTop -4).
- no token: chevron 8 by 8.
- Tailwind default classes (no token): text-sm, font-semibold, border, rounded-control, min-h-11, min-w-11, gap-2, px-3.

### Unverified

- UNVERIFIED: how the group `role="group"` plus `accessibilityLabel` is announced next to the inner button of the same name.
- UNVERIFIED: popover behaviour; it lives in `CommandPopover`, which was not read.

## Variants

- `primary`: container `border-primary bg-primary`, text `text-on-primary`, chevron and divider `border-on-primary`, divider opacity 0.4.
- `secondary`: container `border-border bg-surface-raised`, text `text-text`, chevron `border-text`, divider `border-border` at opacity 1, and `hover:bg-surface-sunken` on both buttons.

## States

| State | How it is set | What the code does |
|---|---|---|
| `focus` | class `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus` on both buttons when styled. |
| `hover` | class `hover:bg-surface-sunken` | `hover:bg-surface-sunken`, secondary only. |
| `menu expanded` | derived in code | reported by the inner `MenuButton` (`aria-expanded`). |

- default; disabled (group opacity 0.5; `disabled` on the primary button and the MenuButton).

### Motion

none in source.

### Platform notes

none in source. Platform handling is inherited from `MenuButton` (qnx and marathon focus return).

## A11y

- Contrast: Primary variant text-on-primary on bg-primary 5.81/7.46:1; other variant text-text on raised 17.79/13.83:1; group border 1.58/1.58:1. Selected item is bg-primary and the ring is ring-focus, the same colour (1/1:1); the ring's outer edge still meets the page at 5.81/6.93:1 (F07).
- Keyboard and focus: Both halves `focus-visible:ring-2 ring-inset ring-focus` (:54, :62). Menu half is MenuButton. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: min-h-11 min-w-11 on both halves (:53, MenuButton :88). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: role=group labelled; primary button label; menu button label "More {label} options", aria-haspopup (:49-62).
- Motion: None.
- Review status: **UNVERIFIED**. Menu is CommandPopover (F12); primary fill and ring share a colour (F07).
  - UNVERIFIED: Focus visibility inside the menu and on the primary variant (F07, F12). Test: Tab to each half in both variants and open the menu with the keyboard.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=SplitButton
import {SplitButton} from "@nyc-tron/ui/components/shell/SplitButton";

export const Example=()=><SplitButton label="Export" variant="primary" onPress={()=>{}}
  items={[{id:"pdf",label:"PDF"},{id:"png",label:"PNG"}]} onSelect={id=>console.log(id)}/>;
```

## Do/Don't

### Do

- Pass `label`, `onPress`, `items` and `onSelect`; all four are required.
- Use `variant="primary"` for the main call to action and keep `secondary` as the default for quieter groups.
- Set `menuLabel` when the default `More ${label} options` does not describe the menu.

### Don't

- Do not assume the `primary` variant shows focus; its fill and `ring-focus` share one colour (F07) and visibility is UNVERIFIED.
- Do not assume the menu's popover behaviour or focus; it lives in `CommandPopover` and is UNVERIFIED (F12).
- Do not expect `unstyled` to restyle the menu half; the `MenuButton` is always rendered `unstyled`.
