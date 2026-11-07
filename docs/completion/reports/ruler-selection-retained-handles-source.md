# Ruler and cell-selection handle ownership

ParagraphRuler previously keyed its three handles by an owner token containing current ruler values and text width. CellSelectionOverlay keyed its range handle by an owner token containing row/column dimensions, panes and selection. Updating those inputs replaced focused native handles. They now use semantic marker IDs and pane IDs as keys, preserving the existing mounted view while that handle remains present.

The new coordinate-admission helper separates native identity from an active gesture. Layout-committed source, geometry or disabled transitions consume prior admission. Queued old activate/update/release/accessibility closures cannot operate on the replacement coordinates; completed release consumes admission once. The ruler also includes measured width in its coordinate token and clears local preview/start position on transition. Range geometry remains supplied by the original layout owner. Selection and pane IDs are unchanged.

Cell previews now retain the exact raw callback that received them. Source/config replacement and unmount clear through that callback with null, even after replacement-source write admission closes. Cleanup for an old owner cannot clear a newer owner's preview. Callback replacement restores its predecessor before publishing to a new callback; throwing cleanup consumes the lease, and reentrant cleanup prevents the older publish continuation from installing stale ownership. Local preview clears before host cleanup. Final mutations continue through the existing scoped host guard.

No preview callback exists on ParagraphRuler; only its local handle preview needs cancellation. A handle that genuinely leaves the visible pane is still unmounted. This change does not claim focus preservation for removed controls or native device acceptance.

Validation: coordinate-handle-ownership.test.mjs 7/7 passed. UI and slots TypeScript checks passed. Tests cover source/geometry replacement, consumed release, old queued activation, cleanup through the original callback, stale cleanup protection, throwing/reentrant restoration and stable semantic handle keys. No dependency, window, layout contract or native configuration changed. Native runtime focus and gesture acceptance remain pending.

Selection finish rechecks source admission after the raw preview callback and after lease cleanup. A synchronously replaced source keeps its own preview and cannot receive the previous gesture commit. Stale cancel closures reject before touching shared local state. Two callback-harness regressions cover replacement during update and cleanup.

Ruler layout observation uses a separate committed source token, not write admission. Measurements received while disabled or awaiting a commit remain available when editing resumes; queued measurements from a replaced/unmounted source are rejected. A focused measurement controller test covers this distinction.
