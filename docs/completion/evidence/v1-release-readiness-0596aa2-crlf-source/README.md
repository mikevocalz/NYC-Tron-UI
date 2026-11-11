# Release publication test: CRLF source correction

This source checkpoint records a test-only line-ending correction published in
draft [PR63](https://github.com/mikevocalz/NYC-Tron-UI/pull/63). The release workflow already
declared a boolean `publish` input with `default: false` and guarded release
creation with successful gates plus the permitted event and explicit manual
opt-in. Those requirements are unchanged.

## Observed failure and reproduced defect

The Windows source job `130435532706`, run `42994633542`, checked out
`de54b75c752e57fbfd12cbf01e458bfd41788c45` and reported 1,204 tests:
1,202 passed and two failed. This receipt addresses the
`release-readiness.test.mjs:198` assertion, “manual publication must have an
explicit input.” The separate transport-retention EPERM failure has its own
review.

The complete original log was fetched by immutable blob and independently
rehashed: `058feca66e4a22a222bc2f6ca722154be9e8fa91`, 159,544 UTF-8 bytes,
SHA-256 `2a63568340e93933954ebe5ee651a0177ffbd29fe409e438703643b774de3b31`.
The selected failure occupies log lines 1446–1462.

The test's input-block regex requires literal LF newlines. Running its exact
body against the exact repository workflow passes with LF and fails at that
same assertion when only the workflow newlines become CRLF. The retained log
does not expose the failed runner's raw checked-out workflow bytes or effective
`core.autocrlf`. The reproduced defect is therefore established; the precise
checkout conversion on that runner remains unobserved.

The repository's `.gitattributes` pins LF only for
`docs/completion/baseline-roster.tsv`.
[Git's text/eol documentation](https://git-scm.com/docs/gitattributes) explains
that unspecified attributes leave checkout conversion to Git configuration.

## Exact source change

Only the final test's workflow read gains a comment and
`.replace(/\r\n/g, "\n")`. The candidate is 78 bytes larger.
Every original assertion and all eight evaluated publication cases remain
byte-identical. The exact reversible edit is in [source-edits.json](source-edits.json).

| Source | Before | After |
| --- | --- | --- |
| `tooling/tests/release-readiness.test.mjs` | `62ba8325d3695a6e04e2144f70748f72327abf90` | `d5f217076df126f8160982d07db05e8cee288889` |

The corrected test is 13,916 UTF-8 bytes; SHA-256
`beab3d0902035b7a3856c309e8f951221cca5bda02190857542d3e9bed5b17f3`.

These protected files are unchanged in the published commit:

| File | Git blob |
| --- | --- |
| `.github/workflows/release.yml` | `bc0460ccb6dd3b0dbcbaa1cd1801e69a2a20bd0c` |
| `tooling/release-readiness.mjs` | `e8430cb774fea68aee984a0170cd3107e9696ad7` |
| `.gitattributes` | `2473a84e6c5aee51974755c4b66af6e9648b587e` |

## Reproducible source checks

[review-checks.js](review-checks.js) contains five focused V8/mock groups:
exact identities and inverse; original LF/CRLF reproduction; corrected
LF/CRLF evaluation of the unchanged eight cases; unsafe input mutations; and
missing or weakened mutation guards. Seven negative variants are rejected
under both encodings, giving fourteen negative checks. Root reproduced the
same five designs and fourteen negative checks; this is not an additional
set of independent designs.

Evaluate that file to obtain its function, then call it with the exact
`{ source, preimage, workflow, manifest }` strings pinned by the script.
The manifest is blob `77216836f4b837e237504ab0dae035a911c3cca9`;
the check is blob `3c795786a7288649fe5d06ecf7b74accb610bca5`.
Both are reused unchanged in this receipt.

The check executes the extracted test body in V8 with mocked file reading,
assertions and `node:vm` evaluation. Full-file syntax also passed after
explicit import removal and an `import.meta.url` literal substitution;
the full module body was not executed. These results do not claim Node,
Windows, Git checkout or GitHub Actions execution.

## Published source boundary

Root reported a leased, nonforced publication at 09:44:44 UTC on November 11,
2026. A separate 09:45:58 UTC read confirmed draft PR63 head
`0596aa2e4441b2e3464a9fff32060cc10fb17481`, base
`25a6af6d020e34d790f6a4f3d9f117738b252f1e`, and generated merge
`8ff0adf28897e7fd7300f6ebac112513ee7a4dbe`. The generated merge has the
reviewed tree `6aad15f5f522da18a37fc5abe697953c71db92b0` and ordered
parents [base, head]. This verifies Git metadata, not an actual new runner
checkout or result.

The head's sole parent is `7a160c536b845d71487ba2997262daf3cf07cb9b`.
Independent full-tree verification covered 3,152 leaves and 513 directory
hashes: six expected replacements and 3,146 unchanged leaves/modes.
This receipt covers the release test; the other five changes are the
separately reviewed IslandConnection accessor and transport-retention fix.

New CI outcomes remain unobserved at this source checkpoint. Stable release
still requires platform acceptance and owner distribution approval.
