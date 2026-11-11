# AppKit 0bee attempt 2: secondary-window policy refusal repeated

[Run 42985584907, attempt 2](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42985584907/attempts/2) compiled the same 0bee source and failed when the verifier requested the secondary document window. This separate native execution does not close the complete AppKit gate.

## Exact execution

| Item | Identity |
| --- | --- |
| Helper head | `0bee669639a5d9ffaa7c456343344ccd42283c04` |
| Actual checkout | `3f9d3ad376bd6b4514ca691997c56dfc74888bec` |
| Native job | `130411620710` |
| Core job listed for attempt 2 | `130411622915` |
| Executed native driver | `6f119bca252082f18f573370e853bf2e86128934` |
| Executed verifier | `f21e9349b35922ad689a2f6320ed651b5557de64` |

The actual checkout is recorded at native log line 113. Its complete tree and ordered parents, `ac5d69585a52a6e945dc996ea08030e190574699` then `0bee669639a5d9ffaa7c456343344ccd42283c04`, were independently verified with the [attempt-one receipt](../v1-appkit-0bee669-secondary-policy-refusal/README.md). This attempt uses the same source, before the external 057 activation change and before PR62's explicit close-completion witness.

## Native result and source-job reuse boundary

Compilation and the installed API/native transport steps succeeded. The actual-controls step failed. Original native log line 537 reports **The native test host refused interactive activation policy**; stack lines 540–541 identify `show` and verifier line 1212, `await show('document-1')`. Line 544 reports exit code 1 at **08:47:34.2043000 UTC**. The exact tested distribution step was skipped.

The complete decoded 80,372-byte native log is retained verbatim. Its SHA-256 is `636d5ccfabc54ab9df44ffcbee363cda6db72cefa9bcbc1cbeed8db6723ad36e`; its Git blob is `1f97c28e8794c9026d4f07d7bda59ea73aee149d`. Selected build, tooltip and startup JSON are present inside that original log; this receipt does not add new projection files or infer uninspected pixels or detailed command records.

The attempt-two API lists a successful core job, but reports **08:15:27–08:15:50 UTC**, before the native retry began at **08:28:53 UTC**. That job's fetched 19,614-byte source log is byte-for-byte identical to the [source log already retained for attempt one](../v1-appkit-0bee669-secondary-policy-refusal/source-job.log), Git blob `142302be32d13db6f5b8356054474fae554531c7`, SHA-256 `18930c31d6bc6a1c77f08c2af02efb70f6b19019ddc3a6ee9a6cc9bf8ac28442`. The metadata and original bytes are preserved as reported. They do not establish a second independent source/producer execution.

## Artifact and inspection limits

The native upload reports **53 files**, artifact **13840489142**, **1,662,239 bytes**, SHA-256 `2b38396c9d74628337aa37ec8ca991e80d1b4148cdc83d90344bf7be74811369`. Original upload lines 579, 586 and 589 agree with the API metadata. This artifact is distinct from attempt one's 13839409875 artifact.

The ZIP digest is producer/API-reported. Original ZIP bytes, members, compiler transcript, raw tooltip/command files and pixels remain uninspected. No final native pass, tested archive, underlying activation failure cause, or acceptance of later source is inferred. Root did not retry or cancel this run. This receipt only retains completed external execution evidence.
