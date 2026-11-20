---
name: "ContextMenu"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/ContextMenu"
tier: 1
docs: "handwritten"
platforms: []
category: "overlay"
tokens: []
registryDependencies: ["@nyc-tron/overlays/CommandPopover"]
a11yStatus: "unverified"
---

# ContextMenu

## Purpose

Wraps a target to open a command menu on right-click, long-press, keyboard or screen-reader action, for React Native; QNX focus return.

## Install

- Package: @nyc-tron/ui
- Import: `import { ContextMenu } from "@nyc-tron/ui/components/shell/ContextMenu";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/overlays/CommandPopover

```sh
npx shadcn@latest add @nyc-tron/shell/ContextMenu
```

### Dependencies

- `../overlays/CommandPopover` (`CommandPopover`, `CommandMenuItem` type), `../overlays/popover-position` (`hasUsableRegion`, `Rect2D`), `./shell-keys` (`shellKey`).
- External: `react`, `react-native` (`Platform`, `Pressable`, `useWindowDimensions`), `zustand` (optional peer). `@nyc-tron/core/overlays` is reached through `CommandPopover`.

## Props

Tier-1 reason: R3 shell core. Import count: 1 (other packages: 1).
Also exported: types `CommandMenuItem`, `ContextMenuProps`, `ContextMenuSource`; functions `isContextMenuKey(key, shift)` (true for `"ContextMenu"` or Shift+`"F10"`) and `pointAnchor(x, y)` (zero-size `Rect2D`; throws `RangeError` for non-finite input).

`ContextMenuProps extends Omit<PressableProps,"children"|"onLongPress"|"onContextMenu">`. Read or overridden from inherited props: `style` (function or object, merged after `{minWidth:44,minHeight:44}`), `onKeyDown` (called after the menu key check), `accessibilityActions` (a "longpress" action is appended while usable), `onAccessibilityAction` (forwarded for actions other than "longpress"), `testID` (menu gets `<testID>-menu`), `disabled`. `onPress` is not read and stays the target's primary press. The rest spreads onto the `Pressable`.

Extends: `Omit<PressableProps, "children" | "onLongPress" | "onContextMenu">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | `"context-menu"` | no | Part of the boundary; changing it closes the menu and cancels pending measurements. |
| `revision` | `string \| number` | `0` | no | Same boundary role. |
| `label` | `string` | none | yes | Menu `accessibilityLabel` is `"Actions for "+label`. |
| `items` | `readonly CommandMenuItem[]` | none | yes |  |
| `onSelect` | `(id: string) => void` | none | yes | Called only for an enabled item present in the committed list. |
| `children` | `ReactNode` | none | yes | The target. |
| `onOpen` | `(source: ContextMenuSource) => void` | none | no |  |
| `disabled` | `boolean` | `false` | no |  |
| `usableRegions` | `readonly Rect2D[]` | none | no | Default is the whole window from `useWindowDimensions`. |

`CommandMenuItem` (from `@nyc-tron/core/overlays`): `id: string`, `label: string`, `description?: string`, `disabled?: boolean`, `danger?: boolean` (all readonly).

### Tokens

| Token | Replaces | Count |
|---|---|---|
| size.touch | `minWidth: 44`, `minHeight: 44` | 1 each |

No classes in this file.

### Unverified

- UNVERIFIED: `CommandPopover` keyboard, focus-return and placement behaviour on each platform; only its props were read in this task.
- UNVERIFIED: whether the long-press handler and the web `onContextMenu` both fire for one gesture on a given device; the code opens at the last anchor set.
- UNVERIFIED: VoiceOver and TalkBack output of the "Show actions" action and `aria-haspopup` on native.

## Variants

`ContextMenuSource` reports how the menu opened: `"pointer"` (right-click or stylus barrel click via `onContextMenu`), `"long-press"`, `"keyboard"` (Shift+F10 or Menu key), `"assistive"` (the "Show actions" screen-reader action). No visual variants.

## States

| State | How it is set | What the code does |
|---|---|---|
| `disabled` | `disabled` prop | `disabled` prop on the `Pressable`; also no menu when no item is enabled or no usable region exists (`usable` false). |
| `open` | derived in code | an anchor in the local store renders a `CommandPopover` with `visible`. |
| `usable` | derived in code | `aria-haspopup="menu"` always; `accessibilityHint` "Has actions. Long press, right-click or press Shift F10." only while usable. |
| `hover, pressed, focus, error, loading` | derived in code | no code in this file. |

### Motion

none in source.

### Platform notes

- `String(Platform.OS)==="qnx"` or `"marathon"`: after the menu closes, focus is moved back to the target with `target.current.focus()`.
- `onContextMenu` uses `nativeEvent.clientX/clientY` (web); without finite coordinates the menu opens beside the target.
- Export conditions: `types`, `react-native`, `default`, same file.

## A11y

- Contrast: Delegates to CommandPopover (F12).
- Keyboard and focus: Opens by long press, right-click or Shift+F10 (hint :85); on QNX and marathon it restores focus to the target when the menu closes (:60). Menu items: see CommandPopover.
- Touch target: Target minWidth and minHeight 44 (:104, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: aria-haspopup=menu, hint "Has actions. Long press, right-click or press Shift F10.", accessibilityActions longpress "Show actions" (:84-86).
- Motion: Via CommandPopover (F09).
- Review status: **UNVERIFIED**. Its menu is CommandPopover, whose focus cue is a tint (F12).
  - UNVERIFIED: Focus visibility inside the menu (F12). Test: See CommandPopover.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=ContextMenu
import {Text} from "react-native";
import {ContextMenu, type CommandMenuItem} from "@nyc-tron/ui/components/shell/ContextMenu";

const items: readonly CommandMenuItem[] = [
  {id: "duplicate", label: "Duplicate"},
  {id: "delete", label: "Delete", danger: true},
];

export function Example() {
  return (
    <ContextMenu label="Harbor photo layer" scope="layer-7" items={items}
      onSelect={(id) => { console.log(id); }} onOpen={(source) => { console.log(source); }}
      onPress={() => { console.log("primary"); }}>
      <Text>Harbor photo</Text>
    </ContextMenu>
  );
}
```

## Do/Don't

### Do

- Set `label` to the target's name, because the menu `accessibilityLabel` is built as "Actions for" plus `label`.
- Pass `usableRegions` when the target sits in a constrained pane, since the default is the whole window.

### Don't

- Don't give every item `disabled`; with no enabled item or no usable region the menu never opens.
- Don't assume the menu has a strong focus cue; it delegates to `CommandPopover` and its `focus-visible:bg-primary/10` tint (F12), `UNVERIFIED`.
- Don't claim `longpress` and `onContextMenu` fire once per gesture; the page marks that `UNVERIFIED`.
