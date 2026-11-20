---
name: "DataTable"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/data/DataTable"
tier: 1
docs: "handwritten"
platforms: []
category: "data"
tokens: ["color.border", "color.focus", "color.surfaceRaised", "color.surfaceSunken", "color.text", "color.textMuted", "radius.card", "radius.control"]
registryDependencies: []
a11yStatus: "reviewed-fail"
---

# DataTable

## Purpose

Sortable data table on TanStack Table that renders cards below a width threshold, with optional row press, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { DataTable } from "@nyc-tron/ui/components/data/DataTable";`
- Peers: @nyc-tron/core, @tanstack/react-table, react, react-native, zustand
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/data/DataTable
```

### Dependencies

- `@tanstack/react-table` (`createSortedRowModel`, `flexRender`, `rowSortingFeature`, `sortFns`, `tableFeatures`, `useTable`): optional peer, `^9.0.0`.
- `react-native`: `FlatList`, `Pressable`, `ScrollView`, `Text`, `View`.
- `zustand`, `zustand/vanilla`: optional peer.
- `../styles.ts`: `joinClasses`. `./table-layout.ts`: `dataTableLayout`, `tableContentWidth`.

## Props

Tier-1 reason: R2 core family (data)
Import count: 0

`DataTableProps<T extends RowData> extends Omit<ViewProps,"children">`. Read: `onLayout`, `style`, `accessibilityLabel` (defaults to "Data table"). The rest is forwarded to the root `View`. `TronColumnDef<T>` is `ColumnDef<typeof features, T, unknown>` from `@tanstack/react-table`; the features are row sorting only.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `data` | `readonly T[]` | none | yes | Copied with `[...data]` into `useTable`. |
| `columns` | `TronColumnDef<T>[]` | none | yes |  |
| `getRowId` | `(row: T) => string` | none | no | Passed to `useTable` only when set. |
| `onRowPress` | `(row: T) => void` | none | no | Makes rows `Pressable` buttons with hint "Opens this record". |
| `width` | `number` | none | no | Overrides the measured width. |
| `layout` | `DataTableLayout` | "auto" | no | See Variants. |
| `cardsBelow` | `number` | 620 | no | Width under which `auto` gives cards. |
| `minColumnWidth` | `number` | 144 | no | Used for the content width of the table layout. |
| `getColumnLabel` | `(columnId: string) => string` | none | no | Takes priority over a string header, then the column id. |
| `renderCard` | `(row: Row<typeof features, T>) => ReactNode` | none | no | Replaces the default card. |
| `rowHeight` | `number` | 44 | no | Row `minHeight` (table) and empty-state height. |
| `headerHeight` | `number` | 44 | no | Header `minHeight`. |
| `maxHeight` | `number` | 640 | no | Root `style.maxHeight`. |
| `emptyLabel` | `string` | "No records" | no |  |
| `sortable` | `boolean` | true | no |  |
| `className` | `string` | none | no | Joined onto the root classes. |
| `headerClassName` | `string` | none | no |  |
| `rowClassName` | `string` | none | no |  |
| `cellClassName` | `string` | none | no |  |
| `unstyled` | `boolean` | false | no | Drops the built-in classes. |

### Tokens

`node tokenuse.mjs` output:
- `space.2` from `gap: 8` (x1)
- `space.1.5` from `paddingVertical: 6` (x2)
- `space.2.5` from `gap: 10` (x1)
- `space.3` from `paddingHorizontal: 12` (x2)
- `color.text` (x1), `color.border` (x4), `color.surfaceRaised` (x2), `color.textMuted` (x1), `color.surfaceSunken` (x2), `color.focus` (x2)
- `radius.card` (x1), `radius.control` (x1)
- `minWidth: 0`: no token (x1)

Tailwind default classes (no token): `gap-3` (x2), `p-4`, `border` (x12), `min-w-0` (x3), `min-h-11`, `gap-2`, `px-3` (x3), `flex-row`, `flex-1`, `w-full`, `items-center`, `justify-center`, `ring-2`. Also unmapped literals: `width: "40%"`, `fontWeight: "600"`.

### Unverified

