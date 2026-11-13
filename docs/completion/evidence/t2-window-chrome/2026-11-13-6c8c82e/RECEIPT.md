# Window chrome native receipts, 2026-11-13

CI run commit: `6c8c82e` on pull request 73. Both jobs report
`sourceRevision` `65370f7e9444c73b5443e43e6c9dcde3fb93b324`, the pull request
merge commit GitHub built for the head `6c8c82e` (`merge_commit_sha` of the
pull request at that time).

| Platform | Job | Run | Receipt |
| --- | --- | --- | --- |
| macOS, Spark 0.0.3, ARM64 | NYC-Tron AppKit native host | 43485988092, attempt 2 | `appkit/window-chrome.json` |
| Windows, RNW 0.85 Fabric | WinUI 3 navigation and native desktop in RNW Fabric | 43485987990 | `winui/window-chrome.json` |

Both receipts have `status: "passed"`. Every title-bar command goes through
the app's `@nyc-tron/core/window-lifecycle` registry; the close decision is
the app's.

The first attempt of the AppKit run was cancelled by the runner after 15
minutes with no failing step, and attempt 2 produced this receipt. The same
run's iOS native-controls job failed once in an unrelated Maestro step and
passed on retry. Neither failure touched this change.

## AppKit (`contentUnderTitleBar`)

- Close, guard cancels: `controller-close-unsaved` (vetoed, 2 windows) and
  `system-close-button-unsaved` (the AppKit close button, vetoed, 2 windows).
- Close, guard proceeds: `controller-close-saved` (done, 1 window). The
  AppKit close button is not pressed with a saved draft in this check.
- Minimize and restore: controller minimize and restore, and the AppKit
  minimize button followed by a controller restore. `nativeMinimized` and the
  registry status agree at each step.
- Zoom: the controller toggles `NSWindow.zoom`. On this window the AppKit
  green button entered full screen, not zoom, although the receipt reports
  `fullScreenPrimary: false`. The cause is not determined here. That step
  waits for the did-enter and did-exit full-screen notifications
  (`system-zoom-button`, `system-zoom-button-exit`).
- Insets: the leading inset measured by `readTitleBarInsets` matches the
  button frames within 0.5 point (asserted in `verify-native.mjs`).

## Windows (extended title bar, trailing inset 138 px, height 32 px at 96 dpi)

- Close, guard cancels: `caption-close-cancelled` (system close button,
  pressed with OS pointer input at the reported caption inset) and
  `controller-close-cancelled`.
- Close, guard proceeds: `caption-close-proceeded` (system close button) and
  `controller-close-proceeded`.
- Minimize and restore: `caption-minimize` (system minimize button, UIA
  visual state `Minimized`), `controller-restore-after-caption-minimize`,
  `controller-minimize` and `controller-restore`.
- UIA exposes no caption buttons once content extends into the title bar
  (`automationId` and `bounds` are null in the receipt), so each button is
  found by the reported trailing inset, three equal buttons wide, and
  pressed with `SendInput`. The script never draws the buttons and never
  calls the controller in their place.

## Generated TurboModule code

- `winui/codegen/NativeTronDesktopSpec.g.h`: `setTitleBar` as method 7 of
  the Windows module.
- `appkit/codegen/`: `NYCTronAppKitSpec*` files with `readTitleBarInsets`.

## Not covered

Windows maximize and zoom through the registry (the bridge has no `zoom`),
Narrator and VoiceOver speech, high contrast and right-to-left caption
layout on hardware, and the Windows `proceed` path on the macOS job. These
receipts are for these two jobs at this commit and do not carry to other
commits or platforms.
