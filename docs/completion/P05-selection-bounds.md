# P05 selection bounds

B-06 adds independent SelectionBounds and selection-bounds-model exports. The host owns its selected object and document. The model exposes handle-first hit testing, absolute move/resize/rotation edits, aspect and size limits, and document-coordinate steps. Rotated resizing holds the opposite corner or edge fixed. SelectionOutline now supplies the shared clipped bounds drawing used by both SelectionBounds and TransformOriginHandle; a composed pivot can omit its duplicate outline.

The component captures the document, revision, viewport, permissions and usable panes for each edit. Replaced documents and retired measurements cannot commit. Gesture cancellation clears the preview; pointer release commits once. Keyboard arrows, Shift steps and native accessibility actions use the same geometry. The app supplies tokens, slots and optional handle content. Native handles and measurement callbacks stay in refs; transient preview state uses a per-instance Zustand store.

Each control reserves a 44-point target. Crowded selections and bounds crossing a hinge use three compact controls inside one usable pane. Bounds drawing clips separately to usable panes. If the pane cannot contain those controls, the component reports the space requirement. The existing app window and orientation remain unchanged.

CanvasPanZoom shares its native gesture relations through context, so a second contact can cancel selection editing and start navigation. Choosing the one-pointer pan tool disables selection editing while the viewport moves. The shared consumer demonstrates these interactions without importing a Forge engine.

Validation: all 841 source tests, UI build/types, native consumer types and package export verification pass (445 conditional exports, 555 emitted ESM files). All 32 affected Chromium tests pass: nine selection, nine navigation, eleven ruler/grid/pivot and three real CanvasKit cases. Checks cover rotated anchors, aspect/size limits, drag preview/commit, scope and permission replacement during contact, keyboard focus/cancellation, compact targets, hinge exclusion, two-finger handoff and one-pointer pan ownership.

SelectionBounds native runtime, spoken accessibility and eight-platform acceptance remain open. The separate native canvas proof applies to navigation and the GPU surface, not these new handles. Review count is 98 of 341; P05 continues with multi-selection and layer controls.
