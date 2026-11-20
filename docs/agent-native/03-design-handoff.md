# Agent-native phase 1, step 3: design handoff for tier 1

Status: handoff of the 64 tier 1 components of `@nyc-tron/ui`, written against source at repo `b91dfc3` (`1.0.0-rc.2`). The first 59 describe `b91dfc3`; Stack, Row, Spacer, Divider and Text were added at `bd17409` plus the primitives commit and are described from that source. It describes what the code does today. It proposes no behaviour and does not claim the token codemod has run.

Binding decisions: 6, 10 and 13 (tokens keep current values), 11 (two tiers). Companion files: `tier1.json` (the list, from `node docs/agent-native/tier1.mjs`), `doc-template.md` (the page format that generators and CI use), `02-design-system.md`, `tokens.json`, `tokens.map.json`.

## How to read this file

- Tier 1 rule, reproducible: an item is tier 1 if it is exported from the root barrel (R1), sits directly in `components/` or in `content`, `data`, `feedback`, `layout`, `navigation`, `overlays`, `theme` or `window` (R2), sits in `components/shell` (R3), or is imported by at least 10 distinct other source files in `packages/*/src` (R4). An item is a `@nyc-tron/ui` subpath whose source exports a PascalCase function or const. Result: 59 tier 1 and 497 tier 2 of 556 subpaths (386 export a component). Import counts and the command are in `tier1.json`.
- The layout and type primitives of 02-design-system section 5 (Stack, Row, Spacer, Divider, Text) now have source under `packages/ui/src/components/layout/` and are items, with `ContentFrame` and `AdaptiveColumns`. Only the proposal parts that fit the existing tokens were built: `Text` has two variants (`body`, `caption`) because no weight or font family is a token, and `Divider` sets no `accessibilityRole`.
- Tokens: each entry names the token that replaces a literal under `tokens.map.json`, found with `docs/agent-native/token-use.mjs`. The components still contain the literals. Colour entries come from Tailwind class names (`bg-primary` is `color.primary`), and a class paints only if the consumer defines the CSS variable. Tailwind default-scale classes such as `gap-2` or `min-h-11` are listed as written and have no token; the consumer's Tailwind config sets their pixel values.
- Class strings are reported as code facts. Whether a `focus-visible:` or `active:` class renders depends on the consumer's Tailwind or Uniwind setup, which this file does not check.
- `UNVERIFIED:` marks something the source alone does not establish, followed by the reason. Total: 141 across the 64 items.
- Every `tsx example=<name>` block is type-checked by `docs/agent-native/check-examples.mjs` against the real source. See Verification at the end.

## Index

| Item | Import specifier | Tier 1 rules | Import count | Category | UNVERIFIED |
|---|---|---|---:|---|---:|
| Button | `@nyc-tron/ui/components/Button` | R1, R2, R4 | 169 | primitive | 1 |
| Card | `@nyc-tron/ui/components/Card` | R1, R2 | 1 | layout | 0 |
| KeyValueList | `@nyc-tron/ui/components/content/KeyValueList` | R2 | 0 | display | 1 |
| DataTable | `@nyc-tron/ui/components/data/DataTable` | R2 | 0 | data | 2 |
| TreeGrid | `@nyc-tron/ui/components/data/TreeGrid` | R2 | 0 | data | 3 |
| DragGrabHandle | `@nyc-tron/ui/components/DragGrabHandle` | R2 | 3 | primitive | 2 |
| Badge | `@nyc-tron/ui/components/feedback/Badge` | R2 | 0 | feedback | 0 |
| Banner | `@nyc-tron/ui/components/feedback/Banner` | R2 | 0 | feedback | 2 |
| EmptyState | `@nyc-tron/ui/components/feedback/EmptyState` | R2 | 2 | feedback | 1 |
| ErrorMessage | `@nyc-tron/ui/components/feedback/ErrorMessage` | R2, R4 | 211 | feedback | 1 |
| FieldGroup | `@nyc-tron/ui/components/FieldGroup` | R2 | 0 | layout | 1 |
| PrecisionScrubber | `@nyc-tron/ui/components/forge/inputs/PrecisionScrubber` | R4 | 32 | forge | 4 |
| PropertyInspector | `@nyc-tron/ui/components/forge/inputs/PropertyInspector` | R4 | 48 | forge | 3 |
| office-controls | `@nyc-tron/ui/components/forge/office/office-controls` | R4 | 12 | forge | 3 |
| PanResponderDrag | `@nyc-tron/ui/components/gestures/PanResponderDrag` | R4 | 13 | primitive | 2 |
| IconButton | `@nyc-tron/ui/components/IconButton` | R2 | 1 | primitive | 1 |
| AdaptiveColumns | `@nyc-tron/ui/components/layout/AdaptiveColumns` | R2 | 0 | layout | 1 |
| ContentFrame | `@nyc-tron/ui/components/layout/ContentFrame` | R2 | 0 | layout | 1 |
| Stack | `@nyc-tron/ui/components/layout/Stack` | R2 | 0 | layout | 2 |
| Row | `@nyc-tron/ui/components/layout/Row` | R2 | 0 | layout | 2 |
| Spacer | `@nyc-tron/ui/components/layout/Spacer` | R2 | 0 | layout | 1 |
| Divider | `@nyc-tron/ui/components/layout/Divider` | R2 | 0 | layout | 2 |
| Text | `@nyc-tron/ui/components/layout/Text` | R2 | 0 | layout | 2 |
| List | `@nyc-tron/ui/components/List` | R2 | 0 | display | 1 |
| CollapsibleDrawer | `@nyc-tron/ui/components/navigation/CollapsibleDrawer` | R2 | 0 | navigation | 1 |
| NavigationRail | `@nyc-tron/ui/components/NavigationRail` | R1, R2 | 1 | navigation | 2 |
| AnchoredPopover | `@nyc-tron/ui/components/overlays/AnchoredPopover` | R2 | 4 | overlay | 2 |
| CommandPalette | `@nyc-tron/ui/components/overlays/CommandPalette` | R2 | 0 | overlay | 2 |
| CommandPopover | `@nyc-tron/ui/components/overlays/CommandPopover` | R2 | 6 | overlay | 1 |
| SegmentedControl | `@nyc-tron/ui/components/SegmentedControl` | R2, R4 | 28 | input | 1 |
| Select | `@nyc-tron/ui/components/Select` | R2, R4 | 58 | input | 2 |
| AdaptiveDock | `@nyc-tron/ui/components/shell/AdaptiveDock` | R3 | 1 | shell | 5 |
| AssetBrowser | `@nyc-tron/ui/components/shell/AssetBrowser` | R3 | 0 | data | 4 |
| ContextMenu | `@nyc-tron/ui/components/shell/ContextMenu` | R3 | 1 | overlay | 3 |
| ContextualToolbar | `@nyc-tron/ui/components/shell/ContextualToolbar` | R3 | 0 | navigation | 4 |
| DocumentTabBar | `@nyc-tron/ui/components/shell/DocumentTabBar` | R3 | 0 | navigation | 3 |
| FindReplaceContent | `@nyc-tron/ui/components/shell/FindReplaceContent` | R3 | 2 | input | 3 |
| FindReplacePopover | `@nyc-tron/ui/components/shell/FindReplacePopover` | R3 | 2 | overlay | 2 |
| FocusAndA11yLayer | `@nyc-tron/ui/components/shell/FocusAndA11yLayer` | R3 | 0 | shell | 3 |
| HistoryPanel | `@nyc-tron/ui/components/shell/HistoryPanel` | R3 | 0 | data | 3 |
| InspectorPanel | `@nyc-tron/ui/components/shell/InspectorPanel` | R3 | 0 | shell | 2 |
| InspectorSearch | `@nyc-tron/ui/components/shell/InspectorSearch` | R3 | 3 | input | 2 |
| InspectorSection | `@nyc-tron/ui/components/shell/InspectorSection` | R3 | 0 | shell | 2 |
| KeyboardShortcutHUD | `@nyc-tron/ui/components/shell/KeyboardShortcutHUD` | R3 | 0 | overlay | 3 |
| MenuButton | `@nyc-tron/ui/components/shell/MenuButton` | R3, R4 | 13 | overlay | 2 |
| PaneSplitter | `@nyc-tron/ui/components/shell/PaneSplitter` | R3 | 1 | layout | 3 |
| PresetGallery | `@nyc-tron/ui/components/shell/PresetGallery` | R3 | 0 | input | 2 |
| PropertyRow | `@nyc-tron/ui/components/shell/PropertyRow` | R3 | 1 | input | 2 |
| RangeSlider | `@nyc-tron/ui/components/shell/RangeSlider` | R3 | 0 | input | 3 |
| RibbonTabs | `@nyc-tron/ui/components/shell/RibbonTabs` | R3 | 0 | navigation | 3 |
| RotaryKnob | `@nyc-tron/ui/components/shell/RotaryKnob` | R3 | 0 | input | 3 |
| SliderField | `@nyc-tron/ui/components/shell/SliderField` | R3 | 2 | input | 3 |
| SplitButton | `@nyc-tron/ui/components/shell/SplitButton` | R3 | 2 | input | 2 |
| StatusBar | `@nyc-tron/ui/components/shell/StatusBar` | R3 | 0 | shell | 3 |
| ToastAndProgress | `@nyc-tron/ui/components/shell/ToastAndProgress` | R3 | 0 | feedback | 3 |
| ToolRail | `@nyc-tron/ui/components/shell/ToolRail` | R3 | 0 | shell | 4 |
| UnitInput | `@nyc-tron/ui/components/shell/UnitInput` | R3, R4 | 35 | input | 4 |
| WorkspaceHost | `@nyc-tron/ui/components/shell/WorkspaceHost` | R3 | 0 | shell | 4 |
| WorkspacePresetSwitcher | `@nyc-tron/ui/components/shell/WorkspacePresetSwitcher` | R3 | 0 | shell | 4 |
| TabBar | `@nyc-tron/ui/components/TabBar` | R2 | 0 | navigation | 1 |
| TextField | `@nyc-tron/ui/components/TextField` | R1, R2 | 9 | input | 1 |
| NightScope | `@nyc-tron/ui/components/theme/NightScope` | R2 | 0 | primitive | 2 |
| Toolbar | `@nyc-tron/ui/components/Toolbar` | R2 | 1 | navigation | 1 |
| WindowTitleBar | `@nyc-tron/ui/components/window/WindowTitleBar` | R2 | 0 | shell | 2 |

## Items

### Button

`import {Button} from "@nyc-tron/ui/components/Button"`

Source: packages/ui/src/components/Button.tsx (helper: packages/ui/src/components/styles.ts). Tier-1 reason: R1 root barrel export; R2 core family (components/); R4 imported by 169 files. Import count: 169.

#### Props

Extends `Omit<PressableProps,"children"|"disabled">`. Read or overridden from the inherited set: `onPress` (passed through), `style` (a function or value, merged after the built-in min sizes), `hitSlop` (defaults to 2 when `size` is `sm`), `accessibilityLabel` (defaults to `title`), `accessibilityState` (merged, `disabled` and `busy` overwritten). `disabled` is redeclared as a plain boolean.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| ref | `Ref<ComponentRef<typeof Pressable>>` | none | no | React 19 ref-as-prop, reaches the Pressable. |
| title | `string` | none | yes | Label text and default accessibilityLabel. |
| targetSize | `number` | none | no | Throws RangeError unless finite and at least 44. Sets minWidth and minHeight, and drops `min-h-*` from the size class. |
| numberOfLines | `number` | none | no | Throws RangeError unless an integer from 1 to 64. Forwarded to the label Text. |
| icon | `ReactNode` | none | no | Rendered in a View before the label. |
| variant | `ButtonVariant` | `"primary"` | no |  |
| size | `ButtonSize` | `"md"` | no |  |
| disabled | `boolean` | `false` | no | Combined with `loading` into one disabled flag. |
| loading | `boolean` | `false` | no | Shows an ActivityIndicator and disables the control. |
| className | `string` | none | no | Appended last. |
| unstyled | `boolean` | `false` | no | Drops every default visual class; layout classes `flex-row items-center justify-center` stay. |
| labelClassName | `string` | none | no |  |
| iconClassName | `string` | none | no |  |

#### Variants

`variant` (`ButtonVariant`):
- `primary`: root `bg-primary border-border text-on-primary`, label `text-on-primary`.
- `secondary`: root `bg-surface-raised border-border`, label `text-text`.
- `ghost`: root `bg-transparent border-transparent`, label `text-text`.
- `danger`: root `bg-danger border-danger`, label `text-on-danger`.

`size` (`ButtonSize`), class string and inline minHeight:
- `sm`: `min-h-10 gap-2 px-3 py-2`, minHeight 40.
- `md`: `min-h-11 gap-2 px-4 py-2.5`, minHeight 44.
- `lg`: `min-h-12 gap-3 px-5 py-3`, minHeight 48.

minWidth is 44 for every size.

#### States

- default: classes above.
- pressed: `active:opacity-80` class (styled only). The `style` prop also receives the Pressable state.
- focus: `focus-visible:ring-2 focus-visible:ring-focus` (styled only).
- disabled: `disabled` prop; sets Pressable `disabled`, `accessibilityState.disabled`, and `opacity-50`.
- loading: `loading` prop; renders `ActivityIndicator` with accessibilityLabel "Loading", sets `accessibilityState.busy`, disables the control, applies `opacity-50`.
- hover: no code.

#### Tokens

- `color.primary`: `bg-primary` x1
- `color.border`: `border-border` x2
- `color.onPrimary`: `text-on-primary` x2
- `color.surfaceRaised`: `bg-surface-raised` x1
- `color.text`: `text-text` x2
- `color.danger`: `bg-danger border-danger` x2
- `color.onDanger`: `text-on-danger` x1
- `color.focus`: `ring-focus` x1
- `radius.control`: `rounded-control` x1
- Inline literals `minWidth: 44`, `minHeight` 40/44/48, `hitSlop` 2, `flexShrink: 1`: no token (tokenuse reports none for this file).

Tailwind default classes (no token): `border` x7, `min-h-10`, `min-h-11`, `min-h-12`, `gap-2` x2, `gap-3`, `px-3`, `px-4`, `px-5`, `py-2` x2, `py-3`, `opacity-80`, `opacity-50`, `font-semibold`.

#### Platform notes

none in source. The package.json export entry has `types`, `react-native` and `default` conditions only.

#### Motion

`active:opacity-80` and `motion-reduce:transition-none` classes. No Animated or Reanimated calls, no durations.

#### Dependencies

- `joinClasses` from `./styles.ts` (same package).
- react-native (peer, required): Pressable, Text, View, ActivityIndicator.
- react (peer, required, types only).
- No optional peers.

#### Example

```tsx example=Button
import { Text } from "react-native";
import { Button } from "@nyc-tron/ui/components/Button";

export function SaveRow({ saving, onSave }: { saving: boolean; onSave: () => void }) {
  return (
    <Button
      title="Save changes"
      variant="primary"
      size="md"
      loading={saving}
      icon={<Text>+</Text>}
      numberOfLines={1}
      onPress={onSave}
    />
  );
}
```

#### UNVERIFIED

- UNVERIFIED: Whether the `className` prop is applied to the Pressable depends on the host's className interop (it is spread through an untyped object); the source shows no fallback.

UNVERIFIED count: 1

### Card

`import {Card} from "@nyc-tron/ui/components/Card"`

Source: packages/ui/src/components/Card.tsx (helper: styles.ts). Tier-1 reason: R1 root barrel export; R2 core family (components/). Import count: 1.

#### Props

Extends `Omit<ViewProps,"children">`. `style` is passed through unchanged.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| children | `ReactNode` | none | no |  |
| surface | `CardSurface` | `"raised"` | no |  |
| padded | `boolean` | `true` | no | Adds `p-4` when styled. |
| className | `string` | none | no | Appended last. |
| unstyled | `boolean` | `false` | no | Removes all default classes. |

#### Variants

`surface` (`CardSurface`):
- `raised`: `bg-surface-raised border-border`.
- `sunken`: `bg-surface-sunken border-border`.
- `transparent`: `bg-transparent border-transparent`.

Styled cards also get `rounded-card border`.

#### States

Static container. No interactive or conditional states in code.

#### Tokens

- `color.surfaceRaised` x1, `color.border` x2, `color.surfaceSunken` x1 (surface classes)
- `radius.card`: `rounded-card` x1

Tailwind default classes (no token): `border` x6, `p-4`.

#### Platform notes

none in source.

#### Motion

none in source.

#### Dependencies

- `joinClasses` from `./styles.ts`.
- react-native (peer, required): View.
- No optional peers.

#### Example

```tsx example=Card
import { Text } from "react-native";
import { Card } from "@nyc-tron/ui/components/Card";

export function Summary() {
  return (
    <Card surface="sunken" padded>
      <Text>Last sync 09:41</Text>
    </Card>
  );
}
```

#### UNVERIFIED

none

UNVERIFIED count: 0

### KeyValueList
`import { ... } from "@nyc-tron/ui/components/content/KeyValueList"`
Source: `packages/ui/src/components/content/KeyValueList.tsx`
Tier-1 reason: R2 core family (content)
Import count: 0

#### Props
`KeyValueListProps extends Omit<ViewProps,"children">`. Read: `onLayout` (called after the internal measurement). The rest is forwarded to the root `View`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| items | readonly KeyValueItem[] | none | yes | One list item per entry, keyed by `item.key`. |
| columns | 1 \| 2 | 2 | no | Upper bound on columns. |
| twoColumnMinWidth | number | 600 | no | Measured list width at or above which two columns are used (when `columns` is 2). |
| emptyLabel | string | "Not set" | no | Text for a `null` or `undefined` value. |
| surface | "page" \| "night" | none | no | Accepted and discarded (`surface:_surface`). |
| className | string | none | no | Joined onto the root classes. |
| labelClassName | string | none | no | Joined onto the label `Text`. |
| valueClassName | string | none | no | Joined onto the value `Text` for string and number values. |
| unstyled | boolean | false | no | Drops the built-in classes. |

`KeyValueItem` (same file):

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| key | string | none | yes | React key. |
| label | string | none | yes | Shown above the value. |
| value | ReactNode | none | yes | `null` or `undefined` draws `emptyLabel`. A string or number is wrapped in a selectable `Text`; any other node renders as given. |
| action | ReactNode | none | no | Rendered beside the value in a `shrink-0` wrapper. |

#### Variants
- `columns`: 1 always gives each item `width: "100%"`. 2 gives `"50%"` plus `paddingEnd: 16` only when the measured width is at least `twoColumnMinWidth`; before the first layout (`width` is `null`) it is one column.
- `surface`: no effect in code.

#### States
- empty value: `value` is `null` or `undefined`; draws `emptyLabel` with `text-sm leading-5 text-text-muted italic` (styled).
- unstyled: `unstyled` removes the `gap-y-4`, `gap-0.5`, `text-xs leading-4 text-text-muted`, `text-sm leading-5 text-text` and empty-value classes. `labelClassName` and `valueClassName` still apply.

No hover, pressed, focus, disabled or loading code.

#### Tokens
`node tokenuse.mjs` output:
- `color.textMuted` via `text-text-muted` (x2)
- `color.text` via `text-text` (x1)
- `paddingEnd: 16` is not matched by tokenuse (the file passes it as a variable expression); no token reported.

Tailwind default classes (no token): `w-full`, `flex-row`, `flex-wrap`, `gap-y-4`, `gap-0.5`, `gap-2` (x1), `min-w-0` (x1), `shrink`, `shrink-0`, `items-center`, `text-xs`, `leading-4`, `text-sm` (x2), `leading-5`, `italic`.

#### Platform notes
none in source

#### Motion
none in source

#### Dependencies
- `react-native`: `Text`, `View`, `LayoutChangeEvent`, `ViewProps`.
- `zustand` (`zustand/vanilla`, `zustand`): `createStore`, `useStore`. Declared an optional peer in packages/ui/package.json.
- `../styles.ts`: `joinClasses`.
- Colours follow the nearest `NightScope` (per the `surface` doc comment).

#### UNVERIFIED
- UNVERIFIED: screen reader output for `role="list"` and `role="listitem"`; no assistive technology was run.

#### Example
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

UNVERIFIED count: 1

### DataTable
`import { ... } from "@nyc-tron/ui/components/data/DataTable"`
Source: `packages/ui/src/components/data/DataTable.tsx (+ data/table-layout.ts)`
Tier-1 reason: R2 core family (data)
Import count: 0

#### Props
`DataTableProps<T extends RowData> extends Omit<ViewProps,"children">`. Read: `onLayout`, `style`, `accessibilityLabel` (defaults to "Data table"). The rest is forwarded to the root `View`. `TronColumnDef<T>` is `ColumnDef<typeof features, T, unknown>` from `@tanstack/react-table`; the features are row sorting only.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| data | readonly T[] | none | yes | Copied with `[...data]` into `useTable`. |
| columns | TronColumnDef<T>[] | none | yes | |
| getRowId | (row: T) => string | none | no | Passed to `useTable` only when set. |
| onRowPress | (row: T) => void | none | no | Makes rows `Pressable` buttons with hint "Opens this record". |
| width | number | none | no | Overrides the measured width. |
| layout | "auto" \| "table" \| "cards" | "auto" | no | See Variants. |
| cardsBelow | number | 620 | no | Width under which `auto` gives cards. |
| minColumnWidth | number | 144 | no | Used for the content width of the table layout. |
| getColumnLabel | (columnId: string) => string | none | no | Takes priority over a string header, then the column id. |
| renderCard | (row: Row<typeof features, T>) => ReactNode | none | no | Replaces the default card. |
| rowHeight | number | 44 | no | Row `minHeight` (table) and empty-state height. |
| headerHeight | number | 44 | no | Header `minHeight`. |
| maxHeight | number | 640 | no | Root `style.maxHeight`. |
| emptyLabel | string | "No records" | no | |
| sortable | boolean | true | no | |
| className | string | none | no | Joined onto the root classes. |
| headerClassName | string | none | no | |
| rowClassName | string | none | no | |
| cellClassName | string | none | no | |
| unstyled | boolean | false | no | Drops the built-in classes. |

#### Variants
`layout` resolves through `dataTableLayout`:
- `"cards"` and `"table"` are used as given.
- `"auto"`: `"cards"` when the width is `null` (before measurement) or below `cardsBelow`, else `"table"`.
- Cards: optional horizontal sort-button strip, then a `FlatList` of cards (`gap-3 p-4`, plus `rounded-card border border-border bg-surface-raised` when styled).
- Table: horizontal `ScrollView`, header row, `FlatList` of rows; column area width is `max(width, columns x minColumnWidth)`.
- An unknown `layout` string, a `cardsBelow` that is not above 0, or a negative width throws `RangeError`.

#### States
- empty: `ListEmptyComponent` shows `emptyLabel` in both layouts.
- sorted: a header or sort button carries `accessibilityValue.text` of "sorted ascending", "sorted descending" or "not sorted", plus an arrow glyph hidden from accessibility.
- pressable row: `onRowPress` set gives `accessibilityRole="button"`; unset gives `disabled` on the row `Pressable`.
- focus: sort buttons carry `focus-visible:ring-2 focus-visible:ring-focus` (styled).
- unstyled: removes the surface, border and text-colour classes.

No loading, error or hover code.

#### Tokens
`node tokenuse.mjs` output:
- `space.2` from `gap: 8` (x1)
- `space.1.5` from `paddingVertical: 6` (x2)
- `space.2.5` from `gap: 10` (x1)
- `space.3` from `paddingHorizontal: 12` (x2)
- `color.text` (x1), `color.border` (x4), `color.surfaceRaised` (x2), `color.textMuted` (x1), `color.surfaceSunken` (x2), `color.focus` (x2)
- `radius.card` (x1), `radius.control` (x1)
- `minWidth: 0`: no token (x1)

Tailwind default classes (no token): `gap-3` (x2), `p-4`, `border` (x12), `min-w-0` (x3), `min-h-11`, `gap-2`, `px-3` (x3), `flex-row`, `flex-1`, `w-full`, `items-center`, `justify-center`, `ring-2`. Also unmapped literals: `width: "40%"`, `fontWeight: "600"`.

#### Platform notes
none in source

#### Motion
none in source

#### Dependencies
- `@tanstack/react-table` (`createSortedRowModel`, `flexRender`, `rowSortingFeature`, `sortFns`, `tableFeatures`, `useTable`): optional peer, `^9.0.0`.
- `react-native`: `FlatList`, `Pressable`, `ScrollView`, `Text`, `View`.
- `zustand`, `zustand/vanilla`: optional peer.
- `../styles.ts`: `joinClasses`. `./table-layout.ts`: `dataTableLayout`, `tableContentWidth`.

#### UNVERIFIED
- UNVERIFIED: whether the example's column types check against the real `@tanstack/react-table` 9 API. The check harness has a TanStack version that lacks `useTable`, `tableFeatures` and related exports, so `check.sh` reports errors inside `DataTable.tsx` itself and `TronColumnDef` may resolve loosely. None are reported under `examples/DataTable.tsx`.
- UNVERIFIED: screen reader announcements for the sort buttons and row buttons; no assistive technology was run.

#### Example
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

UNVERIFIED count: 2

### TreeGrid
`import { ... } from "@nyc-tron/ui/components/data/TreeGrid"`
Source: `packages/ui/src/components/data/TreeGrid.tsx (+ data/tree-grid.ts, data/tree-row-heights.ts)`
Tier-1 reason: R2 core family (data)
Import count: 0

#### Props
`TreeGridProps extends Omit<ViewProps,"children">`. Read: `onLayout`, `accessibilityLabel` (default "Tree grid"). The rest is forwarded to the root `View`, which is given `role="treegrid"` and `focusable`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| nodes | readonly TreeGridNode[] | none | yes | |
| columns | readonly TreeGridColumn[] | none | yes | Value columns; the "Name" label column is always first and pinned. |
| expandedIds | readonly string[] | none | no | Controlled expansion. |
| defaultExpandedIds | readonly string[] | [] | no | Initial uncontrolled expansion. |
| onExpandedChange | (next: readonly string[]) => void | none | no | |
| selectedIds | readonly string[] | none | no | Controlled selection. |
| defaultSelectedIds | readonly string[] | [] | no | |
| onSelectionChange | (next: readonly string[]) => void | none | no | Per the comment: taps, Space and Shift range. |
| columnOrder | readonly string[] | none | no | Controlled order. |
| onColumnOrderChange | (next: readonly string[]) => void | none | no | Called by the header "Move left/right" accessibility actions. |
| pinnedColumnIds | readonly string[] | none | no | Passed to `orderTreeColumns`. |
| renderCell | (node: TreeGridNode, column: TreeGridColumn) => ReactNode | none | no | Falls back to `String(node.values?.[column.id] ?? "")` in a `Text`. |
| compactBelow | number | 620 | no | Measured width under which the compact layout is used. |
| rowHeight | number | 48 | no | Row `minHeight` (compact: `rowHeight + 44`) and the height estimate. |
| maxHeight | number | 640 | no | `FlatList` `maxHeight`. |
| emptyLabel | string | "No items" | no | |
| className | string | none | no | |
| unstyled | boolean | false | no | |

`TreeGridColumn` (same file): `id: string` (required), `title: string` (required), `width?: number` (cells use 140 when unset).

`TreeGridNode` (data/tree-grid.ts): `id: string`, `label: string`, `values?: Readonly<Record<string, string|number|boolean|null>>`, `children?: readonly TreeGridNode[]`.

#### Variants
- Wide layout (`width >= compactBelow`, where `width` starts at 0 until layout): a horizontal `Animated.ScrollView`, a sticky header row, and rows with a pinned strip (label plus pinned columns, translated by the scroll offset) beside scrolling cells. The label column is 224 wide.
- Compact layout (`width < compactBelow`; this is also the layout before the first measurement): the header row is omitted; each row stacks the label over cells that show their column title at `42%` width.

#### States
- expanded: a row with children has a button labelled "Expand <label>" or "Collapse <label>" with `accessibilityState.expanded`; the row has `aria-expanded`. Glyphs "▾" and "▸".
- selected: `aria-selected` on the row; `bg-primary/10` (styled); label `fontWeight: "700"`.
- focused: internal `focusId`; `ring-2 ring-focus` on the row and the pinned strip (styled). The toggle button also carries `focus-visible:ring-2 focus-visible:ring-focus`.
- empty: `ListEmptyComponent` shows `emptyLabel`.
- controlled and uncontrolled expansion, selection and column order, each chosen by whether the matching prop is `undefined`.
- Keyboard: `onKeyDown` forwards `key` and `shiftKey` to `treeGridKey`; if it returns a result the event is prevented, and a focus move scrolls with `scrollToIndex`.

No loading, error or disabled code.

#### Tokens
`node tokenuse.mjs` output:
- `space.2` from `gap: 8` (x1), `space.1` from `paddingVertical: 4` (x1), `space.3` from `padding: 12` (x1)
- `<Component>.space.11` from `paddingLeft: 44` (x2; component-scoped pattern, not a global token)
- `size.touch` from `minHeight: 44` (x3) and `minWidth: 44` (x2)
- `color.text` (x1), `color.textMuted` (x1), `color.surfaceRaised` (x1), `color.focus` (x3), `color.border` (x2), `color.primary` (x2), `color.surfaceSunken` (x2)
- `radius.control` (x1)

Tailwind default classes (no token): `rounded-control` (x1), `border` (x6), `min-w-0` (x1), `ring-2`, `border-b`. Unmapped literals include `width: 224`, `height: 44`, `paddingLeft: min(depth*16,128)`, default column width 140.

#### Platform notes
Only a comment: rows and cells use `role` rather than `accessibilityRole` because "row" and "cell" are absent from Android's `AccessibilityRole` enum and would throw there. No `Platform.OS` checks or sibling files.

#### Motion
- `Animated.Value` `scrollX` is fed by `Animated.event` with `useNativeDriver: true` on the horizontal scroller (`scrollEventThrottle={16}`) and applied as `translateX` to the pinned header and pinned row strips.
- `scrollToIndex` and `scrollToOffset` use `animated: false`.
- `scrollX` is reset to 0 when leaving the compact layout.

#### Dependencies
- `react-native`: `Animated`, `FlatList`, `Pressable`, `Text`, `View`, `ViewProps`.
- `zustand`, `zustand/vanilla`: optional peer.
- `./tree-grid.ts` (`moveColumn`, `orderTreeColumns`, `toggleTreeSelection`, `treeGridKey`, `treeRowAccessibilityLabel`, `visibleTreeRows`), `./tree-row-heights.ts` (`createRowHeightIndex`), `../styles.ts` (`joinClasses`).

#### UNVERIFIED
- UNVERIFIED: which keys `treeGridKey` handles and what each does; only its call site in `TreeGrid.tsx` and its exports list were read.
- UNVERIFIED: runtime behaviour of the `role="row"`, `role="cell"` and `role="columnheader"` mapping on Android, iOS and web; only the source comment states intent.
- UNVERIFIED: that the pinned strip stays aligned during native-driver scrolling; no device was run.

#### Example
```tsx example=TreeGrid
import { TreeGrid, type TreeGridColumn } from "@nyc-tron/ui/components/data/TreeGrid";

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

UNVERIFIED count: 3

### DragGrabHandle

`import {DragGrabHandle} from "@nyc-tron/ui/components/DragGrabHandle"`

Source: packages/ui/src/components/DragGrabHandle.tsx (helpers: styles.ts, gestures/drag-controller.ts, gestures/drag-transport.ts, gestures/PanResponderDrag.tsx). Tier-1 reason: R2 core family (components/). Import count: 3.

#### Props

`DragGrabHandleProps` extends `Omit<ViewProps,"children"|"accessibilityLabel">`. `style` is merged after the built-in min size, opacity and `userSelect`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| label | `string` | none | yes | Sets `accessibilityLabel`. |
| disabled | `boolean` | `false` | no | Opacity 0.4, `aria-disabled`. Read on every drag transition. |
| onStart | `()=>void` | none | yes | A drag began. |
| onMove | `(point:DragPoint)=>void` | none | yes | Preview only; single pointer. |
| onCommit | `()=>void` | none | yes | Once per completed drag. |
| onCancel | `()=>void` | none | yes | Escape, termination, a second pointer or becoming disabled. |
| transport | `DragTransport` | `PanResponderDrag` | no | Pointer recogniser component. |
| color | `string` | none | no | Sets `borderColor` of the grip bars. |
| children | `ReactNode` | none | no | Replaces the three-bar grip. |
| className | `string` | none | no |  |
| unstyled | `boolean` | `false` | no | Removes `rounded-control` and the `border-text-muted` bar class. |

`DragPoint` (re-exported from gestures/drag-transport.ts):

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| x | `number` | none | yes | Page (web) or absolute window (native) coordinates. |
| y | `number` | none | yes |  |

#### Variants

none.

#### States

- default: 44x44 minimum, three-bar grip.
- disabled: `disabled` prop; opacity 0.4, `aria-disabled`, the controller ignores input.
- dragging: handled by the controller (start, move preview, one commit, cancel); no visual change in this file.
- cancelled: Escape key (`onKeyDown`), second pointer, unmount, or disabled.

#### Tokens

- `color.textMuted`: `border-text-muted` x1
- `radius.control` x1
- `size.touch`: `minWidth: 44`, `minHeight: 44`
- `space.0.75`: `gap: 3` x1
- `border.2`: `borderTopWidth: 2` x1
- `opacity.0_4`: `opacity 0.4` x1
- Inline bar width 16 and height 0: no token.

Tailwind default classes (no token): `border` x1, `rounded-control` x1.

#### Platform notes

- `Platform.OS==="web"` adds `userSelect:"none"` to the style.
- `focusable={false}`: not a tab stop, per the source comment.

#### Motion

none in source.

#### Dependencies

- `createDragController` and `DragController` from `./gestures/drag-controller.ts`; `keyboardKey`, `DragPoint`, `DragTransport`, `KeyEventLike` from `./gestures/drag-transport.ts`; `PanResponderDrag` from `./gestures/PanResponderDrag.tsx`.
- `joinClasses`.
- react-native (peer, required): Platform, View, PanResponder (inside PanResponderDrag).
- `GestureHandlerDrag` (react-native-gesture-handler, optional peer) is not imported here; it is only a value a caller may pass as `transport`.

#### Example

```tsx example=DragGrabHandle
import { DragGrabHandle } from "@nyc-tron/ui/components/DragGrabHandle";

export function LayerHandle() {
  return (
    <DragGrabHandle
      label="Reorder Layer 2"
      onStart={() => {}}
      onMove={(point) => void (point.x + point.y)}
      onCommit={() => {}}
      onCancel={() => {}}
    />
  );
}
```

#### UNVERIFIED

- UNVERIFIED: Whether Escape reaches `onKeyDown` while the pointer is down depends on web focus behaviour described in a source comment, not shown by code.
- UNVERIFIED: Gesture recognition itself (touch slop, multi-touch counting) lives in gestures/pan-responder-config.ts, which was not read.

UNVERIFIED count: 2

### Badge

`import {Badge} from "@nyc-tron/ui/components/feedback/Badge"`

Source: packages/ui/src/components/feedback/Badge.tsx (helper: styles.ts). Tier-1 reason: R2 core family (feedback). Import count: 0.

#### Props

Extends `Omit<ViewProps,"children">`. `accessibilityLabel` defaults to `label`; the View has `accessible`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| label | `string` | none | yes | Text and accessibilityLabel. |
| tone | `BadgeTone` | `"neutral"` | no |  |
| size | `BadgeSize` | `"sm"` | no |  |
| className | `string` | none | no |  |
| labelClassName | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |

#### Variants

`tone`:
- `neutral`: `bg-surface-sunken`, label `text-text-muted`, no dot.
- `info`, `success`, `danger`, `accent`: `bg-surface-raised`, label `text-text`, plus a dot View with `border-info`/`border-success`/`border-danger`/`border-accent`, `style={{borderWidth:3}}`, `h-1.5 w-1.5 rounded-full`.

`size`:
- `xs`: root `gap-1 px-1.5 py-0.5`, label `text-xs leading-4`.
- `sm`: root `gap-1.5 px-2 py-1`, label `text-xs leading-4 font-medium`.

#### States

Static. No interactive states in code.

#### Tokens

- `color.info`, `color.success`, `color.danger`, `color.accent`: dot border x1 each
- `color.border` x1, `color.surfaceSunken` x1, `color.surfaceRaised` x1, `color.textMuted` x1, `color.text` x1
- `radius.control` x1
- `border.3`: `borderWidth: 3` x1

Tailwind default classes (no token): `border` x8, `gap-1` x2 (incl. `gap-1.5`), `px-1` (`px-1.5`), `py-0` (`py-0.5`), `text-xs` x2, `px-2`, `py-1`, `font-medium`, `h-1`, `w-1`, `rounded-full`, `leading-4`.

#### Platform notes

none in source.

#### Motion

none in source.

#### Dependencies

- `joinClasses` from `../styles.ts`.
- react-native (peer, required): Text, View.
- No optional peers.

#### Example

```tsx example=Badge
import { Badge } from "@nyc-tron/ui/components/feedback/Badge";

