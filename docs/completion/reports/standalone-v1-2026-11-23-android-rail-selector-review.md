# Independent review: rail identity after native accessibility flattening

Reviewer `tron_gate`; implementation `tron_docs`; base `900d8ca3ff4f0c111f1b3b1c75879beadb584597`. Applied the exact standalone engineering code-review and accessibility-review procedures. Verdict: **approve this atomic fixture/selector/proof follow-up for draft review; no blocking findings**. Current native execution is not established by this review.

## Actual failure and corrected identity contract

Independently inspected the failed cf340 hierarchy and JUnit report. The native scroll fails on Editor childOf rail-demo. The exposed Shell Editor/Unavailable nodes are under generic containers alongside shell-rail rather than beneath that rail. React source ancestry was insufficient to establish the native accessibility relationship. Hierarchy SHA256 is `ae4f6a26c2e97458aa15e91194bb107e306aa421cf6aa10fd4e087b0bf59a01d`. The earlier flow review explicitly left native behavior for CI; this actual failure supersedes that relationship assumption without rewriting past evidence.

The main fixture retains Library, Editor and Unavailable. Only the collapsed shell gets contextual accessible names Shell Library, Shell Editor and Shell Unavailable. Its visual labels were already hidden; icons, item IDs, callbacks, selected state and disabled flags remain intact. This helps distinguish the two demonstrations for assistive technology rather than adding a public component prop or test-only library API. The old collapsed shell's accessibilityText already came from that same explicit label property, so the change does not depend on a new parent-tree assumption.

The native targets are now anchored `^Editor$` and `^Unavailable$`. The flow still scrolls the actual item before interacting/asserting. These patterns cannot accept the prefixed shell or explanatory paragraph, even when accessibility nodes are flattened. No coordinates, spatial guess, viewport increase, optional step or weaker state assertion is used.

**Keep all six files atomic.** Anchored flow selectors alone on the old duplicated fixture names would not prove target identity. The app naming and flow changes are one correctness fix; the web proof guards global uniqueness and the intended shell context.

## Actual independent checks

- `node --test tooling/kitchen-sink/native-flow.test.mjs tooling/kitchen-sink/proof.test.mjs`: **11 passed**, zero failures/skips, including both import-mode selectors and strict native collector rejection cases.
- Generated original and updated flows and normalized only the replaced identity filters: **all 27 native assertions in each mode and every other command remain in the same order**.
- Ran the complete updated web collector against the task-owned development export: **124 assertions passed**, zero failed/skipped; four appearance/import axe cases had zero violations. Checks include each main/Shell action's exact global uniqueness, shell membership while collapsed, selection/disabled state and all existing layout/retained-state checks.
- Independently verified the exported fixture equals the reviewed fixture bytes, the executed driver SHA equals the frozen source, and every result/log/screenshot artifact hash matches.
- Workflows, native collector, public rail implementation, app window config and owner records remain byte-identical with the base. `git diff --check` passed.

The development export deliberately retains its original installed library commit `f0dd6ddf6358391ae5a358155c9497c0b92d66ab` and `sourceDirty: true`. The development summary explicitly says `eligibleForCandidateAcceptance: false`. These results demonstrate the app/selector contract using unchanged installed libraries; they are **not current-candidate release receipts**. No source identity was rewritten to fabricate provenance.

The writer's broader 35 kitchen checks, consumer TypeScript and separate 32 development checks are inspected evidence, not extra independent runs here. The lead owns the actual Android retry; current-source direct/root native runs must produce their own strict receipts. No native pass, manual speech, owner approval, release eligibility or publication is inferred. Exact reviewed files/patch and independent receipt hash are in `tron-android-rail-selector-review-freeze.json`.
