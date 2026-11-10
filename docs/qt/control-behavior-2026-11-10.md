# Qt control behavior continuation

This continues PR #58 after the initial import and bundle work. It replaces
the unavailable Tooltip target, fixes desktop control handlers and records
the source checks separately from Qt/Fabric and device acceptance.

The subsequent [browser pointer follow-up](pointer-ci-followup-2026-11-10.md)
records the narrow-screen CI failure and its focused adapter correction.

## Implemented behavior

The QNX and Marathon Tooltip entries use React Native View/Text, native
`measureInWindow` and reactive window dimensions. Hover, keyboard focus or a
stationary touch starts the configured delay. The measured body flips above
the anchor and clamps to window edges when needed. It takes neither focus nor
pointer input. Escape, leaving the active input, touch movement, disable,
resize and unmount cancel pending work. Late measurement callbacks cannot
reopen a dismissed tooltip. The child retains its original handlers and gets
the full text appended to its accessibility hint. App semantic tokens remain
the appearance owner. Ancestor clipping still constrains this in-tree surface.

Select now attaches its existing keyboard model on QNX and Marathon. Queued
key events read current state, disabled choices are skipped, and Enter/Space
commit once. A following keyup press cannot reopen the list. Its pointer
options leave keyboard focus on the trigger.

Action and command menus handle Enter/Space, arrows, Home/End, Tab and Escape
through their existing model and host refs. A settled command cannot dispatch
twice while React is processing dismissal. The split-button menu and context
menu request focus on their own trigger after close. AnchoredPopover leaves
native Tab navigation to the host; its browser DOM query no longer captures
Qt's Tab key. Escape continues to request dismissal.

The accessibility layer handles the Qt adapter's explicit unsupported or
unavailable preference codes independently. Missing reduced-motion data keeps
the app's initial preference, while supported accessibility-client and
high-contrast snapshots/events can still update. Unexpected synchronous errors
release acquired subscriptions and remain visible; unexpected asynchronous Qt
snapshot failures reach the React error boundary. Qt announcements request low
priority without an unsupported native queue. A provider-absence path is not
evidence of delivered speech.

## Checks run

These checks include completion base
`e8a7efb9f0971746d01c68532540c65af502de9f`. The merge retains its keyboard
dismissal and native transport work. Overlapping pointer, native Slider and
AAC priming fixes preserve their behavior; the merged caption assertion also
checks that the duplicate RN label is hidden from accessibility. The strict
decoded-audio timeline guard remains intact.

The frozen RN API profile now pins published commit
`404ad9dab676ce876e8a3e367743111b7d605417`. Its verified PublicAPI hash and all
30 named exports match the consumer source. Regenerated coverage has 282
shared-source candidates, 50 rows requiring additional providers and nine
pinned external providers on each target. Every row retains unverified runtime
acceptance.

| Check | Result | Evidence boundary |
| --- | --- | --- |
| Full JavaScript test discovery | 1,217 passed | Includes 27 target behavior cases and the native Slider label regression. |
| UI and Expo-controls typechecks | Passed | Public type and slot compatibility. |
| Package builds | 13 passed | TypeScript package outputs. |
| Public API | 618 export subpaths; 3,306 declarations | Includes the base's core window-lifecycle export, Tooltip's target route and optional CommandPopover `testID`. |
| Package verification | 618 conditional exports; 752 ESM files | Existing optional-peer isolation remains enforced. |
| Fresh release packs | 13 archives passed | No release was published. |
| QNX packed Metro consumer | 1,893,010 bytes; zero warnings | Actual extracted packages and target resolver. |
| Marathon packed Metro consumer | 1,893,062 bytes; zero warnings | Actual extracted packages and target resolver. |
| Full Qt/Fabric control interaction | Separate host workstream | JavaScript tests do not establish native delivery. |
| Rendered browser overlay suite | Blocked before page startup | The browser process cannot create its local singleton socket in this executor (`Operation not permitted`). |
| Physical QNX/Marathon input and screen-reader output | Not run here | Remains a device acceptance requirement. |

The bundle receipt is [packed-controls-2026-11-10.json](packed-controls-2026-11-10.json).
It records every selected control file, the exact reviewed RN PublicAPI hash,
archive hashes and bundle hashes. Both targets select `Tooltip.qt.js`, with
no selected Expo mobile provider. The earlier bundle-only receipt remains as
historical evidence for the initial PR revision.

