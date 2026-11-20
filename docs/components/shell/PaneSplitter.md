---
name: "PaneSplitter"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/PaneSplitter"
tier: 1
docs: "handwritten"
platforms: ["web"]
category: "layout"
tokens: ["color.accent", "color.border", "color.focus", "color.surfaceSunken"]
registryDependencies: ["@nyc-tron/gestures/PanResponderDrag"]
a11yStatus: "reviewed-fail"
---

# PaneSplitter

## Purpose

Two-pane splitter, horizontal or vertical, resizable by drag, keys or accessibility actions, fold-aware, for React Native and web.

## Install

- Package: @nyc-tron/ui
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: @nyc-tron/gestures/PanResponderDrag

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/PaneSplitter
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { PaneSplitter } from "@/components/nyc-tron/ui/components/shell/PaneSplitter";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { PaneSplitter } from "@nyc-tron/ui/components/shell/PaneSplitter";`

### Dependencies

- Internal: `../gestures/drag-controller.ts`, `../gestures/drag-transport.ts`, `../gestures/PanResponderDrag.tsx`, `../styles.ts`, `./shell-keys.ts`, `./splitter-model.ts`.
- External: `react`, `react-native`, `zustand`, `zustand/vanilla`, `@nyc-tron/core/folds` (types `FoldFeature`, `Rect`).
- Optional peers: `zustand`, `@nyc-tron/core`.

## Props

Also exports the type `SplitAxis` (`"horizontal" | "vertical"`).

Extends `ViewProps` minus `children`. Read or forwarded specially: `style` (merged into the root style array), `onLayout` (called after the component stores its size). Remaining ViewProps spread onto the root View.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `editScope` | `string` | none | no | Throws `RangeError` if blank or over 16384 characters. Part of the interaction scope; a change cancels a drag. |
| `disabled` | `boolean` | `false` | no |  |
| `axis` | `SplitAxis` | none | yes | `horizontal`: panes side by side. `vertical`: stacked. |
| `start` | `ReactNode` | none | yes |  |
| `end` | `ReactNode` | none | yes |  |
| `size` | `number` | none | yes | Controlled size in points of the pane named by `sizeEdge`. |
| `sizeEdge` | `"start" \| "end"` | `"start"` | no |  |
| `onPreview` | `(size: number) => void` | none | no | During drag; also called with the committed `size` on cancel. |
| `onCommit` | `(size: number) => void` | none | yes | Once per drag, keyboard step, jump or accessibility action. |
| `minStart` | `number` | `120` | no | Must be finite and not negative. |
| `minEnd` | `number` | `120` | no | Same. |
| `label` | `string` | none | yes | `accessibilityLabel` of the divider. |
| `features` | `readonly FoldFeature[]` | `[]` | no | Hinge features in window space. |
| `container` | `Rect` | measured | no | Window-space bounds; if omitted and features exist, the component calls `measureInWindow`. |
| `isRTL` | `boolean` | `false` | no | Horizontal only: start pane is physically on the right. |
| `keyboardStep` | `number` | `16` | no | Must be above 0. |
| `dividerSize` | `number` | `9` | no | Not negative. Divider thickness off a hinge. |
| `transport` | `DragTransport` | `PanResponderDrag` | no | Component type receiving `onBegin`, `onMove`, `onRelease`, `onCancel`, `disabled`. |
| `className` | `string` | none | no | Root; also `min-h-0 min-w-0`. |
| `startClassName` | `string` | none | no |  |
| `endClassName` | `string` | none | no |  |
| `dividerClassName` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no |  |

Non-finite `size`, `minStart`, `minEnd`, `keyboardStep` or `dividerSize` also throw `RangeError`. `FoldFeature` (core/folds.ts): `bounds: Rect`, `orientation: "vertical" | "horizontal"`, `separating: boolean`, `occlusion: "none" | "full"`. `Rect`: `x`, `y`, `width`, `height`.

### Tokens

- color.accent (1), color.focus (1), color.border (1), color.surfaceSunken (1).
- Component-level: PaneSplitter.space.n5_5 (marginLeft -22, marginTop -22).
- no token: minWidth 0, minHeight 0, divider widths 9, 44 and 3 / 1, margins -1.5 / -0.5, `DRAG_SNAP` 24.
- Tailwind default classes (no token): border, min-h-0, min-w-0.

### Unverified

- UNVERIFIED: hinge seating and snap results; they come from `splitter-model.ts`, which was not read.
- UNVERIFIED: how `PanResponderDrag` distinguishes touch from mouse and how many pointers it reports.
- UNVERIFIED: screen reader announcements for `aria-valuetext` ("<n> points") and the adjustable role.

## Variants

- `axis`: `horizontal` sets pane width and a vertical divider line (`borderLeftWidth`); `vertical` sets pane height and a horizontal line (`borderTopWidth`); root `flexDirection` is `row` or `column`.
- `sizeEdge`: chooses which pane `size` measures; `onPreview`/`onCommit` report in the same edge.

## States

| State | How it is set | What the code does |
|---|---|---|
| `dragging` | derived in code | preview layout set; divider class `border-accent`, line 3 wide. |
| `focused` | derived in code | divider class `border-focus`, line 3 wide. |
| `seated on a hinge` | derived in code | divider class `bg-surface-sunken` when styled. |
| `idle` | derived in code | `border-border`, line 1 wide. |

- default, disabled (`accessibilityState.disabled`, `aria-disabled`, no accessibility actions, `focusable` false, `tabIndex` -1 on web).
- before the first layout measurement, no panes render.

### Motion

none in source. A drag snaps within `DRAG_SNAP` (24) of a hinge band.

### Platform notes

- `Platform.OS==="web"`: divider gets `role="separator"`, `aria-orientation`, `focusable`, `tabIndex`, `onKeyDown`; `userSelect: "none"` and `cursor` (`col-resize` or `row-resize`) styles apply.
- Other platforms: divider gets `accessibilityRole="adjustable"`; adjustment is through `increment` and `decrement` accessibility actions ("Grow first pane", "Shrink first pane").
- Keys on web: arrows step (direction swaps in RTL), Home and End jump to limits, Escape cancels a drag; events with Alt, Ctrl or Meta are ignored.
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/PaneSplitter.js`.

