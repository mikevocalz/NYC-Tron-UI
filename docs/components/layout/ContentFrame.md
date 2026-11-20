---
name: "ContentFrame"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/layout/ContentFrame"
tier: 1
docs: "handwritten"
platforms: []
category: "layout"
tokens: []
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# ContentFrame

## Purpose

Width-capped container that aligns its content to the start, center or end of the parent, for React Native layout.

## Install

- Package: @nyc-tron/ui
- Import: `import { ContentFrame } from "@nyc-tron/ui/components/layout/ContentFrame";`
- Peers: @nyc-tron/core, react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/layout/ContentFrame
```

### Dependencies

- `react-native`: `View`, `ViewProps`. No other imports.

## Props

Tier-1 reason: R2 core family (layout)
Import count: 0

`ContentFrameProps extends ViewProps`. The component reads `maxWidth`, `align`, `children` and `style`; every other `ViewProps` field is forwarded to the `View`.

Extends: `ViewProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `maxWidth` | `number` | none | yes | Logical units. Throws `RangeError` unless finite and greater than 0. |
| `align` | `"start" \| "center" \| "end"` | "center" | no | Sets `marginStart` and `marginEnd` (see Variants). |
| `className` | `string` | none | no | Declared on the interface, not destructured, so it travels in `...rest` to the `View`. |

### Inherited props this component reads

Documented by hand from the source. They come from the extended type, so they are not in the table above.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| style | StyleProp<ViewStyle> | none | no | Placed after the built-in style, so it wins. |
| children | ReactNode | none | no | Rendered inside the `View`. |

### Tokens

`node tokenuse.mjs` output:
- `minWidth: 0`: no token (x1).

Tailwind default classes (no token): none.

### Unverified

- UNVERIFIED: how `marginStart: "auto"` and `marginEnd: "auto"` resolve in the Yoga and React Native Web layout engines; no runtime was run.

## Variants

- `align="start"`: `marginStart: 0`, `marginEnd: "auto"`.
- `align="center"`: both margins `"auto"`.
- `align="end"`: `marginStart: "auto"`, `marginEnd: 0`.

Fixed style for every variant: `width: "100%"`, `minWidth: 0`, `maxWidth`, `flexShrink: 1`.

## States

None. The component has no interactive or conditional state. An invalid `maxWidth` throws during render.

### Motion

none in source

### Platform notes

none in source

## A11y

- Contrast: No colour.
- Keyboard and focus: Not interactive.
- Touch target: Not interactive.
- Screen reader: Layout only (maxWidth, minWidth 0).
- Motion: None.
- Review status: **PASS**. Pure layout.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=ContentFrame
import { Text } from "react-native";
import { ContentFrame } from "@nyc-tron/ui/components/layout/ContentFrame";

export const Example = () => (
  <ContentFrame maxWidth={720} align="start" testID="reading-frame">
    <Text>Body text stays within 720 logical units.</Text>
  </ContentFrame>
);
```

## Do/Don't

### Do

- Set `maxWidth` to the readable width in logical units, since it caps the frame while `width` stays `100%`.
- Use `align` of `start` or `end` to pin the frame to one edge, because the default `center` sets both margins to auto.

### Don't

- Do not pass a `maxWidth` of 0, negative or non-finite, because it throws during render.
- Do not claim `marginStart` auto resolves the same in every layout engine, because the page marks Yoga and React Native Web behaviour UNVERIFIED.
