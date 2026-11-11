# AppKit window-show observation source checkpoint

This is a **prepared source checkpoint**, not a native acceptance result. Commit
`c4d4148c6135b9e3054255d9e35a950bef959b71` has tree
`34309184ac033c77f891ff18880d55f34dfbbcd8` and sole parent
`e08679769e471aba5403cd864c8a2fa2310b9086`. It changes only
`examples/macos-appkit/spark/verify-native.mjs`, from blob `d21bf8d24520183a61bf6b82879d78bd6a9d322f`
to `ae88774e652cab55d556b5cd94da0a85d2505a45`. Root and independent review verified
the complete 2,050-leaf map and recomputed all 284 tree-object hashes; the other
2,049 leaves and their modes are unchanged. Publication and native execution are
not asserted by this receipt.

## Purpose and boundary

The completed e086 run failed its second document-window show at the existing
visible/key/application-active/frontmost conjunction. Its retained console
projection did not expose the late inspection values needed to distinguish those
predicates. This change records a bounded selection of the values **already
returned** to that polling loop. It does not establish why that run failed or
resolve the separate completed 057 shown-popover failure.

Only two reversible edits are made. The first adds typed capture/report helpers;
the second calls them around the existing show polling. The activation request,
request identity checks, process/policy/key-capability assertions and final
conjunction remain unchanged. The original `waitFor`, its 20,000 ms deadline and
50 ms polling delay are byte-identical. Every byte from `const control =` through
the end of the verifier, including the outer failure collector and cleanup,
is unchanged. There are no extra native requests, post-failure witness calls,
focus actions, shipping/native observer changes, or workflow changes.

The record distinguishes assertion facts from conjunction facts. Missing or
wrongly typed values remain `null`; they are never converted into observed false.
Only the fixed owner labels `main` and `document-1`, validated numeric provenance,
fixed labels, and Boolean/null observations are retained. Raw native labels,
tokens, arbitrary error strings, and paths are excluded.

The selection contains the first response, the latest six state changes and the
last response, with at most eight records and explicit omitted-response/change
counts. Count overflow becomes unknown. Successful polling writes and logs
nothing. On a polling failure, the helper attempts the fixed
`window-show-failure.json` file with exclusive `wx` creation, then emits one
complete JSON console envelope of at most 8,192 UTF-8 bytes including delimiters
and newlines. Write failures use fixed error categories; projection, file and
console errors remain secondary. The original show error object is rethrown.
This diagnostic makes no original-file hash or readback claim. Activation-request
failures before polling keep their existing diagnostic path.

## Existing artifact collection

Both exact workflow sources already collect the new file; neither was edited:

- Helper workflow blob `c46871c2e8b065b478da8ed1946432a2d05502b9`
  sets `APPKIT_EVIDENCE` to the runner's `nyc-tron-appkit-evidence` directory
  at line 158, and the `if: always()` upload includes that whole directory at
  lines 161–169.
- Aggregate workflow blob `73a526c3768fa21b3d8a0b071db47ebfa9cc5bf8`
  has the same binding and directory inclusion at lines 177 and 180–188.
  Its existing shared-archive and other evidence paths are unchanged.

The verifier resolves its output from `APPKIT_EVIDENCE` at line 13 and writes the
fixed JSON beneath it at line 1067. This proves configured source inclusion,
not that a future write or artifact upload has succeeded. The separate
passed-package artifact remains conditional on successful native acceptance.

## Reproducible review

[review-checks.js](review-checks.js) contains **eight review designs**. The author,
root and independent reviewer reproduced those same eight designs; reproductions
are not additional independent designs or native runs. They cover exact identities
and two-edit inversion, typed false/unknown distinctions and privacy, bounded
selection, original timeout/error identity and command sequence, success behavior,
assertion/inspect failures, secondary write/log failures, and envelope limits.

The deterministic mock timeout used 400 inspection responses, 401 total commands
and 20,000 mock milliseconds. Original and candidate command sequences matched.
The ordinary and maximum-valid envelopes were 1,160 and 2,844 bytes. These are
V8 source/extracted-function tests with mocked filesystem, console, driver and
clock. Whole-verifier syntax was checked without executing its runtime body.
No actual Node filesystem, AppKit, GUI timing, native CI or distribution pass is
claimed. Native sampling remains sequential and non-atomic; added projection
work has unmeasured runtime overhead.

Evaluate the complete review script to obtain its async function, then pass
`{ source, preimage }` containing the exact candidate and predecessor strings.
[edit-manifest.json](edit-manifest.json) retains the exact two reversible edits,
identities and detailed review scope. [source-review.json](source-review.json)
binds this checkpoint, the unchanged review artifacts and collector source proof.
