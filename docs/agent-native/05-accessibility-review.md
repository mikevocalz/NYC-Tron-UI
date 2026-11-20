# 05 Accessibility review, tier 1 (WCAG 2.1 AA)

Status: phase 1 step 5. Written against `@nyc-tron/ui` source at repo HEAD of branch `agent-native-20261119` (1.0.0-rc.2). Nothing under `packages/` changed.

**Read from source only.** No component was rendered, no screen reader was run, no device or browser was used. Every FAIL below is arithmetic on the token values or a fact visible in the source. Everything that needs a render is UNVERIFIED and names the test that settles it.

Companion files: `contrast.mjs` (the ratios, dependency free, `node docs/agent-native/contrast.mjs`), `a11y-status.json` (status and failures per item), `03-design-handoff.md` (the per-item facts this report builds on), `tokens.json`.

## Summary

| Status | Count |
|---|---:|
| PASS | 19 |
| FAIL | 21 |
| UNVERIFIED | 19 |
| Total tier 1 items | 59 |

Android 48dp: 41 items size a control with the 44 literal (guideline finding F08, not counted in FAIL, see the status rules).

### The 10 worst findings

Ranked by user impact, then by how many items carry it.

| Rank | Id | Severity | WCAG | Finding | Items |
|---:|---|---|---|---|---:|
| 1 | F02 | Critical | 2.4.7, 1.4.11 | Keyboard-active option in Select and CommandPalette is marked by bg-surface-sunken (1.11/1.11:1) or bg-primary/10 (1.15/1.2:1); the option never holds focus (aria-activedescendant), so that tint is the only focus cue. On a selected Select option the cue disappears. | 2 |
| 2 | F01 | Critical | 1.3.1, 4.1.2 | DataTable wide mode exposes no table, row, columnheader or cell roles; rows are Pressables that merge their cells (DataTable.tsx:181-231). | 1 |
| 3 | F03 | Major | 1.4.11 | Text field boundary is border-border on surface-sunken (1.42/1.75:1), under 3:1 in both schemes. The border is the only visual cue for the field. | 15 |
| 4 | F04 | Major | 1.4.11 | Selected state shown by bg-primary/10 (1.15/1.2:1) with a border-border outline (1.58/1.58:1) in List, IconButton and TreeGrid. | 3 |
| 5 | F05 | Major | 1.4.11 | WindowTitleBar close glyph (border-text-muted) on hover:bg-danger is 1.07/1.01:1, so the glyph disappears when the pointer is over it (windows layout). | 1 |
| 6 | F12 | Unverified | 2.4.7 | CommandPopover menu items show focus only as a bg-primary/10 tint (1.15/1.2:1). A host outline may also draw. Affects every component that opens it. | 8 |
| 7 | F07 | Unverified | 2.4.7, 1.4.11 | Focus ring (ring-focus) and the selected fill (bg-primary) are the same colour (1/1:1). The ring's outer edge meets the page at 5.81/6.93:1, but the ring cannot be told from the fill. | 7 |
| 8 | F10 | Unverified | 2.4.7 | CollapsibleDrawer sets no focus style on the toggle or the items and handles no Escape key. | 2 |
| 9 | F06 | Minor | 1.4.11 | PaneSplitter idle divider is a 1px border-border line (1.42/1.75:1); the 44pt hit area is invisible. | 1 |
| 10 | F11 | Unverified | 1.4.11 | Button loading spinner sets no color; the iOS default #999999 is 2.04/1.19:1 on primary and 2.31/1.25:1 on danger. | 1 |

Full catalogue with the affected items is in "All findings".

## Method and status rules

- Values: colour tokens come from `tokens.json` (reference light and dark values, which mirror `packages/core/src/theme.ts` `TRON_THEME_TOKENS` and `docs/THEME_TOKENS.md`). A consumer can override them, so the ratios describe the reference theme, not a shipped app (GU3).
- Ratios are written light/dark, for example `5.81/7.46:1`. Text needs 4.5:1 (SC 1.4.3), UI components, state indicators and graphics need 3:1 (SC 1.4.11). Disabled controls are exempt.
- Targets: 44pt is Apple's minimum, 48dp is Material's. WCAG 2.1 AA has no target-size criterion (2.5.5 is AAA, 2.5.8 arrived in 2.2), so a size shortfall is a guideline finding. `size.touch` is the proposed token for the literal 44 (`tokens.json`, 152 literals). `min-h-11` is the Tailwind default for 44 and has no token. 40, 48, 56 and 64 have no token either.
- Reduced motion: WCAG 2.1 AA has no criterion for it (2.3.3 is AAA), so it is a platform-guideline finding.
- **PASS**: nothing in the source breaks an AA criterion and the item's own checks have no open question beyond GU1 to GU3.
- **FAIL**: the source proves a violation, by contrast arithmetic or missing semantics. An item that renders a failing tier 1 item in its default output inherits that failure and says so.
- **UNVERIFIED**: the answer depends on rendering, on the host, or on a screen reader. The reason and the test are given.
- Class strings such as `focus-visible:ring-2` depend on the consumer's Tailwind or Uniwind setup. This report treats a ring class as present in the source, and GU1 covers whether it paints.

### Global open questions (apply to every interactive item, not repeated in status)

| Id | Question | Test that settles it |
|---|---|---|
| GU1 | Do the `focus-visible:ring-*` classes paint on web and on Windows, macOS and QNX hosts? No tier 1 file has a Platform branch for focus on those hosts. | Web: Tab through each item in Chrome and screenshot, check the computed box-shadow. Windows, macOS, QNX: the same pass with a hardware keyboard on each host. |
| GU2 | What does each screen reader announce? Roles and labels are read from props; the output is not heard. | VoiceOver (iOS, macOS), TalkBack, NVDA or Narrator on the web build, one pass per item. |
| GU3 | Do the consumer's token values match the reference values? | Run `contrast.mjs` with the app's values substituted into `tokens.json`. |

## Contrast table

Output of `node docs/agent-native/contrast.mjs`. Pairs are those the tier 1 sources use (class strings read from source). FAIL rows are findings only where an item uses that pair for the purpose in "Where".

