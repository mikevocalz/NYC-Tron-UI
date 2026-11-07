# Spreadsheet formatting and data tools

Reviewed I-09 through I-12, I-15, I-16, I-19 and I-21.

Cell formatting exposes numeric/currency/date/custom formats, alignment, borders, fills and actual host-formatted previews. Conditional rules expose ordered comparison/formula/color-scale/icon/data-bar settings with bounded ranges/thresholds and host styles. ValidationDropdown admits actual list values or explicit custom input and preserves host validation feedback. SortFilterHeader provides per-column menus, multiple ordered sorts and visible-row filter settings.

PivotFieldList supports native RNGH field drag to row/column/value/filter zones, button alternatives, aggregation and order/removal requests. Native coordinate measurements are scoped; changed zone geometry or root origin rejects an obsolete drop. DataImportWizard exposes actual source/format/encoding/worksheet/conversion mappings and supplied preview rows/errors before host import, with progress and cancellation. SavedSheetViewManager saves/restores the actual view snapshot, validates names and scope, and requires explicit confirmation for deletion. TableStyleGallery exposes named tables, styles and header/totals/banding/structured-reference settings through the shared inspector.

Validation: combined UI TypeScript build passed. Full source/browser/native pointer, accessibility and workbook-service acceptance remain deferred until user review. Sorting, filtering, formula evaluation, pivot calculation, parsing/conversion and persistence remain host engine operations; this UI checkpoint does not claim those algorithms or their runtime acceptance.
