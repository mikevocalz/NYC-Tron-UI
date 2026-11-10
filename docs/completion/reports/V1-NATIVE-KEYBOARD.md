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
