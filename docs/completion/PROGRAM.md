# Full component completion — NYC-Tron ownership

Current v1 implementation: [NYC-Tron #57](https://github.com/mikevocalz/NYC-Tron-UI/pull/57),
[Forge #70](https://github.com/mikevocalz/nitro-forge/pull/70), and
[Viro #86](https://github.com/mikevocalz/viro/pull/86). Earlier component delivery
is retained in NYC-Tron #54 and Forge #63.
Canonical plan, all 341 IDs, phase dependencies, baseline and acceptance ledger:
[Forge completion plan](https://github.com/mikevocalz/nitro-forge/blob/codex/complete-all-components/docs/completion/PLAN.md).

NYC-Tron is the priority library in the full completion program. Its reusable component implementation, exports, acceptance and distribution proceed independently of Forge player and engine integration. The scope includes every absent, partial and deferred component. Existing merged controls must be audited and reused rather than recreated. The 21-phase sequence covers native bootstrap/infrastructure, decoding, shell/GUI, canvas, ink, color, video, audio, photo/RAW, motion, documents, spreadsheets, slides, PDF, design/prototypes, CAD/3D, desktop/XR, complete acceptance and distribution.

NYC-Tron owns all reusable controls, their independent exports, accessible interaction, theme slots and platform UI/services. Forge owns authoritative document models, engine operations, native processing and typed bindings. Controlled callbacks are the public contract for reusable UI; a consuming app owns its documents and operations. Tests must demonstrate that interactions reach those callbacks and reconcile controlled state. A fixture does not prove a production engine operation or native hardware acceptance. Unavailable placeholders and successful builds alone do not establish full completion.

Each implementation phase must update the canonical ledger and its phase report, pass relevant checks, commit and push, report exact evidence to the user, then continue. Both umbrella branches stay draft until final acceptance. Do not replace released alpha.4 assets; subsequent releases must carry explicit versions and verified consumer pins.

Required coverage is iOS/iPadOS, Android with tablet/foldable behavior, web, macOS, Windows, visionOS, Meta Quest and PICO. Additional host applicability is resolved explicitly in the canonical plan. Native/device/accessibility claims require actual evidence. Missing hardware is recorded, not treated as a pass.

Preserve the existing single component owner, platform-native adapters, app-authored theme/navigation, Zustand/ref ownership, platform metadata, fold/RTL contracts and established app window dimensions/orientation. Use expo-horizon-core for Meta Horizon/Quest application configuration; scene geometry must remain separate from the app window contract. Review exact upstream files, dependency closure and licenses before copying source; retain all existing notices in packed artifacts.

Implementation checkpoints are committed and pushed separately; the canonical ledger retains every requirement and acceptance gate.

## Current approved completion scope — 2026-11-10

The user approved the v1 completion proposal and explicitly requested all twelve
remaining native/service rows. That approval supersedes the earlier
implementation-first pause for this work. Source, browser, installed-consumer,
native build/runtime and release-readiness checks are part of the approved
candidate work.

All **341 original IDs** now have reviewed source ownership: **332 local
implementations and nine pinned external implementations**, with no pending
source row. This retains the original phase assignments, requirements and eight
required platforms. The twelve rows are N-01, N-03, N-04, N-09, N-10, N-11,
N-13, N-14, N-15, N-16, N-18 and N-19. Their owners and public imports are in
[V1 platform closure](reports/V1-PLATFORM-CLOSURE.md).

The [candidate verification report](reports/V1-RELEASE-GATES.md) records exact
source revisions, actual runtime evidence, all fourteen archives and remaining
acceptance. Complete eight-platform acceptance and owner distribution review
remain required for stable publication. Neither implementation counts nor a
successful simulator flow promotes unobserved platform/device behavior.

## Earlier batch delivery cadence

User direction, 2026-11-06: implement related controls together and defer repeated integration checks until the batch is ready. Target 4–8 related controls per batch, adjusted for shared ownership and complexity. Do not rebuild, run the full suite, repack every package or repeat unchanged native scenarios after each individual component.

Earlier user direction, 2026-11-07 (superseded for the approved v1 completion work above): finish every reusable component implementation first, then let the user review before full testing. Related batches receive a combined TypeScript build and static diff/export/ledger checks, followed by commits and pushes. Source/browser/native acceptance suites, native binary rebuilds and production engine validation remain deferred to that review gate. Historical runtime evidence is preserved in its phase reports and does not certify the new components.

Apply the no-ai-slop writing skill and relevant native/domain skills. The external [Everything Claude Code verification-loop skill](https://github.com/WorldFlowAI/everything-claude-code/blob/432485ba6b92c14fb357276a98957f348bcff9ee/skills/verification-loop/SKILL.md) was inspected for build, type, test and diff review guidance. It is a reference, not an installed hook or replacement for this project's commands, Zustand requirement or evidence gates. Unrelated skills and repository-wide hook installations are unnecessary for component delivery.

Earlier implementation checkpoint, before the 2026-11-10 native/service completion work: **329 of 329 then-library-scope rows implemented**. All 341 canonical IDs remain tracked; the other 12 are separately scoped engine/platform integration requirements. Every acceptance field remains evidence-gated. At that checkpoint, the implementation pass awaited user review; full testing, platform acceptance, release and consumer pins remained open. The current status is recorded above.

| Phase | Library rows implemented | Latest evidence |
| --- | --- | --- |
| P02 platform | 8/8 | [Platform/media controls](P02-P03-final-platform-and-media-controls.md) |
| P03 media | 2/2 | [Platform/media controls](P02-P03-final-platform-and-media-controls.md) |
| P04 shell | 30/30 | [Shell controls](P04-overlays-and-transfer.md) |
| P05 canvas/layers/vector | 27/27 | [Vector/crop](P05-vector-and-crop-batch.md) |
| P06 ink | 8/8 | [Brush/ink](P06-brush-and-ink-batch.md) |
| P07 color | 27/27 | [Color review](P07-existing-color-review.md) |
| P08 video/timeline | 41/41 | [Production tools](P08-video-production-tools.md) |
| P09 audio/MIDI | 41/41 | [Mixer/analysis/MIDI](P09-mixer-analysis-and-midi.md) |
| P10 photo | 18/18 | [Photo masks](P10-photo-masks.md) |
| P11 motion | 15/15 | [Motion curves](P11-motion-curves.md) |
| P12 documents | 22/22 | [Text/references](P12-text-surfaces-and-references.md) |
| P13 spreadsheets | 21/21 | [Sheets/charts](P13-sheet-management-and-charts.md) |
| P14 slides | 16/16 | [Canvas/deck/ink](P14-canvas-deck-and-native-ink.md) |
| P15 PDF | 21/21 | [Signatures/forms/capture](P15-signatures-forms-and-capture.md) |
| P16 design | 15/15 | [Prototypes/handoff](P16-prototypes-collaboration-and-handoff.md) |
| P17 CAD/3D | 17/17 | [Graphs/drafting](P17-graphs-and-drafting.md) |

The following entries retain the delivery history and the limits of each checkpoint. Counts below describe their recorded commit, not the current total.

Composition hierarchy checkpoint: G-01 is implemented with independent exports, controlled visibility and nesting validation. See [P11 composition tree](P11-composition-tree.md). Native/platform acceptance remains open.

Motion path checkpoint: G-06 reuses the native vector editor with point/tangent snapping and document/revision cancellation. See [motion path](P11-motion-path.md).

Effect stack checkpoint: G-10 provides ordered effects and schema-driven inspection through owned host mutations. See [effect stack](P11-effect-stack.md).

Expression editor checkpoint: G-11 provides native text input with completion, reference and diagnostic host services. See [expression editor](P11-expression-editor.md).

P11 implementation checkpoint: all 15 G-series motion controls now have reviewed independent library exports. See [typed node graph](P11-node-graph.md). Native and eight-platform acceptance gates remain open; the full program is not complete.

P11 native checkpoint: typed graph and expression scenarios pass twice on iOS and Android; the keyboard dismissal fragment passes once per platform after its documented setup. Compact pane/focus fixes and exact warning limits are recorded in [native motion](P11-native-motion.md). Implementation review remains 66 of 341; full acceptance stays unverified.

P04 workspace checkpoint: A-01 through A-04 now have reviewed document/revision ownership, preset workflows, fold-aware docking and accessible resizing. [Workspace report](P04-workspace-shell.md) records 803 source and 548 browser checks plus two iOS replays. Review count is 70 of 341; P04 and all-platform acceptance remain open.

P04 command checkpoint: document tabs, tool rails, contextual overflow, ribbon groups/galleries and split buttons now have reviewed ownership and independent exports. [Command report](P04-command-controls.md) records the scope, disable and keyboard regressions. Review count is 75 of 341; remaining P04 rows and native acceptance stay open.

P04 inspector checkpoint: selection-aware nested inspector/search/property rows and precision slider/range/rotary controls now have reviewed exports and scope-safe input. [Inspector report](P04-inspector-precision.md) records exact-step and ownership regressions. Review count is 82 of 341; remaining P04 rows and eight-platform acceptance stay open.

P04 implementation phase complete: all 30 A-series shell components have reviewed independent library exports. [Overlay/status/transfer report](P04-overlays-and-transfer.md) records the final controls, 810 source tests, 568 browser tests and native acceptance limits. Review count is 90 of 341. This is library implementation completion for P04, not eight-platform acceptance or full-program completion.

P04 native overlay checkpoint: the same 28-step native menu/popover scenario passed twice on iOS and Android. [Native overlay evidence](P04-native-overlays.md) records actual platform surfaces, exact callback/close checks and warning limits. Full platform acceptance remains open; work continues with P05 canvas/layers.

P05 canvas navigation checkpoint: B-02 now has scoped native pan/pinch, wheel and keyboard/accessibility navigation with independent exports. [Navigation report](P05-canvas-navigation.md) records five model and nine browser tests. Review count is 91 of 341; P05 and native/platform acceptance remain open.

P05 ruler checkpoint: B-03 now guards guide/origin edits across document, geometry and permission changes and fixes guide hit-area dimensions. [Ruler report](P05-rulers.md) records source/model and browser checks. Review count is 92 of 341.

P05 GPU checkpoint: B-01 exposes a real Skia 3 Graphite surface with host-owned documents, scoped frame submission and resource cleanup. [GPU report](P05-gpu-viewport.md) records 820 source tests, 582 full browser checks, three final GPU cases and 13 validation packs. Review count is 93 of 341; native/runtime acceptance remains open.

P05 snapping/pivot checkpoint: B-04, B-05 and B-08 have reviewed bounded feedback, settings and scoped pivot interactions. [Review report](P05-snapping-and-pivot.md) records 823 source tests and targeted interaction checks, including the shared numeric scope/async guard fix. Review count is 96 of 341.

P05 native canvas checkpoint: the 39-step pinch/Metal canvas/error recovery scenario passes twice unchanged on iOS. [Native canvas report](P05-native-canvas.md) records the recognizer-start and accessible-error fixes, replay output and simulator limits. Review count remains 96 of 341; remaining P05 implementation and platform gates stay open.

P05 thumbnail checkpoint: B-10 now isolates document cache identities, bounds pending/stale resources and recovers from malformed provider output. [Resource report](P05-thumbnail-resources.md) records 835 source tests, 15 browser checks and the persistent Android API 26/manifest verification. Review count is 97 of 341; Android runtime and remaining P05 work stay open.

P05 Android canvas checkpoint: the final 39-step native scenario now passes twice per platform on iOS Metal and Android emulator Vulkan/SwiftShader. [Native evidence](P05-native-canvas.md) records the lifecycle fix and exact virtual-renderer limits. Review count remains 97 of 341.

P05 selection-bounds checkpoint: B-06 now provides scoped move/resize/rotation, hit testing and pane-safe targets with composed navigation ownership. [Selection report](P05-selection-bounds.md) records 841 source tests and 32 affected browser checks. Review count is 98 of 341.

P05 multi-selection checkpoint: B-07 adds ordered range/toggle/lasso selection, grouping and shared property transactions. [Review report](P05-multi-selection.md) records 847 source tests and ten browser checks. Review count is 99 of 341.

P05 layer-stack checkpoint: B-09 adds nested groups, inherited locks, controlled expansion/reparenting and scoped mutation handling. [Layer tree report](P05-layer-tree.md) records 852 source tests and the final browser checks. Review count is 100 of 341.

P05 blend/opacity checkpoint: B-11 adds precise alpha and explicit blend/compositing policy requests with scoped cancellation. [Blend report](P05-layer-blend.md) records 855 source tests and ten browser checks. Review count is 101 of 341.

P05 mask/clipping checkpoint: B-12 and B-13 add scoped mutation/thumbnail ownership, inherited locks and held-press cancellation. [Review report](P05-mask-and-clipping.md) records 858 source tests and 22 browser checks. Review count is 103 of 341.

P05 artboard checkpoint: B-14 adds scoped navigation/mutation/thumbnail ownership, bounded geometry and keyboard focus handling. [Artboard report](P05-artboard-navigation.md) also records the shared panel-root sizing fix, 864 source tests and browser rerun evidence. Review count is 104 of 341.

User direction, 2026-11-06 (implementation first): finish the remaining component batches before the user's review; broad acceptance testing follows that review. Keep batch build checks and fix compile errors while coding. Do not present this deferred testing as a pass or mark platform acceptance complete. This direction supersedes the earlier requirement to run full suites at each phase boundary.

P05 selection tools batch: B-19, B-20, B-30, B-31 and B-34 have reviewed controlled implementations with document/revision boundaries and cancellable host operations. [Batch report](P05-selection-tools-batch.md) records the build check and deferred runtime tests. Review count is 109 of 341; acceptance remains unverified.

P05 implementation phase complete: all 27 canvas, selection, vector, layer and palette controls have reviewed independent implementations. [Vector/crop report](P05-vector-and-crop-batch.md) records the last eight controls and the build-only checkpoint under the user's implementation-first direction. Review count is 117 of 341. Acceptance testing remains deferred; continue with P06 brush/ink/pen UI.

P06 library implementation phase complete: eight brush/ink/pen UI rows now have independent controlled exports. [Brush and ink report](P06-brush-and-ink-batch.md) records exact host-service boundaries, the real Graphite test pad and build check. Review count is 125 of 341. Native pointer, Muse and prediction engine work remains separately tracked, and broad tests follow the user's review. Continue with P08 timeline/video UI.

P08 navigation batch: D-04 and D-06 through D-13 have reviewed scoped transport, seeking, timecode, shuttle and range controls. [Navigation report](P08-transport-and-navigation.md) records the native slider ownership fix and build check. Review count is 134 of 341; P08 implementation continues and testing remains deferred.

P08 editing batch: 13 timeline/track/trim/marker/transition/batch controls have reviewed controlled implementations. [Editing report](P08-timeline-editing.md) records gesture cancellation without root remounts, app-supplied marker colors, real-preview slots and the build check. Review count is 147 of 341; 19 P08 media/effect components remain. Full tests stay deferred until the user's review.

P08 monitor/media batch: eight source/program, filmstrip/waveform, scopes, multicam, cache and PiP controls have reviewed independent implementations. [Media report](P08-monitors-and-media.md) records the real host-service boundaries, bounded caches and build check. Review count is 155 of 341; 11 P08 components remain before moving on. Broad acceptance tests stay deferred until the user's review.

P08 library implementation phase complete: all 41 timeline/video UI rows have reviewed independent implementations. [Production tools report](P08-video-production-tools.md) records the final 11 controls and build check. Review count is 166 of 341; production engine/native acceptance and full testing remain deferred until the user's review. Continue with P09 audio/MIDI/recording controls.

P09 input/automation batch: 12 transport, capture, device, waveform, automation, fader, pan and meter controls have reviewed controlled implementations. [Batch report](P09-input-and-automation.md) records native gesture ownership, host measurements and the combined TypeScript build. Review count is 178 of 341; full testing remains deferred until the user's review. Continue with the remaining audio/MIDI controls.

P09 clip/recording batch: eight waveform, region/envelope, comping, loop/punch, sample, AV-sync and calibration rows have reviewed implementations. [Workflow report](P09-clip-and-recording-workflows.md) records host processing boundaries and the combined TypeScript build. Review count is 186 of 341; full testing remains deferred. Continue with processing, library and MIDI controls.

P09 processing/speech batch: E-34 through E-41 have reviewed original UI implementations sharing processing, transcript, marker and envelope owners. [Batch report](P09-processing-and-speech.md) records service boundaries, license admission and the combined TypeScript build. Review count is 194 of 341; full tests remain deferred. Continue with the existing mixer, analysis and MIDI editors.

P09 library implementation phase complete: all 41 audio/MIDI/recording rows have reviewed implementations. [Mixer/analysis/MIDI report](P09-mixer-analysis-and-midi.md) records the final 13 controls, shared-owner integrations and combined TypeScript build. Review count is 207 of 341. Full acceptance testing remains deferred until the user's review. Continue with document and office component families.

P12 layout/formatting batch: seven typography, paragraph-style, ruler, table-insertion/layout, header/footer and page-setup rows have reviewed implementations. [Report](P12-layout-and-formatting.md) records source ownership, native gestures and the combined TypeScript build. Review count is 214 of 341. Full acceptance remains deferred; continue with text editing, document structure and review workflows.

P12 review/structure batch: eight ribbon, list, comments, tracked-change, outline, contents, read-aloud and dictation rows have reviewed implementations. [Report](P12-review-and-structure.md) records shared comment/speech ownership and the combined TypeScript build. Review count is 222 of 341. Seven P12 rows remain; acceptance tests remain deferred until user review.

P12 library UI implementation phase complete: all 22 document rows have reviewed implementations. [Text/references report](P12-text-surfaces-and-references.md) records native plain-text behavior, the explicit rich-text/pagination adapter boundary and combined TypeScript build. Review count is 229 of 341. Full engine/native acceptance remains deferred until the user's review. Continue with P13 spreadsheet components.

P13 grid/formula batch: seven virtual-grid, range, formula, name, autocomplete, reference-color and fill rows have reviewed implementations. [Report](P13-grid-and-formula-controls.md) records reuse of the existing grid, native range gestures and combined TypeScript build. Review count is 236 of 341. Acceptance remains deferred; continue with formatting, data and sheet-management tools.

P13 formatting/data batch: eight formatting/rule/validation/sort, pivot, table-style, import and saved-view rows have reviewed implementations. [Report](P13-formatting-and-data-tools.md) records native pivot gesture scope, host-data boundaries and combined TypeScript build. Review count is 244 of 341. Six P13 rows remain; acceptance testing remains deferred until user review.

P13 library implementation phase complete: all 21 spreadsheet rows have reviewed implementations. [Sheet/chart report](P13-sheet-management-and-charts.md) records the final six controls, bounded record virtualization and combined TypeScript build. Review count is 250 of 341. Acceptance tests remain deferred until user review. Continue with P14 slide/presentation components.

P14 authoring/presenter batch: seven master/theme/shape/transition/notes/presenter/rehearsal rows have reviewed implementations. [Report](P14-authoring-and-presenter.md) records native shape handles, host session timing and the combined TypeScript build. Review count is 257 of 341. Nine P14 rows remain; acceptance remains deferred until user review.

P14 diagram/media batch: four connector, morph, inserted-media and chart/table rows have reviewed implementations. [Report](P14-diagrams-morph-and-media.md) records host surfaces/frames, shared-owner reuse and combined TypeScript build. Review count is 261 of 341. Five P14 rows remain; acceptance testing stays deferred until user review.

P14 library implementation phase complete: all 16 slide/presentation rows have reviewed implementations. [Canvas/deck/ink report](P14-canvas-deck-and-native-ink.md) records the final five controls, native RNGH/Graphite ink, virtual deck lists and combined TypeScript build. Review count is 266 of 341. Full acceptance stays deferred until user review. Continue with P15 PDF components.

P15 viewer/text batch: five virtual-viewer/layout, native selection, bookmark and inline text rows have reviewed implementations. [Report](P15-viewer-selection-and-text.md) records native renderer/font/save contracts and the combined TypeScript build. Review count is 271 of 341. Sixteen P15 rows remain; acceptance stays deferred until user review.

P15 organization/output batch: eight thumbnail, page organization, extraction, hyperlink, redaction, encryption, comparison and print/export controls have reviewed implementations. [Report](P15-organization-and-output.md) records host operation boundaries and the combined TypeScript build. Review count is 279 of 341. Eight PDF rows remain; acceptance testing stays deferred until user review.

P15 library implementation phase complete: all 21 PDF rows have reviewed implementations. [Final PDF report](P15-signatures-forms-and-capture.md) records signatures, forms, native audio/camera boundaries, virtual search/comments and combined TypeScript build. Review count is 287 of 341. Acceptance stays deferred until user review. Continue with P16 design components.

P16 layout/style batch: seven hierarchy, layout, sizing, constraint, variant, reusable-style and variable rows have reviewed implementations. [Report](P16-layout-styles-and-variables.md) records shared owners, alias admission and the combined TypeScript build. Review count is 294 of 341. Eight P16 rows remain; acceptance stays deferred until user review.

P16 library implementation phase complete: all 15 design rows have reviewed implementations. [Final design report](P16-prototypes-collaboration-and-handoff.md) records native connection grips, runtime preview contracts, collaboration and export controls with combined TypeScript build. Review count is 302 of 341. Acceptance remains deferred; continue with P17 CAD/3D.

P17 viewport/texturing batch: nine viewport, orientation, transform, UV, channel, material, projected-brush, mask/generator and bake rows have reviewed implementations. [Report](P17-native-viewport-and-texturing.md) records native gestures, actual surface contracts and the combined TypeScript build. Review count is 311 of 341. Eight P17 rows remain; acceptance stays deferred until user review.

P17 library implementation phase complete: all 17 CAD/3D rows have reviewed implementations. [Final CAD report](P17-graphs-and-drafting.md) records shared graph/pan owners, drafting commands, snaps, annotations, paper space and constraints with combined TypeScript build. Review count is 319 of 341. Ten library rows remain; acceptance stays deferred until user review.

P02/P03 final implementation batch: the last ten library rows now have reviewed implementations, including actual AVPlayer and Android VideoView/MediaPlayer surfaces, exact-acknowledgement frame scrubbing, safe-area/fold composition and scoped recovery. [Report](P02-P03-final-platform-and-media-controls.md) records reused platform-service owners, new native sources, builds and remaining native compile/runtime gates. Review count is 329 of 341, covering all 329 library-scope rows. User review precedes broad testing; the 12 separately scoped integration requirements and full acceptance remain open.

Audio chrome follow-up (2026-11-07): eight existing audio controls now propagate app-owned targets and localized labels through compound tempo/mixer controls. Build, public-slot typecheck and independent source review passed; runtime/native acceptance remains deferred to review. See [audio targets and labels](P09-audio-targets-localization.md). The library-scope count remains 329/329; no platform acceptance field is promoted by this source change.

MIDI grid/scroll follow-up (2026-11-07): the existing piano roll now exposes rational time signatures and controlled horizontal scrolling with a versioned capability marker. PPQ and snap units remain unchanged. Build, public-slot/package typecheck and independent source review passed; runtime/native acceptance and consumer release/pin updates remain behind review. See [MIDI grid and scrolling](P09-midi-grid-scroll.md). Library scope remains 329/329.

Focused P02/P03 native validation (2026-11-07): the user's latest selection authorizes focused decoder/player builds and runtime checks. `749d8aa` adds exact indexed-frame decoding; `b192a23` records actual Expo iOS bridge and AVPlayerLayer lifecycle checks, with two unchanged recorded passes for each flow. The bridge validates three fixture indexes, 36 JPEGs and cache cleanup. The player validates playback, pause, seek acknowledgement, replacement, unmount, native error and recovery. See [iOS bridge](reports/P03-ios-bridge-validation.md) and [native player](reports/P03-ios-native-player-validation.md) for source hashes, reproducible harnesses and limits.

Android checkpoint `6d07b08` compiles the affected native player with explicit seek-range and owner boundaries. Kotlin compilation, eight source checks and scoped TypeScript pass. APK assembly/emulator runtime remain pending disk capacity; see [Android report](reports/P03-android-native-validation.md). This focused evidence does not close full component/platform acceptance, performance or accessibility gates, change the 329/329 source count, or publish/update consumer pins.

Android ownership follow-up (2026-11-07): `101016b` replaces the earlier VideoView candidate with an explicitly owned MediaPlayer and aspect-fit SurfaceView. Source/surface/disposal callbacks use generation and player identity guards, and the reusable component makes no audio-focus request. Actual Kotlin compilation, nine architectural source checks and scoped TypeScript pass. These source checks do not prove native playback or lifecycle behavior. APK/emulator/runtime validation remains pending; the user explicitly requested continued code work while additional disk space is unavailable. See the latest [Android report](reports/P03-android-native-validation.md). Library review and platform acceptance counts remain unchanged.

Sizing bounds follow-up (2026-11-07): the canonical HugFillFixedSizeControls now accepts host-owned per-axis min/max/step with its original defaults. Strict commit validation preserves actual dimensions and capability/disabled metadata; a versioned marker advertises support. Three focused tests, UI/public-slot typechecks and independent source review pass. See [sizing bounds](P16-sizing-bounds.md). Native interaction/accessibility and consumer/release acceptance remain open; source count stays 329/329.

Controlled interaction corrections (2026-11-07): graph nodes, gradient handles, waveform lanes and audio faders/EQ now retain mounted identities through geometry/admission changes while explicit boundaries cancel ephemeral edits. Rejected graph moves release their preview; stale callback/gesture results cannot replace newer source state. Waveform accessibility fallback updates synchronously in Zustand. The shared numeric scrubber retains its input and epochs pending requests. Focused model/source regressions and UI/public-slot typechecks pass; actual native focus/accessibility acceptance remains open. See [graphs](reports/GRAPH-INTERACTION-SOURCE.md), [gradients](reports/P10-gradient-focus-ownership-source.md), [waveform](reports/P03-waveform-gesture-ownership-source.md), [audio](reports/AUDIO-FOCUS-PREVIEW-SOURCE.md) and [numeric ownership](reports/precision-scrubber-retained-owner-source.md).

List preview source extension (2026-11-07): H-07 accepts optional host-authoritative marker text, advertises a versioned capability and preserves its legacy default marker helper. Forge derives actual stored starts/continuation/mixed-context markers only for capable source controls; old installed pins retain their preview guard. Sixteen office-model checks and UI/public-slot typechecks pass. See [list markers](reports/H07-authoritative-markers-source.md). These corrections change no phase/platform acceptance, app window contract, native runtime pin or published artifact.

Further coordinate/drop corrections (2026-11-07): paragraph-ruler and cell-selection handles retain semantic keys, accept measured geometry while editing is unavailable and cancel old coordinate sessions. PDF thumbnails retain row identity, while pivot drag measurements require per-drag tokens so canceled or superseded callbacks cannot assign fields. Loop/in-out handles compose the existing scrub hook with captured coordinate/preview ownership; disabling a direct opted-in hook caller cancels even with unchanged external source identity. See [ruler/selection](reports/ruler-selection-retained-handles-source.md), [PDF/pivot](reports/PDF-PIVOT-DRAG-OWNERSHIP-SOURCE.md) and [timeline ranges](reports/P03-timeline-range-handle-ownership-source.md). Focused checks and UI/public-slot typechecks pass; native focus/drag acceptance remains open.

CI render reconciliation (2026-11-07): mocks now provide context and actual native gesture event fields. The render checks also found a live-feedback rollback on successful fader commits; [audio correction](reports/AUDIO-CI-RELEASE-CORRECTION.md) now detaches successful previews and restores rejected writes once. All 114 mocked-render checks pass locally, with UI/public-slot typechecks passed. The [pinned pan validator check](reports/PAN-CONFIG-COMPATIBILITY-SOURCE.md) fixes two incompatible threshold configurations. These are source/mock checks, not native screen-reader or gesture acceptance. Remote CI remains separate; no phase/platform or release field is promoted.
