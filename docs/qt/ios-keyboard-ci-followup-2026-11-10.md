# iOS native keyboard acceptance follow-up

## Observed failure

[Native controls run 42840807450](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42840807450),
[iOS job 129916136912](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42840807450/job/129916136912),
ran for PR head `1a7fc0d4fb561913a79ad3377b9a9b9f44201e4c`. The installed
consumer reports checkout revision `a0e5e277032f4a0cd50e62b3ac448b4da09567f3`.
Compilation, pod checks and all eleven strict media decoder checks passed.
The UI runner then stopped in Settings, after entering `Native UI workspace`,
when Maestro's `hideKeyboard` action could not dismiss the iOS keyboard.
Editor and pointer acceptance did not execute in this failed attempt.

Evidence comes from the `native-release-consumer-ios` artifact, ID
`13777641929`. Its downloaded ZIP matched GitHub's SHA-256:

```text
9264bdbeabd3e675a7e0255e680871f0613378b15446805a763de7be19995c64
```

The Settings JUnit report identifies the failed dismissal action. Its failure
screenshot and native hierarchy show the edited field and the actual system
keyboard key with resource ID `Done`, accessibility text `done`, and native
bounds `[300,752][399,806]` on iPhone 17 Pro / iOS 26.5. These observations come
from the executed installed app, not a JavaScript host mock.

## Correction

Both [Settings](../../examples/native-feel/SettingsScreen.tsx) and
[Editor](../../examples/native-feel/EditorInspectorScreen.tsx) already declare
`returnKeyType="done"` and `submitBehavior="blurAndSubmit"`. The acceptance
flows now share a small native keyboard subflow. On iOS it first confirms that
the keyboard's delete key is visible, taps the observed system Done key, then
asserts that both keys disappear. On Android it retains the
existing `hideKeyboard` action. Every original content, save, draft-retention
and screenshot assertion remains in place, as do the original route actions.

Maestro documents that its generic iOS dismissal uses center-screen swipes,
whereas Android uses the system Back action. A direct tap targets the existing
native submit control instead of relying on that layout-dependent swipe:
[hideKeyboard behavior](https://docs.maestro.dev/reference/commands-available/hidekeyboard),
[platform conditions](https://docs.maestro.dev/maestro-flows/flow-control-and-logic/conditions),
[tapOn selectors](https://docs.maestro.dev/reference/commands-available/tapon).
The flow does not invoke app callbacks, make dismissal optional, or retry a
failed assertion.

## Validation scope

The fourteen native UI evidence and transport tests passed. YAML parsing and
a structural comparison against the prior Settings and Editor flows verified
that only the keyboard action changed; all other original commands and
assertions are identical. This Linux workspace does not execute the iOS
simulator. The revised native flow still requires a passing hosted iOS run.
