---
name: "ToolButton"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/office/office-controls"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.focus", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# ToolButton

## Purpose

ToolButton with checked and mixed toggle state, plus play, pause, skip, plus and chevron glyphs, for React Native; web aria-pressed.

## Install

- Package: @nyc-tron/ui
- Import: `import { ToolButton, PlayGlyph, PauseGlyph, SkipGlyph, PlusGlyph, ChevronGlyph, CloseMark } from "@nyc-tron/ui/components/forge/office/office-controls";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/office/office-controls
```

### Dependencies

- `../../styles.ts` (`joinClasses`). `SkipGlyph` uses `PlayGlyph` from the same file.
- External: `react` (type `ReactNode`), `react-native` (`Platform`, `Pressable`, `Text`, `View`). No optional peer.

## Props

Exports (11): components `ToolButton`, `PlayGlyph`, `PauseGlyph`, `SkipGlyph`, `PlusGlyph`, `ChevronGlyph`, `CloseMark`; constant `OFFICE_TOUCH_TARGET` (44); function `officeKey`; types `ToolButtonProps`, `OfficeKeyEvent`. Each component is documented below.

**ToolButton.** `ToolButtonProps` extends `Omit<PressableProps,"children"|"disabled">`. Rest spread goes to `Pressable`. `accessibilityLabel` reads `rest.accessibilityLabel ?? label`; `accessibilityState` merges `rest.accessibilityState` with `disabled` and, when toggling, `checked`; `style` is appended after the component's own style array.

