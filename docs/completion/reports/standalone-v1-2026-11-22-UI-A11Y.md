# Basic controls: React Native Web accessibility correction

Prepared 2026-11-23 UTC by `argent_environment_inspector` during the T5
installed-archive kitchen-sink check. Independent reviewer: `tron_gate`.
The [independent review](standalone-v1-2026-11-22-UI-A11Y-review.md) passed,
including the rendered decorative-icon check. The lead records the resulting
commit and draft PR. No public export or prop type changes.

## Reproduced failure

The initial installed `@nyc-tron/ui` archive rendered through Expo 58 and
React Native Web 0.21.4. The browser check failed because the loading button's
`aria-busy` attribute was absent. Direct DOM inspection also showed tab
selection absent from `NavigationRail`, and TextField helper/error text had no
description association. The legacy `accessibilityState` fields remain useful
for native hosts but are not forwarded by this RN Web version.

## Correction

- Button supplies explicit `aria-busy` and `aria-disabled` alongside its
  unchanged native accessibility state.
- NavigationRail supplies explicit tab selection/disabled attributes and
  marks decorative icon content hidden from assistive technology.
- TextField supplies the corresponding disabled attribute. On web only, it
  connects its existing helper/error text through `aria-describedby` and
  marks invalid input. Description nodes share a stable `nativeID` across
  error/helper transitions, so a cleared error does not leave a stale reference.

React Native 0.88.1's installed `ViewAccessibility` declarations support the
busy, selected, disabled and hidden ARIA aliases. Web-only description/invalid
attributes are guarded by `Platform.OS`, preserving native prop behavior.
No Swift, Kotlin, C++, manifest, peer-range or package-export change is made.

## Actual verification

```text
$ pnpm --filter @nyc-tron/core --filter @nyc-tron/ui build
[both TypeScript builds exited 0]

$ node --test packages/ui/tests/contracts.test.mjs
tests 16
pass 16
fail 0

$ UI_ACCEPTANCE_PORT=4192 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=<Chrome executable> \
    playwright test basic-accessibility.spec.mjs
loading state is exposed to the DOM and the action remains disabled until ready: passed
rail selection and disabled destinations have real DOM states: passed
field error and helper descriptions are associated without stale error state: passed
3 passed (3.9s)
```

The browser run used the existing RN Web harness and its class-preserving
styling shim, not a mocked accessibility-state mapping. The regression checks
actual DOM attributes, accessible descriptions, disabled behavior, a real Enter
press and state transitions. The browser executable path is omitted from the
published transcript; the exact test suite and viewport server port are shown.

The revised archive was repacked and installed into a new standalone Expo
consumer before further kitchen-sink proof. Archive digests and platform
results belong to that receipt, rather than this source-level report.

## Skills and limits

Applied `react-native-best-practices` to keep the platform-specific adaptation
inside existing shared components and preserve their public APIs. Applied
`accessibility-review` to name the reproduced 4.1.2 state and 3.3.2
label/description failures and verify their rendered repair. Project
foldable-layout and `no-ai-slop` contracts preserve navigation, state, windows,
theme ownership and precise evidence wording. This report is their output.

This is a focused accessibility correction, not a full WCAG AA certification.
Native compilation, native screen-reader speech, keyboard arrow-pattern
completeness and physical-device input are not established by these three
browser tests. The full kitchen-sink suite and CI retain their own gates.

### Derived Qt map follow-up

The hosted source check found the historical Qt import inventory stale after the
TextField fix added React Native's `Platform` import. Regenerating with
`node tooling/qt-component-coverage.mjs --write` changes only three `Platform`
entries in `docs/qt/component-coverage.json`. No classifications, runtime
acceptance, counts, Markdown report or public API changed. The three UI source
files remain byte-for-byte unchanged from the reviewed accessibility fix.

Validation: `node --test tooling/tests/qt-component-coverage.test.mjs
packages/ui/tests/contracts.test.mjs` passed all 26 checks (10 Qt inventory and
16 component contracts), with zero failures or skips.
