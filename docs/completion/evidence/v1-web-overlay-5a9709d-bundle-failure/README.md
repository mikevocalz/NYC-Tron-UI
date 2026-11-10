# Web overlay helper bundle failure

This receipt retains [run 42912913105](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42912913105),
job [130167879355](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42912913105/job/130167879355),
for PR 60 head `5a9709d9f7c7aa819d36fd68729f11e0cf3295b8`.
The actual checkout was merge `ea5f13f4ecff638c7c1d062403c62e2227fa9513`,
tree `7562beb4363bbc54797b75a41f6d9525eb008faf`.

## First failure

Checkout, Node 24.19.0, the isolated dependency installation, and the Playwright
Chromium installation succeeded. The test step failed while esbuild was bundling
the fixture for Playwright's web server:

```text
packages/ui/src/components/overlays/popover-position.ts:2:61
Could not resolve "@nyc-tron/core/overlays"
```

The helper's browser fixture aliases `@nyc-tron/ui` to repository source. That
source now reexports shared placement functions from `@nyc-tron/core/overlays`,
but the helper's isolated dependency list and esbuild aliases do not resolve
that subpath. No rendered assertion ran. Both upload actions reported no matching
files, and the run's artifact list is empty. The observed failure is an isolated
fixture resolution defect; the log does not show a transient dependency or
browser download failure.

## Aggregate comparison

The aggregate at `4be2f08c11cb2d68e3d4991f960ddd15a1b06f5f` already contains the
exact alias correction from `2899ffdedf98e2a86c077f15aa1baf6401c07b80`:

```js
"@nyc-tron/core/overlays":resolve(here,"../../../core/src/overlays.ts"),
```

The fixture continues to bundle the real shared placement implementation.

| Source | `packages/expo-controls/tests/browser/server.mjs` blob |
| --- | --- |
| Failed helper merge | `4fdde0ddb7c1a3befdc00dc89038d4ea9af7d606` |
| Aggregate at `4be2f08c` | `2687299e55689f6fca67d7a8904eb85923d2aaa9` |

The file difference is that single alias line. No duplicate source correction
was created. This receipt does not assign the helper's bundle failure to the
aggregate, which has different fixture content.

## Local validation and runtime limits

An isolated worktree at the aggregate revision reused the existing browser
dependencies through a temporary dependency-directory symlink. The lockfile
SHA-256 matched, and the installed esbuild, Playwright, React, React DOM,
React Native Web and Zustand versions matched the pinned versions. Nothing
was installed, and the source files and existing assertions were unchanged.

The original `npm test` command built the actual fixture and started its web
server. Playwright reached the 32 scheduled tests, but browser creation failed
because the pinned `chromium_headless_shell-1234` executable was absent.

One additional invocation used the existing system Chromium 156.0.8078.79 through
the retained external configuration. It kept the original test files, assertions,
server command and zero retries. Browser creation failed at
`process_singleton_posix.cc:297` with `socket() failed: Operation not permitted`,
followed by a crashpad `ptrace` permission error. No escalation or permission
change was attempted. This browser also differs from CI's Chrome for Testing
151.0.7922.34, and local Node was 24.22.1.

These attempts verify that the aggregate fixture passes the previously failing
bundle/startup stage. They provide no rendered browser acceptance: all 32 entries
failed during browser setup in each attempt, before their assertions. The full
local logs and exact invocation metadata are retained in `local-validation/`.
The per-test browser-launch attachments remain intermediate scratch outputs;
they contain no rendered application evidence.

## Retention

`original-job.log` is the complete decoded GitHub job log serialized as UTF-8
without line-ending normalization, preserving its leading BOM. Its original
41,610 bytes have SHA-256
`25171340aa6e592d943d242c4a744e99e318617e70d14187d40858771bd7b866`.
Root independently retrieved the job log through the GitHub connector and
confirmed equality with the complete retained decoded string.

`checkout.json`, `workflow-run.json`, `workflow-jobs.json` and
`artifact-metadata.json` record the observed revision, job steps and empty
artifact inventory. `provenance.json` separates the failed helper from the
already corrected aggregate and records the local runtime limits.
`manifest.json` hashes every other retained file in this directory.

No helper branch was published and no workflow was rerun during this review.