| Pair | Kind | Light | Dark | Needs | Status | Where |
|---|---|---:|---:|---:|---|---|
| text/surfaceRaised | text | 17.79 | 13.83 | 4.5 | PASS | body and label text on cards, popovers, banners, list rows |
| text/surfaceSunken | text | 16.01 | 15.31 | 4.5 | PASS | field text, tab bars, inspector rows |
| textMuted/surfaceRaised | text | 6.16 | 7.14 | 4.5 | PASS | supporting text, inactive tabs, group labels on raised surfaces |
| textMuted/surfaceSunken | text | 5.54 | 7.9 | 4.5 | PASS | neutral Badge label, hint text, inactive tabs on sunken surfaces |
| onPrimary/primary | text | 5.81 | 7.46 | 4.5 | PASS | Button primary, selected tab, segment, tool, drawer item, Select option |
| onDanger/danger | text | 6.57 | 8.11 | 4.5 | PASS | Button danger |
| danger/surfaceRaised | text | 6.57 | 7.24 | 4.5 | PASS | text-danger on raised surfaces (ErrorMessage, Select message) |
| danger/surfaceSunken | text | 5.91 | 8.01 | 4.5 | PASS | text-danger on sunken surfaces (TextField, UnitInput errors) |
| text/primary10>surfaceRaised | text | 15.41 | 11.57 | 4.5 | PASS | selected row or tool tint (CommandPalette, RibbonTabs, PresetGallery) |
| textMuted/primary10>surfaceRaised | text | 5.34 | 5.97 | 4.5 | PASS | muted text on the selected tint |
| textMuted/dangerHover | graphic | 1.07 | 1.01 | 3 | FAIL | WindowTitleBar glyph strokes (border-text-muted) on hover:bg-danger (windows layout, close) |
| border/surfaceRaised | ui | 1.58 | 1.58 | 3 | FAIL | control and card outline on raised surfaces |
| border/surfaceSunken | ui | 1.42 | 1.75 | 3 | FAIL | field outline on sunken surfaces (TextField, Select, FindReplace) |
| focus/surfaceRaised | ui | 5.81 | 6.93 | 3 | PASS | focus ring against raised surfaces |
| focus/surfaceSunken | ui | 5.22 | 7.67 | 3 | PASS | focus ring against sunken surfaces |
| focus/primary | ui | 1 | 1 | 3 | FAIL | focus ring against a selected (bg-primary) control |
| accent/surfaceRaised | ui | 5.17 | 8.86 | 3 | PASS | accent slider thumb, progress fill, toggled outline |
| accent/surfaceSunken | ui | 4.65 | 9.81 | 3 | PASS | accent track fill, scrubber progress |
| info/surfaceRaised | ui | 6.45 | 8.17 | 3 | PASS | Banner and Badge info border and mark |
| success/surfaceRaised | ui | 5.38 | 8.72 | 3 | PASS | Banner and Badge success border and mark |
| danger/surfaceRaisedUI | ui | 6.57 | 7.24 | 3 | PASS | Banner and Badge danger border and mark |
| primary/surfaceRaised | ui | 5.81 | 6.93 | 3 | PASS | ToastAndProgress bar fill on a raised track |
| surfaceSunken/surfaceRaised | ui | 1.11 | 1.11 | 3 | FAIL | hover and active-option highlight (bg-surface-sunken) against a raised list or bar |
| primary10>surfaceRaised/surfaceRaised | ui | 1.15 | 1.2 | 3 | FAIL | active-option highlight (bg-primary/10) against the raised list (CommandPalette, CommandPopover) |
| iosSpinner/primary | ui | 2.04 | 1.19 | 3 | FAIL | ActivityIndicator with no color prop on iOS (#999999 per the React Native docs) inside a primary Button |
| iosSpinner/surfaceRaised | ui | 2.85 | 5.8 | 3 | FAIL | same spinner on a raised surface (ToastAndProgress rows) |
| iosSpinner/danger | ui | 2.31 | 1.25 | 3 | FAIL | same spinner inside a danger Button |
| textMuted/surfaceRaisedUI | graphic | 6.16 | 7.14 | 3 | PASS | glyph strokes (clear, chevron, close) drawn in text-muted |
| textMuted/surfaceSunkenUI | graphic | 5.54 | 7.9 | 3 | PASS | glyph strokes on sunken surfaces |

Reading the FAIL rows: `border/*` is the field boundary (F03) and a decorative outline elsewhere. `primary10>surfaceRaised/surfaceRaised` and `surfaceSunken/surfaceRaised` are tint-only states (F02, F04). `focus/primary` is F07. `textMuted/dangerHover` is F05. `iosSpinner/*` is F11 and depends on the platform default.

## All findings

| Id | Severity | WCAG | Finding | Items |
|---|---|---|---|---|
| F01 | Critical | 1.3.1, 4.1.2 | DataTable wide mode exposes no table, row, columnheader or cell roles; rows are Pressables that merge their cells (DataTable.tsx:181-231). | DataTable |
| F02 | Critical | 2.4.7, 1.4.11 | Keyboard-active option in Select and CommandPalette is marked by bg-surface-sunken (1.11/1.11:1) or bg-primary/10 (1.15/1.2:1); the option never holds focus (aria-activedescendant), so that tint is the only focus cue. On a selected Select option the cue disappears. | CommandPalette, Select |
| F03 | Major | 1.4.11 | Text field boundary is border-border on surface-sunken (1.42/1.75:1), under 3:1 in both schemes. The border is the only visual cue for the field. | PropertyInspector, CommandPalette, Select, AssetBrowser, FindReplaceContent, FindReplacePopover, InspectorPanel, InspectorSearch, KeyboardShortcutHUD, RangeSlider, RotaryKnob, SliderField, UnitInput, WorkspacePresetSwitcher, TextField |
| F04 | Major | 1.4.11 | Selected state shown by bg-primary/10 (1.15/1.2:1) with a border-border outline (1.58/1.58:1) in List, IconButton and TreeGrid. | TreeGrid, IconButton, List |
| F05 | Major | 1.4.11 | WindowTitleBar close glyph (border-text-muted) on hover:bg-danger is 1.07/1.01:1, so the glyph disappears when the pointer is over it (windows layout). | WindowTitleBar |
| F06 | Minor | 1.4.11 | PaneSplitter idle divider is a 1px border-border line (1.42/1.75:1); the 44pt hit area is invisible. | PaneSplitter |
| F07 | Unverified | 2.4.7, 1.4.11 | Focus ring (ring-focus) and the selected fill (bg-primary) are the same colour (1/1:1). The ring's outer edge meets the page at 5.81/6.93:1, but the ring cannot be told from the fill. | NavigationRail, SegmentedControl, ContextualToolbar, SplitButton, ToolRail, WorkspaceHost, TabBar |
| F08 | Guideline | Material 48dp (not a WCAG 2.1 AA criterion) | Controls sized with the 44 literal (size.touch) are 4dp under the 48dp Android guideline. | Button, DataTable, TreeGrid, DragGrabHandle, Banner, EmptyState, PrecisionScrubber, PropertyInspector, office-controls, IconButton, List, CollapsibleDrawer, NavigationRail, SegmentedControl, Select, AdaptiveDock, ContextMenu, ContextualToolbar, DocumentTabBar, FindReplaceContent, FindReplacePopover, InspectorPanel, InspectorSearch, InspectorSection, KeyboardShortcutHUD, MenuButton, PaneSplitter, PresetGallery, PropertyRow, RangeSlider, RibbonTabs, RotaryKnob, SliderField, SplitButton, StatusBar, ToastAndProgress, ToolRail, UnitInput, WorkspaceHost, WorkspacePresetSwitcher, TabBar |
| F09 | Minor | 2.3.3 is AAA; platform guideline | No tier 1 component reads reduced motion. Six components add `motion-reduce:transition-none` next to no transition class, so it does nothing as written. Modal fades on native (CommandPalette, CommandPopover, WorkspacePresetSwitcher) follow the OS. | Button, IconButton, List, CommandPalette, CommandPopover, SegmentedControl, ContextMenu, FocusAndA11yLayer, MenuButton, WorkspacePresetSwitcher, TabBar, WindowTitleBar |
| F10 | Unverified | 2.4.7 | CollapsibleDrawer sets no focus style on the toggle or the items and handles no Escape key. | CollapsibleDrawer, ContextMenu |
| F11 | Unverified | 1.4.11 | Button loading spinner sets no color; the iOS default #999999 is 2.04/1.19:1 on primary and 2.31/1.25:1 on danger. | Button |
| F12 | Unverified | 2.4.7 | CommandPopover menu items show focus only as a bg-primary/10 tint (1.15/1.2:1). A host outline may also draw. Affects every component that opens it. | CommandPopover, ContextMenu, ContextualToolbar, MenuButton, RibbonTabs, SplitButton, StatusBar, ToolRail |
| F13 | Unverified | 1.4.11 | DocumentTabBar and AdaptiveDock mark the selected tab by raised-versus-sunken fill (1.11/1.11:1) plus font weight. | AdaptiveDock, DocumentTabBar |
| F14 | Unverified | 2.1.1, 2.5.1 | DragGrabHandle is focusable={false} and has no role or action; the keyboard route is a menu the host supplies. | DragGrabHandle, AdaptiveDock |
| F15 | Unverified | 1.4.11 | Slider and scrubber rails use border-border (1.42/1.75:1) or caller colours; the thumb and fill pass. | PrecisionScrubber, RangeSlider, SliderField |
| F16 | Minor | 1.3.1, 4.1.2 | Containers with accessibilityLabel and no role (PropertyInspector, StatusBar, CollapsibleDrawer lists, AssetBrowser list); most screen readers ignore the label. | PropertyInspector, CollapsibleDrawer, AssetBrowser, StatusBar |
| F17 | Minor | 4.1.2 | NavigationRail uses tablist and tab with no tabpanel; it is a navigation list. | NavigationRail |
| F18 | Unverified | 3.2.1 | PresetGallery previews a preset when a tile receives focus. | PresetGallery |

## Per item

Each item gives (a) contrast, (b) focus and keyboard, (c) touch target, (d) screen reader, (e) motion, (f) status. The checks come from reading the file named in the heading.

### Button

Source: `packages/ui/src/components/Button.tsx`

- (a) Contrast: Label pairs: primary onPrimary/primary 5.81/7.46:1; danger onDanger/danger 6.57/8.11:1; secondary and ghost text/surfaceRaised 17.79/13.83:1. Loading spinner has no color prop (Button.tsx:68): iOS default #999999 on primary is 2.04/1.19:1 (F11). Disabled and loading use opacity 0.5, exempt as an inactive control.
- (b) Focus and keyboard: Web: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) at Button.tsx:55. Keyboard: native Pressable. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: minWidth 44 and minHeight 40/44/48 by size (Button.tsx:59, size.touch for 44, 40 and 48 have no token); sm adds hitSlop 2 (:61) so its hit area is 44. targetSize prop throws below 44. iOS pass. Android: sm and md 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: accessibilityRole=button, accessibilityLabel defaults to title, accessibilityState disabled and busy (:63-65). Spinner labelled Loading. Nothing missing.
- (e) Motion: No animation besides the platform ActivityIndicator. `motion-reduce:transition-none` (:55) has no transition class beside it, so it does nothing as written (F09).
- (f) Status: **UNVERIFIED**. Spinner colour on primary and danger fills is 2.04/1.19:1 on iOS if the platform default applies.
  - UNVERIFIED: Loading spinner contrast on the primary and danger fills (F11). Test: Render loading Button on an iOS simulator, sample the spinner pixel against the fill, or set color explicitly and re-measure.

### Card

Source: `packages/ui/src/components/Card.tsx`

- (a) Contrast: Non-interactive surface. Border border-border on raised/sunken is 1.58/1.58:1 / 1.42/1.75:1; decorative, no 1.4.11 requirement. Text inside is the caller's.
- (b) Focus and keyboard: Not focusable, no handlers.
- (c) Touch target: Not interactive.
- (d) Screen reader: Plain View, no role, no label. Correct for a presentation container.
- (e) Motion: None.
- (f) Status: **PASS**. Static container with no interactive or text content of its own.

### KeyValueList

Source: `packages/ui/src/components/content/KeyValueList.tsx`

- (a) Contrast: Label text-text-muted on page surface 6.16/7.14:1; value text-text 17.79/13.83:1.
- (b) Focus and keyboard: Not focusable. Values use `selectable` (:73), so text can be selected with the mouse and keyboard on web.
- (c) Touch target: Not interactive.
- (d) Screen reader: role=list on the root and role=listitem per pair (:58,:64). Term and value are separate Text nodes in one listitem, so the pairing is by order only.
- (e) Motion: None.
- (f) Status: **PASS**. Static list with contrast above 4.5:1 for both text colours.

### DataTable

Source: `packages/ui/src/components/data/DataTable.tsx`

