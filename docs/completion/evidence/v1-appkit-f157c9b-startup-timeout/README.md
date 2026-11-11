# AppKit: native compile passed; startup activation request timed out

The completed follow-up passed compilation and failed its first `tron.window`
show request at the unchanged client response deadline. The verifier had not
reached its `root-main` mount check or allocated tooltip evidence. This receipt
does not establish whether React had actually mounted independently.

## Exact tested source and results

[Run 42938338972](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42938338972)
tested helper `f157c9bf207f8ceae890e299f9667b56ab78360d`, tree
`ac12abeb27d91dcb978492d9aad187c4f198e3b5`, through actual PR merge
`6d6b913c771e49385e5a57c9737b66fbeb07a9a7`. Its ordered parents are
`0edd5f302e99877191ba9a412c5c060571a5f6c9` and
`f157c9bf207f8ceae890e299f9667b56ab78360d`. Root and the independent reviewer
verified the complete 2,048-leaf helper tree, actual merge tree and ordered
parents. The two changed paths contain exactly the reviewed failure-only
tooltip-summary source and the existing browser-fixture alias correction.

Source job 130253832763 passed **11 tests, zero failures and zero skips**.
Native job 130254009404 passed clean installed-consumer preparation, the
15-subpath/33-declaration API check, the real Foundation/socketpair probe and
ARM64 native compilation. Compilation completed at 01:43:44 UTC on November 11.
Interaction acceptance failed at 01:44:26 UTC. Evidence upload succeeded;
the passed-only tested-distribution upload was skipped.

## Exact first runtime failure

```text
Native driver response timed out awaiting tron.window (request 2)
```

The complete original native job log identifies `driver-client.mjs:36:43`.
The unchanged client deadline is 35 seconds. Its terminal failure still
preserves the owned connection for diagnostic capture before explicit close;
this run did not introduce a retry, another session or a longer timeout.

The verified source awaits authenticated readiness and the native `ping`
before the initial show request. Reaching request 2 therefore supports the
control-flow inference that those earlier awaits completed. It does not
extract the native command transcript or activation phase trace.

The verifier did not reach the root-main mount check, menu assertions, tooltip
evidence allocation, popover or drag acceptance. No `NYCTRON_TOOLTIP_EVIDENCE`
envelope occurs in the complete log; this is expected for this earlier failure,
and this run provides no new tooltip observation. Whether the application
received the request, returned a late reply, stalled in an activation stage,
or had particular thread state remains unestablished without the original
`app.log`, `commands.jsonl` and process evidence.

The [earlier 8fe late-reply receipt](../v1-appkit-8fe7404-late-activation-reply/README.md)
is a separate historical observation. Its late reply and sampled thread state
are not assigned to this run. The inspected current source and historical
evidence do not yet justify changing activation behavior or its strict gates.

## Inspected log bytes and producer-reported compiler identity

The complete original decoded source job log is **19,328 UTF-8 bytes**,
SHA256 `96b8d8007908227b0a57a169fc0a93556b6a6569fbd7f946826eb688972a5304`.
The complete original decoded native job log is **53,466 UTF-8 bytes**,
SHA256 `0a2057205499734cab358f8b9f5b07f4026a9825022cea7f9daecbe35eedef6c`.
Root and the independent reviewer separately retrieved matching complete
strings and byte/hash identities. Both logs identify the exact actual merge.

The single actual build-result envelope records `npm run build`, exit code
zero and success at that merge. It reports a complete, unnormalized compiler
transcript of **12,329,248 bytes**, SHA256
`45a25d2b6102fdf1c93344c48e8b6b7e2758be1b0d4a7558cb3e116e7d94d455`.
The compiler-file bytes remain unextracted and independently unverified.

The retained 318-byte `build-result-log-summary.json` is the exact envelope
JSON line, with only its timestamp prefix and log line ending removed and no
newline added. It is derived from the inspected complete log and is not the
original pretty-printed build-result file.

## Artifact and other-lane boundaries

Artifact **13820233523** reports **1,416,533 bytes**, SHA256
`014581509683a6b294ba66bb434cb76df06647152a31621917ef4549b91b6847`.
The upload reports 44 files. Original ZIP/member bytes, activation/client
traces, process metadata/sample and any screenshots remain unextracted or
unviewed while the local execution workspace is unavailable. These reported
artifact identities are distinct from the independently verified log bytes.

The separately retained [rendered-overlay pass](../v1-web-f157c9b-overlay-pass/README.md)
records 32 actual browser passes at this same merge and closes the helper's
observed missing-alias bundling gap. Its ZIP and PNG members remain uninspected.
The normalized workflow list also records six other completed workflows as
successful. This receipt assigns no additional test totals or interaction
claims from that metadata alone.

No complete native AppKit acceptance, final combined-candidate verification,
physical-device acceptance, owner approval or release follows from this run.
