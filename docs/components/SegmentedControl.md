---
name: "SegmentedControl"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/SegmentedControl"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "input"
tokens: ["color.border", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "radius.control"]
registryDependencies: []
a11yStatus: "unverified"
---

# SegmentedControl

## Purpose

Single-choice segmented control exposed as a radio group, for React Native; arrow-key navigation on web only.

## Install

- Package: @nyc-tron/ui
- Import: `import { SegmentedControl } from "@nyc-tron/ui/SegmentedControl";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/SegmentedControl
```

### Dependencies

- `joinClasses` from `./styles.ts`; `domIsRTL`, `isModified`, `nextChoiceIndex`, `rovingStop`, `webKey` from `./forms/choice-keys.ts`.
- react-native (peer, required): I18nManager, Platform, Pressable, Text, View.
- No optional peers.

## Props

Generic: `SegmentedControl<T extends string=string>`. `SegmentedControlProps<T>` extends `Omit<ViewProps,"children"|"role">`; `style` is merged after `flexDirection:"row",flexWrap:"wrap"`.

Extends: `Omit<ViewProps, "children" | "role">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `options` | `readonly SegmentedOption<T>[]` | none | yes | Expanded below. |
| `value` | `T \| ""` | none | yes | A value matching no option leaves every segment unchecked. |
| `onChange` | `(value: T) => void` | none | yes | Not called when the pressed option is already selected or is disabled. |
| `aria-label` | `string` | none | no | Names the radiogroup. |
| `aria-labelledby` | `string` | none | no |  |
| `disabled` | `boolean` | `false` | no | Disables every segment; sets `aria-disabled` on the group. |
| `className` | `string` | none | no |  |
| `segmentClassName` | `string` | none | no |  |
| `labelClassName` | `string` | none | no |  |
| `segmentStyle` | `StyleProp<ViewStyle> \| ((state: { selected: boolean; disabled: boolean; pressed: boolean; }) => StyleProp<ViewStyle>)` | none | no |  |
| `labelStyle` | `StyleProp<TextStyle>` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

`SegmentedOption<T>`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| value | `T` | none | yes |  |
| label | `string` | none | yes |  |
| disabled | `boolean` | none | no |  |

### Tokens

- `color.border` x1, `color.surfaceSunken` x1, `color.focus` x1, `color.primary` x1, `color.surfaceRaised` x1, `color.onPrimary` x1, `color.text` x1
- `radius.control` x2
- `size.touch`: `minHeight: 44` x1, `minWidth: 44` x1

Tailwind default classes (no token): `gap-0` (from `gap-0.5`), `rounded-control` x2, `border` x4, `p-0` (from `p-0.5`), `min-h-11`, `min-w-11`, `px-3`, `py-1` (from `py-1.5`), `border-2`, `opacity-50`, `text-sm`, `font-medium`.

### Unverified

- UNVERIFIED: Native screen reader traversal of `role="radio"` segments: the doc comment claims every segment is reachable; not provable from source.

## Variants

none.

## States

| State | How it is set | What the code does |
|---|---|---|
| `selected` | derived in code | segment matching `value`; `aria-checked`, `accessibilityState.checked`, `bg-primary`, `text-on-primary`. |
| `disabled` | `disabled` prop | group `disabled` or option `disabled`; `opacity-50`, `accessibilityState.disabled`, skipped by keys. |
| `hover` | class `hover:bg-surface-raised` | `hover:bg-surface-raised` on unselected segments. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-focus`. |
| `pressed` | derived in code | only through the `segmentStyle` function state. |

### Motion

`motion-reduce:transition-none`. No Animated calls.

### Platform notes

- Web only: `onKeyDown` and `tabIndex` are attached when `Platform.OS==="web"`. Checked segment has tabIndex 0, others -1. Arrow keys move and select with wrap, flipped in RTL (`I18nManager.isRTL` or DOM direction), Home/End jump, disabled skipped, modifier keys ignored.
- Native: no key handling in the file.

## A11y

- Contrast: Active segment bg-primary with text-on-primary 5.81/7.46:1; inactive text-text on sunken 16.01/15.31:1. Container border 1.42/1.75:1, decorative. Selected item is bg-primary and the ring is ring-focus, the same colour (1/1:1); the ring's outer edge still meets the page at 5.81/6.93:1 (F07).
- Keyboard and focus: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:80). Web: roving tabIndex and arrow keys (:78, :53). Native: no key handler. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: minHeight and minWidth 44 inline (:74) and min-h-11 min-w-11. Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: radiogroup with aria-label or aria-labelledby; each segment role=radio with checked and disabled state (:63-72).
- Motion: `motion-reduce:transition-none` with no transition (F09).
- Review status: **UNVERIFIED**. Focus ring and selected fill share one colour (1/1:1) (F07).
  - UNVERIFIED: Focus visibility on the active segment (F07). Test: Tab into the group, screenshot, compare with the unfocused state.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=SegmentedControl
import { useState } from "react";
import { SegmentedControl } from "@nyc-tron/ui/components/SegmentedControl";

type View = "list" | "grid";

export function ViewSwitch() {
  const [view, setView] = useState<View>("list");
  return (
    <SegmentedControl<View>
      aria-label="Layout"
      value={view}
      onChange={setView}
      options={[
        { value: "list", label: "List" },
        { value: "grid", label: "Grid", disabled: false },
      ]}
    />
  );
}
```

## Do/Don't

### Do

- Set `aria-label` or `aria-labelledby` so the radiogroup has a name.
- Use `segmentStyle` as a function when you need the `pressed` state, since that is the only route to it.

### Don't

- Don't expect `onChange` for the already selected option or a disabled one; it is not called.
- Don't rely on arrow keys on native: key handling and `tabIndex` attach only when `Platform.OS` is web.
- Don't assume the focused active segment shows a ring; `ring-focus` equals the `bg-primary` fill at 1/1:1 (F07), still `UNVERIFIED`.
