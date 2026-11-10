# Native keyboard dismissal follow-up

Recorded 2026-11-10 against PR #57 head
`d6b2c817f9f92017c087a83bf5a14c3cb7e80a1a`, tested merge
`2f8f2b0c6256bbb8f2b24878c6439c089c3847f9`.

## Observed failure

The [native run](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42775216659)
passed the Android installed-consumer job, including its decoder and OS-driven
Settings, Editor and pointer flows. The iOS installed consumer compiled and
passed all eleven media checks, then failed its Settings UI flow after entering
the requested workspace name. The retained JUnit error is `Couldn't hide the
keyboard`. Navigation, field focus, text deletion and input had all completed.

The original [report, commands, screenshot and provenance](../evidence/v1-native-d6b2c81/ios/ui/)
were extracted from artifact `13743564656`. Its downloaded ZIP matches GitHub's
SHA-256 `83d9840db4a37d3d41dc1f2f9ccff09f9007b9eb32ce74ca877dbcee26cff91b`.
The failed screenshot shows the correct draft and an open native keyboard.
This failure happened after editing, so the initial transport-recovery rule
correctly refused to retry it. The iOS job remains failed in this record.

## Correction

The pinned Maestro
[iOS driver](https://github.com/mobile-dev-inc/Maestro/blob/67d8a677029261fa424a45a10d08eacd6aa0deed/maestro-client/src/main/java/maestro/drivers/IOSDriver.kt)
implements keyboard dismissal with small swipe gestures. React Native's
[`keyboardDismissMode`](https://reactnative.dev/docs/scrollview#keyboarddismissmode)
defaults to `none`. Both the reference form's ScrollView and the Inspector's
nested ScrollView omitted that setting, so the keyboard remained open during
those drags.

Both existing scroll owners now use `keyboardDismissMode="on-drag"`, preserving
`keyboardShouldPersistTaps="handled"`. Dragging the form or property list
dismisses the keyboard; an action still receives its first tap. The workspace
name and cover headline also expose the native Done key and explicit
[`blurAndSubmit`](https://reactnative.dev/docs/textinput#submitbehavior)
behavior. The existing Settings submit handler still saves preferences; the
headline's Done action only finishes editing, leaving Save cover authoritative.
Multiline subtitle behavior is unchanged.

All native flow commands, save/retention assertions, receipt deadlines and
transport-recovery conditions remain unchanged. No failure is ignored or
converted into a pass.

## Verification

- 25 existing Inspector and native evidence/transport tests passed.
- All three reference-model tests passed.
- UI source/public-slot types and both reference/native-example typechecks passed.
- `git diff --check` passed.

These checks validate the source change and evidence boundaries. A fresh iOS
installed-consumer run must still execute the unchanged Settings, Editor and
pointer flows before the native UI gate can be marked passed.

Guidance applied: the pinned NYC-MON foldable-layout skill, no-ai-slop writing
rules, official Expo native-UI/UI skills, Callstack React Native guidance and
the repository's Exact/native-feel contract. Existing native inputs, app-owned
Zustand stores and layout owners are retained.

## Follow-up: actual iOS driver gesture at e8a7efb

The first source correction alone **did not pass** the iOS UI gate. Run
[42834403759](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42834403759)
at PR head `e8a7efb9f0971746d01c68532540c65af502de9f` passed the iOS build and
strict media checks, then failed Settings `hideKeyboard` again. An earlier
initial navigation transport failure qualified for the existing single
recovery; the editing failure on the recovered attempt remained final.

Artifact `13774678339` has independently verified ZIP SHA-256
`a8f0ef06351605b971a076c2e4932ff4d045a9d620414c88a626174f84ade693`.
Its failed native hierarchy records a 402 × 874-point screen and the edited
workspace input at `[58,398][344,442]`. The pinned iOS driver's gestures start
at `(201,437)`, then end at `(201,410.78)` or `(188.94,437)`. Both gestures fall
entirely inside that input. The screenshot shows its insertion caret and the
new native Done key with the keyboard still open. This explains why enabling
scroll dismissal did not resolve that driver action.

The iOS flow now follows Maestro's documented
[noninteractive-header tap workaround](https://docs.maestro.dev/reference/commands-available/hidekeyboard#workarounds).
Settings taps the visible static `Workspace preferences` heading at
`[45,320][357,348]`. The existing `keyboardShouldPersistTaps="handled"` lets
that unhandled tap dismiss the keyboard without submitting preferences. The
Settings flow still must tap Save settings and prove the saved header/status.

The editor uses the native
[`pressKey: enter`](https://docs.maestro.dev/reference/commands-available/presskey)
action instead of the same layout-dependent swipe. Its single-line input has
`submitBehavior="blurAndSubmit"` and no submit handler, so this dismisses input
without saving the draft. Route-retention and Save cover assertions still run.
Both iOS paths require the observed native keyboard `delete` key to be present
before dismissal and absent afterward, matching the pinned driver's keyboard
visibility criterion. These are mandatory assertions around actual OS input;
there are no app scripts, optional steps, additional retries or relaxed deadlines.
Android retains its existing system Back dismissal.

Focused verification: 25 existing native evidence/transport and Inspector tests
pass, both YAML flows parse, and `git diff --check` passes. The next installed
iOS run must still prove the changed actions and all subsequent assertions;
this source follow-up does not convert either failed run into acceptance.
