# Workspace preset rapid rename data loss

The gesture-handler 3.3 browser job in [run 45109470669](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/45109470669/job/137478271317) failed the rapid preset rename assertion. Its error context shows the actual saved preset was `apid workspace name`, losing the initial `R`. This was data loss, not only a failure to restore focus. The existing installed-tarball check was separate from this browser failure.

React Native Web 0.21.4 schedules `hostNode.select()` with a zero-delay timer for selectTextOnFocus; its source notes Safari requires the deferral. If that timer runs after the first character is entered, it selects that new character. The next keystroke replaces it. The switcher's Zustand draft was reading the current text correctly, so it committed the already-corrupted input.

WorkspacePresetSwitcher now owns the web selection timer through refs. It preserves deferred initial selection, cancels it on text changes and blur, clears pending selection during scope change/unmount, and checks the current boundary/dialog session/input ref before selecting. Native platforms retain their existing selectTextOnFocus behavior. No public props, state architecture, native configuration or window contracts change.

The original rapid-input browser test is unchanged. A new deterministic regression pauses the browser clock, verifies idle focus selects the existing name, clears/refocuses the field, types `R`, advances the pending timer by one millisecond and types the remaining characters. Against the original product it failed with exactly `apid workspace name`. Against the fix it retains the complete name, commits exactly one intended rename and restores trigger focus. The controlled interleaving exposes the race without adding waits or retries to the original test.

## Verification

- Built core and UI with the pinned workspace compiler. Fixed UI build passed with gesture-handler 3.3.0.
- Built original and fixed product in the same isolated dependency environment: all 624 UI declaration files remained byte-identical. The complete scoped UI declaration graph JSON also remained byte-identical, SHA256 `b9d8c4786d03041995cb0d48088da3315a9308f239532ed88a156aaf5ec7ffdc`. No snapshot update or API checker change was needed.
- All seven workspace-continuity browser tests passed with isolated gesture-handler 3.3.0, React Native Web 0.21.4 and Playwright 1.62.1 in installed Chromium, including the unchanged rapid-input case and new forced-interleaving regression. An earlier fixed-product run also passed all seven with gesture-handler 3.5.0; shared dependencies were not overwritten.
- The final combined shell-command/workspace-continuity browser run passed all 15 tests with gesture-handler 3.3.0 (12.2 seconds), with zero failures/skips.
- All 25 studio-shell, workspace-identity and shell-command unit/source tests passed.

The broader CI browser matrix and installed-tarball lane must report their own results. Safari and native runtime behavior were not exercised locally; retaining Safari's deferred selection and the native prop is a source-level preservation claim. Independent review is required before publishing the follow-up.