- UNVERIFIED: whether the example's column types check against the real `@tanstack/react-table` 9 API. The check harness has a TanStack version that lacks `useTable`, `tableFeatures` and related exports, so `check.sh` reports errors inside `DataTable.tsx` itself and `TronColumnDef` may resolve loosely. None are reported under `examples/DataTable.tsx`.
- UNVERIFIED: screen reader announcements for the sort buttons and row buttons; no assistive technology was run.

## Variants

`layout` resolves through `dataTableLayout`:
- `"cards"` and `"table"` are used as given.
- `"auto"`: `"cards"` when the width is `null` (before measurement) or below `cardsBelow`, else `"table"`.
- Cards: optional horizontal sort-button strip, then a `FlatList` of cards (`gap-3 p-4`, plus `rounded-card border border-border bg-surface-raised` when styled).
- Table: horizontal `ScrollView`, header row, `FlatList` of rows; column area width is `max(width, columns x minColumnWidth)`.
- An unknown `layout` string, a `cardsBelow` that is not above 0, or a negative width throws `RangeError`.

## States

| State | How it is set | What the code does |
|---|---|---|
| `empty` | derived in code | `ListEmptyComponent` shows `emptyLabel` in both layouts. |
| `sorted` | derived in code | a header or sort button carries `accessibilityValue.text` of "sorted ascending", "sorted descending" or "not sorted", plus an arrow glyph hidden from accessibility. |
| `pressable row` | derived in code | `onRowPress` set gives `accessibilityRole="button"`; unset gives `disabled` on the row `Pressable`. |
| `focus` | class `focus-visible:ring-2 focus-visible:ring-focus` | sort buttons carry `focus-visible:ring-2 focus-visible:ring-focus` (styled). |
| `unstyled` | `unstyled` prop | removes the surface, border and text-colour classes. |

No loading, error or hover code.

### Motion

none in source

### Platform notes

none in source

## A11y

- Contrast: text-text on surface-raised 17.79/13.83:1; header band bg-surface-sunken with text-text 16.01/15.31:1; row separators border-border 1.58/1.58:1, decorative.
- Keyboard and focus: Sortable headers carry `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:148, :195). Body rows have no focus style and are focusable only when onRowPress is set (Pressable disabled otherwise). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Sort buttons min-h-11 (:147), headerHeight and rowHeight default 44 (:54, a prop, size.touch). Android: 44 below 48 (F08). Card mode rows are a Pressable around the card. Android 48dp: below (F08).
- Screen reader: Wide mode (:181-231) is Views and Pressables with no table, row, cell or columnheader role anywhere (roles appear only at :142 :164 :190 :210 as button or header). The root has accessibilityLabel="Data table" but no role (:127). A row Pressable is an accessible element on iOS, so its cells merge into one announcement. Column and row relationships are lost (F01).
- Motion: None.
- Review status: **FAIL**. Wide layout exposes no table structure (1.3.1, 4.1.2).
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=DataTable
import { DataTable, type TronColumnDef } from "@nyc-tron/ui/components/data/DataTable";

type Row = { id: string; name: string; status: string };
const columns: TronColumnDef<Row>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "status", header: "Status" },
];
const data: Row[] = [
  { id: "a", name: "Gateway", status: "Online" },
  { id: "b", name: "Relay", status: "Offline" },
];

export const Example = () => (
  <DataTable<Row> data={data} columns={columns} getRowId={row => row.id}
    onRowPress={row => console.log(row.id)} layout="auto" cardsBelow={620} />
);
```

## Do/Don't

### Do

- Pass `getRowId` when rows have stable ids, since it is forwarded to `useTable` only when set.
- Set `layout` to `cards` or `table` when the breakpoint must not depend on measured width, because `auto` falls back to `cards` before the first measurement.
- Set `onRowPress` only on rows that open a record, since it turns them into buttons with the hint "Opens this record".

### Don't

- Do not ship the wide `table` layout as an accessible table, because the a11y review is FAIL with no table, row or columnheader role (F01).
- Do not pass a `cardsBelow` of 0 or less, an unknown `layout` string or a negative `width`, because each throws a RangeError.
- Do not treat announcements for the sort buttons and `onRowPress` row buttons as verified, because the page marks them UNVERIFIED.
