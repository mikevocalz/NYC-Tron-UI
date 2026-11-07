# P05 multi-selection controls

B-07 provides independent MultiSelectionControls and multi-selection-model exports. Ordered object selection supports Shift ranges, Ctrl/Command toggles, native add/remove actions, select-all, clear and invert. The same combination model accepts lasso or engine hit-test IDs. SelectionMarquee remains the geometry owner; the consumer demonstrates an actual lasso with an explicitly documented object-centre hit policy.

The host owns selection, grouping and property transactions. Group commands require editable siblings; ungroup requires selected groups. Missing parents, cycles and stale identities are rejected. One shared-property mutation carries the complete selected ID set. Empty, unavailable, mixed and common values remain distinct. Numeric, boolean and choice editors reuse existing controls. A selected read-only object prevents mutation across the selection while selection navigation remains available.

Scope, revision, selection, permissions, hierarchy and property schema changes retire old editor callbacks. Controlled numeric acknowledgements retain the editor identity; selection/document changes abandon drafts. Metadata, object count, property count and retained text are bounded. The component adds no document engine or serialized native resources.

Validation passes all 847 source tests, UI build/types and native consumer types. Ten Chromium checks cover range/toggle input, keyboard focus, native-equivalent add/remove buttons, one shared-property transaction, grouping/ungrouping, document/permission replacement while editing, read-only selection, actual lasso selection and narrow RTL targets. The first test run used a button selector for a radio segment and Control-click on macOS; the final run uses the control's actual role and Command-click, with all ten passing in 7.5 seconds.

Review count is 99 of 341. Native runtime, spoken accessibility, large-document performance and eight-platform acceptance remain open. P05 continues with the layer stack and remaining canvas controls.
