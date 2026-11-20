---
name: "Select"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/Select"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "input"
tokens: ["color.border", "color.danger", "color.focus", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "reviewed-fail"
---

# Select

## Purpose

Single-select dropdown with flat or grouped options, hint and error text, for React Native; web combobox ARIA; QNX keyboard.

## Install

- Package: @nyc-tron/ui
- Import: `import { Select } from "@nyc-tron/ui/Select";`
- Peers: react, react-native, zustand
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/Select
```

### Dependencies

- `joinClasses`, `isModified`, `nextChoiceIndex`, `typeaheadIndex`, `webKey`, `flattenOptionGroups`, `validateOptionGroups` (same package).
- react-native (peer, required): Platform, Pressable, ScrollView, Text, View.
- `zustand` (`useStore`, `createStore` from `zustand/vanilla`): optional peer in package.json but imported unconditionally by this file.
- `react`: useId, useRef.

## Props

`SelectProps = SelectBaseProps & (SelectOptionsChoice | SelectGroupsChoice)`. `SelectBaseProps` extends `Omit<ViewProps,"children"|"role">`; `testID` is read, rest spread to the root View. Exactly one of `options` or `groups` (passing both makes `selectOptions` throw TypeError).

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| label | `string` | none | yes | Caption and accessible name. |
| value | `string` | none | yes |  |
| onValueChange | `(value:string)=>void` | none | yes | Not called when the picked value equals `value`. |
| disabled | `boolean` | `false` | no |  |
| placeholder | `string` | `"Choose…"` | no | Shown when `value` matches no option. |
| hint | `string` | none | no |  |
| errorText | `string` | none | no | Replaces `hint`. |
| className | `string` | none | no |  |
| labelClassName | `string` | none | no |  |
| triggerClassName | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |
| options | `readonly SelectOption[]` | none | one of options/groups | Flat choice. |
| groups | `readonly SelectGroup[]` | none | one of options/groups | `OptionGroup<SelectOption>` from forms/option-groups.ts: `heading:string` (not blank), `options` (at least one). |

`SelectOption`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| value | `string` | none | yes |  |
| label | `string` | `value` | no | Shown text. |
| disabled | `boolean` | none | no |  |

`selectOptions(props)` returns the flat option list (validates groups, throws on both shapes).

### Tokens

- `color.primary` x1, `color.surfaceSunken` x3, `color.onPrimary` x1, `color.text` x3, `color.border` x2, `color.surfaceRaised` x1, `color.textMuted` x4, `color.focus` x1, `color.danger` x2
- `radius.control` x2
- Inline `maxHeight: 320`, chevron `translateY` 2/-2, `45deg`/`-135deg`: no token.

Tailwind default classes (no token): `min-h-11`, `px-3` x3, `py-2`, `border-2`, `border` x11, `opacity-50` x2, `text-base` x3, `font-semibold` x3, `rounded-control` x2, `shadow-md`, `text-xs`, `min-w-0` x2, `gap-2` x2, `text-sm` x2, `min-h-12`, `h-2`, `w-2`.

### Unverified

- UNVERIFIED: The listbox is announced on iOS/Android as a plain `list` (the source comment says RN has no listbox role); actual spoken output is not provable here.
- UNVERIFIED: `zustand` is an optional peer yet imported at module top level: whether a missing install fails at import time depends on the consumer's bundler.

## Variants

none.

## States

| State | How it is set | What the code does |
|---|---|---|
| `closed/open` | derived in code | internal zustand store `{open,active}`; trigger `accessibilityState.expanded`, web `aria-expanded`. |
| `selected option` | derived in code | `bg-primary`, `text-on-primary font-semibold`, `aria-selected`. |
| `active (keyboard highlight) option` | derived in code | `bg-surface-sunken`. |
| `hover` | class `hover:bg-surface-sunken` | `hover:bg-surface-sunken` on options. |
| `error` | derived in code | `errorText`; `border-danger`, message Text with `accessibilityRole="alert"`, web `aria-invalid`. |
| `disabled` | derived in code | select `disabled` or option `disabled`; `opacity-50`. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-focus` on the trigger. |

### Motion

Chevron rotates via inline `transform` based on `open`; no transition or Animated call in source.

### Platform notes

- `web` (`Platform.OS==="web"`): select-only combobox ARIA (`aria-haspopup`, `aria-controls`, `aria-activedescendant`, listbox role), list absolutely positioned under the trigger, `onMouseDown` preventDefault on options, keyboard handler.
- `qnx` or `marathon` (`String(Platform.OS)`): keyboard handler and `onBlur` hide are attached, list container gets `accessible`, options get `focusable:false`.
- Other native: list opens in flow under the trigger; no key handling.
- Keys when open: ArrowUp/Down (no wrap), Home/End, typeahead, Enter/Space pick, Escape close, Tab close.

## A11y

- Contrast: Trigger on bg-surface-sunken with border-border: 1.42/1.75:1 (F03). Option states: selected bg-primary with text-on-primary 5.81/7.46:1; keyboard-active option bg-surface-sunken vs list bg-surface-raised 1.11/1.11:1; an option that is both active and selected shows only the selected fill, so the active cue is gone (:152) (F02). Error text-danger 6.57/7.24:1.
- Keyboard and focus: Trigger `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:189). Web and QNX use aria-activedescendant with Enter, Space, Arrows, Escape, Tab, typeahead (:109-131); options are not focused. Native uses taps. QNX branch at :80.
- Touch target: Trigger min-h-12 (:188, 48, no token) passes both; options min-h-11 (:150, 44). Android options: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: Web: combobox with aria-haspopup, aria-expanded, aria-controls, aria-activedescendant, aria-invalid, aria-describedby; listbox, option, group with heading (:135-186). Native: label plus shown value, hint, state expanded and disabled. Error is role alert with a polite live region (:202).
- Motion: No animation.
- Review status: **FAIL**. Keyboard-active option has a 1.11/1.11:1 cue and none when selected (2.4.7); trigger boundary under 3:1 (1.4.11).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=Select
import { useState } from "react";
import { Select } from "@nyc-tron/ui/components/Select";

export function UnitSelect() {
  const [unit, setUnit] = useState("");
  return (
    <Select
      label="Unit"
      value={unit}
      onValueChange={setUnit}
      placeholder="Choose a unit"
      hint="Applies to new documents."
      groups={[
        { heading: "Metric", options: [{ value: "mm", label: "Millimetres" }, { value: "cm" }] },
        { heading: "Imperial", options: [{ value: "in", label: "Inches" }] },
      ]}
    />
  );
}
```

## Do/Don't

### Do

- Pass either `options` or `groups`, never both, because `selectOptions` throws `TypeError` when both are set.
- Set `errorText` to show a failure, since it replaces `hint` and renders a message with `accessibilityRole="alert"`.

### Don't

- Don't depend on the keyboard-active option cue: `bg-surface-sunken` against the list is 1.11/1.11:1 and vanishes when the option is selected (2.4.7, FAIL).
- Don't rely on the trigger border for contrast; `border-border` on `bg-surface-sunken` is 1.42/1.75:1 (F03).
- Don't assume iOS and Android announce a listbox; the page marks the plain `list` announcement `UNVERIFIED`.
