# AppKit foreground acquisition failure after successful mounting

[Run 42877931766](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42877931766)
passed canonical core packaging, the ARM64/Xcode 26.2 toolchain and Swift probe,
clean archive consumer preparation, the installed API snapshot, and standalone
native AppKit compilation. The retained build log ends with `BUILD SUCCEEDED`.

The app launched as process `34696`. The new phase trace establishes successful
socket connection, protocol-1 authentication, a native main-queue ping,
`root-main` mounting, and the React status `Native workspace ready`. The
fixture's `tron.window` show request then returned success. All **340** subsequent
owner observations reported `visible: true` and `key: false`. Acceptance failed
with `Timed out waiting for visible native owner window`; no interaction group
completed, and the tested-package upload was skipped.

## What the retained evidence establishes

`commands-excerpt.jsonl` preserves the original connection/authentication lines,
requests and responses through the first owner inspection, and the final owner
inspection. The omitted repeated observations are counted in `provenance.json`.
The original 827,603-byte trace is identified there by hash and exact retained
line numbers. The native hierarchy includes the actual Spark split view,
sidebar table, buttons, text fields and `RNDesktopDragView`; seeing those classes
does not establish that their interaction tests passed.

The bounded two-second process sample completed successfully. Every one of its
162 main-thread samples is in AppKit's ordinary event-loop wait. The JavaScript
thread is also waiting in its run loop, and the driver thread is waiting for
socket input. `process-sample-excerpt.txt` preserves those stacks with original
line numbers. This observation and the 345 successful command replies establish
that this failure was not a blocked main queue or an unmounted React root.

The show command in this revision reported success only after
`setActivationPolicy(Regular)` returned true. It then called
`activateIgnoringOtherApps:YES` and `makeKeyAndOrderFront:`. Actual application
activity, the later activation-policy value, key-window eligibility and the
frontmost process were not recorded. The observed failure is therefore precisely
the missing key owner, without a claim about which unrecorded foreground state
prevented it. The earlier `a097b8b` timeout had no phase trace or process sample;
this run does not establish that it had the same cause.

Apple documents that, since macOS Sonoma, activation is a cooperative request
and the old “ignore other apps” flag is ignored. Its supported `NSWorkspace`
application-opening path supplies activation context. The follow-up uses that
path for the exact already running test bundle, requires the returned process
and resolved bundle URL to match, returns the concurrent completion callback to
the main queue, and still requires observed visible, key, active and matching
frontmost-process state. It does not enable prompts, substitute another app,
alter TCC, or treat a successful request as acceptance. That correction requires
another native run.

## Exact source and artifact provenance

The PR head was `7afcf312d98336c7bd25e157367f711489d206c9`; the actual CI checkout
was merge revision `f52734871c351bedef2d8fa961c15348107e148f`. Both have tree
`03648c979fb6e7841f5418edaac8f8a9d4fc89df`.

Artifact `13794765365`, `macos-appkit-native-evidence`, was verified before
extraction against GitHub's SHA-256:

`b0fb83cb7a116f9783f9d872b7155110e72231295bf38d14bff667ed21ccaca2`

The failure, invocation, app log, toolchain, native payload manifest and sampler
result are copied unchanged. `provenance.json` identifies their original bytes,
the full build log, command trace and process sample. The manifest lists the
actual app's payload hashes without including binaries. Prepared archive and
payload hashes identify this successful compile and failed runtime attempt;
they are not a natively accepted distribution receipt.

No tooltip-hover or native-drag input-posting permission observation was reached.
Controls, menus, ordinary React responders, popovers, window lifetime and drag
interaction acceptance remain unverified by this run.

Official activation references:

- [Cooperative app activation](https://developer.apple.com/documentation/appkit/passing-control-from-one-app-to-another-with-cooperative-activation)
- [What's new in AppKit, WWDC23](https://developer.apple.com/videos/play/wwdc2023/10054/) (activation discussion around 9:55–10:54)
- [NSWorkspace application opening](https://developer.apple.com/documentation/appkit/nsworkspace/openapplication(at:configuration:completionhandler:))
- [Reusing an already running app](https://developer.apple.com/documentation/appkit/nsworkspace/openconfiguration/createsnewapplicationinstance)
