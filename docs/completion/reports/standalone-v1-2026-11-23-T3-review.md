# Independent review: T3 standalone library release gate

Reviewer: `skill_discovery`; implementer: `tron_gate`.
Date: 2026-11-23 UTC. Technical base: `26742419a77dab1bc58704c238e9982b6e107069`.
Skill: `knowledge-work-plugins/engineering` 1.2.0 standalone `code-review`.
Project state/layout and no-ai-slop instructions apply to preservation/reporting;
no component or native presentation changes are part of T3.

Verdict: passed after the execution-stage/platform, image and cross-platform
corrections below. No outstanding critical or warning findings. This review
authorizes no release, merge, owner label or distribution approval.

## Findings and disposition

| Severity | Finding | Disposition |
| --- | --- | --- |
| Warning, fixed | Tier 1 validation searched an install-command array for the string npm install, rejecting actual kitchen receipts. | Exact structured npm/install tokens now match the producer; substring strings, echo, uninstall and empty tokens have negative regressions. |
| Warning, fixed | Raw SPA HTML cannot prove the visible preview badge. | Bound complete browser route/label results now identify each import, symbol, route, owner state and exact rendered badge; built data fields are checked against the manifest. |
| Release integration requirement, implemented | Optional prerelease packaging could be confused with fully passing rc.3 publication. | Explicit requireLibrary/--require-library enforces library blockers and all sixteen archives for prereleases, while owner distribution authentication remains stable-only. The T6 integration patch must use this flag. |
| Warning, fixed | Receipt flags could transplant web proof into a native platform or SSR proof into declarations/accessibility. | Known runner and source contracts, bound structured evidenceKinds and actual platform now reject cross-kind/platform substitution. Accessibility requires actual zero-violation axe cases. |
| Warning, fixed | An eight-byte PNG signature alone could satisfy the screenshot check. | The existing PNG codec must decode a complete positive-dimension image; signature stubs and truncated captures fail, and positive fixtures use real PNG data. |
| Cross-platform warning, fixed | Protected source hashing depended on checkout line endings and a path fixture used a nonportable target. | Protected source fingerprinting normalizes CRLF only, changed logic still fails, and a real outside-file fixture uses a Windows junction or POSIX alias while traversal always executes. Archive hashing remains byte-exact. |

The platform issue was reproduced with synthetic validation only: a bound web
receipt with runner.name playwright was originally accepted as ios and android after
changing only its top-level platform. Final regressions reject that route,
Android-to-iOS transplants, SSR-to-TypeScript/axe relabeling and inconsistent
structured result categories. No actual browser or native acceptance
was executed or inferred during that negative experiment.

## Reviewed boundaries

The gate regenerates the full public export inventory before accepting the
checked-in manifest. It preserves aliases and conditional declaration identity
and covers all sixteen package surfaces. Current owner labels remain pending
and null. Complete label confirmation binds every export and proposal digest;
missing/extra entries, conflicting aliases and all-preview shortcuts fail.
This label record does not authenticate the separate distribution approval.

Stable components require exports, declarations, unit/model, accessibility,
web, iOS, Android and component documentation. Preview runtime evidence is not
required; preview pages and correct visible labels remain required. Evidence
binds clean source revision, requested version, exact installed archive hashes,
manifest fingerprint, executable source, process exit, assertion counts,
component/import/state coverage, logs and structured results. Safe evidence
paths reject traversal and escaping filesystem aliases.

The documentation contract binds page, shared page source, built component
data and example bytes. Actual complete example results and unskipped browser
results back a route/label proof for all exports. Cross-checked the real docs
producer: its flat component data, routes, page paths and browser result shape
match the new validation. Its SPA shell no longer needs fabricated label text
in static HTML.

The evidence collector only indexes actual receipt files and records missing
ones. Tested core/UI archive merging verifies version, clean source revision,
package identity and raw digest before the first copy, prevents repacked
replacement, and retains identical bytes. The remaining archive inventory is
still checked by the unchanged sixteen-package release policy.

The distribution approval algorithms are unchanged: actual owner comment,
exact author/repository/statement/version and exact SHA256SUMS byte binding.
The stable path never reaches owner lookup until library and archive blockers
are cleared. A prerelease does not fetch or invent stable owner approval.

