# AppKit 1283fd6: compile step cancelled; runtime skipped

This receipt records the completed [AppKit workflow 42977406794](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42977406794) for helper `1283fd6dea6cead03be7d0eb22863e02dbe648fd`. The native compile step was cancelled. Runtime acceptance was skipped, so this run establishes neither successful application compilation nor an application-runtime outcome. The cancellation actor and cause are unknown from these records.

## Exact checkout

The event was `pull_request`. Both complete job logs identify actual merge checkout `039390442b53ef8a44ca413246cb56ae29f3e095`: source-log line 123 and native-log line 113.

- Helper: `1283fd6dea6cead03be7d0eb22863e02dbe648fd`.
- Helper ordered parents: `79a51bb7663bffe130568f81e276ded0e0b065b9`, then `ac5d69585a52a6e945dc996ea08030e190574699`.
- Actual merge ordered parents: `ac5d69585a52a6e945dc996ea08030e190574699`, then the helper.
- Shared exact tree: `8bafabc7750c8a087a56a9a309fbd04f5ea0d377`.
- Full tree verification: 2,050 leaves and 284 recomputed tree objects.
- Source job: [130379594331](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42977406794/job/130379594331).
- Native job: [130379756212](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42977406794/job/130379756212).

The completed direct-head 79a run has a different checkout and outcome. Its startup and tooltip observations do not constitute runtime evidence for this cancelled merge run.

## Observed boundary

| Gate | Result |
| --- | --- |
| Source checks | 13 passed; 0 failed, cancelled or skipped; reported duration 459.23365 ms |
| Installed-consumer tests | 16 passed, 0 failed |
| Installed public API | Matched 15 typed subpaths and 33 reachable declarations |
| Native Foundation/socketpair transport probe | Seven original/patched cases, trace privacy and explicit closed-peer failure passed |
| Native compile step 9 | Cancelled |
| Runtime acceptance step 10 | Skipped |
| Evidence upload step 11 | Success |
| Tested-distribution upload step 12 | Skipped |

These counts represent different gates and declarations, not a combined native-acceptance total.

Native-log line 509 records `The operation was canceled.` at **2026-11-11T07:24:17.8062860Z**. The completed job metadata agrees that the compile step was cancelled and the runtime step skipped.

There are **zero actual build-result, startup, tooltip or predeadline-sample envelopes** in the completed native log. The displayed shell source contains build-marker strings, but it does not emit a completed build-result envelope. No compiler transcript hash, successful build status, runtime diagnosis or native acceptance may be inferred from those echoed statements.

## Retained originals and artifact limits

The complete decoded job logs are retained without trimming, ANSI removal or newline normalization:

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| source-job.log | 19,521 | `12cf24c97cdd3aa3c27e724cc5125c2cadd793228bfb9701db6caf933f97482a` |
| native-job.log | 51,702 | `4404defc5e94fe1672ee4a362bfdff51f01f9006e64ef91f780f7c46e0df1708` |

The normalized [workflow metadata](workflow-metadata.json) retains the completed run, steps, source identities and artifact records. [provenance.json](provenance.json) records the exact identities of these receipt files.

Native artifact [13836627511](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42977406794/artifacts/13836627511) is reported as **672,407 bytes**, with SHA-256 `0aa03e18f534cfa15b6276874a10c1916e12a8a99a2e0e1f06f743556640ca61`. The upload reports 32 files. The archive and its original compiler output or other members were not extracted or inspected; the archive size, digest and member count remain producer/API-reported.

No dispatch, rerun, cancellation, source edit, ref update or PR change was performed by this receipt's author. This receipt preserves the cancelled run's actual boundary without assigning a cancellation cause or claiming full AppKit, release or eight-platform acceptance.