export function DraftBadge() {
  return <Badge label="Draft" tone="info" size="xs" />;
}
```

#### UNVERIFIED

none

UNVERIFIED count: 0

### Banner

`import {Banner} from "@nyc-tron/ui/components/feedback/Banner"`

Source: packages/ui/src/components/feedback/Banner.tsx (helpers: ../styles.ts, feedback/glyphs.tsx). Tier-1 reason: R2 core family (feedback). Import count: 0.

#### Props

`BannerProps` extends `Omit<ViewProps,"children"|"role">`. `role` is set to the `live` value.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| tone | `BannerTone` | none | yes | `BannerTone = StatusTone`: `info|success|danger|neutral` (from glyphs.tsx). |
| title | `string` | none | yes |  |
| description | `string` | none | no |  |
| action | `ReactNode` | none | no | Rendered under the copy. |
| live | `"status"|"alert"` | `"status"` | no | `status`: `accessibilityLiveRegion` polite; `alert`: assertive. |
| onDismiss | `()=>void` | none | no | Renders the close Pressable. |
| dismissLabel | `string` | `"Dismiss"` | no |  |
| icon | `ReactNode` | none | no | Replaces `StatusGlyph`. |
| className | `string` | none | no |  |
| titleClassName | `string` | none | no |  |
| descriptionClassName | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |

#### Variants

`tone` class strings: `info` `border-info bg-surface-raised`; `success` `border-success bg-surface-raised`; `danger` `border-danger bg-surface-raised`; `neutral` `border-border bg-surface-sunken`. Styled root also has `gap-3 rounded-card border ps-4 py-3` and `pe-1` with `onDismiss`, else `pe-4`.

#### States

- default: tone classes.
- live region: `role` and `accessibilityLiveRegion` from `live`.
- dismissible: `onDismiss` set; close control `accessibilityRole="button"`, `min-h-11 min-w-11`.
- close hover/pressed/focus: `hover:bg-surface-sunken active:opacity-70 focus-visible:ring-2 focus-visible:ring-focus`.

#### Tokens

- `color.info`, `color.success`, `color.danger`: x1 each (`border-*`)
- `color.surfaceRaised` x3, `color.surfaceSunken` x2, `color.border` x1, `color.text` x1, `color.textMuted` x1, `color.focus` x1
- `radius.card` x1, `radius.control` x1
- `-space.2.5`: `marginVertical: -10` x1
- `StatusGlyph` in glyphs.tsx adds `bg-info/success/danger`, `bg-text-muted` classes (separate file, not counted above).

Tailwind default classes (no token): `border` x7, `gap-3`, `rounded-card`, `py-3`, `min-w-0`, `gap-1`, `text-sm` x2, `font-semibold`, `min-h-11`, `min-w-11`, `opacity-70`, `ps-4`, `pe-1`, `pe-4`, `leading-5`, `mt-2`, `pt-0.5`, `py-px`, `self-start`.

#### Platform notes

none in source.

#### Motion

`active:opacity-70` on the close control. No Animated calls.

#### Dependencies

- `StatusGlyph`, `CloseGlyph`, `StatusTone` from `./glyphs.tsx`; `joinClasses`.
- react-native (peer, required): Pressable, Text, View.
- No optional peers.

#### Example

```tsx example=Banner
import { Banner } from "@nyc-tron/ui/components/feedback/Banner";
import { Button } from "@nyc-tron/ui/components/Button";

export function SaveFailed({ retry, close }: { retry: () => void; close: () => void }) {
  return (
    <Banner
      tone="danger"
      live="alert"
      title="Could not save"
      description="Check your connection and try again."
      action={<Button title="Try again" variant="secondary" onPress={retry} />}
      onDismiss={close}
      dismissLabel="Dismiss message"
    />
  );
}
```

#### UNVERIFIED

- UNVERIFIED: Whether `role="alert"` or `"status"` on a View announces on each native platform: depends on the host, not on this file.
- UNVERIFIED: `ps-4`, `pe-1` and `pe-4` are logical-property utilities; their support depends on the consumer's Tailwind or Uniwind setup, which is out of scope.

UNVERIFIED count: 2

### EmptyState

`import {EmptyState} from "@nyc-tron/ui/components/feedback/EmptyState"`

Source: packages/ui/src/components/feedback/EmptyState.tsx (helpers: ../styles.ts, ../Button.tsx). Tier-1 reason: R2 core family (feedback). Import count: 2.

#### Props

`EmptyStateProps` extends `Omit<ViewProps,"children">`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| title | `string` | none | yes | Rendered with `role="heading"` and `aria-level`. |
| description | `string` | none | no |  |
| action | `ReactNode` | none | no | Takes precedence over `exitAction`. |
| exitAction | `EmptyStateExit` | none | no | Rendered as `Button variant="secondary"`. |
| icon | `ReactNode` | none | no | Ignored when `illustration` is given. |
| illustration | `ReactNode` | none | no |  |
| titleLevel | `1|2|3|4|5|6` | `2` | no | Passed as `aria-level`. |
| tone | `string` | none | no | Accepted and discarded (`_tone`). |
| className | `string` | none | no |  |
| titleClassName | `string` | none | no |  |
| descriptionClassName | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |

`EmptyStateExit`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| title | `string` | none | yes | Button title. |
| onPress | `()=>void` | none | yes |  |
| accessibilityHint | `string` | none | no |  |

#### Variants

none.

#### States

Static. The exit control is a `Button` with its own states.

#### Tokens

- `color.text` x1, `color.textMuted` x1

Tailwind default classes (no token): `gap-2`, `px-6`, `py-8`, `text-base`, `font-semibold`, `text-sm`, `max-w-sm`, `mb-2`, `mt-3`, `leading-6`, `leading-5`, `text-center`.

#### Platform notes

none in source.

#### Motion

none in source.

#### Dependencies

- `Button` from `../Button.tsx` (subpath `./components/Button`); `joinClasses`.
- react-native (peer, required): Text, View.
- No optional peers.

#### Example

```tsx example=EmptyState
import { EmptyState } from "@nyc-tron/ui/components/feedback/EmptyState";

export function NoLayers({ add }: { add: () => void }) {
  return (
    <EmptyState
      title="No layers yet"
      description="Add a layer from the toolbar."
      titleLevel={3}
      exitAction={{ title: "Add layer", onPress: add, accessibilityHint: "Creates an empty layer" }}
    />
  );
}
```

#### UNVERIFIED

- UNVERIFIED: How `role="heading"` with `aria-level` is exposed on iOS and Android: the file's own comment says native announces a heading without a level.

UNVERIFIED count: 1

### ErrorMessage

`import {ErrorMessage} from "@nyc-tron/ui/components/feedback/ErrorMessage"`

Source: packages/ui/src/components/feedback/ErrorMessage.tsx (helpers: ../styles.ts, feedback/glyphs.tsx). Tier-1 reason: R2 core family (feedback); R4 imported by 211 files. Import count: 211.

#### Props

`ErrorMessageProps` extends `Omit<ViewProps,"children">`. Returns `null` when `message` is falsy.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| message | `string` | none | no | Nothing renders without it. |
| surface | `"page"|"night"` | none | no | Accepted and discarded (`_surface`). |
| className | `string` | none | no |  |
| messageClassName | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |

#### Variants

none.

#### States

- error: any non-empty `message`; Text `role="alert"`, `accessibilityLiveRegion="polite"`, `text-danger`, leading `StatusGlyph tone="danger"`.
- empty: no message returns `null`.

#### Tokens

- `color.danger`: `text-danger` x1
- `StatusGlyph` in glyphs.tsx adds `bg-danger border-danger` (separate file, not counted).

Tailwind default classes (no token): `gap-2`, `min-w-0`, `text-sm`, `leading-5`, `pt-px`.

#### Platform notes

none in source.

#### Motion

none in source.

#### Dependencies

- `StatusGlyph` from `./glyphs.tsx`; `joinClasses`.
- react-native (peer, required): Text, View.
- No optional peers.

#### Example

```tsx example=ErrorMessage
import { ErrorMessage } from "@nyc-tron/ui/components/feedback/ErrorMessage";

export function FormError({ message }: { message?: string }) {
  return <ErrorMessage message={message} surface="page" />;
}
```

#### UNVERIFIED

- UNVERIFIED: Whether a live region on a Text mounted with the message is announced on first render: platform behaviour, not shown by code.

UNVERIFIED count: 1

### FieldGroup

`import {FieldGroup, FieldSection} from "@nyc-tron/ui/components/FieldGroup"`

Source: packages/ui/src/components/FieldGroup.tsx (helper: styles.ts). Tier-1 reason: R2 core family (components/). Import count: 0.

#### Props

`FieldGroup` extends `Omit<ViewProps,"children">`. It is `Object.assign(FieldGroupRoot,{Section:FieldSection})`, and `FieldSection` is also a named export.

`FieldGroupProps`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| children | `ReactNode` | none | no |  |
| className | `string` | none | no | Root classes `w-full min-w-0 gap-4` come first. |

`FieldSectionProps` extends `Omit<ViewProps,"children"|"role">`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| title | `string` | none | no | Header Text (accessibilityRole header; web `aria-level` 3) and the group's `aria-label`. |
| footer | `string` | none | no | Text under the body. |
| children | `ReactNode` | none | no |  |
| titleUppercase | `boolean` | `false` | no | Adds `uppercase tracking-wide`. |
| className | `string` | none | no |  |
| titleClassName | `string` | none | no |  |
| bodyClassName | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |

#### Variants

none.

#### States

Static layout. No interactive states in code.

#### Tokens

- `color.border` x2, `color.surfaceRaised` x1, `color.text` x1, `color.textMuted` x1
- `radius.control` x1

Tailwind default classes (no token): `min-w-0` x2, `gap-4`, `border` x6, `px-3` x2, `py-2`, `text-sm` x2, `font-semibold`, `gap-3`, `p-3`.

#### Platform notes

- `Platform.OS==="web"` adds `aria-level: 3` to the section title.

#### Motion

none in source.

#### Dependencies

- `joinClasses` from `./styles.ts`.
- react-native (peer, required): Platform, Text, View.
- No optional peers.

#### Example

```tsx example=FieldGroup
import { useState } from "react";
import { FieldGroup } from "@nyc-tron/ui/components/FieldGroup";
import { TextField } from "@nyc-tron/ui/components/TextField";

export function DocumentDetails() {
  const [title, setTitle] = useState("");
  return (
    <FieldGroup>
      <FieldGroup.Section title="Document details" footer="Visible to collaborators." titleUppercase>
        <TextField id="title" label="Title" value={title} onChangeText={setTitle} />
      </FieldGroup.Section>
    </FieldGroup>
  );
}
```

#### UNVERIFIED

- UNVERIFIED: Screen reader announcement of `role="group"` with `aria-label` on native: the doc comment states it, the file does not prove it.

UNVERIFIED count: 1

### PrecisionScrubber

`import {PrecisionScrubber} from "@nyc-tron/ui/components/forge/inputs/PrecisionScrubber"`
Source: `packages/ui/src/components/forge/inputs/PrecisionScrubber.tsx` (state in `forge/inputs/precision-scrubber-model.ts`, math in `forge/inputs/precision.ts`). Tier-1 reason: R4 imported by 32 files. Import count: 32.
Exports: `PrecisionScrubber`, `PrecisionScrubberProps`.

#### Props
`PrecisionScrubberProps` extends `Omit<ViewProps,"children">` and `RangeConfig`. Rest spread goes to the root `View`; `style` is appended after the opacity and no-select styles.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| label | `string` | none | yes | Non-blank. |
| min | `number` | none | yes | From `RangeConfig`. |
| max | `number` | none | yes | From `RangeConfig`; must exceed `min`. |
| step | `number` | none | yes | From `RangeConfig`; must be above 0. |
| detents | `readonly number[]` | none | no | From `RangeConfig`. |
| value | `number` | none | yes | Committed value. |
| unit | `string` | none | no | Shown after the number. |
| scope | `string` | none (identity falls back to `label`) | no | Non-blank, at most 512 characters. |
| revision | `string \| number` | `0` | no | |
| targetSize | `number` | `44` | no | Throws `RangeError` below 44 or non-finite. |
| labels | `Partial<{increase,decrease,value,gestureHint,idleHint,fine,normal,coarse}>` (all `string`) | built-in English copy | no | Each provided value must be a non-empty string. |
| disabled | `boolean` | `false` | no | |
| onPreview | `(value:number)=>void` | none | no | Preview during a drag; restored on cancel. |
| onCommit | `(value:number)=>unknown` | none | yes | Once per drag, nudge or text entry. While a returned promise is pending the control is disabled; a rejection shows its message. |
| forcedColors | `boolean` | `false` | no | Web only (`forced && Platform.OS==="web"`). |
| transport | `DragTransport` | `PanResponderDrag` | no | Pointer recogniser component. |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | |
| scaleColor | `string` | none | no | Background of the scale ink when not forced. |
| accentColor | `string` | none | no | Background of the filled part. |

Default copy: increase `"Increase <label>"`, decrease `"Decrease <label>"`, value `"<label> value"`, mode names "Fine precision", "Normal precision", "Coarse precision", idleHint "Drag: up for fine, down for coarse".

Throws `RangeError('Invalid scrubber identity')` for a blank label, bad scope or bad revision.

#### Variants
- Precision mode while dragging (`state.mode`, from vertical travel): `fine`, `normal`, `coarse`. The mode name is shown as text only; `precision.ts` defines the thresholds (28 px) and step scales (fine 0.1, coarse 4 in `scrubValue`).
- `forcedColors`: the scale and fill use `CanvasText` and `Highlight` through CSS variables with `forcedColorAdjust:"none"`, and the class strings `bg-border`/`bg-accent` are dropped.

#### States
- default, hovered, focused, active (dragging): scale border class is `border-accent` when active, else `border-focus` when focused, else `border-text-muted` when hovered, else `border-border`; the scale background is `bg-surface-raised` when active, else `bg-surface-sunken`.
- editing: the number field's wrapper border is `border-focus`.
- disabled: `disabled` prop; root opacity 0.5, buttons and field `disabled`/`editable=false`, `aria-disabled`.
- pending: `state.pending` also blocks the control (same disabled treatment, without the 0.5 opacity).
- error: `state.error` shows `text-danger` text with `accessibilityLiveRegion="assertive"`.
- active hint text shows the mode label; idle shows `idleHint`.
- pressed: no code.

#### Tokens
- Colour classes: `color.border` 4, `color.textMuted` 4, `color.text` 4, `color.accent` 3, `color.focus` 2, `color.surfaceRaised` 2, `color.surfaceSunken` 2, `color.danger` 1. Radius class: `radius.control` 3.
- Literals: `gap: 10` and `paddingHorizontal: 10` to `space.2.5` (1 each), `paddingVertical: 6` and `gap: 6` to `space.1.5` (1 each), `paddingLeft: 2` to `space.0.5` (1), `columnGap: 8` to `space.2` (1), `rowGap: 4` to `space.1` (1), `opacity 0.5`, `0.9`, `0.55` to `opacity.0_5`, `opacity.0_9`, `opacity.0_55` (1 each).
- Component-scoped: `paddingHorizontal: 11` to `<Comp>.space.2_75` (1), `marginLeft: -1.5` to `<Comp>.space.n0_375` (1).
- no token: `minWidth: 0` (1), `minHeight: 20` (1), field width 64, tick sizes.
- Tailwind default classes (no token): `border` 15, `rounded-control` 3, `text-xl` 1, `gap-2` 1, `text-xs` 5, `font-semibold` 2.

#### Platform notes
- `Platform.OS==="web"`: `userSelect:"none"` on the scale; `forcedColors` takes effect; `aria-valuemin`, `aria-valuemax` and `aria-valuenow` always set.
- Off web, those three aria range props are set only when `min`, `max` and the preview value are all integers; the in-source comment says Fabric and React Native Windows mis-parse non-integer `accessibilityValue`. `aria-valuetext` always carries the exact value.
- Imports `useEditorBoundary` from `gestures/editor-interaction-scope.ts` and `PanResponderDrag` from `gestures/`.
- package.json export conditions: `types`, `react-native`, `default`. No `.native`/`.web` siblings.

#### Motion
none in source (no Animated or Reanimated; the drag recogniser is the `PanResponderDrag` transport).

#### Dependencies
- `./precision.ts`, `./precision-scrubber-model.ts`, `../../gestures/editor-interaction-scope.ts`, `../../gestures/drag-transport.ts`, `../../gestures/PanResponderDrag.tsx`, `../../styles.ts`.
- External: `react`, `react-native`, `zustand`, `zustand/vanilla` (optional peer).

#### Example
```tsx example=PrecisionScrubber
import {PrecisionScrubber} from "@nyc-tron/ui/components/forge/inputs/PrecisionScrubber";
export const Example = () => <PrecisionScrubber label="Opacity" value={50} min={0} max={100} step={1} detents={[0,50,100]} unit="%"
  scope="layer-1.opacity" onPreview={()=>{}} onCommit={async()=>{}}/>;
```

#### UNVERIFIED
- UNVERIFIED: drag, cancel and second-pointer behaviour; it lives in `precision-scrubber-model.ts` and `PanResponderDrag.tsx`, not read.
- UNVERIFIED: how screen readers announce the `adjustable` role with `aria-valuetext` and the increment and decrement actions.
- UNVERIFIED: what the `useEditorBoundary` signature does to in-flight gestures when props change.
- UNVERIFIED: that `forcedColors` paints correctly in a Windows High Contrast browser.

UNVERIFIED count: 4

### PropertyInspector

`import {PropertyInspector} from "@nyc-tron/ui/components/forge/inputs/PropertyInspector"`
Source: `packages/ui/src/components/forge/inputs/PropertyInspector.tsx` (scope helpers in `forge/inputs/useScopedControl.ts`). Tier-1 reason: R4 imported by 48 files. Import count: 48.
Exports: `PropertyInspector`, `PropertyInspectorProps`, `InspectorProperty`, `PropertyValue`, `validateInspectorFields`.

#### Props
`PropertyInspectorProps` extends `Omit<ViewProps,"children">` and `ScopedControlProps` (`scope?`, `revision?`, `disabledReason?`). `style` is appended after `{gap:10,minWidth:0}`; `accessibilityLabel` is set to `label` after the spread.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| label | `string` | none | yes | Non-blank, at most 1024 characters. Header text and accessible name. |
| fields | `readonly InspectorProperty[]` | none | yes | Up to 128, unique ids. |
| onCommit | `(id:string,value:PropertyValue,signal?:AbortSignal)=>unknown` | none | yes | |
| scope | `string` | `'property-inspector'` | no | Non-blank, at most 512. |
| revision | `string \| number` | `0` | no | |
| disabledReason | `string` | none | no | Disables every field and shows the text as an error. |
| unstyled | `boolean` | `false` | no | |

`PropertyValue`: `number | string | boolean`.
`InspectorProperty` always has `id`, `label`, `disabledReason?`, plus one of:
| kind | extra fields |
|---|---|
| `'number'` | `value`, `min`, `max`, `step` (required), `unit?`, `integer?` |
| `'choice'` | `value:string`, `choices:readonly {id;label;disabled?}[]` |
| `'boolean'` | `value:boolean` |
| `'text'` | `value:string`, `maxLength:number`, `multiline?:boolean` |

`validateInspectorFields(fields)` throws `RangeError` for more than 128 fields or duplicate ids; blank or over-long ids (256) or labels (1024); a number with non-finite value, min, max or step, `min>=max`, `step<=0`, a value outside the range, or a non-integer when `integer`; a text `maxLength` that is not an integer from 1 to 65536, or a value longer than it; a choice list over 512 entries, duplicate choice ids, or blank or over-long choice ids (512) or labels (1024). The component also rejects a commit value of the wrong type, out of range or not in the enabled choices with `RangeError('Property value is unavailable')`.

#### Variants
Field `kind` picks the control: `number` renders `UnitInput` (label gets ` (unit)` appended, `min`, `max`, `step` forwarded); `choice` renders `Select` (a missing current value is appended as a disabled "Unavailable: <value>" option); `boolean` renders a secondary `Button` titled "<label>: on|off" with `accessibilityState={{checked}}`; `text` renders a `TextInput` and an "Apply <label>" `Button`.

#### States
- disabled: a pending commit, `disabledReason`, or a field's own `disabledReason` disables that control. A field `disabledReason` also shows under the field in `text-text-muted`.
- empty choice list: the `Select` is disabled.
- text dirty: the Apply button is disabled until the draft differs from `field.value`.
- error: `ErrorMessage` at the bottom shows the commit error or `disabledReason`.
- pending: `guard.pending` disables all controls.
- hover, focus, pressed: no code here (inherited from children).

#### Tokens
- Colour classes: `color.text` 3, `color.textMuted` 1, `color.border` 1. Radius class: `radius.control` 1.
- Literals: `gap: 10` to `space.2.5` (1), `gap: 4` to `space.1` (1), `gap: 6` to `space.1.5` (1), `padding: 8` to `space.2` (1), `minHeight: 44` to `size.touch` (1).
- no token: `minWidth: 0` (1).
- Tailwind default classes (no token): `border` 3, `rounded-control` 1.

#### Platform notes
none in source. package.json export conditions: `types`, `react-native`, `default`. No `.native`/`.web` siblings.

#### Motion
none in source.

#### Dependencies
- `../../shell/UnitInput.tsx`, `../../Select.tsx`, `../../Button.tsx`, `../../feedback/ErrorMessage.tsx`, `../../gestures/editor-interaction-scope.ts`, `./useScopedControl.ts` (which uses `../../shell/useOwnedAction.ts`).
- External: `react`, `react-native`, `zustand`, `zustand/vanilla` (optional peer).

#### Example
```tsx example=PropertyInspector
import {PropertyInspector,type InspectorProperty} from "@nyc-tron/ui/components/forge/inputs/PropertyInspector";
const fields:readonly InspectorProperty[]=[
  {id:"w",label:"Width",kind:"number",value:100,min:0,max:1000,step:1,unit:"px"},
  {id:"blend",label:"Blend",kind:"choice",value:"normal",choices:[{id:"normal",label:"Normal"},{id:"multiply",label:"Multiply"}]},
  {id:"vis",label:"Visible",kind:"boolean",value:true},
  {id:"name",label:"Name",kind:"text",value:"Layer 1",maxLength:64},
];
export const Example = () => <PropertyInspector label="Layer properties" scope="layer-1" fields={fields} onCommit={async(_id,_value,_signal)=>{}}/>;
```

#### UNVERIFIED
- UNVERIFIED: how `Select` renders its options and disabled option; `Select.tsx` was not read.
- UNVERIFIED: abort-signal and pending semantics of `useOwnedAction` and `useScopedControl` beyond what the call sites show.
- UNVERIFIED: that `Button`'s `accessibilityState={{checked}}` is announced as a toggle.

UNVERIFIED count: 3

### office-controls

`import {ToolButton} from "@nyc-tron/ui/components/forge/office/office-controls"`
Source: `packages/ui/src/components/forge/office/office-controls.tsx`. Tier-1 reason: R4 imported by 12 files. Import count: 12.
Exports (11): components `ToolButton`, `PlayGlyph`, `PauseGlyph`, `SkipGlyph`, `PlusGlyph`, `ChevronGlyph`, `CloseMark`; constant `OFFICE_TOUCH_TARGET` (44); function `officeKey`; types `ToolButtonProps`, `OfficeKeyEvent`. Each component is documented below.

#### Props
**ToolButton.** `ToolButtonProps` extends `Omit<PressableProps,"children"|"disabled">`. Rest spread goes to `Pressable`. `accessibilityLabel` reads `rest.accessibilityLabel ?? label`; `accessibilityState` merges `rest.accessibilityState` with `disabled` and, when toggling, `checked`; `style` is appended after the component's own style array.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| label | `string` | none | yes | Spoken name; shown unless `children` is given. |
| children | `ReactNode` | none | no | Visible face; replaces the label text. |
| checked | `boolean \| "mixed"` | none | no | `undefined` is a plain button. |
| disabled | `boolean` | `false` | no | |
| iconOnly | `boolean` | `false` | no | Hides the label text; removes horizontal padding. |
| quiet | `boolean` | `false` | no | No outline while off. |
| styled | `boolean` | `true` | no | Class strings off when false. |
| className | `string` | none | no | |

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

#### Variants
- `ToolButton` `checked`: `true` gives `border-accent bg-accent/10`; `"mixed"` gives `border-accent` with no fill; with `quiet` and not checked, `border-transparent`; otherwise `border-border`.
- `ToolButton` role: `accessibilityRole` is `"button"` when `checked` is undefined and `"togglebutton"` otherwise.
- Glyph shape props listed above (`flip`, `back`, `double`, `open`).

#### States
- ToolButton on: `checked===true`; mixed: `checked==="mixed"`; both set `accessibilityState.checked`; web also sets `role="button"` and `aria-pressed`.
- disabled: `disabled` prop sets `Pressable disabled`, `accessibilityState.disabled` and opacity 0.45.
- focus: `focus-visible:ring-2 focus-visible:ring-focus` (when `styled`).
- hover and pressed: no code.
- Glyphs have no states.

#### Tokens
- Colour classes: `color.text` 5, `color.accent` 3, `color.textMuted` 2, `color.focus` 1, `color.border` 1. Radius class: `radius.control` 1.
- Literals: `gap: 6` to `space.1.5` (1), `gap: 1` to `space.0.25` (1), `borderRadius: 1` to `radius.1` (7), `borderRightWidth: 1.5` and `borderBottomWidth: 1.5` to `border.1_5` (1 each), `opacity 0.45` to `opacity.0_45` (1).
- no token: the `OFFICE_TOUCH_TARGET` 44 minimum width and height, `paddingHorizontal: 10`, glyph sizes and bar widths.
- Tailwind default classes (no token): `rounded-control` 1, `border` 8, `text-sm` 1. The glyphs use `bg-text`, `bg-text-muted` and `border-text-muted` strings.

#### Platform notes
- `Platform.OS==="web"` with `checked` defined: `ToolButton` adds `role:"button"` and `aria-pressed` (comment: web has no togglebutton role). Native uses the `togglebutton` accessibility role.
- `PlayGlyph` uses `transformOrigin:"left"` in a style object; support by host is not stated in the file.
- package.json export conditions: `types`, `react-native`, `default`. No `.native`/`.web` siblings.

#### Motion
none in source.

#### Dependencies
- `../../styles.ts` (`joinClasses`). `SkipGlyph` uses `PlayGlyph` from the same file.
- External: `react` (type `ReactNode`), `react-native` (`Platform`, `Pressable`, `Text`, `View`). No optional peer.

#### Example
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

#### UNVERIFIED
- UNVERIFIED: how screen readers announce `togglebutton` with `checked` of true, false and `"mixed"` on each platform.
- UNVERIFIED: that `transformOrigin` and the half-clipped triangle in `PlayGlyph` draw the same shape on every host.
- UNVERIFIED: key values `officeKey` receives from native key events; only the two lookup paths are in source.

UNVERIFIED count: 3

### PanResponderDrag
`import { ... } from "@nyc-tron/ui/components/gestures/PanResponderDrag"`
Source: `packages/ui/src/components/gestures/PanResponderDrag.tsx (+ gestures/drag-transport.ts, gestures/pan-responder-config.ts)`
Tier-1 reason: R4 imported by 13 files
Import count: 13

#### Props
`PanResponderDrag(props: DragTransportProps)`. `DragTransportProps` is defined in `gestures/drag-transport.ts`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| children | ReactElement | none | yes | One host view; the responder's `panHandlers` are merged into it with `cloneElement`. |
| disabled | boolean | none | no | When truthy, `onStartShouldSetPanResponder` returns false. |
| onBegin | (point: DragPoint) => void | none | yes | On grant. |
| onMove | (point: DragPoint, touches: number) => void | none | yes | `touches` is `numberActiveTouches`. |
| onRelease | (point: DragPoint) => void | none | yes | |
| onCancel | () => void | none | yes | On termination, or when a start event has other than one touch. |

`DragPoint`: `x: number`, `y: number`, taken from `nativeEvent.pageX` and `pageY`.

#### Variants
none

#### States
- disabled: `disabled` stops a drag from starting (it is read at event time through a `latest` ref).
- single touch required: a drag starts only when `touches.length === 1`; a start event with a different count calls `onCancel`.
- granted drag: `onPanResponderTerminationRequest` always returns false, so a parent responder cannot take it.

No visual states; the component renders only its child.

#### Tokens
`node tokenuse.mjs` output: none.

#### Platform notes
none in source. The doc comment says it works on web and native without an extra dependency and that apps already mounting `GestureHandlerRootView` should prefer `GestureHandlerDrag`.

#### Motion
none in source

#### Dependencies
- `react`: `cloneElement`, `useMemo`, `useRef`.
- `react-native`: `PanResponder`.
- `./drag-transport.ts` (types), `./pan-responder-config.ts` (`panResponderDragConfig`).
- Alternative transport named in the comment: `GestureHandlerDrag` (uses `react-native-gesture-handler`, an optional peer); not imported here.

#### UNVERIFIED
- UNVERIFIED: how React Native Web and each native platform deliver `pageX` and `pageY` and `numberActiveTouches`; no runtime was run.
- UNVERIFIED: whether `cloneElement` with `panHandlers` replaces responder handlers already set on the child; React's merge rule is not source in this repo.

#### Example
```tsx example=PanResponderDrag
import { View } from "react-native";
import { PanResponderDrag } from "@nyc-tron/ui/components/gestures/PanResponderDrag";

export const Example = () => (
  <PanResponderDrag
    onBegin={point => console.log("begin", point.x, point.y)}
    onMove={(point, touches) => console.log(point.x, point.y, touches)}
    onRelease={point => console.log("release", point.x, point.y)}
    onCancel={() => console.log("cancel")}>
    <View style={{ width: 48, height: 48 }} />
  </PanResponderDrag>
);
```

UNVERIFIED count: 2

### IconButton

`import {IconButton} from "@nyc-tron/ui/components/IconButton"`

Source: packages/ui/src/components/IconButton.tsx (helper: styles.ts). Tier-1 reason: R2 core family (components/). Import count: 1.

#### Props

Extends `Omit<PressableProps,"children"|"disabled"|"style">`. Read specially: `onPress`, `accessibilityState` (merged; `disabled` overwritten, `selected` added when `selected` is defined). `style` is redeclared as `PressableProps["style"]`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| icon | `ReactNode` | none | yes | Wrapped in a View with `aria-hidden`. |
| aria-label | `string` | none | yes | Sets both `aria-label` and `accessibilityLabel`. |
| accessibilityHint | `string` | none | no |  |
| variant | `IconButtonVariant` | `"ghost"` | no |  |
| size | `"sm"|"md"` | `"md"` | no | `sm` is `h-11 w-11` (44), `md` is `h-12 w-12` (48). |
| disabled | `boolean` | `false` | no | Adds `opacity-50`. |
| targetSize | `number` | none | no | Throws RangeError unless finite and at least 44. Sets minWidth and minHeight. |
| selected | `boolean` | none | no | Toggle state. Undefined means not a toggle. |
| cornerRadius | `number` | none | no | Inline `borderRadius`. |
| className | `string` | none | no |  |
| style | `PressableProps["style"]` | none | no | Function or value; merged after the built-in min size and radius. |
| unstyled | `boolean` | `false` | no |  |

#### Variants

`variant` (`IconButtonVariant`):
- `primary`: `bg-primary border-border`.
- `secondary`: `bg-surface-raised border-border`.
- `outline`: `bg-transparent border-border`.
- `ghost`: `bg-transparent border-transparent hover:bg-surface-sunken`.
- `danger`: `bg-danger border-danger`.

`size`: `sm` gives `h-11 w-11` and min 44; `md` gives `h-12 w-12` and min 48.

#### States

- pressed: `active:opacity-80` class.
- hover: `hover:bg-surface-sunken` on the `ghost` variant only.
- focus: `focus-visible:ring-2 focus-visible:ring-focus`.
- disabled: `disabled` prop; `accessibilityState.disabled`, `opacity-50`.
- selected: `selected` prop; `accessibilityState.selected`, and on web `aria-pressed`. On non-primary, non-danger variants it swaps the variant class for `bg-primary/10 border-border forced-colors:border-[Highlight]`.

#### Tokens

- `color.primary`: `bg-primary` x1 and `bg-primary/10` x1
- `color.border`: x4
- `color.surfaceRaised` x1, `color.surfaceSunken` x1, `color.danger` x2, `color.focus` x1
- `radius.control`: x1
- Inline `minWidth/minHeight` 44 and 48: no token (tokenuse reports none for this file).

Tailwind default classes (no token): `border` x12, `h-11`, `w-11`, `h-12`, `w-12`, `opacity-80`, `opacity-50`.

#### Platform notes

- `Platform.OS==="web"` adds `aria-pressed` when `selected` is defined.

#### Motion

`active:opacity-80`, `motion-reduce:transition-none`. No Animated calls.

#### Dependencies

- `joinClasses` from `./styles.ts`.
- react-native (peer, required): Platform, Pressable, View.
- No optional peers.

#### Example

```tsx example=IconButton
import { useState } from "react";
import { Text } from "react-native";
import { IconButton } from "@nyc-tron/ui/components/IconButton";

export function PinToggle() {
  const [pinned, setPinned] = useState(false);
  return (
    <IconButton
      aria-label="Pin pane"
      icon={<Text>P</Text>}
      variant="ghost"
      size="sm"
      selected={pinned}
      onPress={() => setPinned(!pinned)}
    />
  );
}
```

#### UNVERIFIED

- UNVERIFIED: Screen reader output when both `aria-label` and `accessibilityLabel` are set: depends on the host's RN version and platform, not on code in this file.

UNVERIFIED count: 1

### AdaptiveColumns
`import { ... } from "@nyc-tron/ui/components/layout/AdaptiveColumns"`
Source: `packages/ui/src/components/layout/AdaptiveColumns.tsx`
Tier-1 reason: R2 core family (layout)
Import count: 0

#### Props
`AdaptiveColumns` is `Object.assign(AdaptiveColumnsRoot, { Item: AdaptiveColumn })`. Named exports are `AdaptiveColumns` and `AdaptiveColumn`.

`AdaptiveColumnsProps extends ViewProps`. Read: `gap`, `children`, `style`; the rest is forwarded.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| gap | number | none | yes | Logical units between columns and wrapped rows. Throws `RangeError` unless finite and 0 or more. |
| className | string | none | no | Forwarded through `...rest`. |
| style | StyleProp<ViewStyle> | none | no | Placed after the built-in style. |

`AdaptiveColumnProps extends ViewProps` (also `AdaptiveColumns.Item`). Read: `minWidth`, `grow`, `children`, `style`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| minWidth | number | none | yes | Becomes `flexBasis`. Throws `RangeError` unless finite and above 0. |
| grow | number | 1 | no | Becomes `flexGrow`. Throws `RangeError` unless finite and 0 or more. |
| className | string | none | no | Forwarded through `...rest`. |
| style | StyleProp<ViewStyle> | none | no | Placed after the built-in style. |

#### Variants
none

#### States
None. The only conditional behaviour is the `RangeError` thrown for invalid `gap`, `minWidth` or `grow`.

#### Tokens
`node tokenuse.mjs` output:
- `minWidth: 0`: no token (x2).

Tailwind default classes (no token): none.

#### Platform notes
none in source

#### Motion
none in source

#### Dependencies
- `react-native`: `View`, `ViewProps`. No other imports.
- The doc comment names `AdaptivePaneHost` as the owner of hardware separation; it is not imported.

#### UNVERIFIED
- UNVERIFIED: the actual wrap points at a given container width; they come from the layout engine, which was not run.

#### Example
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

UNVERIFIED count: 1

### ContentFrame
`import { ... } from "@nyc-tron/ui/components/layout/ContentFrame"`
Source: `packages/ui/src/components/layout/ContentFrame.tsx`
Tier-1 reason: R2 core family (layout)
Import count: 0

#### Props
`ContentFrameProps extends ViewProps`. The component reads `maxWidth`, `align`, `children` and `style`; every other `ViewProps` field is forwarded to the `View`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| maxWidth | number | none | yes | Logical units. Throws `RangeError` unless finite and greater than 0. |
| align | "start" \| "center" \| "end" | "center" | no | Sets `marginStart` and `marginEnd` (see Variants). |
| className | string | none | no | Declared on the interface, not destructured, so it travels in `...rest` to the `View`. |
| style | StyleProp<ViewStyle> | none | no | Placed after the built-in style, so it wins. |
| children | ReactNode | none | no | Rendered inside the `View`. |

#### Variants
- `align="start"`: `marginStart: 0`, `marginEnd: "auto"`.
- `align="center"`: both margins `"auto"`.
- `align="end"`: `marginStart: "auto"`, `marginEnd: 0`.

Fixed style for every variant: `width: "100%"`, `minWidth: 0`, `maxWidth`, `flexShrink: 1`.

#### States
None. The component has no interactive or conditional state. An invalid `maxWidth` throws during render.

#### Tokens
`node tokenuse.mjs` output:
- `minWidth: 0`: no token (x1).

Tailwind default classes (no token): none.

#### Platform notes
none in source

#### Motion
none in source

#### Dependencies
- `react-native`: `View`, `ViewProps`. No other imports.

#### UNVERIFIED
- UNVERIFIED: how `marginStart: "auto"` and `marginEnd: "auto"` resolve in the Yoga and React Native Web layout engines; no runtime was run.

#### Example
```tsx example=ContentFrame
import { Text } from "react-native";
import { ContentFrame } from "@nyc-tron/ui/components/layout/ContentFrame";

