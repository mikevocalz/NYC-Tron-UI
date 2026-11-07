# Sheet management, charts and record views

Reviewed the remaining six P13 rows: I-08, I-13, I-14, I-17, I-18 and I-20. All 21 spreadsheet library rows now have implementation reviews; acceptance remains unverified.

SheetTabs now scopes async actions and rechecks protected/last-sheet/reorder admission. Failed operations retain drafts and confirmation state. ChartBuilder retains the supported native-chart gallery, bounded actual series derivation and preview port, and adds optional host series colors, legend/labels and axis-number formatting. SparklineEditor now explicitly rejects source ranges beyond its 512-value drawing budget instead of presenting a truncated preview as a full-range result.

FreezeSplitControls and SplitSpreadsheetView guard source changes; divider geometry changes cancel gestures without remounting pane content. Final release coordinates update the ratio. RangeComments shares the comment/thread/mention owner and displays actual workbook range labels instead of PDF page labels.

SpreadsheetCardsView now uses native VirtualizedList over the loaded row count, resolving only visible record fields through a bounded single-row model. Record navigation saves a dirty field before leaving; explicit Save/Cancel avoids blur committing a cancelled field. An actual host load-more callback is required to fetch additional data. GridCraft provenance and licenses remain preserved.

Validation: combined UI TypeScript build passed. Full source/browser/native focus, scroll, gesture, accessible input, chart-renderer and workbook acceptance are deferred until user review. Native chart rendering remains in the existing separate adapter package; no fake chart data or record rows were introduced.
