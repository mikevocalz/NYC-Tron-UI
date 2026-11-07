# P05 scoped node-editor capability

The PenNodeEditor module now exports `PEN_NODE_EDITOR_CAPABILITIES` version 1. It advertises the existing scoped callbacks, geometry/source cancellation and stable editor identity when geometry changes. The current implementation keeps its body keyed to scope identity and cancels preview/gesture state in layout effects; it does not key the focused body to width, height or revision.

Hosts that need those guarantees must detect the module marker before exposing an editable overlay. Released alpha.4 artifacts omit it and must retain their normal canvas rather than mounting an unsafe old editor or remounting it on every resize. A host supplies stable document/layer scope and authoritative revision. This additive source marker does not change package versions or published artifacts.

TypeScript checking and UI build pass. Runtime focus/native gesture acceptance and the complete platform matrix remain separate evidence gates. See Forge's node-overlay geometry tests and independent source review for the consumer mapping, not a claim of released availability.
