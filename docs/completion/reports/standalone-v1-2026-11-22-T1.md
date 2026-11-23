# Standalone library v1: T1 decision record

Dated 2026-11-22 (New York); checks completed 2026-11-23 UTC.
Base: `0e09d3be8263b3dbb2eab1a78e5dd66b83b68e44` (`v1.0.0-rc.2`).
Gate: T1, in-progress pending owner review and merge. Independent review passed
for this docs-only slice; the global search criterion remains staged. This is a
docs-only slice. Commit and draft PR are recorded by the integrating lead.
Implementer: `tron_decision`; independent reviewer: `skill_discovery`.
The [independent review](standalone-v1-2026-11-22-T1-review.md) records its checks
and limitations. No critical or warning findings remain.

## Baseline

The separate `baseline_audit` subagent's
[full report](standalone-v1-2026-11-22-baseline.json) records the unchanged Tron
and Forge heads, all per-row comparisons, CI run links and release assets.
The two baseline TSV files are byte-identical, with 341 IDs/names in the same
order. Tron's acceptance is `unverified` for all 341; Forge instead has a
`completion` field (35 unverified, 274 in-progress, 32 blocked). Those fields
measure different things and must survive handoff unchanged. The README package table also carried an outdated 551-export count; the
current export-map audit reports 556 keys. The table now points to the API
surface inventory instead of maintaining a second volatile count. The release has
sixteen archives and `SHA256SUMS`; its UTC publication date is November 14,
which is November 13 in New York. Earlier green runs are evidence for their
own commits. T1 does not assert that they cover the new documentation commit.

## Skill sources

Applied installed skill sources, identified without machine-specific paths:

- `knowledge-work-plugins/design` 1.2.0: `user-research`, `design-system`,
  `ux-copy`, `design-critique`, `accessibility-review`, `design-handoff`.
