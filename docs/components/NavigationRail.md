---
name: "NavigationRail"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/NavigationRail"
tier: 1
docs: "handwritten"
platforms: []
category: "navigation"
tokens: ["color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.text", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# NavigationRail

## Purpose

Vertical rail of icon and label destinations with selected state and a collapsed icon-only mode, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { NavigationRail, NavigationShell } from "@nyc-tron/ui/components/NavigationRail";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/NavigationRail
```

### Dependencies

- `joinClasses` from `./styles.ts`.
- react-native (peer, required): Pressable, Text, View.
- No optional peers.

## Props

`NavigationRailProps` extends `Omit<ViewProps,"children">`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `items` | `readonly NavigationItem[]` | none | yes | Expanded below. |
| `selectedId` | `string \| null` | none | yes |  |
| `onSelectionChange` | `(id: string) => void` | none | yes | Called on every press, including the selected item. |
| `collapsed` | `boolean` | `false` | no | Hides labels only; rail width `w-16` instead of `w-52`. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |
| `itemClassName` | `string` | none | no |  |
| `selectedItemClassName` | `string` | none | no | Added when selected. |
| `labelClassName` | `string` | none | no |  |
| `edge` | `"left" \| "right"` | none | yes | Chooses `border-l` (right) or `border-r` (left). |

`NavigationItem` (readonly fields):

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| id | `string` | none | yes |  |
| label | `string` | none | yes | Also item `accessibilityLabel`. |
| icon | `ReactNode` | none | no | Hidden from accessibility. |
| disabled | `boolean` | none | no |  |

`NavigationShellProps` extends `Omit<ViewProps,"children">`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| children | `ReactNode` | none | yes | Content pane. |
| rail | `ReactNode` | none | yes | Rendered on the `edge` side. |
| edge | `"left"|"right"` | none | yes |  |
| className | `string` | none | no |  |
| contentClassName | `string` | none | no |  |
| isRTL | `boolean` | `false` | no | Sets the content View's `direction` to rtl or ltr. |

### Tokens

- `color.surfaceRaised` x1, `color.border` x2, `color.focus` x1, `color.primary` x1, `color.onPrimary` x1, `color.text` x1
- `radius.control` x1

Tailwind default classes (no token): `gap-1`, `w-16`, `w-52`, `py-3`, `border` x6, `min-h-11`, `gap-2`, `rounded-control`, `px-3`, `opacity-40`, `text-sm`.

### Unverified

- UNVERIFIED: The rail uses `accessibilityRole="tablist"` and `"tab"`, which is a selection pattern. How each platform's screen reader exposes tabs here is not provable from source.
- UNVERIFIED: No keyboard arrow handling exists in this file; keyboard behaviour rests on the host's focus handling for Pressable.

## Variants

none.

## States

| State | How it is set | What the code does |
|---|---|---|
| `selected` | derived in code | `id===selectedId`; `bg-primary`, `text-on-primary`, `accessibilityState.selected`. |
| `unselected` | derived in code | `bg-transparent`, `text-text`. |
| `disabled` | derived in code | `item.disabled`; `opacity-40`, `accessibilityState.disabled`. |
| `collapsed` | `collapsed` prop | `collapsed` prop. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-focus`. |
| `hover, pressed` | derived in code | no code. |

### Motion

none in source.

### Platform notes

none in source. `NavigationShell` pins the outer row to `direction:"ltr"` so RTL does not mirror the rail edge.

## A11y

- Contrast: Selected bg-primary and text-on-primary 5.81/7.46:1; others text-text 17.79/13.83:1. Selected item is bg-primary and the ring is ring-focus, the same colour (1/1:1); the ring's outer edge still meets the page at 5.81/6.93:1 (F07).
- Keyboard and focus: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:56). No roving handler, so every tab is a Tab stop. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Items min-h-11 (:55, 44, no token). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: tablist and tab roles with accessibilityState selected and disabled (:43-53). It is a destination list with no tabpanel, so tab is the wrong role for navigation (F17). Icons hidden.
- Motion: None.
- Review status: **UNVERIFIED**. Focus ring and selected fill share one colour (1/1:1) (F07).
  - UNVERIFIED: Focus visibility on the selected item (F07). Test: Tab to the selected item in light and dark and compare the focused and unfocused screenshots.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=NavigationRail
import { useState } from "react";
import { Text } from "react-native";
import { NavigationRail, NavigationShell } from "@nyc-tron/ui/components/NavigationRail";

export function AppShell() {
  const [id, setId] = useState<string | null>("home");
  return (
    <NavigationShell
      edge="left"
      rail={
        <NavigationRail
          edge="left"
          selectedId={id}
          onSelectionChange={setId}
          collapsed={false}
          items={[
            { id: "home", label: "Home", icon: <Text>H</Text> },
            { id: "files", label: "Files", disabled: true },
          ]}
        />
      }
    >
      <Text>Content</Text>
    </NavigationShell>
  );
}
```

## Do/Don't

### Do

- Set `edge` on both `NavigationRail` and `NavigationShell` to the same side, because it chooses `border-l` or `border-r` and the `rail` slot position.
- Give every item a clear `label`, since it doubles as the item `accessibilityLabel` while `icon` is hidden from accessibility.

### Don't

- Don't assume `collapsed` removes labels from screen readers; it hides labels only and the `label` still names the item.
- Don't treat the selected item's focus ring as proven visible: `ring-focus` matches the `bg-primary` fill at 1/1:1 (F07) and the page marks it `UNVERIFIED`.
- Don't claim arrow-key navigation works; the page says no roving handler exists, so every `tablist` tab is a Tab stop.
