# Document layout and formatting controls

Reviewed H-04, H-05, H-06 and H-08 through H-11. New controls share a bounded PropertyInspector owner with scoped async requests, field admission, visible failures and per-instance Zustand text drafts. This inspector exposes independent typed fields; each document control supplies its own schema and document validation.

Typography edits kerning, tracking, leading, paragraph spacing, ligatures and glyph requests. ParagraphStylesGallery exposes inheritance, actual host previews, overrides and update/apply actions; cyclic inheritance is rejected. HeadersFootersEditor covers first/odd/even running text, page numbering and section linkage.

ParagraphRuler provides RNGH horizontal indent handles with vertical scroll escape, visual previews, cancellation, separate nonoverlapping target rows, numeric controls and tab alignment/removal/addition. InsertTableGrid has competing RNGH pan/tap selection plus numeric/button alternatives, and rejects geometry changes during a swipe.

TableLayoutInspector exposes cell merge/split admission, alignment/padding/border/fill settings. PageSetupPanel validates positive text/column areas, supplies paper presets and edits document sections and paper orientation. This is document paper geometry; no app window or headset orientation contract was changed.

Validation: combined UI TypeScript build passed. Broad source/browser/native gesture, text-engine, layout and accessibility acceptance are deferred until the user's review. Paragraph rendering, table operations and pagination remain consuming document-engine work; these controls do not claim to implement an office engine.
