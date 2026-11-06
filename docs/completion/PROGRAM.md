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
