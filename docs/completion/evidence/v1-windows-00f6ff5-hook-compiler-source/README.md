# Private Windows Hook compiler correction

This source-only correction removes `final` from the private example's `Hook` implementation. It addresses the concrete C++/WinRT C2338 diagnostic in the completed 8a5007d executable build. The corrected header has not yet been compiled or exercised by a new native run.

## Exact change

The file is `packages/windows-fluent/rnw-fabric/example/native/NavigationProbe.h`.

| Identity | Git blob | UTF-8 bytes | SHA256 |
|---|---|---:|---|
| Executed preimage | `25555353791ca4b35f1be51e7566c2062ecc8091` | 30,246 | `0e7ad4782abbd04c0790e1e2edc5c1a96b2f05373aa98bc577a36c8636941d33` |
| Corrected source | `00f6ff5f1735c81a5268855a5fb33627f5112cd7` | 30,240 | `cfa10130880d4adc0089abc3b923d81ecabfd4394de476d282e0fed15d0fc3ea` |

`struct Hook final : winrt::implements<Hook, Object, NavigationProbeHook>` becomes `struct Hook : winrt::implements<Hook, Object, NavigationProbeHook>`. Exactly six bytes are removed. The unique forward edit and complete inverse are retained in [edit-manifest.json](edit-manifest.json). Every other header byte is unchanged, as are the component hook, preparer, consumer, private ABI, protocol, ownership checks, deadlines and native acceptance assertions.

## Evidence and review boundary

The complete [8a native outcome receipt](../v1-windows-8a5007d-native-compile-failure/README.md) binds workflow `43022193331`, attempt 1, native job `130528304650`, and actual checkout `e7901ec687e96a240a7b820baef50318fde40ddd`. The original native log is blob `7cd597b6ae32070abdd4493d333ae004565d70cb`, 116,428 bytes, SHA256 `536b9667f12de35d563f95c32004aa2fb7369cb3ec1fb28ff7d0492c28d0429c`.

Its line 990 reports that C++/WinRT implementation types must not be final. Lines 994–995 identify the instantiation of `winrt::make<nyctron::fixture::Hook>` at `NavigationProbe.h:576`. This is the sole displayed compiler error in that complete original. The three numeric-conversion warnings in this header are nonfatal and remain unchanged; the evidence does not establish that later compilation or runtime has no other blockers.

The [official C++/WinRT source at commit 297454ee](https://github.com/microsoft/cppwinrt/blob/297454ee285476f16bf11425bd60daf4593b66ee/strings/base_implements.h) explicitly checks `!std::is_final_v<D>` in `winrt::make` at lines 1378–1383. Its Git blob is `0c0ff06849b8b7926e9912265ed075212a5a3c54`. This is the declared RNW default/minimum C++/WinRT 2.0.230706.1 source; it is not a claim that the installed generated header was independently retrieved byte for byte. The executed assertion and its template chain are directly observed in the retained compiler log.

Validation consists of exact original/candidate blob readback, the unique six-byte transform and its inverse, review of all displayed compiler diagnostics, and the primary-source check. No new C++ compilation, native execution, protocol response, geometry or RTL result is claimed. Historical model/source checks for the larger fixture remain scoped to their original source receipt. No workflow, host/security/launcher, ref, PR, dispatch or retry was changed while preparing this correction.
