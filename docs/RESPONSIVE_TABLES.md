# Responsive data tables and Tally spreadsheets

**Status:** React Native source, viewport models and CI checks implemented.
Actual device screenshots, screen-reader matrix and native performance profiles
are still acceptance gates, not established evidence.

The two control families share NYC-Tron UI components but have different
semantics. **A record list may become cards; an editable spreadsheet must
remain a coordinate grid.** No raw HTML, WebView or duplicate app-side UI
library is necessary.

## Record data tables: headless TanStack Table v9

`@nyc-tron/ui/components/data/DataTable`

- `layout="auto"` (default) measures the **containing pane** with RN `onLayout`;
  it does *not* inspect device model, fold angle or global viewport width.
- Below `cardsBelow` (default 620 logical RN units), render each visible
  record as a **label/value card**. Keep column identity, sorting model and
  actual value renderers; never discard a column to fit on a phone.
- Mobile sorting appears in accessible horizontal action chips. A consumer
  can override labels with `getColumnLabel` or customize full card composition
  using `renderCard` (which must label values).
- At or above that content width, render columns in the native horizontal
  ScrollView with bounded vertical FlatList. The minimum column width is
  `minColumnWidth` (default 144); do not shrink a seven-column table into
  unreadable thin cells.
- The display mode is switchable with `layout="cards"|"table"`, e.g. for an
  accessibility preference. `width` may be passed by a measured host; otherwise
  the component measures itself. While width is unknown, the conservative
  render is cards rather than a misleading fake phone detection.
- The app still owns its Query data, selection and navigation, as before.
  `DataTable` itself never fetches or remounts the document/session.

```tsx
import { DataTable } from "@nyc-tron/ui/components/data/DataTable";

<DataTable
  data={rows}
  columns={columns}
  getRowId={record => record.id}
  getColumnLabel={columnId => columnLabels[columnId] ?? columnId}
  onRowPress={openRecord}
  cardsBelow={620}
  className="bg-surface-raised"
  rowClassName="border-border"
/>
```

## Tally: retain an editable spreadsheet at phone width

`@nyc-tron/ui/components/forge/SpreadsheetGrid` and
`@nyc-tron/ui/components/forge/sheet-window`

- The spreadsheet **never converts to record cards**, because row numbers,
  column letters, formula references and A1 selection would lose meaning.
- The host supplies width/height or the component measures its own pane.
  A narrow pane (<540 logical RN units by default) uses touch-safe row
  heights (at least 44 units), at least 112-unit-wide columns and a stacked,
  full-width formula bar. Wide panes use the original compact desktop density.
- Native horizontal and vertical scrolling preserve spreadsheet coordinates;
  the fixed formula bar above the scroll region always displays the selected
  address. An on-screen hint explains that more columns are reachable by
  swiping sideways.
- `frozenSheetWindow` computes only the **visible** body range with overscan,
  and `sheetPrefetchRange` snaps it to 64-row by 16-column blocks with one
  block of lookahead. `onWindowChange` therefore fires only when the viewport
  crosses a block edge, and it is stabilized against host inline callback
  recreation. The request carries `frozenRows`/`frozenColumns`; the host also
  loads rows `0..frozenRows` and columns `0..frozenColumns`.
- `frozenRows`/`frozenColumns` render as strips outside the body scroll views
  (corner, frozen headers, frozen cells) and follow the body through
  native-driver transforms.
- Selection is a range: `selection={{anchor,focus}}`. Tap selects one cell,
  long press extends from the anchor. With a hardware keyboard the grid
  handles arrows, Tab, Enter, Home/End, PageUp/PageDown and Ctrl/Cmd jumps;
  Shift extends. Keys typed in the formula bar never move the selection.
- Ctrl/Cmd+C (or the screen-reader "Copy selection" action) calls
  `onCopyRange(range, tsv)`. The kit builds tab-separated text with
  `range-tsv` and never writes the clipboard; the app does. Ranges over
  `maxCopyCells` (1,000,000 by default) show an error instead of copying.
- Cells referenced by the formula in the formula bar are shaded
  (`formula-refs` tokenizes A1 refs, ranges and `$` markers; references to
  other sheets are not highlighted). Pass `sheetName` so `'This Sheet'!A1`
  still highlights.
- Semantics use the `role` prop: `grid`, `row`, `columnheader`, `rowheader`
  and `cell`. Only `grid` is in Android's `AccessibilityRole` enum; passing
  the others to `accessibilityRole` throws `Invalid accessibility role value`
  on Android, while `role` maps unknown ARIA roles to no role.
- `@nitro-forge/tally/grid-adapter` from Nitro Forge PR #39 converts visible
  ranges into bounded batched `TallyDocument.getRange` requests; committing
  changes calls the real `TallyDocument.setCell` and waits for the engine.
  No fake local formula calculation or shadow workbook is maintained.
- Paste and fill are DEFERRED: Tally has no batch `setRange`, and one
  `setCell` round trip per pasted cell would leave a half-applied paste on
  failure. Device validation of the frozen strips and hardware keyboard is
  NOT RUN; the checks above are unit and source tests.

```tsx
import { SpreadsheetGrid } from "@nyc-tron/ui/components/forge/SpreadsheetGrid";

<SpreadsheetGrid
  sheetId={activeSheetId}
  rowCount={rowCount}
  columnCount={columnCount}
  cells={visibleCells}
  sheetName={activeSheetName}
  frozenRows={1}
  frozenColumns={1}
  selection={selection}
  onSelectionChange={setSelection}
  onCopyRange={(range, tsv) => Clipboard.setStringAsync(tsv)}
  onWindowChange={loadVisibleRange}
  onCommitCell={commitCell}
/>
```

**The root host must have measurable height** for the grid's vertical
scrolling. Without an explicit `height`, the surrounding layout should use
`flex: 1` with a bounded parent height. A parent may instead pass its
measured `width` and `height` directly.

## Foldables, accessibility and testing

A folded Surface Duo cover, one pane of a split/open Surface Duo, a
narrow tablet window, or desktop split-view can all be **content-compact**
without being treated as ordinary phones. Hardware family independently
controls the native navigation rail: the right rail persists on native
foldable/dual-screen/tablet/headset devices (even in RTL) while the table
adapts *inside the available hinge-safe region*.

Source tests cover widths 280, 320, 360, 390, 430, 480, 599, 620, 768,
900, 1024; narrow grid touch metrics; forced modes; large virtualized
workbook window; container measurement over screen-width guesses. Native
acceptance still needs: font scaling, RTL, TalkBack/VoiceOver, keyboard/IME,
safe areas, portrait/landscape resize, native Windows/macOS, Surface Duo
open/book/tabletop/closed, and horizontal/vertical scroll gesture arbitration.
The source tests cannot demonstrate those visual/hardware behaviors.
