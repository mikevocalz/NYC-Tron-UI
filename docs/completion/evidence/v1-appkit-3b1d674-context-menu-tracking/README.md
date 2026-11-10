# AppKit startup passed; context-menu tracking remained open

[Run 42903677542](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42903677542)
passed all eleven source checks, the canonical core archive handoff, ARM64/Xcode
26.2 verification, clean installed-consumer preparation, the installed public API
snapshot, the real Foundation/socketpair probe and standalone native compilation.
The runtime then passed owned application activation, the first React mount,
JavaScript readiness and the native control/display check. Its first failure was:

`Timed out waiting for Native context menu dismissed`

The original failure records one completed interaction group:
`native-appkit-controls-and-display-module`. The combined menu group did not
pass. No native passed report or tested-package receipt was emitted.

## What this run established

The command trace shows `NSWorkspace.openApplication` returning the same spawned
process, PID `22665`. The following independent native inspection observed a
regular activation policy, visible/key owner, active application and foreground
PID matching the spawned app. The first `root-main` request then completed in
276 ms, and the app's status became `Native workspace ready`.

This is the first retained run of the activation-before-mount acceptance
sequence. It establishes that sequence's success on this host. It does not
retroactively identify the cause of earlier hidden-mode mount delays.

The native application menu exposed its expected command and disabled item.
Selecting its save action changed the app-owned saved title. The first context
menu was observed as an actual `NSMenu` with the expected disabled item, and
selecting its save action also produced the expected saved title. These are
native target/action and callback observations, separate from physical keyboard
or pointer gestures.

## The observed cancellation failure

The first context-menu selection was requested at `21:29:34.947Z`. The saved
status was observed at `21:29:35.005Z`; the verifier pressed the context-menu
trigger again at `21:29:35.007Z`, accepted a tracked menu at `21:29:35.024Z`, and
requested cancellation at `21:29:35.025Z`.

The pinned Spark selection handler resolves its Promise before native tracking
necessarily ends. This version of the verifier waited for the saved React status
but did not observe the first native end-of-tracking event before reopening. The
driver exposed no menu identity or generation, so the next inspection could
still refer to the earlier menu. The retained commands establish this ordering
and identity gap; they cannot establish which menu received cancellation.

All 367 subsequent successful status inspections still reported
`Saved in this local reference session`. No dismissed or busy/error status was
observed. The live sample captured six thread groups with the process present
before and after capture. All 167 main-thread samples remained inside an AppKit
`NSMenu` popup tracking event loop. The JavaScript thread was waiting in its run
loop and the driver thread was receiving socket input. Some native menu remained
tracking while the transport continued responding.

The separate source correction adds native tracking generations, exact operation
target checks, an end-of-tracking barrier before reopening, and an observed end
after cancellation. It preserves the native `cancelTracking` operation and the
selected/save and canceled/dismissed JavaScript assertions. This original run
does not test that correction or prove a production cancellation defect.

## Evidence boundaries

The runtime did not reach tooltip hover, popovers, ordinary React responder
checks, additional window lifetimes or native cross-window drag. CGEvent
permission was not queried, so this run establishes no permission denial or
gesture acceptance. Both mandatory OS-interaction checks remain required before
a passed native report or tested package may be issued.

The real Foundation/socketpair probe passed again. Its original and patched
finite-response cases preserved the response; all six invalid fixtures produced
an escaping exception in the original sender and a structured failure frame in
the private patched sender. The probe explicitly records
`nativeInteractionsAccepted: false`. It does not explain the menu failure.

## Source and artifact identity

The PR head was `3b1d6745bde04abf367fba9865343d38b2149e5f`; the actual tested merge
was `e5b0974bc7bc59ef174250b4af32e4cc4839494a`. Both have tree
`28155a3373b323a20d53b877fcd25b024471d298`, independently checked from Git objects
and recorded in `checkout.json`.

Artifact `13804707156`, `macos-appkit-native-evidence`, was verified against
GitHub's expected size and SHA-256 before extraction:

`e12be82c05749ba5006142dcfb2edb56964e51d14814b1b837c7eb9152186937`

`original-evidence.zip` retains all 859,057 original bytes. All 42 original
members are identified by byte length and SHA-256 in
`original-member-manifest.json`, including the complete command trace, native
transport log, process sample, 12,299,645-byte compiler log, package preparation,
and private transport source/probe/license provenance.

`source-job.log` preserves the complete source job log: eleven passes, zero
failures and zero skips, including four real Unix-socket client regressions.
`workflow-jobs.json` records the actual step outcomes. The command, sample and
build excerpts retain original line numbers; `observed-milestones.json` selects
specific original responses without changing their values.

These hashes identify a successful native build and partial interaction evidence
from a failed acceptance run. They do not identify an accepted distribution.

`independent-verification.json` records the root review of all 42 original
members, direct receipts, exact patch inputs, twenty selected command milestones
and all three numbered excerpts. The complete source log also matches a separate
connector retrieval. Native-app payload and probe-executable hashes remain
producer-reported: the binaries are absent from this original ZIP and were not
independently rehashed.
