# Windows UIA smoke evidence (issue #11)

Source: artifact `winui-fabric-uia-smoke` from the `winui-fabric.yml` workflow.

| Field | Value |
|---|---|
| Run id | 42158305089 |
| Commit | `e95f2be1b8b0730d1365555e87be20fb8ac8e84f` |
| Started | 2026-11-06T03:44:00Z (finished 03:50:23Z) |
| Conclusion | success (both jobs: native C++ compile, source gates) |
| Runner | GitHub-hosted `windows-2025`, job "VS 2026 RNW 0.85 XAML Fabric native C++ compile" |
| Artifact | 83016 bytes, expires 2027-02-04 |
| Script | `packages/windows-fluent/rnw-fabric/example/scripts/uia-smoke.ps1` |

The artifact held three PNGs and nothing else. `uia-tree.txt` and `failure*.png`
are only written when the script fails, so they are absent on a passing run.

| File | SHA-256 |
|---|---|
| `01-launched.png` | `7fed0160bddfde2c098d972355e67eeb9f5a8768ff55b0ac2b6825d63e3c14dd` |
| `02-rejected.png` | `e523531d28438d3cae39409c636435b9d29f17c6e47d5f3d5feae91f330a9bed` |
| `03-accepted.png` | `98c8d04e0a77833566748cd96555f6ef73aa06b5ac1d74fc1f9daa2e79728cfe` |

## What the smoke covers

The script launches the packaged Release app by AppUserModelId under Windows
PowerShell 5.1 and drives it through the UI Automation client. It checks:

1. The process starts and a top-level window appears.
2. The native NavigationView items `Home`, `Workspace` and `NYC-Tron` exist in the
   UIA tree under those names.
3. `SelectionItemPattern` is exposed and reports Home selected at launch.
4. A keyboard request (focus Home, Down, Enter) produces the pending text
   "Awaiting app approval: Workspace" while selection stays on Home.
5. Invoking the `Reject navigation` Button leaves selection on Home and shows
   "Navigation rejected; current route retained".
6. Repeating the request and invoking `Accept navigation` moves selection to
   Workspace and shows "Committed route: workspace".

So it shows that native selection follows only the app-committed route, on one
Windows 11 runner, with names that UIA exposes. Screenshots are taken at launch,
after reject and after accept.

## What it does not cover

- Narrator speech. UIA names are checked, nothing is spoken or listened to.
- High contrast themes.
- RTL layout.
- Window resize, pane collapse or compact mode. The "Close pane" button is never used.
- Pointer input. Navigation uses the keyboard and `InvokePattern`.
- Focus return after opening Settings.
- `onNativeError`.
- Real hardware, other Windows versions, or any display other than the runner's.

AGENTS.md rule 10 applies: this is a CI automation run, not manual Narrator or
device acceptance. It does not change any ledger `acceptance` field.

## Observations from the screenshots

- The captured window is cropped at the right edge, so the content area is cut
  off. The runner screen was small and a terminal shows behind the window.
- In `03-accepted.png` the status line reads "Committed route: workspace" twice
  and the Reject button label is blank (the button is disabled). This is the
  example app's state after accept, not checked by the script.
