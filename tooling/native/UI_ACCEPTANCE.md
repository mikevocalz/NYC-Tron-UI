# Native reference UI acceptance

`run-ui-acceptance.mjs` installs the already-built clean-tarball candidate and
drives its actual native UI. The release's required iOS and Android jobs invoke
it after the independent media decoder runner. Each runner owns its Metro
session; neither serves workspace source or receives injected JavaScript input.

The driver is official Maestro **2.12.1**, source
[`67d8a677029261fa424a45a10d08eacd6aa0deed`](https://github.com/mobile-dev-inc/Maestro/tree/67d8a677029261fa424a45a10d08eacd6aa0deed).
`install-maestro.mjs` verifies the release ZIP's SHA-256
`54dbb0716425626604973cbb374c585ca30272375d9ce15177a1152765ddd9d7`
before extracting it. The runtime checks the installed CLI version. The tool
is a CI dependency and is not included in NYC-Tron packages.

## Exercised behavior

| Flow | Actual native actions and assertions |
|---|---|
| Settings | Tap the Settings tab, edit the labeled Workspace name input, hide the keyboard, scroll and save, then verify the changed header and saved status |
| Editor | Tap Editor, scroll to Cover headline, type a draft, visit Settings and return, verify the retained preview, then save and verify the saved status |
| Pointer | Perform an OS swipe on the labeled `NativePointerInput` surface; require an actual touch/up observation and exactly one committed stroke |
| Android cancellation | Find the input's coordinates in the actual accessibility tree, inject an Android touchscreen DOWN, verify that observation, press Home, resume the Activity and require cancellation without losing or adding a committed stroke |

Maestro's pinned iOS
[touch handler](https://github.com/mobile-dev-inc/Maestro/blob/67d8a677029261fa424a45a10d08eacd6aa0deed/maestro-ios-xctest-runner/maestro-driver-iosUITests/Routes/Handlers/TouchRouteHandler.swift)
uses XCTest OS event synthesis. Its
[Android driver](https://github.com/mobile-dev-inc/Maestro/blob/67d8a677029261fa424a45a10d08eacd6aa0deed/maestro-client/src/main/java/maestro/drivers/AndroidDriver.kt)
reads Android accessibility nodes and uses native device input. The flow files
use the documented [native selectors](https://docs.maestro.dev/reference/selectors/core-selectors),
[swipe command](https://docs.maestro.dev/reference/commands-available/swipe) and
[JUnit artifacts](https://docs.maestro.dev/maestro-flows/workspace-management/test-reports-and-artifacts).

## Evidence and limits

The runner requires a matching `consumer.json` source revision and the installed
release packages. A zero CLI exit must also produce one successful, unskipped
JUnit case per flow, actual PNG screenshots and a populated OS accessibility
tree with the exercised labels. Each flow's report, tree and images are hashed.
The final report records the actual app binary hash, source commit, installed
package archive hashes, simulator/emulator identity and pinned tool identity.
Command receipts, Metro logs, screenshots and failure hierarchies are retained
when a gate fails. An older output directory cannot be reused as a new result.

The Settings and Editor flows each permit **one** evidence-bound transport
recovery. On Android, only Settings qualifies: eligibility requires the initial
launch command to fail with the target emulator's exact `device offline` error,
before any app assertion. The runner waits for ADB and boot readiness, restores
its Metro reverse mapping, and observes the same installed app's resumed
Activity.

On iOS, eligibility covers only the flow's first tab tap and the assertion
right after it. For Settings that is launch, `Library` visible, tap `Settings`,
then the failed `Workspace preferences` assertion. For Editor it is launch, tap
`Editor`, then the failed `Quiet forms` assertion. Any other command before or
between them disqualifies the failure. That tap's time window must contain a
Recap registration, unknown sender, nonempty cancelled contact and cancelled
path for the same sender/contact and app package. This is the observed
[upstream simulator transport race](https://github.com/mobile-dev-inc/Maestro/issues/3686),
not evidence that a completed tap reached the app; Maestro's
[settled-screen comparison](https://github.com/mobile-dev-inc/Maestro/issues/3685)
can report a change without checking one.

Editor was added after the same race hit its first tab tap. Release run
43046836104 on `main` at `11c1ce8` failed with `Assertion is false: "Quiet
forms" is visible`. Its simulator log shows a Recap digitizer added at
15:43:24.241, `unknown senderID: 0x1013418000008` at 15:43:24.246, and
`cancel -- digitizer did disappear` plus `canceling paths` for pathIndex 2 in
the app's scene at 15:43:24.478. That was inside the 15:43:19.539 to
15:43:24.913 tap window, so the OS cancelled the touch before the app received
it, and the app stayed on Settings. PR #58's attempt-2 run (42857968753) failed
on the same tap with the same signature.

Every original failed report, screenshot and log is moved intact into
`<flow>-initial-transport-failure`, hashed, and referenced by a receipt
(`transport-recovery.json` for Settings, `editor-transport-recovery.json` for
Editor) before another attempt. The installed app payload is unchanged. The
complete flow then runs again with the same semantic assertions, and any
second failure is final. Pointer, later taps, edits, saves, ordinary assertion
failures and unproven cancellations are never retried.
Only a successful full suite produces `result.json`, which records any recovery
alongside the fresh successful flow receipts.

These are simulated OS touch and accessible-label checks. They do not establish
physical pen pressure, tilt, hover, palm rejection, hardware fold behavior or
VoiceOver/TalkBack spoken output. Active iOS touch cancellation still needs its
own device/OS-interruption record. The gate does not set any canonical platform
row to accepted.

The workflow prewarms one iPhone simulator and sets `NYC_TRON_IOS_UDID` so media
and UI acceptance use the same available host. A cold boot has a bounded
420-second wait with retained logs. Android uses the same booted emulator for
both runners. Running locally requires a built candidate, its clean consumer,
the relevant OS SDK and `MAESTRO_BIN` pointing to the verified installation:

```sh
node tooling/native/install-maestro.mjs /tmp/nyc-tron-maestro
MAESTRO_BIN=/tmp/nyc-tron-maestro/maestro/bin/maestro node tooling/native/run-ui-acceptance.mjs ios /path/to/app.app /path/to/clean-consumer
MAESTRO_BIN=/tmp/nyc-tron-maestro/maestro/bin/maestro node tooling/native/run-ui-acceptance.mjs android /path/to/app.apk /path/to/clean-consumer
```

The Linux workspace can verify flow parsing, source types and evidence rejection
tests. Successful simulator execution is reported only after the native jobs
produce their actual results.
