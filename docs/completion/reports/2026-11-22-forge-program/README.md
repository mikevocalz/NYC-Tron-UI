# Historical Forge-program source snapshot

Retained 2026-11-22 from NYC-Tron commit
`0e09d3be8263b3dbb2eab1a78e5dd66b83b68e44`. The original ledger, frozen
baseline, validator and regression tests are preserved byte-for-byte under
their former relative paths. `ARCHIVE.json` records the source and hashes.
The scoped Git attribute disables text conversion for this archive so Windows
checkouts preserve the same bytes.

The active application acceptance program now belongs to
[Nitro Forge](https://github.com/mikevocalz/nitro-forge/blob/5902e64d6ad01090f5e9a40f8402ec0cbcb39a71/docs/completion/library-progress.json).
These historical files do not define NYC-Tron's library inventory or stability.
Their relative source/evidence locations refer to the original repository tree,
not a new package tree inside this archive. Existing phase reports and proof
files remain at their original URLs; the paired audit checks their pinned bytes.

Do not execute the archived validator as a new release gate. The small temporary
tooling bridge supplies the actual repository root to preserve the previous
policy only until the separate T3 validator change lands. It checks the ledger
snapshot hash and never changes acceptance or approval. The original regression
tests remain runnable explicitly against their own temporary fixtures.
