---
name: "PrecisionScrubber"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/inputs/PrecisionScrubber"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "forge"
tokens: ["color.accent", "color.border", "color.danger", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: ["@nyc-tron/gestures/PanResponderDrag"]
a11yStatus: "unverified"
---

# PrecisionScrubber

## Purpose

Drag-to-scrub number control with fine, normal and coarse modes, detents, preview and commit callbacks, for React Native; web forced-colors.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: @nyc-tron/gestures/PanResponderDrag

### Registry install

```sh
npx shadcn@latest add @nyc-tron/forge/inputs/PrecisionScrubber
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PrecisionScrubber } from "@/components/nyc-tron/ui/components/forge/inputs/PrecisionScrubber";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PrecisionScrubber } from "@nyc-tron/ui/components/forge/inputs/PrecisionScrubber";`

### Dependencies

- `./precision.ts`, `./precision-scrubber-model.ts`, `../../gestures/editor-interaction-scope.ts`, `../../gestures/drag-transport.ts`, `../../gestures/PanResponderDrag.tsx`, `../../styles.ts`.
- External: `react`, `react-native`, `zustand`, `zustand/vanilla` (optional peer).

## Props

Exports: `PrecisionScrubber`, `PrecisionScrubberProps`.

`PrecisionScrubberProps` extends `Omit<ViewProps,"children">` and `RangeConfig`. Rest spread goes to the root `View`; `style` is appended after the opacity and no-select styles.

Extends: `Omit<ViewProps, "children">, RangeConfig`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | none | yes | Non-blank. |
| `targetSize` | `number` | `44` | no | Throws `RangeError` below 44 or non-finite. |
| `labels` | `Partial<{ increase: string; decrease: string; value: string; gestureHint: string; idleHint: string; fine: string; normal: string; coarse: string; }>` | built-in English copy | no | Each provided value must be a non-empty string. |
| `scope` | `string` | none (identity falls back to `label`) | no | Non-blank, at most 512 characters. |
| `revision` | `string \| number` | `0` | no |  |
| `value` | `number` | none | yes | Committed value. |
| `unit` | `string` | none | no | Shown after the number. |
| `disabled` | `boolean` | `false` | no |  |
| `onPreview` | `(value: number) => void` | none | no | Preview during a drag; restored on cancel. |
| `onCommit` | `(value: number) => unknown` | none | yes | Once per drag, nudge or text entry. While a returned promise is pending the control is disabled; a rejection shows its message. |
| `forcedColors` | `boolean` | `false` | no | Web only (`forced && Platform.OS==="web"`). |
| `transport` | `DragTransport` | `PanResponderDrag` | no | Pointer recogniser component. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |
| `scaleColor` | `string` | none | no | Background of the scale ink when not forced. |
| `accentColor` | `string` | none | no | Background of the filled part. |

### Inherited props this component reads

Documented by hand from the source. They come from the extended type, so they are not in the table above.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| min | `number` | none | yes | From `RangeConfig`. |
| max | `number` | none | yes | From `RangeConfig`; must exceed `min`. |
| step | `number` | none | yes | From `RangeConfig`; must be above 0. |
| detents | `readonly number[]` | none | no | From `RangeConfig`. |

Default copy: increase `"Increase <label>"`, decrease `"Decrease <label>"`, value `"<label> value"`, mode names "Fine precision", "Normal precision", "Coarse precision", idleHint "Drag: up for fine, down for coarse".

Throws `RangeError('Invalid scrubber identity')` for a blank label, bad scope or bad revision.

### Tokens

- Colour classes: `color.border` 4, `color.textMuted` 4, `color.text` 4, `color.accent` 3, `color.focus` 2, `color.surfaceRaised` 2, `color.surfaceSunken` 2, `color.danger` 1. Radius class: `radius.control` 3.
- Literals: `gap: 10` and `paddingHorizontal: 10` to `space.2.5` (1 each), `paddingVertical: 6` and `gap: 6` to `space.1.5` (1 each), `paddingLeft: 2` to `space.0.5` (1), `columnGap: 8` to `space.2` (1), `rowGap: 4` to `space.1` (1), `opacity 0.5`, `0.9`, `0.55` to `opacity.0_5`, `opacity.0_9`, `opacity.0_55` (1 each).
- Component-scoped: `paddingHorizontal: 11` to `<Comp>.space.2_75` (1), `marginLeft: -1.5` to `<Comp>.space.n0_375` (1).
- no token: `minWidth: 0` (1), `minHeight: 20` (1), field width 64, tick sizes.
- Tailwind default classes (no token): `border` 15, `rounded-control` 3, `text-xl` 1, `gap-2` 1, `text-xs` 5, `font-semibold` 2.

### Unverified

- UNVERIFIED: drag, cancel and second-pointer behaviour; it lives in `precision-scrubber-model.ts` and `PanResponderDrag.tsx`, not read.
- UNVERIFIED: how screen readers announce the `adjustable` role with `aria-valuetext` and the increment and decrement actions.
- UNVERIFIED: what the `useEditorBoundary` signature does to in-flight gestures when props change.
- UNVERIFIED: that `forcedColors` paints correctly in a Windows High Contrast browser.

## Variants

- Precision mode while dragging (`state.mode`, from vertical travel): `fine`, `normal`, `coarse`. The mode name is shown as text only; `precision.ts` defines the thresholds (28 px) and step scales (fine 0.1, coarse 4 in `scrubValue`).
- `forcedColors`: the scale and fill use `CanvasText` and `Highlight` through CSS variables with `forcedColorAdjust:"none"`, and the class strings `bg-border`/`bg-accent` are dropped.

## States

| State | How it is set | What the code does |
|---|---|---|
| `default, hovered, focused, active (dragging)` | derived in code | scale border class is `border-accent` when active, else `border-focus` when focused, else `border-text-muted` when hovered, else `border-border`; the scale background is `bg-surface-raised` when active, else `bg-surface-sunken`. |
| `editing` | derived in code | the number field's wrapper border is `border-focus`. |
| `disabled` | `disabled` prop | `disabled` prop; root opacity 0.5, buttons and field `disabled`/`editable=false`, `aria-disabled`. |
| `pending` | derived in code | `state.pending` also blocks the control (same disabled treatment, without the 0.5 opacity). |
| `error` | derived in code | `state.error` shows `text-danger` text with `accessibilityLiveRegion="assertive"`. |
| `pressed` | derived in code | no code. |

- active hint text shows the mode label; idle shows `idleHint`.

### Motion

none in source (no Animated or Reanimated; the drag recogniser is the `PanResponderDrag` transport).

### Platform notes

- `Platform.OS==="web"`: `userSelect:"none"` on the scale; `forcedColors` takes effect; `aria-valuemin`, `aria-valuemax` and `aria-valuenow` always set.
- Off web, those three aria range props are set only when `min`, `max` and the preview value are all integers; the in-source comment says Fabric and React Native Windows mis-parse non-integer `accessibilityValue`. `aria-valuetext` always carries the exact value.
- Imports `useEditorBoundary` from `gestures/editor-interaction-scope.ts` and `PanResponderDrag` from `gestures/`.
- package.json export conditions: `types`, `react-native`, `default`. No `.native`/`.web` siblings.

## A11y

- Contrast: Label text-text and unit text-text-muted 17.79/13.83:1 / 6.16/7.14:1; error text-danger 6.57/7.24:1. Ticks and rail take scaleColor and accentColor from the caller, or bg-border 1.58/1.58:1 (:181-185); ticks use opacity 0.55 for minor marks. Forced-colors branch uses CanvasText and Highlight.
- Keyboard and focus: Focus tracked in store (:163-164); keyboard handler onKeyDown with focusable={!blocked} (:116, :157). Step buttons are Pressables. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: targetSize default 44 with RangeError under 44 (:76-78, size.touch); step buttons and rail use it (:126-177). Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: Scrubber: accessibilityRole=adjustable, label, hint copy.gestureHint, aria-valuemin/max/now/text, accessibilityActions increment and decrement (:165-172). Step buttons: role button, label. Error: accessibilityLiveRegion assertive.
- Motion: No animation in the file.
- Review status: **UNVERIFIED**. Rail and tick contrast depend on caller colours and a bg-border fallback at 1.58/1.58:1 (F15).
  - UNVERIFIED: Rail, tick and focus contrast with the real scaleColor and accentColor (F15). Test: Render the scrubber with the app theme, sample tick, rail and focus pixels against the surface, or run contrast.mjs with the consumer's tokens.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=PrecisionScrubber
import {PrecisionScrubber} from "@/components/nyc-tron/ui/components/forge/inputs/PrecisionScrubber";
export const Example = () => <PrecisionScrubber label="Opacity" value={50} min={0} max={100} step={1} detents={[0,50,100]} unit="%"
  scope="layer-1.opacity" onPreview={()=>{}} onCommit={async()=>{}}/>;
```

## Do/Don't

### Do

- Set `min`, `max` and `step` with `max` above `min` and `step` above 0, since all three are required for the range.
- Return a promise from `onCommit` for async saves, because the control is disabled while it is pending and a rejection shows its message.
- Pass `scaleColor` and `accentColor` checked against your surface, since rail and tick contrast depends on them (F15).

### Don't

- Do not pass a blank `label`, a bad `scope` or a bad `revision`, because the identity check throws `RangeError('Invalid scrubber identity')`.
- Do not set `targetSize` below 44 or non-finite, because it throws a RangeError.
- Do not rely on the default `bg-border` rail at 1.58:1 as accessible, because the review is UNVERIFIED on rail and tick contrast (F15).
