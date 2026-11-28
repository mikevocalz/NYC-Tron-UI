# Independent review: T5 library documentation

Reviewer: `tron_gate`, 2026-11-23 UTC. Implementation owned by `tron_docs`; this reviewer did not write the documentation application. Reviewed against technical base `26742419a77dab1bc58704c238e9982b6e107069` using the exact standalone engineering code-review and design accessibility-review skills.

Scope: website source/build/generator/compiler host/tests/verification, clean Expo consumer tooling, documentation workflow, generated documentation map, nine guides, README, contributing/versioning/distribution policies and Unreleased changelog text.

## Findings sent to the writer

1. **P2 — owner status is hardcoded rather than derived.** `website/src/App.tsx` always displays “Owner confirmation pending”; its catalog/home notices always describe proposals. `website/tests/catalog.test.mjs` hardcodes null labels and pending confirmation, and the route test expects pending text. Legitimate later owner confirmation through T3 would therefore mislabel the site or fail docs CI. Derive these labels from the manifest and compare tests against actual manifest values. Current pending output must stay pending.
2. **P2 — substring import assertion can borrow another alias route.** `website/tests/browser/docs.spec.mjs` uses `toContainText(c.importPath)`. A direct path contains its package root, and same-symbol navigation can satisfy this assertion while the previous route remains rendered. Require the exact import statement and component identity before counting each route. Also assert the actual stable/preview/proposal badge for every route.
3. **Required handoff evidence pending at initial review.** The T5 skill-output report, including actual per-template Mobbin reference links/patterns and accessibility/design/copy outputs required by brief §4, was not yet present when this review began. Requested the completed report before freeze. Older T1/T2 outputs do not establish work on these new templates.

Cross-slice observation sent separately to the lead: T3’s current raw-HTML preview-label check cannot inspect labels mounted by this SPA. The actual browser route/label verification, bound data and app bundle must back that check. Do not weaken preview-label requirements or insert fake approval to bypass it.

## Independently executed checks

`npm --prefix website test`: exit 0, 3 tests passed, zero failures/skips. Covers complete 478-ID route mapping, generated inherited/callable props and guide/proposal separation.

`node tooling/library-docs.mjs --check-examples`: exit 0, 478 declaration-graph examples checked, zero errors; 49,209 declared/inherited property rows and nine guides generated. This is a source/declaration check, not 478 native mounts or widget interaction tests.

Independently recomputed every artifact SHA256 in the current `website/generated/verification.json`: all 23 matched actual bytes. Checked the four per-component SHA fields and manifest fingerprint construction. Browser verification is scoped to shared documentation templates, with eight automated AA route/width scans, rather than certification of every widget.

## Correctness, API and accessibility observations

The docs host imports real library semantic primitives and RN Web controls. Its private className adapter preserves actual controls/events/refs; app styling stays in this private host. The only raw HTML is the static document bootstrap. React state is Zustand; native resources and bindings remain in refs. No library exports, public prop types, native manifests, windows or XR configuration change.

The Windows examples create real Windows navigation/window bindings and explicitly name the required RNW Fabric host. Drag/drop does not substitute a fake host-shaped object. WindowTitleBar uses the real in-page host and names that geometry limit. Generic declaration-derived examples retain application-data/runtime limitations. These examples have not been independently mounted on native hosts by this reviewer.

The copied Button installation example is exact and uses published core/UI tarball URLs; the clean-consumer workflow builds a fresh Expo application and checks the copied example in actual Chromium. Its proof remains distinct from native acceptance and the new candidate’s archive evidence. No distribution approval or final stability label is claimed.

The automated accessibility scope is correctly limited. Source has semantic landmarks/headings, labeled search, focus/skip links, a keyboard-focusable scrollable props table, reduced-motion styles and responsive state retention. Text/control colors and final border correction require the final browser/contrast rerun. Native screen-reader speech, physical devices, 200% zoom, complete keyboard traversal and all per-widget accessibility behavior are not established by the current five browser tests.

Initial disposition: request the two source/test corrections and required skill-output attachment, then verify the final frozen receipt before approval.

## Final re-review: corrections verified

Final disposition: **approve this documentation change for draft review**, with no remaining blocking findings. This is a code/evidence review, not merge permission, owner stability confirmation, distribution approval or native acceptance.

All three initial findings are addressed. Owner/proposal badges now derive from the actual manifest. The confirmed guide branch is a pure function with a synthetic confirmed-manifest regression; its initial self-reference error was corrected. The browser route loop checks exact import statements, exact component IDs and actual visible labels before writing the complete route-results artifact. The new T5 report attaches the required research/design/copy/critique/accessibility/handoff outputs and per-template Mobbin references. Research assumptions and automated accessibility limits are explicit.

Independently reran the final `npm --prefix website test`: 4 passed, 0 failed, 0 skipped, including the future confirmed-guide branch without modifying real owner records. Independently checked all 28 final receipt artifact byte hashes, all 478 components' four page/data/source/example byte bindings, exact executed route/import/symbol/label/owner records, and the bound browser result's 5 expected, 0 unexpected, 0 skipped, 0 flaky tests. All passed. The actual new receipt is compatible with the strict gate: 478 executed routes, zero documentation issues among the ten proposed stable import targets; overall release readiness remains blocked by pending owner confirmation and dirty preparation source.

Also independently tested the declaration checker with invalid Button title and inherited native TextField value types: both were rejected with TypeScript diagnostic 2322. The positive 478-example run therefore does not merely accept these props as unconstrained values. Recomputed reference white-background contrast: primary 7.02:1, muted text 6.31:1, control border 3.70:1, matching the report.

The final full 478-route browser suite was run by the writer after fixes, and its exact sources/results are checksum-bound and independently verified. This reviewer did not repeat that entire browser suite after the final freeze; focused corrected-branch tests and complete generated-proof checks cover the material review changes. Native runtime and fresh remote Expo installation remain separate unrun claims here.

The portable exact source and generated evidence hash manifest is `tron-docs-source-freeze.json` (repository-relative file paths, base commit and final verification receipt identity). Preserve these bytes when publishing this reviewed draft.
