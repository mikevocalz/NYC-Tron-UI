# T2 window chrome: decision and evidence

Gate T2 adds a window title bar and window controls bound to the
`@nyc-tron/core/window-lifecycle` registry. This file is the decision record
the five added inventory rows (W-01 to W-05 in
`docs/completion/library-progress.json`, `additions`) point to, and the index
of their evidence.

## ADR: the window-chrome rows are part of 1.0.0

Status: decided 2026-11-12 by the integrator (A0) on the owner's instruction
to decide: part of 1.0.0.

> Owner confirmation: pending. Reply on the T2 pull request to confirm, or to
> move the rows to the first minor release.

Context. The program prompt (§6 T2.7) asks whether the new rows belong to
`1.0.0` or the first minor, with `1.0.0` as the default because the owner asked
for window controls. The canonical inventory is the SHA-pinned 341-row
baseline, and `tooling/verify-component-program.mjs` refuses any change to its
IDs, names or count.

Decision.

- The baseline stays frozen. The new rows live in an `additions` list with the
  same fields and the same per-row rules, plus `gate` and `decision`.
- Additions count as stable blockers: `tooling/release-readiness.mjs` blocks a
  stable release while any added row lacks accepted proof on all eight
  platforms, exactly as for canonical rows.
- Additions can be added but not dropped. `RECORDED_ADDITION_IDS` in the
  validator lists W-01 to W-05, and removing one fails validation, so nobody
  can pass the stable gate by deleting a row.

Consequences. Stable `1.0.0` needs eight-platform acceptance for 346 rows
instead of 341. A prerelease (`rc.2`) is unaffected. Moving the rows to the
first minor later means removing them from `RECORDED_ADDITION_IDS` in a
reviewed change that cites the owner's decision.

## ADR: the Windows title-bar transport member is optional

Status: Decided 2026-11-13 by the integrator (A0) on the owner's instruction
to decide. Owner confirmation: pending.

Context. After `1.0.0-rc.1`, T2 added title-bar members to the Windows
host. R1 noted that a required `setTitleBar` on `WindowsDesktopTransport`
breaks anyone who implements or mocks that interface.

Decision.

- `WindowsDesktopTransport.setTitleBar` is optional. When a transport has
  none, `WindowsWindowHost.setTitleBar` rejects with an error that says
  "unsupported" and leaves the window unchanged. A test covers that path.
- `WindowsWindowHost.setTitleBar` and `WindowsObservedWindow.titleBar` stay
  required. The host is implemented by this package, and the observed window
  comes from the native report, which always carries a title bar.

This is an additive public API change after `1.0.0-rc.1`, reported to the
owner under section 8 of the program prompt. It is listed in `CHANGELOG.md`
under `1.0.0-rc.2`.

This changes release tooling, so it needs R1 review.

## Rows

| ID | Name | Owner | Source |
| --- | --- | --- | --- |
| W-01 | WindowChromeController | `@nyc-tron/core/window-chrome` | `packages/core/src/window-chrome.ts` |
| W-02 | WindowTitleBar | `@nyc-tron/ui/components/window/WindowTitleBar` | `packages/ui/src/components/window/WindowTitleBar.tsx` |
| W-03 | MacOSWindowChrome | `@nyc-tron/macos-appkit/window-chrome` | `packages/macos-appkit/spark/src/window-chrome.ts` |
| W-04 | WindowsCaptionChrome | `@nyc-tron/windows-fluent-fabric` window chrome | `packages/windows-fluent/rnw-fabric/src/window-chrome.ts` |
| W-05 | WindowControlsInset | `@nyc-tron/reserved-regions` | `packages/reserved-regions/src/useWindowControlsInsets.native.ts` |

Every row is `acceptance: "unverified"`. The receipts below are evidence for
their own commit and platform; none of them accepts a row.

## Evidence

| Row | Platform | Receipt | CI run |
| --- | --- | --- | --- |
| W-02 | web, drawn controls | `evidence/t2-window-chrome/2026-11-12-ac63d19/web-argent/RECEIPT.md` (local, partial) and the browser suite `window-chrome.spec.mjs` | CI, each commit |
| W-03 | macOS AppKit | `evidence/t2-window-chrome/2026-11-13-7dd79ac/appkit/window-chrome.json` | 43462201191 |
| W-04 | Windows UI Automation | `evidence/t2-window-chrome/2026-11-13-7dd79ac/winui/window-chrome.json` | 43462201051 |

`evidence/t2-window-chrome/2026-11-13-7dd79ac/RECEIPT.md` lists each step and
what the receipts do not cover. W-03 and W-04 are `implemented` with a passed
receipt for their own platform and `acceptance: "unverified"`.

### Note for R1: the AppKit green button entered full screen

On the document window in this check, pressing the real green button ran
Enter Full Screen, not zoom. Run 43192331575 showed it: the frame became the
whole screen with no title bar, and a second press sent mid-transition was
ignored. The receipt reports `fullScreenPrimary: false` for that window
(`collectionBehavior` does not include `FullScreenPrimary`) while the button
still entered full screen, so this report does not claim to know why AppKit
chose full screen here. The check now waits for AppKit's did-enter and
did-exit notifications and requires the registry to agree with
`NSWindow.isZoomed`.

Registry zoom (`toggleZoom`) is tested through the controller, which calls
`NSWindow.zoom`.

### Follow-up, not a blocker: the drawn zoom control

The drawn-mode zoom control calls `NSWindow.zoom`, unlike the real green
button, which entered full screen in this check. Whether the drawn control
should follow the green button is a product question. It is open and nothing
here decides it.
