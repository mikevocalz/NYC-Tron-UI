# Canvas and layers: local source completion

Phase 3 integrates the four recovered canvas workers onto alpha.3 plus the local timeline phase. Controls are public independent subpaths under `@nyc-tron/ui/components/forge/`; pure models are exported alongside them. None of these additions is in the published alpha.3 tarball.

| Directory | Controls | Domain boundary |
| --- | --- | --- |
| canvas | CanvasRuler, SnapGridOverlay, SnapGridSettings, SmartGuides, TransformOriginHandle, AlignDistributePanel | Host owns viewport/grid/guides; Prism owns alignment and content-space pivot |
| layers | LayerThumbnail, MaskThumbnailAndEditor, ClipToggle/ClipIndicator, ArtboardNavigator, CanvasCompareView | Real RGBA loaders and controlled layer/mask/artboard intents; existing LayerStack retains compact opacity behavior |
| selection | SelectionMarquee, MagicSelectionControls, MagicWandCanvas | One region or wand request per gesture; engine owns selection mask; smoothing remains unavailable |
| canvas-tools | ColorDropCanvasTarget, ReferenceImageBoard, GestureCustomizationPanel | Explicit host color resolution for fill; host-owned reference frames and gesture preferences |
| vector | PenNodeEditor, ShapeBuilder, FillStrokeInspector, GradientOnCanvasHandles | Atomic node/path/boolean/paint requests; neighbor-changing edits carry complete paths for one undo step |

State uses per-instance vanilla Zustand stores and selectors. Native resources and gesture handles stay in refs. UI has no Forge runtime dependency. Hosts must publish the authoritative state returned after successful engine writes and display failures through their error surface.

Native input keeps PanResponder. The web selection and vector surfaces use actual pointer capture because React Native Web excludes Alt/Ctrl presses from its responder system. Local/page coordinates, keyboard focus, Escape cancellation and multi-pointer cancellation retain the same editing contract. Tests exercise Alt subtraction and broken vector handles. Ruler guide culling uses the perpendicular viewport dimension; the keyboard add/delete regression covers a tall canvas.

Browser evidence covers light/dark phone/tablet and RTL captures plus keyboard, pointer, cancellation, locked/unavailable states, single-commit behavior, compact layout and overflow. This is React Native Web evidence, not native compilation, pen hardware, screen-reader or physical foldable acceptance. These controls do not supply a new GPU renderer, Ink brush engine, actual guide snapping during host transforms or native gesture recognition.

Ported files retain their existing ProCraft source paths, pinned revisions, copyright and modification notices. Source headers are the per-file provenance record; `licenses/ProCraft-LICENSE-MIT.txt`, `ProCraft-LICENSE-APACHE.txt` and `ProCraft-NOTICE.txt` remain included by the release packer. No upstream license or notice was removed. Unmarked models and vector controls are original implementations.

Forge's corresponding local `@nitro-forge/prism/canvas-cluster` adapter is tested against real Rust. Its optional `verify:canvas-source` command checks these built declarations without changing published dependency pins. See the sibling recovery worktree's `docs/recovery/PHASE3.md` for exact executed checks and scope.
