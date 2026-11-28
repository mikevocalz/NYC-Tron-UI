# Proposed library inventory

[components.json](components.json) is generated from all sixteen package export
maps, the workspace API surface and the three reviewed declaration snapshots.
Each component entry represents one public import path and exported symbol.
`declarationIdentities` and `aliases` link shared implementations without hiding
public imports. Conditional declaration targets are variants of the same entry.
Every other public symbol has an explicit exclusion and reason.

The manifest currently proposes 163 component exports with 142 declaration
identities, all in the one `general components` category. Before
[D10](../V1_DECISIONS.md#d10-editor-controls-move-to-nitro-forge) it also
listed the editor controls under `components/forge/*` as `professional
controls`; those moved to `@nitro-forge/editor-controls`, and the generator
now fails if a `components/forge/*` export comes back. This includes two exported React 19 context providers, which the
older desktop inventory did not measure. File counts and export-subpath counts
include helpers and types and are not component counts.

## Owner confirmation required

No stability label is approved. `stability` remains `null`,
`ownerConfirmation` is `pending`, and `proposedStability` contains the complete
proposed list. These proposals are not evidence that a component passes T3.

The initial stable proposal consists of `Button`, `Card`, `NavigationRail`,
`NavigationShell` and `TextField` in `@nyc-tron/ui`. Their five root imports and
five direct imports account for ten public exports. The other 153 exports are
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

Source fingerprints hash UTF-8 text after normalizing CRLF line endings to LF,
so Git's Windows checkout convention does not change the inventory. Generated
JSON checks apply the same line-ending normalization; changed values still fail
the drift check. These are source-text fingerprints, not release-archive
checksums or Git blob identifiers. Archive checksums continue to cover exact
archive bytes.

## Forge lookup

[forge-imports.json](forge-imports.json) is a separate downstream row-to-import
lookup, including the baseline and five later window additions. It preserves
external owners without inventing Tron imports. Rows whose controls moved in
D10 carry `forgeImportPaths` (`@nitro-forge/editor-controls/...`) instead of
Tron `importPaths`; the tool reads them from
[editor-controls-migration.json](editor-controls-migration.json), the frozen
list of the 453 removed subpaths and their replacements, and fails if a moved
subpath is still a Tron export. It contains no acceptance
statuses and does not determine this manifest or release readiness.

`tooling/library-cross-reference.mjs --ledger <full-ledger.json> --write`
explicitly regenerates that lookup. The source-ledger digest records its input.
It hashes `JSON.stringify` of the parsed ledger, so LF/CRLF formatting does not
change it; it is not a raw-file or Git blob checksum.
Tron's tests validate the recorded import paths against local exports without
reading a downstream ledger. T4/F1 audit the transfer and pin its provenance.

The T2 evidence and limitations are in the
[dated report](../completion/reports/standalone-v1-2026-11-22-T2.md).

## Standalone release gate

`node tooling/release-readiness.mjs --version 1.0.0 --artifacts <candidate>`
regenerates the complete public export inventory before evaluating stable
readiness. The former Forge program and Qt correspondence do not determine
this result. `pnpm verify:qt` remains an optional historical case-study check.
The original frozen program files retain their exact bytes in the dated archive.

The current result is blocked. Labels await the owner's decision; proposals
are planning targets, never final stable labels. A prerelease may be packaged
for testing, but its report retains every stable blocker and cannot claim
stable acceptance or distribution approval.

`stability-review.json` defaults to `pending` with `approval: null`. After the
owner makes a decision, a reviewed `confirmed` record must identify reviewer
`mikevocalz`, an explicit decision reference, `proposalSha256` from
`stabilityProposalDigest(manifest)`, and a complete `labels` object mapping every
component ID to `stable` or `preview`. Extra/missing IDs, changed proposals,
contradictory aliases and an all-preview shortcut fail. Regenerate the manifest
and docs after recording that decision. The tool never records approval itself.
This label decision is separate from authenticated archive distribution approval.

`evidence.json` contains checksum-bound receipt descriptors `{path, sha256}`.
Paths are relative to the index; each receipt's artifact paths are relative to
its own directory. File traversal and symlink escapes fail. Production receipts
must identify a clean source commit, the exact manifest fingerprint, version
and actual installed archive names and byte SHA256s. A passed flag alone fails.
Each receipt binds its executable test source, successful command, exit code,
assertion counts, actual log and structured result files. Render/mount checks
also identify the tarball install command and exact direct/root imports and
asserted component states. Failed, skipped, empty, dirty or stale proof fails.

Every confirmed stable import needs `exports`, `declarations`, `unit`,
`accessibility`, `web`, `ios` and `android` receipts plus its generated docs page,
props source, accessibility notes and verified example. The initial five controls'
state contracts are in `REQUIRED_COMPONENT_STATES`; receipts must cover each
import separately. Accessibility receipts require zero violations against
`WCAG 2.1 AA`. Unrun native mounts remain NOT RUN. Preview documentation must
carry its visible preview label; preview runtime checks do not block publication.
Tier 2 retains the measured desktop support lists; Tier 3 and physical hardware
remain not verified.

The unchanged distribution gate still requires the exact authenticated owner
comment, release version and raw sixteen-archive `SHA256SUMS` byte binding.
Neither source line-ending normalization nor receipt collection changes that rule.

For release preparation that requires library completeness on a prerelease,
pass `--require-library`. Missing library evidence, pending owner labels or an
absent sixteen-archive inventory then blocks an rc publication too. The normal
candidate-packaging mode still reports blockers without claiming readiness.
Authenticated owner distribution approval remains required for stable release.

Generated docs may use an SPA entry shell. The gate verifies labels against the
checksum-bound `route-results.json` written after actual browser assertions,
plus exact built data and manifest fields; it does not search the shell HTML.
Each executed route identifies its component ID, route, import, symbol, visible
label and owner-confirmation state. Wrong badges, routes or rehashed data with a
changed stability value fail. The docs verification receipt must bind that
complete route result, all labels, complete example checks and unskipped browser
results.

A receipt cannot claim a different execution type by changing its label: each
kind is bound to the reviewed runner/test-source contract and the structured
result's `evidenceKinds`. Runtime results also name their executed platform;
Playwright web proof cannot satisfy a Maestro native mount, and an Android
result cannot satisfy iOS. Accessibility results retain actual zero-violation
axe cases. Screenshot files must decode as complete positive-dimension PNGs;
a signature-only placeholder or truncated capture fails.
