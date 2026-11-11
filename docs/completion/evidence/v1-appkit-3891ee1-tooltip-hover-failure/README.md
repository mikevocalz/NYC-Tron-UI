# AppKit: native compile passed; tooltip hover conjunction timed out

The complete native job log is now inspectable. The build succeeded, and the first runtime failure is the strict tooltip-hover wait. The failed conjunction's individual observations remain in unextracted runtime JSON; this receipt does not infer cursor arrival, missing tooltip presentation or permission denial from the timeout.

## Exact tested source and results

[Run 42932762727](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42932762727) tested helper `3891ee1788e6722c922ef431c576f507c5591f60`, tree `335314d5b47567fa2db208096707a52d99b23a09`, through actual PR merge `8cf0e6fd70c9984c471560e432783e0881f0f63d`. Its ordered parents are `0edd5f302e99877191ba9a412c5c060571a5f6c9` and `3891ee1788e6722c922ef431c576f507c5591f60`. All 2,048 leaves and the actual merge's tree and ordered parents were independently verified.

Source job 130235314012 passed eleven tests with zero failures/skips. Native job 130235524253 passed clean installed-consumer preparation, the fifteen-subpath/33-declaration API check, the real Foundation/socketpair probe and ARM64 native compilation. Interaction acceptance failed. Evidence upload succeeded; passed-only package retention and distribution upload were skipped.

## Actual first runtime failure

```text
Timed out waiting for new visible native help-tag text after the posted pointer reaches the trigger
```

The stack identifies `verify-native.mjs:257:29`, whose unchanged source requires all of: actual cursor inside the trigger, a cleared pointer-sequence flag, and matching AXHelpTag text with nonzero tag and window frames. The console error does not reveal which required condition failed.

From the independently verified source order and this first error, the earlier menu and tooltip-property assertions, strict Boolean-type checks, enabled event-posting branch and outside/no-matching-help-tag baseline completed. This is a control-flow inference. It does not extract the runtime checklist, exact menu generations, final cursor position, final help-tag list or AX trust value. Those values remain uninspected in `tooltip-hover.json` and the command transcript. Later popover and native drag checks were not reached. The native behavior, twenty-second hover deadline and required interaction assertions were unchanged.

## Build log capture verified in the real run

The workflow retains the original `npm run build` stdout/stderr in a closed file, reports its byte/hash identity and preserves the command's exit status. The actual source-bound log envelope reports exit code zero and success for `8cf0e6fd70c9984c471560e432783e0881f0f63d`.

The producer reports a complete, unnormalized compiler transcript of **12,329,153 bytes**, SHA256 `bf800a11426fa2d749ecd29127fc72728e586704ebecb2d8c78dfca3554c78aa`. These compiler-file bytes have not been extracted or independently rehashed. The retained 318-byte `build-result-log-summary.json` is the exact JSON line from the complete native job log, with only the timestamp prefix and log line ending removed and no newline added. It is a derived log summary, not the original pretty-printed build-result file.

The complete original decoded native log is **53,338 bytes**, SHA256 `2d426308cff7b3151781a30ab18ed4b2d7cf226ec9292f9de91535ae624a3770`. Root and the independent reviewer separately retrieved matching complete bytes. The complete 19,421-byte source log is also retained. `provenance.json` records both complete log identities and the distinct producer-reported compiler identity.

## Original runtime artifact boundary

The upload reports 45 files in artifact **13818227148**, **1,448,094 bytes**, SHA256 `550dd8f292b02c1d8a2c7b5728802ef31b694341a25bdd652e67585ee889e078`. Its original ZIP/member bytes, runtime JSON and screenshots remain unextracted/unviewed while the local execution workspace is unavailable. Complete-job-log retrieval succeeded after the workflow's bounded reporting change; it did not recover the earlier cea job's first assertion or substitute for original artifact extraction.

The separately recorded [rendered-overlay failure](../v1-web-3891ee1-overlay-alias-failure/README.md) is a fixture alias gap already corrected in the aggregate. It is separate from this native tooltip failure. No complete desktop acceptance, final combined-candidate pass, owner approval or release follows from this run.
