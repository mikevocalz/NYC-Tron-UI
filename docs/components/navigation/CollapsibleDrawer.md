---
name: "CollapsibleDrawer"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/navigation/CollapsibleDrawer"
tier: 1
docs: "handwritten"
platforms: []
category: "navigation"
tokens: ["CollapsibleDrawer.font.22", "color.border", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.text", "radius.control", "space.1", "space.1.5", "space.2"]
registryDependencies: []
a11yStatus: "unverified"
---

# CollapsibleDrawer

## Purpose

Side navigation drawer menu in expanded, compact or minimal mode, with overlay and scrim when open, for React Native; Android back.

## Install

- Package: @nyc-tron/ui
- Import: `import { CollapsibleDrawer } from "@nyc-tron/ui/navigation/CollapsibleDrawer";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/navigation/CollapsibleDrawer
```

### Dependencies

- `react-native`: `BackHandler`, `Pressable`, `ScrollView`, `Text`, `View`, `ViewProps`.
- `./drawer-model.ts`: `drawerGeometry`, `DrawerMode`. `../styles.ts`: `joinClasses`.

## Props

Tier-1 reason: R2 core family (navigation)
Import count: 0

`CollapsibleDrawerProps extends Omit<ViewProps,"children">`. Read: `style` (placed after `{flex:1, direction:"ltr", position:"relative"}`); the rest is forwarded to the root `View`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | none | yes | Screen content, inset by `contentInsetLeft`. |
| `mode` | `DrawerMode` | none | yes |  |
| `open` | `boolean` | none | yes | Controlled. |
| `onOpenChange` | `(open: boolean) => void` | none | yes |  |
| `items` | `readonly DrawerDestination[]` | none | yes |  |
| `footerItems` | `readonly DrawerDestination[]` | [] | no |  |
| `selectedId` | `string \| null` | none | yes |  |
| `onSelectionChange` | `(id: string) => void` | none | yes | Not called for disabled items. |
| `title` | `string` | none | no | Shown only when labels are shown. |
| `expandedWidth` | `number` | 280 (in `drawerGeometry`) | no | Throws `RangeError` unless finite and at least 180. |
| `compactWidth` | `number` | 64 (in `drawerGeometry`) | no | Throws `RangeError` unless finite, at least 44 and below `expandedWidth`. |
| `className` | `string` | none | no | Root. |
| `paneClassName` | `string` | none | no |  |
| `itemClassName` | `string` | none | no | Also applied to the toggle. |
| `selectedItemClassName` | `string` | none | no |  |
| `contentClassName` | `string` | none | no |  |
| `unstyled` | `boolean` | false | no |  |

`DrawerDestination`: `id: string`, `label: string`, `icon?: ReactNode`, `disabled?: boolean` (all readonly). Without `icon` the first letter of `label`, uppercased, is shown.

### Tokens

`node tokenuse.mjs` output:
- `space.1` from `gap: 4` (x1), `space.1.5` from `paddingHorizontal: 6` (x2), `space.2` from `paddingVertical: 8` (x2)
- `<Component>.font.22` from `fontSize: 22` (x1; component-scoped pattern)
- `color.primary` (x1), `color.onPrimary` (x1), `color.text` (x1), `color.surfaceRaised` (x1), `color.border` (x1)
- `radius.control` (x1; the file has two `rounded-control` uses)
- `minWidth: 0`, `minHeight: 56`: no token

Tailwind default classes (no token): `h-12`, `w-12`, `rounded-control` (x2), `min-h-11`, `gap-3`, `px-3`, `opacity-40`, `text-sm`, `border` (x3), `border-r`, `flex-row`, `flex-col`, `items-center`, `justify-center`. Unmapped literals: `rgba(0,0,0,0.25)` scrim, `width: 36`, `zIndex` 2 and 3.

### Unverified

- UNVERIFIED: screen reader output for the modal pane, hidden content and toggle; no assistive technology was run.

## Variants

`mode` through `drawerGeometry`:
- `expanded`: pane width `expandedWidth`, labels shown, no overlay, no scrim, content inset `expandedWidth`.
- `compact`: content inset `compactWidth`; pane is `compactWidth` closed, `expandedWidth` open; labels, overlay and scrim only when open.
- `minimal`: content inset 0; pane hidden when closed, `expandedWidth` when open; labels, overlay and scrim only when open. A floating toggle shows while closed.
- The toggle button is not drawn in `expanded`.

## States

| State | How it is set | What the code does |
|---|---|---|
| `open overlay (compact or minimal with open)` | derived in code | scrim `Pressable` labelled "Close navigation menu"; pane has `accessibilityViewIsModal`; content gets `accessibilityElementsHidden` and `importantForAccessibility="no-hide-descendants"`; Android back closes it; choosing an item closes it. |
| `hidden pane` | class `display: "none"` | `pointerEvents="none"`, `display: "none"`, hidden from accessibility. |
| `selected item` | derived in code | `accessibilityState.selected`; `bg-primary` and `text-on-primary` (styled), plus `selectedItemClassName`. |
| `disabled item` | derived in code | `disabled`, `accessibilityState.disabled`, `opacity-40`. |
| `toggle` | derived in code | label "Close navigation" or "Open navigation", `accessibilityState.expanded` equals the overlay flag. |

No hover, focus, loading or error code.

### Motion

none in source. Pane width and display switch without animation.

### Platform notes

- `BackHandler` `hardwareBackPress` listener while the overlay is open (RN `BackHandler`; behaviour is Android's hardware back).
- Root style `direction: "ltr"` keeps the pane on the physical left in RTL languages (code comment).
- `drawer-model.ts` and the doc comment call it a Windows-compatible fallback that is not WinUI `NavigationView`. No `Platform.OS` checks.

## A11y

- Contrast: Selected item bg-primary with text-on-primary 5.81/7.46:1; others text-text 17.79/13.83:1. Scrim rgba(0,0,0,0.25) decorative.
- Keyboard and focus: No focus-visible class and no focus state on the toggle (:64-72) or the items (:81-93). Whether the host draws a default outline is not in the source (F10). No Escape handler in the file; the scrim Pressable and the toggle close it. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Toggle h-12 w-12 (:69, 48) passes both. Items min-h-11 (:87, 44, no token); header row minHeight 56 (:149). Android items: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: Toggle: button, label flips Open or Close navigation, state expanded. Items: button, label, state selected and disabled. Content behind an open overlay gets accessibilityElementsHidden and no-hide-descendants (:120-121), pane gets accessibilityViewIsModal (:136). The two lists carry labels but no landmark role (S1).
- Motion: No animation in the file (display toggles).
- Review status: **UNVERIFIED**. No explicit focus style for any control; default outline not checked (F10).
  - UNVERIFIED: Visible focus on toggle and items (F10). Test: Web: Tab to the toggle and each item, screenshot; native Windows and macOS: same with a keyboard.
  - UNVERIFIED: Hidden content stays unfocusable while overlay is open. Test: Web: open the overlay, press Tab, confirm focus stays inside the pane.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=CollapsibleDrawer
import { useState } from "react";
import { Text } from "react-native";
import { CollapsibleDrawer } from "@nyc-tron/ui/components/navigation/CollapsibleDrawer";

export const Example = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>("home");
  return (
    <CollapsibleDrawer mode="compact" open={open} onOpenChange={setOpen}
      title="Studio" selectedId={selected} onSelectionChange={setSelected}
      items={[{ id: "home", label: "Home" }, { id: "files", label: "Files" }]}
      footerItems={[{ id: "settings", label: "Settings", disabled: false }]}>
      <Text>Screen for {selected}</Text>
    </CollapsibleDrawer>
  );
};
```

## Do/Don't

### Do

- Give each `DrawerDestination` a `label`, since without `icon` the first letter of the label is shown.
- Pass `expandedWidth` of at least 180 and `compactWidth` between 44 and `expandedWidth`, since other values throw.
- Wire `onOpenChange` to state, because `open` is controlled and the scrim, toggle and item choice all close it through that callback.

### Don't

- Do not pass `compactWidth` below 44 or at or above `expandedWidth`, because it throws a RangeError.
- Do not ship without checking focus on the toggle and `items`, because neither has a focus-visible class and the status is UNVERIFIED (F10).
- Do not assume Tab stays inside the pane when `open` in `compact` or `minimal` mode, because hidden content staying unfocusable is UNVERIFIED.
