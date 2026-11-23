# Installed archive Android walkthrough

Applied argent-device-interact, argent-qa-e2e and argent-create-e2e. The first walkthrough was recorded before first launch. Its final test is `.argent/e2e/qa-tron-android-imports-state.yaml`. The lead recorded and checked it independently of the kitchen writer.

The adjacent android-first-recording.yaml retains the unpolished recorder output. Its scrolling transport coordinates were replaced by goal-based scroll-to selectors in the final test; its successful live waits were converted without weakening their meaning.

Actual ARM64 API36 emulator build: 331 tasks, BUILD SUCCESSFUL in 8m35s. APK SHA256: `d1e055b6586a22efd8881690cac57e3ba72fd5d5fcee06c6c034911e5a67091c`. Installed using Argent reinstall-app. No physical phone was used.

| Contract | Executed assertion |
| --- | --- |
| Fresh in-memory baseline | direct imports, counter zero |
| Enabled action | counter becomes one |
| Actual root import switch | root imports selected; counter remains one |
| Light theme selection | appearance marker becomes light |
| Card surfaces mount | Raised, Sunken, Transparent visible |
| TextField mounts | field-editable visible |
| NavigationRail mounts | Selected: library |
| NavigationShell mounts | Physical edge: right; text: LTR |

The only process navigation is launch; alias-result supplies identity and idle supplies readiness, followed by explicit import and counter checks. Other movement scrolls within the same screen using goal-based selectors. Every tap uses recorded stable text, and there are no raw coordinates, fixed sleeps or stored device IDs. Restart resets the demo's non-persisted Zustand state, so repeated runs need no manual cleanup.

After polishing only recorded behavior, recycled Argent services scoped to the emulator before pass 1. The same unchanged test then passed twice with e2e-execute: 24 passed, zero failed/errored/skipped, 27.1s then 23.5s. Full logs are the adjacent android-pass1.txt and android-pass2.txt. Reproduce with `argent e2e run qa-tron-android-imports-state --platform android --device <emulator serial>` after installing this app.

Both runs report an idle warning about a small animated region. Direct inspection identifies the intentionally always-loading Button fixture, not an app data loader. Stable alias/import/count checks gate the next action; no result relies on idle as acceptance evidence. No snapshots or baseline updates were used. Screenshots supplied human inspection only.

This local consumer was built from dirty-source rc.2-version development archives: core SHA256 `0739fdc157461de8bb080471e61a46a4ffaf73b383ebca6a11a3cf67a08f7744`, UI SHA256 `9426aa7954afe3ad19f5c66280a8ed98162a9acbca9d6721dbd64e42cc9ec869`. It is not release-eligible and cannot authorize rc.3. This focused path does not prove all states through both import modes, native screen-reader speech, iOS, or the clean-runner native collector. Those remain separate gates. No acceptance or owner approval changed.
