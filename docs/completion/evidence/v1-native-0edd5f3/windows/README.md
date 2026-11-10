# Original Windows capture-driver failure

[Run 42847218074](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42847218074)
tested PR head `0edd5f302e99877191ba9a412c5c060571a5f6c9` through merge
`e597d73757911e9a58005d577b3c2bf2496bd798`. The isolated source gate, native
library, installed app compilation and packaged deployment passed. The native
job **failed** at its first screenshot, before a navigation or lifecycle
assertion completed in this attempt.

The capture helper called UIA `SetFocus` on the top-level
`Microsoft.UI.Windowing.Window`; that element cannot receive keyboard focus.
`failure.log` preserves the original failure-stage log excerpt. `ui/uia-tree.txt`
is the unchanged original artifact payload. The downloaded ZIP's SHA-256 was
independently verified against GitHub's artifact digest. No screenshot or
passed-only package artifact was produced, and no native executable hash was
independently verified for this run.

The correction removes that top-level keyboard-focus call. It retains actual
`SetForegroundWindow`, exact `GetForegroundWindow` equality and stable nonzero
bounds before capture. Control-specific keyboard focus remains part of the
interaction driver. The correction requires a new native run; the earlier
successful Windows checkpoint remains bound to `0a4f34b`.
