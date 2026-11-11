# AppKit offline symbol observation: published source checkpoint

Helper `1283fd6dea6cead03be7d0eb22863e02dbe648fd` was published at
**2026-11-11 07:09:07 UTC**. This record covers reviewed source and mocked checks.
At that publication checkpoint, the actual PR merge and the new native
compilation/runtime outcome were unverified. It establishes neither a resolved
current stack nor a passed native acceptance run.

Root reported a fresh helper/base lease, a nonforced expected-SHA ref update and
an exact postread. Root and the independent desktop reviewer verified all
**2,050 leaves and 284 tree objects**, the ordered parents and the four changed
paths. The published tree is `8bafabc7750c8a087a56a9a309fbd04f5ea0d377`;
its ordered parents are `79a51bb7663bffe130568f81e276ded0e0b065b9` and
`ac5d69585a52a6e945dc996ea08030e190574699`. Root did not dispatch a workflow.

## Purpose and source scope

The completed `8a246683` run compiled and retained a sample while its initial
`tron.window` request was pending. Its bounded projection contained an owned
image relative offset and a main-thread wait path, but did not identify the
owned function or the timeout cause. This change adds an offline observation
of one selected owned frame from a future run's own retained sample.

The historical sample `394dd1966d30d917c471a6d9eec323c654fee15e` is only a
format fixture. It supplies no address, UUID, function or cause for a new run.
Its first owned frame is not uniquely present in the retained 32-frame
projection, so the new selector refuses to send that fixture frame to a tool.

| Authored item | Git blob | UTF-8 bytes |
| --- | --- | ---: |
| Verifier preimage | `4507f860155746bb6f1a3a9528dd0e74de5d6492` | 90,995 |
| Reviewed verifier | `a82e2fc7df3bde243eb6d053a97e310c39b1293c` | 108,719 |
| Existing Expo patch preimage | `1db73096cf95827f5582d188580e74a482beb503` | 3,900 |
| Corrected Expo patch | `2e6ff07ebf22fa8212dfb2028ff740d46720d622` | 3,864 |
| Reproducible symbol review harness | `bd47ae1e4453c147d7230c2bae60b63700e69105` | 60,839 |

The verifier path is `examples/macos-appkit/spark/verify-native.mjs`.
Its SHA256 is
`4b5f5ed5a197301617247dab4dc56428680c37ae73e6caf8c86665243fd9f2d9`.
Eight unique transformations reverse to the exact 4507 preimage; the retained
harness checks that complete inverse.

The original request is still issued once. The 35-second driver deadline,
10-second watcher, diagnostic-only latch, child ownership, sampler cleanup,
native commands, activation behavior, foreground checks and tooltip assertions
remain unchanged. The new symbol report is awaited after the original request
settles. A diagnostic failure cannot replace that original rejection. A watcher
that fired still prevents a passed native receipt even if the request later
resolves. The native driver, existing startup/tooltip reporters and bounded
subprocess helper are unchanged by the verifier delta.

## Integration and the modified consumer

There are exactly four changed paths relative to the first parent, 79a:

- The verifier diagnostic described here.
- `tooling/macos-appkit/patch-expo-device-name.mjs`: the minimal pointer-binding
  and attribution correction described below.
- `packages/native-controls/android/src/main/java/com/nyctron/instruments/TronPointerCaptureView.kt`,
  carried from the second parent as blob `04f8fdfaf7c89b169ee7d5c81a6584c12ccb49d1`.
- `packages/windows-fluent/rnw-fabric/example/scripts/uia-smoke.ps1`, carried
  from the second parent as blob `8bd25374b1c3a24911d13b0a2e8e40b0b5d9f0f4`.

The last two are existing base changes, not newly authored symbol diagnostics.
All other first-parent paths are unchanged. The external 79a preparation,
workflow and two replacer tests are preserved. That preparation patches the
pinned Expo source in the private acceptance consumer. A future native result
therefore concerns that modified consumer; this checkpoint does not validate
pristine upstream behavior or establish the patch's effectiveness.

