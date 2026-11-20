---
name: "Text"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/layout/Text"
tier: 1
docs: "handwritten"
platforms: []
category: "layout"
tokens: ["color.accent", "color.danger", "color.info", "color.onDanger", "color.onPrimary", "color.primary", "color.success", "color.text", "color.textMuted"]
registryDependencies: []
a11yStatus: "unverified"
---

# Text

## Purpose

Text with body or caption size from the token scale, a font-size override and a theme colour tone, no weight, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { Text } from "@nyc-tron/ui/components/layout/Text";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/layout/Text
```

### Dependencies

- `react-native`: `Text` (imported as `NativeText`), `TextProps`, `TextStyle`.
- `font` and `leading` from `../../tokens.ts`; `joinClasses` from `../styles.ts`.

## Props

Tier-1 reason: R2 core family (layout)
Import count: 0

`TextProps extends Omit<TextProps (react-native), "children">`. The component reads `children`, `variant`, `size`, `tone`, `className` and `style`; every other React Native `Text` prop, `testID`, `numberOfLines` and the `accessibility*` props included, is forwarded.

Extends: `Omit<NativeTextProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | none | no | Rendered inside the React Native `Text`. |
| `variant` | `TextVariant` | none | no | Font size and line height from the token scale. Omit it to inherit the size from the parent. |
| `size` | `TextSize` | none | no | Key of `font` (10 to 17). Sets `fontSize` only and replaces the variant, so the variant line height is dropped. |
| `tone` | `TextTone` | `"text"` | no | Theme colour role, as a class (see Variants). |
| `className` | `string` | none | no | Appended after the tone class. |

### Inherited props this component reads

Documented by hand from the source. They come from the extended type, so they are not in the table above.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| style | `StyleProp<TextStyle>` | none | no | Placed after the built-in style, so it wins. |

### Tokens

- `font.11`, `font.12`, `leading.14`, `leading.16`: the two variants. `size` looks up `font` by key, so any `font.10` to `font.17` can be reached (computed, not listed by `token-use.mjs`).
- `color.text`, `color.textMuted`, `color.danger`, `color.primary`, `color.accent`, `color.info`, `color.success`, `color.onPrimary`, `color.onDanger`: one tone class each.

Tailwind default classes (no token): none.

### Unverified

- UNVERIFIED: whether the tone classes paint on every host; they depend on the consumer's Tailwind or Uniwind interop and on the consumer defining the matching CSS variables.
- UNVERIFIED: how a fixed `lineHeight` behaves under the system font scale on each host; no runtime was run.

## Variants

### variant

| Value | Effect |
|---|---|
| `body` | `fontSize: font[12]`, `lineHeight: leading[16]`. |
| `caption` | `fontSize: font[11]`, `lineHeight: leading[14]`. |

Those are the two size and line height pairs that occur three or more times in `ui`. There is no weight and no font family: Text does not set `fontWeight` or `fontFamily`.

### tone

| Value | Effect |
|---|---|
| `text` | `text-text`. |
| `muted` | `text-text-muted`. |
| `danger` | `text-danger`. |
| `primary` | `text-primary`. |
| `accent` | `text-accent`. |
| `info` | `text-info`. |
| `success` | `text-success`. |
| `onPrimary` | `text-on-primary`. |
| `onDanger` | `text-on-danger`. |

The default tone `text` is always applied. A `Text` nested inside a coloured `Text` does not inherit the parent colour: pass `tone` to match it. Only the size is inherited, and only when `variant` and `size` are both omitted.

## States

None. The component has no interactive or conditional state.

### Motion

none in source

### Platform notes

none in source

## A11y

- Contrast: Colour is the caller's `tone` on the caller's surface. Reference theme, text tones on raised surfaces: text 17.79/13.83:1, muted 6.16/7.14:1, danger 6.57/7.24:1, accent 5.17/8.86:1, info 6.45/8.17:1, success 5.38/8.72:1, primary 5.81/6.93:1, all above 4.5:1. On sunken surfaces only text, muted and danger are measured (16.01/15.31, 5.54/7.9, 5.91/8.01). onPrimary and onDanger are only meant for filled backgrounds (5.81/7.46:1 and 6.57/8.11:1).
  - UNVERIFIED: tones on surfaces that are not in the contrast table (info, success, accent on sunken) and any consumer theme override (GU3).
- Keyboard and focus: Not interactive.
- Touch target: Not interactive.
- Screen reader: React Native `Text` is read as text. Sets no role. All `accessibility*` props pass through.
  - UNVERIFIED: how a fixed `lineHeight` behaves under the system font scale on each host.
- Motion: None.
- Review status: **UNVERIFIED**. The ratios above are arithmetic on the reference theme, but the surface is the caller's and the font-scale behaviour needs a render.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=LayoutText
import { Stack } from "@nyc-tron/ui/components/layout/Stack";
import { Text } from "@nyc-tron/ui/components/layout/Text";

export const Example = () => (
  <Stack gap={1}>
    <Text variant="body">Last sync 09:41</Text>
    <Text variant="caption" tone="muted">Synced 3 devices</Text>
    <Text size={13} tone="danger">Upload failed</Text>
  </Stack>
);
```

## Do/Don't

### Do

- Pick `variant` `caption` for secondary lines, since it is `font[11]` with `leading[14]`.
- Use `tone` `muted` for supporting text, which maps to `text-text-muted` at 6.16/7.14:1 on raised surfaces.
- Pass `size` for a one-off size such as `13`; it replaces the variant and drops the line height.

### Don't

- Do not look for bold or a heading style, because `Text` sets no `fontWeight` and no `fontFamily`; pass them in `style`.
- Do not use `onPrimary` or `onDanger` on a plain surface; they are meant for filled backgrounds only.
- Do not assume a fixed `lineHeight` suits large system font sizes, because the page marks that UNVERIFIED.
