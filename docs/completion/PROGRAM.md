# Full component completion — NYC-Tron ownership

Primary library PR: [NYC-Tron #54](https://github.com/mikevocalz/NYC-Tron-UI/pull/54).
Engine integration remains tracked separately in [Nitro-Forge #63](https://github.com/mikevocalz/nitro-forge/pull/63).
Canonical plan, all 341 IDs, phase dependencies, baseline and acceptance ledger:
[Forge completion plan](https://github.com/mikevocalz/nitro-forge/blob/codex/complete-all-components/docs/completion/PLAN.md).

NYC-Tron is the priority library in the full completion program. Its reusable component implementation, exports, acceptance and distribution proceed independently of Forge player and engine integration. The scope includes every absent, partial and deferred component. Existing merged controls must be audited and reused rather than recreated. The 21-phase sequence covers native bootstrap/infrastructure, decoding, shell/GUI, canvas, ink, color, video, audio, photo/RAW, motion, documents, spreadsheets, slides, PDF, design/prototypes, CAD/3D, desktop/XR, complete acceptance and distribution.

NYC-Tron owns all reusable controls, their independent exports, accessible interaction, theme slots and platform UI/services. Forge owns authoritative document models, engine operations, native processing and typed bindings. Controlled callbacks are the public contract for reusable UI; a consuming app owns its documents and operations. Tests must demonstrate that interactions reach those callbacks and reconcile controlled state. A fixture does not prove a production engine operation or native hardware acceptance. Unavailable placeholders and successful builds alone do not establish full completion.

Each implementation phase must update the canonical ledger and its phase report, pass relevant checks, commit and push, report exact evidence to the user, then continue. Both umbrella branches stay draft until final acceptance. Do not replace released alpha.4 assets; subsequent releases must carry explicit versions and verified consumer pins.

Required coverage is iOS/iPadOS, Android with tablet/foldable behavior, web, macOS, Windows, visionOS, Meta Quest and PICO. Additional host applicability is resolved explicitly in the canonical plan. Native/device/accessibility claims require actual evidence. Missing hardware is recorded, not treated as a pass.

Preserve the existing single component owner, platform-native adapters, app-authored theme/navigation, Zustand/ref ownership, platform metadata, fold/RTL contracts and established app window dimensions/orientation. Use expo-horizon-core for Meta Horizon/Quest application configuration; scene geometry must remain separate from the app window contract. Review exact upstream files, dependency closure and licenses before copying source; retain all existing notices in packed artifacts.

Implementation checkpoints are committed and pushed separately; the canonical ledger retains every requirement and acceptance gate.

## Batch delivery cadence

User direction, 2026-11-06: implement related controls together and defer repeated integration checks until the batch is ready. Target 4–8 related controls per batch, adjusted for shared ownership and complexity. Do not rebuild, run the full suite, repack every package or repeat unchanged native scenarios after each individual component.

During implementation, use focused model/regression checks for the behavior being changed. At the batch boundary, build and typecheck once, run affected model and browser interaction suites, review the combined diff, update the evidence ledger, then commit and push. A shared gesture, ownership or native failure must be resolved before expanding the batch. A failed targeted check does not authorize marking a component reviewed.

At each phase boundary, run the full source and browser suites, package/export checks and applicable native family scenarios. Rebuild native binaries when native code, dependencies or configuration change; use the existing installed runtime for compatible JavaScript changes. Repeat broader checks when fixes affect previously checked behavior. Keep platform acceptance separate from implementation review and preserve every canonical requirement.

Apply the no-ai-slop writing skill and relevant native/domain skills. The external [Everything Claude Code verification-loop skill](https://github.com/WorldFlowAI/everything-claude-code/blob/432485ba6b92c14fb357276a98957f348bcff9ee/skills/verification-loop/SKILL.md) was inspected for build, type, test and diff review guidance. It is a reference, not an installed hook or replacement for this project's commands, Zustand requirement or evidence gates. Unrelated skills and repository-wide hook installations are unnecessary for component delivery.

| Phase | Reviewed reusable implementations | Evidence |
| --- | --- | --- |
| P03 | Decoder/media services checkpoint; remaining native acceptance tracked separately | [Media report](P03-media-services.md) |
| P04 | Numeric scrub/unit entry, assets, history, find/replace and real status/progress | [Native consumer contract](P19-native-library-contract.md), [Unit input review](P11-motion-settings.md) |
| P07 | All 27 color controls | [Specification](P07-color-specification.md), [existing controls review](P07-existing-color-review.md), [native P3](P07-native-p3.md) |
| P10 | All 18 photo controls | [Develop](P10-photo-develop.md), [catalog](P10-photo-catalog.md), [workflows](P10-photo-workflows.md), [masks/native proof](P10-photo-masks.md) |
| P11 | Scene settings, easing/render queue and value/speed/retiming graphs; remaining motion controls open | [Settings](P11-motion-settings.md), [queue/easing](P11-render-and-easing.md), [curves](P11-motion-curves.md), [timeline](P11-keyframe-timeline.md) |

This table records implementation checkpoints, not complete acceptance across the eight required platforms. Every other canonical component remains in library-progress.json for implementation or source review. Forge integration resumes after NYC-Tron completion.

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
