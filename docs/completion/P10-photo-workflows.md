# P10 preset, version and export checkpoint

F-13 PresetFilmstrip provides a bounded virtualized horizontal set of real host thumbnails, hover/focus/tap preview, explicit preview cancellation, favorites and one cancellable application to an exact photo-ID set. Keyboard navigation reuses the shared choice geometry conventions. Preview cleanup follows the scope owner rather than callback identity.

F-17 PresetManager validates a bounded version-1 preset envelope before a host import, retains full develop settings, rejects duplicate identities, and exports only normalized schema data. Rename, delete and transfer receive AbortSignals and show pending/error/cancel state. A reader that completes after cancellation cannot reach the import callback.

F-15 PhotoVersionHistoryBrowser keeps snapshots read-only, offers comparison and explicit selected/original restore, and has no delete-original operation. Its host supplies original identity and performs the actual atomic restore. F-14 BatchExportPanel controls host-supported encoder format, sizing, quality, text watermark and an explicit metadata/location policy. It only displays real provider progress; a pending request without progress remains unknown. Empty watermark text prevents export when enabled.

The standalone fixture captures typed requests without pretending to encode files, render presets or process RAW. Three model tests and six browser paths cover versioned transfer, duplicate/malformed imports, late cancelled reads, batch target identity, original restore, watermark settings and privacy intent. UI/native consumer types and full workspace/artifact checks are required before commit. Production processing, native runtime, narration and other platform acceptance remain open.
