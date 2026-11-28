# Independent review: native target visibility and physical marker

Reviewer `tron_gate`; implementation `tron_docs`; base `11851638d2327dc08db1b154b70dd7684798f977`. Applied the exact standalone engineering code-review procedure. Verdict: **approve the scoped flow follow-up for draft review; no blocking findings**. Actual native execution remains the hosted retry's responsibility.

Independently inspected the failed step-043 hierarchy and JUnit report. Editor is selected=true at [38,595][245,616], while rail-result is not exposed in the visible tree. The preceding exact action succeeded; its clipped edge frame did not establish visibility of the next result. Hierarchy SHA256 is `11193c1d2bf265ffe31b84b0f0554c3b7ec8d4fd6799d15380bfe1d8aec461e3`.

Both scroll helpers now request centerElement=true without lowering visibility percentage or changing timeouts. The flow explicitly seeks rail-result before each output assertion and seeks Editor upward again before checking its selected state. It does not substitute scroll success for those assertions or infer state from a previous target. Independently verified the Boolean parameter in the [pinned Maestro 2.12.1 YAML source](https://github.com/mobile-dev-inc/Maestro/blob/cli-2.12.1/maestro-orchestra/src/main/java/maestro/orchestra/yaml/YamlScrollUntilVisible.kt). This requests supported movement away from the edge, not a guarantee that every target can be perfectly centered.

The physical-edge assertions use unique anchored ^Shell Editor$ relative to the unchanged shell-draft field. That is a real accessible action in the collapsed shell, rather than the missing wrapper ID or a React ancestry assumption. The preceding atomic naming change distinguishes it from main Editor. The actual selected control must lie on the required side of the retained field, preserving the physical left/right intent under RTL. No coordinates, invented node, viewport increase or app layout change is introduced.

Independent validation:

- `node --test tooling/kitchen-sink/native-flow.test.mjs tooling/kitchen-sink/proof.test.mjs`: **11 passed**, zero failures/skips.
- Generated baseline and updated direct/root flows. After normalizing only the physical marker substitution, **all 27 semantic assertions and every non-scroll command are byte-identical and in the same order**. Every generated scroll retains its existing timeout and requests centering. Added seeks establish each distinct target's visibility; no state, draft, disabled, edge or RTL assertion is removed.
- App fixture geometry, app.json, required workflows, native collector, public rail/shell implementation and owner record remain byte-identical with the base. `git diff --check` passed.

The writer's complete forty kitchen tests are inspected evidence, not an additional independent run. No Android/iOS runtime success, screen-reader behavior, acceptance status, source cleanliness or release eligibility is inferred. The current-source native CI run must supply actual direct/root execution, strict JUnit and fresh capture receipts. Exact reviewed source/test/report and patch hashes are in `tron-native-centered-scroll-review-freeze.json`.
