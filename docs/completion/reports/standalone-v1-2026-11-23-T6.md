# T6 rc.3 preparation

This integrated draft prepares sixteen package versions and the publication
pipeline for `1.0.0-rc.3`. It creates no release or tag. Package privacy, public
imports and declarations, native peer variants, app orientation, acceptance
records, stability labels and owner distribution approval remain unchanged.

## Integrated inputs and resulting behavior

The isolated draft starts from the reviewed UI accessibility/derived-map parent
`26742419`; its T3 slice is now published as `23cf9027` and is the intended proposal parent. It layers the frozen T3 standalone gate, the exact published kitchen
slice from PR 85, and the published documentation slice from PR 86. T6 adds only
the version cohort, release integration, necessary collector/toolchain follow-up
and these release notes. Earlier independent reviews apply to their original
frozen inputs; T6 still needs its own independent review.

The release pipeline packs the twelve non-library workspace archives and reuses
the exact core/UI archives already installed by the kitchen jobs. It merges the
two exact desktop archives produced and tested by their isolated native jobs,
yielding sixteen archives. It downloads web/unit/accessibility/declaration, iOS
and Android evidence and builds/verifies the exact-source documentation. The
pipeline also runs the documentation's existing clean Expo developer-install and
copied-example checks and retains their proof. These follow the currently
published guide release; they do not pretend an unpublished rc.3 URL exists.
The
strict library gate reads the final archive hashes and actual structured proof;
it applies to prereleases as well as stable versions. Stable owner distribution
approval retains its original exact-version/checksum/comment rule.

The collector follow-up binds structured result platform and permitted evidence
kinds to the runner that actually executed. Declaration checks identify the
TypeScript runner. This prevents relabeling a web result as iOS or using a unit
result as declaration/accessibility proof. Hosted iOS initially failed because
the default runner compiler was Swift 6.1 while the package required tools 6.2.
The first retry selected Xcode 26.2 and passed that assertion but still failed
compiling Expo's JSI Swift concurrency code. The [toolchain investigation](standalone-v1-2026-11-23-IOS-TOOLCHAIN.md) binds Expo SDK 58's documented Xcode 27.1 environment to GitHub's `xcode-27` runner. The workflow now explicitly selects Xcode 27.1 build 27A9275, asserts both values and prints the actual Swift version. No dependency, native configuration, concurrency check or acceptance step changed. Hosted iOS remains failed pending the new retry; no runtime pass is claimed.

## Actual validation and limits

- Full integrated local test discovery: **1,340 passed**, zero failed or skipped.
  After the workflow-only Xcode 27.1 selection, fourteen targeted workflow and
  collector guards passed; YAML/toolchain and whitespace checks also passed.
  The full suite was not repeated for this toolchain-only change.
- All fourteen workspace packages and both isolated desktop TypeScript packages built and packed as sixteen actual rc.3 tarballs.
  Public API signatures match fourteen packages, 622 subpaths and 3,354 reachable
  declarations. Existing package/export checks passed.
- Offline `pnpm install --lockfile-only --frozen-lockfile --ignore-scripts`
  passed for eighteen workspaces. The inherited kitchen lockfile additions are
  retained; package versions did not require new dependency resolution.
- Actual documentation verification passed 478 rendered routes/examples and
  five browser tests with no automated WCAG AA-tag violations. Manual speech and
  full accessibility conformance are not inferred.
- Updated collector producers were exercised against the corrected installed
  rc.2 development consumer: 72 component/model assertions, successful consumer
  TypeScript and 84 rendered web assertions. These dirty local runs validate the
  follow-up schema and are explicitly **not rc.3 candidate receipts**.
- The strict rc.3 CLI exited nonzero for the actual pending owner labels, dirty
  local source and absent exact-candidate runtime evidence. The final sixteen-archive
  inventory and every archive hash verify successfully; this does not satisfy
  native runtime or clean-source requirements. No pass was written to production evidence.

Local test invocation required the task's correct pinned pnpm executable, an
isolated npm cache and a canonical temporary directory. Initial failures caused
by the sandbox cache restriction, missing local optional dependencies and macOS
temporary-directory aliases were corrected through task-local environment/dependency
setup; no product test expectation was weakened. Existing exact pinned external
dependencies were reused, including the separately installed media dependency.

