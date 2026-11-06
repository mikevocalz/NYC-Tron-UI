# P10 catalog, comparison and metadata checkpoint

F-01 PhotoLibraryGrid virtualizes host catalog pages (up to 100,000 records), renders supplied thumbnail URIs, keeps selection outside the current page, and exposes open/load-more intents. Missing thumbnails remain explicit. Column count follows measured pane width; app windows and scene geometry are not changed. The acceptance consumer keeps its FlatList outside vertical ScrollViews.

F-02 CatalogFilterBar controls metadata search, camera/lens/album identities, minimum stars, flag, inclusive capture dates, ISO, aperture and exposure-time ranges. Disabled and absent filters are distinct. Calendar dates are validated without timezone normalization; invalid and reversed dates stay as an editable error and never reach the host filter callback. The host owns EXIF indexing and query execution.

F-12 BeforeAfterCompare exports the existing CanvasCompareView owner under the canonical photo name, retaining side-by-side, wipe/split, overlay and reference modes, actual host pixels/URIs, keyboard controls and narrow-pane layout. No parallel comparison implementation was introduced.

F-18 PhotoMetadataInspector shows source file/dimensions, camera, lens, raw capture-time label, exposure, ISO, focal length and provider provenance, with unknown metadata explicit. Its annotation draft uses a per-instance Zustand store, commits once, and clears at a photo revision boundary. Original metadata remains read-only. Provider provenance is not presented as a verified signature.

Three catalog/metadata model checks and five browser paths cover invalid dates/ranges, identity, selection, actual comparison images, keyboard wipe, and annotation-only commits. The rendered 10,000-record fixture mounts fewer than 500 photo checkboxes; its thumbnails are explicitly unavailable, so this does not benchmark a production thumbnail provider. Shared standalone consumers import the compiled public exports. UI/native consumer types, workspace checks and packed artifacts are required before commit. Native runtime/device, narration, production catalog indexing and physical platform acceptance remain open.
