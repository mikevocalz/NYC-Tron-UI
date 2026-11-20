---
name: "Row"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/layout/Row"
tier: 1
docs: "handwritten"
platforms: []
category: "layout"
tokens: []
registryDependencies: ["@nyc-tron/layout/Stack"]
a11yStatus: "reviewed-pass"
---

# Row

## Purpose

Horizontal flex View with the same token-keyed gap, padding, align, justify and wrap as Stack, for React Native.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native
- Requires: @nyc-tron/layout/Stack

### Registry install

```sh
npx shadcn@latest add @nyc-tron/layout/Row
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { Row } from "@/components/nyc-tron/ui/components/layout/Row";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { Row } from "@nyc-tron/ui/components/layout/Row";`

### Dependencies

- `react-native`: `View`.
- `StackProps` (type only) from `./Stack.tsx` and `stackStyle` from `./stack-style.ts`.

## Props

Tier-1 reason: R2 core family (layout)
Import count: 0

`RowProps` is `StackProps`: same fields, same defaults. The only difference is `flexDirection: "row"`.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| children | `ReactNode` | none | no | Rendered inside the `View`. |
| gap | `StackSpace` | `2` | no | Key of `space`. `space[gap]` px between children, 8 for the default. Set through the RN `gap` style. |
| padding | `StackSpace` | none | no | Key of `space`. Sets `padding`. |
| paddingX | `StackSpace` | none | no | Key of `space`. Sets `paddingHorizontal`. |
| paddingY | `StackSpace` | none | no | Key of `space`. Sets `paddingVertical`. |
| align | `"flex-start" \| "flex-end" \| "center" \| "stretch" \| "baseline"` | none | no | Sets `alignItems`. Unset leaves the View default. |
| justify | `"flex-start" \| "flex-end" \| "center" \| "space-between" \| "space-around" \| "space-evenly"` | none | no | Sets `justifyContent`. |
| wrap | `boolean` | `false` | no | `true` sets `flexWrap: "wrap"`. |
| className | `string` | none | no | Forwarded to the `View` as `className`. Declared on the interface, so it is read here and passed back explicitly. |
| style | `StyleProp<ViewStyle>` | none | no | Placed after the built-in style, so it wins. |

### Tokens

- `space.0` to `space.4`: `gap`, `padding`, `paddingX` and `paddingY` are looked up in `space` by key, so `token-use.mjs` does not list them (computed values).

Tailwind default classes (no token): none.

### Unverified

- UNVERIFIED: how the `gap` style resolves on React Native Web and on the Windows, macOS and QNX hosts; no runtime was run.
- UNVERIFIED: whether `className` reaches the `View` on every host; it depends on the consumer's Tailwind or Uniwind interop, which this file does not check.

## Variants

none

## States

None. Row has no interactive or conditional state. `flexDirection: "row"` follows the reading direction, so the first child sits at the start edge in both left-to-right and right-to-left layouts.

### Motion

none in source

### Platform notes

none in source

## A11y

- Contrast: No colour.
- Keyboard and focus: Not interactive. `flexDirection: "row"` keeps source order, so reading and focus order follow child order.
- Touch target: Not interactive.
- Screen reader: Layout only. Sets no role, label or `accessible` prop.
- Motion: None.
- Review status: **PASS**. Pure layout.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=Row
import { Text } from "react-native";
import { Row } from "@/components/nyc-tron/ui/components/layout/Row";

export const Example = () => (
  <Row gap={2} align="center" justify="space-between" paddingX={3}>
    <Text>Volume</Text>
    <Text>80</Text>
  </Row>
);
```

## Do/Don't

### Do

- Use `Row` with `Spacer` `flex` to push one child to the far end, since `justify` alone cannot split a group.
- Set `wrap` for chip or tag lists, because `flexWrap` then moves children to the next line.
- Use `paddingX` and `paddingY` instead of `padding` when the two axes differ.

### Don't

- Do not hard-code left and right, because `Row` follows the reading direction and `start` flips in right-to-left layouts.
- Do not nest a `Row` inside a `Row` only to add spacing; set `gap` on the outer one.
- Do not rely on `gap` with `wrap` spacing lines the same on every host, because the page marks the `gap` behaviour UNVERIFIED.
