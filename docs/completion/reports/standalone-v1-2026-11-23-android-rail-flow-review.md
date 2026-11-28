# Independent review: native rail target scrolling

Reviewer `tron_gate`; implementation `tron_docs`; base `f0dd6ddf6358391ae5a358155c9497c0b92d66ab`. Applied the exact standalone engineering code-review procedure. Verdict: **approve the scoped flow repair for draft review; no blocking findings in this slice**. Native execution remains unverified until the hosted retry.

Independently inspected the actual Android failure report and hierarchy. The failing command cannot find Editor; rail-demo occupies [37,615][245,616], a one-pixel clipped container with no exposed Editor/Unavailable children. A successful container visibility check therefore does not prove the action is available. Hierarchy bytes independently hash to `06ff6538e413a2e9eb43777626e3ec7fc1fb2b92d0a57fe7e732b8ed016f68a3`.

The fix scrolls to the actual Editor item before tapping it and to Unavailable before asserting disabled state. Every item selector is scoped to childOf rail-demo, including tap/selected/disabled checks. That prevents the later shell rail, which reuses the names and selected store, from supplying another component's proof. Independently verified childOf in the [pinned Maestro 2.12.1 selector source](https://github.com/mobile-dev-inc/Maestro/blob/cli-2.12.1/maestro-orchestra/src/main/java/maestro/orchestra/yaml/YamlElementSelector.kt); the [official reference](https://docs.maestro.dev/reference/selectors/relational-selectors) defines direct-parent matching. NavigationRail's Pressable tabs are direct children of its test-ID View in the actual component source.

Independent verification:

- `node --test tooling/kitchen-sink/native-flow.test.mjs tooling/kitchen-sink/proof.test.mjs`: **11 passed**, zero failures/skips, including both flow modes and strict collector rejection cases.
- Generated both original and fixed flows, normalized only the new scoping/scroll substitutions and compared them: all **27 assertVisible steps per mode** are retained in exact order; the full flow differs only by intended target scrolling/scoping and the new Unavailable scroll.
- Workflows, native collector, public NavigationRail implementation and both owner records are byte-identical to the base. No required gate, timeout, clear-state launch, source/candidate/receipt binding or native assertion is removed. No coordinates, viewport increase, optional action or visibility relaxation is introduced.
- `git diff --check` passed. The writer's broader 28 kitchen checks are inspected evidence, not a second independent run.

Separate P2 finding accepted by the lead: the phone fixture's 208px rail plus gap inside a 246px card leaves a 22px result column. That is a responsive readability/layout defect, independent of the clipped-container stop. A separate app-only layout slice is being fixed and reviewed; this flow approval does not approve that work or pretend it passed on-device. Keep all assertions and original window/orientation contracts while integrating both slices.

No device interaction or new native pass receipt was produced by this reviewer. The actual Android/iOS CI reruns must establish execution and parent-child hierarchy behavior on their respective hosts. Exact reviewed files and patch identity are in `tron-android-rail-flow-review-freeze.json`.