- (a) Contrast: text-text on surface-raised 17.79/13.83:1; header band bg-surface-sunken with text-text 16.01/15.31:1; row separators border-border 1.58/1.58:1, decorative.
- (b) Focus and keyboard: Sortable headers carry `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:148, :195). Body rows have no focus style and are focusable only when onRowPress is set (Pressable disabled otherwise). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Sort buttons min-h-11 (:147), headerHeight and rowHeight default 44 (:54, a prop, size.touch). Android: 44 below 48 (F08). Card mode rows are a Pressable around the card. Android 48dp: below (F08).
- (d) Screen reader: Wide mode (:181-231) is Views and Pressables with no table, row, cell or columnheader role anywhere (roles appear only at :142 :164 :190 :210 as button or header). The root has accessibilityLabel="Data table" but no role (:127). A row Pressable is an accessible element on iOS, so its cells merge into one announcement. Column and row relationships are lost (F01).
- (e) Motion: None.
- (f) Status: **FAIL**. Wide layout exposes no table structure (1.3.1, 4.1.2).

### TreeGrid

Source: `packages/ui/src/components/data/TreeGrid.tsx`

- (a) Contrast: text-text on surface-raised 17.79/13.83:1. Selected row bg-primary/10 against the raised surface is 1.15/1.2:1 (F04). Focused row adds ring-2 ring-focus 5.81/6.93:1.
- (b) Focus and keyboard: role=treegrid, focusable, onKeyDown with roving focusId (:208-213); the focused row shows ring-2 ring-focus (:188). Expand button has its own ring (:161). Web keyboard path present. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Expand button minWidth and minHeight 44 (:162, size.touch); row label minHeight 44 (:155); header height 44 (:223). Compact data cells minHeight 28 are not interactive. Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: treegrid, row (aria-selected, aria-expanded), columnheader, cell, expand button with Expand/Collapse label and expanded state, leaf spacer hidden (:141-209). Uses role not accessibilityRole for row and cell on purpose (Android enum). Column reorder exposed as accessibilityActions.
- (e) Motion: Animated.Value scrollX drives the pinned-column offset from the user's scroll (:73, :220). It tracks input, so no reduce-motion issue.
- (f) Status: **FAIL**. A selected row that is not focused is marked only by a tint at 1.15/1.2:1 (1.4.11).

### DragGrabHandle

Source: `packages/ui/src/components/DragGrabHandle.tsx`

- (a) Contrast: Grip dots border-text-muted 6.16/7.14:1 / 5.54/7.9:1 as graphic. Disabled opacity 0.4, exempt.
- (b) Focus and keyboard: focusable={false} (:77), so the handle is not in the tab order. Escape handled by onKeyDown while a web pointer drag is active (:57). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: minWidth and minHeight 44 (:78, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: accessible, accessibilityLabel from label, accessibilityHint "Drag to move. Press Escape to cancel.", aria-disabled. No accessibilityRole and no activation action, so a screen reader user hears a label and hint for something they cannot operate (F14).
- (e) Motion: None.
- (f) Status: **UNVERIFIED**. Pointer-only control; whether a keyboard or screen-reader alternative exists depends on the host (AdaptiveDock supplies a menu).
  - UNVERIFIED: Keyboard and screen-reader alternative to dragging (F14). Test: With AdaptiveDock, move a floating panel using only keyboard, then only VoiceOver or NVDA, and confirm every dock target is reachable.

### Badge

Source: `packages/ui/src/components/feedback/Badge.tsx`

- (a) Contrast: neutral label text-text-muted on surface-sunken 5.54/7.9:1; toned label text-text on surface-raised 17.79/13.83:1; tone dot border-info 6.45/8.17:1, border-success 5.38/8.72:1, border-danger 6.57/7.24:1, border-accent 5.17/8.86:1. Label is 12pt (text-xs), text threshold 4.5:1 applies and passes.
- (b) Focus and keyboard: Static, not focusable.
- (c) Touch target: Not interactive.
- (d) Screen reader: accessible with accessibilityLabel = label (:40). Tone is carried by the dot and by the label text, never by colour alone. The dot is aria-hidden.
- (e) Motion: None.
- (f) Status: **PASS**. Static chip, all pairs above threshold, tone not colour-only.

### Banner

Source: `packages/ui/src/components/feedback/Banner.tsx`

- (a) Contrast: title text-text and description text-text-muted on surface-raised 17.79/13.83:1 / 6.16/7.14:1; neutral tone on surface-sunken 5.54/7.9:1; tone borders 6.45/8.17:1 5.38/8.72:1 6.57/7.24:1.
- (b) Focus and keyboard: Dismiss button: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:70). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Dismiss min-h-11 min-w-11 (:69, 44, no token; Tailwind default). Negative marginVertical -10 keeps the 44pt box. Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: role=status or alert via `live` plus accessibilityLiveRegion polite or assertive (:53-54). Dismiss: accessibilityRole=button, label default "Dismiss". Status mark has tone and the title carries the meaning.
- (e) Motion: None.
- (f) Status: **PASS**. Live region, labelled dismiss, contrast above threshold.

### EmptyState

Source: `packages/ui/src/components/feedback/EmptyState.tsx`

- (a) Contrast: text-text and text-text-muted on the page surface 17.79/13.83:1 / 6.16/7.14:1.
- (b) Focus and keyboard: Action is a Button (see Button).
- (c) Touch target: Action Button: see Button. Android 48dp: below (F08).
- (d) Screen reader: Title role=heading with aria-level on web (:61). The art slot is caller-owned (comment :28). accessibilityHint is forwarded to the action.
- (e) Motion: None.
- (f) Status: **PASS**. Heading semantics and passing text contrast.

### ErrorMessage

Source: `packages/ui/src/components/feedback/ErrorMessage.tsx`

- (a) Contrast: text-danger on raised 6.57/7.24:1, on sunken 5.91/8.01:1. The "!" mark is not the only signal, the text is.
- (b) Focus and keyboard: Static.
- (c) Touch target: Not interactive.
- (d) Screen reader: Text role=alert with accessibilityLiveRegion polite (:33). Both are set, so assertive (alert) and polite differ by platform; neither drops the message.
- (e) Motion: None.
- (f) Status: **PASS**. Announced as an alert, contrast above 4.5:1.

### FieldGroup

Source: `packages/ui/src/components/FieldGroup.tsx`

- (a) Contrast: Title text-text and helper text-text-muted on raised 17.79/13.83:1 / 6.16/7.14:1; group border 1.58/1.58:1, decorative.
- (b) Focus and keyboard: Static.
- (c) Touch target: Not interactive.
- (d) Screen reader: FieldSection role=group with aria-label=title (:36); title accessibilityRole=header with aria-level 3 on web (:40).
- (e) Motion: None.
- (f) Status: **PASS**. Grouping and heading semantics present.

### PrecisionScrubber

Source: `packages/ui/src/components/forge/inputs/PrecisionScrubber.tsx`

- (a) Contrast: Label text-text and unit text-text-muted 17.79/13.83:1 / 6.16/7.14:1; error text-danger 6.57/7.24:1. Ticks and rail take scaleColor and accentColor from the caller, or bg-border 1.58/1.58:1 (:181-185); ticks use opacity 0.55 for minor marks. Forced-colors branch uses CanvasText and Highlight.
- (b) Focus and keyboard: Focus tracked in store (:163-164); keyboard handler onKeyDown with focusable={!blocked} (:116, :157). Step buttons are Pressables. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: targetSize default 44 with RangeError under 44 (:76-78, size.touch); step buttons and rail use it (:126-177). Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: Scrubber: accessibilityRole=adjustable, label, hint copy.gestureHint, aria-valuemin/max/now/text, accessibilityActions increment and decrement (:165-172). Step buttons: role button, label. Error: accessibilityLiveRegion assertive.
- (e) Motion: No animation in the file.
- (f) Status: **UNVERIFIED**. Rail and tick contrast depend on caller colours and a bg-border fallback at 1.58/1.58:1 (F15).
  - UNVERIFIED: Rail, tick and focus contrast with the real scaleColor and accentColor (F15). Test: Render the scrubber with the app theme, sample tick, rail and focus pixels against the surface, or run contrast.mjs with the consumer's tokens.

### PropertyInspector

Source: `packages/ui/src/components/forge/inputs/PropertyInspector.tsx`

- (a) Contrast: Renders UnitInput, Select, Button, TextInput. Number fields inherit UnitInput's boundary 1.42/1.75:1 (F03).
- (b) Focus and keyboard: Fields are native controls. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Inherits UnitInput 44 and Select 48; multiline TextInput has no minHeight (:43). Android: see parts. Android 48dp: below (F08).
- (d) Screen reader: Root View has accessibilityLabel but no role (:32), so the label is dropped by most screen readers. Header uses accessibilityRole=header; each TextInput has accessibilityLabel (:43).
- (e) Motion: None.
- (f) Status: **FAIL**. Inherits UnitInput and Select field-boundary failures (F03).

### office-controls

Source: `packages/ui/src/components/forge/office/office-controls.tsx`

- (a) Contrast: ToolButton on state: border-accent 5.17/8.86:1 with bg-accent/10; off: border-border 1.58/1.58:1, the icon or label carries identity. Glyph strokes bg-text 17.79/13.83:1.
- (b) Focus and keyboard: ToolButton `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:58). Keyboard: Pressable; the file exports an OfficeKeyEvent type for roving. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: OFFICE_TOUCH_TARGET = 44 as minWidth and minHeight (:6, :61, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: accessibilityRole=button, or togglebutton with accessibilityState.checked including "mixed" (:54-56); web gets role=button with aria-pressed (:53). Label defaults to the label prop; iconOnly keeps it.
- (e) Motion: None.
- (f) Status: **PASS**. Toggle semantics with mixed state, 44pt target, ring present.

### PanResponderDrag

Source: `packages/ui/src/components/gestures/PanResponderDrag.tsx`

- (a) Contrast: Renders no visuals.
- (b) Focus and keyboard: Adds responder handlers to its child; not focusable.
- (c) Touch target: Not a control.
- (d) Screen reader: None needed; clones the child with pan handlers.
- (e) Motion: None.
- (f) Status: **PASS**. Transport with no UI; the child owns accessibility (see DragGrabHandle, PaneSplitter).

### IconButton

Source: `packages/ui/src/components/IconButton.tsx`

- (a) Contrast: Selected non-primary variants use bg-primary/10 with border-border: tint 1.15/1.2:1, border 1.58/1.58:1, both under 3:1 (F04; forced-colors gets border-[Highlight]). Primary and danger fills: icon colour is the caller's, so glyph contrast is UNVERIFIED. Ring 5.81/6.93:1.
- (b) Focus and keyboard: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:55). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: sm 44, md 48 as minWidth and minHeight plus h-11/h-12 (:46, :54); targetSize overrides. sm is size.touch. Android: sm 44 literal, 4dp under the 48dp Android guideline. md passes. Android 48dp: below (F08).
- (d) Screen reader: accessibilityRole=button, aria-label and accessibilityLabel both set, optional hint, accessibilityState disabled and selected, aria-pressed on web (:49-51). Icon wrapper aria-hidden.
- (e) Motion: `motion-reduce:transition-none` with no transition class (F09).
- (f) Status: **FAIL**. Selected state is a 1.15/1.2:1 tint (1.4.11).

