# AppKit compiler failure at the 0edd5f3 candidate

This directory retains the observed failure from [AppKit run 42847217965](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42847217965).
The canonical core archive job passed. The ARM64 native job passed the clean
archive consumer and installed API snapshot checks, then failed while compiling
the standalone reference. Native control/window acceptance and retention of a
natively tested package were skipped. This is failure evidence.

The PR head was `0edd5f302e99877191ba9a412c5c060571a5f6c9`. GitHub checked out
merge revision `e597d73757911e9a58005d577b3c2bf2496bd798`, which is the actual
`sourceRevision` in the preparation receipt. Both revisions have tree
`5f97d6cf40b3e49112cf5559a2a912fcb83740d3`; the commit identities remain distinct.
The GitHub commit API confirmed that relationship, recorded in `checkout.json`.

## Observed failure and correction

The retained Spark tool logs report **Xcode 16.4, build 16F6**, using the
macOS 15.5 SDK. The build log reports `unknown attribute 'MainActor'` for isolated
protocol conformances in ExpoModulesCore's `SwiftUIHostingView`,
`SwiftUIVirtualView`, and `ViewDefinition`, alongside actor-isolation and
Sendable diagnostics. `compiler-errors.txt` contains numbered, unmodified lines
from that log. The complete log's hash and each retained source range are in
`provenance.json`.

The diagnosed toolchain mismatch is supported by the documented
[Expo 55 Xcode 26.2 minimum](https://docs.expo.dev/versions/v55.0.0/)
and [Swift 6.2 isolated-conformance support](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0470-isolated-conformances.md).
The [macOS 15 ARM64 runner image](https://github.com/actions/runner-images/blob/main/images/macos/macos-15-arm64-Readme.md)
listed Xcode 16.4 as its default and Xcode 26.2 as an installed alternative when
this failure was diagnosed. The follow-up [PR 59](https://github.com/mikevocalz/NYC-Tron-UI/pull/59)
candidate `fd86e17369c68b7b6d1a588ceee8349a6f248dd3` selects Xcode 26.2 explicitly
and requires an actual Swift isolated-conformance compiler probe with `pipefail`.
That correction's native execution is a separate result; these files do not
establish that it passed.

## Retained inputs and limits

The downloaded `macos-appkit-native-evidence` ZIP was verified against GitHub's
reported SHA-256 before extraction:

`87143cd8c1754462026ff58713a6746c2f9d2a4c2ed382b5d239a6df50a37cd3`

`artifact-metadata.json` and `workflow-jobs.json` retain the GitHub artifact and
step results. `package-preparation-summary.json` preserves the actual checkout,
ABI pins, and prepared archive identities. The full package file inventory and
build binaries are not duplicated here. Prepared archive hashes establish the
build inputs; there is no passed `tested-package.json` for this run.

The failure happened in ExpoModulesCore. It does not prove that every AppKit
adapter or private acceptance-driver native source compiles, that the reference
can launch, or that native gestures and controls behave correctly. It also
provides no acceptance result for the P0 native overlay additions introduced
after this candidate or for any other platform.