The active Forge validator import is removed from release readiness. Original
program bytes and proof remain in dated history. Qt correspondence becomes an
explicit historical case study rather than normal release test discovery;
its graph is frozen at its cited revision and exact checksums. No public
@nyc-tron export, declaration, native configuration, acceptance value or owner
approval is changed by this slice.

## Final independent verification

```text
$ node --test tooling/tests/collect-library-evidence.test.mjs tooling/tests/library-readiness.test.mjs tooling/tests/release-readiness.test.mjs tooling/tests/legacy-program-handoff.test.mjs tooling/tests/test-files.test.mjs tooling/tests/library-components.test.mjs tooling/tests/historical/qt-component-coverage.test.mjs packages/ui/tests/contracts.test.mjs
tests 80
pass 80
fail 0
skipped 0
```

This final run includes the install-command, SPA route/data/badge, strict
prerelease, execution-stage/platform, PNG, CRLF and portable-alias corrections.
All eighty tests ran with zero skips.
Synthetic fixtures are explicit tests, not real owner or release evidence.
The existing engine dependency-boundary assertion passed.

Actual stable CLI exited 1:

```text
Release readiness: stable publication blocked: owner stable/preview confirmation is pending; release evidence requires a clean source commit; owner distribution review is pending; the sixteen actual release archives and SHA256SUMS are required
```

Actual rc.3 CLI with --require-library exited 1:

```text
Release readiness: required library publication checks blocked: owner stable/preview confirmation is pending; release evidence requires a clean source commit; the sixteen actual release archives and SHA256SUMS are required
```

Both are honest current blockers. No historical application-row acceptance is
used as Tron's stable scope. The planning report retains missing per-component
checks/docs as NOT RUN instead of promoting proposed stability.

## Remaining integration and limits

The separate T6 workflow patch is not part of this T3 implementation: it must
connect the T5 workflow, actual docs verification, downloaded receipt index,
exact tested core/UI archive reuse and --require-library before rc.3 can ship.
T3 does not claim those hosted jobs have run or that every library gate passes.

Full workspace build/typecheck, hosted CI, live receipt collection, native
mounts, physical hardware, screen-reader speech and publication were NOT RUN by
this reviewer. No owner decision is inferred on stability, npm or public paths.
The separate kitchen producer follow-up was independently reviewed as well:
its nine guards passed, and an actual corrected installed consumer passed
72 unit/model assertions and TypeScript compilation. The new unit/exports and
declaration summaries carry their executed categories, with a TypeScript runner
for declarations. The writer's real web result was checksum-verified at 84
assertions/four cases with platform web and web/accessibility categories. Those
receipts remain dirty-source development evidence and are not promoted by T3.
Native summary compatibility was reviewed in source; a clean native collector
run remains pending.

## Source freeze and history

All thirty-one original final-freeze entries were independently compared to
their recorded SHA-256 or deletion state with zero drift. A later append-only
README clarification was also reviewed and approved: "Use the source-revision
report for original relative links; these archive bytes are immutable." The
manifest below includes its expected new hash; the lead applies and verifies
that documentation-only append before publication. No public package source,
public declaration or owner review record changed. No newly published private
machine path was found.

The frozen Qt Markdown intentionally retains original bytes, including relative
links based at its former docs/qt location. Its archived-copy local links do not
resolve from the deeper archive directory. The original report and the pinned
source location remain available; use that original location for its relative
links. This is disclosed historical context, not a claim that all nested archive
links were repaired or that runtime evidence passed.

The complete source-file binding follows. Later review-attribution or PR-link
metadata updates do not establish additional runtime evidence.