### AdaptiveColumns

Source: `packages/ui/src/components/layout/AdaptiveColumns.tsx`

- (a) Contrast: No colour.
- (b) Focus and keyboard: Not interactive.
- (c) Touch target: Not interactive.
- (d) Screen reader: Layout only; reflows by flexWrap so content does not need horizontal scrolling at 320 CSS px if columns are narrower than that (1.4.10 depends on the caller's minWidth).
- (e) Motion: None.
- (f) Status: **PASS**. Pure layout; supports reflow.

### ContentFrame

Source: `packages/ui/src/components/layout/ContentFrame.tsx`

- (a) Contrast: No colour.
- (b) Focus and keyboard: Not interactive.
- (c) Touch target: Not interactive.
- (d) Screen reader: Layout only (maxWidth, minWidth 0).
- (e) Motion: None.
- (f) Status: **PASS**. Pure layout.

### List

Source: `packages/ui/src/components/List.tsx`

- (a) Contrast: title text-text 17.79/13.83:1, supporting text-text-muted 6.16/7.14:1. Selected row bg-primary/10 vs raised 1.15/1.2:1 (F04). Hover bg-surface-sunken vs raised 1.11/1.11:1 is hover only.
- (b) Focus and keyboard: Pressable rows: `focus-visible:ring-2 ring-inset ring-focus` (:80, 5.81/6.93:1). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Rows min-h-11 (:69, 44, no token). Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: role=list and listitem (:39, :42). Pressable row: accessibilityRole=button, label from children plus supporting text, hint, state disabled and selected, aria-current on web (:75-78). A non-pressable selected row sets accessibilityState on a View that is not accessible, so iOS ignores it (:70-71).
- (e) Motion: `motion-reduce:transition-none` with no transition (F09).
- (f) Status: **FAIL**. Selected row marked by a 1.15/1.2:1 tint (1.4.11).

### CollapsibleDrawer

Source: `packages/ui/src/components/navigation/CollapsibleDrawer.tsx`

- (a) Contrast: Selected item bg-primary with text-on-primary 5.81/7.46:1; others text-text 17.79/13.83:1. Scrim rgba(0,0,0,0.25) decorative.
- (b) Focus and keyboard: No focus-visible class and no focus state on the toggle (:64-72) or the items (:81-93). Whether the host draws a default outline is not in the source (F10). No Escape handler in the file; the scrim Pressable and the toggle close it. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Toggle h-12 w-12 (:69, 48) passes both. Items min-h-11 (:87, 44, no token); header row minHeight 56 (:149). Android items: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: Toggle: button, label flips Open or Close navigation, state expanded. Items: button, label, state selected and disabled. Content behind an open overlay gets accessibilityElementsHidden and no-hide-descendants (:120-121), pane gets accessibilityViewIsModal (:136). The two lists carry labels but no landmark role (S1).
- (e) Motion: No animation in the file (display toggles).
- (f) Status: **UNVERIFIED**. No explicit focus style for any control; default outline not checked (F10).
  - UNVERIFIED: Visible focus on toggle and items (F10). Test: Web: Tab to the toggle and each item, screenshot; native Windows and macOS: same with a keyboard.
  - UNVERIFIED: Hidden content stays unfocusable while overlay is open. Test: Web: open the overlay, press Tab, confirm focus stays inside the pane.

### NavigationRail

Source: `packages/ui/src/components/NavigationRail.tsx`

- (a) Contrast: Selected bg-primary and text-on-primary 5.81/7.46:1; others text-text 17.79/13.83:1. Selected item is bg-primary and the ring is ring-focus, the same colour (1/1:1); the ring's outer edge still meets the page at 5.81/6.93:1 (F07).
- (b) Focus and keyboard: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:56). No roving handler, so every tab is a Tab stop. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Items min-h-11 (:55, 44, no token). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: tablist and tab roles with accessibilityState selected and disabled (:43-53). It is a destination list with no tabpanel, so tab is the wrong role for navigation (F17). Icons hidden.
- (e) Motion: None.
- (f) Status: **UNVERIFIED**. Focus ring and selected fill share one colour (1/1:1) (F07).
  - UNVERIFIED: Focus visibility on the selected item (F07). Test: Tab to the selected item in light and dark and compare the focused and unfocused screenshots.

### AnchoredPopover

Source: `packages/ui/src/components/overlays/AnchoredPopover.tsx`

- (a) Contrast: Surface bg-surface-raised with border-border 1.58/1.58:1; content is the caller's.
- (b) Focus and keyboard: Web: Tab and Shift+Tab cycle inside the popover (:56-65), initial focus onShow focusFirst (:81). Escape through Modal onRequestClose. The scrim Close popover Pressable has focusable={false}. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Not a control; scrim covers the screen.
- (d) Screen reader: Modal with accessibilityViewIsModal; surface role=dialog, aria-modal, aria-label (:86). Scrim has accessibilityLabel "Close popover".
- (e) Motion: animationType="none" (:80), no fade.
- (f) Status: **PASS**. Dialog role, focus trap, Escape and instant open.

### CommandPalette

Source: `packages/ui/src/components/overlays/CommandPalette.tsx`

- (a) Contrast: Rows text-text 17.79/13.83:1. Active option is bg-primary/10 only (:142): 1.15/1.2:1, and the option is never focused (aria-activedescendant), so that tint is the focus indicator (F02). Search field is a TextField: boundary 1.42/1.75:1 (F03).
- (b) Focus and keyboard: Search has autoFocus (:110); arrows move aria-activedescendant (:116). Escape via Modal. Scrim Pressable focusable={false}. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: ROW_HEIGHT 56 (:40, no token). Passes both.
- (d) Screen reader: dialog aria-modal, combobox with aria-expanded, aria-controls, aria-activedescendant, aria-autocomplete=list; listbox with option rows carrying selected and disabled state; empty state role=status (:106-135).
- (e) Motion: animationType fade on native, none on web (:101). Not tied to reduce motion (F09).
- (f) Status: **FAIL**. Keyboard-active option is marked only by a 1.15/1.2:1 tint (2.4.7, 1.4.11); its TextField inherits F03.

### CommandPopover

Source: `packages/ui/src/components/overlays/CommandPopover.tsx`

- (a) Contrast: Items text-text 17.79/13.83:1, destructive text-danger 6.57/7.24:1. Focus style is `focus-visible:bg-primary/10` only (:109): 1.15/1.2:1 (F12).
- (b) Focus and keyboard: Arrow-key item navigation through onItemKey (:108); Modal Escape. Items are real focus targets, so a host outline may also draw (not checked). Desktop, QNX and marathon branch at :48 (no fade, keyboard menu). Windows and macOS follow the web or native branch of Platform.OS.
- (c) Touch target: Items minHeight 56 (:110, no token). Passes both.
- (d) Screen reader: role menu with label, items role menuitem with disabled state (:95-105). Scrim label "Dismiss menu".
- (e) Motion: animationType fade on non-desktop (:87), not tied to reduce motion (F09).
- (f) Status: **UNVERIFIED**. Only focus cue in source is a 1.15/1.2:1 tint (F12).
  - UNVERIFIED: Whether a host outline draws on the focused menu item (F12). Test: Open a menu in a browser, press ArrowDown, screenshot the focused item; repeat on Windows and QNX.

### SegmentedControl

Source: `packages/ui/src/components/SegmentedControl.tsx`

- (a) Contrast: Active segment bg-primary with text-on-primary 5.81/7.46:1; inactive text-text on sunken 16.01/15.31:1. Container border 1.42/1.75:1, decorative. Selected item is bg-primary and the ring is ring-focus, the same colour (1/1:1); the ring's outer edge still meets the page at 5.81/6.93:1 (F07).
- (b) Focus and keyboard: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:80). Web: roving tabIndex and arrow keys (:78, :53). Native: no key handler. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: minHeight and minWidth 44 inline (:74) and min-h-11 min-w-11. Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: radiogroup with aria-label or aria-labelledby; each segment role=radio with checked and disabled state (:63-72).
- (e) Motion: `motion-reduce:transition-none` with no transition (F09).
- (f) Status: **UNVERIFIED**. Focus ring and selected fill share one colour (1/1:1) (F07).
  - UNVERIFIED: Focus visibility on the active segment (F07). Test: Tab into the group, screenshot, compare with the unfocused state.

### Select

Source: `packages/ui/src/components/Select.tsx`

- (a) Contrast: Trigger on bg-surface-sunken with border-border: 1.42/1.75:1 (F03). Option states: selected bg-primary with text-on-primary 5.81/7.46:1; keyboard-active option bg-surface-sunken vs list bg-surface-raised 1.11/1.11:1; an option that is both active and selected shows only the selected fill, so the active cue is gone (:152) (F02). Error text-danger 6.57/7.24:1.
- (b) Focus and keyboard: Trigger `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:189). Web and QNX use aria-activedescendant with Enter, Space, Arrows, Escape, Tab, typeahead (:109-131); options are not focused. Native uses taps. QNX branch at :80.
- (c) Touch target: Trigger min-h-12 (:188, 48, no token) passes both; options min-h-11 (:150, 44). Android options: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: Web: combobox with aria-haspopup, aria-expanded, aria-controls, aria-activedescendant, aria-invalid, aria-describedby; listbox, option, group with heading (:135-186). Native: label plus shown value, hint, state expanded and disabled. Error is role alert with a polite live region (:202).
- (e) Motion: No animation.
- (f) Status: **FAIL**. Keyboard-active option has a 1.11/1.11:1 cue and none when selected (2.4.7); trigger boundary under 3:1 (1.4.11).

### AdaptiveDock

Source: `packages/ui/src/components/shell/AdaptiveDock.tsx`

- (a) Contrast: Panel titles text-text 17.79/13.83:1; inactive stack tabs text-text-muted 6.16/7.14:1; selected tab marked by text-text semibold only (:304) (F13). Drop hint border-2 border-focus 5.81/6.93:1.
- (b) Focus and keyboard: Tabs: roving tabIndex, onKeyDown (:277-301), `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:302). DragGrabHandle is not focusable (F14); each floating panel has a menu (menuFor) that is the keyboard route. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Header rows and Bring-to-front minHeight 44 (:237, :241, :289), tabs min-h-11 (:302). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: Regions labelled with the panel title; tablist and tab with selected and disabled state; Bring ... to front button; DragGrabHandle label and hint (:226-245, :294-299).
- (e) Motion: scrollTo animated:false (:274).
- (f) Status: **UNVERIFIED**. Selected-tab cue and keyboard move route need a run (F13, F14).
  - UNVERIFIED: Selected stack tab visible at 3:1 (F13). Test: Screenshot a selected and an unselected tab in light and dark and measure the difference.
  - UNVERIFIED: Keyboard-only move of a floating panel (F14). Test: Use only the keyboard to move, dock and tab a panel.

