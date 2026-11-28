# T5 kitchen sink implementation and evidence

## Scope and research

The runnable Expo catalog exercises all five proposed stable identities through
their ten public root/direct imports. Stability remains unconfirmed in the
manifest and visible app copy. Existing four examples, package release versions,
public APIs and default orientation are preserved. No custom native code or
configuration plugin is introduced. Zustand owns every application state value;
native imperative handles remain outside serialized state.

Applied design skills: user-research, design-system, ux-copy, frontend-design,
design-critique, accessibility-review and design-handoff. React Native workflow,
project no-ai-slop and foldable layout guidance informed implementation and QA.
The primary user is a consumer comparing actual library states and validating
integration. The single catalog screen uses titled component groups, clear state
copy and inline controls rather than hardware-specific navigation assumptions.

Actual Mobbin screens viewed for the grouped settings pattern:

- [Base display settings](https://mobbin.com/screens/3f573b95-4bbb-4978-957e-56178543e8e7)
- [TextNow settings](https://mobbin.com/screens/ad5aa6e3-c55c-441c-ac9e-691473e07f92)

These informed grouping and persistent labels, without copying visual assets,
colors or product copy. Current gluestack, Tamagui, React Native Paper and shadcn
documentation were inspected for integration/documentation conventions. The app
keeps the repository's semantic token and native component contracts.

### Three developer profiles and their first ten minutes

These are task-based design profiles derived from the brief and repository
integration contracts, not claims of interviews or measured user research.

| Developer profile | Top tasks | Resulting navigation and claim wording |
| --- | --- | --- |
| Expo application developer integrating a first control | Identify compatible Expo/RN peers; install the private candidate; copy an actual Button or TextField import; run on their target; distinguish unsupported from untested platforms. | Start instructions precede proof commands. The catalog visibly distinguishes root/direct imports, and platform proof is reported separately for web, Android and iOS. A bundle export is never described as a native runtime pass. |
| Design-system engineer adapting an app theme | Find semantic tokens; compare light/dark and three surfaces; inspect loading, disabled and validation states; check contrast and target sizes; confirm RTL preserves an explicit edge. | Component groups keep state examples together. System/Light/Dark controls and physical-edge controls name their effects. The app owns its palette, and axe evidence is described as automated checks rather than complete accessibility conformance. |
| Library maintainer reviewing a release candidate | Compare root/direct export identity; inspect per-component asserted states; reproduce failures; trace logs and screenshots to exact archive hashes and source; separate owner approval from technical evidence. | The alias/result lines expose what is rendered. Portable commands lead to structured receipts, source/archive hashes and artifacts. Visible copy says stability is proposed and pending owner confirmation; dirty local proof never implies release eligibility. |

The documentation-page navigation counterpart is API identity, install/import,
live states, props, platform notes and evidence. Its implementation belongs to
the separate documentation slice; the kitchen supplies the reusable fixtures
and state contracts rather than making documentation completion claims.

## Working states and critique

Button exposes variants, loading, disabled and a real press counter. Card shows
three different surfaces. TextField has persistent labels, helper/error text,
editable validation and a shared retained draft. Rail demonstrates selection,
disabled destinations and collapsed accessible labels. Shell uses explicit left
and right physical edges and RTL while retaining the child field. A narrow
320-pixel viewport remains usable without horizontal document overflow.

Light/dark appearance is application-owned. Independent lead interaction found a
theme selection bug where the palette changed but the selected mode stayed System.
The fix updates the Zustand selection and guards native Appearance operations on
web. The actual regression verifies both selected treatment and palette while
retaining the press counter. Independent lead prototype interaction subsequently
verified counter, root imports, disabled/loading controls, editable field, Editor
selection, disabled destination, collapse, left-edge RTL and retained draft.
Those manual prototype observations are separate from installed-archive proofs.

Real DOM testing also exposed three library accessibility issues in loading,
selection and field descriptions. The separately reviewed UI accessibility fix
supplies explicit ARIA state and error/helper association without changing public
prop signatures. Its three source files and regression tests are documented in
the companion UI-A11Y report.

## Actual local results

The corrected installed consumer uses actual private core/UI `1.0.0-rc.2`
tarballs. Local digests were core
`0739fdc157461de8bb080471e61a46a4ffaf73b383ebca6a11a3cf67a08f7744`
and UI `9426aa7954afe3ad19f5c66280a8ed98162a9acbca9d6721dbd64e42cc9ec869`.
These local results carry `sourceDirty: true` and are development evidence only.

- Actual installed-archive browser checks: 84 assertions, both import modes,
  light/dark palettes, four rendered axe cases, zero axe violations or browser
  runtime errors. Screenshots capture all four narrow-viewport cases.
- Actual installed-archive component/model checks: 72 assertions, all five
  identities through both import modes, including per-instance store independence.
- Installed consumer TypeScript declarations: compiler exit 0.
- Archive and native collector guards: nine passing tests, zero failures or skips.
- Independent component accessibility browser regressions: three passing tests.
- Component contracts: 16 passing tests.

The initial Android build exhausted the local disk while generating all ABIs.
Only this task's generated outputs were removed; the corrected consumer and
dedicated Gradle cache were placed on external storage for an ARM-only rebuild.
The corrected installed-archive Android release build subsequently completed
successfully: 331 tasks in 8 minutes 35 seconds. The lead owns the separate live
Argent runtime walkthrough and saved recording; no device interaction was
performed while changing the collector guards.
No Android or iOS runtime pass is claimed by this report before real execution.
No local iOS simulator was available through Argent; physical hardware was not
substituted. The clean runner workflow supplies iOS simulator build and runtime
proof. Hosted execution status must be read from its actual workflow artifacts.

## Accessibility and handoff

Four axe WCAG 2.1 A/AA tag scans passed on the installed web export. Native target
semantics, keyboard operation, screen-reader speech, font scaling and manual
contrast remain distinct checks; automated scans do not imply complete WCAG
conformance. Full rail APG arrow-key support is not claimed.

The app README provides portable start, installed-consumer and proof commands.
`tooling/kitchen-sink/contracts.mjs` defines the asserted state contract;
`fixtures.tsx` exports each component fixture with `{ store: KitchenStore }`.
Receipts include real structured counts and identical component/import coverage,
source and manifest fingerprints, archive identity, runner/test hashes, logs and
screenshots. The reusable workflow packs core/UI once, then all three target jobs
consume those same bytes. Release integration must reuse the tested archives and
reject dirty-source receipts. Owner stability approval remains a separate gate.

### Concrete kitchen-screen handoff

| Area | Implemented specification |
| --- | --- |
| Screen frame | SafeAreaView fills the host. One vertical ScrollView centers a full-width content column, maximum 960 layout units. Content padding is 20 units, bottom padding 48; component-group gap is 36. App orientation remains `default`; no device-family or window-size inference changes navigation. |
| Hierarchy and spacing | One 30-unit semibold screen heading; component headings 24-unit semibold. Body is 16 units with 24-unit line height; supporting text 14 with 20-unit line height. Header groups use 12-unit gaps, fixture content 16/20, action rows 12. Each fixture keeps title, purpose and live states in the same group. |
| Surfaces and radii | Control radius 8 units; card radius 14. Raised/sunken/transparent are separate actual Card recipes. Light surface/raised/sunken are `#f5f7fb`/`#ffffff`/`#edf1f8`; dark equivalents are `#17263b`/`#21354f`/`#192a42`. |
| Text and interaction tokens | Light text/muted/border/focus: `#172b49`, `#465b76`, `#6d7b90`, `#244e87`; dark: `#f2f6fc`, `#becbe0`, `#91a2b9`, `#b8d3ff`. Primary/on-primary is light `#244e87`/`#ffffff`, dark `#b8d3ff`/`#172c4e`. Danger/on-danger is light `#9b2735`/`#ffffff`, dark `#ffb3b9`/`#4d1420`. Tokens are app-owned in global.css; replacements need text contrast at least 4.5:1 and sole input edges/focus at least 3:1. |
| Button and Card states | Primary/secondary/ghost/danger, enabled press counter, disabled, loading, and a small button with explicit 44-unit target. Cards raised/sunken/transparent have distinct backgrounds. Disabled/loading cannot run their action. |
| Field states | Persistent label, empty/editable shared value, helper, validation error that clears on entry, and read-only example. Helper/error associations are asserted in real web DOM. The shared draft is retained when import mode, shell edge, RTL and viewport change. |
| Rail and shell states | Library/Editor selected destination, disabled Unavailable, expanded/collapsed labels with accessible names. Shell starts on physical right; controls switch left/right and LTR/RTL. RTL changes text direction while an explicitly chosen edge remains physical. Shell minHeight is 240 units. |
| Responsive behavior | No device breakpoints are authored. Action rows and Card rows wrap intrinsically; cards grow from flexBasis 220. At a 320-unit host width, 20-unit side padding leaves 280 usable units and cards stack. Content caps at 960 on larger hosts; wider hosts do not create a different stateful screen. Actual browser regression covers widths 320 and 1100, including retained values and no horizontal document overflow. Other widths and font scaling need target-specific QA. |
| Motion and input | No decorative animation or custom gesture. Standard native presses/text inputs and scrolling provide input. Web checks exercise Tab/Enter-compatible actions; full tablist arrow-key handling is not authored or claimed. |

### Collector review corrections

Review reproduced two false-positive routes with a synthetic CLI: version
`2.12.10` matched a substring check for `2.12.1`, and a prior PNG could satisfy a
new run. The collector now requires the exact trimmed pinned version, exclusively
creates a new evidence directory, runs each flow from its own new stage, and
requires exactly one PNG in that stage. Existing directories fail before flow
execution. A passing CLI exit also requires strict executed, nonfailed,
nonskipped JUnit. Source-bound candidate indexes are mandatory, so unindexed or
foreign same-version archives cannot be attributed to the current checkout.

Nine guard tests exercise real archive identity/digest and duplicate rejection,
foreign and missing candidate indexes, wrong version, stale output, missing fresh
screenshot, and missing/failed/skipped JUnit. Synthetic fixtures test rejection
only; they are not native application evidence. `node --test
tooling/kitchen-sink/proof.test.mjs` passes all nine with no failures or skips.
