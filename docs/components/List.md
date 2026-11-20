---
name: "List"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/List"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "display"
tokens: ["color.border", "color.focus", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "reviewed-fail"
---

# List

## Purpose

Vertical list of rows with title, supporting text, leading and trailing slots; rows with onPress become buttons, for React Native.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/List
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { List, ListItem } from "@/components/nyc-tron/ui/components/List";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { List, ListItem } from "@nyc-tron/ui/components/List";`

### Dependencies

- `joinClasses` from `./styles.ts`.
- react-native (peer, required): Children use via react, Platform, Pressable, Text, View.
- No optional peers.

## Props

`ListProps` extends `Omit<ViewProps,"children"|"role">`:

Extends: `Omit<ViewProps, "children" | "role">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | none | no | Only valid elements are kept; each is wrapped in a `role="listitem"` View. |
| `aria-label` | `string` | none | no |  |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

`ListItemProps` extends `Omit<ViewProps,"children"|"role">`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| children | `ReactNode` | none | no | A string or number renders as the title Text. |
| supportingText | `string` | none | no |  |
| leading | `ReactNode` | none | no |  |
| trailing | `ReactNode` | none | no |  |
| onPress | `()=>void` | none | no | Renders a Pressable (accessibilityRole button) instead of a View. |
| selected | `boolean` | none | no | Adds `bg-primary/10`; sets `accessibilityState.selected`. |
| disabled | `boolean` | `false` | no | Only applied in the Pressable branch. |
| accessibilityHint | `string` | none | no | Pressable branch only. |
| className | `string` | none | no |  |
| titleClassName | `string` | none | no |  |
| supportingClassName | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |

### Tokens

- `color.border` x2, `color.surfaceRaised` x1, `color.text` x1, `color.textMuted` x1, `color.primary` x1 (`bg-primary/10`), `color.focus` x1, `color.surfaceSunken` x1
- `radius.control` x1

Tailwind default classes (no token): `min-w-0` x2, `rounded-control`, `border` x7, `text-base`, `gap-0` (from `gap-0.5`), `text-sm`, `gap-1`, `min-h-11`, `gap-3`, `px-3`, `py-2`, `border-2`, `opacity-80`, `opacity-50`.

### Unverified

- UNVERIFIED: Spoken name of a pressable row whose `children` is not a string or number: `accessibilityLabel` is then undefined and the result depends on the host reading child text.

## Variants

none.

## States

| State | How it is set | What the code does |
|---|---|---|
| `default` | derived in code | row classes. |
| `pressed` | class `active:opacity-80` | `active:opacity-80` (Pressable branch). |
| `hover` | class `hover:bg-surface-sunken` | `hover:bg-surface-sunken` when pressable and not selected. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus`. |
| `disabled` | derived in code | `disabled` prop, `opacity-50`, `accessibilityState.disabled`. |
| `selected` | derived in code | `selected` prop; `bg-primary/10`, forced-colors border, `accessibilityState.selected`, on web `aria-current="true"` in the Pressable branch. |

### Motion

`active:opacity-80`, `motion-reduce:transition-none`. No Animated calls.

### Platform notes

- `Platform.OS==="web"` adds `aria-current` on a selected pressable row.

## A11y

- Contrast: title text-text 17.79/13.83:1, supporting text-text-muted 6.16/7.14:1. Selected row bg-primary/10 vs raised 1.15/1.2:1 (F04). Hover bg-surface-sunken vs raised 1.11/1.11:1 is hover only.
- Keyboard and focus: Pressable rows: `focus-visible:ring-2 ring-inset ring-focus` (:80, 5.81/6.93:1). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Rows min-h-11 (:69, 44, no token). Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: role=list and listitem (:39, :42). Pressable row: accessibilityRole=button, label from children plus supporting text, hint, state disabled and selected, aria-current on web (:75-78). A non-pressable selected row sets accessibilityState on a View that is not accessible, so iOS ignores it (:70-71).
- Motion: `motion-reduce:transition-none` with no transition (F09).
- Review status: **FAIL**. Selected row marked by a 1.15/1.2:1 tint (1.4.11).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=List
import { Text } from "react-native";
import { List, ListItem } from "@/components/nyc-tron/ui/components/List";

export function SettingsList({ onOpen }: { onOpen: () => void }) {
  return (
    <List aria-label="Settings">
      <ListItem supportingText="Light, dark or system" leading={<Text>A</Text>} onPress={onOpen} selected>
        Appearance
      </ListItem>
      <ListItem trailing={<Text>On</Text>}>Notifications</ListItem>
    </List>
  );
}
```

## Do/Don't

### Do

- Pass `onPress` for tappable rows, since it renders a Pressable with `accessibilityRole` button and the `accessibilityHint` is applied there.
- Give pressable rows string or number `children`, because the accessible label is built from them plus `supportingText`.
- Add `aria-label` on `List` to name the group, since the root carries `role="list"`.

### Don't

- Do not use `selected` alone to mark the current row, because `bg-primary/10` is 1.15:1 (F04) and the review is FAIL (1.4.11).
- Do not set `selected` on a row without `onPress` and expect iOS to announce it, because the state lands on a View that is not accessible.
- Do not set `disabled` on a non-pressable row, because it only applies in the Pressable branch.