The separate [Expo/source reconciliation review](../v1-appkit-1283fd6-expo-source/source-review.json)
records the inherited preparation/workflow, the corrected patch and the full
tree review. Its blob is `ccd9c9c5b8ead0618e838d58d0269c06e637b8e6`.

Prepared helpers `24aca7f316d4447d02ce9c322deb7b3106df933d` and
`b00cf503f49b862962c155dcdb7930575514a80d` were never published. The hostname
capture-only workflow candidate `eebf448e583ef35006ec1a99493370ba381e5d45`
was also never published and is not included. The earlier external hostname
setup was reverted by `8f1cf564afc9e178246eaa1825f392ebb68cf485` before 79a.
Those historical objects are not this publication checkpoint.

## Binding and fixed tool scope

The diagnostic requires a complete stable read of the already closed retained
sample, capped at 1 MiB. It checks matching process declarations, a single ARM64
header, one unique owned image UUID, consistent load/range/PC/relative-offset
values, and one selected frame uniquely represented in the existing bounded
main-thread projection. All owner-looking image rows are counted before parsing;
malformed or oversized competing rows cannot disappear and create false
uniqueness. Redacted paths are accepted through the fixed owned app/executable
suffix and bundle identity.

The executable must match the SHA256 recorded before launch. Offline UUID
output must agree with the sample and architecture. There is one optional
existing dSYM candidate:

```text
<root>/.spark/DerivedData/macos-arm64/Build/Products/Release/<owned app basename>.dSYM/Contents/Resources/DWARF/<owned executable basename>
```

The directory is grounded in pinned Spark CLI source; dSYM presence is unknown.
Only an absent candidate permits executable-only fallback. A present unreadable,
oversized, symlinked or UUID-mismatched candidate remains unknown.

At most three `xcrun` operations are permitted: executable UUID, optional dSYM
UUID, and one offline `atos` lookup. Each uses the existing helper's three-second
tool timeout and one-second cleanup grace. There is no live-process attachment,
filesystem search, symbol generation, retry or changed build setting.
Unsupported inlining/deduplication flags produce an unavailable result rather
than a lookup with weaker ambiguity handling.

Executable reads are capped at 64 MiB and dSYM reads at 128 MiB. Complete reads
require a regular file, inspected paths without symlinks, stable size/identity
metadata within the read, and successful close. After the tools, separate
complete reads compare hash and byte count with the earlier values. The field
`matchesBeforeToolsHashAndBytes` describes that comparison; it does not assert
uninterrupted immutability or an in-memory executable hash.

## Evidence and interpretation

Bounded tool stdout is retained as decoded UTF-8 in fixed new files using
`wx`, so a collision preserves earlier evidence. This is not represented as
the original operating-system byte stream. Retention failure prevents
classification. Raw addresses, UUIDs, source paths, line values and arbitrary
symbols remain private evidence.

The existing 16 KiB console envelope permits only fixed tool/status/match
fields, fixed source-file/function-family categories and bounded
count/depth/relative-offset data. The image named by `atos` must match the
validated executable. Unsupported demangled signatures stay unknown;
parameters are not stripped to manufacture an exact function match.
Predecessor-only, multiple, inline or deduplicated results stay unresolved.
A source-file observation is distinct from function attribution. Every result
keeps `uniqueSourceCallerEstablished: false`; no phase is inferred from a
nearby offset or source line.

The closed source-file map includes
`ConstantsProvider.swift -> expo-constants-provider`. This final 58-byte
addition reverses exactly to the previously reviewed ccdb candidate. It adds no
function-signature recognizer. The focused check confirms that an unsupported
`getDeviceName()` signature may have the fixed source-file label while its
function family remains unknown, caller uniqueness false and line value private.

The sample parser also recognizes the fixed block/Objective-C runtime image
names and selected exact cleanup/wait symbols. Bounded selector categories
disclose no class names and apply only to the listed platform images.
These recognizers are not findings about the completed sample.

## Narrow Swift pointer correction

