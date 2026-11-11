# Bounded iOS command-output reporter — source review

This source-only checkpoint was recorded at 2026-11-11 14:34:09 UTC.
It adds a private tooling reporter and eight focused unit-test designs over
`fc901030ba1e0eed1b399ad0a3100529bf97e52f`. No ref was moved or CI run
dispatched by the author. Actual Node, filesystem, shell, simulator and iOS
execution remain pending.

The change addresses an evidence gap when complete iOS job logs cannot be
retrieved and the UI runner exposes only a generic top-level failure. It does
not explain the earlier failed touch assertion or the `Transport closed`
retrieval errors, and it does not change native behavior.

## Exact additions and composition

| New source path | Reviewed immutable blob |
| --- | --- |
| `tooling/native/report-ios-command-output.mjs` | `114c9490410b7b1598b6ec416b14a35cfb3dc233` |
| `tooling/tests/ios-command-output.test.mjs` | `e240477f92344c1ef506c0afbc27aff60e407e52` |

[addition-manifest.json](addition-manifest.json) records full byte/SHA-256
identities, the two additions and their inverse, fixed paths, budgets and
unchanged-runner proof. The existing UI runner stays exactly
`3cac0f88b939d1ed1619396bd1fc2aa58f6061af`.

The separate [workflow capture receipt](../v1-ios-c6c5142-command-output-source/README.md)
covers Forge's `c6c51423a0fcbab4768751bd8f1e04d2939f20fe` workflow candidate.
That wrapper invokes:

```sh
node "$GITHUB_WORKSPACE/tooling/native/report-ios-command-output.mjs" <build|ui> <shell-exit-status> "$NYC_TRON_CONSUMER"
```

The wrapper runs each original command at most once, captures its existing top-level
stdout/stderr, calls this reporter secondarily, and preserves its saved result.
For build, the reporter receives the actual xcodebuild/capture status while the
original terminal-test convention still maps the workflow step to zero or one.
For UI, the step returns the saved runner/capture status exactly.

A capture-directory or redirection failure can occur before a command launches.
The reporter therefore labels the supplied number as a **capture-setup,
command or redirection result**. It never infers launch, a native signal,
workflow-step status or fresh output merely from that number or file presence.

## Inputs, hashing and interpretation

Build inputs are the fixed `/tmp/xcodebuild.log` and sibling
`ios-command-output/build-stderr.log`. UI inputs are the fixed sibling
`ui-stdout.log` and `ui-stderr.log`, plus already-produced JUnit and command
records under the four fixed iOS flow directories.

Those four flow/attempt slots are configured evidence locations:
`settings`, `settings-retry`, `editor` and `pointer`. Listing an absent
slot does not prove an execution or recovery attempt. JUnit fields count
supported XML structure; they are not acceptance verdicts. The command
projection selects the first failed entry in the inspected top-level array
order. It does not infer chronology or an uninspected tail.

Top-level streams are read and hashed as raw bytes. Existing runner text remains
UTF-8 decoded and subject to its unchanged 32 MiB subprocess buffer limit.
The reporter does not re-execute the driver or reinterpret that text as a
complete raw native stream. See the
[Node child-process contract](https://github.com/nodejs/node/blob/v24.x/doc/api/child_process.md)
and the exact runner identity in the manifest.

Input reads use regular-file descriptors without following final symlinks.
A complete-file SHA requires EOF within budget, matching before/after/current
file observations and successful close. This is a sampled file observation,
not an atomic snapshot or proof that the producer finished writing.
For an over-limit input, `bytesRead` includes the one-byte probe and
`hashedBytes` identifies the exact prefix covered by the hash. Changed or
unconfirmed inputs never receive a complete-file claim.

The limits are 8 MiB per wrapper stream, 1 MiB per command record file and
256 KiB per JUnit file, each with at most one extra probe byte. A command-file
search stays inside its fixed flow directory, with depth five and 128 entries
plus one budget-stop probe. Ambiguous, symlink, missing, changed, denied,
over-limit and close-failed observations remain explicit unknowns.

## Output and preserved behavior

The reporter creates one fixed phase-summary JSON file exclusively, then
re-reads the closed file before reporting its retained-byte hash. Duplicate or
failed writes never overwrite a prior receipt or pretend a replacement was
retained. Originals remain unchanged.

The console emits only fixed enums, booleans/nulls, counts, known fixture
identifier labels and hashes. It omits raw paths, arguments, entered text,
test names, error messages and native signal guesses. The complete envelope,
including both marker lines and newlines, is capped at 8,192 bytes. If detail
does not fit, valid JSON states the omissions. The separately retained typed
summary has a 32 KiB cap.

No UI command, assertion, timeout, recovery rule, retry allowance, launcher,
host/security setting, hierarchy capture or cleanup action changes. The runner
is not edited. Reporter failures remain secondary to the wrapper's original
result.

## Focused checks

The new test is discovered by the existing general source suite:
`package.json` calls `tooling/run-tests.mjs`, which uses
`tooling/test-files.mjs` to include `tooling/tests/*.test.mjs`.
No new workflow test step is required.

[review-checks.js](review-checks.js) binds both complete source identities and
reproduces the same eight unit-test designs with explicit V8 compatibility
shims and mocked file IO. Each POSIX and Windows-separator variant passes
148 assertions. The ordinary complete envelope is 4,603 bytes, and its retained
mock summary is 4,351 bytes. These are two environment variants of eight
designs, not sixteen independent designs.

The checks cover exact raw-byte hashing and EOF, prefix limits, changed and
failed-close inputs, fixed assertion projection, XML structure, ambiguous
discovery, exclusive readback retention, secondary reporter errors, privacy
and the complete output bound. Root and Final independently approved the source and reproduced those same
variants after the explicit hashed-byte and mock path-normalization corrections. [source-review.json](source-review.json) records the precise
scope and remaining limits.

These checks do not execute Node, real filesystems, Windows, macOS, XCTest or
iOS in this session. The next ordinary changed-source CI run remains the
meaningful validation of actual capture and any newly observed failure.
