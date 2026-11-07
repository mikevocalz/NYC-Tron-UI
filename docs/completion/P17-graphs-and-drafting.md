# Graphs and drafting

Reviewed M-10 through M-17.

NodeGraphCanvas reuses PatchGraph and typed graph validation with CanvasPanZoom's native pan/pinch owner. Existing portable node dragging remains the shared legacy responder; scale conversion now maps screen deltas into graph units and internal scrolling can be disabled under the viewport owner. Node ports/cables share existing compatibility and cycle checks. NodeLibrarySearch shares the virtual preset gallery and adds native drag/drop insertion through a host screen-to-graph transform. LiveNodeThumbnail displays actual dependency/cook state and revision-bound previews.

DraftingCommandLine retains failed command input, exposes source completions/history and explicit execute/cancel actions. Snaps/ortho display actual host snap candidates and guide settings. Dimensions/hatching retain geometry references and display host measurements rather than calculating a second CAD model. PaperSpaceLayout shares document paper setup, validates viewport bounds and requests native printing. Paper orientation affects only the document sheet. ParametricConstraintEditor exposes expressions, enabled state, source references, solver degrees of freedom and actual conflict sets.

Validation: combined UI TypeScript build passed. Runtime graph gestures, command execution, solver, associative geometry, printing, native accessibility and persistence acceptance remain deferred until user review. No CAD evaluator or graph execution engine was added to the UI library.