```text
11c36f690871291513fea6af08f43ffb45c777646333486b4f536c5f02c96eaa  .gitattributes
40e9deaddba31b555523352176a44abfd1ddb9ca1a850584bd7456d87fd58707  .github/workflows/ci.yml
1054d4cff800402980cbeded851d3a656823c675d12b10397a4fa7c49cb9200c  .github/workflows/release.yml
80eec1a7e2b048605a714992feceba9c379fe08ebb84dac2b1e2aa15bb2e70aa  AGENTS.md
5ffb0f9c2044379153aa814be86d02151265710ddd8de7e03644478270621a6f  docs/completion/reports/2026-11-22-forge-program/historical-program-reader.mjs
4e31a76a8e848d5b076c350e2026bee271dd891adde9ed35b25972a8df0b2987  docs/completion/reports/2026-11-23-qt-case-study/ARCHIVE.json
bdb46a54d3ba9b06916071e35e3d1d532b0bf6391b4e6529a23f47495d48715d  docs/completion/reports/2026-11-23-qt-case-study/README.md
ff73c1858737af1931a3857957438f1b26841363aae0301d6afc283eeb12465b  docs/completion/reports/2026-11-23-qt-case-study/component-coverage.json
ea6dc52411359d2e7d9954a3d6bc3affcca8d368d5d1b9efd2e4caaf05a246be  docs/completion/reports/2026-11-23-qt-case-study/component-coverage.md
91d623a9183a1743175b3e7824570d5fcaeb390b483cc9fb8d0824a9463aa3c8  docs/completion/reports/standalone-v1-2026-11-23-T3-rc3-readiness.json
a35d78ee80bab08357b9f7726425c071f0d3e845dfc1d5cb81f596a85c2be72b  docs/completion/reports/standalone-v1-2026-11-23-T3-readiness.json
dfdfdd941ad4a6b22d29ec88a4b964edaaeac167fc9b688218c51b6c4a709bfa  docs/completion/reports/standalone-v1-2026-11-23-T3.md
b380a23fce2d7484c37836b1f012da64c77f3d627caf5ae090a700a228044ff0  docs/library/README.md
5a23132a41c2600c3cfc72fd20b9f82ea7ddc1709175bb8e366b05d532f6eb35  docs/library/evidence.json
3d03e0a8d5c20d5360265ecece700119db35d10381b5a4df38efb6723875c20d  docs/library/stability-review.json
93cc118d7f116baf089cf50d73ed1064c92dba64e2b97625ca90e4dc7f0bb37b  package.json
ebfb25995c70df8f70ec4022687ca68925f3ab4028d5c35e48df2d99c0a16ecc  tooling/collect-library-evidence.mjs
f46e5730d46c9aa773dade028596cd9b944dfbd1b300c3c48a3b639151d69094  tooling/library-components.mjs
98087f1e988f8ba4eebea978dab3c293ef2f8058aa6eaad729d9f505ac5fe6d9  tooling/library-readiness.mjs
25bf15b82b5ee605b301c2fa0aaecf26abefa7e9813ebd8841644d558108cd65  tooling/qt-component-coverage.mjs
8324dbd14f65dc5fa2fc0fb7930b0c220038f7efa24b118f3868570f112454f1  tooling/release-readiness.mjs
2ea506c65451fc4956372daf630dfef12ad283f9ae4ecbbcfd6947ac06b09898  tooling/test-files.mjs
ee234b260aef641604336527978726af29defaebed988368839c4523339d2f7e  tooling/tests/collect-library-evidence.test.mjs
3716ca7ab1e12ef0edf5a3ab06b92dcc7bb74b189f942430a01a39c87d6f86c5  tooling/tests/fixtures/library-release.mjs
52f406a423adb135065e62989ee15468f53734737ae77c373973373d554ccfa3  tooling/tests/historical/qt-component-coverage.test.mjs
9b5bfdc0d49596a6f4e3c66dedaf7167f0ce56e55c64e283e513717d13e73be9  tooling/tests/legacy-program-handoff.test.mjs
3c14ba77302262fd154f9cd1d4bbfbc29ae22db9c55945cb58941ac904a137f0  tooling/tests/library-readiness.test.mjs
DELETED  tooling/tests/qt-component-coverage.test.mjs
0a9bbd123f46777d522936bdf0417ef51dffd0df655f7563c66befd51a3f14bd  tooling/tests/release-readiness.test.mjs
771cec9b45bcbad0aae6c8a55049c9017dd879b69c3cb4eaf2a886060930f053  tooling/tests/test-files.test.mjs
DELETED  tooling/verify-component-program.mjs
```