Extends: `Omit<PressableProps, "children" | "disabled">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | none | yes | Spoken name; shown unless `children` is given. |
| `children` | `ReactNode` | none | no | Visible face; replaces the label text. |
| `checked` | `boolean \| "mixed"` | none | no | `undefined` is a plain button. |
| `disabled` | `boolean` | `false` | no |  |
| `iconOnly` | `boolean` | `false` | no | Hides the label text; removes horizontal padding. |
| `quiet` | `boolean` | `false` | no | No outline while off. |
| `styled` | `boolean` | `true` | no | Class strings off when false. |
| `className` | `string` | none | no |  |

**Glyphs.** All take `styled:boolean` (required) and an optional `size:number`; all render `pointerEvents="none"` views.

| Component | Extra props | Size default | Notes |
|---|---|---|---|
| PlayGlyph | `flip?:boolean` (default `false`) | 14 | Right-pointing triangle; `flip` mirrors it. |
| PauseGlyph | none | 14 | Two bars. |
| SkipGlyph | `back?:boolean` (`false`), `double?:boolean` (`false`) | 12 | Bar plus one or two triangles. |
| PlusGlyph | none | 14 | Two crossed bars. |
| ChevronGlyph | `open?:boolean` (`false`) | 8 | Rotated 45 degrees when open, -45 otherwise. |
| CloseMark | none | 14 | Two rotated bars. |

`OFFICE_TOUCH_TARGET` is `44`. `officeKey(e:OfficeKeyEvent)` returns `{key,shift,mod,alt}`, reading `nativeEvent` first and the event itself second; `mod` is true for `metaKey` or `ctrlKey`. `OfficeKeyEvent` is the parameter type of `PressableProps["onKeyDown"]`.

### Tokens

- Colour classes: `color.text` 5, `color.accent` 3, `color.textMuted` 2, `color.focus` 1, `color.border` 1. Radius class: `radius.control` 1.
- Literals: `gap: 6` to `space.1.5` (1), `gap: 1` to `space.0.25` (1), `borderRadius: 1` to `radius.1` (7), `borderRightWidth: 1.5` and `borderBottomWidth: 1.5` to `border.1_5` (1 each), `opacity 0.45` to `opacity.0_45` (1).
- no token: the `OFFICE_TOUCH_TARGET` 44 minimum width and height, `paddingHorizontal: 10`, glyph sizes and bar widths.
- Tailwind default classes (no token): `rounded-control` 1, `border` 8, `text-sm` 1. The glyphs use `bg-text`, `bg-text-muted` and `border-text-muted` strings.

### Unverified

- UNVERIFIED: how screen readers announce `togglebutton` with `checked` of true, false and `"mixed"` on each platform.
- UNVERIFIED: that `transformOrigin` and the half-clipped triangle in `PlayGlyph` draw the same shape on every host.
- UNVERIFIED: key values `officeKey` receives from native key events; only the two lookup paths are in source.

## Variants

- `ToolButton` `checked`: `true` gives `border-accent bg-accent/10`; `"mixed"` gives `border-accent` with no fill; with `quiet` and not checked, `border-transparent`; otherwise `border-border`.
- `ToolButton` role: `accessibilityRole` is `"button"` when `checked` is undefined and `"togglebutton"` otherwise.
- Glyph shape props listed above (`flip`, `back`, `double`, `open`).

## States

| State | How it is set | What the code does |
|---|---|---|
| `ToolButton on` | derived in code | `checked===true`; mixed: `checked==="mixed"`; both set `accessibilityState.checked`; web also sets `role="button"` and `aria-pressed`. |
| `disabled` | `disabled` prop | `disabled` prop sets `Pressable disabled`, `accessibilityState.disabled` and opacity 0.45. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | `focus-visible:ring-2 focus-visible:ring-focus` (when `styled`). |
| `hover and pressed` | derived in code | no code. |

- Glyphs have no states.

### Motion

none in source.

### Platform notes

- `Platform.OS==="web"` with `checked` defined: `ToolButton` adds `role:"button"` and `aria-pressed` (comment: web has no togglebutton role). Native uses the `togglebutton` accessibility role.
- `PlayGlyph` uses `transformOrigin:"left"` in a style object; support by host is not stated in the file.
- package.json export conditions: `types`, `react-native`, `default`. No `.native`/`.web` siblings.

## A11y

- Contrast: ToolButton on state: border-accent 5.17/8.86:1 with bg-accent/10; off: border-border 1.58/1.58:1, the icon or label carries identity. Glyph strokes bg-text 17.79/13.83:1.
- Keyboard and focus: ToolButton `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:58). Keyboard: Pressable; the file exports an OfficeKeyEvent type for roving. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: OFFICE_TOUCH_TARGET = 44 as minWidth and minHeight (:6, :61, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: accessibilityRole=button, or togglebutton with accessibilityState.checked including "mixed" (:54-56); web gets role=button with aria-pressed (:53). Label defaults to the label prop; iconOnly keeps it.
- Motion: None.
- Review status: **PASS**. Toggle semantics with mixed state, 44pt target, ring present.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=office-controls
import {View} from "react-native";
import {ToolButton,PlayGlyph,PauseGlyph,SkipGlyph,PlusGlyph,ChevronGlyph,CloseMark} from "@nyc-tron/ui/components/forge/office/office-controls";
export const Example = () => <View style={{flexDirection:"row"}}>
  <ToolButton label="Play" iconOnly checked={false} onPress={()=>{}}><PlayGlyph styled/></ToolButton>
  <ToolButton label="Pause" iconOnly><PauseGlyph styled/></ToolButton>
  <ToolButton label="Next" iconOnly quiet><SkipGlyph styled double/></ToolButton>
  <ToolButton label="Add slide" checked="mixed"><PlusGlyph styled/></ToolButton>
  <ToolButton label="Expand" iconOnly><ChevronGlyph styled open/></ToolButton>
  <ToolButton label="Close" iconOnly disabled><CloseMark styled/></ToolButton>
  <ToolButton label="Notes"/>
</View>;
```

## Do/Don't

### Do

- Set `checked` to `"mixed"` for partial selections, since it sets `accessibilityState.checked` and uses the `togglebutton` role.
- Set `iconOnly` with a clear `label`, because the label stays as the accessible name while the text is hidden.
- Use `OFFICE_TOUCH_TARGET` (44) when you size neighbouring controls, so hit areas match `ToolButton`.

### Don't

- Do not leave `checked` undefined on a toggle, because `undefined` makes a plain `button` with no pressed state.
- Do not claim how screen readers announce `togglebutton` states, because the page marks it UNVERIFIED.
- Do not assume `PlayGlyph` draws identically on every host, because the `transformOrigin` clipping is UNVERIFIED.
