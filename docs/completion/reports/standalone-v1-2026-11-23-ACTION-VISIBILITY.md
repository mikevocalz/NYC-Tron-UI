# Intent-based positioning for native actions and inspections

Draft flow correction; new-source hosted execution is NOTRUN. Existing proofs retain their own source identities and are not relabeled.

## Comparative native evidence

Current6291/e6ac iOS artifact14806682916/run45148329688 passed its direct flow268.821seconds but failed root135.522seconds. Root sequence44 fully-visible Editor seek completed; sequence45 tap completed; sequence46 result seek completed; sequence47 expected Selected:editor failed. The failure AX/PNG actually shows Selected:library and Editor selected:false. No passing combined iOS receipt was emitted.

| Case | Resolved native Editor frame | Native tap | Result |
| --- | --- | --- | --- |
|6291 direct|[38,379][245,423]|141,401|full flow SUCCESS|
|b58b root|[38,614][245,658]|141,636|full flow SUCCESS157.186s|
|6291 root|[38,627][245,671]|141,649|selection assertion failed|

The root tap was resolved from stabilized native hierarchy at10:03:40.147 and dispatched at10:03:42.798. The failure ancestry includes two[0,0][382,644] views inside the device's466x678 window. Thus the failed resolved point lies5logical points below those observed ancestor bottoms, while the successful b58b root point is8points above. The failure snapshot is after result seeking, not a retained pre-tap parent snapshot; anonymous AX ancestors do not identify the particular ScrollView class or safe-area owner. This supports a viewport-boundary hypothesis without proving it or proving a React handler defect. No screenshot coordinates were used for actions.

The native stream records matching Recap down1/up1 and application window event dispatch. Sender teardown occurs after up with contacts[], so it is not evidence of a lost touching contact. No retry, optional tap or assertion suppression is justified or introduced. The comparative assessment is preserved in the lead's evidence handoff.

Earlier29cb/0c8488 genuine full iOS direct269.385s/root153.992s proof used centered actions and noncentered shell inspections. Later full-visibility-only policy removed inspection centering failures, but left this observed edge-positioned action case. Neither historical result is reused as new-source proof.

## Generic policy

Both helper types still require explicit visibilityPercentage:100. An intent-based seek-and-tap helper couples centerElement:true to the immediately following tap using the same selector. Seven action seeks per mode use it: primary button, editable field, Editor item, rail collapse, shell edge, RTL toggle and final shell edge. All23 inspection seeks remain centerElement:false. There is no per-target exception inside the helpers, coordinate selection, app/view sizing change, or retry/time-cap widening.

This distinguishes positioning needed to safely attempt an interaction from inspection acceptance. Inspections no longer spend their budget on optional centering; action seeking avoids intentionally leaving a target at a device-grid boundary. Exact state/value assertions still decide whether each action succeeded. The new policy is supported by the comparative evidence but remains subject to actual hosted validation.

## Preservation, tests and review

Node --test tooling/kitchen-sink/*.test.mjs passed83tests, zero failures/skips, with no test-count inflation. Existing mode-specific regression checks require exactly30seeks, seven immediately followed by same-selector taps with centering true and23inspection seeks false; every seek retains100percent visibility and30000ms. Unique selectors, direction/order, keyboard-gone check, all27assertVisible blocks, disabled/selected/value and left/right geometry checks remain.

Actual before/after generation comparison verified every27-block assertion multiset byte-identical per mode, and the entire generated YAML byte-identical after removing only centerElement lines. Thus only seven centering values change in the executed flow. Tool pins, startup settings/caps, both import modes, final screenshots and candidate provenance are untouched. No fixture/API/window/native change, publication, rerun or local device action.

Mandatory standalone engineering review dimensions applied: internal helper intent clarifies maintenance, no new execution surface, all existing operations remain bounded, and acceptance is preserved independently of positioning. Independent review and fresh both-platform/both-mode CI are required. Owner confirmation and release publication remain separate.