### AssetBrowser

Source: `packages/ui/src/components/shell/AssetBrowser.tsx`

- (a) Contrast: Rows text-text 17.79/13.83:1, secondary text-text-muted 6.16/7.14:1; row separator 1.58/1.58:1. Inherits Select and InspectorSearch field boundary 1.42/1.75:1 (F03).
- (b) Focus and keyboard: Rows: roving tabIndex, onKeyDown (:127), `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) . Selected rows show a check mark glyph, hidden from AT. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Row minHeight 64 (:131, no token). Passes both.
- (d) Screen reader: Each row role radio (single) or checkbox (multiple) with checked and disabled state, a composed label (name, kind, size) and actions activate and open (:124-129). The FlatList has a label but no group role (S2). Toolbar has a label.
- (e) Motion: None.
- (f) Status: **FAIL**. Renders Select and InspectorSearch, which fail field boundary (F03).

### ContextMenu

Source: `packages/ui/src/components/shell/ContextMenu.tsx`

- (a) Contrast: Delegates to CommandPopover (F12).
- (b) Focus and keyboard: Opens by long press, right-click or Shift+F10 (hint :85); on QNX and marathon it restores focus to the target when the menu closes (:60). Menu items: see CommandPopover.
- (c) Touch target: Target minWidth and minHeight 44 (:104, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: aria-haspopup=menu, hint "Has actions. Long press, right-click or press Shift F10.", accessibilityActions longpress "Show actions" (:84-86).
- (e) Motion: Via CommandPopover (F09).
- (f) Status: **UNVERIFIED**. Its menu is CommandPopover, whose focus cue is a tint (F12).
  - UNVERIFIED: Focus visibility inside the menu (F12). Test: See CommandPopover.

### ContextualToolbar

Source: `packages/ui/src/components/shell/ContextualToolbar.tsx`

- (a) Contrast: Pressed item bg-primary with text-on-primary 5.81/7.46:1; others text-text on raised 17.79/13.83:1; disabled reason text-text-muted 6.16/7.14:1. Selected item is bg-primary and the ring is ring-focus, the same colour (1/1:1); the ring's outer edge still meets the page at 5.81/6.93:1 (F07).
- (b) Focus and keyboard: Items `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:37). A hidden measuring row is focusable={false}, tabIndex -1 and aria-hidden (:34, :46). Overflow uses MenuButton. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Items minWidth and minHeight 44 inline (:37, size.touch); Toolbar density compact. Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: Items role button with label, hint from disabledReason, state disabled and selected plus web toggle props (:34-35). Overflow button label "More actions".
- (e) Motion: None.
- (f) Status: **UNVERIFIED**. Pressed fill and ring share one colour (F07); overflow menu is MenuButton (F12).
  - UNVERIFIED: Focus visibility on a pressed item (F07). Test: Tab to a pressed item and compare screenshots.

### DocumentTabBar

Source: `packages/ui/src/components/shell/DocumentTabBar.tsx`

- (a) Contrast: Selected tab text-text semibold on bg-surface-raised, others text-text-muted on the sunken bar 5.54/7.9:1. The selected cue is raised vs sunken 1.11/1.11:1 plus weight (F13). Dirty dot border-accent 4.65/9.81:1.
- (b) Focus and keyboard: Web: roving tabIndex and arrow keys (:73, :121); close buttons tabIndex -1 on web (:132). `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:122). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Tabs min-h-11 (:122, 44), close min-h-11 min-w-11 (:133). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: tablist and tab with selected and disabled state, aria-selected, accessibilityActions (:96-121); close button "Close {title}". On native the close button is hidden from AT and reachable through the tab's actions (:132).
- (e) Motion: None.
- (f) Status: **UNVERIFIED**. Selected-tab cue is weak (F13).
  - UNVERIFIED: Selected tab visible at 3:1 (F13). Test: Measure selected and unselected tab pixels in both schemes.

### FindReplaceContent

Source: `packages/ui/src/components/shell/FindReplaceContent.tsx`

- (a) Contrast: Inputs on bg-surface-sunken with border-border: 1.42/1.75:1 (F03); focus swaps to border-focus 5.22/7.67:1. Count text-text-muted 6.16/7.14:1; error via ErrorMessage.
- (b) Focus and keyboard: Native inputs; Buttons carry `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Inputs minHeight 44 (:59, :61, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: Inputs have accessibilityLabel ("Find text", "Replacement text"); result count is a polite live region; match text carries a composed label (:57-73).
- (e) Motion: None.
- (f) Status: **FAIL**. Input boundary 1.42/1.75:1 (1.4.11).

### FindReplacePopover

Source: `packages/ui/src/components/shell/FindReplacePopover.tsx`

- (a) Contrast: Wrapper around AnchoredPopover and FindReplaceContent.
- (b) Focus and keyboard: As AnchoredPopover (trap, Escape).
- (c) Touch target: See FindReplaceContent. Android 48dp: below (F08).
- (d) Screen reader: AnchoredPopover labelled "Find and replace".
- (e) Motion: None.
- (f) Status: **FAIL**. Renders FindReplaceContent (F03).

### FocusAndA11yLayer

Source: `packages/ui/src/components/shell/FocusAndA11yLayer.tsx`

- (a) Contrast: No visuals.
- (b) Focus and keyboard: Tracks input modality (keyboard or pointer) through capture listeners on web (:111-116).
- (c) Touch target: Not a control.
- (d) Screen reader: Announcements through AccessibilityInfo.announceForAccessibility on iOS and Android and a visually hidden live region on web (:123-137); useA11yPreferences exposes reduceMotion, screenReader, highContrast.
- (e) Motion: Reads reduceMotion from AccessibilityInfo, QNX and web matchMedia (:72-101) and publishes it. No tier 1 component consumes it (F09).
- (f) Status: **PASS**. Provides announce and preference hooks; web live region present.

### HistoryPanel

Source: `packages/ui/src/components/shell/HistoryPanel.tsx`

- (a) Contrast: text-text 17.79/13.83:1, text-text-muted 6.16/7.14:1; row separator 1.58/1.58:1.
- (b) Focus and keyboard: Rows `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:46). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Rows minHeight 56 (:47, no token). Passes both.
- (d) Screen reader: Header role header; count is a polite live region; rows are buttons with composed labels and aria-current=step on the current one (:33-47). FlatList has a label but no role (not changed here).
- (e) Motion: None.
- (f) Status: **PASS**. Labelled rows, live count, 56pt targets.

### InspectorPanel

Source: `packages/ui/src/components/shell/InspectorPanel.tsx`

- (a) Contrast: Heading text-text 17.79/13.83:1. Renders InspectorSearch (F03).
- (b) Focus and keyboard: Search and sections are native controls.
- (c) Touch target: Header minHeight 44 (:53, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: role=region labelled "Properties of {selection}", heading, live match count through InspectorSearch (:50-55).
- (e) Motion: None.
- (f) Status: **FAIL**. Renders InspectorSearch (F03).

### InspectorSearch

Source: `packages/ui/src/components/shell/InspectorSearch.tsx`

- (a) Contrast: Field bg-surface-sunken with border-border 1.42/1.75:1 (F03); focus border-focus 5.22/7.67:1; placeholder text-text-muted 5.54/7.9:1; clear glyph border-text-muted 5.54/7.9:1.
- (b) Focus and keyboard: Native input; clear button `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:53). `focus-visible:outline-none` on the input (:50) is replaced by border-focus. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Input minHeight 44 (:42, :51, size.touch), clear min-h-11 min-w-11 (:53). Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: role=searchbox, label, disabled state; clear button labelled; summary is a polite live region (:44-61).
- (e) Motion: None.
- (f) Status: **FAIL**. Input boundary 1.42/1.75:1 (1.4.11).

### InspectorSection

Source: `packages/ui/src/components/shell/InspectorSection.tsx`

