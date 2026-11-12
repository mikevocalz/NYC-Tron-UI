# Private Spark acceptance transport

The native acceptance consumer uses Spark 0.0.3's authenticated, single-session
test driver. Its original `SparkSend` does not inspect JSON serialization
failure: a nil result becomes a zero-byte successful return, while a thrown
Foundation exception escapes. These are source defects to verify independently;
the retained c0 mount timeout does not establish that either occurred in that run.

`prepare-consumer.mjs --native-acceptance` applies the narrow transport patch
only after installing the generated private reference. Ordinary preparation
does not invoke it. The patch helper requires the private reference identity,
Spark 0.0.3, release test-driver opt-in and the exact original file SHA-256:

`912a106176bf21881af62ed9acf9201e1ace0c07e91743875b82fd51472dd8c8`

It refuses changed bytes and paths resolving outside that consumer. It changes
only the installed `SparkTestDriver.mm`; it does not rewrite the Spark package
archive, the installed NYC-Tron adapter, or the installed core. Before and after
source, the extracted sender functions, Spark's license, patch-input hashes and
an exact patch receipt are retained under the consumer's `acceptance-transport`.
The patch identity is the SHA-256 of the recorded input inventory. Normal Spark
patch-provenance and Metro analysis still run after this preparation.

The corrected sender preserves finite JSON replies and newline framing. Nil,
invalid or throwing serialization produces `ok: false` with `E_SERIALIZATION`
and the original protocol ID. If even that fixed failure cannot be encoded or
sent, the transport returns failure explicitly. It never substitutes valid
geometry, sends a successful result for an invalid response, retries a command,
or changes the native/client deadlines.

Native trace events record authenticated request receipt, main-queue dispatch
and reply, serialization, and the actual send result. The trace uses fixed
command labels and a local sequence, rather than raw protocol IDs. Field
diagnostics retain only fixed geometry/protocol field names, array indexes and
issue classifications. Inspection is bounded to 1,024 nodes, depth 12 and eight
issues; a trace record is at most 4,096 bytes, with 20,000 ordinary records per
process. Credentials, arguments, response values, arbitrary keys and exception
reasons are never logged by this trace. Original application logging is retained
separately in `app.log`.

## Native probe

On the authorized ARM64 Mac runner, after private consumer preparation:

```sh
node tooling/macos-appkit/probe-driver-transport.mjs "$RUNNER_TEMP/nyc-tron-appkit-consumer"
```

This compiles a Foundation harness with Xcode's `clang++`. It calls the sender
extracted from the original verified file and the sender embedded in the
patched file through real Unix socket pairs. The original function is only
renamed to avoid a symbol collision. The wrapper checks the extracted code and
all relevant input hashes before compiling.

The seven paired cases cover finite frame data, NaN, positive and negative
infinity, an unsupported Foundation object, a nil response and a deliberately
throwing Foundation container. The probe records actual original behavior and
requires a structured failure from the patched sender for each invalid input.
It separately checks closed-peer send failure and uses private sentinel values
to ensure that trace output contains no raw IDs, commands, keys, credentials,
payloads or exception reasons. The result explicitly states that it is a
transport probe and does not accept any native application interaction.

The workflow runs this probe before compiling the standalone app. The native
verifier requires its passed receipt and rechecks the private driver's installed
hash. Build logs, probe output, trace, source and patch receipt are retained even
on failure. All original application, activation, popover, tooltip-hover and
actual NSDraggingSession assertions still follow. A denied gesture capability
continues to fail native acceptance and cannot produce a tested package.

Local filesystem guards run with:

```sh
node --test tooling/macos-appkit/driver-transport.test.mjs
```

These cover patch refusal and do not count as Foundation, socket or native-app
evidence. The original c0 run's unsymbolicated recv frames and missing reply
remain an unresolved runtime observation until a new native trace establishes
the actual failing stage.

Apple references: [JSONSerialization constraints](https://developer.apple.com/documentation/foundation/jsonserialization),
[JSON validity](https://developer.apple.com/documentation/foundation/jsonserialization/isvalidjsonobject(_:)),
and [serialization errors](https://developer.apple.com/documentation/foundation/jsonserialization/data(withjsonobject:options:)).
