# Independent review: standalone library v1 T2

Reviewer: `skill_discovery`; implementer: `tron_manifest`.
Base: `4271e913d2c24fccd095d7bd5396580fe42ecf65` (T1 draft PR #81).
Review date: 2026-11-23 UTC.

Verdict: passed for the T2 proposed-inventory implementation after the finding
below was fixed. T2 remains in-progress pending the owner's stability-list
confirmation; this is not an approved release manifest.
No merge, release or owner confirmation is authorized by this review.

## Review scope and method

Used `knowledge-work-plugins/engineering` 1.2.0 `code-review` in its standalone
mode. Reviewed correctness, security, performance, maintainability, API
preservation and evidence claims. Applied the project no-ai-slop and foldable
layout rules to reporting and preservation of existing runtime contracts.

Reviewed semantic inventory generation, the downstream import lookup, tests,
CI integration and generated manifests. The classifier's React recognizer is
explicitly limited to classification; the existing real declaration/type gates
remain required. It does not prove props, mountability or accessibility.

## Finding and fix

| Severity | Finding | Disposition |
| --- | --- | --- |
| Warning | D5 supported rows are strings but struck/notVerified rows are objects. Initial `includes` lookup dropped all non-supported measurements, erasing provenance and turning measured struck rows into unmeasured status. | Fixed by implementer: match string or object.component, retain the complete original object, regenerate manifest, and regress every named row in both desktop lanes. Independently verified below. |

No outstanding critical or warning findings. Final inventory guide, T2 report
and complete 21-test stdout were inspected after source freeze and agree with
the generated data and independently run checks.

## Independent results

The pinned compiler API package `@typescript/typescript6` 6.0.2 was used from
an isolated dependency installation. No repository dependency, package API,
source component, acceptance record or distribution approval was changed.
Machine-specific dependency-root arguments are omitted below; they only select
that exact installed compiler API package.

```text
$ node --test tooling/tests/library-components.test.mjs packages/ui/tests/contracts.test.mjs
[5 new inventory checks and 16 existing contract checks passed]
tests 21
pass 21
fail 0
cancelled 0
skipped 0
todo 0

$ node tooling/library-components.mjs
Library inventory: 16 packages; 478 public component exports; 456 declaration identities; 10 proposed stable / 468 proposed preview; owner confirmation pending.

$ node tooling/library-cross-reference.mjs
Forge import lookup: 341 baseline rows and 5 added rows; no acceptance or library scope changes.

$ git diff --check
[no output; exit 0]
```

Additional independent assertions:

- All 3,961 public package/import-path/symbol exports are accounted for: 478 component exposures and 3,483 excluded exposures, with no overlap.
- Five proposed stable declaration identities retain ten root/direct import exposures. All stability values are null with owner confirmation pending; the other 468 exposures are proposed preview.
- Compound FieldGroup and AdaptiveColumns, existing aliases, React classes and two React 19 context providers are handled. Unresolved/any candidates, unresolved uppercase aliases and ambiguous graph imports fail closed; pure helpers remain exclusions.
- All sixteen package manifests, including isolated Windows Fabric and Spark/AppKit packages, have checked export maps and declaration targets/conditions.
- The CI inventory check follows the existing live API surface/declaration checks. The new tests are discovered by the repository's shared test runner.
- Windows retains 272 supported, 37 struck and 112 notVerified historical measurements; macOS retains 272 supported, 54 struck and 95 notVerified. Each of all 421 named rows per lane matches its original status and object details.
- Desktop evidence preserves rc.1 archive hash, measured date, graph and run links. It is not presented as rc.3 or current-candidate mount evidence.
- Status is computed for each exact public import-path/symbol exposure. All 57 unmeasured exposures per desktop lane remain not verified with no invented measurement, including WindowTitleBar and the two UI context providers. Support is not inherited from another alias.
- Tier 1 and Tier 3 statuses remain not verified by the new T3 packet.
- Lookup preserves 341 baseline plus five W rows. Nine external rows have no invented Tron import; recorded import paths resolve in local package export maps. The manifest does not read that ledger or use Forge row IDs as component keys.
- Generated library artifacts contain no absolute machine-specific user or temporary paths.

## Limits and owner decisions

This inventory is a proposal. Owner confirmation of stable/preview labels is
still required. Keep the public professional-control path unchanged; no npm
publishing, platform-requirement reduction, API removal or type change is
approved. The release gate remains unchanged for the separate T3 PR.

Full workspace install/build/typecheck, live declaration regeneration, native
builds, installed-tarball mounts, browser rendering, screen-reader speech,
physical hardware and remote CI at the new commit are NOT RUN by this reviewer.
The narrow tests above verify inventory behavior and source contracts; they do
not establish stable readiness or release acceptance.


## Final artifact binding and privacy check

Reviewed the final nine changed or added files, including the inventory guide,
T2 report and complete test transcript. All local Markdown targets resolve;
zero absolute machine-specific user, private or temporary paths were found.
The manifest categories are 139 general and 339 professional public component
exposures, matching the report.

| Artifact | SHA-256 |
| --- | --- |
| `tooling/library-components.mjs` | `1e722c26ee41c0c1514ad63f179c3ac6fb5f0a057256b1131cf867f5861a4706` |
| `tooling/library-cross-reference.mjs` | `c5e3e0a6184dc237f921776a319538e1940db8faa4f9b81e3d511003a80de02e` |
| `tooling/tests/library-components.test.mjs` | `0ae180712a90256146cd41f59f8dc8607b81e82b4dd5f6d7204b1addcec72d62` |
| `docs/library/components.json` | `28431fd50e1a044110e91cc130252692112a4c684a00d9a8658c25e8ad4fc53d` |
| `docs/library/forge-imports.json` | `c692708e1f1ffa9e3d1f87c14e37e33e3ae5b8b23d822292b331762fdec29858` |
| `docs/library/README.md` | `c1a5fa954ab583392e6ad2bd4706862661c19b0a2adb2f7407bb06531b58c10f` |
| T2 implementation report | `a02ee6fc91428cf6996d4294876dcd35a472a13374d0d8a3cac860cae87b3f21` |
| T2 complete test stdout | `32a3fd6d2feec4d09057046558acfcb8fe5509f3d6b8882e9fc6f5973c13a353` |
| `.github/workflows/ci.yml` | `83af60dcae7bd277237f6206029cb59463de3b67a953f803579e8f376bc32af7` |

The lead records the final commit and draft PR. Reviewer-attribution or link
updates to the implementation report do not establish new runtime evidence.
