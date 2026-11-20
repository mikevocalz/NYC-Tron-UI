---
name: "Divider"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/layout/Divider"
tier: 1
docs: "handwritten"
platforms: []
category: "layout"
tokens: ["color.border"]
registryDependencies: ["@nyc-tron/layout/Stack"]
a11yStatus: "reviewed-pass"
---

# Divider

## Purpose

Decorative horizontal or vertical line, one border-width step thick, border colour role, no accessibility role, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { Divider } from "@nyc-tron/ui/components/layout/Divider";`
- Peers: react, react-native
- Requires: @nyc-tron/layout/Stack

```sh
npx shadcn@latest add @nyc-tron/layout/Divider
```

### Dependencies

- `react-native`: `View`, `ViewProps`, `ViewStyle`.
- `border` and `space` from `../../tokens.ts`; `joinClasses` from `../styles.ts`; `StackSpace` (type only) from `./Stack.tsx`.

## Props

Tier-1 reason: R2 core family (layout)
Import count: 0

`DividerProps extends Omit<ViewProps, "children">`. The component reads `orientation`, `inset`, `className` and `style`; every other `ViewProps` field is forwarded to the `View`. It sets no `accessibilityRole`, no label and no `accessible` prop. Pass them yourself if a screen needs the line announced.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | no | `horizontal` is `border[1]` high, `vertical` is `border[1]` wide. Both set `alignSelf: "stretch"`. |
| `inset` | `StackSpace` | none | no | Key of `space`. Margin at both ends of the line: `marginHorizontal` for `horizontal`, `marginVertical` for `vertical`. |
| `className` | `string` | none | no | Appended after `bg-border`. |

### Inherited props this component reads

Documented by hand from the source. They come from the extended type, so they are not in the table above.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| style | `StyleProp<ViewStyle>` | none | no | Placed after the built-in style, so it wins. |

### Tokens

- `border.1`: the line thickness, `border[1]` (computed, not listed by `token-use.mjs`).
- `color.border`: `bg-border` class x1.
- `space.0` to `space.4`: `inset` is looked up in `space` by key.

Tailwind default classes (no token): none.

### Unverified

- UNVERIFIED: whether the `bg-border` class paints on every host; it depends on the consumer's Tailwind or Uniwind interop, and without it the line has no colour.
- UNVERIFIED: how a screen reader treats an empty View with no role; no screen reader was run.

## Variants

### orientation

| Value | Effect |
|---|---|
| `horizontal` | `height: border[1]`, margin at the left and right ends from `inset`. |
| `vertical` | `width: border[1]`, margin at the top and bottom ends from `inset`. |

## States

None. The component has no interactive or conditional state.

### Motion

none in source

### Platform notes

none in source

## A11y

- Contrast: bg-border on raised and sunken surfaces is 1.58/1.58:1 and 1.42/1.75:1 (F03 pair). It is a decorative separator, not a control boundary, so SC 1.4.11 does not apply.
- Keyboard and focus: Not interactive.
- Touch target: Not interactive.
- Screen reader: Decorative by construction: no `accessibilityRole`, no label, no `accessible` prop. How each screen reader treats an empty View is covered by GU2.
- Motion: None.
- Review status: **PASS**. Decorative line with no semantics to get wrong.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=Divider
import { Text } from "react-native";
import { Stack } from "@nyc-tron/ui/components/layout/Stack";
import { Divider } from "@nyc-tron/ui/components/layout/Divider";

export const Example = () => (
  <Stack gap={3}>
    <Text>General</Text>
    <Divider inset={3} testID="section-divider" />
    <Text>Advanced</Text>
  </Stack>
);
```

## Do/Don't

### Do

- Use `inset` to shorten the line at both ends, since it sets `marginHorizontal` for `horizontal` and `marginVertical` for `vertical`.
- Set `orientation` to `vertical` inside a `Row`, because `alignSelf: "stretch"` then fills the row height.

### Don't

- Do not read it as a landmark: `Divider` sets no `accessibilityRole`, so a screen reader gets no separator announcement.
- Do not expect colour without `bg-border`; the page marks the class interop UNVERIFIED on some hosts.
- Do not use it to mark a control boundary, because the `border` role measures 1.58:1 on raised surfaces, under the 3:1 a boundary needs.