The local archive inventory is attached as
`standalone-v1-2026-11-23-T6-local-archives.json`. It records development artifacts
only. Windows Fabric and Spark AppKit package builds used their isolated pinned RN/TypeScript peers; normal prepack checks passed. Their native hosts were not compiled or runtime-tested in this local T6 draft. Hosted candidate evidence must use the final clean source,
the same archive bytes on every target and every required job's actual outputs.

## Release copy and handoff

Applied `ux-copy` guidance: the recommended status is **“Release candidate draft;
publication blocked.”** It says what exists and what remains actionable without
implying a release, owner approval or broad platform conformance. The changelog
uses the existing Unreleased section; the historical rc.2 heading and notes are
preserved. “Proposed stable” remains distinct from a confirmed stable label.
Release copy should remain literal and translatable, without idioms or claims
that installation URLs work before the release exists.

### Required skill sequence and concrete T6 application

T6 adds release copy and packaging, with no new GUI template. The already
included T1/T5 outputs supply the applicable screen research/design work; this
table records how those outputs constrain this release proposal, in the brief's
required order. Reusing the reviewed findings does not claim new interviews,
Mobbin searches or hardware measurements.

| Sequence | Included concrete output | Application to T6 |
| --- | --- | --- |
| 1. user-research | [T1's three developer profiles and first-ten-minute tasks](standalone-v1-2026-11-22-T1.md), expanded in the [kitchen report](standalone-v1-2026-11-22-KITCHEN.md) and [docs report](standalone-v1-2026-11-22-T5-DOCS.md). | The installer gets the current working guide URL and a copied-example check; the maintainer gets exact archive identity and an actionable blocked status. Inferred profiles remain hypotheses, not participant research. |
| 2. design-system | T1's semantic-token audit preserves the known reference border-only contrast limit; T5 records app-owned light/dark tokens, radii, surfaces and documentation contrast measurements. | No token or theme is changed by versioning. The release notes preserve those measurement limits and separate theme examples from library guarantees. |
| 3. ux-copy | T5 distinguishes “Proposed stable” from confirmed labels and names root/direct imports precisely. | The resulting release status is “Release candidate draft; publication blocked.” Notes name pending labels, clean source and required checks instead of suggesting a published URL or owner approval. |
| 4. frontend-design | T5's grouped fixture hierarchy and the documentation directory/reading/demo hierarchy include typography and responsive rationale. | T6 keeps those existing templates intact; no release-status text is inserted into a product control or new UI flow. |
| 5. Mobbin references | T5 docs map the viewed GitBook screen to index/search and OpenAI Platform screen to reference/guide templates; the kitchen report links the viewed Base/TextNow grouped-settings screens for its one catalog template. | Those pattern references remain scoped to the implemented templates. T6 creates no additional screen needing a new reference and copies no assets or source. |
| 6. build and design-critique | T5 reports the observed theme-selection, documentation-layout and Button-style issues with fixes; the kitchen review includes severity and collector provenance corrections. | The release notes carry the actual fixes and limitations. Packaging and checksum success never substitute for an observed UI or native runtime result. |
| 7. accessibility-review | T5 records actual axe/template cases, measured documentation colors, semantics and explicit speech/zoom/native limits. | The draft preserves those scopes. It does not turn zero automated violations into a full WCAG or native screen-reader claim. |
| 8. design-handoff | T5 specifies the kitchen's 960-unit cap, 320/1100 checks, tokens and state retention; docs specify 1000/700/360 breakpoints, route IDs and hashed proof. | The release workflow retains the built documentation and copied-example proof; exact-source receipts and archive hashes are the technical handoff. |
| 9. independent code-review | Included T1/T3/T5 reviews cover their frozen slices; T6 has separate version/copy and workflow reviewers. | T6 is a reviewable draft, not self-approved. Reviewer-required workflow contracts guard the mandatory library/installation checks before publication. |

The UX copy output is intentionally literal: “draft” tells installers the new
release URL is unavailable; “publication blocked” tells maintainers to inspect
the checklist and actual strict-gate output. It avoids promising that only an
owner comment remains when label confirmation and exact-candidate technical
evidence are also outstanding.

Review [the rc.3 checklist](RC3-RELEASE-CHECKLIST.md) and the actual workflow
artifacts before publication. Complete owner label confirmation and prerequisite
merges, obtain clean exact-candidate checks, and retain all sixteen archive hashes.
Forge keeps its rc.2 pin until rc.3 exists; the later F3 install remains unrun.