The source tests model RN host refs and event handlers. They cover delayed
tooltip cleanup and positioning, supported/unavailable accessibility services,
selection and menu keyboard behavior, slider steps and drag cancellation,
popover dismissal, split actions and find/replace content. They do not render
Qt, compile app styling, inject real input or claim device acceptance.

## Native input fixture

`tooling/qt-controls-probe.jsx` imports all nine controls from the extracted
public package paths and registers `RNQnxQtControlsProbe`. The consumer runner's
`--render-probe` mode builds its 39 steps for both target resolvers. The RN-QNX
`rnqnx_qt_controls_consumer` driver reads its ordered steps and sends real Qt
mouse, focus and key input. JavaScript calls only change controlled props or
mount the next stage; they never invoke a component's event handler directly.
The fixture exposes the actual public `Platform.OS` as `__qtProbePlatform` for
the driver's `--expected-platform` check and rejects other RN targets. This
target identity is separate from the operating system hosting the Qt process.
It reads the property through `Reflect.get` so Metro cannot replace this
runtime check with a compile-time target literal.

Steps cover tooltip hover/focus/Escape, Select and dropdown selection,
action-menu callbacks, slider bounds/steps, split primary/menu separation,
context actions, popover dismissal and find/replace mounting/dismissal. The
search fixture uses the existing short-document literal provider. Stable
native item IDs guard asynchronous overlay mounting; final state checks retain
the outcomes from earlier stages. Both platform runs are required before this
fixture is recorded as native evidence.

The [prepared fixture receipt](packed-controls-probe-2026-11-10.json) records
both bundle hashes and the fixture/theme source hashes. QNX produces 1,912,103
bytes and Marathon produces 1,912,155 bytes, both with zero resolver warnings.
This receipt records bundling only; native execution remains separate.

`tooling/qt-probe-theme.js` supplies a finite app-owned palette and maps the
fixture's layout/typography tokens into actual RN primitive styles. Explicit
style props win. It replaces no component, renderer, native module, event or
measurement. Native platform-state selectors remain host behavior. This
isolated fixture does not establish complete Uniwind compilation, arbitrary
app themes, high-contrast styling or production app appearance.

```sh
node tooling/qt-component-consumer.mjs /absolute/path/to/new-packs /absolute/path/to/react-native-qnx /absolute/path/to/new-render-consumer --render-probe
```

## Skills and source decisions

| Source | Revision | Decision applied |
| --- | --- | --- |
| NYC-MON foldable layouts | Blob `d60f539b263863027ec7593ffaea38304ad1e5d8` | Existing overlay/region owners and app styling remain authoritative; no navigation changes. |
| NYC-MON no-ai-slop | Blob `e2008aa08d688846b0373b83d7c3d33b85eaabdd` | Separate observed behavior from unrun target checks. |
| Callstack React Native best practices | `59e9d17446a248b21d86f078fcd0bd2d36db1ca4` | Preserve per-control imports and cancel timers/measurements without adding a runtime dependency. |
| Expo native UI and Expo UI | `a9e5bd3fa00b4e61f632e43f85da73aee1942582` | Keep SwiftUI/Compose on their supported hosts; Qt routes use existing RN primitives and explicit native contracts. |
| NYC-Tron native feel contract | `docs/EXACT_NATIVE_FEEL.md` at PR #58 base | Keyboard, disabled state and focus behavior accompany app-owned styling. |

## Reproduction

```sh
node tooling/run-tests.mjs
corepack pnpm --dir packages/ui typecheck
corepack pnpm --dir packages/expo-controls typecheck
corepack pnpm -r --if-present build
node tooling/api-surface.mjs
node tooling/api-signatures.mjs
node tooling/verify-packages.mjs
node tooling/pack-release.mjs /absolute/path/to/new-packs
node tooling/qt-component-consumer.mjs /absolute/path/to/new-packs /absolute/path/to/react-native-qnx /absolute/path/to/new-consumer
```

Rollback can revert the continuation while retaining the initial package
conditions and counterpart map. That restores Tooltip's explicit unavailable
target and the previous shared control behavior; it does not change mobile or
browser package conditions.
