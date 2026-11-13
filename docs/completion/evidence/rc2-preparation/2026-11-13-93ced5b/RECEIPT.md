# rc.2 preparation checks

Source revision: `93ced5bcc383907279a6e8ac95bc8f2c589fcb95`.
Recorded 2026-11-13 with Node `v26.13.0`. This is source/metadata validation;
no release archives, checksum packet, tag or published release were produced.

| Check | Result | Actual output |
| --- | --- | --- |
| Sixteen manifest versions/private flags; isolated peer and example archive pins; unchanged root version and locks; desktop snapshot identity-only delta | Passed | `cohort.log`; executable check in `check-cohort.mjs` |
| Release-readiness, tested-package merge and consumer-integrity source tests | 23 passed, 0 failed, 0 skipped | `source-tests.log` |
| Prerelease readiness with the actual ledger and pending review, without archives | `candidate`; 0/341 canonical and 0/5 added rows accepted; owner review pending | `readiness.log`, `readiness.json` |
| Whitespace/error check | `git diff --check` exited 0, no output | No log text emitted |

Commands, from the repository root:

```sh
node docs/completion/evidence/rc2-preparation/2026-11-13-93ced5b/check-cohort.mjs
node --test tooling/tests/release-readiness.test.mjs tooling/tests/tested-package.test.mjs tooling/tests/consumer-release.test.mjs
node tooling/release-readiness.mjs --version 1.0.0-rc.2
```

The metadata check compares snapshots and all three tracked lockfiles with
T2's prospective head `3fc325dd4bc8c3979f7462130e73c2d05331a07c`. Workspace
peer declarations such as `workspace:^` remain unchanged; only the isolated
desktop peers have explicit rc.2 version pins. The private AppKit acceptance
driver remains a local source dependency, outside the release archive cohort.

Before preparation, PR #67's rc.1 changes were inspected: the package cohort,
desktop peer/example pins and desktop snapshot dependency identities moved
together, while the private root tooling version stayed `0.1.0`. There is no
version-bump script in the repository. The same mechanism is used here, now
including app-identity as the sixteenth archive.

Applied engineering 1.2.0 `deploy-checklist` and `documentation`, plus NYC-MON
no-ai-slop. Their output is
[`RC2-RELEASE-CHECKLIST.md`](../../../reports/RC2-RELEASE-CHECKLIST.md), with
pre-release gates, concrete packet checks and rollback triggers. The debug
skill located during preparation was also read and used to review the prior
T2 reproduction record; that receipt now states when it was loaded.

NOT RUN locally: frozen dependency installation, TypeScript compilation,
declaration regeneration, actual package packing/license-content checks,
installed consumers, browser/native execution and release workflow. The
desktop baseline edits are version-identity substitutions that CI must verify,
not generated output. No source test result is promoted to platform acceptance
or archive review. The owner's tag approval and stable checksum approval remain
separate pending actions in the checklist.
