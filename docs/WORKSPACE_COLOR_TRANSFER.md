# Workspace, color and transfer recovery

Phase 5 integrates the recovered workspace host/presets, color dialog and pure transfer/presenter rules after phases 2–4. It finishes the missing ContextualToolbar, platform FileImportExportSheet wrappers, PresenterInkOverlay and PresenterInkStrip. Fourteen public UI/model subpaths are added; they remain unpublished.

| Surface | Ownership and behavior |
| --- | --- |
| WorkspaceHost | One document canvas stays mounted while modes, docks and measured compact/wide arrangements change. Per-mode layouts and document metadata come from the host. Existing AdaptiveDock owns pane geometry. |
| WorkspacePresetSwitcher | Built-in/custom presets, save/rename/duplicate/delete confirmation, host-provided undo. No active preset is shown as Custom layout, which still permits saving. |
| ContextualToolbar | Host selection kinds filter actions; measured priority overflow uses the existing Toolbar and MenuButton. Disabled reasons remain visible. |
| FileImportExportSheet | Controlled filename/format/destination/settings/status. Web and native wrappers reuse their real FilePicker transports. Native requires its existing document source; unsupported import/destination actions explain why. No platform file writer is fabricated. |
| ColorPickerDialog | Original/draft comparison, HSV/channels/alpha, swatches, frame-coalesced preview, cancel/revert and one Apply. A vanilla Zustand store retains local presentation state; the document changes only through the host callback. |
| PresenterInkOverlay/Strip | Normalized session strokes, pen/highlighter, whole-stroke eraser, transient laser dot and keyboard exit/session undo. One commit per completed gesture; cancellation commits nothing. Off passes input through. App supplies ink color and size. |

UI remains engine-free and app-token styled. Forge owns WorkspaceSession, typed workspace/transfer UI bindings, per-engine byte formats and Prism document colors/fills. Host parsers validate opaque persisted dock layouts before rendering. Host adapters catch and display engine/storage/delivery errors, publish committed state and own native resources. No new navigation shell or window/orientation/manifest contract is introduced.

Browser acceptance separately verifies document mount continuity across mode/width changes; presets; contextual overflow; export validation and unavailable destinations; actual web file picking; dialog close/Apply; and presenter commit/cancel/erase. Pure tests exercise color draft rules, frame cancellation, normalized stroke geometry and laser/shortcut rules. These fixtures stand in for the host; Forge tests separately exercise real engines and transfer bytes.

The package verifier now parses module declarations instead of matching UI text containing import/export. A regression covers the false dependency found in the new picker label. Browser fixture resolution selects actual .web file siblings, matching web consumers; the rendered HSV gradient has an explicit assertion. Modal captures wait for the existing fade to settle.

No native compilation, OS file-dialog session, screen-reader session, physical foldable or hardware pen test was run. Presenter strokes are host-owned session overlays; Pitch stroke persistence, remote audience transport and Ink/Muse are absent. The laser is a timed dot, not a persistent annotation or a fading trail renderer. Native decoder/task/cache work remains phase 6.

New shell/transfer/presenter code is original. The color dialog composes existing admitted color controls; their per-file ProCraft provenance and package notices remain intact. Phase 5 does not import CapCraft/AGPL source. Release packing verifies existing license/notice contents.
