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
