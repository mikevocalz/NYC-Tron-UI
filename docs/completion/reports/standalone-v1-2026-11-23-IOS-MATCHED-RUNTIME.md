# SDK-matched iOS simulator target follow-up

Draft CI configuration change; iOS native runtime acceptance is NOTRUN for this new target. No native pass or release eligibility is claimed.

The retained 11851638 target artifact reports bootstatus exit 0 (already booted), followed by a 30-second ETIMEDOUT/status null on the selected iPhone 17 / iOS 27.0 SIMULATOR_UDID query. The prior 900d artifact timed out on global post-boot inventory after bootstatus success. Therefore the previous failure was not confined to broad inventory enumeration. The underlying runtime responsiveness failure is not established as a specific compatibility defect.

The [official GitHub xcode-27 arm64 runner inventory](https://github.com/actions/runner-images/blob/main/images/macos/xcode-27-arm64-Readme.md#installed-simulators), inspected 2026-11-23, lists iOS 27.1 with iPhone Duo as its sole preinstalled device. Its SDK table lists iphonesimulator27.1 for Xcode 27.1; the Xcode table identifies build 27A9275. iPhone 17 is listed on 27.0 and 27.2, not 27.1.

The workflow step label now says SDK-matched iPhone simulator, accurately describing this target. The failure message rejects alternate devices or runtimes rather than referring to a Duo fallback. This change strictly selects the documented iPhone Duo / iOS 27.1 simulator matching the existing Xcode 27.1 SDK. It is a justified target-selection experiment, not a proven repair. The earlier direct-import flow passed on Duo / 27.2 while the root-import flow failed in transport; that does not establish acceptance on 27.1. Neither posture behavior nor physical-device support is inferred from the simulator name. Coverage remains iOS Tier 1 simulator only.

Initial exact available-device selection, bootstatus, targeted UDID equality, failure diagnostics and selection metadata remain required. Missing target fails without fallback. Fresh default driver installation per direct/root mode, clearState and every native assertion remain unchanged. No retry/timeout increase, app API, window dimensions or orientation change. No local simulator commands were run.

Validation: `node --test tooling/kitchen-sink/ios-target.test.mjs` passed 14 tests, zero failures/skips. Controls reject wrong runtime, wrong device, unavailable/missing target, identity mismatch/absence, boot failure and query timeout; existing flow/driver checks pass. A new exact constant assertion prevents a regression to an unintended runtime/device pair. Hosted build and both complete native modes are still required.
