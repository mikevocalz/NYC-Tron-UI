# Composition hierarchy checkpoint

G-01 provides a public, controlled CompositionLayerTree for composition, shape, text, footage and adjustment layers. Fixed-height FlatList rows preserve stable document sibling order, expose expansion and selection, and reveal a selected descendant by expanding its ancestors. Visibility mutations use a cancellable asynchronous host contract scoped to document, composition and revision; rejected writes retain authoritative state and display the provider error. Lock and opacity reflect host metadata.

The model validates stable identities, parent kinds, opacity, ancestor cycles, repeated composition references and a depth budget of 64. Its 50,000-layer budget is explicit. The hierarchy does not load footage, evaluate compositions or render effects.

Validation: three model tests cover hierarchy/reveal order, malformed/cyclic input and 10,000 layers; three Chromium checks exercise nested reveal/selection/collapse, successful/rejected provider writes and document replacement. The standalone native consumer uses the same public export. Native runtime and the remaining platform/accessibility gates remain unverified for this control.
