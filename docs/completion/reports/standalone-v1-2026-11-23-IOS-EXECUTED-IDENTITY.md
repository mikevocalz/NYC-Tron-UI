# iOS actual-execution identity follow-up

Draft CI repair candidate. Fresh-driver iPhone Duo / iOS 27.2 kitchen acceptance is NOTRUN; no native pass or release promotion is claimed.

## Observed failures and working measurement

The 900d target artifact passed required bootstatus but timed out enumerating post-boot devices. The 1185 target artifact passed bootstatus then timed out after 30 seconds querying SIMULATOR_UDID. The 97d SDK-matched Duo / 27.1 target artifact again passed bootstatus then timed out on that same targeted identity probe. These failures establish that the added CoreSimulator probes prevent reaching the app flows; they do not establish a compatibility defect or prove the app cannot run.

The retained ef8 direct-import JUnit identifies `iPhone Duo - iOS 27.2 - C898E3E4-5033-4085-B886-963EE2D0C478` and records SUCCESS, 234.638 seconds. Its original XML is included as a parser regression fixture, not current candidate proof. The root mode failed in transport on that old run. Fresh driver installation per mode was added later and has not yet been tested on this explicit 27.2 target because setup probes blocked execution.

The [official runner inventory](https://github.com/actions/runner-images/blob/main/images/macos/xcode-27-arm64-Readme.md#installed-simulators), inspected 2026-11-23, lists Duo / 27.2 as preinstalled. The build toolchain remains the independently pinned Xcode 27.1 / build27A9275. Selecting this runtime follows an actual successful direct-flow measurement; it does not claim SDK/runtime matching or proven causality. Coverage is Tier 1 iOS simulator only. No posture/hardware capability is inferred from the model name.

## Concrete change and fail-closed checks

Preparation requires exact available iPhone Duo / iOS 27.2 inventory selection, optional boot when needed, and successful required bootstatus. Redundant post-boot CoreSimulator queries are removed. The CLI still receives the selected UDID explicitly. Each successful iOS Maestro flow must then report exactly that model, runtime and UDID in its actual JUnit suite device attribute before its stage or receipt can pass. The observed identity is retained in the hashed structured result. Both direct and root modes must execute all existing assertions and produce fresh valid PNG evidence.

No direct XML parser dependency exists in tooling. Following independent review, the parser bounds input to 64 KiB and anchors the complete successful document shape: optional initial XML declaration, one testsuites root, one suite and one self-closing SUCCESS testcase. Nondeclaration processing instructions, invalid nesting, missing/extra closures and duplicate testcase attributes are rejected by eight additional negative controls. A constrained parser handles the pinned CLI's simple suite start tag and fails closed on unsupported constructs, malformed/duplicate attributes, missing/duplicate suites, blank/mismatching identity, runtime prefixes, comments, entities or DTDs. Successful-flow validation remains separately mandatory. This is not a general-purpose XML parser.

Fresh default driver installation per iOS mode, clearState, version/archive checks, screenshot freshness, candidate provenance, all component assertions and Android behavior are preserved. No retry/time budget increase or app/API/window/orientation change. No local simulator commands or device actions were run.

Validation: `node --test tooling/kitchen-sink/*.test.mjs` passed 65 tests with zero failures/skips. This includes the actual retained JUnit positive fixture, full identity negatives, bootstatus failure and no-post-probe wiring, plus existing startup/archive/JUnit/screenshot guards. Hosted execution of both modes is still required.
