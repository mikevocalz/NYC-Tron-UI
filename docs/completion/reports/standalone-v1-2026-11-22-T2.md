# Standalone library v1: T2 proposed inventory

Dated 2026-11-22 (New York); checks completed 2026-11-23 UTC.
Base: T1 draft `4271e913d2c24fccd095d7bd5396580fe42ecf65`, PR #81.
Gate: T2, in-progress pending owner stability confirmation. Independent
review passed after a desktop-status mapping correction and regression check.
Implementer: `tron_manifest`; independent reviewer: `skill_discovery`.
The lead records the resulting commit
and draft PR. No merge, release or stability approval is performed here.

## Delivered inventory

[components.json](../../library/components.json) has one entry per public
package/import-path/exported-symbol component, derived from all sixteen export
maps and the workspace, Windows and AppKit declaration snapshots. It classifies
all 3,961 distinct public symbol exports: components have full entries; other
symbols have explicit exclusions and reasons. Nothing is keyed by a Forge row.

The result is 478 public component exports, linked to 456 declaration
identities. There are 139 general-component exports and 339 professional-control
exports. Aliases remain separate public entries. Conditional declarations are
variants of one entry rather than extra components. `FieldGroup` and
`AdaptiveColumns` are included through their callable intersection types.
`NumericScrubField`/`PrecisionScrubber`, `BeforeAfterCompare`/`CanvasCompareView`
and root/direct aliases retain shared declaration identities and alias links.

`@nyc-tron/ui` accounts for 424 exports: the 421 historical D5 entries,
`WindowTitleBar`, and two React 19 context providers. The recorded external
`React.Context<T>` declaration extends `Provider<T>`, so
`InspectorPanelContext` and `InspectorSectionContext` are renderable providers
and are included as preview proposals. Their D5 status remains not verified.
The lowercase `renderPopoverTrigger` helper is explicitly excluded.

| Package | Component exports |
| --- | ---: |
| `@nyc-tron/app-identity` | 0 |
| `@nyc-tron/core` | 0 |
| `@nyc-tron/expo-controls` | 10 |
| `@nyc-tron/geometry` | 0 |
| `@nyc-tron/hardware-keys` | 0 |
| `@nyc-tron/icons` | 8 |
| `@nyc-tron/macos-appkit` | 11 |
| `@nyc-tron/native-charts` | 2 |
| `@nyc-tron/native-controls` | 8 |
| `@nyc-tron/native-navigation` | 1 |
| `@nyc-tron/panes` | 3 |
| `@nyc-tron/platform-services` | 0 |
| `@nyc-tron/reserved-regions` | 2 |
| `@nyc-tron/ui` | 424 |
| `@nyc-tron/windows-fluent` | 0 |
| `@nyc-tron/windows-fluent-fabric` | 9 |

Non-component packages retain their public APIs and separate package gates.
The Node app-identity tools are not forced through mobile component mounts.

## Owner proposal: stop and report

Every component has a proposed label and reason, but `stability` is `null`
and `ownerConfirmation` is `pending` throughout. The complete list is the
manifest, not an approved release list.

Recommendation: target the existing root `Button`, `Card`, `NavigationRail`,
`NavigationShell` and `TextField` APIs for stable after their individual T3
packets pass. Root and direct imports yield ten stable-proposal exports for
five declaration identities. The remaining 468 exports are proposed as preview
pending individual evidence and owner confirmation. This is a bounded initial
proposal based on installation, forms and adaptive navigation tasks; it does
not claim those five already pass T3 or that an all-preview release is sufficient.

Keep the public professional paths for v1. No alias, removal, rename or public
type change is made. The requested library platform tiers remain the proposal;
Forge's own platform requirement and npm distribution remain owner decisions.
Do not consume this unconfirmed list as an approved T3 gate input.

## Evidence and lookup boundaries

The D5 desktop record is preserved, including archive, graph, date and original
row reasons/errors. Each lane has all 421 historical entries accounted for:
Windows 272 supported / 37 struck / 112 not verified; macOS 272 / 54 / 95.
The other 57 public exports in each lane remain not verified. Tier 1 entries
are not promoted by this inventory, and Tier 3/hardware remain not verified
for 1.0.0. No new native or browser behavior is inferred.

[forge-imports.json](../../library/forge-imports.json) is a separate lookup
covering the original 341 rows and five recorded W additions. It maps existing
source candidates to real public imports. External owners remain pinned and
have no invented Tron import. No acceptance field is copied, normalized or
changed. Its source-ledger digest identifies the input; it is not library scope.

The inventory generator never reads that lookup or the program ledger.
Cross-reference regeneration is an explicit separate tool. Static tests check
lookup imports against local export maps without depending on Forge's ledger
after the handoff. T4/F1 still own the transfer audit and final pinned home.