## A11y

- Contrast: Idle divider is a 1px border-border line 1.42/1.75:1; hover or drag turns it border-accent 4.65/9.81:1, focus border-focus 5.22/7.67:1 at 3px (:191-199). The idle line is the only visible cue (F06).
- Keyboard and focus: Web: role=separator, focusable, tabIndex 0, arrow keys (:206-213). Native: accessibilityRole=adjustable. State-driven focus line, so no class dependency. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Hit area 44pt across the divider (:222-223, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: role=separator or adjustable, label, hint, aria-valuemin/max/now/text, increment and decrement actions (:206-213).
- Motion: None.
- Review status: **FAIL**. Idle divider 1.42/1.75:1 is the only visible cue (1.4.11, minor).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=PaneSplitter
import {useState} from "react";
import {Text} from "react-native";
import {PaneSplitter} from "@/components/nyc-tron/ui/components/shell/PaneSplitter";

export const Example=()=>{
  const [size,setSize]=useState(240);
  return <PaneSplitter axis="horizontal" label="Resize layers panel" size={size} onCommit={setSize}
    start={<Text>Layers</Text>} end={<Text>Canvas</Text>}/>;
};
```

## Do/Don't

### Do

- Pass a non-blank `label`; it becomes the divider's `accessibilityLabel` and the only name a screen reader gets for the handle.
- Update `size` from `onCommit`, which fires once per drag, keyboard step, jump or accessibility action, and use `onPreview` for live feedback during the drag.
- Set `isRTL` when the start pane sits on the right in a horizontal splitter, so the arrow-key direction swaps to match.

### Don't

- Do not pass a blank or non-finite `editScope`, `size`, `minStart`, `minEnd` or `keyboardStep`; each throws a `RangeError`.
- Do not rely on the idle divider as the only cue; the 1px `color.border` line measures 1.42/1.75:1 and fails the a11y review (F06).
- Do not assume hinge snapping or screen reader announcements of `aria-valuetext` work; the page marks both UNVERIFIED.
