---
name: "AdaptiveDock"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/AdaptiveDock"
tier: 1
docs: "handwritten"
platforms: []
category: "shell"
tokens: ["color.border", "color.focus", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: ["@nyc-tron/DragGrabHandle", "@nyc-tron/shell/MenuButton", "@nyc-tron/shell/PaneSplitter"]
a11yStatus: "unverified"
---

# AdaptiveDock

## Purpose

Dockable panel layout of tabbed and floating panels; merges into one stack below a width and avoids foldable hinges, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { AdaptiveDock } from "@nyc-tron/ui/components/shell/AdaptiveDock";`
- Peers: @nyc-tron/core, react, react-native, zustand
- Requires: @nyc-tron/DragGrabHandle, @nyc-tron/shell/MenuButton, @nyc-tron/shell/PaneSplitter

```sh
npx shadcn@latest add @nyc-tron/shell/AdaptiveDock
```

### Dependencies

- `../DragGrabHandle` (`DragGrabHandle`, `DragPoint`), `./MenuButton` (`MenuButton`), `./PaneSplitter` (`PaneSplitter`).
- `./shell-keys` (`rovingTarget`, `shellKey`), `./dock-model` (layout functions and types), `../styles` (`joinClasses`), `../overlays/popover-position` (`Rect2D` type).
- External: `react`, `react-native`, `zustand` (optional peer), `@nyc-tron/core/folds` (`resolveUsableRegions`, `FoldFeature`; `@nyc-tron/core` is an optional peer).

## Props

Tier-1 reason: R3 shell core. Import count: 1 (other packages: 0).
Also exported from the same specifier: types `DockPanel`, `AdaptiveDockProps`, `DockEdge`, `DockLayout`, `DockStack`, `DockTarget`, `FloatingPanel`. Internal (not exported): `StackView`, `OptionsGlyph`.

`AdaptiveDockProps extends Omit<ViewProps,"children">`. Inherited props are not enumerated. `style` is merged after `{flex:1,direction:"ltr"}` and `onLayout` is called after the dock's own measurement; the rest spread onto the root `View`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `editScope` | `string` | none | no | Changes cancel panel and divider gestures and remount the body (`key={editScope??"dock"}`). Throws `RangeError` if blank or over 4096 chars. |
| `disabled` | `boolean` | `false` | no | Blocks every layout change; panel content stays mounted. |
| `revision` | `string \| number` | `0` | no | Part of the interaction scope. Throws `RangeError` for a non-finite number or a string over 512 chars. |
| `panels` | `readonly DockPanel[]` | none | yes | At most 256; ids and titles nonblank, ids unique, ids at most 256 chars, titles at most 512. Otherwise `RangeError`. |
| `layout` | `DockLayout` | none | yes | Controlled. `validateDockLayout` runs on every render and throws on duplicate or unknown panels, empty stacks, bad sizes. |
| `onLayoutChange` | `(next: DockLayout) => void` | none | yes | Called with a whole new layout for every move, resize, tab switch, float and close. |
| `children` | `ReactNode` | none | yes | The workspace. Rendered once in a layer over an empty slot so it keeps state across dock changes. |
| `workspaceLabel` | `string` | `"Workspace"` | no | `accessibilityLabel` of the workspace region. |
| `features` | `readonly FoldFeature[]` | none | no | Window-space fold features. At most 64. Passed to `PaneSplitter` and used to derive usable regions. |
| `usableRegions` | `readonly Rect2D[]` | none | no | Dock-local regions floating panels stay inside. At most 256. Without it: regions derived from `features` via `resolveUsableRegions`, else the whole dock rectangle. |
| `compactBelow` | `number` | `600` | no | Measured width below which all panels join one stack under the workspace. Must be finite and not negative. |
| `defaults` | `Partial<DockDefaults>` | none | no | `edgeSize` falls back to `280`; `floatingRect` falls back to `{x:max(0,width/2-160), y:max(0,height/4), width:320, height:280}`, then clamped to the usable regions. |
| `isRTL` | `boolean` | `false` | no | Sets `direction:"rtl"` on panel content and flips roving keys; edges stay physical. |
| `className` | `string` | none | no | Joined after `min-h-0 min-w-0` on the root. |
| `unstyled` | `boolean` | `false` | no | Drops the token classes. |

`DockPanel` (defined in AdaptiveDock.tsx):

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| id | `string` | none | yes | |
| title | `string` | none | yes | Tab and header title and accessible name. |
| content | `ReactNode` | none | yes | |

`DockLayout`, `DockStack`, `FloatingPanel`, `DockDefaults` (dock-model.ts):

| Type | Fields |
|---|---|
| DockLayout | `left?: DockStack`, `right?: DockStack`, `bottom?: DockStack`, `floating: readonly FloatingPanel[]` (required), `compactSize?: number` |
| DockStack | `panels: readonly string[]`, `active: string`, `size: number` (width for left/right, height for bottom) |
| FloatingPanel | `id: string`, `rect: Rect2D` |
| DockDefaults | `edgeSize: number`, `floatingRect: Rect2D` |
| Rect2D | `x`, `y`, `width`, `height` (all `number`) |
| FoldFeature | `bounds: Rect`, `orientation: "vertical" \| "horizontal"`, `separating: boolean`, `occlusion: "none" \| "full"` |

### Tokens

`node tokenuse.mjs` output for `AdaptiveDock.tsx`:

| Token | Replaces | Count |
|---|---|---|
| space.1 | `paddingHorizontal: 4` | 2 |
| space.0.5 | `gap: 2` | 2 |
| space.0.75 | `gap: 3` | 1 |
| radius.2 | `borderRadius: 2` | 1 |
| border.2 | `borderWidth: 2` | 1 |
| size.touch | `minHeight: 44` | 3 |
| color.border | border classes | 3 |
| color.surfaceRaised | `bg-surface-raised` | 2 |
| color.text | `text-text` | 2 |
| color.focus | `ring-focus`, `border-focus` | 2 |
| color.primary | `bg-primary/10` | 1 |
| color.surfaceSunken | `bg-surface-sunken` | 1 |
| color.textMuted | `text-text-muted`, `border-text-muted` | 2 |
| radius.card | `rounded-card` | 1 |
| radius.control | `rounded-control` | 1 |

No token: `minHeight: 0` (2), and literals 4, 8 width/height dots, 12, 20%, 160, 200, 280, 320, 600.
Tailwind default classes (no token): `min-h-0` 1, `min-w-0` 1, `border` 12, `shadow-md` 1, `text-sm` 2, `font-semibold` 2, `border-2` 2, `min-h-11` 1, `px-3` 1.

### Unverified

- UNVERIFIED: how `PaneSplitter` resizes and seats dividers on hinges. The file passes props to it; its source was not read.
- UNVERIFIED: menu contents behaviour (focus, keyboard) of `MenuButton` and the `CommandPopover` it opens; not read here.
- UNVERIFIED: `DragGrabHandle` pointer and keyboard drag behaviour and its accessible output; only the props passed were read.
- UNVERIFIED: screen reader announcements for `role="region"`, `tablist` and `tab` on iOS, Android and web; the code sets the roles but no device was run.
- UNVERIFIED: `measureInWindow` results on each platform. Floating panels and the workspace layer depend on them and render nothing until measured.

## Variants

- Layout mode, derived from measured width: wide (width >= `compactBelow`) puts stacks on left, right and bottom edges in nested `PaneSplitter`s; compact (`0 < width < compactBelow`) merges every docked panel into one stack under the workspace in a vertical `PaneSplitter` sized by `layout.compactSize` (default `round(height*0.45)`, min 160 each side).
- `DockEdge`: `"left" | "right" | "bottom"`. Edge minimums are 160 for a dock and 200 for the workspace.
- `DockTarget`: edge or `"floating"`. Drives the options-menu entries ("Move to left dock", "Move to right dock", "Move to bottom dock", "Float").
- `unstyled`: `true` removes every token class listed under Tokens.

## States

| State | How it is set | What the code does |
|---|---|---|
| `disabled` | `disabled` prop | `disabled` prop. `change()` drops proposals, tab and title `Pressable`s get `disabled`, tab `accessibilityState.disabled`, `MenuButton` and `DragGrabHandle` get `disabled`, `PaneSplitter`s get `disabled`, tab `tabIndex` becomes -1. |
| `selected tab` | derived in code | `accessibilityState={{selected,disabled}}`, `aria-selected`, `tabIndex` 0 on the selected tab else -1, classes `bg-surface-sunken forced-colors:border-2 forced-colors:border-[Highlight]` and `text-text font-semibold` (unselected: `bg-transparent`, `text-text-muted`). |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | tab class `focus-visible:ring-2 focus-visible:ring-focus`. |
| `dragging a floating panel` | derived in code | `drag` store state; the panel follows the pointer (`drag.rect`) and a drop-target overlay (`border-2 border-focus bg-primary/10`, 20% of the dock) shows for left, right or bottom, `pointerEvents="none"`. |
| `compact` | derived in code | described under Variants. |
| `hover, pressed` | derived in code | no code. |

### Motion

none in source. `ScrollView.scrollTo` is called with `animated:false` to reveal the active tab.

### Platform notes

- No `Platform.OS` check in the file. Web-style props (`role`, `tabIndex`, `onKeyDown`, `className`, `forced-colors:` classes) are passed through spread objects on every platform.
- Fold support: `features` and `usableRegions` shape floating panels and divider placement; no OS-specific branches.
- Package export conditions for `./components/shell/AdaptiveDock`: `types`, `react-native`, `default`; `react-native` and `default` point at the same file. No browser, qnx or marathon condition.
- No `.native`, `.web` or `.shared` sibling.

## A11y

- Contrast: Panel titles text-text 17.79/13.83:1; inactive stack tabs text-text-muted 6.16/7.14:1; selected tab marked by text-text semibold only (:304) (F13). Drop hint border-2 border-focus 5.81/6.93:1.
- Keyboard and focus: Tabs: roving tabIndex, onKeyDown (:277-301), `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:302). DragGrabHandle is not focusable (F14); each floating panel has a menu (menuFor) that is the keyboard route. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Header rows and Bring-to-front minHeight 44 (:237, :241, :289), tabs min-h-11 (:302). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- Screen reader: Regions labelled with the panel title; tablist and tab with selected and disabled state; Bring ... to front button; DragGrabHandle label and hint (:226-245, :294-299).
- Motion: scrollTo animated:false (:274).
- Review status: **UNVERIFIED**. Selected-tab cue and keyboard move route need a run (F13, F14).
  - UNVERIFIED: Selected stack tab visible at 3:1 (F13). Test: Screenshot a selected and an unselected tab in light and dark and measure the difference.
  - UNVERIFIED: Keyboard-only move of a floating panel (F14). Test: Use only the keyboard to move, dock and tab a panel.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=AdaptiveDock
