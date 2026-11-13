# Window chrome native receipts, 2026-11-13

CI run commit: `7dd79ac` on pull request 73. Both jobs report
`sourceRevision` `74b45d99`, which is the pull request merge ref GitHub builds
(`GITHUB_SHA`) for the head `7dd79ac`.

| Platform | Job | Run | Receipt |
| --- | --- | --- | --- |
| macOS, Spark 0.0.3, ARM64 | NYC-Tron AppKit native host | 43462201191 | `appkit/window-chrome.json` |
| Windows, RNW 0.85 Fabric | WinUI 3 navigation and native desktop in RNW Fabric | 43462201051 | `winui/window-chrome.json` |

Both receipts have `status: "passed"`. Every title-bar command goes through
the app's `@nyc-tron/core/window-lifecycle` registry; the close decision is
the app's.

## AppKit (`contentUnderTitleBar`)

- Close, guard cancels: `controller-close-unsaved` (vetoed, 2 windows) and
  `system-close-button-unsaved` (the AppKit close button, vetoed, 2 windows).
- Close, guard proceeds: `controller-close-saved` (done, 1 window). The
  AppKit close button is not pressed with a saved draft in this check.
- Minimize and restore: controller minimize and restore, and the AppKit
  minimize button followed by a controller restore. `nativeMinimized` and the
  registry status agree at each step.
- Zoom: the controller toggles `NSWindow.zoom`. The AppKit green button
  enters full screen on this window, not zoom, so that step waits for the
  did-enter and did-exit full-screen notifications
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
