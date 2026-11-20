---
name: "KeyValueList"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/content/KeyValueList"
tier: 1
docs: "handwritten"
platforms: []
category: "display"
tokens: ["color.text", "color.textMuted"]
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# KeyValueList

## Purpose

Label and value list that goes from one to two columns at a measured width, with empty-value text, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { KeyValueList } from "@nyc-tron/ui/content/KeyValueList";`
- Peers: react, react-native, zustand
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/content/KeyValueList
```

### Dependencies

- `react-native`: `Text`, `View`, `LayoutChangeEvent`, `ViewProps`.
- `zustand` (`zustand/vanilla`, `zustand`): `createStore`, `useStore`. Declared an optional peer in packages/ui/package.json.
- `../styles.ts`: `joinClasses`.
- Colours follow the nearest `NightScope` (per the `surface` doc comment).

## Props

Tier-1 reason: R2 core family (content)
Import count: 0

`KeyValueListProps extends Omit<ViewProps,"children">`. Read: `onLayout` (called after the internal measurement). The rest is forwarded to the root `View`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `items` | `readonly KeyValueItem[]` | none | yes | One list item per entry, keyed by `item.key`. |
| `columns` | `1 \| 2` | 2 | no | Upper bound on columns. |
| `twoColumnMinWidth` | `number` | 600 | no | Measured list width at or above which two columns are used (when `columns` is 2). |
| `emptyLabel` | `string` | "Not set" | no | Text for a `null` or `undefined` value. |
| `surface` | `"page" \| "night"` | none | no | Accepted and discarded (`surface:_surface`). |
| `className` | `string` | none | no | Joined onto the root classes. |
| `labelClassName` | `string` | none | no | Joined onto the label `Text`. |
| `valueClassName` | `string` | none | no | Joined onto the value `Text` for string and number values. |
| `unstyled` | `boolean` | false | no | Drops the built-in classes. |

`KeyValueItem` (same file):

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| key | string | none | yes | React key. |
| label | string | none | yes | Shown above the value. |
| value | ReactNode | none | yes | `null` or `undefined` draws `emptyLabel`. A string or number is wrapped in a selectable `Text`; any other node renders as given. |
| action | ReactNode | none | no | Rendered beside the value in a `shrink-0` wrapper. |

### Tokens

`node tokenuse.mjs` output:
- `color.textMuted` via `text-text-muted` (x2)
- `color.text` via `text-text` (x1)
- `paddingEnd: 16` is not matched by tokenuse (the file passes it as a variable expression); no token reported.

Tailwind default classes (no token): `w-full`, `flex-row`, `flex-wrap`, `gap-y-4`, `gap-0.5`, `gap-2` (x1), `min-w-0` (x1), `shrink`, `shrink-0`, `items-center`, `text-xs`, `leading-4`, `text-sm` (x2), `leading-5`, `italic`.

### Unverified

- UNVERIFIED: screen reader output for `role="list"` and `role="listitem"`; no assistive technology was run.

## Variants

- `columns`: 1 always gives each item `width: "100%"`. 2 gives `"50%"` plus `paddingEnd: 16` only when the measured width is at least `twoColumnMinWidth`; before the first layout (`width` is `null`) it is one column.
- `surface`: no effect in code.

## States

| State | How it is set | What the code does |
|---|---|---|
| `empty value` | derived in code | `value` is `null` or `undefined`; draws `emptyLabel` with `text-sm leading-5 text-text-muted italic` (styled). |
| `unstyled` | `unstyled` prop | `unstyled` removes the `gap-y-4`, `gap-0.5`, `text-xs leading-4 text-text-muted`, `text-sm leading-5 text-text` and empty-value classes. `labelClassName` and `valueClassName` still apply. |

No hover, pressed, focus, disabled or loading code.

### Motion

none in source

### Platform notes

none in source

## A11y

- Contrast: Label text-text-muted on page surface 6.16/7.14:1; value text-text 17.79/13.83:1.
- Keyboard and focus: Not focusable. Values use `selectable` (:73), so text can be selected with the mouse and keyboard on web.
- Touch target: Not interactive.
- Screen reader: role=list on the root and role=listitem per pair (:58,:64). Term and value are separate Text nodes in one listitem, so the pairing is by order only.
- Motion: None.
- Review status: **PASS**. Static list with contrast above 4.5:1 for both text colours.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=KeyValueList
import { KeyValueList } from "@nyc-tron/ui/components/content/KeyValueList";

export const Example = () => (
  <KeyValueList
    columns={2}
    twoColumnMinWidth={560}
    emptyLabel="Not set"
    items={[
      { key: "name", label: "Name", value: "Pier 17 Gateway" },
      { key: "port", label: "Port", value: 8443 },
      { key: "owner", label: "Owner", value: null },
    ]}
  />
);
```

## Do/Don't

### Do

- Give every entry in `items` a unique `key`, since it is used as the React key for each pair.
- Set `emptyLabel` to wording that fits the field, because a `null` or `undefined` value renders it in muted italic text.
- Use `twoColumnMinWidth` to control when the list goes to two columns, since the measured width is compared against it.

### Don't

- Do not pass `surface` expecting a visual change, because it is accepted and discarded.
- Do not expect a two-column layout on the first render, because before the first layout the width is `null` and the list is one column.
- Do not claim screen reader pairing for `role="list"` output as verified, because the page marks it UNVERIFIED and pairing is by order only.