- (a) Contrast: Title text-text 17.79/13.83:1; Reset text-text-muted 6.16/7.14:1; chevron border-text-muted 6.16/7.14:1; disabled opacity 0.55 exempt.
- (b) Focus and keyboard: Header and Reset: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:77, :84). The Switch is the platform control; its wrapper is accessible={false}, focusable={false} (:90). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Header row minHeight 44 (:72), toggle min-h-11 (:77), Reset min-h-11 min-w-11 (:84), switch wrapper 44 by 44 (:92, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: role=group labelled by title; toggle button with expanded state and aria-expanded; Switch labelled "Enable {title}" (:68-95).
- (e) Motion: None.
- (f) Status: **PASS**. Disclosure with expanded state, labelled switch, 44pt targets.

### KeyboardShortcutHUD

Source: `packages/ui/src/components/shell/KeyboardShortcutHUD.tsx`

- (a) Contrast: Text text-text 16.01/15.31:1; recording field border-2 border-focus 5.22/7.67:1; errors text-danger 5.91/8.01:1. Renders InspectorSearch (F03).
- (b) Focus and keyboard: Modal; Escape cancels recording or closes (:113-119, :177). Record field focusable with onKeyDown (:157-158). Buttons `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1). Apple versus non-Apple key labels at :49. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Buttons min-h-11 min-w-11 (:140), rows minHeight 44 (:146, :159). Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: Modal with aria-label and accessibilityViewIsModal; key combos spoken through bindingSpoken; recording prompt and conflicts are assertive live regions; groups have header role (:135-200).
- (e) Motion: animationType="none" (:177).
- (f) Status: **FAIL**. Renders InspectorSearch (F03).

### MenuButton

Source: `packages/ui/src/components/shell/MenuButton.tsx`

- (a) Contrast: Opens CommandPopover (F12). Disabled opacity 0.4 exempt.
- (b) Focus and keyboard: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:89). ArrowDown opens the menu (:84-86); on QNX and marathon focus returns to the button on close (:73). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: min-h-11 min-w-11 (:88, 44). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: role=button, label, aria-haspopup=menu, aria-expanded, state expanded and disabled (:80-82).
- (e) Motion: Via CommandPopover (F09).
- (f) Status: **UNVERIFIED**. Menu is CommandPopover (F12).
  - UNVERIFIED: Focus visibility inside the opened menu (F12). Test: See CommandPopover.

### PaneSplitter

Source: `packages/ui/src/components/shell/PaneSplitter.tsx`

- (a) Contrast: Idle divider is a 1px border-border line 1.42/1.75:1; hover or drag turns it border-accent 4.65/9.81:1, focus border-focus 5.22/7.67:1 at 3px (:191-199). The idle line is the only visible cue (F06).
- (b) Focus and keyboard: Web: role=separator, focusable, tabIndex 0, arrow keys (:206-213). Native: accessibilityRole=adjustable. State-driven focus line, so no class dependency. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Hit area 44pt across the divider (:222-223, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: role=separator or adjustable, label, hint, aria-valuemin/max/now/text, increment and decrement actions (:206-213).
- (e) Motion: None.
- (f) Status: **FAIL**. Idle divider 1.42/1.75:1 is the only visible cue (1.4.11, minor).

### PresetGallery

Source: `packages/ui/src/components/shell/PresetGallery.tsx`

- (a) Contrast: Selected tile border-2 border-focus with bg-primary/10 5.81/6.93:1; text-text 17.79/13.83:1; favourite glyph border-accent 5.17/8.86:1.
- (b) Focus and keyboard: Web: roving tabIndex and arrows (:83, :119); `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1). Focusing a tile previews the preset in the host (:118) (F18). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Tiles min-h-11, filter and favourite buttons min-h-11 min-w-11 (:97, :120, :133). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: radiogroup of role=radio tiles with checked state; filter buttons with aria-pressed; favourite toggles with composed labels (:95-131).
- (e) Motion: None.
- (f) Status: **UNVERIFIED**. Focus triggers a preview (3.2.1) (F18).
  - UNVERIFIED: Whether focus-triggered preview counts as a change of context (F18). Test: Tab through the gallery with a screen reader and confirm the preview does not move focus, navigate, or announce unprompted.

### PropertyRow

Source: `packages/ui/src/components/shell/PropertyRow.tsx`

- (a) Contrast: Label text-text 17.79/13.83:1; hint text-text-muted 6.16/7.14:1; override dot border-accent 5.17/8.86:1, hidden from AT.
- (b) Focus and keyboard: Revert button `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:92). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Row minHeight 44 (:78), Revert min-h-11 min-w-11 (:92). Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: role=group labelled by the editor label; Revert button "Revert {label}"; overridden state is conveyed by the dot (hidden) and by the revert button's presence.
- (e) Motion: None.
- (f) Status: **PASS**. Group, labelled revert, 44pt targets.

### RangeSlider

Source: `packages/ui/src/components/shell/RangeSlider.tsx`

- (a) Contrast: Thumb border-accent on raised 5.17/8.86:1; unfilled track border-border 1.42/1.75:1 (F15); text-text 17.79/13.83:1. Renders UnitInput (F03).
- (b) Focus and keyboard: Thumbs focusable with onKeyDown; state-driven ring-2 ring-focus on the thumb (:153-155, 5.81/6.93:1). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Thumb hit 44 by 44 (:154), track 44 high (:174-180, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: Each thumb accessible, role adjustable, label, aria-valuemin/max/now/text, increment and decrement actions (:143-146); group labelled.
- (e) Motion: None.
- (f) Status: **FAIL**. Renders UnitInput (F03).
  - UNVERIFIED: Unfilled track contrast (F15). Test: Measure the rendered track against the surface.

### RibbonTabs

Source: `packages/ui/src/components/shell/RibbonTabs.tsx`

- (a) Contrast: Selected tab text-text semibold with a 3px border-primary top bar 5.81/6.93:1; pressed commands bg-primary/10 plus border-focus 5.81/6.93:1; text-accent 5.17/8.86:1; inactive text-text-muted 6.16/7.14:1.
- (b) Focus and keyboard: Web: roving tabIndex and arrows (:58, :97); `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1). Commands inside use MenuButton and SplitButton. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Tabs min-h-11, commands min-h-11 min-w-11 (:78, :98, :112). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: tablist, tab with selected state, tabpanel with label, groups, toggles with aria-pressed, gallery as radiogroup with radio items (:75-143).
- (e) Motion: None.
- (f) Status: **UNVERIFIED**. Embeds MenuButton and SplitButton menus (F12).
  - UNVERIFIED: Focus visibility inside ribbon menus (F12). Test: See CommandPopover.

### RotaryKnob

Source: `packages/ui/src/components/shell/RotaryKnob.tsx`

- (a) Contrast: Dial border-2 border-border 1.42/1.75:1 idle, border-focus on focus, border-accent while previewing; needle border-accent 4.65/9.81:1. Renders UnitInput (F03).
- (b) Focus and keyboard: focusable, onKeyDown, state-driven border-focus (:158-161). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: dialSize = max(44, size) with default size 72 (:60, :140, size.touch); reset min-h-11 min-w-11. Android: 44 floor (F08). Android 48dp: below (F08).
- (d) Screen reader: Dial accessible, role adjustable, label, hint by input mode, aria-valuemin/max/now/text, actions increment and decrement (:149-153).
- (e) Motion: None.
- (f) Status: **FAIL**. Renders UnitInput (F03).

### SliderField

Source: `packages/ui/src/components/shell/SliderField.tsx`

- (a) Contrast: Fill and thumb border-accent 4.65/9.81:1; rail border-border 1.42/1.75:1 (F15); focus ring-2 ring-focus 5.22/7.67:1. Renders UnitInput (F03).
- (b) Focus and keyboard: focusable, onKeyDown; state-driven ring (:160). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Slider minHeight 44 (:161), row minHeight 44 (:130), reset min-h-11 min-w-11. Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: role adjustable, label, aria-valuemin/max/now/text, increment and decrement actions (:149-153).
- (e) Motion: None.
- (f) Status: **FAIL**. Renders UnitInput (F03).

### SplitButton

Source: `packages/ui/src/components/shell/SplitButton.tsx`

- (a) Contrast: Primary variant text-on-primary on bg-primary 5.81/7.46:1; other variant text-text on raised 17.79/13.83:1; group border 1.58/1.58:1. Selected item is bg-primary and the ring is ring-focus, the same colour (1/1:1); the ring's outer edge still meets the page at 5.81/6.93:1 (F07).
- (b) Focus and keyboard: Both halves `focus-visible:ring-2 ring-inset ring-focus` (:54, :62). Menu half is MenuButton. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: min-h-11 min-w-11 on both halves (:53, MenuButton :88). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: role=group labelled; primary button label; menu button label "More {label} options", aria-haspopup (:49-62).
- (e) Motion: None.
- (f) Status: **UNVERIFIED**. Menu is CommandPopover (F12); primary fill and ring share a colour (F07).
  - UNVERIFIED: Focus visibility inside the menu and on the primary variant (F07, F12). Test: Tab to each half in both variants and open the menu with the keyboard.

### StatusBar

Source: `packages/ui/src/components/shell/StatusBar.tsx`

- (a) Contrast: text-text 16.01/15.31:1, text-text-muted 5.54/7.9:1, errors text-danger 5.91/8.01:1; progress fill border-accent 4.65/9.81:1; recording dot border-danger 5.91/8.01:1.
- (b) Focus and keyboard: Zoom buttons `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:82). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Zoom buttons min-h-11 min-w-11 (:82), bar minHeight 44 (:91). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: Selection, activity and zoom changes are polite live regions; progressbar with aria-valuemin/max/now (:103-105). The root View has label "Status" but no role (S3). The file's comment says recording clock and percent are not re-announced per tick.
- (e) Motion: Indeterminate progress is a static 35% bar, no animation.
- (f) Status: **UNVERIFIED**. Zoom menu uses MenuButton (F12).
  - UNVERIFIED: Focus visibility inside the zoom menu (F12). Test: See CommandPopover.

### ToastAndProgress

Source: `packages/ui/src/components/shell/ToastAndProgress.tsx`

- (a) Contrast: text-text and text-text-muted 17.79/13.83:1 / 6.16/7.14:1; progress fill bg-primary 5.81/6.93:1. Default ActivityIndicator on a raised surface is 2.85/5.8:1 (iOS default colour) but the row text carries the same status.
- (b) Focus and keyboard: Buttons only. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Height guard throws under 44 (:30); actions are Buttons. Android: see Button. Android 48dp: below (F08).
- (d) Screen reader: Header role; toast rows role alert (errors) or status with a polite live region; job rows have progressbar with aria-valuemin/max/now/text and "Progress not reported" when unknown (:44-57).
- (e) Motion: Spinner is an essential progress cue; no decorative animation.
- (f) Status: **PASS**. Status text, live regions and valued progressbar.

### ToolRail

Source: `packages/ui/src/components/shell/ToolRail.tsx`

- (a) Contrast: Active tool bg-primary with text-on-primary 5.81/7.46:1; others text-text 17.79/13.83:1. Selected item is bg-primary and the ring is ring-focus, the same colour (1/1:1); the ring's outer edge still meets the page at 5.81/6.93:1 (F07).
- (b) Focus and keyboard: Web: roving tabIndex and arrows (:81-125); `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:127). Flyout is CommandPopover. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: min-h-11 min-w-11 (:126). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: role=toolbar with orientation; tools role=button with label, hint (shortcut and long-press), state selected, aria-pressed, aria-haspopup, actions activate and showVariants (:97-116).
- (e) Motion: None.
- (f) Status: **UNVERIFIED**. Active fill and ring share one colour (F07); flyout is CommandPopover (F12).
  - UNVERIFIED: Focus visibility on the active tool (F07). Test: Tab to the active tool and compare screenshots.

