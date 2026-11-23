# Proposed library inventory

[components.json](components.json) is generated from all sixteen package export
maps, the workspace API surface and the three reviewed declaration snapshots.
Each component entry represents one public import path and exported symbol.
`declarationIdentities` and `aliases` link shared implementations without hiding
public imports. Conditional declaration targets are variants of the same entry.
Every other public symbol has an explicit exclusion and reason.

The manifest currently proposes 478 component exports with 456 declaration
identities. This includes two exported React 19 context providers, which the
older desktop inventory did not measure. File counts and export-subpath counts
include helpers and types and are not component counts.

## Owner confirmation required

No stability label is approved. `stability` remains `null`,
`ownerConfirmation` is `pending`, and `proposedStability` contains the complete
proposed list. These proposals are not evidence that a component passes T3.

The initial stable proposal consists of `Button`, `Card`, `NavigationRail`,
`NavigationShell` and `TextField` in `@nyc-tron/ui`. Their five root imports and
five direct imports account for ten public exports. The other 468 exports are
proposed as preview pending evidence and owner confirmation. The root controls
cover the initial install, form and adaptive-navigation tasks; this proposal
does not reduce the evidence required for any stable component.

Platform status is separate from stability. Tier 1 entries remain not verified
by the new T3 packet. The D5 desktop support lists retain their measured
archive, graph, date and original statuses; missing measurements remain not
verified. Tier 3 and physical hardware are not verified for 1.0.0. No platform
status or acceptance record is promoted by generation.

## Generation and drift checks

After the normal workspace install:

```sh
node tooling/library-components.mjs
node tooling/library-components.mjs --write
```

Use `--write` only when reviewing an inventory change. CI first builds and
checks the real public declarations, then checks this generated file against
exports and their recorded signatures. The classifier uses the pinned
TypeScript compiler API on a virtual declaration graph. Its small React
recognizer identifies explicit element/node returns, callable compounds and
React classes. It fails on unresolved component candidates and ambiguous
reference names. This classification does not replace real React types,
declaration checks, props documentation or installed-tarball runtime tests.

## Forge lookup

[forge-imports.json](forge-imports.json) is a separate downstream row-to-import
lookup, including the baseline and five later window additions. It preserves
external owners without inventing Tron imports. It contains no acceptance
statuses and does not determine this manifest or release readiness.

`tooling/library-cross-reference.mjs --ledger <full-ledger.json> --write`
explicitly regenerates that lookup. The source-ledger digest records its input.
Tron's tests validate the recorded import paths against local exports without
reading a downstream ledger. T4/F1 audit the transfer and pin its provenance.

The T2 evidence and limitations are in the
[dated report](../completion/reports/standalone-v1-2026-11-22-T2.md).