- `claude-plugins-official/frontend-design` 1.1.1: `frontend-design`.
- `knowledge-work-plugins/engineering` 1.2.0: standalone `code-review`.
- [Foldable layouts](https://github.com/mikevocalz/nyc-mon/blob/main/skills/mikevocalz-foldable-layouts/SKILL.md),
  verified against the repository-required blob `d60f539b263863027ec7593ffaea38304ad1e5d8`.
- [No-ai-slop](https://github.com/mikevocalz/nyc-mon/blob/main/skills/no-ai-slop/SKILL.md)
  and its `eval.md`.

## Skill outputs, in application order

### 1. user-research

These are task-based developer profiles inferred from the owner brief and the
existing installer/support contracts, not interview participants or validated
research findings. Interviews and observed usability sessions: NOT RUN.

| Developer profile | First ten minutes: top tasks | Documentation implication |
| --- | --- | --- |
| Expo app developer choosing a UI kit | Check runtime compatibility, install one component, run the example, connect an existing theme | State library scope first, then installation and theme ownership; keep optional peers visible |
| Product engineer building a professional editor | Find an isolated control import, inspect props and callbacks, check keyboard/cancellation behavior, confirm no engine dependency | Keep general/professional categories and the one-way Forge boundary; show evidence limits beside support claims |
| Maintainer approving adoption across platforms | Read stability guarantees, inspect exact version/checksums, distinguish measured desktop support from unverified hardware | Link D9, support lists and commit-specific evidence; separate pending release work from past passes |

### 2. design-system

Read `docs/THEME_TOKENS.md` and the existing component contracts. The README
already distinguishes general components and professional controls, while the
public path says `components/forge/`; this is a naming issue for an owner
decision, not permission to rename it. Existing theme aliases remain deprecated
and supported. The token document identifies a known border-only input contrast
limit (1.58:1 in its reference palette), and optional semantic colors can yield
unstyled recipes when omitted. These are retained limitations, not fixed here.

The existing contracts suite passed the checks for documented semantic tokens,
absence of hardcoded hex colors in component sources, and absence of legacy
class names. This is a source-level audit; it does not establish every style,
contrast pair or runtime state. Per-export stability proposals, reasons and
complete naming/metric audit belong to T2 and are NOT RUN in this slice. No
component is assigned `stable` or `preview` here.

### 3. ux-copy

The delivered README status copy is the block at the top of `README.md`.
It names the actual prerelease, sixteen archives, independent library scope,
pending evidence/docs and owner approval. The support opening defines the
proposed labels: `stable` for the semver/gate promise, `preview` for components
that may change in a minor, and "not verified" for missing sufficient platform
or scenario evidence. Labels are textual, never color-only. Component labels
await owner confirmation. Alternatives considered: "v1 complete" was rejected
because the gate/docs work is pending; "all platforms supported" was rejected
because desktop and physical-device evidence have separate limits. Install
errors, kitchen-sink empty states and rc.3 release copy are NOT RUN (T5/T6).
Localization: preserve package paths, version strings and literal label values;
translate explanations without idioms or implied guarantees.

### 4. frontend-design

The T1 surface is GitHub-rendered Markdown. Keep its host typography and
responsive document layout; add no product palette, custom CSS, motion or font.
The status block precedes import examples and links to the detailed support
policy. This suits a library evaluator comparing install and support facts.
Docs-site and kitchen-sink visual direction is NOT RUN (T5); no screen template
or coded UI is created by this docs-only PR.

### 5. Mobbin

No docs template or kitchen-sink screen is built in T1. Per-screen references
are NOT RUN and remain required for T5; no reference is claimed or copied.

### 6. design-critique

Source-document critique against the requested standards for scope clarity,
document hierarchy and developer ergonomics:

| Finding | Severity | Fix made |
| --- | --- | --- |
| README presented a downstream application roster as library scope | Major | State general components/professional controls and independent evidence gate |
| README archive count contradicted the release inventory | Moderate | Replace fifteen with sixteen |
| Support opening made program targets look like a library support promise | Major | Describe measured runtime lanes and explicitly unverified scenarios |
| Roster treated row ownership as current library readiness | Major | Replace with pending manifest, per-component evidence, docs and owner-review gates |
| Decision text could imply the validator was already migrated | Major | Explicitly name the separate T3 change and pending state |

Rendered-page visual critique: NOT RUN. No endorsement or participation by the
people and firms in the owner brief is asserted.

### 7. accessibility-review

Static Markdown review only: headings remain descriptive, link labels identify
destinations, support/stability is stated in words, and no images, interaction
or color-only indicators were added. The component contracts suite's semantics,
adjustable actions and Android-role checks passed; those checks are source
assertions, not VoiceOver/TalkBack speech evidence. GitHub-rendered keyboard,
screen-reader, zoom and contrast checks: NOT RUN. A WCAG 2.1 AA compliance pass
is not claimed. Full docs-site/kitchen-sink and per-component audits remain T5.
44px target recommendations in the skill are WCAG 2.1 AAA guidance (2.5.5),
not a new AA claim.

### 8. design-handoff

T1 document specification: keep the README title and product description, then
one status callout, then existing examples and Studio/Forge boundary. Retain
GitHub's wrapping and link behavior. No new breakpoint, truncation, loading,
empty or animation state applies to static Markdown. Support opens with scope,
proposed status vocabulary and evidence limits before existing runtime lanes.
D9 follows D8, with reciprocal supersession links in D3/D6. Component-page and
kitchen-sink layout/token/state/breakpoint specifications are NOT RUN (T5).

### 9. code-review

Independent subagent `skill_discovery` reviewed the final documentation and
evidence attachments before the lead prepared the draft PR. The
[review output](standalone-v1-2026-11-22-T1-review.md) records no critical or
warning findings, independently rerun checks and the remaining staged scope.

### Project skills

`mikevocalz-foldable-layouts`: preserved navigation, platform, window and scene
contracts by keeping this change documentation-only. No native/layout support
is inferred from these edits.

`no-ai-slop`: removed scope/count claims from current status prose, retained
specific version/evidence limits and kept the owner's D9 wording verbatim.
No reference-library code, layout, tokens or copy was used.

## Verification actually run

```text
$ node --test packages/ui/tests/contracts.test.mjs
[16 checks passed, including:]
Forge controls never import engine packages or app-specific palettes
all direct component export targets are actual independent files
every semantic token a component uses is documented for consumers
components take colors from theme tokens, not hardcoded hex values
interactive controls keep screen-reader semantics
accessibilityRole only uses values Android's enum accepts
tests 16
pass 16
fail 0
cancelled 0
skipped 0
todo 0

$ git diff --check
[no output; exit 0]
```

Baseline stable-gate output, run by the lead before any gate migration (exit 1):

```text
$ node tooling/release-readiness.mjs --version 1.0.0
Release readiness: stable publication blocked: 341 of 341 components lack accepted eight-platform proof; 5 of 5 added rows lack accepted eight-platform proof; owner distribution review is pending; the sixteen actual release archives and SHA256SUMS are required
```

This is the unchanged program gate, not a T3 result. No archives were produced
by this docs-only check, so its archive blocker is expected.

The [complete captured test stdout](standalone-v1-2026-11-22-T1-contracts.log)
is attached, including every test name and result. The local Markdown target
check invocation is preserved in
[the link-check transcript](standalone-v1-2026-11-22-T1-links.txt).

The test command used Node `v26.13.0`. Full build, declaration checks, native
builds, installed-tarball mounts, browser rendering and physical hardware:
NOT RUN in T1. Source and public API files are unchanged.

## Scope-search acceptance remains staged

A search for `341` in README, AGENTS, SUPPORT and ROSTER now returns no matches.
V1_DECISIONS matches are confined to superseded D3/D6 and D9's verbatim owner
direction, which assigns the program to Forge. The brief requires that exact
D9 text and also says search matches may only be D3/D6/history; this report
records the D9 exception instead of silently changing the owner's text.

A repository-wide docs/tooling search still finds the existing ledger, program,
validator, release readiness, Qt coverage, planning docs and dated evidence.
This slice does not claim the final global search acceptance: moving the ledger
and validator is T4, changing the gate is the separately reviewed T3, and
remaining current planning references must be reconciled during that handoff.
Dated proof files remain unchanged and linkable.

## Owner decisions and unproven work

- Public `components/forge/` path: keep for v1 to preserve consumers; import
  counts and any neutral alias proposal remain T2. No path changes here.
- Stable/preview list: require per-export evidence and owner confirmation (T2).
- Platform tiers: use D9's proposed defaults; report evidence gaps in T2/T3.
- npm: keep GitHub Release tarballs while T5 prepares the distribution proposal.
- Forge eight-platform program: preserve its current requirement; handoff does
  not authorize a reduction.
- Public export removal, rename or type change: none proposed or made.

No acceptance field, distribution approval, public export, package manifest,
workflow, validator, Forge pin or evidence receipt is changed. T2 through T6
and F1 through F3 remain unproven by this slice.
