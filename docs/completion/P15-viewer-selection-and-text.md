# PDF viewer, selection and text editing

Reviewed K-01, K-03, K-05, K-12 and K-21.

VirtualPDFPageViewer virtualizes supplied page descriptors, including single/continuous/two-up/facing layouts, rotation, zoom, visible-page requests and explicit reveal requests. It requires actual native PDF text/vector surfaces; document handles and renderer resources remain with the host. Layout selection changes page composition inside the pane and does not alter app window contracts.

PDFTextSelection consumes actual native glyph rectangles, reading-order text and explicitly typed UTF-16/scalar offsets, with copy permission admission and range adjustment. PDFInlineTextEdit uses native RNGH hit-test taps mapped through the host viewport transform, font/layout capability and validation, an ephemeral review draft and explicit PDF save acknowledgements. It never labels unacknowledged text as saved.

BookmarkOutline shares a bounded virtual tree owner with hierarchy/cycle validation, expansion, native/keyboard focus and destination requests. Button now exposes its existing React 19 native ref path for imperative focus; handles stay in refs. No PDF parser, vector renderer, font-rewriter or native document handle was fabricated.

Validation: combined UI TypeScript build passed. Full source/browser/native page rendering, glyph selection, text-save, keyboard/accessibility and PDF engine acceptance remain deferred until user review. These are UI implementation checkpoints; native PDF service/renderer validation remains open.
