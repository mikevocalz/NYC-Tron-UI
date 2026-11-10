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

## Corrected Settings flow and subsequent Editor input failure

[Native controls run 42850172457](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42850172457),
[iOS job 129948359889](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42850172457/job/129948359889),
tested source head `eb1f473d910b0b13854778e60c6e7c41b41ff228`. Its installed
checkout is `34ed0569e54b2dee4ba8f7eacef402a86c647ee7`, whose tree
`e70358de4d140ac78ee3a75ca1567af39442548e` equals the reviewed source tree.
The native build and all eleven decoder checks passed. Settings also passed
its actual XCTest flow in about 69 seconds, with one executed case, zero
failures and zero skips. The real Done-key dismissal therefore has a passing
native result.

The next flow failed its initial `Quiet forms` visibility assertion after
the first Editor navigation tap. Its screenshot and hierarchy still show
Settings selected, with the keyboard absent. The only Editor target has
bounds `[102,780][201,836]`; the recorded tap is its center, `(151,808)`.
Editor did not reach its text-edit or keyboard actions, and pointer acceptance
did not execute. This attempt is not a full iOS UI pass.

Independent comparisons of the native simulator input logs found a specific
difference from the successful navigation and save taps:

| Touch sequence | Recorded native input |
| --- | --- |
| Successful Settings navigation and Save | Contact transitions from touching to none, no skipped down/range events, and an empty contact set at digitizer removal. |
| Failed Editor navigation | Extra unknown-digitizer initialization for the sender, ten skipped down/range events, no release transition, then cancellation of the still-touching application contact. |

Generic service-cancellation or down-without-range messages also occur in
successful taps; those messages alone do not diagnose the failure. The
incomplete contact sequence supports one unchanged repeat of the iOS flow.
The product code, selectors and assertions remain unchanged. The combined
evidence and browser-resolver publication will start that repeat; its result
will be recorded in [PR #58](https://github.com/mikevocalz/NYC-Tron-UI/pull/58).

The failed attempt remains retained as artifact `13782336595`,
`native-release-consumer-ios`. Its downloaded ZIP SHA-256 is:

```text
ee3e602288cb4af05b554a700725f53ede54a5f6774f277bd9feb9b6ca3bcb07
```

All 51 ZIP entries passed path and CRC checks. The nested simulator app's
226 manifest entries matched their recorded bytes and hashes. Its manifest
fingerprint is identical for the decoder and UI runs:

```text
524375fa04e9e37733d87edba42d704a1b098a2eb15c92286dbda7d0856ea1eb
```

All ten installed package versions and archive hashes match the consumer
plan, with no absent peers. Existing receipt validators accept the decoder
and Settings results, including Settings labels and safe-area geometry, and
correctly reject the failed Editor result.
