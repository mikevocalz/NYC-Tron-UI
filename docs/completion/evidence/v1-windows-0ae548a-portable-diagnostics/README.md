# Windows failure diagnostics: portable regression evidence

Candidate: `0ae548a01fabd7bfcddefc55ed53e3a637e39fc8` (tree
`81c0f37c0836650b00b6c17f3df90b91aac4301a`). This records four focused
regressions run under PowerShell 7.5.4 on Linux against the actual production
functions and final error handlers. It is not a Windows native acceptance
result, a Windows PowerShell 5.1 run, or UIA/registry/WER integration proof.

## Observed checks

1. A populated tree is replaced by an explicit empty snapshot; root identity
   remains separate from child identity. Enumeration failure records unavailable
   descendants rather than a fabricated child count.
2. A real Linux child process exits with code 7. Its retained process handle
   preserves its original PID, start time and exit code alongside the original
   failure and window identity.
3. Mocked Application Error/WER input is filtered by application, process and
   bounded time/query parameters. PID-less WER records keep their weaker match
   label, and a failed query is distinguishable from an empty successful query.
4. Every secondary failure diagnostic and cleanup is made to throw. The
   original strict assertion remains the thrown ErrorRecord, and process
   observation precedes capture and cleanup.

The [original output](original-root-verification.log) records all four passes.
The [original harness](original-regressions.ps1) is retained byte for byte,
including its historical absolute input/output paths. It extracts production
function and error-handler AST nodes; it does not substitute a reimplementation
of those functions. The production source in that input worktree and the root
integration worktree independently matched the hashes in
[verification.json](verification.json) before retention.

The [PowerShell provenance](powershell-provenance.json) identifies the official
release asset, exact archive size and SHA-256. The original downloaded archive
was rehashed independently while retaining this receipt. It is not vendored in
the source repository.

The real Windows result must come from
[run 42887781630](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42887781630)
and its actual checked-out revision. No source row, platform acceptance or
passed-only native archive is inferred from these portable checks.
