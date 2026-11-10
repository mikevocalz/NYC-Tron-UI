# Desktop continuation checkpoint

This checkpoint records the reviewed AppKit Boolean correction and current
desktop gate status while the execution workspace is unavailable. It is a source
and metadata checkpoint. Original artifact retention and native acceptance keep
their separate requirements.

## Published source and current results

The base aggregate is `d2bcf8a0d09b47eea88d87e3bd70c6c8382e49a5`,
tree `afaf0ecf9033d8a197212522bb655aec8aab6108`. This checkpoint adds the
already reviewed private AppKit driver blob
`b01dccc74827a61ce5b2cfe3ededeca5c001b045` from candidate
`cea75ae6e088a5638d900154b85edeb4c84b0248`, plus these status records.

| Candidate | Confirmed result | Remaining inspection |
|---|---|---|
| AppKit `92c7882e` | Native compilation, same-process activation and both context-menu generations passed; strict permission-type assertion failed on numeric `1`. | Original receipt was verified and committed locally before the outage, but remains unpublished. |
| AppKit `cea75ae6` | Eleven source tests, installed consumer/API, Foundation probe and native compilation passed; runtime step failed. | Original artifact bytes and first failing assertion remain uninspected. |
| Windows `5a9709d9` | Native compile/deploy and real drag start passed; required rejected-drop result failed. Original 29-record trace contains no target events. | Actual native routing remains unresolved; a bounded driver diagnostic is under independent review. |

The [release-gate report](../../reports/V1-RELEASE-GATES.md) explains these
boundaries. [checkpoint.json](checkpoint.json) records exact commits, jobs and
artifact identities. The adjacent metadata snapshots are normalized connector
responses, not replacements for original ZIP bytes or runtime logs.

## Unpublished work to recover

The last known root workspace commit was
`3b5d45116c839d8df221ee27df3512319be294d3`, tree
`6a844fa8ed682d4bfe5b7bf5240e87c38cbf603f`. It includes the already-published
AppKit Boolean source and a local receipt at
`docs/completion/evidence/v1-appkit-92c7882-menu-pass-permission-type`.
Root verified the original 833,107-byte ZIP and all 42 original members before
the outage. The large compiler log remains inside the original ZIP; 41 other
original members were also retained directly. That receipt and its local
release-report edit have not been uploaded by this checkpoint.

The Windows Input routing analysis was staged in the separate
`nyc-tron-windows-routing-receipt` worktree, but its final edit and commit were
not confirmed. Preserve its original disassembly bytes and inspect actual
repository status before continuing. Do not recreate binary evidence from
summaries. The new Windows environment diagnostic was also uncommitted; its
remote replacement must be reviewed against fresh exact GitHub preimages and
validated as a new candidate. Earlier local tests do not verify later edits.

On workspace recovery, inspect each worktree and verify the original artifact
bytes before integrating them. Apply the missing receipt files without
overwriting newer source or status records. Extract and independently verify
current AppKit artifact `13810981867`, then diagnose its first actual failure.

## Unchanged completion requirements

All 341 original IDs remain: 332 local implementations and nine pinned external
implementations, including the twelve requested rows. Full acceptance across all
eight platforms remains 0/341. The latest full shared-source verification was
1,199 passing tests at `9aa8f61a`; later focused results do not constitute a
new full-suite pass.

PR57 stays at `0edd5f302e99877191ba9a412c5c060571a5f6c9` until desktop
convergence and final source freeze. Final verification must use the frozen
combined source and all fifteen original canonical archives. Neither failed
desktop run produced a passed native distribution. No release/tag, npm
publication, manual release dispatch, platform acceptance or owner approval is
created by this checkpoint.
