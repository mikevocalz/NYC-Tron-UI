---
name: "PropertyRow"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/PropertyRow"
tier: 1
docs: "handwritten"
platforms: []
category: "input"
tokens: ["border.3", "color.accent", "color.border", "color.focus", "color.surfaceSunken", "color.text", "color.textMuted", "radius.3", "radius.control", "space.1", "space.1.5", "space.2"]
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# PropertyRow

## Purpose

Row for one inspector property: label and editor, with mixed-value badge, override dot and revert button, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { PropertyRow } from "@nyc-tron/ui/shell/PropertyRow";`
- Peers: react, react-native, zustand
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/shell/PropertyRow
```

### Dependencies

- Internal: `../styles.ts`, `./inspector-context.ts` (`InspectorPanelContext`, `InspectorSectionContext`), `./inspector-model.ts` (`matchesQuery`, `registerRow`). Docs name `InspectorPanel` and `InspectorSection` as the enclosing components.
- External: `react` (`use`, `useId`, `useEffect`, `useRef`, `useLayoutEffect`), `react-native` (Pressable, Text, View), `zustand`, `zustand/vanilla`.
- Optional peers: `zustand`.

## Props

Also exports types `PropertyEditorState`, `PropertyOverride` (`"inherited" | "overridden"`) and `PropertyRowProps`.

Extends `ViewProps` minus `children`. `style` is merged after the component's own row style; `onLayout` is wrapped (width is stored, then the handler is called).

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | none | yes | Throws `RangeError` if blank or over 512 characters. |
| `children` | `ReactNode \| ((state: PropertyEditorState) => ReactNode)` | none | yes |  |
| `mixed` | `boolean` | `false` | no | Shows a "Mixed" badge; adds ", mixed values" to `editorLabel`. |
| `override` | `PropertyOverride` | none | no |  |
| `onRevert` | `() => void` | none | no | The Revert button shows only with `override="overridden"` and this set. |
| `keywords` | `readonly string[]` | none | no | At most 256 entries of at most 512 characters, else `RangeError`. |
| `disabled` | `boolean` | `false` | no | Also disabled by a switched-off `InspectorSection`. |
| `stackBelow` | `number` | `300` | no | Must be finite and not negative. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

`PropertyEditorState`: `disabled: boolean`, `mixed: boolean`, `editorLabel: string` (all readonly).

### Tokens

- Colour classes: color.textMuted (3), color.accent (1), color.text (1), color.border (1), color.focus (1), color.surfaceSunken (1).
- radius.control (2). Spacing: space.2 (paddingHorizontal 8), space.1 (paddingVertical 4, gap 4), space.1.5 (gap 6). radius.3 (borderRadius 3), border.3 (borderWidth 3). size.touch (minHeight 44).
- no token: minWidth 0 (4), label width `38%`, indent `(depth - 1) * 12`, dot size 6.
- Tailwind default classes (no token): border, text-sm, text-xs, px-1, px-2, rounded-control, min-h-11, min-w-11.

### Unverified

- UNVERIFIED: search matching and row registration; they live in `inspector-model.ts`, which was not read.
- UNVERIFIED: screen reader output of the group `accessibilityLabel` set to `editorLabel`.

## Variants

- `override`: `overridden` draws a 6 by 6 dot with class `border-accent`, and shows Revert when `onRevert` is set; `inherited` renders the label in italics with `text-text-muted` and adds ", inherited" to `editorLabel`.

## States

| State | How it is set | What the code does |
|---|---|---|
| `default; hidden (display` | derived in code | "none"` when the enclosing `InspectorPanel` query does not match). |
| `disabled` | `disabled` prop | label uses `text-text-muted`; Revert gets `disabled`; editors get `disabled` through the state object. |
| `mixed` | `mixed` prop | badge plus label text. |
| `stacked` | derived in code | label above editor when the measured width is above 0 and below `stackBelow`. |
| `focus and hover on Revert` | class `focus-visible:ring-2 focus-visible:ring-focus hover:bg-surface-sunken` | `focus-visible:ring-2 focus-visible:ring-focus hover:bg-surface-sunken`. |

### Motion

none in source.

### Platform notes

none in source.

## A11y

- Contrast: Label text-text 17.79/13.83:1; hint text-text-muted 6.16/7.14:1; override dot border-accent 5.17/8.86:1, hidden from AT.
- Keyboard and focus: Revert button `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:92). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Row minHeight 44 (:78), Revert min-h-11 min-w-11 (:92). Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: role=group labelled by the editor label; Revert button "Revert {label}"; overridden state is conveyed by the dot (hidden) and by the revert button's presence.
- Motion: None.
- Review status: **PASS**. Group, labelled revert, 44pt targets.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=PropertyRow
import {Text} from "react-native";
import {PropertyRow} from "@nyc-tron/ui/components/shell/PropertyRow";

export const Example=()=><PropertyRow label="Opacity" override="overridden" onRevert={()=>{}} keywords={["alpha"]}>
  {state=><Text accessibilityLabel={state.editorLabel}>{state.mixed?"Mixed":"80%"}</Text>}
</PropertyRow>;
```

## Do/Don't

### Do

- Pass `mixed` when the selection holds differing values; it shows a Mixed badge and adds ', mixed values' to `editorLabel`.
- Set `override="overridden"` together with `onRevert` to get the Revert button, which is labelled 'Revert {label}' and has a 44pt target.
- Use the render-function form of `children` and apply the `PropertyEditorState` fields (`disabled`, `mixed`, `editorLabel`) to your editor.

### Don't

- Do not pass a blank `label` or one over 512 characters; it throws a `RangeError`.
- Do not give `keywords` more than 256 entries or entries over 512 characters, since either throws a `RangeError`.
- Do not expect Revert to show with only `override="overridden"`; without `onRevert` the button is absent and only the hidden dot marks the state.
