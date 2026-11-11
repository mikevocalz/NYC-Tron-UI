# Windows existing-shell diagnostic: fixture parser failure

The Windows source gate passed at helper `2566b2b2d546a975d32aebc2548cb5ff1cbdd1c5`, but the native job stopped at its mandatory Windows PowerShell parser before the new diagnostic could execute. This run provides no new shell identity, token comparison, native compilation, deployment or UI Automation result.

## Exact tested source

- Helper tree: `3dec3aa2ef7312becf9dc02fdb72679b154c2bbc`.
- Actual PR merge: `0578b0703260a1a55c588358ea1e0ec02c0075d6`.
- Ordered parents: `0edd5f302e99877191ba9a412c5c060571a5f6c9`, then `2566b2b2d546a975d32aebc2548cb5ff1cbdd1c5`.
- All 2,076 leaves and the actual merge's tree and ordered parents were independently verified.
- [Run 42933603735](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42933603735): source job 130238102053 succeeded; native job 130238476477 failed.

The source job passed the 13-check native-source invocation and the full 49-check suite, which includes those same 13 checks. Both invocations had zero failures and skips. Types, package checks and the eight-subpath/44-declaration API snapshot passed. These are 49 distinct source checks.

## Failure and correction

The first failed step reported:

```text
Diagnostic script failed Windows PowerShell parsing: tests\native-drag-environment.test.ps1
```

The ordered parser had already reached this test after the smoke, input and environment helper scripts. Production C# compilation and the mock/native test invocations occur after the parser loop and were not reached. Native code generation, native library/application compilation, deployment, UI Automation and passed-distribution retention/upload were skipped.

Independent source inspection found that `ShellFixture` left its outer `$observation = @{` hashtable open before the first `foreach`. The reviewed correction adds exactly four bytes, `  }\n`, to close that hashtable. Removing that insertion reconstructs the complete old file exactly. Source review had missed this syntax error; the actual parser gate caught it.

The corrected file is blob `d3f4492c96f1b805048031ea2a96f607e844c8df`, 24,322 UTF-8 bytes, SHA256 `ba5ca5d0523708b5f40a6f3f18a8d6fa027cd4df47856b0c2edf878c9f3b2164`. The helper, launcher, native drag implementation, security configuration, pointer gestures and strict interaction assertions are unchanged by the correction. Its actual parser and runtime results must be recorded separately.

## Evidence retained

The complete original decoded source and native logs are retained without normalization. Root and the independent desktop reviewer separately retrieved matching complete strings, UTF-8 byte counts, SHA256 digests and Git blob IDs. `provenance.json` records those identities; `workflow-metadata.json` records completed jobs and artifact metadata.

The upload reports one file in artifact 13818085290, 876 bytes, with SHA256 `6e5fd4d92a1c2b1af820c7c1c0a9856d2c21f0ee7e46986f68412b407468420b`. The original ZIP/member bytes and detailed parser receipt have not been extracted or independently rehashed because the local execution workspace is unavailable. The log's reported parser failure and the independently inspected source are kept distinct from that uninspected receipt.

The existing-shell helper remains a read-only observation for reviewing a supported activation route. It requires twelve observed predicates and makes no launch or drag-success guarantee. This failed run establishes none of those new runtime predicates. The preceding elevated-app observation remains separately recorded in the [c3 receipt](../v1-windows-c3a52cf-elevated-drag-failure/README.md).
