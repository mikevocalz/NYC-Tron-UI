---
name: "Stack"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/layout/Stack"
tier: 1
docs: "handwritten"
platforms: []
category: "layout"
tokens: []
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# Stack

## Purpose

Vertical flex View with token-keyed gap, padding, align, justify and wrap, no role and no colour, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { Stack } from "@nyc-tron/ui/components/layout/Stack";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/layout/Stack
```

### Dependencies

- `react-native`: `View`, `ViewProps`.
- `space` from `../../tokens.ts` and `stackStyle` from `./stack-style.ts`, which imports the `StackProps` type from `./Stack.tsx`.

## Props

Tier-1 reason: R2 core family (layout)
Import count: 0

`StackProps extends Omit<ViewProps, "children">`. Every other `ViewProps` field, `testID` and the `accessibility*` props included, is forwarded to the `View`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | none | no | Rendered inside the `View`. |
| `gap` | `StackSpace` | `2` | no | Key of `space`. `space[gap]` px between children, 8 for the default. Set through the RN `gap` style. |
| `padding` | `StackSpace` | none | no | Key of `space`. Sets `padding`. |
| `paddingX` | `StackSpace` | none | no | Key of `space`. Sets `paddingHorizontal`. |
| `paddingY` | `StackSpace` | none | no | Key of `space`. Sets `paddingVertical`. |
| `align` | `StackAlign` | none | no | Sets `alignItems`. Unset leaves the View default. |
| `justify` | `StackJustify` | none | no | Sets `justifyContent`. |
| `wrap` | `boolean` | `false` | no | `true` sets `flexWrap: "wrap"`. |
| `className` | `string` | none | no | Forwarded to the `View` as `className`. Declared on the interface, so it is read here and passed back explicitly. |

### Inherited props this component reads

Documented by hand from the source. They come from the extended type, so they are not in the table above.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| style | `StyleProp<ViewStyle>` | none | no | Placed after the built-in style, so it wins. |

### Tokens

- `space.0` to `space.4`: `gap`, `padding`, `paddingX` and `paddingY` are looked up in `space` by key, so `token-use.mjs` does not list them (computed values). Keys: 0, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4.

Tailwind default classes (no token): none.

### Unverified

- UNVERIFIED: how the `gap` style resolves on React Native Web and on the Windows, macOS and QNX hosts; no runtime was run.
- UNVERIFIED: whether `className` reaches the `View` on every host; it depends on the consumer's Tailwind or Uniwind interop, which this file does not check.

## Variants

none

## States

None. The component has no interactive or conditional state. A `StackSpace` key that is not in `space` is a compile error, not a runtime one.

### Motion

none in source

### Platform notes

none in source

## A11y

- Contrast: No colour.
- Keyboard and focus: Not interactive.
- Touch target: Not interactive.
- Screen reader: Layout only. Sets no role, label or `accessible` prop; `testID` and `accessibility*` props pass through to the View.
- Motion: None.
- Review status: **PASS**. Pure layout.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=Stack
import { Text } from "react-native";
import { Stack } from "@nyc-tron/ui/components/layout/Stack";

export const Example = () => (
  <Stack gap={3} padding={4} align="stretch" testID="settings-stack">
    <Text>Account</Text>
    <Text>Notifications</Text>
  </Stack>
);
```

## Do/Don't

### Do

- Pass `gap` as a `space` key such as `3`, since a raw pixel value does not compile and the key keeps spacing on the 4 px unit.
- Set `align` to `stretch` or `center` when children differ in width, because it maps straight to `alignItems`.
- Put your own `style` last in the prop list, since it is applied after the built-in style and wins on any field.

### Don't

- Do not expect a role or a label from `Stack`, because it renders a plain `View`; set `accessibilityRole` yourself when a group needs one.
- Do not rely on `className` reaching the `View` on every host; the page marks that UNVERIFIED because it depends on the consumer's interop.
- Do not leave `gap` unset and assume zero, because it defaults to `2`, which is 8 px.
