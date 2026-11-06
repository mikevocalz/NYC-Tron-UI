# Shared state and canonical shell API

The existing local-store value adapter now delegates to a per-instance vanilla Zustand store. Its `get`, immutable replacement/functional `set`, equality suppression and subscription cleanup contracts remain unchanged. The hooks retain each instance in a ref; native resources and gesture handles remain outside serialized application state.

`@nyc-tron/ui/components/shell/NumericScrubField` exports the existing PrecisionScrubber implementation under the canonical A-12 name. It retains the same bounded numeric entry, drag precision modes, cancellation, accessibility adjustment and async commit behavior. No second scrubber implementation or duplicate state owner was added.

`tooling/verify-component-program.mjs` checks the full 341-ID ledger, unique IDs, actual source candidates, evidence files and independent exports for every reviewed implementation. An entry cannot become accepted without evidence for each required platform. Source presence alone remains insufficient.
