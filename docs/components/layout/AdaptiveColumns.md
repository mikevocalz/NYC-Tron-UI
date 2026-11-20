---
name: "AdaptiveColumns"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/layout/AdaptiveColumns"
tier: 1
docs: "handwritten"
platforms: []
category: "layout"
tokens: []
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# AdaptiveColumns

## Purpose

Wrapping column row; each AdaptiveColumns.Item sets a minimum width and grow factor, for React Native layout.

## Install

- Package: @nyc-tron/ui
- Import: `import { AdaptiveColumns, AdaptiveColumn } from "@nyc-tron/ui/components/layout/AdaptiveColumns";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/layout/AdaptiveColumns
```

### Dependencies

- `react-native`: `View`, `ViewProps`. No other imports.
- The doc comment names `AdaptivePaneHost` as the owner of hardware separation; it is not imported.

## Props

Tier-1 reason: R2 core family (layout)
Import count: 0

`AdaptiveColumns` is `Object.assign(AdaptiveColumnsRoot, { Item: AdaptiveColumn })`. Named exports are `AdaptiveColumns` and `AdaptiveColumn`.

`AdaptiveColumnsProps extends ViewProps`. Read: `gap`, `children`, `style`; the rest is forwarded.

Extends: `ViewProps`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `gap` | `number` | none | yes | Logical units between columns and wrapped rows. Throws `RangeError` unless finite and 0 or more. |
| `className` | `string` | none | no | Forwarded through `...rest`. |

### Inherited props this component reads

Documented by hand from the source. They come from the extended type, so they are not in the table above.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| style | StyleProp<ViewStyle> | none | no | Placed after the built-in style. |

`AdaptiveColumnProps extends ViewProps` (also `AdaptiveColumns.Item`). Read: `minWidth`, `grow`, `children`, `style`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| minWidth | number | none | yes | Becomes `flexBasis`. Throws `RangeError` unless finite and above 0. |
| grow | number | 1 | no | Becomes `flexGrow`. Throws `RangeError` unless finite and 0 or more. |
| className | string | none | no | Forwarded through `...rest`. |
| style | StyleProp<ViewStyle> | none | no | Placed after the built-in style. |

### Tokens

`node tokenuse.mjs` output:
- `minWidth: 0`: no token (x2).

Tailwind default classes (no token): none.

### Unverified

- UNVERIFIED: the actual wrap points at a given container width; they come from the layout engine, which was not run.

## Variants

none

## States

None. The only conditional behaviour is the `RangeError` thrown for invalid `gap`, `minWidth` or `grow`.

### Motion

none in source

### Platform notes

none in source

## A11y

- Contrast: No colour.
- Keyboard and focus: Not interactive.
- Touch target: Not interactive.
- Screen reader: Layout only; reflows by flexWrap so content does not need horizontal scrolling at 320 CSS px if columns are narrower than that (1.4.10 depends on the caller's minWidth).
- Motion: None.
- Review status: **PASS**. Pure layout; supports reflow.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=AdaptiveColumns
import { Text } from "react-native";
import { AdaptiveColumns } from "@nyc-tron/ui/components/layout/AdaptiveColumns";

export const Example = () => (
  <AdaptiveColumns gap={16}>
    <AdaptiveColumns.Item minWidth={280}>
      <Text>Summary</Text>
    </AdaptiveColumns.Item>
    <AdaptiveColumns.Item minWidth={280} grow={2}>
      <Text>Details</Text>
    </AdaptiveColumns.Item>
  </AdaptiveColumns>
);
```

## Do/Don't

### Do

- Set `minWidth` on each `AdaptiveColumns.Item` to the narrowest usable column, since it becomes `flexBasis` and drives wrapping.
- Use `grow` of 0 for a column that must keep its width, because it becomes `flexGrow` and defaults to 1.

### Don't

- Do not omit `gap`, or pass a negative or non-finite value, because it is required and throws a RangeError.
- Do not pass a `minWidth` of 0 or less, because the item throws a RangeError unless it is above 0.
- Do not promise exact wrap points for a given `minWidth`, because they come from the layout engine and the page marks them UNVERIFIED.
