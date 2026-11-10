# AppKit mount timeout with a live process sample

[Run 42890131895](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42890131895)
passed the source job's four real socket regressions and four archive checks,
canonical core packaging, ARM64/Xcode 26.2 verification, clean installed
consumer preparation, the installed API snapshot and native compilation.
The retained compiler excerpt ends with `BUILD SUCCEEDED`.

The complete eight-line command trace records successful socket connection,
protocol-1 authentication and main-queue ping. Request 2, the initial
`waitFor` for `root-main`, received no response before the client's 35-second
deadline. Its native timeout argument remained 20,000 ms. The exact failure was:

`Native driver response timed out awaiting waitFor (request 2)`

No interaction group completed. The activation request and native tooltip/drag
permission observations were never reached. The strict native gesture gate
remains required; this run emitted neither a passed report nor a tested-package
receipt.

## What the corrected capture established

The failed client retained its existing authenticated connection until capture
finished. The original process receipt lists the launched app, PID `35347`,
both before and after sampling. The sampler exited successfully and captured
25 thread groups. `live-process-sample-excerpt.txt` retains the complete call
graph, its summary and the native application image identity, with original
line numbers. This is usable process evidence, unlike the empty graph from the
preceding d42 run.

The main thread is servicing an AppKit event loop, timers and native layout.
The JavaScript thread has 99 of 101 samples in its run-loop wait and two in
microtask execution. Thread `91078` has 101 samples in `__recvfrom` beneath
application offsets `0x13f900` and `0x13fdc4`. No semaphore wait appears in this
sample. These observations do not establish a startup deadlock.

The two application frames are unsymbolicated. The original artifact does not
identify their exact functions or record whether the missing reply was
serialized or sent. It contains no observation of nonfinite geometry or a JSON
serialization error. The sample also starts after the timeout, so it cannot
establish thread state throughout the preceding 35 seconds. The original mount
timeout cause remains unresolved by these artifacts.

The separate source-job excerpt records eight passes, zero failures and zero
skips on the actual Ubuntu CI host. This includes real socket coverage for
terminal timeouts, preserving the session for capture, discarding late frames,
preventing writes after failure, handshake ownership and explicit close. It is
separate from native application acceptance.

## Source and artifact identity

The PR head was `c0f660128772f79f08f03d9025f011af94e2ab46`; the actual CI checkout
was merge revision `29044e62ed43e440f3771ff5bff03fcdb30a8e94`. Both have tree
`f061f63b35e056c4b560795974225dd1750bc246`.

Artifact `13799501902`, `macos-appkit-native-evidence`, was verified before
extraction against GitHub's SHA-256:

`9dd758b97b80ab011c8f887ac1833249765e9fe8430d5293ba4db85f741d83cd`

The original sample's SHA-256 is
`e75f8e01ac2611016ff3221a92208f522e801ee9b53618c087e9e4deea9274eb`.

`provenance.json` identifies the original ZIP, complete command trace, sample,
native compiler log and source-job log by hash. The command trace, process
receipt, app log, failure, invocation, toolchain and native payload manifest are
copied unchanged. The preparation summary identifies the exact installed
archives. These hashes identify a successful compile and failed runtime attempt;
they do not identify an accepted distribution.

The complete original 802,141-byte artifact is also retained unchanged as
`original-native-evidence.zip`, with the same ZIP SHA-256 recorded above. It
preserves the full sample, compiler log and original preparation record behind
the compact excerpts and summary. Root independently verified all 28 original
members and every retained source/excerpt before adding this copy.
