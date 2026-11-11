# Windows 070424f: readiness source reconciliation

This receipt records a reviewed change to `packages/windows-fluent/rnw-fabric/example/scripts/uia-smoke.ps1`.
Candidate blob `070424fa54f1645cc6be02187647f84732a6b53c` reconciles the external readiness
changes at umbrella commit `ac5d69585a52a6e945dc996ea08030e190574699`
with aggregate preimage `54c3dee9cce38f8a7ae143ea2fbfd4c34b43b7bd`.

**Review is static only. This candidate has not been parsed or executed by
PowerShell and has not run in Windows native acceptance.** No tested archive
or runtime outcome is claimed.

## Exact inputs

| Input | Git blob | UTF-8 bytes |
|---|---|---:|
| Aggregate preimage | `54c3dee9cce38f8a7ae143ea2fbfd4c34b43b7bd` | 43,426 |
| External script at `ac5d6958` | `8bd25374b1c3a24911d13b0a2e8e40b0b5d9f0f4` | 14,220 |
| Reviewed aggregate candidate | `070424fa54f1645cc6be02187647f84732a6b53c` | 44,307 |

Candidate SHA-256:
`60ba5d0a72ea23d47123507f3baa0059ac3bd78a4843a102db0e9391cdbc417a`.

The candidate adds 881 bytes and 16 LF characters to the aggregate preimage.
The [source review](source-review.json) retains all three input identities,
the four exact transformations, inverse verification and review limits.
The AppKit base reconciliation can carry the external script's exact bytes;
this receipt covers the separate, more complete aggregate script.

## Changes

1. Add `Set-ElementFocus` with a default ten-second retry window. It requests
   foreground activation for the supplied window, tries to focus the same
   control, and waits 250 ms between failed attempts.
2. Use that helper at the button keyboard-fallback focus call.
3. Use that helper at the home-item focus call before the navigation key
   sequence.
4. Move screenshot foreground requests into the existing polling loop and
   expand its retry window from five to ten seconds. Success still requires
   actual foreground HWND equality and the unchanged stable, positive bounds.

These windows do not cancel synchronous UIA or native calls and do not impose
a hard elapsed-time bound on those calls. The source does not assume that
every top-level UIA element rejects focus. No top-level-window focus request
was added.

The external focus helper converted the caught error to its message and read
the element's name after retry exhaustion. That can discard error details;
a stale element can also fail during the final name read and mask the focus
failure. This candidate retains the caught ErrorRecord with
`$lastErrorRecord = $_` and finishes with `throw $lastErrorRecord`.
It adds no later element-property read or arbitrary diagnostic output.

## Review and preserved behavior

The author, root reviewer and independent desktop reviewer each fetched or
held the exact source inputs, checked their identities, and reconstructed the
four changes and complete inverse. Reversing the changes restores preimage
`54c3dee9` byte-for-byte. These are source comparisons, not three additional
runtime test suites.

The foreground/stable-positive-bounds predicate is unchanged. The aggregate's
typed visible-button selector and InvokePattern path remain intact. Sixteen
other existing top-level functions are byte-identical, including owned-window
refresh, popup capture, pointer/drag operations, environment-related checks
and failure diagnostics. The full action sequence and catch/finally tail
are also byte-identical.

Popup capture still passes a null target to `Save-Screenshot`, so it avoids
the branch that changes foreground activation. Native menu, tooltip,
inspector, lifecycle, navigation, rejected/cancelled/accepted drag and
ownership assertions remain unchanged. The passed-only distribution gate
and workflow are unchanged.

## Remaining acceptance boundary

The existing [next-host requirements](../v1-windows-0578582-elevated-existing-shell/NEXT_HOST.md)
remain in force. This source reconciliation establishes no cause of, or fix
for, the observed elevated-host drag failure. It does not establish an
eligible interactive host, successful native input or a tested distribution.
All original failed-run receipts and original-archive requirements remain
unchanged.

Authoring and review created only immutable source/receipt blobs. This step
did not update PR60, a workflow, a branch/ref, a launcher, host permissions
or security settings, and did not trigger CI. Aggregate integration is
separate. An actual supported-host run must still use the reviewed candidate
and satisfy the existing gates.
