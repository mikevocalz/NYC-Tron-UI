---
name: "TreeGrid"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/data/TreeGrid"
tier: 1
docs: "handwritten"
platforms: []
category: "data"
tokens: ["color.border", "color.focus", "color.primary", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control"]
registryDependencies: []
a11yStatus: "reviewed-fail"
---

# TreeGrid

## Purpose

Tree table with expandable rows, row selection, column reorder and pinned columns, plus a compact layout, for React Native.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/data/TreeGrid
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { TreeGrid } from "@/components/nyc-tron/ui/components/data/TreeGrid";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { TreeGrid } from "@nyc-tron/ui/components/data/TreeGrid";`

### Dependencies

- `react-native`: `Animated`, `FlatList`, `Pressable`, `Text`, `View`, `ViewProps`.
- `zustand`, `zustand/vanilla`: optional peer.
- `./tree-grid.ts` (`moveColumn`, `orderTreeColumns`, `toggleTreeSelection`, `treeGridKey`, `treeRowAccessibilityLabel`, `visibleTreeRows`), `./tree-row-heights.ts` (`createRowHeightIndex`), `../styles.ts` (`joinClasses`).

## Props

Tier-1 reason: R2 core family (data)
Import count: 0

`TreeGridProps extends Omit<ViewProps,"children">`. Read: `onLayout`, `accessibilityLabel` (default "Tree grid"). The rest is forwarded to the root `View`, which is given `role="treegrid"` and `focusable`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `nodes` | `readonly TreeGridNode[]` | none | yes |  |
| `columns` | `readonly TreeGridColumn[]` | none | yes | Value columns; the "Name" label column is always first and pinned. |
| `expandedIds` | `readonly string[]` | none | no | Controlled expansion. |
| `defaultExpandedIds` | `readonly string[]` | [] | no | Initial uncontrolled expansion. |
| `onExpandedChange` | `(next: readonly string[]) => void` | none | no |  |
| `selectedIds` | `readonly string[]` | none | no | Controlled selection. |
| `defaultSelectedIds` | `readonly string[]` | [] | no |  |
| `onSelectionChange` | `(next: readonly string[]) => void` | none | no | Per the comment: taps, Space and Shift range. |
| `columnOrder` | `readonly string[]` | none | no | Controlled order. |
| `onColumnOrderChange` | `(next: readonly string[]) => void` | none | no | Called by the header "Move left/right" accessibility actions. |
| `pinnedColumnIds` | `readonly string[]` | none | no | Passed to `orderTreeColumns`. |
| `renderCell` | `(node: TreeGridNode, column: TreeGridColumn) => ReactNode` | none | no | Falls back to `String(node.values?.[column.id] ?? "")` in a `Text`. |
| `compactBelow` | `number` | 620 | no | Measured width under which the compact layout is used. |
| `rowHeight` | `number` | 48 | no | Row `minHeight` (compact: `rowHeight + 44`) and the height estimate. |
| `maxHeight` | `number` | 640 | no | `FlatList` `maxHeight`. |
| `emptyLabel` | `string` | "No items" | no |  |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | false | no |  |

`TreeGridColumn` (same file): `id: string` (required), `title: string` (required), `width?: number` (cells use 140 when unset).

`TreeGridNode` (data/tree-grid.ts): `id: string`, `label: string`, `values?: Readonly<Record<string, string|number|boolean|null>>`, `children?: readonly TreeGridNode[]`.

### Tokens

`node tokenuse.mjs` output:
- `space.2` from `gap: 8` (x1), `space.1` from `paddingVertical: 4` (x1), `space.3` from `padding: 12` (x1)
- `<Component>.space.11` from `paddingLeft: 44` (x2; component-scoped pattern, not a global token)
- `size.touch` from `minHeight: 44` (x3) and `minWidth: 44` (x2)
- `color.text` (x1), `color.textMuted` (x1), `color.surfaceRaised` (x1), `color.focus` (x3), `color.border` (x2), `color.primary` (x2), `color.surfaceSunken` (x2)
- `radius.control` (x1)

Tailwind default classes (no token): `rounded-control` (x1), `border` (x6), `min-w-0` (x1), `ring-2`, `border-b`. Unmapped literals include `width: 224`, `height: 44`, `paddingLeft: min(depth*16,128)`, default column width 140.

### Unverified

- UNVERIFIED: which keys `treeGridKey` handles and what each does; only its call site in `TreeGrid.tsx` and its exports list were read.
- UNVERIFIED: runtime behaviour of the `role="row"`, `role="cell"` and `role="columnheader"` mapping on Android, iOS and web; only the source comment states intent.
- UNVERIFIED: that the pinned strip stays aligned during native-driver scrolling; no device was run.

## Variants

- Wide layout (`width >= compactBelow`, where `width` starts at 0 until layout): a horizontal `Animated.ScrollView`, a sticky header row, and rows with a pinned strip (label plus pinned columns, translated by the scroll offset) beside scrolling cells. The label column is 224 wide.
- Compact layout (`width < compactBelow`; this is also the layout before the first measurement): the header row is omitted; each row stacks the label over cells that show their column title at `42%` width.

## States

| State | How it is set | What the code does |
|---|---|---|
| `expanded` | derived in code | a row with children has a button labelled "Expand <label>" or "Collapse <label>" with `accessibilityState.expanded`; the row has `aria-expanded`. Glyphs "▾" and "▸". |
| `selected` | derived in code | `aria-selected` on the row; `bg-primary/10` (styled); label `fontWeight: "700"`. |
| `focused` | class `focus-visible:ring-2 focus-visible:ring-focus` | internal `focusId`; `ring-2 ring-focus` on the row and the pinned strip (styled). The toggle button also carries `focus-visible:ring-2 focus-visible:ring-focus`. |
| `empty` | derived in code | `ListEmptyComponent` shows `emptyLabel`. |
| `Keyboard` | derived in code | `onKeyDown` forwards `key` and `shiftKey` to `treeGridKey`; if it returns a result the event is prevented, and a focus move scrolls with `scrollToIndex`. |

- controlled and uncontrolled expansion, selection and column order, each chosen by whether the matching prop is `undefined`.
No loading, error or disabled code.

### Motion

- `Animated.Value` `scrollX` is fed by `Animated.event` with `useNativeDriver: true` on the horizontal scroller (`scrollEventThrottle={16}`) and applied as `translateX` to the pinned header and pinned row strips.
- `scrollToIndex` and `scrollToOffset` use `animated: false`.
- `scrollX` is reset to 0 when leaving the compact layout.

### Platform notes

Only a comment: rows and cells use `role` rather than `accessibilityRole` because "row" and "cell" are absent from Android's `AccessibilityRole` enum and would throw there. No `Platform.OS` checks or sibling files.

## A11y

- Contrast: text-text on surface-raised 17.79/13.83:1. Selected row bg-primary/10 against the raised surface is 1.15/1.2:1 (F04). Focused row adds ring-2 ring-focus 5.81/6.93:1.
- Keyboard and focus: role=treegrid, focusable, onKeyDown with roving focusId (:208-213); the focused row shows ring-2 ring-focus (:188). Expand button has its own ring (:161). Web keyboard path present. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Expand button minWidth and minHeight 44 (:162, size.touch); row label minHeight 44 (:155); header height 44 (:223). Compact data cells minHeight 28 are not interactive. Android: 44 (F08). Android 48dp: below (F08).
- Screen reader: treegrid, row (aria-selected, aria-expanded), columnheader, cell, expand button with Expand/Collapse label and expanded state, leaf spacer hidden (:141-209). Uses role not accessibilityRole for row and cell on purpose (Android enum). Column reorder exposed as accessibilityActions.
- Motion: Animated.Value scrollX drives the pinned-column offset from the user's scroll (:73, :220). It tracks input, so no reduce-motion issue.
- Review status: **FAIL**. A selected row that is not focused is marked only by a tint at 1.15/1.2:1 (1.4.11).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=TreeGrid
import { TreeGrid, type TreeGridColumn } from "@/components/nyc-tron/ui/components/data/TreeGrid";

const columns: TreeGridColumn[] = [
  { id: "size", title: "Size", width: 96 },
  { id: "kind", title: "Kind" },
];

export const Example = () => (
  <TreeGrid
    columns={columns}
    pinnedColumnIds={["size"]}
    defaultExpandedIds={["src"]}
    onSelectionChange={ids => console.log(ids)}
    nodes={[
      { id: "src", label: "src", values: { size: "12 KB", kind: "folder" }, children: [
        { id: "index", label: "index.ts", values: { size: "2 KB", kind: "file" } },
      ] },
      { id: "readme", label: "README.md", values: { size: "1 KB", kind: "file" } },
    ]}
  />
);
```

## Do/Don't

### Do

- Pass `expandedIds` with `onExpandedChange` to control expansion, because each of the three state groups is controlled only when the matching prop is not `undefined`.
- Provide `renderCell` for non-string values, since the fallback renders `String(node.values?.[column.id] ?? "")`.
- Set `compactBelow` to the width where columns stop fitting, because narrower layouts drop the header and stack label over cells.

### Don't

- Do not rely on the selected row tint alone, because `bg-primary/10` measures 1.15:1 against the raised surface (F04) and the review is FAIL (1.4.11).
- Do not assume `treeGridKey` key handling is documented, because the page marks which keys it handles as UNVERIFIED.
- Do not trust `pinnedColumnIds` alignment during native-driver scrolling, because the page marks it UNVERIFIED.
