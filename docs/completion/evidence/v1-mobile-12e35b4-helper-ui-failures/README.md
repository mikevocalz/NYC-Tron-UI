# Helper 12e35b4: completed native-controls UI failures

[Run 42958884395](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42958884395) completed with source success and failures in both mobile UI jobs. It belongs to helper `12e35b48f75408ac4da4f8130853148ef00a5881`, tree `d4352a6aba7cca7a9b898b6c25c9e4a5d729587d`. The complete source and Android logs confirm actual merge `96e7558fbb859a2430b0f192bb5f11e940229cfa`.

This is a helper result, not a run of reviewed aggregate `9e3933cb9749cb7c0a18b61d58999831acc3cc8d` / tree `f75085511d06c82a194e4f6c6b8d638e6542edf2`. The aggregate includes later mobile source and archive-wiring changes.

## Exact completed boundary

| Job | Observed result |
| --- | --- |
| Source `130320429571` | Success. Ten logged source-test groups total 131 passes, zero failures, skips or cancellations; source builds/package checks passed. |
| Android `130320429307` | Native build/package checks passed. The original log reports 11 decoder checks passed, then combined decoder/UI step 19 failed. Evidence upload step 20 succeeded and reported 41 files. |
| iOS `130320429685` | Completed metadata reports native build and decoder step 20 passed, UI step 21 failed, and evidence upload step 22 succeeded. The original iOS log is unavailable; its decoder count and detailed assertion remain unknown. |

Android's complete returned log exposes only a generic Maestro failure with the wrapper stack at `tooling/native/run-ui-acceptance.mjs:221:3`. It does not expose the detailed Maestro assertion. No assertion or cause is borrowed from an earlier run.

The original iOS log could not be retrieved in two read attempts. The first guard failed before retaining the error body. The second retained MCP error reports **Transport closed**. Neither attempt returned a complete original log; only the second error text is retained. No further iOS read or job retry was attempted. The iOS source context comes from workflow metadata, not an independently inspected checkout log.

## Scoped source comparison

The defined comparison covers **168 paths** in native-instruments, native-controls, native/expo-navigation, native UI tooling/tests and the native-controls workflow. Exactly **six paths differ**, with 162 unchanged. All **19 navigation paths** in that scope match.

| Changed path | Scope of the aggregate change |
| --- | --- |
| `.github/workflows/native-controls-port.yml` | Uses canonical workspace archives from the source job, verifies the shared manifest, retains archive receipts and includes hidden driver evidence. |
| `examples/native-instruments/pointer-acceptance.js` | Adds explicit StatusBar styling based on color scheme. |
| `packages/native-controls/android/src/main/java/com/nyctron/instruments/TronPointerCaptureView.kt` | Handles synthetic `ACTION_CANCEL` by cancelling previously observed contacts before sampling a possibly incomplete cancellation event. |
| `tooling/native/UI_ACCEPTANCE.md` | Updates the acceptance guidance. |
| `tooling/native/ui-transport.mjs` | Separates live driver-file inodes from exclusive retained snapshots before recovery; eligibility/classification is unchanged. |
| `tooling/tests/native-ui-transport.test.mjs` | Adds the open-descriptor/hidden-evidence snapshot regression. |

The aggregate capture-view blob `fd8d00d663b948c4bdf4db359911cfc4d62a61b2` exactly matches PR61 head `2a74fbf5bc5f3be5137af73d9590ce05abaaf0b0`; this helper retains `23b6f11431be3869b98b55b01c5026479adf50bf`.

UI-transport attribution is different: helper and PR61 both use `4839573c63934b5ecffe60755982211d9018ba2a`, whereas the aggregate uses the later snapshot correction `9a362c4b7af481c01beeb7bd0f7b03a9a692080b`. The pointer-fixture, retention and canonical-pack additions must not all be labeled as PR61 changes.

[Provenance](provenance.json) records all six exact helper/aggregate/PR61 blob mappings, the precise comparison scope and its canonical-row hash. Matching navigation source and the private macOS-only helper delta do **not** establish mobile flakiness, the cause of either UI failure or a regression of the reviewed aggregate.

## Retained logs and unavailable original artifacts

| Original decoded log | Bytes | SHA-256 |
| --- | ---: | --- |
| [source-job.log](source-job.log) | 86,356 | `272f67d1074fc54f6704704c51147878e8864a053af37c33d710bbb7f734a3ef` |
| [android-job.log](android-job.log) | 284,165 | `d6b486a76afc8d658595bc4bcf750e45e3bdff79400256ceb9c35b9500473fa8` |

These logs are retained without trimming, ANSI removal or newline normalization and were independently hashed as UTF-8. No substitute iOS log is created.

[Completed workflow metadata](workflow-metadata.json) records artifact `13828539943` for Android (121,147,097 bytes) and `13829557288` for iOS (71,587,392 bytes). Artifact hashes and sizes are producer/API-reported; original ZIP/member bytes remain uninspected.

Separate fresh ref reads matched PR59 `12e35b48...`, held PR57 `0edd5f30...`, PR60 `05785826...`, and reviewed-integration ref `9e3933cb...`. Those reads are not an atomic or future branch snapshot. This receipt changes no source, acceptance gate, permission, branch or workflow run.
