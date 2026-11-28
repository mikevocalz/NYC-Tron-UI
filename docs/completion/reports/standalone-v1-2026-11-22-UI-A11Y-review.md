# Independent review: basic control accessibility

Reviewed 2026-11-23 UTC against T4 base `0cdebcb7358598f296e043f8ffa5c1ee62c0545e` in the isolated UI fix checkout. Applied the standalone engineering code-review skill. Scope: three source files, the browser regression suite and fixture, and the verification report.

Disposition: no blocking findings in the reviewed change. The explicit React Native ARIA aliases repair RN Web state forwarding while retaining native accessibilityState, disabled behavior, public exports and public prop declarations. TextField guards web-only attributes with Platform.OS; its existing native label/hint properties remain present. The description target follows the error/helper transition and the fixture verifies removal of stale error semantics. State in the fixture uses Zustand.

Independent verification: `node --test packages/ui/tests/contracts.test.mjs` exited 0: 16 passed, 0 failed, 0 skipped. Inspected the three real DOM regressions: loading/busy/disabled plus Enter activation; tab selection transition and disabled destination; invalid-to-helper accessible description transition and readonly disabled input. Independently reran the identical source and updated regression files through the existing browser harness: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=<Chrome executable> UI_ACCEPTANCE_PORT=4192 ./node_modules/.bin/playwright test basic-accessibility.spec.mjs` exited 0, 3 passed (3.1s). Package builds remain inspected writer evidence. Native build and screen-reader speech are not established by this focused review.

The writer added the requested decorative icon fixture and aria-hidden assertion before the independent browser rerun; that check also passed. No outstanding findings.

No acceptance, owner labels, distribution record, configuration or public API was changed by this review.

## Independently reviewed derived-map follow-up

Compared the current Qt JSON semantically to reviewed commit `4e2e609787f54c408c7f183b798dabf59b2aee65`. Exactly three arrays gain `Platform`: component 131's sourceAudit and its qnx/marathon target React Native export lists. No classification, count, acceptance, requirement, other component or API field changes. This records the real TextField Platform import and does not claim Qt runtime validation. The report's appended follow-up states that boundary correctly.

Independently ran `node --test tooling/tests/qt-component-coverage.test.mjs packages/ui/tests/contracts.test.mjs`: 26 passed, 0 failed, 0 skipped. No blocking findings. The follow-up publication must preserve the reviewed source and prior report/review content; include only the three JSON additions and the appended verification text.
