# Windows 8a5007d: private observer compilation stopped before native acceptance

The completed [WinUI Fabric workflow, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43022193331) compiled the installed native package, then failed while compiling the example executable. Its complete original reports C2338: **“C++/WinRT implementation types must not be final.”** The template context identifies `winrt::make<nyctron::fixture::Hook>` in the private `NavigationProbe.h` fixture. Deployment and UI Automation did not run.

## Exact source and executed boundary

The published head was `8a5007d197539c782e065f1b59daf3fe5ed752ec`. Both retained original logs show the actual checkout `e7901ec687e96a240a7b820baef50318fde40ddd`, whose tree is `9f7d87a249edc25216dcbc11763b009eda825ba2` and ordered parents are `25a6af6d020e34d790f6a4f3d9f117738b252f1e`, then the published head. This run used header `25555353791ca4b35f1be51e7566c2062ecc8091`; the later six-byte correction `00f6ff5f1735c81a5268855a5fb33627f5112cd7` was not executed here.

| Stage | Actual result |
|---|---|
| Fabric source job `130527856883` | Passed 13 source contracts, then the 49-test package suite; no failed tests. The first group is included in the second, not 62 distinct designs. API snapshot: 1 package, 8 subpaths, 44 reachable declarations. |
| Native job `130528304650`, preparation | The 49-test package suite, installed-consumer/codegen and Windows PowerShell diagnostic gate completed successfully. The latter includes selected-script parsing, actual owned-process/C# checks and separately labeled portable mock regressions. |
| Native package build, step 13 | Passed, 12:42:18–12:46:29 UTC. |
| Example executable build, step 14 | Failed, 12:46:29–12:47:36 UTC. |
| Deployment, UIA and tested distribution, steps 15–18 | Skipped. |

The complete native original has one displayed compiler error, at line 990. Lines 994–995 identify the instantiation at `NavigationProbe.h:576`; line 1007 records exit code 1. Three C4244 warnings at lines 981, 984 and 987 concern bounded numeric conversions in the same header and are nonfatal. “One displayed error” is not a claim that later compilation or execution has no remaining blockers.

The [separate general-source receipt](../v1-windows-8a5007d-source-pass/README.md) records the same revision's 1,204-test Linux and Windows source passes. It does not establish native acceptance.

## Retained records and limits

This folder retains both complete original job logs, normalized completed API metadata, the exact contiguous compiler excerpt (native lines 981–1007), and a provenance index with every byte count and SHA256. The native log's original line endings are preserved.

The always-uploaded evidence artifact `13856595491` is reported as 16,346 bytes with digest `4b16e5c068850c7ec035cf684b9ba2cba83242068fc88e843ab0d319e0fc60d4`; its uploader reports 16 files. Shared package artifact `13855043543` is reported as 62,822 bytes with digest `856ce32336002a68b3b000681d2da77d9df128dfc2f677be9802c5cb9190b31d`. Those are producer/API reports. The ZIP bytes and members were not extracted, rehashed or inspected.

There is no executed native observer protocol, icon geometry, RTL action, application drag/tooltip, host-eligibility, screenshot or physical-device acceptance in this attempt. No tested distribution was produced by the skipped acceptance steps. The corrected header needs a new source-bound build and runtime result; this receipt does not infer one.
