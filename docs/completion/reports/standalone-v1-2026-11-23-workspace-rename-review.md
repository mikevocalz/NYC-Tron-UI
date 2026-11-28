# Independent review: workspace preset rapid rename

Reviewer: `tron_gate`. Base: `4076da6ddde38e1d3c9bf55f73857bac609e6ffe`. Applied the exact standalone engineering code-review procedure. Implementation owned by `tron_docs`; this reviewer did not write the fix or regression.

Disposition: **approve for the reviewed follow-up draft; no blocking findings**. No merge, release, native runtime or owner approval is inferred.

## Failure and correction

Independently inspected the actual failed gesture-handler 3.3 CI artifact from run 45109470669/job 137478271317. Its saved state contains `apid workspace name`, confirming loss of the leading character rather than a focus-only failure. RN Web 0.21.4's actual TextInput source schedules selectTextOnFocus with setTimeout(0). A selection after the first typed character lets the next character replace it; the component then correctly commits the already-corrupted controlled value.

The fix owns that deferred web selection through refs and cancels it as soon as typing or blur occurs. Callback checks bind it to the live boundary, dialog session and input ref. Scope cleanup/unmount cancels pending selection. Idle focus still selects the existing name; the native selectTextOnFocus prop remains true. This preserves the reason for Safari's deferred path without claiming a Safari test. Session/document/revision guards and focus restoration remain intact. State remains in Zustand; timers and input handles remain refs. No new public API, styling recipe, native configuration or window contract changes.

The original six browser cases, including rapid sequential typing plus Enter, are byte-for-byte unchanged. Exactly one deterministic browser case is appended. It verifies idle selection, pauses the real browser timer, types the first character before the pending selection, advances the clock and types the remainder. It asserts the full value, one exact intended rename event and restored trigger focus. This exposes the product race without adding delays, retries or weaker assertions to the failing test.

## Independent verification

- Actual fixed gesture-handler **3.3.0**, RN Web **0.21.4**, Playwright **1.62.1**, installed Chrome: all **7** workspace-continuity browser tests passed, 0 failed/skipped (7.0s).
- Original rapid test and deterministic timer test each repeated **10** times against the final fixed build: **20 passed**, 0 failed/skipped (10.0s).
- `node --experimental-strip-types --test packages/ui/tests/studio-shell.test.mjs packages/ui/tests/workspace-identity.test.mjs`: **18 passed**, 0 failed/skipped.
- Independently compared the before/after full scoped public API JSON: byte-identical, SHA256 `b9d8c4786d03041995cb0d48088da3315a9308f239532ed88a156aaf5ec7ffdc`. Public imports/props/type source preceding the component implementation is byte-identical with the base. The writer additionally recorded all 624 UI declaration files byte-identical under the same compiler/environment; no API snapshot update was needed.
- `git diff --check` passed. The reviewed patch changes one component implementation, appends one browser regression and adds its factual report/API proof.

An independent original-product run of the unmodified rapid test passed 20 times under gesture-handler 3.5.0; that demonstrates the intermittent timing and is not claimed as reproduction of the failing 3.3 lane. The writer's deterministic original-product run failed with exactly `apid workspace name`, matching the independently inspected CI failure. Its recorded 25 related unit/source tests and 15 combined browser cases are inspected writer evidence, not additional independent runs by this reviewer.

The broad hosted browser matrix and installed-tarball lane require their own retries. Safari, physical devices, native runtime and manual screen-reader behavior were not exercised in this review. The exact reviewed source/report/API-proof hashes are attached in `tron-workspace-rename-review-freeze.json`.