export const Example = () => (
  <ContentFrame maxWidth={720} align="start" testID="reading-frame">
    <Text>Body text stays within 720 logical units.</Text>
  </ContentFrame>
);
```

UNVERIFIED count: 1

### List

`import {List, ListItem} from "@nyc-tron/ui/components/List"`

Source: packages/ui/src/components/List.tsx (helper: styles.ts). Tier-1 reason: R2 core family (components/). Import count: 0.

#### Props

`ListProps` extends `Omit<ViewProps,"children"|"role">`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| children | `ReactNode` | none | no | Only valid elements are kept; each is wrapped in a `role="listitem"` View. |
| aria-label | `string` | none | no |  |
| className | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |

`ListItemProps` extends `Omit<ViewProps,"children"|"role">`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| children | `ReactNode` | none | no | A string or number renders as the title Text. |
| supportingText | `string` | none | no |  |
| leading | `ReactNode` | none | no |  |
| trailing | `ReactNode` | none | no |  |
| onPress | `()=>void` | none | no | Renders a Pressable (accessibilityRole button) instead of a View. |
| selected | `boolean` | none | no | Adds `bg-primary/10`; sets `accessibilityState.selected`. |
| disabled | `boolean` | `false` | no | Only applied in the Pressable branch. |
| accessibilityHint | `string` | none | no | Pressable branch only. |
| className | `string` | none | no |  |
| titleClassName | `string` | none | no |  |
| supportingClassName | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |

#### Variants

none.

#### States

- default: row classes.
- pressed: `active:opacity-80` (Pressable branch).
- hover: `hover:bg-surface-sunken` when pressable and not selected.
- focus: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus`.
- disabled: `disabled` prop, `opacity-50`, `accessibilityState.disabled`.
- selected: `selected` prop; `bg-primary/10`, forced-colors border, `accessibilityState.selected`, on web `aria-current="true"` in the Pressable branch.

#### Tokens

- `color.border` x2, `color.surfaceRaised` x1, `color.text` x1, `color.textMuted` x1, `color.primary` x1 (`bg-primary/10`), `color.focus` x1, `color.surfaceSunken` x1
- `radius.control` x1

Tailwind default classes (no token): `min-w-0` x2, `rounded-control`, `border` x7, `text-base`, `gap-0` (from `gap-0.5`), `text-sm`, `gap-1`, `min-h-11`, `gap-3`, `px-3`, `py-2`, `border-2`, `opacity-80`, `opacity-50`.

#### Platform notes

- `Platform.OS==="web"` adds `aria-current` on a selected pressable row.

#### Motion

`active:opacity-80`, `motion-reduce:transition-none`. No Animated calls.

#### Dependencies

- `joinClasses` from `./styles.ts`.
- react-native (peer, required): Children use via react, Platform, Pressable, Text, View.
- No optional peers.

#### Example

```tsx example=List
import { Text } from "react-native";
import { List, ListItem } from "@nyc-tron/ui/components/List";

export function SettingsList({ onOpen }: { onOpen: () => void }) {
  return (
    <List aria-label="Settings">
      <ListItem supportingText="Light, dark or system" leading={<Text>A</Text>} onPress={onOpen} selected>
        Appearance
      </ListItem>
      <ListItem trailing={<Text>On</Text>}>Notifications</ListItem>
    </List>
  );
}
```

#### UNVERIFIED

- UNVERIFIED: Spoken name of a pressable row whose `children` is not a string or number: `accessibilityLabel` is then undefined and the result depends on the host reading child text.

UNVERIFIED count: 1

### CollapsibleDrawer
`import { ... } from "@nyc-tron/ui/components/navigation/CollapsibleDrawer"`
Source: `packages/ui/src/components/navigation/CollapsibleDrawer.tsx (+ navigation/drawer-model.ts)`
Tier-1 reason: R2 core family (navigation)
Import count: 0

#### Props
`CollapsibleDrawerProps extends Omit<ViewProps,"children">`. Read: `style` (placed after `{flex:1, direction:"ltr", position:"relative"}`); the rest is forwarded to the root `View`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| children | ReactNode | none | yes | Screen content, inset by `contentInsetLeft`. |
| mode | DrawerMode ("expanded" \| "compact" \| "minimal") | none | yes | |
| open | boolean | none | yes | Controlled. |
| onOpenChange | (open: boolean) => void | none | yes | |
| items | readonly DrawerDestination[] | none | yes | |
| footerItems | readonly DrawerDestination[] | [] | no | |
| selectedId | string \| null | none | yes | |
| onSelectionChange | (id: string) => void | none | yes | Not called for disabled items. |
| title | string | none | no | Shown only when labels are shown. |
| expandedWidth | number | 280 (in `drawerGeometry`) | no | Throws `RangeError` unless finite and at least 180. |
| compactWidth | number | 64 (in `drawerGeometry`) | no | Throws `RangeError` unless finite, at least 44 and below `expandedWidth`. |
| className | string | none | no | Root. |
| paneClassName | string | none | no | |
| itemClassName | string | none | no | Also applied to the toggle. |
| selectedItemClassName | string | none | no | |
| contentClassName | string | none | no | |
| unstyled | boolean | false | no | |

`DrawerDestination`: `id: string`, `label: string`, `icon?: ReactNode`, `disabled?: boolean` (all readonly). Without `icon` the first letter of `label`, uppercased, is shown.

#### Variants
`mode` through `drawerGeometry`:
- `expanded`: pane width `expandedWidth`, labels shown, no overlay, no scrim, content inset `expandedWidth`.
- `compact`: content inset `compactWidth`; pane is `compactWidth` closed, `expandedWidth` open; labels, overlay and scrim only when open.
- `minimal`: content inset 0; pane hidden when closed, `expandedWidth` when open; labels, overlay and scrim only when open. A floating toggle shows while closed.
- The toggle button is not drawn in `expanded`.

#### States
- open overlay (`compact` or `minimal` with `open`): scrim `Pressable` labelled "Close navigation menu"; pane has `accessibilityViewIsModal`; content gets `accessibilityElementsHidden` and `importantForAccessibility="no-hide-descendants"`; Android back closes it; choosing an item closes it.
- hidden pane: `pointerEvents="none"`, `display: "none"`, hidden from accessibility.
- selected item: `accessibilityState.selected`; `bg-primary` and `text-on-primary` (styled), plus `selectedItemClassName`.
- disabled item: `disabled`, `accessibilityState.disabled`, `opacity-40`.
- toggle: label "Close navigation" or "Open navigation", `accessibilityState.expanded` equals the overlay flag.

No hover, focus, loading or error code.

#### Tokens
`node tokenuse.mjs` output:
- `space.1` from `gap: 4` (x1), `space.1.5` from `paddingHorizontal: 6` (x2), `space.2` from `paddingVertical: 8` (x2)
- `<Component>.font.22` from `fontSize: 22` (x1; component-scoped pattern)
- `color.primary` (x1), `color.onPrimary` (x1), `color.text` (x1), `color.surfaceRaised` (x1), `color.border` (x1)
- `radius.control` (x1; the file has two `rounded-control` uses)
- `minWidth: 0`, `minHeight: 56`: no token

Tailwind default classes (no token): `h-12`, `w-12`, `rounded-control` (x2), `min-h-11`, `gap-3`, `px-3`, `opacity-40`, `text-sm`, `border` (x3), `border-r`, `flex-row`, `flex-col`, `items-center`, `justify-center`. Unmapped literals: `rgba(0,0,0,0.25)` scrim, `width: 36`, `zIndex` 2 and 3.

