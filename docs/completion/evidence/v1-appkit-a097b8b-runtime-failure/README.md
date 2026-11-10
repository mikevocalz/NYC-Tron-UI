# AppKit native compilation and first runtime timeout

[Run 42869608044](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42869608044)
passed canonical core packaging, the native ARM64/Xcode 26.2 toolchain check,
the Swift isolated-conformance probe, clean archive consumer preparation, the
installed API snapshot, and **standalone native AppKit compilation**. The full
build log ends with `BUILD SUCCEEDED`. This run compiled the adapter and private
acceptance driver past the prior Swift toolchain, Yoga header and geometry-name
failures.

The app then launched as process `50122`. Its log records React JavaScript bundle
evaluation and Expo initialization. Runtime acceptance failed with
`Native driver response timed out`, before any interaction check completed.
The success-only tested-package upload was skipped.

## What this failure establishes

`failure.json`, `invocation.json`, `app-startup.txt` and `native-artifact.json` are copied
unchanged from the hash-verified artifact. The native manifest identifies the
actual built executable and 28 app payload entries; it does not include the
binaries. `build-success.txt` retains the numbered end of the full compiler log,
whose hash and excerpt range are in `provenance.json`.

This client's trace callback ran only after a command response and did not
record authentication phases. No runtime `commands.jsonl` was created. The
artifact therefore cannot distinguish authentication from the initial React
mount request as the timed-out stage. It contains no process sample or native
input-posting permission result. The app log's Expo deprecation warning alone
does not establish the cause of the timeout.

The follow-up records connection, authentication and request stages without the
credential, sends a main-queue ping before waiting for the first React mount,
and takes a bounded sample of the spawned app on failure. It also corrects a
separate, later class assertion to use the installed `RNDesktopDragView` class.
That assertion was not reached in this run. These changes require another
native run; this record contains no native interaction pass.

## Exact source and artifact provenance

The PR head was `a097b8bad924115a9e49a38d8ccf33ab257707cc`. The actual checkout
and all native receipts identify merge revision
`fcfef4d475eb9e6f8de9f2853bc0475fcc7b08fb`. Both have tree
`4b0332559770f47520bd47417845dd316ae60e94`.

Artifact `13790029404`, `macos-appkit-native-evidence`, was verified before
extraction against GitHub's SHA-256:

`648738db0fd537fcb43ef20cfb93da0f60bfaa2905c0f7a44273e122df973b73`

The prepared archive hashes identify the inputs to the successful compile and
failed runtime check. They are not a natively accepted release receipt. Native
controls, ordinary React responders, popovers, window lifecycle, drag/drop and
tooltip hover remain unverified by this particular run.
