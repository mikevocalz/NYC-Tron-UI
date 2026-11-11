# Windows Raw-view RTL witness: source review

This receipt records the fixture-only navigation correction in [reviewed commit 782ed3911dd35950797f7417fed813f5fa669c4e](https://github.com/mikevocalz/NYC-Tron-UI/commit/782ed3911dd35950797f7417fed813f5fa669c4e). It is a source and model review receipt. These checks did not execute the candidate with PowerShell, .NET UI Automation or the native app. Publication followed source approval: root reported the verified ref/PR update at 11:21:50 UTC on November 11, with generated merge `dad54be82f3912e4ab3fc7e1fff6f7db70ebb81b` (the same tree; ordered parents `25a6af6d020e34d790f6a4f3d9f117738b252f1e` and the reviewed child). Source workflow `43011337381` and native workflow `43011337384`, attempt 1, are new ordinary CI evidence to collect separately. This receipt assigns them no completed outcome.

## Exact source and composition boundary

The child has tree `7eb00e6b03fdec748227d03db04b232eb93a28d8` and sole parent `0596aa2e4441b2e3464a9fff32060cc10fb17481` (parent tree `6aad15f5f522da18a37fc5abe697953c71db92b0`). Root and the independent final reviewer separately verified all 3,152 leaves and 513 tree objects. The sole changed leaf is `packages/windows-fluent/rnw-fabric/example/scripts/uia-navigation-accessibility.ps1`: parent blob `cb69ad47c11d6b868957a2a72feb8fb27319d975` becomes `877c51ea1e16918968a6929e389c1f61f4a4e23d`. No shipping component, other script, workflow, dependency, ledger or earlier receipt changes in this child.

There are two composition stages. The already reviewed manifest `52365ada61c9a299a64f0655dfc77f8d6333e3df` transforms the actual parent navigation blob `cb69ad47` into `8c7632eeea23671646721ec7e96ecc386486e610`. That stage contains the finite visible-pane guard, 20 fixed secondary checkpoints, and borrowed GET high-contrast scheme correction while preserving the separately allocated SET scheme cleanup. The manifest retained here covers only the next stage: **8c7632 → 877c51ea**, with nine exact reversible edits. It must not be represented as a manifest whose input is cb69.

| Retained artifact | Git blob | UTF-8 bytes | SHA-256 |
|---|---|---:|---|
| Reviewed source, retained in the child | `877c51ea1e16918968a6929e389c1f61f4a4e23d` | 33096 | `2786f4a63776ec3e1bbd6fcd3af0313c967228a188a50a49cba68f99bc3f1074` |
| `edit-manifest.json` | `8be3831b6ded27855a2217bff29d55ee3fb56ba2` | 27994 | `822ed256a862f576d16e7826b99cbbd96c63562a8e1876c039db5916a0117f05` |
| `review-checks.js` | `1e2a01484083aad3085dcadc2fff543644ebe6f9` | 20055 | `040e0050188cde8d29ebb3ccbcb44de29c79cc50df96fe082dd1f8f0317ba20c` |

The nine edits initialize bounded evidence; add owned Raw-view helpers and a secondary projector; bind the actual toggle and its named navigation ancestor; poll retained icon geometry; use the validated navigation and owner frames; assert actual icon mirroring; retain typed state in the existing result; and emit the bounded secondary envelope. Exact forward application produces the complete source. Reversing the edits in reverse order restores every byte of 8c7632. Literal replacements must not interpret PowerShell dollar expressions as JavaScript replacement tokens.

## What the witness requires

The earlier full-button X comparison does not isolate the hamburger icon. The pinned WinUI template includes the title in the toggle, and the native control can intentionally give that button the pane width. This fixture therefore requires an actual Raw-view descendant whose AutomationId is exactly `Icon`; it does not change the native button width or alignment.

A complete bounded walk starts at the retained owned Window. It requires matching native HWND/PID and UIA HWND/PID/runtime identity, one toggle, one named navigation ancestor established by the toggle's actual ancestry, and one Icon descendant. Missing or ambiguous candidates, duplicate runtime identities, foreign-process elements, or node/depth exhaustion fail. The budget is 512 discovered nodes, depth 24 and at most 32 integers per opaque runtime ID. Initial and final searches must complete; they never select from a truncated tree.

Polling keeps the original provider objects. A final uniqueness check validates their identities without substituting newly obtained wrappers. Accepted rectangles are finite, positive, non-offscreen physical screen bounds with owner → navigation → toggle → icon containment. The icon must be wholly on the left in LTR and wholly on the right in RTL, while the owner, navigation and toggle bounds and the icon's size/Y remain unchanged. The existing physical-left pane test uses the same validated owner/navigation snapshot.

“Stable” means matching sequential identity and rectangle observations. It does not mean an atomic snapshot, render completion, continuous stability between reads, inspected pixels or absence of occlusion. AutomationId is optional: the template's `x:Name="Icon"` and Raw annotation do not prove an actual provider peer or AutomationId is available. A missing peer remains a strict failure until CI provides evidence.

## Preservation and bounded reporting

The native action order, existing 10-second/100-ms retry settings, physical-left pane, selection, capture, subsequent drawer and high-contrast checks, 20 fixed checkpoints, and restoration/error handling are preserved. A retry window cannot cancel a synchronous UIA provider call. There is no fallback to FlowDirection, guessed pixels, a new provider, or a compact-width layout mutation. The original script has no separate rendered-title assertion; this receipt claims none.

The existing result file gains only typed bounded witness state: the original binding, initial/final discovery counts, LTR and latest snapshots. A separate secondary console projection reads those captured hashtables without further UIA queries. Fixed fields and enum allowlists, typed numbers, bounded runtime IDs and explicit null unknowns prevent arbitrary provider text or tree dumps. The producer's complete UTF-8 envelope, including its trailing newline, is capped at 8 KiB; runner-added timestamps are outside that producer cap. An oversized projection uses a fixed output-limit record. Formatting/write failures are isolated and cannot replace the original error or alter success.

## Checks and their limits

The author and independent reviewer ran the same five compact V8 review groups; these repetitions are not additional native tests:

- Exact nine-edit composition/inverse, unchanged action ordering, 20 checkpoints and preserved later control flow.
- Static bounded-source contracts.
- An independent tree/ownership model with one positive case and 19 rejected cases, including missing/ambiguous peers, duplicate IDs, foreign ownership and traversal limits.
- Seventeen physical-geometry cases covering empty, zero, nonfinite, offscreen, outside-container, unstable or incorrectly positioned bounds, as well as a valid negative screen origin.
- A typed secondary-projection model covering privacy, explicit unknowns, overflow and secondary failures. Ordinary and maximum-width modeled envelopes are 1,746 and 4,680 bytes.

Evaluate `review-checks.js`, then call `reviewRawRtlWitness({source, preimage, manifest})` with exact 877c51ea source, 8c7632 preimage and parsed `edit-manifest.json`. The final harness correction changes only its overflow model field to `outputByteLimit`, matching the PowerShell source; the ordinary limits field remains `outputUtf8Bytes`.

No PowerShell parser or runtime, filesystem/native UIA call, native concurrency test, or rendered-image inspection was executed for this candidate. A model passing cannot prove Raw peer availability, provider timing or actual mirroring. It also does not identify or fix the cause of a previously failed native run, establish a supported/elevated host configuration, or produce a tested package. All later native, gesture, host-eligibility and release acceptance gates remain separate.

## Primary API references

- [Obtaining UI Automation elements](https://learn.microsoft.com/en-us/dotnet/framework/ui-automation/obtaining-ui-automation-elements): scoped Raw-view traversal.
- [UI Automation element property IDs](https://learn.microsoft.com/en-us/windows/win32/winauto/uiauto-automation-element-propids): physical screen rectangles and optional AutomationId.
- [AutomationElement.GetRuntimeId](https://learn.microsoft.com/en-us/dotnet/api/system.windows.automation.automationelement.getruntimeid?view=windowsdesktop-10.0): opaque runtime identity comparison.
- [Rect.Empty](https://learn.microsoft.com/en-us/dotnet/api/system.windows.rect.empty?view=windowsdesktop-10.0): empty-rectangle semantics.
