---
name: "Spacer"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/layout/Spacer"
tier: 1
docs: "handwritten"
platforms: []
category: "layout"
tokens: []
registryDependencies: ["@nyc-tron/layout/Stack"]
a11yStatus: "reviewed-pass"
---

# Spacer

## Purpose

Empty View with a fixed length from the space scale, or flex to fill free space on the main axis, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { Spacer } from "@nyc-tron/ui/components/layout/Spacer";`
- Peers: react, react-native
- Requires: @nyc-tron/layout/Stack

```sh
npx shadcn@latest add @nyc-tron/layout/Spacer
```

### Dependencies

- `react-native`: `View`, `ViewProps`.
- `space` from `../../tokens.ts`; `StackSpace` (type only) from `./Stack.tsx`.

## Props

Tier-1 reason: R2 core family (layout)
Import count: 0

`SpacerProps` is `Omit<ViewProps, "children"> & SpacerSize`. `SpacerSize` is a union: pass `size`, or pass `flex`, never both. Every other `ViewProps` field is forwarded to the `View`. A Spacer takes no children.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| size | `StackSpace` | none | yes, unless `flex` | Key of `space`. Sets `flexBasis` to `space[size]` with `flexGrow: 0` and `flexShrink: 0`, so it is a fixed length on the parent's main axis. |
| flex | `true` | none | yes, unless `size` | Sets `flexGrow: 1` and `flexShrink: 1`, so it takes the free space on the parent's main axis and pushes siblings apart. |
| style | `StyleProp<ViewStyle>` | none | no | Placed after the built-in style, so it wins. |

### Tokens

- `space.0` to `space.4`: `size` is looked up in `space` by key, so `token-use.mjs` does not list it (computed value).

Tailwind default classes (no token): none.

### Unverified

- UNVERIFIED: that `flexBasis` sets the length on the main axis the same way in every host layout engine, in a Stack and in a Row; no runtime was run.

## Variants

`size` and `flex` are mutually exclusive in the type.
- `size`: fixed length, one of the `space` keys.
- `flex`: flexible length.

## States

None. The component has no interactive or conditional state.

### Motion

none in source

### Platform notes

none in source

## A11y

- Contrast: No colour.
- Keyboard and focus: Not interactive.
- Touch target: Not interactive.
- Screen reader: Empty View. Sets no role, label or `accessible` prop.
- Motion: None.
- Review status: **PASS**. Pure layout.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=Spacer
import { Text } from "react-native";
import { Row } from "@nyc-tron/ui/components/layout/Row";
import { Spacer } from "@nyc-tron/ui/components/layout/Spacer";

export const Example = () => (
  <Row align="center">
    <Text>Title</Text>
    <Spacer flex />
    <Text>Edit</Text>
    <Spacer size={2} />
    <Text>Share</Text>
  </Row>
);
```

## Do/Don't

### Do

- Pass `size` as a `space` key for a fixed gap that differs from the parent `gap`, since it sets `flexBasis` on the parent's main axis.
- Use `flex` to fill the free space between two groups in a `Row`.

### Don't

- Do not pass `size` and `flex` together, because the type rejects it.
- Do not give a `Spacer` children, because its props omit `children`.
- Do not use it for padding around content; use `padding` on `Stack` or `Row`.