The external patch uses `gethostname` in the pinned private consumer.
Its original UInt8 buffer was passed through `assumingMemoryBound(to: CChar.self)`.
Apple's [pointer contract](https://developer.apple.com/documentation/swift/unsafemutablerawpointer/assumingmemorybound(to:).md)
requires the memory already to be bound to the stated type. The official
[SE-0107 String API example](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0107-unsaferawpointer.md)
discusses the analogous UInt8-to-CChar write as invalid binding.

The correction allocates 256 zeroed `CChar` values, borrows the typed buffer with
`withUnsafeMutableBufferPointer`, and preserves the existing 255-byte
`gethostname` argument. The NUL-bounded prefix is mapped through
`UInt8(bitPattern:)` before the existing UTF-8 decoding. Status-zero and
`"Mac"` fallback behavior, source pin, private-consumer guards, receipt schema,
write verification and imports are preserved. The header now attributes the
reported NSHost diagnosis to its external report and states that the original
sample has not been independently inspected here.

Four unique transformations restore the exact patch preimage. Applying the
corrected replacement to official Swift blob
`7a820eff57eb7d6e4ed3c216763f83521897b90d` yields 4,297 bytes, computed Git blob
`23eff06296d6862a15ec3e82c18785cc14259fd0` and SHA256
`b6406c3a54ba65713d54e3971ffa8a56eef4fe830de558ee84dafc2f130f3bca`.
This postimage identity was computed and independently reproduced; it is not a
claim of installed-file or native compilation verification.

Both unchanged existing replacer test bodies passed with V8 test/assert shims,
then the desktop reviewer reproduced those same bodies and the exact
postimage. No `node:test`, Node filesystem access or Swift compilation was
executed by those checks. The external reported waiting function, timeout cause
and replacement effectiveness remain unproved by this review.

## Primary source and review scope

Pinned Spark CLI revision
`LegendApp/legend-spark@d3a7eead32459f8f6baf29ef868ea732c5081e47` is version
0.0.2. Its [build source](https://github.com/LegendApp/legend-spark/blob/d3a7eead32459f8f6baf29ef868ea732c5081e47/packages/cli/src/build.ts)
derives the Release product directory from the workspace name and copies only
the app to final products. Inspected release settings enable deployment
postprocessing, dead-code stripping, thin LTO and size optimization and do not
explicitly override `DEBUG_INFORMATION_FORMAT`. These settings are unchanged.

The inspected Expo revision
`04ead0d0c3d5b77853c5b79ab9b7bb86fb30271c` matches the pinned core 55.0.27 and
constants 55.0.17 versions. Its source establishes the default constants path
through `ConstantsProvider` and the macOS `ProcessInfo.hostName` call.
That source connection does not identify a sampled current frame. Exact source
identities and the retained lock boundary are in [source-review.json](source-review.json).

Apple's [symbol-name guidance](https://developer.apple.com/documentation/xcode/adding-identifiable-symbol-names-to-a-crash-report.md)
supports matching UUIDs and offline lookup and describes inlining/deduplication
limits. It does not establish this build's symbol availability or a unique caller.

The author ran **ten V8 source/mock designs**, covering the exact inverse,
whole-script syntax, input binding, file/tool failures, ambiguity/privacy,
output bounds and original-error preservation. Complete envelopes measured
**4,383 and 10,359 bytes**. Root independently reviewed seven pure cases on ccdb
and reproduced the same ten author designs on ccdb and again on final a82/bd47,
with matching envelope sizes and historical 32/480/448 counts. These repeated
executions are not additional designs. The desktop reviewer
independently authored seven pure groups and three orchestration groups on
ccdb, verified the final one-line a82 delta, and reproduced the same ten author
designs on final a82/bd47 with matching envelope sizes. Reproductions are not
additional designs. The two existing Expo replacer tests are separate from
these ten symbol-diagnostic groups.

[review-checks.js](review-checks.js) can be evaluated in V8 and invoked as
`reviewStartupSymbolication({source, preimage, historicalSample})` with the
exact blobs in its header. Filesystem, processes, tools, timers and console are
mocked. No actual Node OS IO, `dwarfdump`, `atos`, macOS compilation or native
interaction was executed for these review results. Actual tool behavior,
symbol availability and native acceptance remain unverified at this source
checkpoint.
