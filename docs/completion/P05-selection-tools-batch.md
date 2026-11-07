# P05 selection and canvas tools batch

Reviewed components: B-19 SelectionMarquee, B-20 MagicSelectionControls (including MagicWandCanvas), B-30 ColorDropCanvasTarget, B-31 ReferenceImageBoard and B-34 GestureCustomizationPanel.

Marquee selection supports rectangles, ellipses, polygons, freehand lasso and keyboard/accessibility commands. It now cancels stale document, revision, mapping, mode and permission gestures; bounds lasso/polygon storage; rejects non-finite geometry; clips outlines to app-supplied usable regions; and rejects drags crossing the starting pane. Hosts may place the toolbar through the existing layout owner. Release coordinates are included in the final request. The shared web pointer transport cancels on an additional pointer and refuses a nonprimary contact after cancellation.

Magic selection retains tolerance, contiguous/layer sampling, grow/shrink, feather and optional smoothing/refinement host requests. Selection edges validate radii; scoped requests publish asynchronous progress/errors and receive an optional AbortSignal. Wand targeting retains modifier, keyboard and accessible actions. These are controlled UI operations, not pixel processing implementations.

Color drop retains one fill transaction per completed drop with live feedback and keyboard aiming. Measurement results are bounded, validated and invalidated after unmount; drops use the release position. Changing document identity, fill settings, geometry or permission abandons old interactions. Host fill operations receive an optional cancellation signal and errors are displayed.

Reference images retain floating/side/overlay placement, fit/crop, pin/lock, move/resize, opacity and keyboard actions. Lists and geometry are bounded. Document/revision/permission and lock/placement boundaries invalidate old callbacks; pending mutations cannot submit another transaction. Image decoding and resource ownership remain with the host's renderImage slot. The consuming layout supplies the board's usable pane dimensions.

Gesture customization retains editable mappings, visible conflicts, explicit duplicate resolution, held-gesture delay, reset, cancel and atomic save. Catalogs/maps are bounded and validated. Document/revision/catalog/permission changes abandon the old draft owner; pending/rejected saves are represented without a false saved acknowledgement. Existing pinned ProCraft headers and license files are retained.

The shared internal useScopedControl hook owns request admission/cancellation and guards callbacks at committed document boundaries. Imperative handles and abort controllers remain in refs/closures; local presentation/drafts use Zustand. Existing native responder adapters are retained; this batch does not claim an RNGH migration or platform runtime acceptance.

Validation: @nyc-tron/ui TypeScript build passed for the combined batch. Broad source/browser/device acceptance is deferred until the user's implementation review under their 2026-11-06 instruction. No new device, engine, hardware or eight-platform acceptance claim is made. Required follow-up includes interrupted gestures, held presses across revisions, asynchronous rejection/recovery, native gesture composition, focus, RTL, large text and usable-pane interaction checks. Implementation review is 109/341; acceptance stays unverified.
