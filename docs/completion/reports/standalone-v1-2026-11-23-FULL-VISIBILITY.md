# Uniform full-visibility native scrolling

Draft flow policy correction. New-source hosted both-platform/both-import execution is NOTRUN. The complete29cb proof remains genuine evidence for its own0c8488 source and unchanged bytes; it is historical evidence relative to this follow-up and is not relabeled as a new-source pass.

## Observed class of failures

The latest unchanged0510 iOS retry job137581762458/run45137553709 produced artifact14804495133 created2026-11-23T09:14:42Z. Pinned version passed25.098seconds and target preparation passed. Direct JUnit ERROR299.301seconds stopped at sequence46 (the47th raw command), DOWN scroll of rail-result with centerElement:true. It ran09:12:55.988–09:13:35.894UTC,39.906seconds. The log reported visibility1.0 at[37,503][345,527]; after continued swipes the failure tree/PNG showed Selected:editor fully visible at[37,113][345,137], and Editor selected:true. The subsequent result assertion did not run, so these are native observations rather than a passing acceptance claim. Root mode did not run and no eligible receipt was emitted.

Earlier a99c/d706 attempts similarly timed out centering shell-result while logs reported visibility1.0 and screenshots showed correct physical-edge/RTL state. Per-target exceptions removed one instance but left the same optional positioning requirement on other targets. This follow-up removes that class of requirement uniformly instead of adding another selector exception.

The retained Android1185 failure tree, from before universal centering, already recorded Editor selected:true while the Selected:editor result assertion was not visible. The earlier ee6 flow sought a rail container before tapping an ambiguous Editor selector; cf340 attempted a child relation absent from flattened accessibility. Actual corrections were seeking the accessible item/result and giving Editor an anchored unique selector, not a demonstrated requirement to center every element. Those unique targets and result-seeking steps remain unchanged. No claim is made that the early Android runs passed.

[Pinned Orchestra.scrollUntilVisible](https://github.com/mobile-dev-inc/Maestro/blob/67d8a677029261fa424a45a10d08eacd6aa0deed/maestro-orchestra/src/main/java/maestro/orchestra/Orchestra.kt#L795) checks viewport visibility and may attempt optional centering before returning on the configured visibility threshold. The slow centering attempts exhausted the same30second budget despite full visibility. Universal explicit100percent visibility without centering uses the same acceptance threshold directly. It does not make a partially visible or missing target acceptable.

## Concrete policy and preservation

Both ID and anchored rail-text scroll helpers now emit visibilityPercentage:100 and centerElement:false. The internal third centering argument and all special-case calls are removed. Every target follows the same policy. Existing center:true tests represented our positioning assumptions, not user acceptance requirements; tests now enforce strict100/false for every generated scroll.

Selectors, directions,30second scroll deadlines, all tap/input/order steps, all27assertVisible blocks per mode, blocking keyboard disappearance, disabled/selected/value checks, physical left/right relationships, final screenshots, candidate provenance, tool pins, startup budgets and strict version checks are unchanged. There is no optional step, timeout/retry widening, fixture/API/window/native change, local device action or publication.

Validation: node --test tooling/kitchen-sink/*.test.mjs passed83tests, zero failures/skips; no test-count inflation. Existing mode-specific regressions now enforce the uniform policy for both helper types and retain unique rail targets, traversal order, keyboard dismissal and geometry/state checks. Generated before/after comparison verified all27assertVisible blocks byte-identical in each mode. The entire generated flow is byte-identical after removing only centerElement/visibilityPercentage lines, proving selector/direction/deadline/action/acceptance ordering preservation.

Applied mandatory standalone engineering review dimensions: no new execution surface, bounded existing operations, simpler internal policy without per-target switches, and explicit100percent visibility guarded by tests. Independent review and fresh actual hosted both-platform/both-mode proof are required. Owner approval and release publication remain separate.