#### Platform notes
- `BackHandler` `hardwareBackPress` listener while the overlay is open (RN `BackHandler`; behaviour is Android's hardware back).
- Root style `direction: "ltr"` keeps the pane on the physical left in RTL languages (code comment).
- `drawer-model.ts` and the doc comment call it a Windows-compatible fallback that is not WinUI `NavigationView`. No `Platform.OS` checks.

#### Motion
none in source. Pane width and display switch without animation.

#### Dependencies
- `react-native`: `BackHandler`, `Pressable`, `ScrollView`, `Text`, `View`, `ViewProps`.
- `./drawer-model.ts`: `drawerGeometry`, `DrawerMode`. `../styles.ts`: `joinClasses`.

#### UNVERIFIED
- UNVERIFIED: screen reader output for the modal pane, hidden content and toggle; no assistive technology was run.

#### Example
```tsx example=CollapsibleDrawer
import { useState } from "react";
import { Text } from "react-native";
import { CollapsibleDrawer } from "@nyc-tron/ui/components/navigation/CollapsibleDrawer";

export const Example = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>("home");
  return (
    <CollapsibleDrawer mode="compact" open={open} onOpenChange={setOpen}
      title="Studio" selectedId={selected} onSelectionChange={setSelected}
      items={[{ id: "home", label: "Home" }, { id: "files", label: "Files" }]}
      footerItems={[{ id: "settings", label: "Settings", disabled: false }]}>
      <Text>Screen for {selected}</Text>
    </CollapsibleDrawer>
  );
};
```

UNVERIFIED count: 1

### NavigationRail

`import {NavigationRail, NavigationShell} from "@nyc-tron/ui/components/NavigationRail"`

Source: packages/ui/src/components/NavigationRail.tsx (helper: styles.ts). Tier-1 reason: R1 root barrel export; R2 core family (components/). One subpath exports `NavigationRail`, `NavigationShell` and the types `NavigationItem`, `NavigationRailProps`, `NavigationShellProps`. Import count: 1.

#### Props

`NavigationRailProps` extends `Omit<ViewProps,"children">`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| items | `readonly NavigationItem[]` | none | yes | Expanded below. |
| selectedId | `string|null` | none | yes |  |
| onSelectionChange | `(id:string)=>void` | none | yes | Called on every press, including the selected item. |
| collapsed | `boolean` | `false` | no | Hides labels only; rail width `w-16` instead of `w-52`. |
| edge | `"left"|"right"` | none | yes | Chooses `border-l` (right) or `border-r` (left). |
| className | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |
| itemClassName | `string` | none | no |  |
| selectedItemClassName | `string` | none | no | Added when selected. |
| labelClassName | `string` | none | no |  |

`NavigationItem` (readonly fields):

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| id | `string` | none | yes |  |
| label | `string` | none | yes | Also item `accessibilityLabel`. |
| icon | `ReactNode` | none | no | Hidden from accessibility. |
| disabled | `boolean` | none | no |  |

`NavigationShellProps` extends `Omit<ViewProps,"children">`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| children | `ReactNode` | none | yes | Content pane. |
| rail | `ReactNode` | none | yes | Rendered on the `edge` side. |
| edge | `"left"|"right"` | none | yes |  |
| className | `string` | none | no |  |
| contentClassName | `string` | none | no |  |
| isRTL | `boolean` | `false` | no | Sets the content View's `direction` to rtl or ltr. |

#### Variants

none.

#### States

- selected: `id===selectedId`; `bg-primary`, `text-on-primary`, `accessibilityState.selected`.
- unselected: `bg-transparent`, `text-text`.
- disabled: `item.disabled`; `opacity-40`, `accessibilityState.disabled`.
- collapsed: `collapsed` prop.
- focus: `focus-visible:ring-2 focus-visible:ring-focus`.
- hover, pressed: no code.

#### Tokens

- `color.surfaceRaised` x1, `color.border` x2, `color.focus` x1, `color.primary` x1, `color.onPrimary` x1, `color.text` x1
- `radius.control` x1

Tailwind default classes (no token): `gap-1`, `w-16`, `w-52`, `py-3`, `border` x6, `min-h-11`, `gap-2`, `rounded-control`, `px-3`, `opacity-40`, `text-sm`.

#### Platform notes

none in source. `NavigationShell` pins the outer row to `direction:"ltr"` so RTL does not mirror the rail edge.

#### Motion

none in source.

#### Dependencies

- `joinClasses` from `./styles.ts`.
- react-native (peer, required): Pressable, Text, View.
- No optional peers.

#### Example

```tsx example=NavigationRail
import { useState } from "react";
import { Text } from "react-native";
import { NavigationRail, NavigationShell } from "@nyc-tron/ui/components/NavigationRail";

export function AppShell() {
  const [id, setId] = useState<string | null>("home");
  return (
    <NavigationShell
      edge="left"
      rail={
        <NavigationRail
          edge="left"
          selectedId={id}
          onSelectionChange={setId}
          collapsed={false}
          items={[
            { id: "home", label: "Home", icon: <Text>H</Text> },
            { id: "files", label: "Files", disabled: true },
          ]}
        />
      }
    >
      <Text>Content</Text>
    </NavigationShell>
  );
}
```

#### UNVERIFIED

- UNVERIFIED: The rail uses `accessibilityRole="tablist"` and `"tab"`, which is a selection pattern. How each platform's screen reader exposes tabs here is not provable from source.
- UNVERIFIED: No keyboard arrow handling exists in this file; keyboard behaviour rests on the host's focus handling for Pressable.

UNVERIFIED count: 2

### AnchoredPopover
`import { ... } from "@nyc-tron/ui/components/overlays/AnchoredPopover"`
Source: `packages/ui/src/components/overlays/AnchoredPopover.tsx (+ overlays/anchored-popover-types.ts)`
Tier-1 reason: R2 core family (overlays)
Import count: 4

#### Props
`PopoverProps = PopoverAnchorProps | PopoverTriggerProps`. Exactly one of `anchor` and `trigger` must be set; `isTriggerPopover` throws `TypeError` for both or neither.

Shared (`PopoverBaseProps`, all readonly):

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | string | "popover" | no | Identity token; a change discards the committed state. |
| open | boolean | none | yes | Controlled. |
| onOpenChange | (open: boolean) => void | none | yes | Called with `false` on Escape, backdrop press and Android back; `toggle` calls it with `!open`. |
| accessibilityLabel | string | none | yes | Used as `aria-label` of the dialog. |
| children | ReactNode | none | yes | |
| width | number | 320 | no | Preferred; clamped by `placePopover`. |
| maxHeight | number | 420 | no | Preferred; clamped. |
| className | string | none | no | Joined onto the surface classes. |
| testID | string | none | no | On the surface. |

Rect form adds `anchor: Rect2D` (required) and `usableRegions: readonly Rect2D[]` (required). Trigger form adds `trigger: ReactNode | ((state: PopoverTriggerState) => ReactNode)` (required) and `usableRegions?` (default: the whole window as one region from `windowRegions`).

`Rect2D` (core overlays): `x`, `y`, `width`, `height`, all number. `PopoverTriggerState`: `open: boolean`, `toggle: () => void`, `triggerProps: { accessibilityState: { expanded }, "aria-expanded", "aria-haspopup": "dialog" }`.

#### Variants
- Rect form: draws from the given `anchor` and `usableRegions`.
- Trigger form: renders `trigger` in a `collapsable={false}` `View`, measures it on open through `useTriggerAnchor`, and keeps the surface mounted after the first measurement so closing can restore focus.

#### States
- open: `Modal visible={open}`. In the trigger form `visible` is `open && measured`.
- no usable region: `hasUsableRegion` false gives no position and the component renders `null`.
- trigger expanded: `triggerProps` carry `accessibilityState.expanded`, `aria-expanded` and `aria-haspopup="dialog"`.
- guarded callbacks: `close` runs only while open, with the committed token matching, and with a usable region.

No hover, disabled, loading or error styling.

#### Tokens
`node tokenuse.mjs` output:
- `color.surfaceRaised` via `bg-surface-raised` (x1), `color.border` via `border-border` (x1), `radius.control` via `rounded-control` (x1)

Tailwind default classes (no token): `border` (x3, includes the `border-border` prefix match), `rounded-control`. Unmapped literals: `position:"absolute"` offsets, `overflow:"hidden"`.

#### Platform notes
- `Platform.OS !== "web"` returns early from the Tab handler: only web gets Tab and Shift+Tab cycling through `querySelectorAll` of tabbable elements. The comment says native hosts own their Tab chain.
- The type docs say `className` is web only.
- The doc comment names `@nyc-tron/expo-controls/NativePopover` as the SwiftUI and Compose variant for iOS and Android; it is not imported.
- `Modal animationType="none"` always, per the comment about the web focus trap while fading.

#### Motion
none in source (`animationType="none"`).

#### Dependencies
- `react-native`: `Modal`, `Platform`, `Pressable`, `View`, `useWindowDimensions`.
- `./popover-position.ts` (re-exports `placePopover`, `hasUsableRegion`, `Rect2D` from `@nyc-tron/core/overlays`), `./focus-cycle.ts` (`cycleFocusIndex`), `./focus-restore.ts` (`useRestoreFocus`), `./useTriggerAnchor.ts`, `./measure-anchor.ts` (`windowRegions`), `./anchored-popover-types.ts`, `../styles.ts` (`joinClasses`).
- No optional peers imported directly.

#### UNVERIFIED
- UNVERIFIED: where `placePopover` puts the surface for a given anchor and regions; its body in `@nyc-tron/core/overlays` was not read.
- UNVERIFIED: focus return to the opener (`useRestoreFocus`) and anchor measurement (`useTriggerAnchor`); those files were not read.

#### Example
```tsx example=AnchoredPopover
import { useState } from "react";
import { Pressable, Text } from "react-native";
import { AnchoredPopover } from "@nyc-tron/ui/components/overlays/AnchoredPopover";

export const Example = () => {
  const [open, setOpen] = useState(false);
  return (
    <AnchoredPopover open={open} onOpenChange={setOpen} accessibilityLabel="Filter options"
      width={280}
      trigger={({ toggle, triggerProps }) => (
        <Pressable {...triggerProps} accessibilityRole="button" onPress={toggle}>
          <Text>Filters</Text>
        </Pressable>
      )}>
      <Text>Popover content</Text>
    </AnchoredPopover>
  );
};
```

UNVERIFIED count: 2

### CommandPalette
`import { ... } from "@nyc-tron/ui/components/overlays/CommandPalette"`
Source: `packages/ui/src/components/overlays/CommandPalette.tsx (+ overlays/command-filter.ts)`
Tier-1 reason: R2 core family (overlays)
Import count: 0

#### Props
`CommandPaletteProps` (own interface, no `extends`).

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | string | "command-palette" | no | Part of the reset boundary. |
| revision | string \| number | 0 | no | Part of the reset boundary. |
| open | boolean | none | yes | Controlled. |
| onOpenChange | (open: boolean) => void | none | yes | |
| onSelect | (id: string) => void | none | yes | Called after `onOpenChange(false)`. |
| commands | readonly PaletteCommand[] | none | yes | Validated each render; throws on bad input. |
| anchor | Rect2D | none | yes | |
| usableRegions | readonly Rect2D[] | none | yes | |
| label | string | "Command palette" | no | Dialog name and visible search label. |
| placeholder | string | "Type a command" | no | |
| emptyText | string | "No matching commands" | no | |
| width | number | 420 | no | |
| maxHeight | number | 440 | no | Capped by `56 x max(1, results) + 96`. |
| className | string | none | no | |
| unstyled | boolean | false | no | |
| testID | string | none | no | Also seeds the result list id (`<testID>-results`; default `command-palette-results`). |

`PaletteCommand` = `CommandMenuItem` (core: `id: string`, `label: string`, `description?: string`, `disabled?: boolean`, `danger?: boolean`) plus `keywords?: readonly string[]` and `group?: string`.

`validateCommands` throws for more than 1000 commands, an id that is not a string, over 256 chars, fails `/^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/` or repeats, an empty or over-512-char label, more than 256 keywords, and a non-boolean `disabled`.

#### Variants
none. `unstyled` is the only switch (drops the `rounded-control border border-border bg-surface-raised p-2 gap-2` surface, the scrim colour and row highlight classes).

#### States
- empty search results: a `Text` with `role="status"` and `accessibilityLiveRegion="polite"` shows `emptyText`.
- active result: `aria-selected` and `accessibilityState.selected`; `bg-primary/10` (styled). Arrow keys (via `nextActiveCommand`) and pointer hover set it.
- disabled command: `disabled`, `aria-disabled`, `accessibilityState.disabled`, `opacity: 0.4`, skipped by Tab.
- danger command: `text-danger` (styled).
- focus: rows get `focus-visible:bg-primary/10` when not active (styled).
- closed or no usable region: no position gives `null`.
- Every opening resets the query and active id (reset boundary is `[scope, revision, open]`).

The search field has `role="combobox"`, `aria-expanded`, `aria-controls` and `aria-activedescendant`; results are `role="listbox"` with `role="option"` rows.

#### Tokens
`node tokenuse.mjs` output:
- `space.3` from `paddingHorizontal: 12` (x2), `space.4` from `paddingVertical: 16` (x1)
- `<Component>.space.1_75` from `paddingVertical: 7` (x1; component-scoped)
- `font.12` from `fontSize: 12` (x1), `opacity.0_4` from `opacity: 0.4` (x1)
- `color.text` (x2), `color.border` (x1), `color.surfaceRaised` (x1), `color.textMuted` (x3), `color.primary` (x2), `color.danger` (x1)
- `radius.control` (x2)

Tailwind default classes (no token): `rounded-control` (x2), `border` (x3), `p-2`, `gap-2`. Unmapped: `ROW_HEIGHT = 56`, `bg-text/30` scrim, `fontWeight: "600"`.

#### Platform notes
- `Modal animationType`: `"none"` when `Platform.OS === "web"`, else `"fade"`.
- `blurOnSubmit: false` is set because, per the comment, RN web reads only that prop.
- The `listbox` role comment says core RN's `Role` union omits it and Android maps it to nothing.

#### Motion
`Modal` fade on non-web platforms; none on web. No Animated or Reanimated.

#### Dependencies
- `react-native`: `Modal`, `Platform`, `Pressable`, `ScrollView`, `Text`, `TextInput`, `View`.
- `../TextField.tsx` (`TextField`), `../styles.ts` (`joinClasses`).
- `./popover-position.ts`, `./focus-cycle.ts` (`cycleFocusTarget`), `./focus-restore.ts`, `./command-filter.ts`.
- `zustand`, `zustand/vanilla`: optional peer.

#### UNVERIFIED
- UNVERIFIED: how `filterCommands` ranks and which fields it matches; only the token ranking helper and validation were read.
- UNVERIFIED: focus return to the opener (`useRestoreFocus` not read) and the combobox pattern's screen reader output.

#### Example
```tsx example=CommandPalette
import { useState } from "react";
import { CommandPalette, type PaletteCommand } from "@nyc-tron/ui/components/overlays/CommandPalette";

const commands: PaletteCommand[] = [
  { id: "file.save", label: "Save file", group: "File", keywords: ["write"] },
  { id: "file.delete", label: "Delete file", group: "File", danger: true },
];

export const Example = () => {
  const [open, setOpen] = useState(true);
  return (
    <CommandPalette open={open} onOpenChange={setOpen} commands={commands}
      onSelect={id => console.log(id)}
      anchor={{ x: 100, y: 80, width: 200, height: 40 }}
      usableRegions={[{ x: 0, y: 0, width: 1024, height: 768 }]} />
  );
};
```

UNVERIFIED count: 2

### CommandPopover
`import { ... } from "@nyc-tron/ui/components/overlays/CommandPopover"`
Source: `packages/ui/src/components/overlays/CommandPopover.tsx`
Tier-1 reason: R2 core family (overlays)
Import count: 6

#### Props
`CommandPopoverProps` (own interface, no `extends`).

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | string | "commands" | no | Part of the open token. |
| visible | boolean | none | yes | |
| onDismiss | () => void | none | yes | Called on dismissal and after a selection. |
| onSelect | (id: string) => void | none | yes | |
| anchor | Rect2D | none | yes | |
| usableRegions | readonly Rect2D[] | none | yes | |
| items | readonly CommandMenuItem[] | none | yes | |
| width | number | 268 | no | |
| maxHeight | number | 420 | no | Capped by `max(56, items x 60 + 16)`. |
| className | string | none | no | |
| unstyled | boolean | false | no | |
| surfaceColor | string | none | no | Background override, applied only when styled. |
| borderColor | string | none | no | Border override (surface and items), styled only. |
| textColor | string | none | no | Label colour, styled only. |
| mutedTextColor | string | none | no | Description colour, styled only. |
| dangerColor | string | none | no | Colour for `danger` items, styled only. |
| accessibilityLabel | string | "Commands" | no | Menu label. |
| testID | string | none | no | Surface id; items get `<testID>-item-<id>`. |

`CommandMenuItem` (from `@nyc-tron/core/overlays`): `id: string`, `label: string`, `description?: string`, `disabled?: boolean`, `danger?: boolean`.

#### Variants
none.

#### States
- disabled item: `disabled`, `accessibilityState.disabled`, `opacity: 0.4`, skipped by keyboard focus.
- danger item: `text-danger` or `dangerColor`.
- focus: `focus-visible:bg-primary/10` (styled).
- once settled: after a dismiss or select the open token is marked settled, so a second call in the same open does nothing.
- no usable region: renders `null`.
- Keyboard (`onKeyDown` on items): Escape dismisses, Enter, Space and Spacebar select, Tab and arrows cycle, Home and End jump; modifier keys are ignored.

#### Tokens
`node tokenuse.mjs` output:
- `space.3` from `paddingHorizontal: 12` (x1), `<Component>.space.1_75` from `paddingVertical: 7` (x1)
- `font.12` (x1), `opacity.0_4` (x1)
- `color.text` (x2), `color.border` (x2), `color.surfaceRaised` (x1), `color.primary` (x1), `color.danger` (x1), `color.textMuted` (x1)
- `radius.control` (x1)
- `minHeight: 56`: no token

Tailwind default classes (no token): `border` (x7), `rounded-control`, `border-b`. Unmapped: `bg-text/25` scrim, `fontWeight: "600"`.

#### Platform notes
- `desktop = Platform.OS === "web" || String(Platform.OS) === "qnx" || String(Platform.OS) === "marathon"`. On desktop the `Modal` uses `animationType="none"` and `onShow` focuses the first enabled item; elsewhere `"fade"`.
- The doc comment says WinUI, AppKit, SwiftUI and Compose menu adapters are separate.

#### Motion
`Modal` fade on non-desktop platforms; none on desktop. No Animated or Reanimated.

#### Dependencies
- `react-native`: `Modal`, `Platform`, `Pressable`, `ScrollView`, `Text`, `View`.
- `./popover-position.ts`, `./focus-cycle.ts` (`cycleFocusTarget`), `./focus-restore.ts` (`useRestoreFocus`), `../styles.ts`.
- `@nyc-tron/core/overlays`: `CommandMenuItem` (type; `@nyc-tron/core` is an optional peer).

#### UNVERIFIED
- UNVERIFIED: placement result of `placePopover` and focus restore on close (`useRestoreFocus`); neither body was read.

#### Example
```tsx example=CommandPopover
import { useState } from "react";
import { CommandPopover } from "@nyc-tron/ui/components/overlays/CommandPopover";

export const Example = () => {
  const [visible, setVisible] = useState(true);
  return (
    <CommandPopover visible={visible} onDismiss={() => setVisible(false)}
      onSelect={id => console.log(id)}
      anchor={{ x: 40, y: 40, width: 120, height: 36 }}
      usableRegions={[{ x: 0, y: 0, width: 800, height: 600 }]}
      items={[
        { id: "rename", label: "Rename", description: "Change the file name" },
        { id: "delete", label: "Delete", danger: true },
      ]} />
  );
};
```

UNVERIFIED count: 1

### SegmentedControl

`import {SegmentedControl} from "@nyc-tron/ui/components/SegmentedControl"`

Source: packages/ui/src/components/SegmentedControl.tsx (helpers: styles.ts, forms/choice-keys.ts). Tier-1 reason: R2 core family (components/); R4 imported by 28 files. Import count: 28.

#### Props

Generic: `SegmentedControl<T extends string=string>`. `SegmentedControlProps<T>` extends `Omit<ViewProps,"children"|"role">`; `style` is merged after `flexDirection:"row",flexWrap:"wrap"`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| options | `readonly SegmentedOption<T>[]` | none | yes | Expanded below. |
| value | `T|""` | none | yes | A value matching no option leaves every segment unchecked. |
| onChange | `(value:T)=>void` | none | yes | Not called when the pressed option is already selected or is disabled. |
| aria-label | `string` | none | no | Names the radiogroup. |
| aria-labelledby | `string` | none | no |  |
| disabled | `boolean` | `false` | no | Disables every segment; sets `aria-disabled` on the group. |
| className | `string` | none | no |  |
| segmentClassName | `string` | none | no |  |
| labelClassName | `string` | none | no |  |
| segmentStyle | `StyleProp<ViewStyle> | (state:{selected,disabled,pressed})=>StyleProp<ViewStyle>` | none | no |  |
| labelStyle | `StyleProp<TextStyle>` | none | no |  |
| unstyled | `boolean` | `false` | no |  |

`SegmentedOption<T>`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| value | `T` | none | yes |  |
| label | `string` | none | yes |  |
| disabled | `boolean` | none | no |  |

#### Variants

none.

#### States

- selected: segment matching `value`; `aria-checked`, `accessibilityState.checked`, `bg-primary`, `text-on-primary`.
- disabled: group `disabled` or option `disabled`; `opacity-50`, `accessibilityState.disabled`, skipped by keys.
- hover: `hover:bg-surface-raised` on unselected segments.
- focus: `focus-visible:ring-2 focus-visible:ring-focus`.
- pressed: only through the `segmentStyle` function state.

#### Tokens

- `color.border` x1, `color.surfaceSunken` x1, `color.focus` x1, `color.primary` x1, `color.surfaceRaised` x1, `color.onPrimary` x1, `color.text` x1
- `radius.control` x2
- `size.touch`: `minHeight: 44` x1, `minWidth: 44` x1

Tailwind default classes (no token): `gap-0` (from `gap-0.5`), `rounded-control` x2, `border` x4, `p-0` (from `p-0.5`), `min-h-11`, `min-w-11`, `px-3`, `py-1` (from `py-1.5`), `border-2`, `opacity-50`, `text-sm`, `font-medium`.

#### Platform notes

- Web only: `onKeyDown` and `tabIndex` are attached when `Platform.OS==="web"`. Checked segment has tabIndex 0, others -1. Arrow keys move and select with wrap, flipped in RTL (`I18nManager.isRTL` or DOM direction), Home/End jump, disabled skipped, modifier keys ignored.
- Native: no key handling in the file.

#### Motion

`motion-reduce:transition-none`. No Animated calls.

#### Dependencies

- `joinClasses` from `./styles.ts`; `domIsRTL`, `isModified`, `nextChoiceIndex`, `rovingStop`, `webKey` from `./forms/choice-keys.ts`.
- react-native (peer, required): I18nManager, Platform, Pressable, Text, View.
- No optional peers.

#### Example

```tsx example=SegmentedControl
import { useState } from "react";
import { SegmentedControl } from "@nyc-tron/ui/components/SegmentedControl";

type View = "list" | "grid";

export function ViewSwitch() {
  const [view, setView] = useState<View>("list");
  return (
    <SegmentedControl<View>
      aria-label="Layout"
      value={view}
      onChange={setView}
      options={[
        { value: "list", label: "List" },
        { value: "grid", label: "Grid", disabled: false },
      ]}
    />
  );
}
```

#### UNVERIFIED

- UNVERIFIED: Native screen reader traversal of `role="radio"` segments: the doc comment claims every segment is reachable; not provable from source.

UNVERIFIED count: 1

### Select

`import {Select, selectOptions} from "@nyc-tron/ui/components/Select"`

Source: packages/ui/src/components/Select.tsx (helpers: styles.ts, forms/choice-keys.ts, forms/option-groups.ts). Tier-1 reason: R2 core family (components/); R4 imported by 58 files. Import count: 58 (4 in other packages).

#### Props

`SelectProps = SelectBaseProps & (SelectOptionsChoice | SelectGroupsChoice)`. `SelectBaseProps` extends `Omit<ViewProps,"children"|"role">`; `testID` is read, rest spread to the root View. Exactly one of `options` or `groups` (passing both makes `selectOptions` throw TypeError).

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| label | `string` | none | yes | Caption and accessible name. |
| value | `string` | none | yes |  |
| onValueChange | `(value:string)=>void` | none | yes | Not called when the picked value equals `value`. |
| disabled | `boolean` | `false` | no |  |
| placeholder | `string` | `"Choose…"` | no | Shown when `value` matches no option. |
| hint | `string` | none | no |  |
| errorText | `string` | none | no | Replaces `hint`. |
| className | `string` | none | no |  |
| labelClassName | `string` | none | no |  |
| triggerClassName | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |
| options | `readonly SelectOption[]` | none | one of options/groups | Flat choice. |
| groups | `readonly SelectGroup[]` | none | one of options/groups | `OptionGroup<SelectOption>` from forms/option-groups.ts: `heading:string` (not blank), `options` (at least one). |

`SelectOption`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| value | `string` | none | yes |  |
| label | `string` | `value` | no | Shown text. |
| disabled | `boolean` | none | no |  |

`selectOptions(props)` returns the flat option list (validates groups, throws on both shapes).

#### Variants

none.

#### States

- closed/open: internal zustand store `{open,active}`; trigger `accessibilityState.expanded`, web `aria-expanded`.
- selected option: `bg-primary`, `text-on-primary font-semibold`, `aria-selected`.
- active (keyboard highlight) option: `bg-surface-sunken`.
- hover: `hover:bg-surface-sunken` on options.
- error: `errorText`; `border-danger`, message Text with `accessibilityRole="alert"`, web `aria-invalid`.
- disabled: select `disabled` or option `disabled`; `opacity-50`.
- focus: `focus-visible:ring-2 focus-visible:ring-focus` on the trigger.

#### Tokens

- `color.primary` x1, `color.surfaceSunken` x3, `color.onPrimary` x1, `color.text` x3, `color.border` x2, `color.surfaceRaised` x1, `color.textMuted` x4, `color.focus` x1, `color.danger` x2
- `radius.control` x2
- Inline `maxHeight: 320`, chevron `translateY` 2/-2, `45deg`/`-135deg`: no token.

Tailwind default classes (no token): `min-h-11`, `px-3` x3, `py-2`, `border-2`, `border` x11, `opacity-50` x2, `text-base` x3, `font-semibold` x3, `rounded-control` x2, `shadow-md`, `text-xs`, `min-w-0` x2, `gap-2` x2, `text-sm` x2, `min-h-12`, `h-2`, `w-2`.

#### Platform notes

- `web` (`Platform.OS==="web"`): select-only combobox ARIA (`aria-haspopup`, `aria-controls`, `aria-activedescendant`, listbox role), list absolutely positioned under the trigger, `onMouseDown` preventDefault on options, keyboard handler.
- `qnx` or `marathon` (`String(Platform.OS)`): keyboard handler and `onBlur` hide are attached, list container gets `accessible`, options get `focusable:false`.
- Other native: list opens in flow under the trigger; no key handling.
- Keys when open: ArrowUp/Down (no wrap), Home/End, typeahead, Enter/Space pick, Escape close, Tab close.

#### Motion

Chevron rotates via inline `transform` based on `open`; no transition or Animated call in source.

#### Dependencies

- `joinClasses`, `isModified`, `nextChoiceIndex`, `typeaheadIndex`, `webKey`, `flattenOptionGroups`, `validateOptionGroups` (same package).
- react-native (peer, required): Platform, Pressable, ScrollView, Text, View.
- `zustand` (`useStore`, `createStore` from `zustand/vanilla`): optional peer in package.json but imported unconditionally by this file.
- `react`: useId, useRef.

#### Example

```tsx example=Select
import { useState } from "react";
import { Select } from "@nyc-tron/ui/components/Select";

export function UnitSelect() {
  const [unit, setUnit] = useState("");
  return (
    <Select
      label="Unit"
      value={unit}
      onValueChange={setUnit}
      placeholder="Choose a unit"
      hint="Applies to new documents."
      groups={[
        { heading: "Metric", options: [{ value: "mm", label: "Millimetres" }, { value: "cm" }] },
        { heading: "Imperial", options: [{ value: "in", label: "Inches" }] },
      ]}
    />
  );
}
```

#### UNVERIFIED

- UNVERIFIED: The listbox is announced on iOS/Android as a plain `list` (the source comment says RN has no listbox role); actual spoken output is not provable here.
- UNVERIFIED: `zustand` is an optional peer yet imported at module top level: whether a missing install fails at import time depends on the consumer's bundler.

UNVERIFIED count: 2

### AdaptiveDock

`import {AdaptiveDock} from "@nyc-tron/ui/components/shell/AdaptiveDock"`

Source: `packages/ui/src/components/shell/AdaptiveDock.tsx` (types and pure helpers from `dock-model.ts`).
Tier-1 reason: R3 shell core. Import count: 1 (other packages: 0).

Also exported from the same specifier: types `DockPanel`, `AdaptiveDockProps`, `DockEdge`, `DockLayout`, `DockStack`, `DockTarget`, `FloatingPanel`. Internal (not exported): `StackView`, `OptionsGlyph`.

#### Props

`AdaptiveDockProps extends Omit<ViewProps,"children">`. Inherited props are not enumerated. `style` is merged after `{flex:1,direction:"ltr"}` and `onLayout` is called after the dock's own measurement; the rest spread onto the root `View`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| editScope | `string` | none | no | Changes cancel panel and divider gestures and remount the body (`key={editScope??"dock"}`). Throws `RangeError` if blank or over 4096 chars. |
| disabled | `boolean` | `false` | no | Blocks every layout change; panel content stays mounted. |
| revision | `string \| number` | `0` | no | Part of the interaction scope. Throws `RangeError` for a non-finite number or a string over 512 chars. |
| panels | `readonly DockPanel[]` | none | yes | At most 256; ids and titles nonblank, ids unique, ids at most 256 chars, titles at most 512. Otherwise `RangeError`. |
| layout | `DockLayout` | none | yes | Controlled. `validateDockLayout` runs on every render and throws on duplicate or unknown panels, empty stacks, bad sizes. |
| onLayoutChange | `(next: DockLayout) => void` | none | yes | Called with a whole new layout for every move, resize, tab switch, float and close. |
| children | `ReactNode` | none | yes | The workspace. Rendered once in a layer over an empty slot so it keeps state across dock changes. |
| workspaceLabel | `string` | `"Workspace"` | no | `accessibilityLabel` of the workspace region. |
| features | `readonly FoldFeature[]` | none | no | Window-space fold features. At most 64. Passed to `PaneSplitter` and used to derive usable regions. |
| usableRegions | `readonly Rect2D[]` | none | no | Dock-local regions floating panels stay inside. At most 256. Without it: regions derived from `features` via `resolveUsableRegions`, else the whole dock rectangle. |
| compactBelow | `number` | `600` | no | Measured width below which all panels join one stack under the workspace. Must be finite and not negative. |
| defaults | `Partial<DockDefaults>` | none | no | `edgeSize` falls back to `280`; `floatingRect` falls back to `{x:max(0,width/2-160), y:max(0,height/4), width:320, height:280}`, then clamped to the usable regions. |
| isRTL | `boolean` | `false` | no | Sets `direction:"rtl"` on panel content and flips roving keys; edges stay physical. |
| className | `string` | none | no | Joined after `min-h-0 min-w-0` on the root. |
| unstyled | `boolean` | `false` | no | Drops the token classes. |

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

#### Variants

- Layout mode, derived from measured width: wide (width >= `compactBelow`) puts stacks on left, right and bottom edges in nested `PaneSplitter`s; compact (`0 < width < compactBelow`) merges every docked panel into one stack under the workspace in a vertical `PaneSplitter` sized by `layout.compactSize` (default `round(height*0.45)`, min 160 each side).
- `DockEdge`: `"left" | "right" | "bottom"`. Edge minimums are 160 for a dock and 200 for the workspace.
- `DockTarget`: edge or `"floating"`. Drives the options-menu entries ("Move to left dock", "Move to right dock", "Move to bottom dock", "Float").
- `unstyled`: `true` removes every token class listed under Tokens.

#### States

- disabled: `disabled` prop. `change()` drops proposals, tab and title `Pressable`s get `disabled`, tab `accessibilityState.disabled`, `MenuButton` and `DragGrabHandle` get `disabled`, `PaneSplitter`s get `disabled`, tab `tabIndex` becomes -1.
- selected tab: `accessibilityState={{selected,disabled}}`, `aria-selected`, `tabIndex` 0 on the selected tab else -1, classes `bg-surface-sunken forced-colors:border-2 forced-colors:border-[Highlight]` and `text-text font-semibold` (unselected: `bg-transparent`, `text-text-muted`).
- focus: tab class `focus-visible:ring-2 focus-visible:ring-focus`.
- dragging a floating panel: `drag` store state; the panel follows the pointer (`drag.rect`) and a drop-target overlay (`border-2 border-focus bg-primary/10`, 20% of the dock) shows for left, right or bottom, `pointerEvents="none"`.
- compact: described under Variants.
- hover, pressed: no code.

#### Tokens

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

#### Platform notes

- No `Platform.OS` check in the file. Web-style props (`role`, `tabIndex`, `onKeyDown`, `className`, `forced-colors:` classes) are passed through spread objects on every platform.
- Fold support: `features` and `usableRegions` shape floating panels and divider placement; no OS-specific branches.
- Package export conditions for `./components/shell/AdaptiveDock`: `types`, `react-native`, `default`; `react-native` and `default` point at the same file. No browser, qnx or marathon condition.
- No `.native`, `.web` or `.shared` sibling.

#### Motion

none in source. `ScrollView.scrollTo` is called with `animated:false` to reveal the active tab.

#### Dependencies

- `../DragGrabHandle` (`DragGrabHandle`, `DragPoint`), `./MenuButton` (`MenuButton`), `./PaneSplitter` (`PaneSplitter`).
- `./shell-keys` (`rovingTarget`, `shellKey`), `./dock-model` (layout functions and types), `../styles` (`joinClasses`), `../overlays/popover-position` (`Rect2D` type).
- External: `react`, `react-native`, `zustand` (optional peer), `@nyc-tron/core/folds` (`resolveUsableRegions`, `FoldFeature`; `@nyc-tron/core` is an optional peer).

#### Example

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

#### UNVERIFIED

- UNVERIFIED: how `PaneSplitter` resizes and seats dividers on hinges. The file passes props to it; its source was not read.
- UNVERIFIED: menu contents behaviour (focus, keyboard) of `MenuButton` and the `CommandPopover` it opens; not read here.
- UNVERIFIED: `DragGrabHandle` pointer and keyboard drag behaviour and its accessible output; only the props passed were read.
- UNVERIFIED: screen reader announcements for `role="region"`, `tablist` and `tab` on iOS, Android and web; the code sets the roles but no device was run.
- UNVERIFIED: `measureInWindow` results on each platform. Floating panels and the workspace layer depend on them and render nothing until measured.

UNVERIFIED count: 5

### AssetBrowser

`import {AssetBrowser} from "@nyc-tron/ui/components/shell/AssetBrowser"`

Source: `packages/ui/src/components/shell/AssetBrowser.tsx` (types and helpers from `asset-browser-model.ts`).
Tier-1 reason: R3 shell core. Import count: 0 (other packages: 0).

Also exported: types `AssetBrowserProps`, `AssetEntry`, `AssetLocation`, `AssetRequest`, `AssetSort`.

#### Props

`AssetBrowserProps extends Omit<ViewProps,"children">`. `style` is applied to the root (merged after the fill style when `height="fill"`); the rest spread onto the root `View`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| locationId | `string` | none | yes | Current location. Resets anchor and scroll when it changes; part of the owned-action scope with `revision`. |
| revision | `string` | none | yes | Sent back as `expectedRevision` in `AssetRequest`. |
| entries | `readonly AssetEntry[]` | none | yes | At most 20000; distinct ids, nonempty names. |
| path | `readonly AssetLocation[]` | none | yes | Breadcrumb buttons. Distinct ids, nonblank labels, else `TypeError`. |
| selectedIds | `readonly string[]` | none | yes | Distinct and nonempty. At most one in single mode, else `TypeError`. |
| selectionMode | `"single" \| "multiple"` | `"single"` | no | |
| onSelectionChange | `(ids: readonly string[]) => void` | none | yes | |
| onOpen | `(request: AssetRequest, signal: AbortSignal) => void \| Promise<void>` | none | yes | |
| onNavigate | `(locationId: string, signal: AbortSignal) => void \| Promise<void>` | none | yes | |
| loading | `boolean` | `false` | no | Disables rows and controls. |
| error | `string` | none | no | Shown in `ErrorMessage` (falls back to the action error). |
| height | `number \| "fill"` | `360` | no | Number must be finite and at least 44, else `RangeError`. `"fill"` uses `flex:1`. |
| header | `ReactNode` | none | no | Scrolls before the location, search and sort controls. |
| footer | `ReactNode` | none | no | Scrolls after the actions and error message. |
| emptyState | `ReactNode` | none | no | Replaces the built-in empty text. |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | |

`AssetEntry` (asset-browser-model.ts): `id: string`, `name: string`, `kind: "file" | "folder"`, `mediaType?: string`, `byteLength?: number`, `modifiedMs?: number`, `thumbnailUri?: string`.

| Type | Fields |
|---|---|
| AssetLocation | `id: string`, `label: string` |
| AssetRequest | `locationId: string`, `expectedRevision: string`, `entry: AssetEntry` |
| AssetSort | `"name" \| "modified" \| "size"` |

#### Variants

- `selectionMode`: `"single"` selects with mode `replace` and rows use `accessibilityRole="radio"`; `"multiple"` uses `checkbox` rows, Shift selects a range, Ctrl/Meta or any non-web platform toggles, plain web press replaces, and Ctrl/Cmd+A selects all visible.
- `height`: number gives the list a fixed `height`; `"fill"` gives the root `flex:1, minHeight:0, minWidth:0` and `keyboardShouldPersistTaps="handled"`.
- Sort (internal, `Select`): Name, Newest, Largest; folders always sort first.

#### States

- loading: `loading` prop; `busy` disables rows, breadcrumb buttons, sort and open button; empty text becomes "Loading assets…".
- pending request: `useOwnedAction` pending sets `busy` and shows a "Cancel asset request" button.
- error: `error` prop or the action's error through `ErrorMessage`.
- selected: row `aria-checked`, `accessibilityState.checked`, and a "✓" mark; the roving tab stop (`tabIndex` 0) is the first selected visible row, else the first row.
- disabled: rows `disabled`, `aria-disabled`, `accessibilityState.disabled` while busy; breadcrumb for the current location is disabled.
- empty: "No assets match" when a query is set, else "This location is empty" (or `emptyState`).
- focus: row class `focus-visible:ring-2 focus-visible:ring-focus`.
- hover, pressed: no code.

#### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.2 | `gap: 8` | 3 |
| space.1 | `gap: 4` | 1 |
| space.2.5 | `padding: 10`, `gap: 10` | 2 |
| color.textMuted | `text-text-muted` | 2 |
| color.border | `border-b border-border` | 1 |
| color.focus | `ring-focus` | 1 |
| color.text | `text-text` | 2 |

No token: `minHeight: 0` 2, `minWidth: 0` 2, `minHeight: 64` 1, thumbnail 40 by 40.
Tailwind default classes (no token): `border` 3, `text-sm` 1.

#### Platform notes

- `Platform.OS !== "web"` in the `choose` function: outside web, press toggles in multiple mode; on web a plain press replaces unless Ctrl/Meta is held.
- Keyboard handling (`onKeyDown`, `tabIndex`) is passed through a spread and reads web key events through `shellKey`.
- Export conditions: `types`, `react-native`, `default`, same file. No sibling variants.

#### Motion

none in source. `scrollToOffset` and `scrollToIndex` use `animated:false`.

#### Dependencies

- `../Button` (`Button`), `../Select` (`Select`), `../feedback/ErrorMessage` (`ErrorMessage`), `./InspectorSearch` (`InspectorSearch`).
- `./shell-keys`, `./useOwnedAction`, `../styles` (`joinClasses`), `./asset-browser-model`.
- External: `react`, `react-native` (`FlatList`, `Image`, `Platform`, `Pressable`), `zustand` (optional peer).

#### Example

```tsx example=AssetBrowser
import {useState} from "react";
import {AssetBrowser, type AssetEntry, type AssetLocation} from "@nyc-tron/ui/components/shell/AssetBrowser";

const entries: readonly AssetEntry[] = [
  {id: "f1", name: "Textures", kind: "folder"},
  {id: "a1", name: "harbor.png", kind: "file", mediaType: "image/png", byteLength: 204800, modifiedMs: 1700000000000},
];
const path: readonly AssetLocation[] = [{id: "root", label: "Project"}, {id: "images", label: "Images"}];

export function Example() {
  const [selected, setSelected] = useState<readonly string[]>([]);
  return (
    <AssetBrowser locationId="images" revision="r1" entries={entries} path={path} selectedIds={selected}
      selectionMode="multiple" onSelectionChange={setSelected} height="fill"
      onOpen={async (request, signal) => { if (!signal.aborted) console.log(request.entry.id); }}
      onNavigate={(locationId) => { console.log(locationId); }}/>
  );
}
```

#### UNVERIFIED

- UNVERIFIED: `useOwnedAction` / `createActionOwner` cancel and error semantics; only `useOwnedAction.ts` was read, not `action-owner.ts`.
- UNVERIFIED: `Select`, `Button`, `ErrorMessage` and `InspectorSearch` rendering and a11y beyond the props passed; `Select` and `ErrorMessage` were not read.
- UNVERIFIED: screen reader output for the `radio`/`checkbox` rows with `accessibilityActions` ("Select asset", "Open <name>") on VoiceOver and TalkBack.
- UNVERIFIED: whether `onPress` carries `shiftKey`, `ctrlKey` or `metaKey` on `event.nativeEvent` on web; the code casts it and reads those fields.

UNVERIFIED count: 4

### ContextMenu

`import {ContextMenu} from "@nyc-tron/ui/components/shell/ContextMenu"`

Source: `packages/ui/src/components/shell/ContextMenu.tsx`.
Tier-1 reason: R3 shell core. Import count: 1 (other packages: 1).

Also exported: types `CommandMenuItem`, `ContextMenuProps`, `ContextMenuSource`; functions `isContextMenuKey(key, shift)` (true for `"ContextMenu"` or Shift+`"F10"`) and `pointAnchor(x, y)` (zero-size `Rect2D`; throws `RangeError` for non-finite input).

#### Props

`ContextMenuProps extends Omit<PressableProps,"children"|"onLongPress"|"onContextMenu">`. Read or overridden from inherited props: `style` (function or object, merged after `{minWidth:44,minHeight:44}`), `onKeyDown` (called after the menu key check), `accessibilityActions` (a "longpress" action is appended while usable), `onAccessibilityAction` (forwarded for actions other than "longpress"), `testID` (menu gets `<testID>-menu`), `disabled`. `onPress` is not read and stays the target's primary press. The rest spreads onto the `Pressable`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | `string` | `"context-menu"` | no | Part of the boundary; changing it closes the menu and cancels pending measurements. |
| revision | `string \| number` | `0` | no | Same boundary role. |
| label | `string` | none | yes | Menu `accessibilityLabel` is `"Actions for "+label`. |
| items | `readonly CommandMenuItem[]` | none | yes | |
| onSelect | `(id: string) => void` | none | yes | Called only for an enabled item present in the committed list. |
| children | `ReactNode` | none | yes | The target. |
| onOpen | `(source: ContextMenuSource) => void` | none | no | |
| disabled | `boolean` | `false` | no | |
| usableRegions | `readonly Rect2D[]` | none | no | Default is the whole window from `useWindowDimensions`. |

`CommandMenuItem` (from `@nyc-tron/core/overlays`): `id: string`, `label: string`, `description?: string`, `disabled?: boolean`, `danger?: boolean` (all readonly).

#### Variants

`ContextMenuSource` reports how the menu opened: `"pointer"` (right-click or stylus barrel click via `onContextMenu`), `"long-press"`, `"keyboard"` (Shift+F10 or Menu key), `"assistive"` (the "Show actions" screen-reader action). No visual variants.

#### States

- disabled: `disabled` prop on the `Pressable`; also no menu when no item is enabled or no usable region exists (`usable` false).
- open: an anchor in the local store renders a `CommandPopover` with `visible`.
- usable: `aria-haspopup="menu"` always; `accessibilityHint` "Has actions. Long press, right-click or press Shift F10." only while usable.
- hover, pressed, focus, error, loading: no code in this file.

#### Tokens

| Token | Replaces | Count |
|---|---|---|
| size.touch | `minWidth: 44`, `minHeight: 44` | 1 each |

No classes in this file.

#### Platform notes

- `String(Platform.OS)==="qnx"` or `"marathon"`: after the menu closes, focus is moved back to the target with `target.current.focus()`.
- `onContextMenu` uses `nativeEvent.clientX/clientY` (web); without finite coordinates the menu opens beside the target.
- Export conditions: `types`, `react-native`, `default`, same file.

#### Motion

none in source.

#### Dependencies

- `../overlays/CommandPopover` (`CommandPopover`, `CommandMenuItem` type), `../overlays/popover-position` (`hasUsableRegion`, `Rect2D`), `./shell-keys` (`shellKey`).
- External: `react`, `react-native` (`Platform`, `Pressable`, `useWindowDimensions`), `zustand` (optional peer). `@nyc-tron/core/overlays` is reached through `CommandPopover`.

#### Example

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

#### UNVERIFIED

- UNVERIFIED: `CommandPopover` keyboard, focus-return and placement behaviour on each platform; only its props were read in this task.
- UNVERIFIED: whether the long-press handler and the web `onContextMenu` both fire for one gesture on a given device; the code opens at the last anchor set.
- UNVERIFIED: VoiceOver and TalkBack output of the "Show actions" action and `aria-haspopup` on native.

UNVERIFIED count: 3

### ContextualToolbar

`import {ContextualToolbar} from "@nyc-tron/ui/components/shell/ContextualToolbar"`

Source: `packages/ui/src/components/shell/ContextualToolbar.tsx` (item rules in `contextual-toolbar-model.ts`).
Tier-1 reason: R3 shell core. Import count: 0 (other packages: 0).

Also exported: types `ContextualToolbarItem`, `ContextualToolbarProps`.

#### Props

`ContextualToolbarProps extends Omit<ViewProps,"children">`. `style` is merged after `{minWidth:0,direction}`; `onLayout` is not forwarded (the component sets its own `onLayout` after the spread, so a passed `onLayout` is overridden).

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | `string` | `"toolbar"` | no | Part of the boundary with `revision`, `selectionKind`, `disabled`. A stale boundary makes `invoke` a no-op. |
| revision | `string \| number` | `0` | no | |
| disabled | `boolean` | `false` | no | |
| items | `readonly ContextualToolbarItem[]` | none | yes | At most 1000; unique nonblank ids; labels nonblank. `validateToolbarItems` throws otherwise. |
| selectionKind | `string` | none | yes | Items with `appliesTo` not containing it are hidden. |
| label | `string` | none | yes | `actionsLabel` of the shared `Toolbar`. |
| onAction | `(id: string) => void` | none | yes | Not called for disabled items. |
| isRTL | `boolean` | `false` | no | Sets `direction`. |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | |

`ContextualToolbarItem extends ToolbarItemSpec` with `icon?: ReactNode`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| id | `string` | none | yes | |
| label | `string` | none | yes | Accessible name, menu text, visible text. |
| priority | `number` | `0` | no | Higher stays visible longer; ties overflow in reverse declared order. |
| appliesTo | `readonly string[]` | none | no | Omit to apply to every kind. |
| pressed | `boolean` | none | no | Present means a toggle: sets `selected` state and web toggle props. |
| disabledReason | `string` | none | no | Disables the item, becomes `accessibilityHint`, menu description, and a visible line under the toolbar. |
| icon | `ReactNode` | none | no | |

#### Variants

- Item `pressed`: `true` uses `bg-primary` and `text-on-primary`; otherwise `bg-surface-raised` and `text-text`.
- Overflow: items that do not fit move into a "More" `MenuButton`. Geometry: available width is `max(0,width-16)`, gap 4, "More" width 64, fallback item width 96.
- `unstyled`: removes the token classes.

#### States

- disabled (whole toolbar or item): `disabled` on the `Pressable`, `accessibilityState.disabled`; item with `disabledReason` also gets `opacity-50` and the reason as hint.
- pressed toggle: `accessibilityState.selected` plus `webToggleProps(item.pressed)`.
- focus: class `focus-visible:ring-2 focus-visible:ring-focus`.
- overflow: items listed in the "More" menu with `disabled` mirrored and a description (reason, or "On"/"Off" for toggles).
- hover, loading, error: no code.

#### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.1 | `gap: 4` | 1 |
| size.touch | `minWidth: 44`, `minHeight: 44` | 1 each |
| color.focus | `ring-focus` | 1 |
| color.primary | `bg-primary` | 1 |
| color.surfaceRaised | `bg-surface-raised` | 1 |
| color.onPrimary | `text-on-primary` | 1 |
| color.text | `text-text` | 2 |
| color.textMuted | `text-text-muted` | 1 |
| radius.control | `rounded-control` | 1 |

No token: `minWidth: 0` 1.
Tailwind default classes (no token): `px-3` 1, `gap-2` 1, `opacity-50` 1, `text-sm` 1.

#### Platform notes

none in source. Export conditions: `types`, `react-native`, `default`, same file.

#### Motion

none in source.

#### Dependencies

- `../Toolbar` (`Toolbar`, `density="compact"`), `./MenuButton` (`MenuButton`), `../forge/toggle-a11y` (`webToggleProps`), `../styles` (`joinClasses`), `./contextual-toolbar-model`.
- External: `react`, `react-native`, `zustand` (optional peer).

A hidden, zero-height, `opacity:0` copy of every applicable item is rendered to measure widths (`accessibilityElementsHidden`, `importantForAccessibility="no-hide-descendants"`, `aria-hidden`).

#### Example

```tsx example=ContextualToolbar
import {Text} from "react-native";
import {ContextualToolbar, type ContextualToolbarItem} from "@nyc-tron/ui/components/shell/ContextualToolbar";

const items: readonly ContextualToolbarItem[] = [
  {id: "bold", label: "Bold", priority: 2, appliesTo: ["text"], pressed: true, icon: <Text>B</Text>},
  {id: "crop", label: "Crop", priority: 1, appliesTo: ["image"], disabledReason: "Select one image to crop"},
  {id: "delete", label: "Delete"},
];

export function Example() {
  return <ContextualToolbar label="Selection actions" selectionKind="text" items={items} onAction={(id) => { console.log(id); }}/>;
}
```

#### UNVERIFIED

- UNVERIFIED: `Toolbar` layout and its own a11y role; only the props passed (`density`, `actionsLabel`, `actions`, `unstyled`) were read here.
- UNVERIFIED: `MenuButton` open and focus-return behaviour for the "More" menu.
- UNVERIFIED: `webToggleProps` output; the file `forge/toggle-a11y.ts` was not read.
- UNVERIFIED: first-render overflow result. Widths come from `onLayout` of the hidden measuring copies, so the first frame uses the 96 fallback width per item.

UNVERIFIED count: 4

### DocumentTabBar

`import {DocumentTabBar} from "@nyc-tron/ui/components/shell/DocumentTabBar"`

Source: `packages/ui/src/components/shell/DocumentTabBar.tsx` (model in `document-tabs-model.ts`).
Tier-1 reason: R3 shell core. Import count: 0 (other packages: 0).

Also exported: type `DocumentTab`, `DocumentTabBarProps`; functions `activeAfterClose(ids, closing, active)` and `moveDocument(ids, id, toIndex)` (re-exported from the model; `moveDocument` returns the same array when nothing moves).

#### Props

`DocumentTabBarProps extends Omit<ViewProps,"children">`. `style` goes to the root `View`; the rest spread onto it.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | `string` | `"documents"` | no | Part of the boundary with `revision` and `disabled`. |
| revision | `string \| number` | `0` | no | |
| disabled | `boolean` | `false` | no | Blocks activate, close and reorder. |
| documents | `readonly DocumentTab[]` | none | yes | At most 1000; unique nonblank ids and titles (title at most 512). |
| activeId | `string \| undefined` | none | yes | A value matching no tab selects none; the first tab is then the web tab stop. |
| onActivate | `(id: string) => void` | none | yes | |
| onClose | `(id: string) => void` | none | no | Without it no close button shows. |
| onReorder | `(id: string, toIndex: number) => void` | none | no | Without it tabs cannot be reordered. |
| label | `string` | `"Open documents"` | no | `accessibilityLabel` of the `tablist`. |
| className | `string` | none | no | |
| tabClassName | `string` | none | no | Added to each tab wrapper. |
| unstyled | `boolean` | `false` | no | |

`DocumentTab` (document-tabs-model.ts): `id: string`, `title: string`, `dirty?: boolean` (unsaved marker, label becomes "<title>, unsaved changes"), `closable?: boolean` (default true).

#### Variants

`unstyled` removes token classes; no other variant props.

#### States

- selected: `accessibilityState.selected`, `aria-selected`; wrapper `bg-surface-raised border-x border-t border-border`, title `text-text font-semibold` (unselected wrapper `bg-transparent`, title `text-text-muted`).
- disabled: `disabled` on the tab and close `Pressable`s, `accessibilityState.disabled`; web `tabIndex` becomes -1.
- dirty: an 8 by 8 dot with class `border-accent` (borderWidth 4, radius 4).
- closable: close button only when `onClose` is set and `doc.closable !== false`.
- focus: class `focus-visible:ring-2 focus-visible:ring-focus` on the tab; the close button has `hover:bg-surface-sunken` on hover.
- loading, error: no code.

#### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.1 | `paddingHorizontal: 4`, `marginTop: 4` | 2 |
| space.0.5 | `gap: 2` | 2 |
| radius.4 | `borderRadius: 4` | 1 |
| border.4 | `borderWidth: 4` | 1 |
| border.1_5 | `borderTopWidth: 1.5` | 2 |
| color.border | border classes | 2 |
| color.surfaceSunken | `bg-surface-sunken`, `hover:bg-surface-sunken` | 2 |
| color.surfaceRaised | `bg-surface-raised` | 1 |
| color.focus | `ring-focus` | 1 |
| color.accent | `border-accent` | 1 |
| color.text | `text-text` | 1 |
| color.textMuted | `text-text-muted`, `border-text-muted` | 2 |
| radius.control | `rounded-control`, `rounded-t-control` | 2 |

No token: glyph sizes 8, 12, 14, `maxWidth: 240`.
Tailwind default classes (no token): `min-w-0` 1, `border` 9, `rounded-t` 1, `min-h-11` 2, `gap-2` 1, `px-3` 1, `text-sm` 1, `font-semibold` 1, `min-w-11` 1.

#### Platform notes

- `Platform.OS==="web"`: tab `Pressable` gets `onKeyDown` (arrows with RTL flip via `nodeIsRTL` or `I18nManager.isRTL`, Home/End, Ctrl/Cmd+Shift+Arrow to reorder, Delete to close) and `tabIndex` (0 on the active tab). The close button gets `tabIndex:-1` on web; elsewhere it gets `accessibilityElementsHidden` and `importantForAccessibility="no-hide-descendants"`.
- Native screen readers get tab `accessibilityActions`: activate, close, moveEarlier, moveLater (the last two only with `onReorder`, and only when a neighbour exists).
- Export conditions: `types`, `react-native`, `default`, same file.

#### Motion

none in source. The active tab is centred with `scrollTo({animated:false})`.

#### Dependencies

- `./shell-keys` (`nodeIsRTL`, `rovingTarget`, `shellKey`), `./document-tabs-model`, `../styles` (`joinClasses`).
- External: `react`, `react-native` (`I18nManager`, `Platform`, `Pressable`, `ScrollView`).

#### Example

```tsx example=DocumentTabBar
import {useState} from "react";
import {DocumentTabBar, activeAfterClose, moveDocument, type DocumentTab} from "@nyc-tron/ui/components/shell/DocumentTabBar";

export function Example() {
  const [docs, setDocs] = useState<readonly DocumentTab[]>([
    {id: "a", title: "Harbor.png", dirty: true},
    {id: "b", title: "Notes.md"},
  ]);
  const [active, setActive] = useState<string | undefined>("a");
  return (
    <DocumentTabBar documents={docs} activeId={active} onActivate={setActive}
      onClose={(id) => {
        const ids = docs.map(d => d.id);
        setActive(activeAfterClose(ids, id, active));
        setDocs(docs.filter(d => d.id !== id));
      }}
      onReorder={(id, to) => {
        const order = moveDocument(docs.map(d => d.id), id, to);
        setDocs(order.map(i => docs.find(d => d.id === i)!));
      }}/>
  );
}
```

#### UNVERIFIED

- UNVERIFIED: `nodeIsRTL` and `rovingTarget` behaviour; `shell-keys.ts` was read only to line 30.
- UNVERIFIED: VoiceOver and TalkBack output for the custom actions and the `tab` role on a `Pressable` inside a `tablist` view.
- UNVERIFIED: the visible rendering of the close glyph, drawn from rotated top borders (`CloseGlyph`); no device was run.

UNVERIFIED count: 3

### FindReplaceContent

`import {FindReplaceContent} from "@nyc-tron/ui/components/shell/FindReplaceContent"`

Source: `packages/ui/src/components/shell/FindReplaceContent.tsx` (types and helpers in `find-replace-model.ts`).
Tier-1 reason: R3 shell core. Import count: 2 (other packages: 1).

Also exported: types `FindDocument`, `FindMatch`, `FindQuery`, `FindResponse`, `ReplaceRequest`, `FindReplaceContentProps`.

#### Props

Plain interface, no `extends`. It renders a `ScrollView` and forwards no view props.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| document | `FindDocument` | none | yes | `{id, revision}`; both feed the search and replace scopes. |
| active | `boolean` | `true` | no | When `false`, no search runs, inputs are not editable and buttons are disabled. |
| onFind | `(query: FindQuery, signal: AbortSignal) => FindResponse \| Promise<FindResponse>` | none | yes | Result passes `validateFindResponse` (token, total, at most 1000 matches, ordered nonoverlapping UTF-16 ranges, preview limits) or the action errors. |
| onReplace | `(request: ReplaceRequest, signal: AbortSignal) => void \| Promise<void>` | none | yes | |
| onNavigate | `(document: FindDocument, match: FindMatch) => void` | none | yes | |
| initialQuery | `string` | `""` | no | Read once, when the store is created. |
| onClose | `() => void` | none | no | Shows a "Close find and replace" button. |
| unstyled | `boolean` | `false` | no | |

| Type | Fields |
|---|---|
| FindDocument | `id: string`, `revision: string` |
| FindQuery | `document`, `text: string`, `caseSensitive: boolean`, `wholeWord: boolean` |
| FindMatch | `id`, `start`, `end` (UTF-16 offsets), `before`, `text`, `after` |
| FindResponse | `token: string`, `total: number`, `matches: readonly FindMatch[]` |
| ReplaceRequest | `query`, `searchToken`, `replacement`, and either `kind:"one"` with `matchId` or `kind:"all"` |

#### Variants

none. `unstyled` only removes classes. `ReplaceRequest.kind` is `"one"` (current match) or `"all"`.

#### States

- searching: shown as "Finding…" while a find is pending or the result scope is stale and there is no error.
- error: "Search failed" in the live region, plus the message in `ErrorMessage`.
- empty: "Enter text to find" with no query, "No search results" with a query and no result.
- results: "<total> matches", with "; showing first N" when `total` exceeds the shown matches.
- pending replacement or `active=false`: inputs `editable={false}`, switches and buttons disabled; a pending replacement shows "Cancel replacement".
- disabled buttons: Previous/Next need a current match; Replace match and Replace all also wait for `searching` to end.
- focus: field class includes `focus-visible:border-focus`.
- hover, pressed: no code.

#### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.3 | `padding: 12` | 1 |
| space.2 | `gap: 8`, `padding: 8` | 4 |
| size.touch | `minHeight: 44` | 2 |
| color.border | `border-border` | 1 |
| color.surfaceSunken | `bg-surface-sunken` | 1 |
| color.text | `text-text` | 3 |
| color.focus | `focus-visible:border-focus` | 1 |
| color.textMuted | `text-text-muted` | 1 |
| radius.control | `rounded-control` | 1 |

Tailwind default classes (no token): `border` 4, `font-semibold` 1, `font-bold` 1 (plus `underline` on the match text, not listed by the script).

#### Platform notes

none in source. Export conditions: `types`, `react-native`, `default`, same file.

#### Motion

none in source.

#### Dependencies

- `../Button` (`Button`), `../feedback/ErrorMessage` (`ErrorMessage`), `../forge/canvas/SettingSwitch` (`SettingSwitch`), `./useOwnedAction`, `./find-replace-model`, `../styles` (`joinClasses`).
- External: `react`, `react-native` (`ScrollView`, `Text`, `TextInput`, `View`), `zustand` (optional peer).

#### Example

```tsx example=FindReplaceContent
import {FindReplaceContent, type FindDocument, type FindQuery, type FindResponse} from "@nyc-tron/ui/components/shell/FindReplaceContent";

const document: FindDocument = {id: "doc-1", revision: "r1"};
const onFind = (query: FindQuery): FindResponse => ({
  token: query.text,
  total: 1,
  matches: [{id: "0:5", start: 0, end: 5, before: "", text: query.text, after: " world"}],
});

export function Example() {
  return <FindReplaceContent document={document} onFind={onFind} onReplace={async () => {}} onNavigate={() => {}} initialQuery="hello"/>;
}
```

#### UNVERIFIED

- UNVERIFIED: `SettingSwitch`, `Button` and `ErrorMessage` rendering; only the props passed were read.
- UNVERIFIED: whether the polite live region announces each state change on VoiceOver, TalkBack and browsers.
- UNVERIFIED: `useOwnedAction` / `createActionOwner` cancel semantics when `scope` changes mid-search (`action-owner.ts` not read).

UNVERIFIED count: 3

### FindReplacePopover

`import {FindReplacePopover} from "@nyc-tron/ui/components/shell/FindReplacePopover"`

Source: `packages/ui/src/components/shell/FindReplacePopover.tsx`.
Tier-1 reason: R3 shell core. Import count: 2 (other packages: 2).

Also exported: types `FindReplaceContentProps` (re-export), `FindReplacePopoverProps`.

#### Props

`FindReplacePopoverProps = Omit<FindReplaceContentProps,"onClose"|"active"> & (Omit<PopoverAnchorProps,"children"|"accessibilityLabel"> | Omit<PopoverTriggerProps,"children"|"accessibilityLabel">)`. The component reads `document`, `onFind`, `onReplace`, `onNavigate`, `initialQuery`, `unstyled` itself and passes everything else to `AnchoredPopover`. `accessibilityLabel` is fixed to "Find and replace". `active` is set from `open`, and `onClose` calls `onOpenChange(false)`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| document | `FindDocument` | none | yes | See FindReplaceContent. |
| onFind | `(query, signal) => FindResponse \| Promise<FindResponse>` | none | yes | |
| onReplace | `(request, signal) => void \| Promise<void>` | none | yes | |
| onNavigate | `(document, match) => void` | none | yes | |
| initialQuery | `string` | none | no | Forwarded only when defined. |
| unstyled | `boolean` | none | no | Forwarded only when defined. |
| open | `boolean` | none | yes | Controlled visibility. |
| onOpenChange | `(open: boolean) => void` | none | yes | |
| scope | `string` | none | no | Popover scope. |
| width | `number` | none (popover default 320) | no | |
| maxHeight | `number` | none (popover default 420) | no | |
| className | `string` | none | no | Web only per the type doc. |
| testID | `string` | none | no | |
| anchor | `Rect2D` | none | one of anchor or trigger | Rect form; requires `usableRegions`. |
| usableRegions | `readonly Rect2D[]` | none | yes with `anchor`, optional with `trigger` | Trigger form default: the whole window. |
| trigger | `ReactNode \| ((state: PopoverTriggerState) => ReactNode)` | none | one of anchor or trigger | Trigger form. |

`PopoverTriggerState`: `open: boolean`, `toggle: () => void`, `triggerProps: {accessibilityState:{expanded}, "aria-expanded", "aria-haspopup":"dialog"}`.

#### Variants

Two forms: rect form (`anchor` plus `usableRegions`) and trigger form (`trigger`). `AnchoredPopover` throws `TypeError` unless exactly one of `anchor` and `trigger` is given (`isTriggerPopover`).

#### States

- open or closed: `open` prop; the inner `FindReplaceContent` gets `active={open}`, so searching and editing stop while closed.
- trigger form: `triggerProps` carry `accessibilityState.expanded`, `aria-expanded`, `aria-haspopup="dialog"` when spread by the caller.
- All other states come from `FindReplaceContent`.

#### Tokens

none (no literals or classes in this file).

#### Platform notes

none in the file. The comment says the Expo-controls entry supplies SwiftUI/Compose popover surfaces; that entry was not read. `AnchoredPopover` has a `Platform.OS!=="web"` check for Tab handling (line 65).

#### Motion

none in source.

#### Dependencies

- `../overlays/AnchoredPopover` (`AnchoredPopover`, `PopoverAnchorProps`, `PopoverTriggerProps`), `./FindReplaceContent` (`FindReplaceContent`).
- External: `react-native` via the above. No direct external imports.

#### Example

```tsx example=FindReplacePopover
import {useState} from "react";
import {Pressable, Text} from "react-native";
import {FindReplacePopover} from "@nyc-tron/ui/components/shell/FindReplacePopover";

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <FindReplacePopover open={open} onOpenChange={setOpen} document={{id: "doc-1", revision: "r1"}}
      onFind={() => ({token: "t", total: 0, matches: []})} onReplace={async () => {}} onNavigate={() => {}}
      trigger={({toggle, triggerProps}) => <Pressable onPress={toggle} {...triggerProps}><Text>Find</Text></Pressable>}/>
  );
}
```

#### UNVERIFIED

- UNVERIFIED: `AnchoredPopover` placement, dismissal and focus behaviour; only its type file and one line were read.
- UNVERIFIED: the native (SwiftUI/Compose) popover surface in `@nyc-tron/expo-controls`; outside this file.

UNVERIFIED count: 2

### FocusAndA11yLayer

`import {FocusAndA11yLayer} from "@nyc-tron/ui/components/shell/FocusAndA11yLayer"`

Source: `packages/ui/src/components/shell/FocusAndA11yLayer.tsx` (store logic in `a11y-model.ts`).
Tier-1 reason: R3 shell core. Import count: 0 (other packages: 0).

Also exported from the same specifier: hooks `useA11yPreferences()` and `useAnnounce()`; function `motionDuration(ms, preferences)`; types `A11yPreferences`, `InputModality`, `Politeness`, `FocusAndA11yLayerProps`. Both hooks throw `Error("<name> needs a FocusAndA11yLayer above it")` outside the layer.

#### Props

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| children | `ReactNode` | none | yes | |
| initial | `Partial<A11yPreferences>` | none (all off, modality `"unknown"`) | no | Starting values; the platform overrides them once it reports. |

`A11yPreferences`: `reduceMotion: boolean`, `screenReader: boolean`, `highContrast: boolean`, `inputModality: "keyboard" | "pointer" | "unknown"` (all readonly).

Helpers: `useAnnounce()` returns `(text: string, politeness?: "polite" | "assertive") => void` (default `"polite"`; blank text is ignored). `motionDuration(ms, {reduceMotion})` returns `0` when reduce motion is on and throws `RangeError` for a negative or non-finite `ms`.

#### Variants

`Politeness`: `"polite"` or `"assertive"`, set per announcement; on web it becomes the `accessibilityLiveRegion` of the hidden announcement text. `InputModality` values come from keydown (navigation keys or modified single keys give `"keyboard"`) and pointerdown (`"pointer"`).

#### States

- reduceMotion, screenReader, highContrast, inputModality: held in a store and read through `useA11yPreferences`.
- Announcement: stored with a `seq` that increments so identical text is read again.
- read failure (QNX and Marathon only): an unexpected rejected read is stored and rethrown during render so it reaches an error boundary. Known codes `ERR_QT_ACCESSIBILITY_UNSUPPORTED` and `ERR_QT_ACCESSIBILITY_UNAVAILABLE` are ignored.

#### Tokens

none (no literals or classes).

#### Platform notes

- iOS: reads `isDarkerSystemColorsEnabled` and listens to `darkerSystemColorsChanged` for `highContrast`.
- Android, `qnx`, `marathon`: read `isHighTextContrastEnabled` and listen to `highTextContrastChanged`.
- All platforms: reduce motion and screen reader through `AccessibilityInfo`.
- Web: `matchMedia("(forced-colors: active)")` for `highContrast`, `matchMedia("(prefers-reduced-motion: reduce)")` for `reduceMotion`; `keydown` and `pointerdown` capture listeners write `document.documentElement.dataset.inputModality`; announcements render in a hidden 1 by 1 `View` with an `accessibilityLiveRegion` `Text` and `aria-atomic`. Screen reader detection is not available on web (reports the initial value).
- Non-web: announcements call `AccessibilityInfo.announceForAccessibility`.
- Export conditions: `types`, `react-native`, `default`, same file.

#### Motion

none in source. It supplies `motionDuration` and the `reduceMotion` flag for other components.

#### Dependencies

- `./a11y-model` (`initialA11yState`, `modalityAfterKey`, `queueAnnouncement`, types, `motionDuration`).
- External: `react`, `react-native` (`AccessibilityInfo`, `Platform`, `Text`, `View`), `zustand` (optional peer).

#### Example

```tsx example=FocusAndA11yLayer
import {Pressable, Text} from "react-native";
import {FocusAndA11yLayer, motionDuration, useA11yPreferences, useAnnounce} from "@nyc-tron/ui/components/shell/FocusAndA11yLayer";

function SaveButton() {
  const announce = useAnnounce();
  const prefs = useA11yPreferences();
  const duration = motionDuration(200, prefs);
  return <Pressable onPress={() => announce(`Saved, ${duration} ms fade`, "polite")}><Text>Save</Text></Pressable>;
}

export function Example() {
  return <FocusAndA11yLayer initial={{reduceMotion: false}}><SaveButton/></FocusAndA11yLayer>;
}
```

#### UNVERIFIED

- UNVERIFIED: what VoiceOver, TalkBack and browsers actually speak for announcements; the code queues text and sets the live-region props only.
- UNVERIFIED: `AccessibilityInfo` method availability and behaviour on QNX and Marathon hosts beyond the error codes the file handles.
- UNVERIFIED: whether `AccessibilityInfo.isHighTextContrastEnabled` and `isDarkerSystemColorsEnabled` exist at runtime on the React Native version in use; the file calls them without a guard.

UNVERIFIED count: 3

### HistoryPanel

`import {HistoryPanel} from "@nyc-tron/ui/components/shell/HistoryPanel"`

Source: `packages/ui/src/components/shell/HistoryPanel.tsx` (types and validation in `history-model.ts`).
Tier-1 reason: R3 shell core. Import count: 0 (other packages: 0).

Also exported: types `HistoryEntry`, `HistoryJump`, `HistoryPanelProps`.

#### Props

`HistoryPanelProps extends Omit<ViewProps,"children">`. `style` is merged after `{gap:8}`; the rest spread onto the root `View`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| documentId | `string` | none | yes | With `revision`, the owned-action scope. |
| revision | `string` | none | yes | Sent as `expectedRevision`. |
| entries | `readonly HistoryEntry[]` | none | yes | Distinct ids and nonblank labels, finite timestamps. |
| cursor | `number` | none | yes | Integer from 0 to `entries.length`; 0 is the initial state. Else `RangeError`. |
| onJump | `(request: HistoryJump, signal: AbortSignal) => void \| Promise<void>` | none | yes | |
| label | `string` | `"History"` | no | Heading text and list `accessibilityLabel`. |
| height | `number` | `320` | no | Must be finite and at least 44, else `RangeError`. |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | |

| Type | Fields |
|---|---|
| HistoryEntry | `id: string`, `label: string`, `detail?: string`, `timestampMs?: number` |
| HistoryJump | `documentId: string`, `expectedRevision: string`, `cursor: number` |

#### Variants

none. `unstyled` removes classes.

#### States

- pending: while a jump runs, text reads "Restoring history…", all buttons and rows are disabled, and "Cancel history request" shows.
- boundary: Undo disabled at cursor 0; Redo disabled at `entries.length`; "Initial state" disabled at cursor 0.
- current: row `aria-current="step"` and label prefix "Current state" when `cursor === index+1`; other rows are "Restore state N: <label>".
- applied vs undone rows: text `text-text` when `index < cursor`, else `text-text-muted`.
- empty: "No document edits".
- error: `ErrorMessage` with the action error.
- focus: row class `focus-visible:ring-2 focus-visible:ring-focus`.
- hover: no code.

#### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.2 | `gap: 8` | 2 |
| space.2.5 | `padding: 10` | 1 |
| space.1 | `gap: 4` | 1 |
| color.text | `text-text` | 2 |
| color.textMuted | `text-text-muted` | 5 |
| color.border | `border-b border-border` | 1 |
| color.focus | `ring-focus` | 1 |

No token: `minHeight: 56`.
Tailwind default classes (no token): `font-semibold` 1, `border` 3, `text-sm` 2.

#### Platform notes

none in source. Export conditions: `types`, `react-native`, `default`, same file.

#### Motion

none in source.

#### Dependencies

- `../Button` (`Button`), `../feedback/ErrorMessage` (`ErrorMessage`), `./useOwnedAction`, `./history-model`, `../styles` (`joinClasses`).
- External: `react-native` (`FlatList`, `Pressable`, `Text`, `View`); `useOwnedAction` uses `zustand` (optional peer).

#### Example

```tsx example=HistoryPanel
import {useState} from "react";
import {HistoryPanel, type HistoryEntry} from "@nyc-tron/ui/components/shell/HistoryPanel";

const entries: readonly HistoryEntry[] = [
  {id: "e1", label: "Move layer", detail: "Harbor photo", timestampMs: 1700000000000},
  {id: "e2", label: "Change opacity"},
];

export function Example() {
  const [cursor, setCursor] = useState(2);
  return <HistoryPanel documentId="doc-1" revision="r1" entries={entries} cursor={cursor}
    onJump={async (request) => { setCursor(request.cursor); }} height={240}/>;
}
```

#### UNVERIFIED

- UNVERIFIED: cancel and error behaviour of `createActionOwner` (`action-owner.ts` not read).
- UNVERIFIED: the timestamp text; it uses `toLocaleString()`, so output depends on the device locale.
- UNVERIFIED: screen reader output of the `aria-current="step"` attribute on a native `Pressable`.

UNVERIFIED count: 3

### InspectorPanel

`import {InspectorPanel} from "@nyc-tron/ui/components/shell/InspectorPanel"`

Source: `packages/ui/src/components/shell/InspectorPanel.tsx` (selection and match logic in `inspector-model.ts`, context in `inspector-context.ts`).
Tier-1 reason: R3 shell core. Import count: 0 (other packages: 0).

Also exported: types `InspectorSelection`, `InspectorPanelProps`.

#### Props

`InspectorPanelProps extends Omit<ViewProps,"children">`. `style` is merged after `{flex:1,minHeight:0}`; the rest spread onto the root. The root also receives `role="region"` and `accessibilityLabel="Properties of <heading>"`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | `string` | `JSON.stringify(selection)` | no | Keys the rows provider, so changing it remounts rows and drops editor drafts. Blank or over 4096 chars throws `RangeError`. |
| selection | `InspectorSelection` | none | yes | |
| children | `ReactNode` | none | no | `InspectorSection`s and `PropertyRow`s. |
| query | `string` | `""` | no | Filter text. |
| onQueryChange | `(query: string) => void` | none | no | With a selection other than `none`, shows an `InspectorSearch`. |
| actions | `ReactNode` | none | no | Header buttons. |
| emptyMessage | `string` | `"Select an object to see its properties."` | no | Shown when nothing is selected. |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | |

`InspectorSelection` (inspector-model.ts, union):

| kind | Fields |
|---|---|
| `"none"` | none |
| `"single"` | `title: string` (nonblank, at most 512), `detail?: string` (at most 2048) |
| `"multiple"` | `count: number` (integer, at least 2), `noun: {one: string, other: string}` |

Heading: `"No selection"`, the single title, or `"<count> <noun.other>"`. Sub-line: the single `detail`, or "Changes apply to every selected object." for a multiple selection.

#### Variants

`selection.kind` (`none`, `single`, `multiple`) changes the heading, the sub-line, and whether the body is the empty message or the scroll area. `unstyled` removes classes.

#### States

- empty: `kind:"none"` renders `emptyMessage` instead of children and hides search.
- searching: a nonblank `query` filters rows; the live-region summary comes from `matchSummary` ("1 property matches", "N properties match", or `No properties match "<q>"`).
- no matches: while searching with zero matching rows, a message `Nothing matches "<q>".` and "Try a shorter word, or clear the search to see every property."
- loading, error, disabled, focus: none in this file.

#### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.2 | `gap: 8` | 2 |
| space.4 | `padding: 16`, `paddingBottom: 16` | 3 |
| space.1 | `gap: 4` | 1 |
| size.touch | `minHeight: 44` | 1 |
| color.surfaceRaised | `bg-surface-raised` | 1 |
| color.border | `border-b border-border` | 1 |
| color.text | `text-text` | 2 |
| color.textMuted | `text-text-muted` | 3 |

No token: `minHeight: 0` 1, `minWidth: 0` 1.
Tailwind default classes (no token): `border` 3, `px-3` 1, `py-2` 1, `text-base` 1, `font-semibold` 1, `text-xs` 2, `text-sm` 2.

#### Platform notes

none in source. Export conditions: `types`, `react-native`, `default`, same file.

#### Motion

none in source.

#### Dependencies

- `./InspectorSearch` (`InspectorSearch`), `./inspector-context` (`InspectorPanelContext`), `./inspector-model`, `../styles` (`joinClasses`).
- External: `react`, `react-native` (`ScrollView`, `Text`, `View`), `zustand` (optional peer).

#### Example

```tsx example=InspectorPanel
import {useState} from "react";
import {Text} from "react-native";
import {InspectorPanel, type InspectorSelection} from "@nyc-tron/ui/components/shell/InspectorPanel";
import {InspectorSection} from "@nyc-tron/ui/components/shell/InspectorSection";

export function Example() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(true);
  const selection: InspectorSelection = {kind: "single", title: "Harbor photo", detail: "Image layer"};
  return (
    <InspectorPanel selection={selection} query={query} onQueryChange={setQuery} scope="layer-7">
      <InspectorSection title="Transform" expanded={open} onExpandedChange={setOpen}><Text>Rows</Text></InspectorSection>
    </InspectorPanel>
  );
}
```

#### UNVERIFIED

- UNVERIFIED: how `PropertyRow` registers into the row registry and counts as a match; `PropertyRow.tsx` and `registerRow` were not read in full.
- UNVERIFIED: VoiceOver, TalkBack and browser output for `role="region"` with the "Properties of ..." label.

UNVERIFIED count: 2

### InspectorSearch

`import {InspectorSearch} from "@nyc-tron/ui/components/shell/InspectorSearch"`

Source: `packages/ui/src/components/shell/InspectorSearch.tsx` (`matchesQuery` in `inspector-model.ts`).
Tier-1 reason: R3 shell core. Import count: 3 (other packages: 0).

Also exported: type `InspectorSearchProps`; function `matchesQuery(query, label, keywords?)` (true when every query word starts a label word or keyword or appears inside the label; case and accents ignored; empty query matches all).

#### Props

`InspectorSearchProps extends Omit<ViewProps,"children">`. `style` goes to the root `View`; the rest spread onto it.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | `string` | `"inspector-search"` | no | A change in scope drops stale `onQueryChange` calls from the previous commit. |
| disabled | `boolean` | `false` | no | Field not editable; clear button disabled. |
| query | `string` | none | yes | |
| maxLength | `number` | `2048` | no | Integer 1 to 100000, else `RangeError`. Input is sliced to it. |
| onQueryChange | `(query: string) => void` | none | yes | |
| label | `string` | `"Search properties"` | no | Accessible name and placeholder. |
| summary | `string` | none | no | Text of the polite live region under the field. |
| className | `string` | none | no | Joined after `gap-1`. |
| unstyled | `boolean` | `false` | no | |

#### Variants

none. `unstyled` removes classes.

#### States

- disabled: `editable={false}`, `accessibilityState.disabled`, clear button `disabled`.
- has query: shows a "Clear search" button (44 by 44 minimum); Escape in the field clears it when a query exists.
- focus: container `focus-within:border-focus`; clear button `focus-visible:ring-2 focus-visible:ring-focus`.
- summary: live region `accessibilityLiveRegion="polite"`; its `minHeight` is 0 when `summary` is empty.
- hover, loading, error: no code.

#### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.2.5 | `paddingHorizontal: 10` | 1 |
| space.2 | `paddingHorizontal: 8` | 1 |
| radius.5 | `borderRadius: 5` | 1 |
| border.1_5 | `borderTopWidth: 1.5`, `borderWidth: 1.5` | 4 |
| size.touch | `minHeight: 44` | 2 |
| color.border | `border-border` | 1 |
| color.surfaceSunken | `bg-surface-sunken` | 1 |
| color.focus | `focus-within:border-focus`, `ring-focus` | 2 |
| color.text | `text-text` | 1 |
| color.textMuted | `text-text-muted`, `placeholder:text-text-muted`, `border-text-muted` | 6 |
| radius.control | `rounded-control` | 2 |

Tailwind default classes (no token): `gap-1` 1, `border` 8, `min-h-11` 1, `min-w-11` 1, `text-xs` 1.

#### Platform notes

none in source. `role="searchbox"` is passed on the `TextInput`. Export conditions: `types`, `react-native`, `default`, same file.

#### Motion

none in source.

#### Dependencies

- `./shell-keys` (`shellKey`), `../styles` (`joinClasses`), `./inspector-model` (`matchesQuery`).
- External: `react`, `react-native` (`Pressable`, `Text`, `TextInput`, `View`).

#### Example

```tsx example=InspectorSearch
import {useState} from "react";
import {InspectorSearch, matchesQuery} from "@nyc-tron/ui/components/shell/InspectorSearch";

const names = ["Opacity", "Blend mode", "Position"];

export function Example() {
  const [query, setQuery] = useState("");
  const count = names.filter(n => matchesQuery(query, n)).length;
  return <InspectorSearch query={query} onQueryChange={setQuery} label="Search controls" summary={`${count} controls match`}/>;
}
```

#### UNVERIFIED

- UNVERIFIED: that Escape reaches `onKeyPress` on native; the handler reads `shellKey(event)` and only web key events were assumed.
- UNVERIFIED: `normalizeSearchText` (from `overlays/command-filter.ts`), used by `matchesQuery`; not read.

UNVERIFIED count: 2

### InspectorSection

`import {InspectorSection} from "@nyc-tron/ui/components/shell/InspectorSection"`

Source: `packages/ui/src/components/shell/InspectorSection.tsx` (contexts in `inspector-context.ts`, `matchingRowCount` in `inspector-model.ts`).
Tier-1 reason: R3 shell core. Import count: 0 (other packages: 0).

Also exported: type `InspectorSectionProps`.

#### Props

`InspectorSectionProps extends Omit<ViewProps,"children">`. `style` is merged after an optional `{display:"none"}`; the rest spread onto the root `View`, which has `role="group"` and `accessibilityLabel={title}`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| title | `string` | none | yes | Nonblank, at most 512 chars, else `RangeError`. |
| expanded | `boolean` | none | yes | Controlled. A search with matches inside shows it open without changing it. |
| onExpandedChange | `(expanded: boolean) => void` | none | yes | |
| enabled | `boolean` | none | no | Shown as switch value `enabled !== false`. `false` disables every row inside. |
| onEnabledChange | `(enabled: boolean) => void` | none | no | Its presence shows the header switch. |
| onReset | `() => void` | none | no | Shows the Reset button while `modified` is true. |
| modified | `boolean` | `true` when `onReset` is given | no | |
| children | `ReactNode` | none | yes | |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | |

#### Variants

- Nesting depth: from `InspectorSectionContext`; indent is `depth*12` points of leading spacer; only depth 0 gets the `border-b border-border` class.
- `unstyled`: removes classes. With `unstyled=false` on web the switch gets theme colours (`var(--color-primary)`, `var(--color-border)`, `var(--color-surface-raised)`).

#### States

- expanded: `accessibilityState.expanded` and `aria-expanded` on the header button; chevron rotates 45 or -45 degrees; body uses `display:"flex"` or `"none"`.
- disabled (own `enabled===false` or a disabled parent): body gets `aria-disabled` and `opacity:0.55`; title uses `text-text-muted`; the switch and Reset are disabled when the parent is disabled.
- searching: with a nonblank panel query, the section opens if it has matches and hides (`display:"none"`, still mounted) if it has none.
- modified: Reset button shown when `onReset` exists and `modified` is not false; label "Reset <title>".
- focus: classes `focus-visible:ring-2 focus-visible:ring-focus` on the header and Reset buttons; Reset has `hover:bg-surface-sunken`.
- loading, error: no code.

#### Tokens

| Token | Replaces | Count |
|---|---|---|
| space.1 | `paddingHorizontal: 4`, `gap: 4`, `marginHorizontal: 4` | 3 |
| border.1_5 | `borderRightWidth: 1.5`, `borderBottomWidth: 1.5` | 2 |
| size.touch | `minHeight: 44` (2), `minWidth: 44` (1) | 3 |
| opacity.0_55 | `opacity 0.55` | 1 |
| color.border | `border-border` | 1 |
| color.focus | `ring-focus` | 2 |
| color.textMuted | `text-text-muted`, `border-text-muted` | 3 |
| color.text | `text-text` | 1 |
| color.surfaceSunken | `hover:bg-surface-sunken` | 1 |
| radius.control | `rounded-control` | 2 |

No token: 7 by 7 chevron, 12 per indent level, `paddingBottom: 6`.
Tailwind default classes (no token): `border` 5, `min-h-11` 2, `gap-2` 1, `text-sm` 1, `font-semibold` 1, `min-w-11` 1, `px-2` 1, `text-xs` 1.

#### Platform notes

- `Platform.OS==="web"`: the switch gets the CSS-variable colours and its wrapper `Pressable` gets `direction:"ltr"` because the RN Web switch thumb uses physical offsets. Native switches keep platform colours.
- Indent uses a leading spacer instead of `paddingStart`, for RN Web RTL.
- Export conditions: `types`, `react-native`, `default`, same file.

#### Motion

none in source. The chevron rotation is a static transform with no animation.

#### Dependencies

- `./inspector-context` (`InspectorPanelContext`, `InspectorSectionContext`), `./inspector-model` (`matchingRowCount`), `../styles` (`joinClasses`).
- External: `react`, `react-native` (`Platform`, `Pressable`, `Switch`, `Text`, `View`), `zustand` and `zustand/vanilla` (optional peer).
- Outside an `InspectorPanel` it uses an empty registry, so nothing filters.

#### Example

```tsx example=InspectorSection
import {useState} from "react";
import {Text} from "react-native";
import {InspectorSection} from "@nyc-tron/ui/components/shell/InspectorSection";

export function Example() {
  const [expanded, setExpanded] = useState(true);
  const [enabled, setEnabled] = useState(true);
  return (
    <InspectorSection title="Shadow" expanded={expanded} onExpandedChange={setExpanded}
      enabled={enabled} onEnabledChange={setEnabled} onReset={() => {}} modified>
      <Text>Rows</Text>
    </InspectorSection>
  );
}
```

#### UNVERIFIED

- UNVERIFIED: how `PropertyRow` consumes `InspectorSectionContext.disabled` and registers rows; `PropertyRow.tsx` was not read.
- UNVERIFIED: the header switch on iOS and Android, where `Switch` renders natively and its 44 point wrapper is a separate `Pressable` with `accessible={false}`; screen reader focus order was not run.

UNVERIFIED count: 2

### KeyboardShortcutHUD
`import {KeyboardShortcutHUD} from "@nyc-tron/ui/components/shell/KeyboardShortcutHUD"`
Source: `packages/ui/src/components/shell/KeyboardShortcutHUD.tsx` (types from `shortcut-model.ts`). Tier-1 reason: R3 shell core. Import count: 0.

The file also exports `isApplePlatform()` (a function, not a component), re-exports `bindingFromChord` and `commandForChord`, and re-exports the types `Binding`, `ChordRecorder`, `KeyChord`, `ShortcutCommand`.

#### Props
| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | `string` | `"shortcuts"` | no | Part of the reset boundary `[scope, revision, visible]`; a change clears query, recording and errors. |
| revision | `string \| number` | `0` | no | Same boundary. |
| usableRegions | `readonly Rect2D[]` | window rectangle | no | The sheet is placed with `placePopover` (560 by 560, margin 16) inside the first usable region. If `hasUsableRegion` is false the Modal is not visible. |
| visible | `boolean` | none | yes | Modal `visible` is `visible && region exists`. |
| onDismiss | `() => void` | none | yes | Called by the backdrop, the Close button and Modal `onRequestClose` when nothing is recording. |
| commands | `readonly ShortcutCommand[]` | none | yes | Checked by `validateShortcutCommands` on every render. |
| onRebind | `(id: string, binding: Binding \| undefined) => void` | none | no | Without it the list is read-only. A conflict calls it twice: first `(conflictId, undefined)`, then `(id, binding)`. |
| recorder | `ChordRecorder` | none | no | Hardware key source for iOS and Android. Ignored on web. |
| apple | `boolean` | `isApplePlatform()` | no | Selects Apple keycaps and the wording of the modifier error. |
| title | `string` | `"Keyboard shortcuts"` | no | Heading text and the Modal `aria-label`. |
| className | `string` | none | no | Joined onto the sheet container. |
| unstyled | `boolean` | `false` | no | Drops every class string the component adds. |

`ShortcutCommand` (shortcut-model.ts):
| Field | Type | Required | Notes |
|---|---|---|---|
| id | `string` | yes | |
| label | `string` | yes | |
| group | `string` | no | Section heading. |
| binding | `Binding` (string such as `"Mod+Shift+S"`) | no | Shown as keycaps, or "Not set". |
| defaultBinding | `Binding` | no | "Reset" restores it. |
| keywords | `readonly string[]` | no | Extra search words. |

`ChordRecorder` has one method, `startRecording(onChord): {remove(): void}`. `KeyChord` has `key` and optional `ctrlKey`, `metaKey`, `altKey`, `shiftKey`.

#### Variants
none. `unstyled` is the only styling switch.

#### States
- default: list of commands grouped by `group`.
- empty (search): text `No command matches "<query>".` when the filter leaves nothing; the search summary reads "No shortcuts match".
- rebindable vs read-only: "Change" and "Reset" buttons render only when `onRebind` is set and (`Platform.OS==="web"` or `recorder` is set). "Reset" renders only when `defaultBinding` differs from `binding`.
- recording: the row shows a focusable field with `accessibilityLabel` "Recording a shortcut for <label>. Press the keys, or Escape to cancel." and class `border-2 border-focus` when styled.
- error: text in `accessibilityLiveRegion="assertive"`, class `text-danger`, when the binding has no Ctrl, Alt or Command (function keys excepted).
- conflict: assertive live-region text naming the other command, with "Replace" and "Cancel" buttons.
- hidden: `visible` false, or no usable region.
- focus: `focus-visible:ring-2 focus-visible:ring-focus` on the small buttons; focus returns through `useRestoreFocus(visible && region)`.
- hover: `hover:bg-surface-sunken` on the small buttons.

#### Tokens
- Colour classes: color.text (9), color.textMuted (5), color.border (3), color.surfaceSunken (3), color.focus (2), color.danger (1), color.primary (1), color.onPrimary (1), color.surfaceRaised (1).
- Radius classes: radius.control (3), radius.card (1).
- Spacing literals: space.0.75 (gap 3, 1), space.0.5 (paddingVertical 2, 1), space.1 (paddingVertical 4 x2, gap 4 x2, paddingTop 4 x1), space.1.5 (gap 6, 1), space.2 (gap 8 x3, paddingTop 8 x2), space.2.5 (paddingHorizontal 10, 1), space.4 (padding 16 x1, paddingHorizontal 16 x3, paddingBottom 16 x1, paddingVertical 16 x1).
- border.1_5 (borderTopWidth 1.5, 2). size.touch (minHeight 44, 2).
- Component-level: HUD.space.1_25 (paddingHorizontal 5, 1).
- no token: minWidth 22 (1), minWidth 140 (1).
- Tailwind default classes (no token): rounded-control, rounded-card, border, border-2, text-xs, text-sm, text-base, min-h-11, min-w-11, px-2, font-semibold, shadow-md.

#### Platform notes
- `Platform.OS==="web"`: enables rebinding without `recorder`; recording reads the browser `onKeyDown`; prompt text is "Press the new shortcut, or Esc to cancel".
- iOS and Android: rebinding needs `recorder`; prompt text is "Press the new shortcut on the hardware keyboard, or Esc to cancel"; Escape is read from the recorder chord.
- `isApplePlatform()`: true for `Platform.OS` "ios" or "macos", or when `navigator.platform`/`userAgent` matches `/Mac|iPhone|iPad/`.
- The Modal sets `accessibilityViewIsModal` and `aria-label`; a comment says React Native Web makes the Modal the dialog.
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/KeyboardShortcutHUD.js`.

#### Motion
none in source (`Modal animationType="none"`).

#### Dependencies
- Internal: `../overlays/popover-position.ts` (`placePopover`, `hasUsableRegion`), `../overlays/focus-restore.ts` (`useRestoreFocus`), `../styles.ts` (`joinClasses`), `./InspectorSearch.tsx`, `./inspector-model.ts` (`matchesQuery`), `./shell-keys.ts` (`shellKey`), `./shortcut-model.ts`.
- External: `react`, `react-native` (Modal, Platform, Pressable, ScrollView, Text, View, useWindowDimensions), `zustand` and `zustand/vanilla`.
- Optional peers: `zustand` (optional in package.json peerDependenciesMeta); `@nyc-tron/core` (optional; the overlay helpers re-export from it).

#### Example
```tsx example=KeyboardShortcutHUD
import {useState} from "react";
import {KeyboardShortcutHUD,type ShortcutCommand} from "@nyc-tron/ui/components/shell/KeyboardShortcutHUD";

const initial:ShortcutCommand[]=[
  {id:"save",label:"Save",group:"File",binding:"Mod+S",defaultBinding:"Mod+S"},
  {id:"export",label:"Export",group:"File",binding:"Mod+Shift+E",defaultBinding:"Mod+Shift+E",keywords:["render"]},
];
export const Example=()=>{
  const [visible,setVisible]=useState(true);
  const [commands,setCommands]=useState(initial);
  return <KeyboardShortcutHUD visible={visible} onDismiss={()=>setVisible(false)} commands={commands}
    onRebind={(id,binding)=>setCommands(cs=>cs.map(c=>c.id===id?{...c,binding}:c))}/>;
};
```

#### UNVERIFIED
- UNVERIFIED: screen reader output of the keycap group label and the live-region messages; it depends on the platform accessibility stack.
- UNVERIFIED: behaviour of `InspectorSearch`, `useRestoreFocus` and `placePopover`; read only as call sites.
- UNVERIFIED: whether `@nyc-tron/hardware-keys` (named in a doc comment as a `recorder` source) exists or behaves as described; it was not read.
UNVERIFIED count: 3

### MenuButton
`import {MenuButton} from "@nyc-tron/ui/components/shell/MenuButton"`
Source: `packages/ui/src/components/shell/MenuButton.tsx`. Tier-1 reason: R3 shell core; R4 imported by 13 files. Import count: 13.

#### Props
Extends `PressableProps` minus `children`, `onPress`, `accessibilityLabel`, `aria-label`. Other PressableProps are spread onto the Pressable (`{...rest}`) before the component's own props, so `accessibilityRole`, `accessibilityState`, `aria-haspopup`, `aria-expanded`, `disabled`, `onPress` and `className` set by the component win. `style` and `testID` are read: `style` is forwarded, `testID` yields `<testID>-popover` on the popover.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| label | `string` | none | yes | Becomes `accessibilityLabel` and the popover label. |
| editScope | `string` | `"menu"` | no | Throws `RangeError` if blank or over 32768 characters. A change closes the menu. |
| items | `readonly CommandMenuItem[]` | none | yes | |
| onSelect | `(id: string) => void` | none | yes | Called only for an enabled item while the menu is still owned. |
| children | `ReactNode` | none | yes | Button content. |
| usableRegions | `readonly Rect2D[]` | window rectangle | no | |
| menuWidth | `number` | `240` | no | Passed as `width` to `CommandPopover`. |
| disabled | `boolean` | `false` | no | Also disabled when no item is enabled or no usable region exists. |
| className | `string` | none | no | Appended last to the class list. |
| unstyled | `boolean` | `false` | no | Drops `rounded-control` and the focus ring. |
| ref | `Ref<ComponentRef<typeof Pressable>>` | none | no | Function or object ref is filled with the Pressable node. |

`CommandMenuItem` (core/overlays.ts): `{id: string; label: string; description?: string; disabled?: boolean; danger?: boolean}`.

#### Variants
none.

#### States
- default: closed button.
- disabled: `accessibilityState.disabled` is true and `disabled` is passed to Pressable when `disabled`, no enabled item, or no usable region; class `opacity-40`.
- expanded: `aria-expanded` and `accessibilityState.expanded` are true while the popover is open.
- focus: `focus-visible:ring-2 focus-visible:ring-focus` when styled.
- opening: `onPress` and ArrowDown (without Alt, Ctrl, Meta) measure the button with `measureInWindow` and open the popover only if width and height are positive.

#### Tokens
- color.focus (1), radius.control (1).
- Tailwind default classes (no token): min-h-11, min-w-11, rounded-control, opacity-40.

#### Platform notes
- When the popover closes, focus returns to the button explicitly only if `String(Platform.OS)` is `"qnx"` or `"marathon"`. Other platforms rely on whatever `CommandPopover` does.
- ArrowDown opening is attached through `onKeyDown`, which React Native delivers on web.
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/MenuButton.js`.

#### Motion
none in source.

#### Dependencies
- Internal: `../overlays/CommandPopover.tsx` (`CommandPopover`, type `CommandMenuItem`), `../overlays/popover-position.ts`, `../styles.ts`, `./shell-keys.ts`.
- External: `react`, `react-native` (Platform, Pressable, useWindowDimensions), `zustand`, `zustand/vanilla`.
- Optional peers: `zustand`, `@nyc-tron/core`.

#### Example
```tsx example=MenuButton
import {Text} from "react-native";
import {MenuButton} from "@nyc-tron/ui/components/shell/MenuButton";

export const Example=()=><MenuButton label="Panel options" items={[
  {id:"rename",label:"Rename"},
  {id:"delete",label:"Delete",danger:true},
]} onSelect={id=>console.log(id)}><Text>Options</Text></MenuButton>;
```

#### UNVERIFIED
- UNVERIFIED: popover placement, dismissal and focus handling outside qnx/marathon; they live in `CommandPopover`, which was not read.
- UNVERIFIED: whether `measureInWindow` exists on every target; the code skips opening if it is missing.
UNVERIFIED count: 2

### PaneSplitter
`import {PaneSplitter} from "@nyc-tron/ui/components/shell/PaneSplitter"`
Source: `packages/ui/src/components/shell/PaneSplitter.tsx` (types from `splitter-model.ts`). Tier-1 reason: R3 shell core. Import count: 1.

Also exports the type `SplitAxis` (`"horizontal" | "vertical"`).

#### Props
Extends `ViewProps` minus `children`. Read or forwarded specially: `style` (merged into the root style array), `onLayout` (called after the component stores its size). Remaining ViewProps spread onto the root View.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| editScope | `string` | none | no | Throws `RangeError` if blank or over 16384 characters. Part of the interaction scope; a change cancels a drag. |
| disabled | `boolean` | `false` | no | |
| axis | `SplitAxis` | none | yes | `horizontal`: panes side by side. `vertical`: stacked. |
| start | `ReactNode` | none | yes | |
| end | `ReactNode` | none | yes | |
| size | `number` | none | yes | Controlled size in points of the pane named by `sizeEdge`. |
| sizeEdge | `"start" \| "end"` | `"start"` | no | |
| onPreview | `(size: number) => void` | none | no | During drag; also called with the committed `size` on cancel. |
| onCommit | `(size: number) => void` | none | yes | Once per drag, keyboard step, jump or accessibility action. |
| minStart | `number` | `120` | no | Must be finite and not negative. |
| minEnd | `number` | `120` | no | Same. |
| label | `string` | none | yes | `accessibilityLabel` of the divider. |
| features | `readonly FoldFeature[]` | `[]` | no | Hinge features in window space. |
| container | `Rect` | measured | no | Window-space bounds; if omitted and features exist, the component calls `measureInWindow`. |
| isRTL | `boolean` | `false` | no | Horizontal only: start pane is physically on the right. |
| keyboardStep | `number` | `16` | no | Must be above 0. |
| dividerSize | `number` | `9` | no | Not negative. Divider thickness off a hinge. |
| transport | `DragTransport` | `PanResponderDrag` | no | Component type receiving `onBegin`, `onMove`, `onRelease`, `onCancel`, `disabled`. |
| className | `string` | none | no | Root; also `min-h-0 min-w-0`. |
| startClassName | `string` | none | no | |
| endClassName | `string` | none | no | |
| dividerClassName | `string` | none | no | |
| unstyled | `boolean` | `false` | no | |

Non-finite `size`, `minStart`, `minEnd`, `keyboardStep` or `dividerSize` also throw `RangeError`. `FoldFeature` (core/folds.ts): `bounds: Rect`, `orientation: "vertical" | "horizontal"`, `separating: boolean`, `occlusion: "none" | "full"`. `Rect`: `x`, `y`, `width`, `height`.

#### Variants
- `axis`: `horizontal` sets pane width and a vertical divider line (`borderLeftWidth`); `vertical` sets pane height and a horizontal line (`borderTopWidth`); root `flexDirection` is `row` or `column`.
- `sizeEdge`: chooses which pane `size` measures; `onPreview`/`onCommit` report in the same edge.

#### States
- default, disabled (`accessibilityState.disabled`, `aria-disabled`, no accessibility actions, `focusable` false, `tabIndex` -1 on web).
- dragging: preview layout set; divider class `border-accent`, line 3 wide.
- focused: divider class `border-focus`, line 3 wide.
- seated on a hinge: divider class `bg-surface-sunken` when styled.
- idle: `border-border`, line 1 wide.
- before the first layout measurement, no panes render.

#### Tokens
- color.accent (1), color.focus (1), color.border (1), color.surfaceSunken (1).
- Component-level: PaneSplitter.space.n5_5 (marginLeft -22, marginTop -22).
- no token: minWidth 0, minHeight 0, divider widths 9, 44 and 3 / 1, margins -1.5 / -0.5, `DRAG_SNAP` 24.
- Tailwind default classes (no token): border, min-h-0, min-w-0.

#### Platform notes
- `Platform.OS==="web"`: divider gets `role="separator"`, `aria-orientation`, `focusable`, `tabIndex`, `onKeyDown`; `userSelect: "none"` and `cursor` (`col-resize` or `row-resize`) styles apply.
- Other platforms: divider gets `accessibilityRole="adjustable"`; adjustment is through `increment` and `decrement` accessibility actions ("Grow first pane", "Shrink first pane").
- Keys on web: arrows step (direction swaps in RTL), Home and End jump to limits, Escape cancels a drag; events with Alt, Ctrl or Meta are ignored.
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/PaneSplitter.js`.

#### Motion
none in source. A drag snaps within `DRAG_SNAP` (24) of a hinge band.

#### Dependencies
- Internal: `../gestures/drag-controller.ts`, `../gestures/drag-transport.ts`, `../gestures/PanResponderDrag.tsx`, `../styles.ts`, `./shell-keys.ts`, `./splitter-model.ts`.
- External: `react`, `react-native`, `zustand`, `zustand/vanilla`, `@nyc-tron/core/folds` (types `FoldFeature`, `Rect`).
- Optional peers: `zustand`, `@nyc-tron/core`.

#### Example
```tsx example=PaneSplitter
import {useState} from "react";
import {Text} from "react-native";
import {PaneSplitter} from "@nyc-tron/ui/components/shell/PaneSplitter";

export const Example=()=>{
  const [size,setSize]=useState(240);
  return <PaneSplitter axis="horizontal" label="Resize layers panel" size={size} onCommit={setSize}
    start={<Text>Layers</Text>} end={<Text>Canvas</Text>}/>;
};
```

#### UNVERIFIED
- UNVERIFIED: hinge seating and snap results; they come from `splitter-model.ts`, which was not read.
- UNVERIFIED: how `PanResponderDrag` distinguishes touch from mouse and how many pointers it reports.
- UNVERIFIED: screen reader announcements for `aria-valuetext` ("<n> points") and the adjustable role.
UNVERIFIED count: 3

### PresetGallery
`import {PresetGallery} from "@nyc-tron/ui/components/shell/PresetGallery"`
Source: `packages/ui/src/components/shell/PresetGallery.tsx` (filter logic in `preset-model.ts`). Tier-1 reason: R3 shell core. Import count: 0.

Also exports types `Preset`, `PresetFilter` (`"all" | "favorites"`, re-exported from `preset-model.ts`) and `PresetGalleryProps`. `Bookmark` is internal and not exported.

#### Props
Extends `ViewProps` minus `children`. `style` is forwarded to the root; `onLayout` is called after the grid width is stored.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | `string` | `"preset-gallery"` | no | Part of the boundary `[scope, revision, disabled, filter]`. |
| revision | `string \| number` | `0` | no | |
| disabled | `boolean` | `false` | no | |
| label | `string` | none | yes | Name of the radiogroup; the filter group is named `<label> filter`. |
| presets | `readonly Preset[]` | none | yes | Checked by `validatePresets`. |
| selectedId | `string \| undefined` | none | yes | |
| onSelect | `(id: string) => void` | none | yes | |
| onPreview | `(id: string \| undefined) => void` | none | no | Hover or focus gives an id; leaving gives `undefined`. |
| onFavoriteChange | `(id: string, favorite: boolean) => void` | none | no | Its presence adds a favorite toggle to each tile. |
| filter | `PresetFilter` | `"all"` | no | |
| onFilterChange | `(filter: PresetFilter) => void` | none | no | The All / Favorites buttons render only when both this and `onFavoriteChange` are set. |
| minTileWidth | `number` | `112` | no | |
| className | `string` | none | no | Joined after `gap-2`. |
| unstyled | `boolean` | `false` | no | |

`Preset`: `id: string`, `name: string`, `preview: ReactNode`, `favorite?: boolean` (all readonly).

#### Variants
- `filter`: `all` shows every preset; `favorites` passes the list through `filterPresets`. The empty favorites view shows "No favorite presets yet." and "Use the bookmark on a preset to keep it here."; the empty all view shows "No presets.".

#### States
- default tile: padding 4, `hover:bg-surface-sunken`.
- selected tile: `role="radio"` with `aria-checked`, padding 2, classes `border-2 border-focus bg-primary/10`, name in `font-semibold`.
- disabled: `disabled` and `accessibilityState.disabled` on every Pressable; tab stops removed.
- favorite: label gets ", favorite"; bookmark glyph fills; toggle has `aria-pressed`.
- filter button on: `aria-pressed` and `accessibilityState.selected`, classes `bg-surface-raised border border-border`.
- focus: `focus-visible:ring-2 focus-visible:ring-focus`; roving focus index kept in local state.
- empty: see Variants.

#### Tokens
- Colour classes: color.text (6), color.focus (4), color.surfaceRaised (3), color.surfaceSunken (3), color.textMuted (2), color.border (1), color.primary (1), color.accent (1).
- Radius classes: radius.control (3), radius.card (1).
- Spacing: space.1 (gap 4, paddingHorizontal 4), space.0.5 (paddingBottom 2), space.4 (paddingVertical 16).
- radius.2 (borderTopLeftRadius, borderTopRightRadius 2). border.1_5 (borderWidth, borderLeftWidth, borderTopWidth 1.5; 3 uses), border.0 (borderBottomWidth 0).
- Component-level: PresetGallery.border.13 (borderTopWidth 13).
- no token: `GAP` 8 for grid gap, tile `aspectRatio` 4/3, bookmark sizes 14, 18, 22, 8.
- Tailwind default classes (no token): min-h-11, min-w-11, px-3, rounded-control, rounded-card, border, border-2, text-sm, text-xs, font-semibold, gap-1, gap-2.

#### Platform notes
- `Platform.OS==="web"`: tiles get `onKeyDown` and `tabIndex` (0 for one tile, -1 for others), so the grid is one Tab stop with arrow, Home and End movement.
- RTL: arrow direction flips when `nodeIsRTL(target)` or `I18nManager.isRTL`.
- Pointer hover uses `onHoverIn` and `onHoverOut`; focus and blur also drive `onPreview` on all platforms.
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/PresetGallery.js`.

#### Motion
none in source.

#### Dependencies
- Internal: `../styles.ts`, `./shell-keys.ts`, `./preset-model.ts`.
- External: `react`, `react-native` (I18nManager, Platform, Pressable, Text, View), `zustand`, `zustand/vanilla`.
- Optional peers: `zustand`.

#### Example
```tsx example=PresetGallery
import {useState} from "react";
import {View} from "react-native";
import {PresetGallery,type Preset,type PresetFilter} from "@nyc-tron/ui/components/shell/PresetGallery";

const swatch=(c:string)=><View style={{flex:1,backgroundColor:c}}/>;
const presets:Preset[]=[
  {id:"warm",name:"Warm",preview:swatch("#c96")},
  {id:"cool",name:"Cool",preview:swatch("#69c"),favorite:true},
];
export const Example=()=>{
  const [selected,setSelected]=useState<string|undefined>("warm");
  const [filter,setFilter]=useState<PresetFilter>("all");
  return <PresetGallery label="Color grade presets" presets={presets} selectedId={selected} onSelect={setSelected}
    onFavoriteChange={(id,fav)=>console.log(id,fav)} filter={filter} onFilterChange={setFilter}/>;
};
```

#### UNVERIFIED
- UNVERIFIED: column count and keyboard target math; they come from `galleryColumns` and `gridFocusTarget` in `preset-model.ts`, which was not read.
- UNVERIFIED: whether `onHoverIn` and `onHoverOut` fire on touch platforms.
UNVERIFIED count: 2

### PropertyRow
`import {PropertyRow} from "@nyc-tron/ui/components/shell/PropertyRow"`
Source: `packages/ui/src/components/shell/PropertyRow.tsx`. Tier-1 reason: R3 shell core. Import count: 1.

Also exports types `PropertyEditorState`, `PropertyOverride` (`"inherited" | "overridden"`) and `PropertyRowProps`.

#### Props
Extends `ViewProps` minus `children`. `style` is merged after the component's own row style; `onLayout` is wrapped (width is stored, then the handler is called).

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| label | `string` | none | yes | Throws `RangeError` if blank or over 512 characters. |
| children | `ReactNode \| ((state: PropertyEditorState) => ReactNode)` | none | yes | |
| mixed | `boolean` | `false` | no | Shows a "Mixed" badge; adds ", mixed values" to `editorLabel`. |
| override | `PropertyOverride` | none | no | |
| onRevert | `() => void` | none | no | The Revert button shows only with `override="overridden"` and this set. |
| keywords | `readonly string[]` | none | no | At most 256 entries of at most 512 characters, else `RangeError`. |
| disabled | `boolean` | `false` | no | Also disabled by a switched-off `InspectorSection`. |
| stackBelow | `number` | `300` | no | Must be finite and not negative. |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | |

`PropertyEditorState`: `disabled: boolean`, `mixed: boolean`, `editorLabel: string` (all readonly).

#### Variants
- `override`: `overridden` draws a 6 by 6 dot with class `border-accent`, and shows Revert when `onRevert` is set; `inherited` renders the label in italics with `text-text-muted` and adds ", inherited" to `editorLabel`.

#### States
- default; hidden (`display: "none"` when the enclosing `InspectorPanel` query does not match).
- disabled: label uses `text-text-muted`; Revert gets `disabled`; editors get `disabled` through the state object.
- mixed: badge plus label text.
- stacked: label above editor when the measured width is above 0 and below `stackBelow`.
- focus and hover on Revert: `focus-visible:ring-2 focus-visible:ring-focus hover:bg-surface-sunken`.

#### Tokens
- Colour classes: color.textMuted (3), color.accent (1), color.text (1), color.border (1), color.focus (1), color.surfaceSunken (1).
- radius.control (2). Spacing: space.2 (paddingHorizontal 8), space.1 (paddingVertical 4, gap 4), space.1.5 (gap 6). radius.3 (borderRadius 3), border.3 (borderWidth 3). size.touch (minHeight 44).
- no token: minWidth 0 (4), label width `38%`, indent `(depth - 1) * 12`, dot size 6.
- Tailwind default classes (no token): border, text-sm, text-xs, px-1, px-2, rounded-control, min-h-11, min-w-11.

#### Platform notes
none in source.

#### Motion
none in source.

#### Dependencies
- Internal: `../styles.ts`, `./inspector-context.ts` (`InspectorPanelContext`, `InspectorSectionContext`), `./inspector-model.ts` (`matchesQuery`, `registerRow`). Docs name `InspectorPanel` and `InspectorSection` as the enclosing components.
- External: `react` (`use`, `useId`, `useEffect`, `useRef`, `useLayoutEffect`), `react-native` (Pressable, Text, View), `zustand`, `zustand/vanilla`.
- Optional peers: `zustand`.

#### Example
```tsx example=PropertyRow
import {Text} from "react-native";
import {PropertyRow} from "@nyc-tron/ui/components/shell/PropertyRow";

export const Example=()=><PropertyRow label="Opacity" override="overridden" onRevert={()=>{}} keywords={["alpha"]}>
  {state=><Text accessibilityLabel={state.editorLabel}>{state.mixed?"Mixed":"80%"}</Text>}
</PropertyRow>;
```

#### UNVERIFIED
- UNVERIFIED: search matching and row registration; they live in `inspector-model.ts`, which was not read.
- UNVERIFIED: screen reader output of the group `accessibilityLabel` set to `editorLabel`.
UNVERIFIED count: 2

### RangeSlider
`import {RangeSlider} from "@nyc-tron/ui/components/shell/RangeSlider"`
Source: `packages/ui/src/components/shell/RangeSlider.tsx` (math in `slider-model.ts`, `forge/inputs/precision.ts`). Tier-1 reason: R3 shell core. Import count: 0.

Also exports types `RangeSliderProps`, `RangeThumb` (`"low" | "high"`), `RangeValue` (`[number, number]`, re-exported from `slider-model.ts`).

#### Props
Extends `ViewProps` minus `children`, and `RangeConfig`. `style` is merged after the opacity style; other ViewProps spread onto the root.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| min | `number` | none | yes | From `RangeConfig`. `assertRange` throws unless finite, `max > min`, `step > 0`. |
| max | `number` | none | yes | |
| step | `number` | none | yes | |
| detents | `readonly number[]` | none | no | |
| scope | `string` | `"RangeSlider"` | no | Blank or over 512 characters throws `RangeError`. |
| revision | `string \| number` | `0` | no | |
| label | `string` | none | yes | Blank throws. |
| value | `RangeValue` | none | yes | Normalised with `normalizeRange` and `minGap`. |
| onPreview | `(value: RangeValue) => void` | none | no | |
| onCommit | `(value: RangeValue) => void` | none | yes | Once per drag, key press, typed endpoint or accessibility action. |
| minGap | `number` | `0` | no | |
| thumbLabels | `readonly [string, string]` | `["Minimum", "Maximum"]` | no | Thumb names are `<label> <thumbLabel>`. |
| unit | `string` | none | no | Appended to `aria-valuetext`; drawn as text only when `context` is absent. |
| context | `UnitContext` | none | no | Enables typed unit arithmetic in the endpoint fields. |
| disabled | `boolean` | `false` | no | |
| hideLabel | `boolean` | `false` | no | Hides the visible label; the group keeps `accessibilityLabel`. |
| transport | `DragTransport` | `PanResponderDrag` | no | |
| className | `string` | none | no | Joined after `gap-1`. |
| unstyled | `boolean` | `false` | no | |

#### Variants
none.

#### States
- default; disabled (root opacity 0.5, `aria-disabled`, `accessibilityState.disabled`, no accessibility actions, `focusable` false).
- dragging: preview value shown; the nearer thumb moves.
- focused thumb: classes `ring-2 ring-focus` on that thumb.
- Each thumb is `adjustable` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`, and increment and decrement actions.

#### Tokens
- Colour classes: color.accent (2), color.surfaceRaised (1), color.focus (1), color.text (1), color.border (1), color.surfaceSunken (1), color.textMuted (1).
- radius.control (1). opacity.0_5 (disabled). border.2 (thumb borderWidth), border.4 (fill borderTopWidth). space.2 (gap 8), space.3 (paddingBottom 12). size.touch (minHeight 44).
- Component-level: RangeSlider.space.n5_5 (marginHorizontal -22), RangeSlider.space.5_5 (paddingHorizontal 22), RangeSlider.radius.11 (borderRadius 11).
- no token: minWidth 96, minHeight 24, thumb size 22, track height 6 and `top: 19`.
- Tailwind default classes (no token): border, gap-1, text-sm, text-xs, rounded-control.

#### Platform notes
- `Platform.OS==="web"`: track wrapper gets `cursor` and `userSelect: "none"`.
- RTL: `I18nManager.isRTL` or `nodeIsRTL(track)` reverses arrow keys and the offset-to-value mapping.
- Keyboard events come from `onKeyDown` (web); Escape cancels a drag; Ctrl and Meta combinations are ignored.
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/RangeSlider.js`.

#### Motion
none in source.

#### Dependencies
- Internal: `../forge/inputs/precision.ts`, `../gestures/drag-controller.ts`, `../gestures/drag-transport.ts`, `../gestures/PanResponderDrag.tsx`, `../styles.ts`, `./shell-keys.ts`, `./slider-model.ts`, `./UnitInput.tsx`, `./unit-expression.ts` (type `UnitContext`).
- External: `react`, `react-native`, `zustand`, `zustand/vanilla`.
- Optional peers: `zustand`.

#### Example
```tsx example=RangeSlider
import {useState} from "react";
import {RangeSlider,type RangeValue} from "@nyc-tron/ui/components/shell/RangeSlider";

export const Example=()=>{
  const [value,setValue]=useState<RangeValue>([20,80]);
  return <RangeSlider label="Opacity range" min={0} max={100} step={1} minGap={5} unit="%" value={value} onCommit={setValue}/>;
};
```

#### UNVERIFIED
- UNVERIFIED: key-to-action mapping (step sizes for Shift, Alt, PageUp); it lives in `sliderKeyAction` in `slider-model.ts`, not read.
- UNVERIFIED: behaviour of `UnitInput`, including how a typed value is parsed.
- UNVERIFIED: pointer handling in `PanResponderDrag`.
UNVERIFIED count: 3

### RibbonTabs
`import {RibbonTabs} from "@nyc-tron/ui/components/shell/RibbonTabs"`
Source: `packages/ui/src/components/shell/RibbonTabs.tsx` (data types in `ribbon-model.ts`). Tier-1 reason: R3 shell core. Import count: 0.

Exports one component, `RibbonTabs`, plus the type `RibbonTabsProps` and type re-exports `RibbonButton`, `RibbonCommand`, `RibbonGallery`, `RibbonGalleryItem`, `RibbonGroup`, `RibbonSplit`, `RibbonTab`. The inner `Gallery` component is not exported.

#### Props
Extends `ViewProps` minus `children`. `style` is forwarded to the root; others spread onto it.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | `string` | `"ribbon"` | no | Boundary is `[scope, revision, disabled, active tab id, collapsed]`. |
| revision | `string \| number` | `0` | no | |
| disabled | `boolean` | `false` | no | |
| tabs | `readonly RibbonTab[]` | none | yes | `validateRibbon` throws on over 64 tabs, duplicate ids, empty labels or an invalid gallery selection. |
| activeTabId | `string` | none | yes | Falls back to the first tab if it matches none. |
| onTabChange | `(id: string) => void` | none | yes | |
| onCommand | `(commandId: string, itemId?: string) => void` | none | yes | `itemId` is set for split flyout and gallery picks. |
| collapsed | `boolean` | `false` | no | Hides the command panel. |
| onCollapsedChange | `(collapsed: boolean) => void` | none | no | The collapse chevron renders only when set. |
| label | `string` | `"Ribbon"` | no | Name of the tab list. |
| usableRegions | `readonly Rect2D[]` | none | no | Passed to split flyouts and the gallery "More" menu. |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | |

Model types, one level: `RibbonTab {id, label, contextualGroup?, groups: RibbonGroup[]}`; `RibbonGroup {id, label, commands: RibbonCommand[]}`; `RibbonButton {kind:"button", id, label, icon?, pressed?, disabled?}`; `RibbonSplit {kind:"split", id, label, icon?, items: CommandMenuItem[], disabled?}`; `RibbonGallery {kind:"gallery", id, label, items: RibbonGalleryItem[], selectedId?, inline? (default 4 per doc comment)}`; `RibbonGalleryItem {id, label, preview: ReactNode}`.

#### Variants
- Command `kind`: `button` renders a Pressable, a toggle when `pressed` is defined; `split` renders a `SplitButton`; `gallery` renders inline radio items plus a "More" `MenuButton` when `items.length` exceeds the inline count.
- `contextualGroup` on a tab: shows the group name above the tab in `text-accent` and gives the tab `border-t-2 border-accent`.

#### States
- tab selected: `accessibilityState.selected` and `aria-selected` true only when the tab is active and the panel is not collapsed; label `text-text font-semibold`, 3-wide `border-primary` rule.
- tab roving focus: web `tabIndex` 0 on the selected tab, -1 on the rest.
- disabled: `disabled` on tabs and commands; per-command `disabled` adds `opacity-40`.
- toggle pressed: `aria-pressed`, `accessibilityState.selected`, classes `bg-primary/10 border border-focus`.
- collapsed: panel not rendered; collapse button has `aria-expanded`, label "Show ribbon commands" or "Hide ribbon commands". Picking a tab while collapsed calls `onCollapsedChange(false)`.
- gallery item: `role="radio"`, `aria-checked`, classes `border border-focus bg-primary/10` when selected.
- focus and hover: `focus-visible:ring-2 focus-visible:ring-focus`, `hover:bg-surface-sunken`.

#### Tokens
- Colour classes: color.focus (6), color.textMuted (4), color.primary (3), color.border (3), color.surfaceSunken (2), color.text (2), color.accent (2), color.surfaceRaised (1).
- radius.control (3).
- Spacing: space.0.5 (gap 2 x3, paddingTop 2 x1), space.1 (paddingHorizontal 4, padding 4, gap 4 x3, marginVertical 4), space.3 (paddingHorizontal 12), space.1.5 (paddingHorizontal 6).
- border.1_5 (borderRightWidth, borderBottomWidth), border.1 (borderLeftWidth).
- no token: tab rule height 3, chevron size 8.
- Tailwind default classes (no token): min-h-11, min-w-11, gap-2, px-2, px-3, rounded-control, border, opacity-40, text-sm, text-xs, font-semibold.

#### Platform notes
- `Platform.OS==="web"`: tabs and gallery items get `onKeyDown` and `tabIndex`; arrow keys move focus and also select the tab (or gallery item) through `rovingTarget`.
- RTL: `nodeIsRTL(target)` or `I18nManager.isRTL` passed to `rovingTarget`.
- Tab list and panel scroll horizontally with `ScrollView` on all platforms.
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/RibbonTabs.js`.

#### Motion
none in source.

#### Dependencies
- Internal: `../overlays/popover-position.ts` (type), `../styles.ts`, `./MenuButton.tsx`, `./SplitButton.tsx`, `./shell-keys.ts`, `./ribbon-model.ts`.
- External: `react`, `react-native` (I18nManager, Platform, Pressable, ScrollView, Text, View).
- Optional peers: none for this file directly; `MenuButton` pulls in `zustand` (optional peer).

#### Example
```tsx example=RibbonTabs
import {useState} from "react";
import {RibbonTabs,type RibbonTab} from "@nyc-tron/ui/components/shell/RibbonTabs";

const tabs:RibbonTab[]=[
  {id:"home",label:"Home",groups:[{id:"clip",label:"Clipboard",commands:[
    {kind:"button",id:"paste",label:"Paste"},
    {kind:"button",id:"bold",label:"Bold",pressed:false},
    {kind:"split",id:"export",label:"Export",items:[{id:"pdf",label:"PDF"},{id:"png",label:"PNG"}]},
  ]}]},
  {id:"insert",label:"Insert",groups:[]},
];
export const Example=()=>{
  const [active,setActive]=useState("home");
  const [collapsed,setCollapsed]=useState(false);
  return <RibbonTabs tabs={tabs} activeTabId={active} onTabChange={setActive} onCommand={(id,item)=>console.log(id,item)}
    collapsed={collapsed} onCollapsedChange={setCollapsed}/>;
};
```

#### UNVERIFIED
- UNVERIFIED: `rovingTarget` return values for each key; `shell-keys.ts` was not read.
- UNVERIFIED: screen reader output for `tablist`, `tab` and `tabpanel` roles on native.
- UNVERIFIED: how many inline gallery items show (`inlineGalleryItems` was not read; the default 4 is from a doc comment).
UNVERIFIED count: 3

### RotaryKnob
`import {RotaryKnob} from "@nyc-tron/ui/components/shell/RotaryKnob"`
Source: `packages/ui/src/components/shell/RotaryKnob.tsx` (math in `slider-model.ts`). Tier-1 reason: R3 shell core. Import count: 0.

Also exports types `KnobInput` (`"relative" | "circular"`) and `RotaryKnobProps`.

#### Props
Extends `ViewProps` minus `children`, and `RangeConfig`. `style` is merged after the opacity style.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| min | `number` | none | yes | `RangeConfig`; invalid range throws `RangeError`. |
| max | `number` | none | yes | |
| step | `number` | none | yes | |
| detents | `readonly number[]` | none | no | |
| scope | `string` | `"RotaryKnob"` | no | |
| revision | `string \| number` | `0` | no | |
| label | `string` | none | yes | Blank throws. |
| value | `number` | none | yes | Must be finite. |
| onPreview | `(value: number) => void` | none | no | |
| onCommit | `(value: number) => void` | none | yes | |
| input | `KnobInput` | `"relative"` | no | Any other value throws. |
| defaultValue | `number` | none | no | Must be finite and within min and max. Reset button shows when it differs from `value`. |
| unit | `string` | none | no | |
| context | `UnitContext` | none | no | |
| size | `number` | `72` | no | Must be finite, above 0 and at most 4096. Dial is `max(44, size)`. |
| disabled | `boolean` | `false` | no | |
| hideLabel | `boolean` | `false` | no | |
| transport | `DragTransport` | `PanResponderDrag` | no | |
| className | `string` | none | no | Joined after `items-center gap-1`. |
| unstyled | `boolean` | `false` | no | |

#### Variants
- `input="relative"`: vertical travel sets the value; sideways travel beyond 28 points from the start switches to fine adjustment and shows "Fine adjustment". Hint: "Drag up to raise the value. Move sideways while dragging for fine control."
- `input="circular"`: value follows the pointer angle around the dial centre. Hint: "Turn around the knob to set the value."

#### States
- default; disabled (root opacity 0.5, `aria-disabled`, no accessibility actions).
- dragging: dial border `border-accent`.
- focused: dial border `border-focus`; otherwise `border-border`.
- fine: caption text while fine adjustment is active.
- resettable: "Reset" button with label "Reset <label>".
- Dial is `adjustable` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`.

#### Tokens
- Colour classes: color.textMuted (3), color.surfaceSunken (2), color.accent (2), color.focus (2), color.text (1), color.border (1).
- radius.control (1). opacity.0_5. space.1.5 (marginTop 6), space.1 (gap 4). border.3 (indicator borderLeftWidth).
- no token: `FINE_HOLD_PX` 28, default size 72, indicator height `dialSize * 0.28`, input width 72 or 104.
- Tailwind default classes (no token): gap-1, text-sm, text-xs, border, border-2, min-h-11, min-w-11, px-2, rounded-control.

#### Platform notes
- `Platform.OS==="web"`: dial gets `cursor` (`grab`), `userSelect: "none"`, `touchAction: "none"`.
- Arrow keys do not flip in RTL (code comment: a knob turns clockwise for Right and Up).
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/RotaryKnob.js`.

#### Motion
none in source. The indicator is rotated by `knobAngle` through a `transform` with no animation.

#### Dependencies
- Internal: `../forge/inputs/precision.ts`, `../gestures/*`, `../styles.ts`, `./shell-keys.ts`, `./slider-model.ts`, `./UnitInput.tsx`, `./unit-expression.ts`.
- External: `react`, `react-native`, `zustand`, `zustand/vanilla`.
- Optional peers: `zustand`.

#### Example
```tsx example=RotaryKnob
import {useState} from "react";
import {RotaryKnob} from "@nyc-tron/ui/components/shell/RotaryKnob";

export const Example=()=>{
  const [gain,setGain]=useState(0);
  return <RotaryKnob label="Gain" min={-24} max={24} step={0.5} unit="dB" defaultValue={0} value={gain} onCommit={setGain}/>;
};
```

#### UNVERIFIED
- UNVERIFIED: the angle sweep and the bottom-gap hold; they live in `knobAngle`, `valueFromAngle` and `angleAround`, not read.
- UNVERIFIED: the doc comment says apps that detect a stylus pass `circular`; nothing in this file detects a stylus.
- UNVERIFIED: screen reader output for the adjustable role and hint.
UNVERIFIED count: 3

### SliderField
`import {SliderField} from "@nyc-tron/ui/components/shell/SliderField"`
Source: `packages/ui/src/components/shell/SliderField.tsx` (math in `slider-model.ts`). Tier-1 reason: R3 shell core. Import count: 2 (plus 1 in other packages).

Also exports the type `SliderFieldProps`.

#### Props
Extends `ViewProps` minus `children`, and `RangeConfig`. `style` is merged after the opacity style; `testID` also yields `<testID>-track` on the track.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| min | `number` | none | yes | `RangeConfig`. |
| max | `number` | none | yes | |
| step | `number` | none | yes | |
| detents | `readonly number[]` | none | no | |
| scope | `string` | `"SliderField"` | no | |
| revision | `string \| number` | `0` | no | |
| label | `string` | none | yes | |
| value | `number` | none | yes | Must be finite. |
| onPreview | `(value: number) => void` | none | no | During drag. |
| onCommit | `(value: number) => void` | none | yes | |
| defaultValue | `number` | none | no | Finite, within range. Shows Reset when different from `value`. |
| unit | `string` | none | no | Ignored (not drawn) when `context` is given; always appended to `aria-valuetext`. |
| context | `UnitContext` | none | no | |
| disabled | `boolean` | `false` | no | |
| hideLabel | `boolean` | `false` | no | An empty flex spacer replaces the label text. |
| transport | `DragTransport` | `PanResponderDrag` | no | |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | |

#### Variants
none.

#### States
- default; disabled (opacity 0.5, `aria-disabled`, no actions, `focusable` false).
- dragging: preview value shown on thumb and field.
- focused: class `ring-2 ring-focus` on the track.
- resettable: Reset button.
- Track is `adjustable` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`.

#### Tokens
- Colour classes: color.text (1), color.focus (2), color.surfaceSunken (2), color.textMuted (2), color.border (1), color.accent (2), color.surfaceRaised (1).
- radius.control (3). opacity.0_5. space.2 (gap 8), space.3.5 (paddingHorizontal 14). border.4 (fill), border.2 (thumb). size.touch (minHeight 44, 2 uses).
- Component-level: SliderField.radius.11 (borderRadius 11).
- no token: thumb 22, track height 6, input width 80 or 104.
- Tailwind default classes (no token): gap-1, text-sm, text-xs, min-h-11, min-w-11, px-2, rounded-control, border.

#### Platform notes
- `Platform.OS==="web"`: track gets `cursor` and `userSelect: "none"`; `onPointerEnter` re-measures.
- RTL: `I18nManager.isRTL` or `nodeIsRTL(track)` mirrors keys and the offset mapping; the fill starts at the reading-direction start.
- Package export: `react-native` and `default` conditions both point at `dist/components/shell/SliderField.js`.

#### Motion
none in source.

#### Dependencies
- Internal: `../forge/inputs/precision.ts`, `../gestures/*`, `../styles.ts`, `./shell-keys.ts`, `./slider-model.ts`, `./UnitInput.tsx`, `./unit-expression.ts`.
- External: `react`, `react-native`, `zustand`, `zustand/vanilla`.
- Optional peers: `zustand`.

#### Example
```tsx example=SliderField
import {useState} from "react";
import {SliderField} from "@nyc-tron/ui/components/shell/SliderField";

export const Example=()=>{
  const [value,setValue]=useState(50);
  return <SliderField label="Opacity" min={0} max={100} step={1} unit="%" defaultValue={100} value={value}
    onPreview={v=>console.log(v)} onCommit={setValue}/>;
};
```

#### UNVERIFIED
- UNVERIFIED: key step sizes (Shift ten, Alt a tenth, PageUp ten) come from a doc comment; `sliderKeyAction` was not read.
- UNVERIFIED: the "second pointer cancels" claim; it depends on the `touches` count `PanResponderDrag` supplies.
- UNVERIFIED: `UnitInput` parsing and display.
UNVERIFIED count: 3

### SplitButton
`import {SplitButton} from "@nyc-tron/ui/components/shell/SplitButton"`
Source: `packages/ui/src/components/shell/SplitButton.tsx`. Tier-1 reason: R3 shell core. Import count: 2 (plus 1 in other packages).

#### Props
Extends `ViewProps` minus `children`. `style` is appended after the opacity style; `testID` yields `<testID>-primary` and `<testID>-menu` on the two parts. Other ViewProps spread onto the group View.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| editScope | `string` | `"split-button"` | no | Combined with `disabled` into the boundary and passed to `MenuButton` as its `editScope`. |
| label | `string` | none | yes | Primary text, primary button name and group `accessibilityLabel`. |
| onPress | `() => void` | none | yes | Skipped when disabled or the boundary changed. |
| items | `readonly CommandMenuItem[]` | none | yes | Flyout items. |
| onSelect | `(id: string) => void` | none | yes | |
| menuLabel | `string` | `` `More ${label} options` `` | no | |
| icon | `ReactNode` | none | no | Wrapped in a `pointerEvents="none"` View. |
| variant | `"primary" \| "secondary"` | `"secondary"` | no | |
| disabled | `boolean` | `false` | no | |
| usableRegions | `readonly Rect2D[]` | none | no | Passed to `MenuButton`. |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | The `MenuButton` is always rendered `unstyled`. |

#### Variants
- `primary`: container `border-primary bg-primary`, text `text-on-primary`, chevron and divider `border-on-primary`, divider opacity 0.4.
- `secondary`: container `border-border bg-surface-raised`, text `text-text`, chevron `border-text`, divider `border-border` at opacity 1, and `hover:bg-surface-sunken` on both buttons.

#### States
- default; disabled (group opacity 0.5; `disabled` on the primary button and the MenuButton).
- focus: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus` on both buttons when styled.
- hover: `hover:bg-surface-sunken`, secondary only.
- menu expanded: reported by the inner `MenuButton` (`aria-expanded`).

#### Tokens
- Colour classes: color.onPrimary (3), color.text (2), color.primary (2), color.border (2), color.focus (2), color.surfaceSunken (1), color.surfaceRaised (1).
- radius.control (1). opacity.0_5 (disabled), opacity.0_4 (primary divider). border.1 (divider), border.1_5 (chevron right and bottom). space `-space.1` (chevron marginTop -4).
- no token: chevron 8 by 8.
- Tailwind default classes (no token): text-sm, font-semibold, border, rounded-control, min-h-11, min-w-11, gap-2, px-3.

#### Platform notes
none in source. Platform handling is inherited from `MenuButton` (qnx and marathon focus return).

#### Motion
none in source.

#### Dependencies
- Internal: `./MenuButton.tsx`, `../overlays/CommandPopover.tsx` (type), `../overlays/popover-position.ts` (type), `../styles.ts`.
- External: `react`, `react-native` (Pressable, Text, View).
- Optional peers: none directly; `MenuButton` uses `zustand` (optional peer).

#### Example
```tsx example=SplitButton
import {SplitButton} from "@nyc-tron/ui/components/shell/SplitButton";

export const Example=()=><SplitButton label="Export" variant="primary" onPress={()=>{}}
  items={[{id:"pdf",label:"PDF"},{id:"png",label:"PNG"}]} onSelect={id=>console.log(id)}/>;
```

#### UNVERIFIED
- UNVERIFIED: how the group `role="group"` plus `accessibilityLabel` is announced next to the inner button of the same name.
- UNVERIFIED: popover behaviour; it lives in `CommandPopover`, which was not read.
UNVERIFIED count: 2

### StatusBar

`import {StatusBar} from "@nyc-tron/ui/components/shell/StatusBar"`
Source: `packages/ui/src/components/shell/StatusBar.tsx` (helpers in `shell/status-model.ts`). Tier-1 reason: R3 shell core. Import count: 0.
Exports: `StatusBar`, `StatusBarProps`, `StatusZoom`, `StatusUnits`, and the re-exported types `SelectionNoun`, `StatusActivity`.

#### Props
`StatusBarProps` extends `Omit<ViewProps,"children">`. The rest spread goes to the root `View`; `style` is appended after the component's own style. `accessibilityLabel="Status"` is set after the spread, so a caller value does not apply.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | `string` | `"status"` | no | Part of the edit boundary string. |
| revision | `string \| number` | `0` | no | Part of the edit boundary string. |
| disabled | `boolean` | `false` | no | Disables both menus and both step buttons; handlers also ignore calls. |
| zoom | `StatusZoom` | none | no | Renders zoom step buttons plus zoom menu. |
| units | `StatusUnits` | none | no | Renders the units menu. |
| selection | `{count:number; noun?:SelectionNoun}` | none | no | Renders the selection summary text. |
| activity | `StatusActivity` | `{kind:"idle"}` | no | Idle, saving, rendering, recording, error. |
| children | `ReactNode` | none | no | Rendered first, before built-in items. |
| usableRegions | `readonly Rect2D[]` | none (doc comment: whole window) | no | Passed to both `MenuButton`s. |
| className | `string` | none | no | Joined onto the root class string. |
| unstyled | `boolean` | `false` | no | Drops all token class strings. |

`StatusZoom` (in StatusBar.tsx): `value:number` (required), `presets?:readonly number[]` (default `[25,50,100,200,400]`), `onChange:(percent:number)=>void` (required), `onFit?:()=>void` (adds a "Fit to window" menu choice).

`StatusUnits`: `value:string`, `options:readonly {value:string;label:string}[]`, `onChange:(value:string)=>void`, all required.

`SelectionNoun` (shell/status-model.ts): `one:string`, `other:string`. `StatusActivity`: `{kind:"idle"}`, `{kind:"saving"}`, `{kind:"rendering";progress?:number;label?:string}`, `{kind:"recording";elapsedMs:number}`, `{kind:"error";message:string}`.

Throws `RangeError("Invalid zoom presets")` for more than 1000 presets, a non-finite or non-positive preset, or duplicates. Throws `RangeError("Invalid status units")` for more than 256 options, an empty or over-long value (256) or label (512), or duplicate values.

#### Variants
none. `unstyled` is a boolean that removes the class strings; it is not a variant union.

#### States
- default: idle activity renders no activity text (`activityAnnouncement` returns an empty string, so nothing is drawn).
- disabled: `disabled` prop. Step buttons get `disabled` and `accessibilityState={{disabled}}`; menus get `disabled`.
- blocked step button: a step button is also disabled when no zoom is given or when `stepZoom` returns the current value (end of presets). It adds `opacity-40`.
- hover: `hover:bg-surface-raised` on step buttons and on both menu triggers.
- focus: `focus-visible:ring-2 focus-visible:ring-focus` on step buttons.
- saving: activity text "Saving".
- rendering: label text (default "Rendering"), a progressbar `View` (`accessibilityRole="progressbar"`, `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow=percent`), a percent text when progress is given. Without progress the fill is 35% wide.
- recording: 8pt dot with `border-danger`, text "Recording", and an elapsed clock with `accessibilityLabel="Elapsed m:ss"`.
- error: `text-danger` text, `numberOfLines={2}`.
- Text nodes for selection and activity set `accessibilityLiveRegion="polite"`.
- pressed: no code (no `active:` class and no pressed style).

#### Tokens
`node tokenuse.mjs` output for this file:
- Colour classes: `color.text` 3, `color.surfaceRaised` 3, `color.border` 2, `color.danger` 2, `color.textMuted` 1, `color.focus` 1, `color.surfaceSunken` 1, `color.accent` 1. Radius class: `radius.control` 2.
- Literals: `columnGap: 12` to `space.3` (1), `gap: 6` to `space.1.5` (1), `borderRadius: 4` to `radius.4` (1), `borderTopWidth: 1.5` and `borderLeftWidth: 1.5` to `border.1_5` (1 each), `borderWidth: 4` and `borderTopWidth: 4` to `border.4` (1 each), `minHeight: 44` and `minWidth: 44` to `size.touch` (1 each).
- no token: `minWidth: 0` (1); other literals not in the tool output: widths 12, 8 and 96, heights 6, 8 and 12.
- Tailwind default classes (no token): `text-xs` 3, `min-h-11` 1, `min-w-11` 1, `opacity-40` 1, `border` 11, `px-2` 2, `px-1` 1.

#### Platform notes
none in source for StatusBar.tsx (no `Platform` use, no `.native`/`.web` siblings). package.json export conditions for the subpath: `types`, `react-native`, `default`, all resolving to `dist/components/shell/StatusBar.js`. The imported `MenuButton.tsx` returns focus to its trigger on close when `Platform.OS` is `qnx` or `marathon` (MenuButton.tsx line 73).

#### Motion
none in source.

#### Dependencies
- `./MenuButton.tsx` (`@nyc-tron/ui/components/shell/MenuButton`), `./status-model.ts`, `../styles.ts` (`joinClasses`), type `Rect2D` from `../overlays/popover-position.ts`.
- External: `react`, `react-native`. No optional peer is imported by this file directly.

#### Example
```tsx example=StatusBar
import {StatusBar} from "@nyc-tron/ui/components/shell/StatusBar";
export const Example = () => <StatusBar
  zoom={{value:100,onChange:()=>{},onFit:()=>{}}}
  units={{value:"px",options:[{value:"px",label:"Pixels"},{value:"mm",label:"Millimetres"}],onChange:()=>{}}}
  selection={{count:3,noun:{one:"layer",other:"layers"}}}
  activity={{kind:"rendering",progress:0.4,label:"Rendering"}}/>;
```

#### UNVERIFIED
- UNVERIFIED: how a screen reader reads the status strip, the progress bar and the live regions; only the props are in source.
- UNVERIFIED: menu open and select behaviour; it lives in `MenuButton.tsx`, which this item does not cover.
- UNVERIFIED: the "every control is at least 44pt" claim in the doc comment for the two `MenuButton` triggers; their sizing is in `MenuButton.tsx`.

UNVERIFIED count: 3

### ToastAndProgress

`import {ToastAndProgress} from "@nyc-tron/ui/components/shell/ToastAndProgress"`
Source: `packages/ui/src/components/shell/ToastAndProgress.tsx` (types and validation in `shell/progress-model.ts`). Tier-1 reason: R3 shell core. Import count: 0.
Exports: `ToastAndProgress`, `ToastAndProgressProps`, and the re-exported types `ProgressJob`, `JobAction`, `ToastMessage`.

#### Props
`ToastAndProgressProps` extends `Omit<ViewProps,"children">`. The rest spread goes to the root `View`; `style` is appended after `{gap:8}`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | `string` | none | yes | Owner key for the pending-action hook (`useOwnedAction(scope)`). |
| toasts | `readonly ToastMessage[]` | none | yes | Only the first 3 show unless expanded. |
| jobs | `readonly ProgressJob[]` | none | yes | All jobs render. |
| onDismissToast | `(id:string)=>void` | none | yes | Called by each toast's dismiss button. |
| onToastAction | `(toastId,actionId,signal:AbortSignal)=>void \| Promise<void>` | none | no | Required at runtime when any toast has an `action`. |
| onJobAction | `(jobId,action:JobAction,signal:AbortSignal)=>void \| Promise<void>` | none | no | Required at runtime when any job has actions. |
| height | `number` | `360` | no | Height of the list; must be finite and at least 44. |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | Removes class strings and passes `unstyled` to `Button` and `ErrorMessage`. |

`ToastMessage`: `id:string`, `title:string`, `detail?:string`, `tone:"info"|"success"|"error"`, `action?:{id:string;label:string}`.
`JobAction`: `"cancel"|"pause"|"resume"|"retry"`.
`ProgressJob`: `id`, `title`, `detail?`, `progress:number|null`, `actions:readonly JobAction[]`, and either `status:"queued"|"running"|"paused"|"cancelling"|"completed"|"cancelled"` or `status:"failed"` with a required `error:string`.

Throws: `TypeError("Notification actions require onToastAction")`, `TypeError("Job actions require onJobAction")`, `RangeError("Feedback height must be at least 44")`. `validateFeedback` throws for more than 100 toasts or 1000 jobs, duplicate or empty ids or titles, a progress outside 0..1, job actions not allowed for the status (queued: cancel; running: pause, cancel; paused: resume, cancel; failed: retry; cancelled: retry; cancelling and completed: none), a failed job with a blank error, and a completed job whose progress is not 1.

#### Variants
- `ToastMessage.tone`: `"error"` gives the title `role="alert"`; `"info"` and `"success"` give `role="status"`. No colour or class changes by tone.
- `ProgressJob.status`: `"failed"` renders an `ErrorMessage` with the job error. `"queued"`, `"running"`, `"cancelling"` with `progress:null` render an `ActivityIndicator`; other statuses with `progress:null` render "Progress not reported".

#### States
- empty: `ListEmptyComponent` text "No notifications or jobs".
- expanded: local store `{expanded}`; with more than 3 toasts a toggle button reads "Show all N notifications" or "Show recent notifications".
- pending (busy): while `useOwnedAction` reports a pending action, toast action, dismiss and job action buttons get `disabled`, and a "Cancel pending notification or job request" button appears.
- error: `ErrorMessage` at the bottom shows `action.error` when set.
- progress: determinate bar width `progress*100%`; `aria-valuenow`, `aria-valuetext` and `accessibilityValue` are set; indeterminate sets text "Progress not reported".
- Live regions: toast titles and job title lines set `accessibilityLiveRegion="polite"`.
- hover, focus, pressed: no code in this file (inherited from `Button`).

#### Tokens
- Colour classes: `color.textMuted` 4, `color.text` 3, `color.border` 2, `color.surfaceSunken` 1, `color.primary` 1. Radius class: `radius.control` 1.
- Literals: `gap: 8` to `space.2` (5), `padding: 10` to `space.2.5` (2).
- no token: heights 6 and `"100%"`; the `height` default 360.
- Tailwind default classes (no token): `font-semibold` 3, `border` 6, `rounded-control` 1.

#### Platform notes
none in source. package.json export conditions: `types`, `react-native`, `default`, all to `dist/components/shell/ToastAndProgress.js`.

#### Motion
`ActivityIndicator` for indeterminate queued, running or cancelling jobs (its animation is the native primitive's). No Animated or Reanimated calls. Progress never advances on a timer (doc comment).

#### Dependencies
- `../Button.tsx` (`@nyc-tron/ui/components/Button`), `../feedback/ErrorMessage.tsx`, `./useOwnedAction.ts`, `./progress-model.ts`, `../styles.ts`.
- External: `react`, `react-native` (`FlatList`, `ActivityIndicator`), `zustand` and `zustand/vanilla`. `zustand` is an optional peer in `package.json`.

#### Example
```tsx example=ToastAndProgress
import {ToastAndProgress} from "@nyc-tron/ui/components/shell/ToastAndProgress";
export const Example = () => <ToastAndProgress scope="doc-1"
  toasts={[{id:"t1",title:"Export finished",tone:"success",action:{id:"open",label:"Open"}}]}
  jobs={[{id:"j1",title:"Render",status:"running",progress:0.5,actions:["pause","cancel"]}]}
  onDismissToast={()=>{}} onToastAction={async()=>{}} onJobAction={async()=>{}} height={240}/>;
```

#### UNVERIFIED
- UNVERIFIED: pending, cancel and error timing of `useOwnedAction`; that hook was not read.
- UNVERIFIED: how `Button` and `ErrorMessage` render disabled and error states; they live in other files.
- UNVERIFIED: screen reader output for `role="alert"`/`role="status"` and the progressbar value props.

UNVERIFIED count: 3

### ToolRail

`import {ToolRail} from "@nyc-tron/ui/components/shell/ToolRail"`
Source: `packages/ui/src/components/shell/ToolRail.tsx` (types and helpers in `shell/tool-rail-model.ts`). Tier-1 reason: R3 shell core. Import count: 0.
Exports: `ToolRail`, `ToolRailProps`, `RailTool`, `RailToolVariant`, `ToolIcon`, `shownVariantId`, `toolIsActive`.

#### Props
`ToolRailProps` extends `Omit<ViewProps,"children">`. Rest spread goes to the root `View`; `accessibilityRole="toolbar"`, `accessibilityLabel` and `aria-orientation` are set after the spread.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | `string` | `"tools"` | no | In the boundary string; a change closes the flyout. |
| revision | `string \| number` | `0` | no | Same. |
| disabled | `boolean` | `false` | no | Disables every button and ignores selection. |
| tools | `readonly RailTool[]` | none | yes | Validated by `validateRailTools`. |
| activeToolId | `string \| undefined` | none | yes | Tool or variant id; the prop key is required but may be `undefined`. |
| onSelectTool | `(id:string)=>void` | none | yes | |
| groupSelection | `Readonly<Record<string,string>>` | none | no | Variant each group button shows; falls back to the first variant. |
| label | `string` | `"Tools"` | no | Toolbar accessible name. |
| edge | `"left" \| "right" \| "bottom"` | `"left"` | no | |
| expanded | `boolean` | `false` | no | Shows text labels beside icons. |
| usableRegions | `readonly Rect2D[]` | none | no | Falls back to a region of the window size. |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | |

`RailTool`: `id`, `label`, `icon:ToolIcon` (required), `shortcut?`, `disabled?`, `variants?:readonly RailToolVariant[]`.
`RailToolVariant`: `id`, `label`, `icon:ToolIcon` (required), `shortcut?`.
`ToolIcon`: `ReactNode | ((state:{active:boolean})=>ReactNode)`.

`shownVariantId(tool, groupSelection?)` returns the chosen variant id if it exists, else the first variant id, else the tool id. `toolIsActive(tool, activeToolId)` is true when the id equals the tool or any variant id. `validateRailTools` throws for more than 256 tools, more than 64 variants on a tool, empty, duplicate or over-long ids (256), labels over 512 characters, shortcuts over 256 characters, or a non-boolean `disabled`.

#### Variants
- `edge`: `"left"` adds `border-r border-border`; `"right"` adds `border-l border-border`; `"bottom"` adds `border-t border-border` and lays tools in a wrapping row (otherwise a column). Left and right rails use the `vertical` roving axis, bottom uses `horizontal`. The flyout opens to the right of the tool for `left`, to the left for `right`, above for `bottom`.
- `expanded`: `true` adds `px-2` and a label `Text`; `false` adds `justify-center`.

#### States
- active: `toolIsActive`; sets `accessibilityState.selected`, `aria-pressed`, class `bg-primary forced-colors:border-2 forced-colors:border-[Highlight]`, label `text-on-primary`.
- resting: `bg-transparent hover:bg-surface-sunken`.
- disabled: rail `disabled` or `tool.disabled`; `disabled` on the Pressable, `accessibilityState.disabled`; per-tool disabled adds `opacity-40`.
- focus: `focus-visible:ring-2 focus-visible:ring-focus`; web keeps a roving `tabIndex` (0 on one stop, -1 elsewhere).
- group: a corner triangle drawn with borders, `aria-haspopup="menu"`, accessibilityHint "Long press for more tools.", actions `activate` and `showVariants`.
- flyout open: `CommandPopover` listing variants, with description "Current tool" and shortcut text.
- pressed: no code.

#### Tokens
- Colour classes: `color.border` 3, `color.surfaceRaised` 1, `color.focus` 1, `color.primary` 1, `color.surfaceSunken` 1, `color.onPrimary` 1, `color.text` 1. Radius class: `radius.control` 1. The tool also matches `border-b-on-primary` and `border-b-text-muted` strings in code; the tool output does not list them separately.
- Literals: `borderLeftWidth: 5` and `borderBottomWidth: 5` map to a component-scoped `<Comp>.border.5` (1 each; not a global token).
- no token: icon box 28, corner offsets 3, flyout width 232, flyout offsets 4, 8 and 236.
- Tailwind default classes (no token): `gap-1` 1, `p-1` 1, `border` 12, `min-h-11` 1, `min-w-11` 1, `gap-2` 1, `rounded-control` 1, `border-2` 1, `px-2` 1, `opacity-40` 1, `text-sm` 1.

#### Platform notes
- `Platform.OS==="web"`: adds `onKeyDown` and the roving `tabIndex` to each button.
- `I18nManager.isRTL` or the node direction flips the roving arrow direction; `edge` picks the arrow that opens the flyout (`ArrowRight` for left, `ArrowLeft` for right, `ArrowUp` for bottom).
- Flyout anchoring calls `measureInWindow` on the node when present.
- package.json export conditions: `types`, `react-native`, `default`, all to the same dist file. No `.native`/`.web` siblings.

#### Motion
none in source.

#### Dependencies
- `../overlays/CommandPopover.tsx`, `../overlays/popover-position.ts` (type), `./shell-keys.ts`, `./tool-rail-model.ts`, `../styles.ts`.
- External: `react`, `react-native` (`I18nManager`, `Platform`, `Pressable`, `useWindowDimensions`), `zustand`, `zustand/vanilla`. `zustand` is an optional peer.

#### Example
```tsx example=ToolRail
import {ToolRail} from "@nyc-tron/ui/components/shell/ToolRail";
import {Text} from "react-native";
export const Example = () => <ToolRail edge="left" activeToolId="move" onSelectTool={()=>{}}
  tools={[
    {id:"move",label:"Move",shortcut:"V",icon:<Text>M</Text>},
    {id:"brush",label:"Brush",icon:<Text>B</Text>,variants:[
      {id:"brush.soft",label:"Soft brush",icon:<Text>S</Text>,shortcut:"B"},
      {id:"brush.hard",label:"Hard brush",icon:({active})=><Text>{active?"H*":"H"}</Text>}]},
  ]}/>;
```

#### UNVERIFIED
- UNVERIFIED: flyout placement and dismissal; `CommandPopover` was not read.
- UNVERIFIED: roving-focus results of `rovingTarget` and the key shapes from `shellKey` (`shell-keys.ts` not read).
- UNVERIFIED: that long press and the `showVariants` screen-reader action open the flyout on a device; only the handlers are in source.
- UNVERIFIED: whether `measureInWindow` exists on every host's Pressable ref; the code skips the flyout when it is missing.

UNVERIFIED count: 4

### UnitInput

`import {UnitInput} from "@nyc-tron/ui/components/shell/UnitInput"`
Source: `packages/ui/src/components/shell/UnitInput.tsx` (parser and types in `shell/unit-expression.ts`). Tier-1 reason: R3 shell core; R4 imported by 35 files. Import count: 35 (plus 1 in other packages).
Exports: `UnitInput`, `UnitInputProps`, and the re-exported types `UnitContext`, `UnitDimension`, `UnitName`.

#### Props
`UnitInputProps` extends `Omit<ViewProps,"children">`. Rest spread goes to the root `View`; `style` is appended after `{opacity:disabled?0.5:1}`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| label | `string` | none | yes | Visible label and accessible name. |
| scope | `string` | none | no | A change abandons an uncommitted draft. |
| value | `number` | none | yes | Committed value in the dimension's base unit. |
| onCommit | `(value:number)=>void` | none | yes | Called once per accepted entry or arrow step, with the clamped value. Not called when the clamped value equals `value`. |
| context | `UnitContext` | none | no | Without it the field is a plain number field that still accepts arithmetic. |
| units | `readonly UnitName[]` | none | no | Menu shows only with `context`, 2 or more units and `onUnitChange`. |
| onUnitChange | `(unit:UnitName)=>void` | none | no | |
| min | `number` | none | no | Base units. |
| max | `number` | none | no | Base units. |
| step | `number` | `1` | no | Arrow step in display units; Shift x10, Alt /10. |
| precision | `number` | `2` | no | Decimals for a plain number field. |
| disabled | `boolean` | `false` | no | |
| hideLabel | `boolean` | `false` | no | |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | |

`UnitContext` (shell/unit-expression.ts): `dimension:UnitDimension` (required), `unit:UnitName` (required), `pixelsPerInch?` (doc: default 96), `frameRate?` (required to use `f`), `sampleRate?` (required to use `smp`), `percentOf?` (required to use `%` for length).
`UnitDimension`: `"length"|"time"|"level"|"ratio"`. `UnitName` is one of length `px pt mm cm in %`, time `s ms f smp`, level `dB`, ratio `% x`.

#### Variants
none. `context.dimension` selects the unit set, which is data, not a style variant.

#### States
- default: shows `formatUnitValue(value, context)` or the plain number to `precision` decimals.
- editing: on focus; shows the draft text; border class `border-focus`.
- error: parse failure keeps editing and shows an `assertive` live-region message with `aria-invalid` and `aria-describedby`; border `border-danger`. On blur with an unparsable draft the value is restored and the message reads "Not applied. ..."
- disabled: `editable={false}`, `aria-disabled`, `accessibilityState.disabled`, wrapper opacity 0.5, and an open edit is discarded.
- Escape restores the committed text; ArrowUp and ArrowDown step by `step` times the unit scale.
- hover and pressed: no code.

#### Tokens
- Colour classes: `color.text` 2, `color.danger` 2, `color.border` 2, `color.textMuted` 1, `color.surfaceSunken` 1, `color.focus` 1, `color.surfaceRaised` 1. Radius class: `radius.control` 1.
- Literals: `gap: 4` to `space.1` (1), `minHeight: 44` to `size.touch` (1), `opacity 0.5` to `opacity.0_5` (1).
- no token: `minWidth: 64` (1).
- Tailwind default classes (no token): `gap-1` 1, `text-xs` 2, `rounded-control` 1, `border` 8, `px-2` 2, `text-sm` 1.

#### Platform notes
- `Platform.OS==="web"` adds `blurOnSubmit:false` to the `TextInput`.
- Escape handling and arrow stepping read keys through `shellKey` from `shell-keys.ts`.
- package.json export conditions: `types`, `react-native`, `default`, all to the same dist file. No `.native`/`.web` siblings.

#### Motion
none in source.

#### Dependencies
- `./MenuButton.tsx`, `./shell-keys.ts`, `./unit-expression.ts`, `../styles.ts`.
- External: `react`, `react-native`, `zustand`, `zustand/vanilla` (optional peer).

#### Example
```tsx example=UnitInput
import {UnitInput} from "@nyc-tron/ui/components/shell/UnitInput";
export const Example = () => <UnitInput label="Width" scope="layer-1.width" value={192}
  context={{dimension:"length",unit:"mm",pixelsPerInch:96}} units={["px","mm","in"]}
  onUnitChange={()=>{}} onCommit={()=>{}} min={0} max={4096} step={1}/>;
```

#### UNVERIFIED
- UNVERIFIED: the accepted expression grammar and error strings; `parseUnitExpression` was not read beyond its signature use.
- UNVERIFIED: unit conversion factors (`unitScale`, `formatUnitValue`) in `unit-expression.ts`.
- UNVERIFIED: how `Escape`, Shift and Alt arrive on native keyboards; `shellKey` was not read.
- UNVERIFIED: the unit menu's behaviour; it lives in `MenuButton.tsx`.

UNVERIFIED count: 4

### WorkspaceHost

`import {WorkspaceHost} from "@nyc-tron/ui/components/shell/WorkspaceHost"`
Source: `packages/ui/src/components/shell/WorkspaceHost.tsx` (helpers in `shell/workspace-model.ts`, `shell/dock-model.ts`). Tier-1 reason: R3 shell core. Import count: 0.
Exports: `WorkspaceHost`, `WorkspaceHostProps`, `WorkspaceHostMode`, and the re-exported types `WorkspaceDocument`, `WorkspaceMode`, `DockLayout`, `DockPanel`.

#### Props
`WorkspaceHostProps` extends `Omit<ViewProps,"children">`. `onLayout` is read (it also stores the measured width, then calls the caller's handler); `style` is appended after `{flex:1, direction}`; the rest spread goes to the root `View`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| document | `WorkspaceDocument` | none | yes | Canvas is keyed by `document.id`. |
| disabled | `boolean` | `false` | no | Blocks mode switches and layout changes. |
| revision | `string \| number` | `0` | no | Must be finite (number) or at most 512 characters (string). |
| modes | `readonly WorkspaceHostMode[]` | none | yes | |
| activeModeId | `string` | none | yes | Throws `TypeError` if not one of `modes`. |
| onModeChange | `(modeId:string)=>void` | none | yes | |
| panels | `readonly DockPanel[]` | none | yes | |
| layouts | `Readonly<Record<string,DockLayout>>` | none | yes | A mode without one uses its `defaultLayout`. |
| onLayoutChange | `(modeId:string,layout:DockLayout)=>void` | none | yes | |
| canvas | `ReactNode` | none | yes | |
| leading | `ReactNode` | none | no | Before the title. |
| trailing | `ReactNode` | none | no | After the tabs. |
| enableModeShortcuts | `boolean` | `true` | no | Ctrl/Cmd+1..9 on web. |
| applePlatform | `boolean` | none (computed) | no | Computed by `appleByDefault()` when omitted. |
| compactBelow | `number` | `600` | no | Width under which tabs move to a second row. |
| features | `readonly FoldFeature[]` | none | no | Forwarded to `AdaptiveDock`. |
| usableRegions | `readonly Rect2D[]` | none | no | Forwarded. |
| dockDefaults | `Partial<DockDefaults>` | none | no | Forwarded as `defaults`. |
| dockCompactBelow | `number` | none | no | Forwarded as `compactBelow` when defined. |
| isRTL | `boolean` | `false` | no | Sets `direction:"rtl"` and the tab roving direction. |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | |

`WorkspaceDocument`: `id:string` (required), `title:string` (required), `dirty?:boolean`.
`WorkspaceMode`: `id`, `label`, `panels:readonly string[]`, `defaultLayout:DockLayout`, all required. `WorkspaceHostMode` adds `icon?:(state:{selected:boolean})=>ReactNode`.
`DockPanel` (shell/AdaptiveDock.tsx): `id`, `title`, `content:ReactNode`.
`DockLayout` (shell/dock-model.ts): `left?`, `right?`, `bottom?` (each a `DockStack` of `panels`, `active`, `size`), `floating:readonly FloatingPanel[]` (required; each `{id, rect}`), `compactSize?`.

Throws from `validateWorkspaceDocument` (id and title non-empty, id at most 256, title at most 512, `dirty` boolean) and `validateWorkspace` (mode and layout rules; the message list is in `workspace-model.ts` and was not enumerated here).

#### Variants
none as a union prop. `compactBelow` switches layout: when the measured width is above 0 and below it, the tab strip moves from beside the title to its own row.

#### States
- mode tabs: `selected` sets `accessibilityState.selected`, `aria-selected`, and class `bg-primary forced-colors:border-2 forced-colors:border-[Highlight]` with `text-on-primary font-semibold`; unselected `bg-transparent hover:bg-surface-sunken`, `text-text`.
- disabled: tabs get `disabled` and `accessibilityState.disabled`; `pick` does nothing.
- focus: `focus-visible:ring-2 focus-visible:ring-focus`; roving `tabIndex` (selected 0, others -1).
- dirty: an 8pt dot with `border-accent` before the title.
- narrow: width under `compactBelow`.
- mode announcement: on a mode change a polite live region (web) or `announce()` (native) speaks `modeAnnouncement`.
- hover on tabs is the only pointer state; pressed has no code.

#### Tokens
- Colour classes: `color.text` 2, `color.accent` 1, `color.border` 1, `color.surfaceRaised` 1, `color.focus` 1, `color.primary` 1, `color.surfaceSunken` 1, `color.onPrimary` 1. Radius class: `radius.control` 1.
- Literals: `gap: 8` to `space.2` (2), `paddingHorizontal: 8` to `space.2` (1), `paddingVertical: 4` to `space.1` (1), `gap: 4` to `space.1` (3), `gap: 2` to `space.0.5` (1), `borderRadius: 4` to `radius.4` (1), `borderWidth: 4` to `border.4` (1), `minHeight: 44` to `size.touch` (1).
- no token: `minWidth: 0` (2), the 8pt dot size.
- Tailwind default classes (no token): `border` 5, `text-base` 1, `font-semibold` 2, `min-h-0` 1, `min-w-0` 1, `min-h-11` 1, `min-w-11` 1, `gap-2` 1, `px-3` 1, `rounded-control` 1, `border-2` 1, `text-sm` 1.

#### Platform notes
- `appleByDefault()`: true on `ios` and `macos`; on `web` true when `navigator.platform` or `userAgent` matches `/Mac|iPhone|iPad/`. It picks the shortcut hint and `aria-keyshortcuts` prefix (`Meta+` or `Control+`).
- `Platform.OS==="web"`: title gets `aria-level:1`; a visually hidden polite live region renders; mode switches announce through it. On other platforms `announce()` from `../forge/announce.ts` is used instead.
- `enableModeShortcuts` keys work through a `View` `onKeyDown`; the doc comment states native hosts must route hardware keys themselves.
- Imported `announce.ts` branches on `qnx` and `marathon`.
- package.json export conditions: `types`, `react-native`, `default`. No `.native`/`.web` siblings.

#### Motion
none in source.

#### Dependencies
- `./AdaptiveDock.tsx`, `./dock-model.ts`, `./shell-keys.ts`, `./workspace-model.ts`, `../forge/announce.ts`, `../overlays/popover-position.ts` (type), `../styles.ts`, type `FoldFeature` from `@nyc-tron/core/folds`.
- External: `react`, `react-native` (`ScrollView`, `Pressable`, `Platform`), `zustand`, `zustand/vanilla`. `zustand` and `@nyc-tron/core` are optional peers.

#### Example
```tsx example=WorkspaceHost
import {Text} from "react-native";
import {WorkspaceHost,type DockLayout,type DockPanel} from "@nyc-tron/ui/components/shell/WorkspaceHost";
const edit:DockLayout={left:{panels:["layers"],active:"layers",size:240},floating:[]};
const panels:readonly DockPanel[]=[{id:"layers",title:"Layers",content:<Text>Layers</Text>}];
export const Example = () => <WorkspaceHost document={{id:"doc-1",title:"Poster",dirty:true}}
  modes={[{id:"edit",label:"Edit",panels:["layers"],defaultLayout:edit}]}
  activeModeId="edit" onModeChange={()=>{}} panels={panels} layouts={{edit}} onLayoutChange={()=>{}}
  canvas={<Text>Canvas</Text>}/>;
```

#### UNVERIFIED
- UNVERIFIED: that the canvas keeps its state when modes switch; this depends on `AdaptiveDock` rendering, which was not read.
- UNVERIFIED: the exact `validateWorkspace` rules and `modeAnnouncement` text in `workspace-model.ts`.
- UNVERIFIED: the key fields `modeShortcutIndex` reads (`shellKey` and `code`) on each platform.
- UNVERIFIED: screen reader output of the tablist, the document header and the announcements.

UNVERIFIED count: 4

### WorkspacePresetSwitcher

`import {WorkspacePresetSwitcher} from "@nyc-tron/ui/components/shell/WorkspacePresetSwitcher"`
Source: `packages/ui/src/components/shell/WorkspacePresetSwitcher.tsx` (helpers in `shell/workspace-preset-model.ts`). Tier-1 reason: R3 shell core. Import count: 0.
Exports: `WorkspacePresetSwitcher`, `WorkspacePresetSwitcherProps`, and the re-exported type `WorkspacePreset`.

#### Props
`WorkspacePresetSwitcherProps` extends `Omit<ViewProps,"children">`. Rest spread goes to the root `View`; `style` passes through unchanged.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| scope | `string` | `"workspace"` | no | Non-empty after trim, at most 256 characters. |
| disabled | `boolean` | `false` | no | |
| revision | `string \| number` | `0` | no | Finite number or string up to 512 characters. |
| presets | `readonly WorkspacePreset[]` | none | yes | Validated by `validatePresetList`. |
| activeId | `string` | none | no | Without a match the trigger reads "Custom layout". |
| onSelect | `(id:string)=>void` | none | yes | |
| onSaveAs | `(name:string)=>void` | none | yes | Name is trimmed. |
| onRename | `(id:string,name:string)=>void` | none | yes | |
| onDuplicate | `(id:string)=>void` | none | yes | |
| onDelete | `(id:string)=>void` | none | yes | Called after the confirm dialog. |
| onReset | `(id:string)=>void` | none | yes | |
| recentlyDeleted | `{readonly id:string;readonly name:string}` | none | no | With `onUndoDelete`, shows "Undo delete". |
| onUndoDelete | `(id:string)=>void` | none | no | |
| usableRegions | `readonly Rect2D[]` | none | no | Falls back to window size for the dialog. |
| className | `string` | none | no | |
| unstyled | `boolean` | `false` | no | |

`WorkspacePreset`: `id:string`, `name:string`, `builtIn:boolean`, `modified:boolean`, all required. Name rules (`PRESET_NAME_MAX`, duplicate, empty, too-long) are in `workspace-preset-model.ts`; the doc comment says trimmed, unique ignoring case, at most 40 characters.

Throws `RangeError("Invalid workspace preset scope")` for a bad scope or revision.

#### Variants
- Dialog kinds from local state: `"save"`, `"rename"` (name field plus Cancel and Save/Rename buttons) and `"delete"` (confirm text plus Cancel and a `danger` Delete button).
- Menu items per preset: description "Built-in" or "Custom", with ", current" and ", modified".

#### States
- active preset modified: an 8pt `border-accent` dot after the name; the trigger label adds ", modified".
- menu actions: Duplicate disabled when no saved active preset; Rename, Reset, Delete disabled by `presetActions`, each with a description ("Built-in presets keep their names", "Layout already matches the default", "Built-in presets can't be deleted"). Delete is `danger`.
- dialog open: a `Modal` with `role="dialog"`, `aria-modal`, `accessibilityViewIsModal`; delete text depends on `onUndoDelete` being given.
- name error: after a submit with a problem, `TextField` shows `errorText`; otherwise `helperText` "Up to 40 characters." (from `PRESET_NAME_MAX`).
- undo: when `recentlyDeleted` and `onUndoDelete` are both set, a ghost "Undo delete" button shows and `announce()` speaks the deletion once per id.
- disabled: `disabled` on the menu trigger and the undo button; all handlers check the committed boundary.
- hover on the trigger: `hover:bg-surface-sunken`.

#### Tokens
- Colour classes: `color.text` 4, `color.border` 2, `color.surfaceRaised` 2, `color.textMuted` 2, `color.surfaceSunken` 1, `color.accent` 1. Radius class: `radius.card` 1. The overlay `bg-text/50` string is also in code.
- Literals: `padding: 16` to `space.4` (1), `gap: 8` to `space.2` (2), `marginTop: -4` to `-space.1` (1), `borderRadius: 4` to `radius.4` (1), `borderWidth: 4` to `border.4` (1), `borderRightWidth: 2` and `borderBottomWidth: 2` to `border.2` (1 each).
- no token: dialog max width 420, trigger text max width 160, dot size 8, chevron size 8, menu width 280.
- Tailwind default classes (no token): `gap-1` 1, `gap-2` 1, `px-3` 1, `border` 8, `text-sm` 2, `font-semibold` 3, `gap-4` 1, `p-5` 1, `rounded-card` 1, `text-lg` 2.

#### Platform notes
- `Platform.OS==="web"`: `Modal` `animationType` is `"none"` (otherwise `"fade"`); focus returns to the trigger via a zero-delay timeout after a dialog closes or a preset is picked.
- Imported `announce.ts` branches on `qnx` and `marathon`; `MenuButton.tsx` focus-return branches on `qnx` and `marathon`.
- package.json export conditions: `types`, `react-native`, `default`. No `.native`/`.web` siblings.

#### Motion
`Modal` fade on non-web platforms. No Animated or Reanimated calls. The chevron is a static 45 degree rotation.

#### Dependencies
- `./MenuButton.tsx` (also `CommandMenuItem`), `./workspace-preset-model.ts`, `../Button.tsx`, `../TextField.tsx`, `../forge/announce.ts`, `../overlays/popover-position.ts` (`placePopover`, `Rect2D`), `../styles.ts`.
- External: `react`, `react-native` (`Modal`, `ScrollView`, `Pressable`), `zustand`, `zustand/vanilla` (optional peer).

#### Example
```tsx example=WorkspacePresetSwitcher
import {WorkspacePresetSwitcher} from "@nyc-tron/ui/components/shell/WorkspacePresetSwitcher";
export const Example = () => <WorkspacePresetSwitcher scope="doc-1" activeId="edit"
  presets={[{id:"edit",name:"Edit",builtIn:true,modified:true},{id:"mine",name:"My layout",builtIn:false,modified:false}]}
  onSelect={()=>{}} onSaveAs={()=>{}} onRename={()=>{}} onDuplicate={()=>{}} onDelete={()=>{}} onReset={()=>{}}/>;
```

#### UNVERIFIED
- UNVERIFIED: exact name validation messages and limits in `workspace-preset-model.ts` (only the doc comment was relied on).
- UNVERIFIED: `TextField` and `Button` rendering for error and disabled states (other files).
- UNVERIFIED: modal focus trapping and screen reader behaviour of the dialog on each platform.
- UNVERIFIED: whether `bg-text/50` paints; it depends on the consumer's Tailwind configuration for an opacity modifier on a token colour.

UNVERIFIED count: 4

### TabBar

`import {TabBar} from "@nyc-tron/ui/components/TabBar"`

Source: packages/ui/src/components/TabBar.tsx (helpers: styles.ts, forms/choice-keys.ts). Tier-1 reason: R2 core family (components/). Import count: 0.

#### Props

`TabBarProps` extends `Omit<ViewProps,"children"|"role">`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| tabs | `readonly TabBarTab[]` | none | yes | Expanded below. |
| semantics | `"tabs"|"navigation"` | `"tabs"` | no | Changes roles, see Variants. |
| density | `"navigation"|"compact"` | `"navigation"` | no |  |
| aria-label | `string` | `"Navigation"` | no |  |
| className | `string` | none | no |  |
| tabClassName | `string` | none | no |  |
| labelClassName | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |

`TabBarTab`:

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| key | `string` | none | yes |  |
| label | `string` | none | yes | Also the tab `aria-label`. |
| icon | `ReactNode | ((state:TabIconState)=>ReactNode)` | none | no | `TabIconState` is `{readonly active:boolean}`. |
| active | `boolean` | none | no |  |
| disabled | `boolean` | none | no |  |
| onPress | `()=>void` | none | no |  |
| href | `string` | none | no | Used as `href` only when `semantics="navigation"` on web. |

#### Variants

`semantics`:
- `tabs`: container `role="tablist"`, tabs `role="tab"`, `aria-selected`, `accessibilityState.selected`.
- `navigation`: container `role="navigation"`, tabs `role="link"`, web `aria-current="page"` on active, no selected state.

`density`:
- `navigation`: container `w-full min-w-0 flex-row items-stretch`; styled adds `border-t border-border bg-surface-raised px-1 py-1`; tab `flex-1 gap-1 px-1 py-1.5 min-h-14`.
- `compact`: container `min-w-0 shrink flex-row items-stretch`; styled adds `gap-0.5`; tab `min-w-0 shrink grow-0 basis-auto flex-row gap-1.5 px-2`, label `min-w-0 shrink`.

#### States

- active: `active` on a tab; `bg-primary`, `text-on-primary`.
- inactive: `bg-transparent`, `text-text-muted`, `hover:bg-surface-sunken`.
- disabled: `disabled` on a tab; `opacity-50`, `aria-disabled`.
- focus: `focus-visible:ring-2 focus-visible:ring-focus`.
- pressed: no code.

#### Tokens

- `color.border` x1, `color.surfaceRaised` x1, `color.focus` x1, `color.primary` x1, `color.surfaceSunken` x1, `color.onPrimary` x1, `color.textMuted` x1
- `radius.control` x1

Tailwind default classes (no token): `min-w-0` x4, `gap-0` (from `gap-0.5`), `border` x4, `px-1` x2, `py-1` x2, `min-h-11`, `min-w-11`, `gap-1` x2, `px-2`, `min-h-14`, `border-2`, `opacity-50`, `text-sm`, `font-medium`.

#### Platform notes

- Web only (`Platform.OS==="web"`): `aria-current`; in `tabs` mode `onKeyDown` and roving `tabIndex` (active tab 0, others -1); `href` in `navigation` mode.
- Arrow keys flip in RTL via `I18nManager.isRTL` or DOM direction; Home/End jump; focus moves via ref `.focus()`, then calls the target tab's `onPress`.

#### Motion

`motion-reduce:transition-none`. No Animated calls.

#### Dependencies

- `joinClasses`; `domIsRTL`, `isModified`, `nextChoiceIndex`, `rovingStop`, `webKey` (same package).
- react-native (peer, required): I18nManager, Platform, Pressable, Text, View.
- No optional peers.

#### Example

```tsx example=TabBar
import { useState } from "react";
import { Text } from "react-native";
import { TabBar } from "@nyc-tron/ui/components/TabBar";

export function PaneTabs() {
  const [active, setActive] = useState("layers");
  return (
    <TabBar
      aria-label="Inspector"
      density="compact"
      tabs={[
        { key: "layers", label: "Layers", active: active === "layers", onPress: () => setActive("layers"),
          icon: ({ active: on }) => <Text>{on ? "L" : "l"}</Text> },
        { key: "assets", label: "Assets", active: active === "assets", onPress: () => setActive("assets") },
      ]}
    />
  );
}
```

#### UNVERIFIED

- UNVERIFIED: Whether `href` on a Pressable renders an anchor on web is behaviour of react-native-web, not code in this file.

UNVERIFIED count: 1

### TextField

`import {TextField} from "@nyc-tron/ui/components/TextField"`

Source: packages/ui/src/components/TextField.tsx (helper: styles.ts). Tier-1 reason: R1 root barrel export; R2 core family (components/). Import count: 9.

#### Props

Extends `TextInputProps`. Read or overridden from the inherited set: `editable` (default `true`), `accessibilityState` (merged, `disabled` set from `editable`). All other props are spread onto the TextInput. `accessibilityLabel`, `accessibilityLabelledBy` and `accessibilityHint` are set after the spread and override caller values.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| id | `string` | none | yes | Label nativeID is `id + "-label"`. |
| label | `string` | none | yes | Rendered text, and the TextInput accessibilityLabel. |
| helperText | `string` | none | no | Shown below when no `errorText`. |
| errorText | `string` | none | no | Replaces helperText, border becomes `border-danger`. |
| startAdornment | `ReactNode` | none | no | Rendered before the input inside the border box. |
| className | `string` | none | no | Outer View. |
| inputClassName | `string` | none | no | TextInput. |
| labelClassName | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |
| ref | `Ref<ComponentRef<typeof TextInput>>` | none | no | Forwarded to the TextInput. |

#### Variants

none.

#### States

- default: `border-border`.
- error: `errorText` set; border `border-danger`, error Text has `accessibilityRole="alert"` and `accessibilityLiveRegion="polite"`, hint becomes `errorText`.
- disabled: `editable={false}`; `opacity-50` on the border box, `accessibilityState.disabled`.
- helper: `helperText` shown in `text-text-muted`.
- focus, hover, pressed: no code.

#### Tokens

- `color.text`: `text-text` x2
- `color.border` x2, `color.danger` x3, `color.surfaceSunken` x1, `color.textMuted` x1
- `radius.control` x1

Tailwind default classes (no token): `gap-2` x2, `text-sm` x3, `font-semibold`, `border` x8, `min-h-12`, `px-3`, `opacity-50`, `min-h-11`, `text-base`.

#### Platform notes

none in source.

#### Motion

none in source.

#### Dependencies

- `joinClasses` from `./styles.ts`.
- react-native (peer, required): TextInput, Text, View.
- No optional peers.

#### Example

```tsx example=TextField
import { useState } from "react";
import { TextField } from "@nyc-tron/ui/components/TextField";

export function NameField() {
  const [name, setName] = useState("");
  return (
    <TextField
      id="doc-name"
      label="Document name"
      helperText="Shown in the title bar."
      errorText={name.length > 40 ? "Use 40 characters or fewer." : undefined}
      value={name}
      onChangeText={setName}
    />
  );
}
```

#### UNVERIFIED

- UNVERIFIED: How a screen reader reads `accessibilityLabelledBy` against `nativeID` on each platform: a native primitive behaviour not shown in this file.

UNVERIFIED count: 1

### NightScope
`import { ... } from "@nyc-tron/ui/components/theme/NightScope"`
Source: `packages/ui/src/components/theme/NightScope.tsx`
Tier-1 reason: R2 core family (theme)
Import count: 0

#### Props
`NightScopeProps` (own interface).

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| children | ReactNode | none | yes | |
| scheme | string | "dark" | no | Uniwind theme name; cast with `as never` because `ThemeName` comes from the app's generated types. |

#### Variants
none. `scheme` is a free string.

#### States
none. A pure wrapper around `ScopedTheme`.

#### Tokens
`node tokenuse.mjs` output: none. The file has no literals or token classes.

#### Platform notes
Only the doc comment: on native, `ScopedTheme` resolves the theme variables for the subtree; on web it wraps the subtree in a `display: contents` element carrying the theme's class, which the app's theme CSS must scope (for example `.dark { --color-...: ... }`). The file has no `Platform.OS` check or sibling file.

#### Motion
none in source

#### Dependencies
- `uniwind`: `ScopedTheme`. Optional peer, `>=1.12.2 <2`.
- `react`: `ReactNode` (type).

#### UNVERIFIED
- UNVERIFIED: what `ScopedTheme` renders and how it resolves variables on each platform; it lives in `uniwind`, which was not read, so the doc-comment description is unconfirmed.
- UNVERIFIED: whether the app's theme CSS scopes the class on web; that depends on the consumer.

#### Example
```tsx example=NightScope
import { Text } from "react-native";
import { NightScope } from "@nyc-tron/ui/components/theme/NightScope";

export const Example = () => (
  <NightScope scheme="dark">
    <Text>Resolved with the dark theme variables.</Text>
  </NightScope>
);
```

UNVERIFIED count: 2

### Toolbar

`import {Toolbar} from "@nyc-tron/ui/components/Toolbar"`

Source: packages/ui/src/components/Toolbar.tsx (helpers: styles.ts, forms/choice-keys.ts). Tier-1 reason: R2 core family (components/). Import count: 1.

#### Props

`ToolbarProps` extends `Omit<ViewProps,"children"|"role">`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| title | `string` | none | no | Header Text, one line. Without it a flex spacer View fills the gap. |
| leading | `ReactNode` | none | no |  |
| actions | `ReactNode` | none | no | Wrapped in `role="toolbar"`. |
| density | `"default"|"compact"` | `"default"` | no |  |
| actionsLabel | `string` | none | no | Falls back to `<title> actions`, or `Actions` without a title. |
| className | `string` | none | no |  |
| titleClassName | `string` | none | no |  |
| unstyled | `boolean` | `false` | no |  |

#### Variants

`density`:
- `default`: `min-h-14 px-4`; title `text-lg font-semibold text-text`; web `aria-level` 2.
- `compact`: `min-h-13 px-2`; title `text-sm font-semibold text-text`; web `aria-level` 3.

#### States

Static bar. No interactive state on the bar itself.

#### Tokens

- `color.border` x1, `color.surfaceRaised` x1, `color.text` x2 (`border-b border-border bg-surface-raised` when styled)
- No radius token.

Tailwind default classes (no token): `min-w-0` x2, `gap-2`, `min-h-13`, `px-2`, `min-h-14`, `px-4`, `border` x3, `gap-1` x2, `text-sm`, `font-semibold` x2, `text-lg`.

#### Platform notes

- Web only: title `aria-level`, and an `onKeyDown` on the actions group moving focus among focusable descendants (`button:not([disabled]),a[href],[role="button"]:not([aria-disabled="true"]),[tabindex="0"]`) with arrows (RTL-aware), Home and End, with wrap.

#### Motion

none in source.

#### Dependencies

- `joinClasses`; `arrowStep`, `domIsRTL`, `isModified`, `webKey` (same package).
- react-native (peer, required): I18nManager, Platform, Text, View.
- No optional peers.

#### Example

```tsx example=Toolbar
import { Text } from "react-native";
import { IconButton } from "@nyc-tron/ui/components/IconButton";
import { Toolbar } from "@nyc-tron/ui/components/Toolbar";

export function PaneHeader() {
  return (
    <Toolbar
      title="Layers"
      density="compact"
      actionsLabel="Layer actions"
      leading={<IconButton aria-label="Back" icon={<Text>{"<"}</Text>} onPress={() => {}} />}
      actions={<IconButton aria-label="Add layer" icon={<Text>+</Text>} onPress={() => {}} />}
    />
  );
}
```

#### UNVERIFIED

- UNVERIFIED: `min-h-13` is used in the source but defined nowhere in the files read; whether it resolves depends on the consumer's Tailwind config.

UNVERIFIED count: 1

### WindowTitleBar
`import { ... } from "@nyc-tron/ui/components/window/WindowTitleBar"`
Source: `packages/ui/src/components/window/WindowTitleBar.tsx (+ @nyc-tron/core/window-chrome)`
Tier-1 reason: R2 core family (window)
Import count: 0

#### Props
Module exports: `WindowTitleBar`, `WindowTitleBarProps`, `useWindowChrome(host, windowId)`, and the constants `TITLE_BAR_HEIGHT = 44`, `CONTROL_TARGET = 44`, `CAPTION_TARGET_WIDTH = 48`. `WindowTitleBarProps` is an own interface (no `extends`).

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| chrome | WindowChromeController | none | yes | From `useWindowChrome` or `createWindowChromeController`. |
| title | string | none | yes | Empty or whitespace shows "Untitled". |
| controls | TitleBarControls | none | yes | `{kind:"drawn", layout:"macos"\|"windows"}` or `{kind:"native", insets:{leading,trailing,height}}`. |
| edited | boolean | false | no | Shows a dot and `editedLabel`; accessible title gets ", edited". |
| labels | Partial<WindowControlLabels> | none | no | Keys: `close`, `minimize`, `restore`, `zoom`, `unzoom`. |
| editedLabel | string | "Edited" | no | |
| closeBlockedLabel | string | "Window not closed." | no | Live-region text after a vetoed close. |
| onCommandResult | (result: WindowCommandResult) => void | none | no | |
| onError | (error: unknown) => void | none | no | Falls back to `console.error`. |
| children | ReactNode | none | no | After the title. |
| className | string | none | no | Bar. |
| titleClassName | string | none | no | |
| controlClassName | string | none | no | |
| unstyled | boolean | false | no | |
| style | StyleProp<ViewStyle> | none | no | After the built-in bar style. |
| testID | string | none | no | Controls get `<testID>-<command>`. |

`WindowChromeController` (core): `windowId`, `getSnapshot()`, `subscribe(listener)`, `run(command)`, `dispose()`. `WindowCommandResult` has `status` "done", "vetoed" (close only) or "ignored" with reason "busy", "unavailable" or "closed". `useWindowChrome(host: WindowChromeHost, windowId: string)` disposes the controller on unmount or host or window change.

#### Variants
- `controls.kind === "drawn"`, `layout: "macos"`: controls on the leading side, each in a 20-size bordered chip (`CHIP`) with a 44 by 44 target and `rounded-control`.
- `layout: "windows"`: controls trailing, 48 wide by 44 high, `hover:bg-danger` on close, else `hover:bg-surface-raised`.
- `kind: "native"`: no controls drawn; bar `paddingStart` and `paddingEnd` come from the insets and `minHeight` is `max(44, insets.height)`.
- Glyphs drawn from borders: close, minimize, restore, zoom (corner ticks inset 1, or 3 when `pressed`).

Which controls appear for a layout comes from core `describeTitleBar`.

#### States
- control enabled or disabled: `disabled`, `accessibilityState.disabled`, `opacity-50`.
- zoomed: `accessibilityState.selected` follows `control.pressed` when defined.
- focused window: title colour `text-text`, else `text-text-muted`.
- edited: dot (8 by 8, `border-accent`) and word.
- close vetoed: a polite live region, hidden visually, announces `closeBlockedLabel` until the next command.
- control hover, focus, pressed: `hover:*`, `focus-visible:ring-2 focus-visible:ring-focus`, `active:opacity-80` (styled).
- pending commands: the controller reports `ignored` / `busy`; the title bar passes `snapshot.pending` into `describeTitleBar`.

#### Tokens
`node tokenuse.mjs` output:
- `space.1.5` from `gap: 6` (x1), `space.2` from `paddingHorizontal: 8` (x1)
- `color.focus` (x1), `color.danger` (x1), `color.surfaceRaised` (x1), `color.textMuted` (x4), `color.surfaceSunken` (x1), `color.border` (x1), `color.accent` (x1), `color.text` (x1)
- `radius.control` (x2)
- `minWidth: 0`: no token

Tailwind default classes (no token): `opacity-80`, `opacity-50`, `rounded-control` (x2), `border` (x6), `rounded-full` (x2), `text-sm` (x2), `font-semibold`, `ring-2`. Unmapped: `TITLE_BAR_HEIGHT`, `CONTROL_TARGET`, `CAPTION_TARGET_WIDTH`, `GLYPH 12`, `STROKE 1.5`, `CHIP 20`, `DOT 8`.

#### Platform notes
- Layout names `macos` and `windows` and the `native` insets (doc: AppKit window buttons, Windows caption buttons, iPadOS window controls) are data inputs, not `Platform.OS` checks. The file has none.
- The glyphs use borders so forced-colors mode keeps them (code comment).

#### Motion
none in source. `motion-reduce:transition-none` is on each control but nothing in the file sets a transition. `active:opacity-80` is the only press feedback.

#### Dependencies
- `@nyc-tron/core/window-chrome`: `createWindowChromeController`, `describeTitleBar` and types. `@nyc-tron/core` is an optional peer.
- `react-native`: `Pressable`, `Text`, `View`. `zustand`, `zustand/vanilla`: optional peer. `react`: `useEffect`, `useMemo`, `useSyncExternalStore`. `../styles.ts`: `joinClasses`.

#### UNVERIFIED
- UNVERIFIED: the exact controls `describeTitleBar` returns per layout and snapshot state; only its call site and the core type definitions were read.
- UNVERIFIED: the on-screen insets a native host reports and how they combine with `insets.height`; they come from the host.

#### Example
```tsx example=WindowTitleBar
import { createPageWindowHost } from "@nyc-tron/core/window-chrome";
import { WindowTitleBar, useWindowChrome } from "@nyc-tron/ui/components/window/WindowTitleBar";

const host = createPageWindowHost();
host.open({ id: "doc", displayId: "page", rect: { x: 0, y: 0, width: 640, height: 480 } });

export const Example = () => {
  const chrome = useWindowChrome(host, "doc");
  return (
    <WindowTitleBar chrome={chrome} title="notes.md" edited
      controls={{ kind: "drawn", layout: "windows" }}
      onCommandResult={result => console.log(result.status)} />
  );
};
```

UNVERIFIED count: 2

### Stack
`import { Stack } from "@nyc-tron/ui/components/layout/Stack"`
Source: `packages/ui/src/components/layout/Stack.tsx`
Tier-1 reason: R2 core family (layout)
Import count: 0

#### Props
`StackProps extends Omit<ViewProps, "children">`. Every other `ViewProps` field, `testID` and the `accessibility*` props included, is forwarded to the `View`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| children | `ReactNode` | none | no | Rendered inside the `View`. |
| gap | `StackSpace` | `2` | no | Key of `space`. `space[gap]` px between children, 8 for the default. Set through the RN `gap` style. |
| padding | `StackSpace` | none | no | Key of `space`. Sets `padding`. |
| paddingX | `StackSpace` | none | no | Key of `space`. Sets `paddingHorizontal`. |
| paddingY | `StackSpace` | none | no | Key of `space`. Sets `paddingVertical`. |
| align | `"flex-start" \| "flex-end" \| "center" \| "stretch" \| "baseline"` | none | no | Sets `alignItems`. Unset leaves the View default. |
| justify | `"flex-start" \| "flex-end" \| "center" \| "space-between" \| "space-around" \| "space-evenly"` | none | no | Sets `justifyContent`. |
| wrap | `boolean` | `false` | no | `true` sets `flexWrap: "wrap"`. |
| className | `string` | none | no | Forwarded to the `View` as `className`. Declared on the interface, so it is read here and passed back explicitly. |
| style | `StyleProp<ViewStyle>` | none | no | Placed after the built-in style, so it wins. |

#### Variants
none

#### States
None. The component has no interactive or conditional state. A `StackSpace` key that is not in `space` is a compile error, not a runtime one.

#### Tokens
- `space.0` to `space.4`: `gap`, `padding`, `paddingX` and `paddingY` are looked up in `space` by key, so `token-use.mjs` does not list them (computed values). Keys: 0, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4.

Tailwind default classes (no token): none.

#### Platform notes
none in source

#### Motion
none in source

#### Dependencies
- `react-native`: `View`, `ViewProps`.
- `space` from `../../tokens.ts` and `stackStyle` from `./stack-style.ts`, which imports the `StackProps` type from `./Stack.tsx`.

#### UNVERIFIED
- UNVERIFIED: how the `gap` style resolves on React Native Web and on the Windows, macOS and QNX hosts; no runtime was run.
- UNVERIFIED: whether `className` reaches the `View` on every host; it depends on the consumer's Tailwind or Uniwind interop, which this file does not check.

#### Example
```tsx example=Stack
import { Text } from "react-native";
import { Stack } from "@nyc-tron/ui/components/layout/Stack";

export const Example = () => (
  <Stack gap={3} padding={4} align="stretch" testID="settings-stack">
    <Text>Account</Text>
    <Text>Notifications</Text>
  </Stack>
);
```

UNVERIFIED count: 2

### Row
`import { Row } from "@nyc-tron/ui/components/layout/Row"`
Source: `packages/ui/src/components/layout/Row.tsx`
Tier-1 reason: R2 core family (layout)
Import count: 0

#### Props
`RowProps` is `StackProps`: same fields, same defaults. The only difference is `flexDirection: "row"`.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| children | `ReactNode` | none | no | Rendered inside the `View`. |
| gap | `StackSpace` | `2` | no | Key of `space`. `space[gap]` px between children, 8 for the default. Set through the RN `gap` style. |
| padding | `StackSpace` | none | no | Key of `space`. Sets `padding`. |
| paddingX | `StackSpace` | none | no | Key of `space`. Sets `paddingHorizontal`. |
| paddingY | `StackSpace` | none | no | Key of `space`. Sets `paddingVertical`. |
| align | `"flex-start" \| "flex-end" \| "center" \| "stretch" \| "baseline"` | none | no | Sets `alignItems`. Unset leaves the View default. |
| justify | `"flex-start" \| "flex-end" \| "center" \| "space-between" \| "space-around" \| "space-evenly"` | none | no | Sets `justifyContent`. |
| wrap | `boolean` | `false` | no | `true` sets `flexWrap: "wrap"`. |
| className | `string` | none | no | Forwarded to the `View` as `className`. Declared on the interface, so it is read here and passed back explicitly. |
| style | `StyleProp<ViewStyle>` | none | no | Placed after the built-in style, so it wins. |

#### Variants
none

#### States
None. Row has no interactive or conditional state. `flexDirection: "row"` follows the reading direction, so the first child sits at the start edge in both left-to-right and right-to-left layouts.

#### Tokens
- `space.0` to `space.4`: `gap`, `padding`, `paddingX` and `paddingY` are looked up in `space` by key, so `token-use.mjs` does not list them (computed values).

Tailwind default classes (no token): none.

#### Platform notes
none in source

#### Motion
none in source

#### Dependencies
- `react-native`: `View`.
- `StackProps` (type only) from `./Stack.tsx` and `stackStyle` from `./stack-style.ts`.

#### UNVERIFIED
- UNVERIFIED: how the `gap` style resolves on React Native Web and on the Windows, macOS and QNX hosts; no runtime was run.
- UNVERIFIED: whether `className` reaches the `View` on every host; it depends on the consumer's Tailwind or Uniwind interop, which this file does not check.

#### Example
```tsx example=Row
import { Text } from "react-native";
import { Row } from "@nyc-tron/ui/components/layout/Row";

export const Example = () => (
  <Row gap={2} align="center" justify="space-between" paddingX={3}>
    <Text>Volume</Text>
    <Text>80</Text>
  </Row>
);
```

UNVERIFIED count: 2

### Spacer
`import { Spacer } from "@nyc-tron/ui/components/layout/Spacer"`
Source: `packages/ui/src/components/layout/Spacer.tsx`
Tier-1 reason: R2 core family (layout)
Import count: 0

#### Props
`SpacerProps` is `Omit<ViewProps, "children"> & SpacerSize`. `SpacerSize` is a union: pass `size`, or pass `flex`, never both. Every other `ViewProps` field is forwarded to the `View`. A Spacer takes no children.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| size | `StackSpace` | none | yes, unless `flex` | Key of `space`. Sets `flexBasis` to `space[size]` with `flexGrow: 0` and `flexShrink: 0`, so it is a fixed length on the parent's main axis. |
| flex | `true` | none | yes, unless `size` | Sets `flexGrow: 1` and `flexShrink: 1`, so it takes the free space on the parent's main axis and pushes siblings apart. |
| style | `StyleProp<ViewStyle>` | none | no | Placed after the built-in style, so it wins. |

#### Variants
`size` and `flex` are mutually exclusive in the type.
- `size`: fixed length, one of the `space` keys.
- `flex`: flexible length.

#### States
None. The component has no interactive or conditional state.

#### Tokens
- `space.0` to `space.4`: `size` is looked up in `space` by key, so `token-use.mjs` does not list it (computed value).

Tailwind default classes (no token): none.

#### Platform notes
none in source

#### Motion
none in source

#### Dependencies
- `react-native`: `View`, `ViewProps`.
- `space` from `../../tokens.ts`; `StackSpace` (type only) from `./Stack.tsx`.

#### UNVERIFIED
- UNVERIFIED: that `flexBasis` sets the length on the main axis the same way in every host layout engine, in a Stack and in a Row; no runtime was run.

#### Example
```tsx example=Spacer
import { Text } from "react-native";
import { Row } from "@nyc-tron/ui/components/layout/Row";
import { Spacer } from "@nyc-tron/ui/components/layout/Spacer";

export const Example = () => (
  <Row align="center">
    <Text>Title</Text>
    <Spacer flex />
    <Text>Edit</Text>
    <Spacer size={2} />
    <Text>Share</Text>
  </Row>
);
```

UNVERIFIED count: 1

### Divider
`import { Divider } from "@nyc-tron/ui/components/layout/Divider"`
Source: `packages/ui/src/components/layout/Divider.tsx`
Tier-1 reason: R2 core family (layout)
Import count: 0

#### Props
`DividerProps extends Omit<ViewProps, "children">`. The component reads `orientation`, `inset`, `className` and `style`; every other `ViewProps` field is forwarded to the `View`. It sets no `accessibilityRole`, no label and no `accessible` prop. Pass them yourself if a screen needs the line announced.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| orientation | `"horizontal" \| "vertical"` | `"horizontal"` | no | `horizontal` is `border[1]` high, `vertical` is `border[1]` wide. Both set `alignSelf: "stretch"`. |
| inset | `StackSpace` | none | no | Key of `space`. Margin at both ends of the line: `marginHorizontal` for `horizontal`, `marginVertical` for `vertical`. |
| className | `string` | none | no | Appended after `bg-border`. |
| style | `StyleProp<ViewStyle>` | none | no | Placed after the built-in style, so it wins. |

#### Variants
`orientation` (`"horizontal" | "vertical"`):
- `horizontal`: `height: border[1]`, margin at the left and right ends from `inset`.
- `vertical`: `width: border[1]`, margin at the top and bottom ends from `inset`.

#### States
None. The component has no interactive or conditional state.

#### Tokens
- `border.1`: the line thickness, `border[1]` (computed, not listed by `token-use.mjs`).
- `color.border`: `bg-border` class x1.
- `space.0` to `space.4`: `inset` is looked up in `space` by key.

Tailwind default classes (no token): none.

#### Platform notes
none in source

#### Motion
none in source

#### Dependencies
- `react-native`: `View`, `ViewProps`, `ViewStyle`.
- `border` and `space` from `../../tokens.ts`; `joinClasses` from `../styles.ts`; `StackSpace` (type only) from `./Stack.tsx`.

#### UNVERIFIED
- UNVERIFIED: whether the `bg-border` class paints on every host; it depends on the consumer's Tailwind or Uniwind interop, and without it the line has no colour.
- UNVERIFIED: how a screen reader treats an empty View with no role; no screen reader was run.

#### Example
```tsx example=Divider
import { Text } from "react-native";
import { Stack } from "@nyc-tron/ui/components/layout/Stack";
import { Divider } from "@nyc-tron/ui/components/layout/Divider";

export const Example = () => (
  <Stack gap={3}>
    <Text>General</Text>
    <Divider inset={3} testID="section-divider" />
    <Text>Advanced</Text>
  </Stack>
);
```

UNVERIFIED count: 2

### Text
`import { Text } from "@nyc-tron/ui/components/layout/Text"`
Source: `packages/ui/src/components/layout/Text.tsx`
Tier-1 reason: R2 core family (layout)
Import count: 0

#### Props
`TextProps extends Omit<TextProps (react-native), "children">`. The component reads `children`, `variant`, `size`, `tone`, `className` and `style`; every other React Native `Text` prop, `testID`, `numberOfLines` and the `accessibility*` props included, is forwarded.

| Name | Type | Default | Required | Notes |
|---|---|---|---|---|
| variant | `"body" \| "caption"` | none | no | Font size and line height from the token scale. Omit it to inherit the size from the parent. |
| size | `TextSize` | none | no | Key of `font` (10 to 17). Sets `fontSize` only and replaces the variant, so the variant line height is dropped. |
| tone | `TextTone` | `"text"` | no | Theme colour role, as a class (see Variants). |
| className | `string` | none | no | Appended after the tone class. |
| style | `StyleProp<TextStyle>` | none | no | Placed after the built-in style, so it wins. |
| children | `ReactNode` | none | no | Rendered inside the React Native `Text`. |

#### Variants
`variant` (`TextVariant`):
- `body`: `fontSize: font[12]`, `lineHeight: leading[16]`.
- `caption`: `fontSize: font[11]`, `lineHeight: leading[14]`.

Those are the two size and line height pairs that occur three or more times in `ui`. There is no weight and no font family: Text does not set `fontWeight` or `fontFamily`.

`tone` (`TextTone`):
- `text`: `text-text`.
- `muted`: `text-text-muted`.
- `danger`: `text-danger`.
- `primary`: `text-primary`.
- `accent`: `text-accent`.
- `info`: `text-info`.
- `success`: `text-success`.
- `onPrimary`: `text-on-primary`.
- `onDanger`: `text-on-danger`.

#### States
None. The component has no interactive or conditional state.

#### Tokens
- `font.11`, `font.12`, `leading.14`, `leading.16`: the two variants. `size` looks up `font` by key, so any `font.10` to `font.17` can be reached (computed, not listed by `token-use.mjs`).
- `color.text`, `color.textMuted`, `color.danger`, `color.primary`, `color.accent`, `color.info`, `color.success`, `color.onPrimary`, `color.onDanger`: one tone class each.

Tailwind default classes (no token): none.

#### Platform notes
none in source

#### Motion
none in source

#### Dependencies
- `react-native`: `Text` (imported as `NativeText`), `TextProps`, `TextStyle`.
- `font` and `leading` from `../../tokens.ts`; `joinClasses` from `../styles.ts`.

#### UNVERIFIED
- UNVERIFIED: whether the tone classes paint on every host; they depend on the consumer's Tailwind or Uniwind interop and on the consumer defining the matching CSS variables.
- UNVERIFIED: how a fixed `lineHeight` behaves under the system font scale on each host; no runtime was run.

#### Example
```tsx example=LayoutText
import { Stack } from "@nyc-tron/ui/components/layout/Stack";
import { Text } from "@nyc-tron/ui/components/layout/Text";

export const Example = () => (
  <Stack gap={1}>
    <Text variant="body">Last sync 09:41</Text>
    <Text variant="caption" tone="muted">Synced 3 devices</Text>
    <Text size={13} tone="danger">Upload failed</Text>
  </Stack>
);
```

UNVERIFIED count: 2

## Verification

- Item list: `node docs/agent-native/tier1.mjs` regenerates `tier1.json` from the working tree (Node and git only). Result at this commit: 561 `@nyc-tron/ui` subpaths, 391 export a component, 64 tier 1, 497 tier 2.
- Token lines: `node docs/agent-native/token-use.mjs <repo root> <file>...` prints the literal-to-token mapping used above. Two cases the script does not see: values computed from a variable (KeyValueList builds `paddingEnd: 16` from an expression) and component-scoped off-scale tokens, which appear in the item text but not in the machine-readable lists.
- Examples: `node docs/agent-native/check-examples.mjs <tmp dir> <path to tsc> <node_modules dir> docs/agent-native/03-design-handoff.md` extracts the 64 `tsx example=` blocks and runs `tsc --noEmit` with `tsconfig.base.json` and `@nyc-tron/*` mapped to `packages/*/src`. Run here with TypeScript 6.0.3, `@types/react` 19.3.0 and react-native 0.88.0 types borrowed from another checkout's `node_modules` (this repo has none installed). Result: 59 examples, 0 errors in the examples. A deliberately wrong prop was rejected by the same setup. The repo pins TypeScript 7.0.2; that version was not run.
- Limits of that check: modules the harness lacks (for example the TanStack react-table version `DataTable` expects) make some library files report errors of their own and weaken typing on the values that flow from them. The DataTable item says so.
- Not checked: runtime behaviour on any platform, screen reader output, how the consumer's Tailwind or Uniwind config renders a class, and the visual result of any state. Each is a candidate for an `UNVERIFIED:` line wherever the source alone does not settle it.