import {useState} from "react";
import {Text} from "react-native";
import {AdaptiveDock, type DockLayout, type DockPanel} from "@nyc-tron/ui/components/shell/AdaptiveDock";

const panels: readonly DockPanel[] = [
  {id: "layers", title: "Layers", content: <Text>Layer list</Text>},
  {id: "props", title: "Properties", content: <Text>Property list</Text>},
  {id: "notes", title: "Notes", content: <Text>Notes</Text>},
];

export function Example() {
  const [layout, setLayout] = useState<DockLayout>({
    left: {panels: ["layers"], active: "layers", size: 240},
    right: {panels: ["props"], active: "props", size: 280},
    floating: [{id: "notes", rect: {x: 40, y: 40, width: 320, height: 240}}],
  });
  return (
    <AdaptiveDock panels={panels} layout={layout} onLayoutChange={setLayout} editScope="doc-1" compactBelow={600}>
      <Text>Canvas</Text>
    </AdaptiveDock>
  );
}
```

## Do/Don't

### Do

- Keep `layout` and `panels` consistent and update `layout` in `onLayoutChange`, because `validateDockLayout` throws on duplicate or unknown panels and empty stacks.
- Set `compactBelow` to the width where side stacks stop fitting, since narrower docks merge all panels into one stack under the workspace.

### Don't

- Don't pass a blank `editScope` or a `revision` string over 512 chars; both throw `RangeError`.
- Don't claim keyboard-only moving of floating panels works; `DragGrabHandle` is not focusable (F14) and the menu route is `UNVERIFIED`.
- Don't count on the selected tab being visible at 3:1; only bold text marks it (F13), `UNVERIFIED`.
