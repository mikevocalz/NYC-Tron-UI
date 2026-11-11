# AppKit bd3: completed workspace source, types and packaging checks

[Source run 43007236028, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43007236028/attempts/1)
completed successfully for `bd3ba9af7bba06ab2653806a3acf2525e28927a7`.
All three original checkout logs identify
`2c20b0ea6a2670a744b4199202bbb902de2270a8`, tree
`21b26dbe190f534212be5f546c9f5ac0ebb1a2c6`, with ordered parents ac5d then bd3.

## Actual completed results

| Job | Result |
|---|---|
| Linux contracts and dependency boundaries, 130477637755 | 1,187 tests passed; zero failed, cancelled or skipped; 21,153.908536 ms |
| Windows tests and packaging, 130477637414 | The same 1,187 tests passed; zero failed, cancelled or skipped; 42,579.4062 ms; thirteen tarballs and seventeen fresh imports reported |
| TypeScript and public API, 130477637778 | Passed; thirteen packages, 619 export subpaths and 3,306 reachable declarations; thirteen tarballs and seventeen fresh imports reported |

The roster verifier reports **341 canonical IDs, 332 local implementations,
nine pinned external implementations, zero partial and zero pending**. It also
reports **zero accepted with all eight platform proofs**.

These are two executions of the same helper suite, not 2,374 distinct contracts.
This AppKit helper is based on ac5d; its 1,187-test suite is distinct from the
aggregate-based Windows0596 1,204-test result. Neither is a completed final
combined-source run. The separate native-workflow core thirteen tests are not
added to these counts.

## Evidence and limits

The three complete original logs retain their decoded UTF-8 bytes, BOMs and
original LF/CRLF endings. [provenance.json](provenance.json) records exact Git
identities, SHA-256 values, byte counts and source line references.
[metadata.json](metadata.json) records the completed attempt, jobs and steps.

The [active-owner source receipt](../v1-appkit-bd3ba9a-active-owner-source/README.md)
describes the reviewed correction and its source/mock boundary. Native workflow
43007235899 remains a separate pending result at this checkpoint.

Reported tarball names, hashes and imports are producer evidence. Original
tarball and ZIP bytes were not independently inspected here. No native,
supported-host, physical-device, spoken-output, performance, original final
archive, or owner-manifest gate is promoted by this source pass.
