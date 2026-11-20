---
name: "Button"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/Button"
tier: 1
docs: "handwritten"
platforms: []
category: "primitive"
tokens: ["color.border", "color.danger", "color.focus", "color.onDanger", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.text", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# Button

## Purpose

Pressable text button with primary, secondary, ghost and danger variants, loading spinner and icon slot, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { Button } from "@nyc-tron/ui/components/Button";`
- Peers: @nyc-tron/core, react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/Button
```

### Dependencies

- `joinClasses` from `./styles.ts` (same package).
- react-native (peer, required): Pressable, Text, View, ActivityIndicator.
- react (peer, required, types only).
- No optional peers.

## Props

Extends `Omit<PressableProps,"children"|"disabled">`. Read or overridden from the inherited set: `onPress` (passed through), `style` (a function or value, merged after the built-in min sizes), `hitSlop` (defaults to 2 when `size` is `sm`), `accessibilityLabel` (defaults to `title`), `accessibilityState` (merged, `disabled` and `busy` overwritten). `disabled` is redeclared as a plain boolean.

Extends: `Omit<PressableProps, "children" | "disabled">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `ref` | `Ref<ComponentRef<typeof Pressable>>` | none | no | React 19 ref-as-prop, reaches the Pressable. |
| `title` | `string` | none | yes | Label text and default accessibilityLabel. |
| `targetSize` | `number` | none | no | Throws RangeError unless finite and at least 44. Sets minWidth and minHeight, and drops `min-h-*` from the size class. |
| `numberOfLines` | `number` | none | no | Throws RangeError unless an integer from 1 to 64. Forwarded to the label Text. |
| `icon` | `ReactNode` | none | no | Rendered in a View before the label. |
| `variant` | `ButtonVariant` | `"primary"` | no |  |
| `size` | `ButtonSize` | `"md"` | no |  |
| `disabled` | `boolean` | `false` | no | Combined with `loading` into one disabled flag. |
| `loading` | `boolean` | `false` | no | Shows an ActivityIndicator and disables the control. |
| `className` | `string` | none | no | Appended last. |
| `unstyled` | `boolean` | `false` | no | Drops every default visual class; layout classes `flex-row items-center justify-center` stay. |
| `labelClassName` | `string` | none | no |  |
| `iconClassName` | `string` | none | no |  |

### Tokens

- `color.primary`: `bg-primary` x1
- `color.border`: `border-border` x2
- `color.onPrimary`: `text-on-primary` x2
- `color.surfaceRaised`: `bg-surface-raised` x1
- `color.text`: `text-text` x2
- `color.danger`: `bg-danger border-danger` x2
- `color.onDanger`: `text-on-danger` x1
- `color.focus`: `ring-focus` x1
- `radius.control`: `rounded-control` x1
- Inline literals `minWidth: 44`, `minHeight` 40/44/48, `hitSlop` 2, `flexShrink: 1`: no token (tokenuse reports none for this file).

Tailwind default classes (no token): `border` x7, `min-h-10`, `min-h-11`, `min-h-12`, `gap-2` x2, `gap-3`, `px-3`, `px-4`, `px-5`, `py-2` x2, `py-3`, `opacity-80`, `opacity-50`, `font-semibold`.

### Unverified

- UNVERIFIED: Whether the `className` prop is applied to the Pressable depends on the host's className interop (it is spread through an untyped object); the source shows no fallback.

## Variants

### variant

| Value | Effect |
|---|---|
| `primary` | root `bg-primary border-border text-on-primary`, label `text-on-primary`. |
| `secondary` | root `bg-surface-raised border-border`, label `text-text`. |
| `ghost` | root `bg-transparent border-transparent`, label `text-text`. |
| `danger` | root `bg-danger border-danger`, label `text-on-danger`. |

### size

| Value | Effect |
|---|---|
| `sm` | `min-h-10 gap-2 px-3 py-2`, minHeight 40. |
| `md` | `min-h-11 gap-2 px-4 py-2.5`, minHeight 44. |
| `lg` | `min-h-12 gap-3 px-5 py-3`, minHeight 48. |

minWidth is 44 for every size.

## States

| State | How it is set | What the code does |
|---|---|---|
| `default` | derived in code | classes above. |
| `pressed` | class `active:opacity-80` | `active:opacity-80` class (styled only). The `style` prop also receives the Pressable state. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-focus` (styled only). |
| `disabled` | `disabled` prop | `disabled` prop; sets Pressable `disabled`, `accessibilityState.disabled`, and `opacity-50`. |
| `loading` | `loading` prop | `loading` prop; renders `ActivityIndicator` with accessibilityLabel "Loading", sets `accessibilityState.busy`, disables the control, applies `opacity-50`. |
| `hover` | derived in code | no code. |

### Motion

`active:opacity-80` and `motion-reduce:transition-none` classes. No Animated or Reanimated calls, no durations.

### Platform notes

none in source. The package.json export entry has `types`, `react-native` and `default` conditions only.

## A11y

- Contrast: Label pairs: primary onPrimary/primary 5.81/7.46:1; danger onDanger/danger 6.57/8.11:1; secondary and ghost text/surfaceRaised 17.79/13.83:1. Loading spinner has no color prop (Button.tsx:68): iOS default #999999 on primary is 2.04/1.19:1 (F11). Disabled and loading use opacity 0.5, exempt as an inactive control.
- Keyboard and focus: Web: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) at Button.tsx:55. Keyboard: native Pressable. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: minWidth 44 and minHeight 40/44/48 by size (Button.tsx:59, size.touch for 44, 40 and 48 have no token); sm adds hitSlop 2 (:61) so its hit area is 44. targetSize prop throws below 44. iOS pass. Android: sm and md 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: accessibilityRole=button, accessibilityLabel defaults to title, accessibilityState disabled and busy (:63-65). Spinner labelled Loading. Nothing missing.
- Motion: No animation besides the platform ActivityIndicator. `motion-reduce:transition-none` (:55) has no transition class beside it, so it does nothing as written (F09).
- Review status: **UNVERIFIED**. Spinner colour on primary and danger fills is 2.04/1.19:1 on iOS if the platform default applies.
  - UNVERIFIED: Loading spinner contrast on the primary and danger fills (F11). Test: Render loading Button on an iOS simulator, sample the spinner pixel against the fill, or set color explicitly and re-measure.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=Button
import { Text } from "react-native";
import { Button } from "@nyc-tron/ui/components/Button";

export function SaveRow({ saving, onSave }: { saving: boolean; onSave: () => void }) {
  return (
    <Button
      title="Save changes"
      variant="primary"
      size="md"
      loading={saving}
      icon={<Text>+</Text>}
      numberOfLines={1}
      onPress={onSave}
    />
  );
}
```

## Do/Don't

### Do

- Set `loading` while a save runs, since it shows the ActivityIndicator, sets `accessibilityState.busy` and disables the control in one prop.
- Pass `targetSize` of 44 or more when a design needs a larger hit area, because it sets both `minWidth` and `minHeight`.
- Give `numberOfLines` an integer from 1 to 64 to cap long labels, because the value is forwarded to the label Text.

### Don't

- Do not pass `targetSize` below 44 or a non-finite value, because it throws a RangeError at render.
- Do not rely on the loading spinner against `primary` or `danger` fills; its iOS default color measures 2.04:1 and 1.19:1 (F11) and is UNVERIFIED.
- Do not assume `className` reaches the Pressable on every host; the page marks that UNVERIFIED because it depends on the host's className interop.
