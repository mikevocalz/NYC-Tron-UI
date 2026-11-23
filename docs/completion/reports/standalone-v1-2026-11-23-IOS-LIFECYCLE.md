# iOS target and XCTest lifecycle follow-up

Status: fix candidate; a complete hosted rerun is required. All root-import
fixture assertions remain mandatory. No acceptance or owner approval changes.

## Actual artifact diagnosis

The proof artifact from [iOS job 137477118187](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/45109064264/job/137477118187)
contains a successful direct-import JUnit case (234.638 seconds), its completed
command stream and retained-shell PNG. The root-import case failed during its
first launch command, before any root-import UI assertion executed. The overall
collector correctly wrote no passing iOS receipt.

The root command stream records `launchApp` with `clearState: true` failing after
81,138 milliseconds: “Device became unreachable while processing terminateApp”.
XCTest logs show a new HTTP server starting successfully, answering status and
device-info calls, then receiving `POST /terminateApp`. Terminating the kitchen
process failed, XCTest tore down its HTTP-server test, and the client observed
EOF/connection-refused errors. This was a real second-session transport failure,
not the collector's ten-minute subprocess timeout. Direct assertions had passed;
root assertions had not run.

Both JUnit files identify an iPhone Duo on iOS 27.2. The generic prewarmer selected
the newest available iPhone runtime, independently of the selected Xcode 27.1
SDK. Runtime/build parsing and duplicate accessibility-class warnings also occur
in the driver log, but these artifacts do not establish which underlying OS or
driver behavior caused the termination failure.

## Explicit compatible target and fresh driver

The [official runner inventory](https://github.com/actions/runner-images/blob/main/images/macos/xcode-27-arm64-Readme.md)
lists iPhone 17 on iOS 27.0, iPhone Duo alone on 27.1, and separate standard/Duo
27.2 simulator sets. A regular iPhone on 27.1 is therefore not an available
target. This follow-up explicitly selects the preinstalled **iPhone 17 / iOS
27.0** simulator while preserving the successfully compiled **Xcode 27.1 SDK**.
SDK selection and runtime coverage are recorded separately.

The kitchen-only preparation script fails when that exact available runtime/name
is missing; it never falls back to the latest runtime, a Duo, an iPad or physical
hardware. It prefers an already booted exact match, verifies boot completion and
the same target afterward, exports its UDID and retains inventories, boot logs
and selection metadata in a separate `kitchen-ios-target` artifact. Other native
jobs retain their existing generic prewarmer behavior.

Each iOS import-mode invocation now uses Maestro's default fresh XCTest-driver
installation instead of the previous `--no-reinstall-driver` opt-out. The
[pinned Maestro source](https://github.com/mobile-dev-inc/Maestro/blob/67d8a677029261fa424a45a10d08eacd6aa0deed/maestro-cli/src/main/java/maestro/cli/command/TestCommand.kt#L191)
defines that default as true. Android's existing driver-retention behavior is
unchanged. The two complete mode flows, `clearState`, all selectors/assertions,
fresh stage/PNG requirements, actual JUnit checks and exact archive/version
binding remain intact. No retry, skipped assertion, synthetic runtime pass or
snapshot-baseline promotion is introduced.

These changes remove uncontrolled target selection and driver-retention setup
from the next measurement. They do not claim that either factor alone caused or
already cured the observed failure. Only a new successful complete direct/root
run can supply a passing iOS receipt.

## Validation and limits

Thirty-eight focused tests passed, zero failed/skipped: 33 kitchen candidate
tests plus five release integration contracts. Seven new tests cover exact
runtime/device selection over a booted newer Duo, deterministic preference,
missing/unavailable target rejection, fresh iOS driver arguments, preserved
Android arguments and clear-state flows, and retained target-preparation wiring.
Workflow YAML parsing, JavaScript syntax and whitespace checks passed.

The setup executable is guarded to hosted macOS CI. Local tests import its pure
selection function; no local simulator command, app launch or device interaction
was performed. The explicit target and fresh-driver lifecycle have not yet been
exercised on the hosted runner. Physical/foldable hardware and full screen-reader
coverage remain unverified.