### UnitInput

Source: `packages/ui/src/components/shell/UnitInput.tsx`

- (a) Contrast: Field boundary 1.42/1.75:1 (F03); focus border-focus 5.22/7.67:1; error text-danger 5.91/8.01:1 and border-danger 6.57/7.24:1.
- (b) Focus and keyboard: Native input; onFocus enters editing (:108). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Input minHeight 44 (:127, size.touch). Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: accessibilityLabel, aria-invalid, aria-describedby for the error, error is an assertive live region, disabled state (:102-135).
- (e) Motion: None.
- (f) Status: **FAIL**. Input boundary 1.42/1.75:1 (1.4.11).

### WorkspaceHost

Source: `packages/ui/src/components/shell/WorkspaceHost.tsx`

- (a) Contrast: Selected mode tab bg-primary with text-on-primary 5.81/7.46:1; others text-text 17.79/13.83:1. Selected item is bg-primary and the ring is ring-focus, the same colour (1/1:1); the ring's outer edge still meets the page at 5.81/6.93:1 (F07).
- (b) Focus and keyboard: Web: roving tabIndex and arrows (:195, :214); `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:217). Mode switches by shortcut (aria-keyshortcuts). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Tabs min-h-11 min-w-11 (:216), bar minHeight 44 (:159). Android: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: tablist "Modes", tab with selected and disabled state, aria-keyshortcuts, hint; document title is a level 1 header on web; mode changes announced politely (web hidden live region, native announce) (:125-178, :206-215).
- (e) Motion: None.
- (f) Status: **UNVERIFIED**. Selected tab fill and ring share one colour (F07).
  - UNVERIFIED: Focus visibility on the selected mode tab (F07). Test: Tab to the selected tab and compare screenshots.

### WorkspacePresetSwitcher

Source: `packages/ui/src/components/shell/WorkspacePresetSwitcher.tsx`

- (a) Contrast: text-text 17.79/13.83:1. Dialog name field is a TextField: boundary 1.42/1.75:1 (F03).
- (b) Focus and keyboard: Dialog: autoFocus on the name field; Modal Escape; MenuButton trigger. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Trigger MenuButton 44; dialog buttons are Buttons. Android: 44 (F08). Android 48dp: below (F08).
- (d) Screen reader: Dialog role=dialog aria-modal with aria-label by kind; headers; deletion announced with an undo button (:104, :177-196).
- (e) Motion: Modal fade on non-web (:178), not tied to reduce motion (F09).
- (f) Status: **FAIL**. Renders TextField (F03).
  - UNVERIFIED: Initial focus in the delete dialog and focus return after close. Test: Open the delete dialog by keyboard, confirm focus lands inside, close it, confirm focus returns to the trigger.

### TabBar

Source: `packages/ui/src/components/TabBar.tsx`

- (a) Contrast: Active tab bg-primary with text-on-primary 5.81/7.46:1; inactive text-text-muted 6.16/7.14:1. Selected item is bg-primary and the ring is ring-focus, the same colour (1/1:1); the ring's outer edge still meets the page at 5.81/6.93:1 (F07).
- (b) Focus and keyboard: `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:92). Web: roving tabIndex and arrows in tabs mode (:57, :87). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: min-h-11 min-w-11 (:89), non-compact min-h-14 (56, :91). Android compact: 44 literal, 4dp under the 48dp Android guideline. Android 48dp: below (F08).
- (d) Screen reader: tabs: tablist and tab with aria-selected; navigation: role=navigation with link items and aria-current=page (:69-87).
- (e) Motion: `motion-reduce:transition-none` with no transition (F09).
- (f) Status: **UNVERIFIED**. Active fill and ring share one colour (F07).
  - UNVERIFIED: Focus visibility on the active tab (F07). Test: Tab to the active tab and compare screenshots.

### TextField

Source: `packages/ui/src/components/TextField.tsx`

- (a) Contrast: Field bg-surface-sunken with border-border 1.42/1.75:1 (F03); error border-danger and text-danger 5.91/8.01:1; label text-text 17.79/13.83:1; helper text-text-muted 6.16/7.14:1.
- (b) Focus and keyboard: Native input; no focus style on the field wrapper in this file (the platform caret or outline applies) (GU1). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Wrapper min-h-12 (:31, 48) passes both; input min-h-11 (:43).
- (d) Screen reader: Label Text with nativeID, input accessibilityLabel, accessibilityLabelledBy, hint = error else helper, disabled state; error role alert with a polite live region (:36-46).
- (e) Motion: None.
- (f) Status: **FAIL**. Field boundary 1.42/1.75:1 (1.4.11).

### NightScope

Source: `packages/ui/src/components/theme/NightScope.tsx`

- (a) Contrast: Wraps children in a ScopedTheme so tokens resolve at the dark values; the dark pairs in the contrast table apply.
- (b) Focus and keyboard: Not interactive.
- (c) Touch target: Not interactive.
- (d) Screen reader: Adds no elements on native; a display: contents wrapper on web.
- (e) Motion: None.
- (f) Status: **PASS**. Scope provider; dark pairs pass for text.

### Toolbar

Source: `packages/ui/src/components/Toolbar.tsx`

- (a) Contrast: Title text-text 17.79/13.83:1 on bg-surface-raised; border 1.58/1.58:1 decorative.
- (b) Focus and keyboard: Web: arrow keys move focus between actions (:21-29, :65). Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- (c) Touch target: Bar min-h-13 or min-h-14 (:54); actions are the caller's.
- (d) Screen reader: Title accessibilityRole=header with aria-level on web; actions role=toolbar labelled (:58-65).
- (e) Motion: None.
- (f) Status: **PASS**. Toolbar and heading semantics with arrow-key movement.

### WindowTitleBar

Source: `packages/ui/src/components/window/WindowTitleBar.tsx`

- (a) Contrast: Title text-text or text-text-muted when unfocused 16.01/15.31:1 / 5.54/7.9:1. Control glyphs use border-text-muted; on the Windows close control hover:bg-danger turns the glyph into 1.07/1.01:1 (F05).
- (b) Focus and keyboard: Controls `focus-visible:ring-2 ring-focus` (focus/surfaceRaised 5.81/6.93:1, focus/surfaceSunken 5.22/7.67:1) (:101). Windows and macOS layouts are chosen by the layout prop (:102-105). QNX: not branched.
- (c) Touch target: CONTROL_TARGET 44, CAPTION_TARGET_WIDTH 48 (windows), TITLE_BAR_HEIGHT 44 (:13-17, size.touch). The window chrome is desktop-only, so the Android guideline does not apply.
- (d) Screen reader: toolbar "{platform} window controls"; controls role=button with label and state disabled and selected; title role=header with edited suffix; blocked close is a polite live region (:96-129).
- (e) Motion: `motion-reduce:transition-none` with no transition (F09).
- (f) Status: **FAIL**. Close glyph on hover has 1.07/1.01:1 contrast (1.4.11).

## Safe metadata fixes (not applied)

Each adds a prop that changes nothing visible. They change what assistive technology announces, so GU2 applies after the fix. None is applied in this mission.

| Id | Item | Finding |
|---|---|---|
| S1 | PropertyInspector | F16 |
| S2 | CollapsibleDrawer | F16 |
| S3 | AssetBrowser | F16 |
| S4 | StatusBar | F16 |

**S1, PropertyInspector** (packages/ui/src/components/forge/inputs/PropertyInspector.tsx:32)

~~~diff
--- a/packages/ui/src/components/forge/inputs/PropertyInspector.tsx
+++ b/packages/ui/src/components/forge/inputs/PropertyInspector.tsx
@@ -32 +32 @@
- return <View {...rest} accessibilityLabel={label} style={[{gap:10,minWidth:0},style]}>
+ return <View {...rest} role="group" accessibilityLabel={label} style={[{gap:10,minWidth:0},style]}>
~~~

**S2, CollapsibleDrawer** (packages/ui/src/components/navigation/CollapsibleDrawer.tsx:158)

~~~diff
--- a/packages/ui/src/components/navigation/CollapsibleDrawer.tsx
+++ b/packages/ui/src/components/navigation/CollapsibleDrawer.tsx
@@ -158 +158 @@
-          accessibilityLabel="Navigation destinations"
+          role="navigation" accessibilityLabel="Navigation destinations"
~~~

**S3, AssetBrowser** (packages/ui/src/components/shell/AssetBrowser.tsx:118)

~~~diff
--- a/packages/ui/src/components/shell/AssetBrowser.tsx
+++ b/packages/ui/src/components/shell/AssetBrowser.tsx
@@ -118 +118 @@
-      accessibilityLabel="Assets" ListHeaderComponent={header} ListFooterComponent={footer}
+      role={multipleSelection ? "group" : "radiogroup"} accessibilityLabel="Assets" ListHeaderComponent={header} ListFooterComponent={footer}
~~~

**S4, StatusBar** (packages/ui/src/components/shell/StatusBar.tsx:89)

~~~diff
--- a/packages/ui/src/components/shell/StatusBar.tsx
+++ b/packages/ui/src/components/shell/StatusBar.tsx
@@ -89 +89 @@
-  return <View {...rest} accessibilityLabel="Status"
+  return <View {...rest} role="group" accessibilityLabel="Status"
~~~

