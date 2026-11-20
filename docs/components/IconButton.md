---
name: "IconButton"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/IconButton"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "primitive"
tokens: ["color.border", "color.danger", "color.focus", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "radius.control"]
registryDependencies: []
a11yStatus: "reviewed-fail"
---

# IconButton

## Purpose

Icon-only pressable button with five variants and an optional selected toggle state, for React Native; web aria-pressed.

## Install

- Package: @nyc-tron/ui
- Import: `import { IconButton } from "@nyc-tron/ui/IconButton";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/IconButton
```

### Dependencies

- `joinClasses` from `./styles.ts`.
- react-native (peer, required): Platform, Pressable, View.
- No optional peers.

## Props

Extends `Omit<PressableProps,"children"|"disabled"|"style">`. Read specially: `onPress`, `accessibilityState` (merged; `disabled` overwritten, `selected` added when `selected` is defined). `style` is redeclared as `PressableProps["style"]`.

Extends: `Omit<PressableProps, "children" | "disabled" | "style">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `icon` | `ReactNode` | none | yes | Wrapped in a View with `aria-hidden`. |
| `aria-label` | `string` | none | yes | Sets both `aria-label` and `accessibilityLabel`. |
| `accessibilityHint` | `string` | none | no |  |
| `variant` | `IconButtonVariant` | `"ghost"` | no |  |
| `size` | `"sm" \| "md"` | `"md"` | no | `sm` is `h-11 w-11` (44), `md` is `h-12 w-12` (48). |
| `disabled` | `boolean` | `false` | no | Adds `opacity-50`. |
| `targetSize` | `number` | none | no | Throws RangeError unless finite and at least 44. Sets minWidth and minHeight. |
| `selected` | `boolean` | none | no | Toggle state. Undefined means not a toggle. |
| `cornerRadius` | `number` | none | no | Inline `borderRadius`. |
| `className` | `string` | none | no |  |
| `style` | `PressableProps["style"]` | none | no | Function or value; merged after the built-in min size and radius. |
| `unstyled` | `boolean` | `false` | no |  |

### Tokens

- `color.primary`: `bg-primary` x1 and `bg-primary/10` x1
- `color.border`: x4
- `color.surfaceRaised` x1, `color.surfaceSunken` x1, `color.danger` x2, `color.focus` x1
- `radius.control`: x1
- Inline `minWidth/minHeight` 44 and 48: no token (tokenuse reports none for this file).

Tailwind default classes (no token): `border` x12, `h-11`, `w-11`, `h-12`, `w-12`, `opacity-80`, `opacity-50`.

### Unverified

- UNVERIFIED: Screen reader output when both `aria-label` and `accessibilityLabel` are set: depends on the host's RN version and platform, not on code in this file.

## Variants

### variant

| Value | Effect |
|---|---|
| `primary` | `bg-primary border-border`. |
| `secondary` | `bg-surface-raised border-border`. |
| `outline` | `bg-transparent border-border`. |
| `ghost` | `bg-transparent border-transparent hover:bg-surface-sunken`. |
| `danger` | `bg-danger border-danger`. |

`size`: `sm` gives `h-11 w-11` and min 44; `md` gives `h-12 w-12` and min 48.

## States

| State | How it is set | What the code does |
|---|---|---|
| `pressed` | class `active:opacity-80` | `active:opacity-80` class. |
| `hover` | class `hover:bg-surface-sunken` | `hover:bg-surface-sunken` on the `ghost` variant only. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-focus`. |
| `disabled` | `disabled` prop | `disabled` prop; `accessibilityState.disabled`, `opacity-50`. |
| `selected` | `selected` prop | `selected` prop; `accessibilityState.selected`, and on web `aria-pressed`. On non-primary, non-danger variants it swaps the variant class for `bg-primary/10 border-border forced-colors:border-[Highlight]`. |

### Motion

`active:opacity-80`, `motion-reduce:transition-none`. No Animated calls.

### Platform notes

- `Platform.OS==="web"` adds `aria-pressed` when `selected` is defined.

## A11y

- Contrast: Selected non-primary variants use bg-primary/10 with border-border: tint 1.15/1.2:1, border 1.58/1.58:1, both under 3:1 (F04; forced-colors gets border-[Highlight]). Primary and danger fills: icon colour is the caller's, so glyph contrast is UNVERIFIED. Ring 5.81/6.93:1.
- Keyboard and focus: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:55). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: sm 44, md 48 as minWidth and minHeight plus h-11/h-12 (:46, :54); targetSize overrides. sm is size.touch. Android: sm 44 literal, 4dp under the 48dp Android guideline. md passes. Android 48dp: below (F08).
- Screen reader: accessibilityRole=button, aria-label and accessibilityLabel both set, optional hint, accessibilityState disabled and selected, aria-pressed on web (:49-51). Icon wrapper aria-hidden.
- Motion: `motion-reduce:transition-none` with no transition class (F09).
- Review status: **FAIL**. Selected state is a 1.15/1.2:1 tint (1.4.11).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=IconButton
import { useState } from "react";
import { Text } from "react-native";
import { IconButton } from "@nyc-tron/ui/components/IconButton";

export function PinToggle() {
  const [pinned, setPinned] = useState(false);
  return (
    <IconButton
      aria-label="Pin pane"
      icon={<Text>P</Text>}
      variant="ghost"
      size="sm"
      selected={pinned}
      onPress={() => setPinned(!pinned)}
    />
  );
}
```

## Do/Don't

### Do

- Always pass `aria-label`, since it is required and sets both `aria-label` and `accessibilityLabel` for an icon-only control.
- Use `size` of `md` on Android, because `sm` is 44 and 4dp under the 48dp guideline (F08).
- Set `selected` only for real toggles, since undefined means not a toggle and it drives `aria-pressed` on web.

### Don't

- Do not use `selected` on `outline`, `secondary` or `ghost` as the only cue, because the `bg-primary/10` tint is 1.15:1 and the review is FAIL (F04).
- Do not pass `targetSize` below 44 or non-finite, because it throws a RangeError.
- Do not assume icon contrast on `primary` or `danger` fills, because the icon color is the caller's and the page marks it UNVERIFIED.
