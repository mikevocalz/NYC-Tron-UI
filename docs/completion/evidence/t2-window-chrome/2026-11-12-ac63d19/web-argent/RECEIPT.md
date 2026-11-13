# Web drawn title bar, argent session, 2026-11-12

Source: commit `ac63d19`, fixture `packages/ui/tests/browser/fixtures/window-chrome.tsx`,
served by `packages/ui/tests/browser/server.mjs` on 127.0.0.1:4392 and opened in
local Google Chrome 157.0.8103.52 with `--remote-debugging-port=9222`. Argent drove
it as device `chromium-cdp-9222`: `describe` for targets, `gesture-tap` and
`run-sequence` for input. Every tap target came from the element tree, not from
screenshot pixels.

The page has two in-page windows on one `createPageWindowHost` registry. Its
close decision refuses while the document is unsaved and allows after Save.
The `registry` line at the bottom of each capture is the live registry plus the
app's log.

| Capture | Action | Registry and log after |
| --- | --- | --- |
| 01 | none | both `open`, both edited |
| 02 | tap "Close window" (macos layout) | `mac` still `open`; `guard:mac:cancel`, `mac:close:vetoed` |
| 03 | tap "Minimize window" | `mac` `minimized`; collapsed bar with "Restore window" |
| 04 | tap "Restore window" | `mac` `open`, focused; `mac:restore:done` |
| 05 | tap "Save Q3 report", then "Close window" | `mac` removed; `guard:mac:proceed`, `mac:close:done` |
| 06 | tap "Close" (windows layout) | `win` still `open`; `guard:win:cancel`, `win:close:vetoed` |
| 07 | tap "Minimize" | `win` `minimized`; collapsed bar with "Restore" |
| 08 | tap "Restore" | `win` `open`, focused |
| 09 | tap "Save Budget sheet", then "Close" | registry empty; `guard:win:proceed`, `win:close:done` |

Limits:
- Between captures 06 and 07 the log gained `win:zoom`, a second
  minimize/restore and a second vetoed close that this session did not send.
  The argent tool server is shared with other agents on this machine; another
  client probably drove the same CDP target. The entries all went through the
  registry and the guard still refused while unsaved, but they were not part of
  this script.
- After these captures, one class changed in `WindowTitleBar.tsx`: the
  windows-layout close control uses `hover:bg-danger` alone instead of together
  with `hover:bg-surface-raised`. Hover was not captured here.
- This is a local Chrome on macOS, not the CI Chromium. The CI browser suite
  (`window-chrome.spec.mjs`) writes its own receipt,
  `shots/window-chrome-receipt.json`, in the `ui-browser-captures` artifact.
