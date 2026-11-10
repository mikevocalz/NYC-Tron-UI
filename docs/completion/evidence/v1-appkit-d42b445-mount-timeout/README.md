# AppKit initial mount timeout with an empty diagnostic sample

[Run 42881937117](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42881937117)
passed canonical core packaging, ARM64/Xcode 26.2 toolchain verification and the
Swift probe, clean archive consumer preparation, the installed API snapshot,
and standalone native AppKit compilation. The retained compiler excerpt ends
with `BUILD SUCCEEDED`.

The app launched as process `41856`. The complete eight-line `commands.jsonl`
records successful socket connection, protocol-1 authentication and native
main-queue ping. Request 2 was `waitFor` for `root-main`, with a native timeout
argument of 20,000 ms. It received no response before the client's 35-second
deadline. The exact failure was:

`Native driver response timed out awaiting waitFor (request 2)`

No interaction group completed. The `NSWorkspace` foreground request was never
reached, so this run does not validate or disprove that correction. The
success-only tested-package upload was skipped.

## Diagnostic limitation and follow-up

The process sampler exited with status 0, but its `Call graph:` section is
empty. `empty-process-sample-excerpt.txt` retains the original header, empty
graph and beginning of the binary-image section, with original line numbers.
No main-thread, JavaScript-thread or socket-thread state can be inferred from
this sample. The original sampler receipt and app log are retained unchanged.

Review found a concrete capture-order defect: this revision's client destroys
the socket when its local read timeout fires. Only afterward does the verifier's
catch block start sampling. Spark ties the application's lifetime to session
disconnection, so the capture cannot guarantee that its target remains alive.
The child's recorded `exitCode` and `signalCode` were still null before the
synchronous sampler call; that does not establish process lifetime throughout
capture.

The diagnostic correction returns an immediately owned client handle with an
explicit handshake promise. A timeout terminally fails that session, prevents
new writes, and discards late responses while retaining the connection until
the verifier finishes capture and explicitly closes it. It preserves the
35-second default, single session and strict native assertions. Bounded process
snapshots before and after sampling, and an explicit thread-stack presence
field, make an empty graph distinguishable from usable diagnostic stacks.

The original initial-mount timeout remains unexplained by this artifact. The
capture correction requires a new native run; it is not a demonstrated startup
repair. No tooltip-hover or native-drag permission observation was reached.

## Exact source and artifact provenance

The PR head was `d42b44529887b17976ff18b1f4084b22f1a932ee`. The actual CI checkout
was merge revision `70252f011f9f1a72b82f649434c02fbd5e6339e9`. Both have tree
`2602bb632bee522784b8918baab11587a3ca8686`.

Artifact `13796685852`, `macos-appkit-native-evidence`, was verified before
extraction against GitHub's SHA-256:

`b453d25ba365e8459a2034722f6affb517f3ac176c6e5d1363d3ca9292eb760c`

`provenance.json` identifies the original artifact, complete command trace,
sampler output, compiler log and retained excerpts by hash. The failure,
invocation, app log, toolchain, sampler receipt and native payload manifest are
copied unchanged. The manifest lists the built payload's hashes without
including binaries. These inputs identify a successful compile and failed
runtime attempt; they are not an accepted distribution receipt.

The complete original artifact is additionally retained unchanged in
`original-native-evidence.zip`. It includes the full compiler log and complete
empty-graph sample named above, so the numbered excerpts remain independently
checkable after the hosted artifact expires. The ZIP keeps its recorded
788,039-byte size and SHA-256.