Not listed as safe: DataTable table roles (F01) need rows to stop being Pressables, which changes behaviour. NavigationRail (F17) changes the role a screen reader announces and the element a browser renders.

## Fixes deferred to owner

These change pixels or behaviour, so they are outside this mission. Candidate colour values were computed with `node docs/agent-native/contrast.mjs --suggest border text surfaceRaised,surfaceSunken 3` (the smallest move from the current border toward the text colour that reaches 3:1 on both surfaces).

| Finding | Proposed fix | Items | Why deferred |
|---|---|---|---|
| F01 | Make the header group role=row, header cells role=columnheader, body rows role=row with the press target on a cell, cells role=cell, scroll wrapper role=table. | DataTable | Row stops being one button; press and keyboard behaviour change. |
| F02 | Give the active option `ring-2 ring-inset ring-focus` (List already does) on every option, selected or not. | CommandPalette, Select | Changes pixels. |
| F03 | Add a field-border token that reaches 3:1 on both surfaces. Candidate: light #888c93, dark #656b74 (current border #c9ced6 and #39404b). | PropertyInspector, CommandPalette, Select, AssetBrowser, FindReplaceContent, FindReplacePopover, InspectorPanel, InspectorSearch, KeyboardShortcutHUD, RangeSlider, RotaryKnob, SliderField, UnitInput, WorkspacePresetSwitcher, TextField | Changes pixels; the border token feeds every field, divider and card. |
| F04 | Add a 3:1 selected mark next to the tint: `border-focus` (5.2 to 5.8:1, as RibbonTabs and PresetGallery do) or a leading bar. | TreeGrid, IconButton, List | Changes pixels. |
| F05 | Colour the close glyph with the on-danger token while hovered (6.57/8.11:1). | WindowTitleBar | Changes pixels on hover. |
| F06 | Draw the idle divider at 3:1 or add a grip glyph. | PaneSplitter | Changes pixels. |
| F07 | Separate ring and fill: `ring-offset-2` or an inner `border-on-primary` on the selected item. | NavigationRail, SegmentedControl, ContextualToolbar, SplitButton, ToolRail, WorkspaceHost, TabBar | Changes pixels. |
| F08 | Raise the mobile minimum to a 48 token on Android (a platform-split size.touch) and replace the 44 literals. | Button, DataTable, TreeGrid, DragGrabHandle, Banner, EmptyState, PrecisionScrubber, PropertyInspector, office-controls, IconButton, List, CollapsibleDrawer, NavigationRail, SegmentedControl, Select, AdaptiveDock, ContextMenu, ContextualToolbar, DocumentTabBar, FindReplaceContent, FindReplacePopover, InspectorPanel, InspectorSearch, InspectorSection, KeyboardShortcutHUD, MenuButton, PaneSplitter, PresetGallery, PropertyRow, RangeSlider, RibbonTabs, RotaryKnob, SliderField, SplitButton, StatusBar, ToastAndProgress, ToolRail, UnitInput, WorkspaceHost, WorkspacePresetSwitcher, TabBar | Changes layout on every item listed. |
| F09 | Read `useA11yPreferences().reduceMotion` in the items that animate, or add a transition class so `motion-reduce:` has something to remove. | Button, IconButton, List, CommandPalette, CommandPopover, SegmentedControl, ContextMenu, FocusAndA11yLayer, MenuButton, WorkspacePresetSwitcher, TabBar, WindowTitleBar | Changes behaviour. |
| F10 | Add `focus-visible:ring-2 ring-focus` to the toggle and items; add an Escape handler to the overlay pane. | CollapsibleDrawer, ContextMenu | Changes pixels and keyboard behaviour. |
| F11 | Pass an explicit spinner colour (on-primary or on-danger token). | Button | Changes pixels. |
| F12 | Add `ring-2 ring-inset ring-focus` to the menu item focus class. | CommandPopover, ContextMenu, ContextualToolbar, MenuButton, RibbonTabs, SplitButton, StatusBar, ToolRail | Changes pixels. |
| F13 | Add a 3:1 selected mark (underline or top bar, as RibbonTabs). | AdaptiveDock, DocumentTabBar | Changes pixels. |
| F14 | Document or add a keyboard move command wherever DragGrabHandle is used; consider an accessibilityRole and an activate action. | DragGrabHandle, AdaptiveDock | Changes behaviour. |
| F15 | Draw the unfilled rail at 3:1 or rely on the thumb and say so in the docs. | PrecisionScrubber, RangeSlider, SliderField | Changes pixels. |
| F17 | Use link or button items in a navigation landmark instead of tablist and tab. | NavigationRail | Changes announced role and DOM. |
| F18 | Preview on hover or on activation, not on focus, or announce the preview. | PresetGallery | Changes behaviour. |

## UNVERIFIED items and the test that settles each

| Item | Open question | Test |
|---|---|---|
| Button | Loading spinner contrast on the primary and danger fills (F11). | Render loading Button on an iOS simulator, sample the spinner pixel against the fill, or set color explicitly and re-measure. |
| DragGrabHandle | Keyboard and screen-reader alternative to dragging (F14). | With AdaptiveDock, move a floating panel using only keyboard, then only VoiceOver or NVDA, and confirm every dock target is reachable. |
| PrecisionScrubber | Rail, tick and focus contrast with the real scaleColor and accentColor (F15). | Render the scrubber with the app theme, sample tick, rail and focus pixels against the surface, or run contrast.mjs with the consumer's tokens. |
| CollapsibleDrawer | Visible focus on toggle and items (F10). | Web: Tab to the toggle and each item, screenshot; native Windows and macOS: same with a keyboard. |
| CollapsibleDrawer | Hidden content stays unfocusable while overlay is open. | Web: open the overlay, press Tab, confirm focus stays inside the pane. |
| NavigationRail | Focus visibility on the selected item (F07). | Tab to the selected item in light and dark and compare the focused and unfocused screenshots. |
| CommandPopover | Whether a host outline draws on the focused menu item (F12). | Open a menu in a browser, press ArrowDown, screenshot the focused item; repeat on Windows and QNX. |
| SegmentedControl | Focus visibility on the active segment (F07). | Tab into the group, screenshot, compare with the unfocused state. |
| AdaptiveDock | Selected stack tab visible at 3:1 (F13). | Screenshot a selected and an unselected tab in light and dark and measure the difference. |
| AdaptiveDock | Keyboard-only move of a floating panel (F14). | Use only the keyboard to move, dock and tab a panel. |
| ContextMenu | Focus visibility inside the menu (F12). | See CommandPopover. |
| ContextualToolbar | Focus visibility on a pressed item (F07). | Tab to a pressed item and compare screenshots. |
| DocumentTabBar | Selected tab visible at 3:1 (F13). | Measure selected and unselected tab pixels in both schemes. |
| MenuButton | Focus visibility inside the opened menu (F12). | See CommandPopover. |
| PresetGallery | Whether focus-triggered preview counts as a change of context (F18). | Tab through the gallery with a screen reader and confirm the preview does not move focus, navigate, or announce unprompted. |
| RangeSlider | Unfilled track contrast (F15). | Measure the rendered track against the surface. |
| RibbonTabs | Focus visibility inside ribbon menus (F12). | See CommandPopover. |
| SplitButton | Focus visibility inside the menu and on the primary variant (F07, F12). | Tab to each half in both variants and open the menu with the keyboard. |
| StatusBar | Focus visibility inside the zoom menu (F12). | See CommandPopover. |
| ToolRail | Focus visibility on the active tool (F07). | Tab to the active tool and compare screenshots. |
| WorkspaceHost | Focus visibility on the selected mode tab (F07). | Tab to the selected tab and compare screenshots. |
| WorkspacePresetSwitcher | Initial focus in the delete dialog and focus return after close. | Open the delete dialog by keyboard, confirm focus lands inside, close it, confirm focus returns to the trigger. |
| TabBar | Focus visibility on the active tab (F07). | Tab to the active tab and compare screenshots. |

## Android 48dp

Items with a 44 literal under the 48dp guideline (F08): Button, DataTable, TreeGrid, DragGrabHandle, Banner, EmptyState, PrecisionScrubber, PropertyInspector, office-controls, IconButton, List, CollapsibleDrawer, NavigationRail, SegmentedControl, Select, AdaptiveDock, ContextMenu, ContextualToolbar, DocumentTabBar, FindReplaceContent, FindReplacePopover, InspectorPanel, InspectorSearch, InspectorSection, KeyboardShortcutHUD, MenuButton, PaneSplitter, PresetGallery, PropertyRow, RangeSlider, RibbonTabs, RotaryKnob, SliderField, SplitButton, StatusBar, ToastAndProgress, ToolRail, UnitInput, WorkspaceHost, WorkspacePresetSwitcher, TabBar.

Items already at or above 48: Select trigger (min-h-12), TextField wrapper (min-h-12), IconButton md (48), Button lg (48), CollapsibleDrawer toggle (h-12 w-12), CommandPopover items (56), CommandPalette rows (56), HistoryPanel rows (56), AssetBrowser rows (64), TabBar non-compact (min-h-14), Toolbar (min-h-13 or min-h-14).

## Relation to the doc template's `a11yStatus`

`doc-template.md` defines `a11yStatus` as verified, declared or unverified, and allows `verified` only with an `Evidence:` path. A source-only review is not evidence of the rendered behaviour, so PASS here does not map to `verified`. Suggested mapping for the generator: read `a11y-status.json`; FAIL and UNVERIFIED keep `declared` (or `unverified` when the source sets no a11y prop); PASS stays `declared` until a rendered pass exists, and then `verified` with this file as the `Evidence:` path. This changes no template rule.

## Reproduce

```
node docs/agent-native/contrast.mjs            # table
node docs/agent-native/contrast.mjs --json     # same, machine readable
node docs/agent-native/contrast.mjs --suggest border text surfaceRaised,surfaceSunken 3
```