## Generation, CI and tests

The classifier uses the repository-pinned TypeScript API package on a virtual
graph reconstructed from reviewed declaration signatures and references.
Explicit React recognizers allow element/node returns, compound callable types,
context providers and React classes. A React-class marker prevents an unrelated
class with a `render` method from being mistaken for a component. Unknown or
any-valued component candidates and ambiguous referenced names fail closed.
This host classifies component identity only; it does not validate actual React
props, native peers or implementation behavior. Existing live declaration and
API-surface CI gates remain in place before the new inventory drift step.

The pinned compiler package version is `6.0.2`; its embedded compiler reports
`6.0.3`. The script validates the package version, matching the repository pin.
No repository dependency or lockfile changes were needed for the local check.

Actually run, using that compiler in an isolated tooling installation:

```text
$ node tooling/library-components.mjs [temporary compiler root supplied]
Library inventory: 16 packages; 478 public component exports; 456 declaration identities; 10 proposed stable / 468 proposed preview; owner confirmation pending.

$ node tooling/library-cross-reference.mjs
Forge import lookup: 341 baseline rows and 5 added rows; no acceptance or library scope changes.

$ node --test tooling/tests/library-components.test.mjs packages/ui/tests/contracts.test.mjs
tests 21
pass 21
fail 0

$ git diff --check
[no output; exit 0]
```

The compiler-root argument/environment value above is omitted to avoid
publishing machine-specific paths. Node was `v26.13.0`; CI's pinned Node
24.19.0 execution is NOT RUN locally. Complete stdout is attached in
[T2-tests.log](standalone-v1-2026-11-22-T2-tests.log).

Regression coverage includes current complete component/export coverage,
compound and alias handling, React contexts, plain renderer-class exclusion,
unknown returns, ambiguous names, added unrecorded exports, changed conditions,
every named D5 status/result and local lookup resolution. The existing engine
dependency-boundary assertion passes. No public source or API files changed.

## Skill outputs

Applied `user-research` then `design-system` from installed
`knowledge-work-plugins/design` 1.2.0. The project foldable-layout and
no-ai-slop skills were also read; their output is the preserved API, state,
styling, window/orientation and evidence contracts and this limited report.
No native code was added, so native implementation skills do not apply.

### 1. User research

These profiles are hypotheses from the brief and existing installer contracts.
Interviews, observed usability sessions and participant quotes: NOT RUN.

| Developer | First ten minutes: top tasks | Inventory consequence |
| --- | --- | --- |
| Expo app developer | Install, find Button, copy a runnable example, connect the app theme | Preserve direct/root imports and propose the existing small root API as the first stable evidence target |
| Design-system maintainer | Inspect props/states, map semantic tokens, check keyboard and text scaling | Preserve declaration identities and distinguish stability from measured platform support |
| Professional platform integrator | Find an isolated specialized import, inspect optional peers and cancellation behavior, check native evidence | Keep general/professional categories, all aliases and desktop provenance; mark missing proof explicitly |

### 2. Design-system audit

Read the token contract and carried forward the separately attributed baseline
audit. Public naming has existing aliases and consumer-named professional paths;
the manifest records them without renaming them. The current contract suite
passes documented-token and hardcoded-color checks. The token guide already
records a 1.58:1 reference border contrast limitation and optional tokens that
can leave recipes unstyled. Those are retained limitations, not fixes here.
Full spacing/typography/motion and visual consistency audits are NOT RUN.
Every exported component has a proposed stability reason in the manifest.

### Remaining surface skills

No docs-site template, kitchen-sink screen, README redesign or release notes
are built in T2. The T1 surface/copy work remains attributed to its report.
New `ux-copy`, `frontend-design`, per-screen Mobbin, rendered `design-critique`,
WCAG AA runtime `accessibility-review` and screen `design-handoff` deliverables
are NOT RUN here and remain required for T5. The inventory guide uses explicit
pending/not-verified wording and does not claim a screen audit.

Independent standalone `code-review` passed: see the
[review output](standalone-v1-2026-11-22-T2-review.md). The reviewer found that
D5's struck/not-verified records are objects, unlike its supported strings;
the generator was corrected and every named result now has a regression
check preserving its exact status and original reason. No critical or warning
findings remain. The review does not approve the proposed stability list.

## Still not proven

Owner confirmation of the complete stability list; per-stable-component live
T3 evidence; new CI on this change; full package build/typecheck locally;
rendered docs, props tables, kitchen sink, clean-runner docs install proof,
accessibility speech and physical hardware. The stable validator and old
ledger remain untouched for the separate T3/T4 changes. No acceptance or
distribution-approval status, Forge pin or release asset is changed.
