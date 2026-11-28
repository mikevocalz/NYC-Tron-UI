# Shared Android acceptance transport diagnosis

Draft diagnostic follow-up; native UI acceptance remains FAILED. No release eligibility or component-runtime pass is claimed.

## Actual retained evidence

Run 45113034787, job 137490575920, candidate 900d8ca3ff4f0c111f1b3b1c75879beadb584597. Artifact `native-release-consumer-android` (14791042061) contains the runtime-ui-android reports. Only its 26 runtime-log entries (1,214,409 bytes) were extracted for analysis; the APK was not downloaded.

Build and 11 decoder checks passed. The first Maestro process exited 1 after 20,486ms, then the existing single eligible transport recovery ran. The second process exited 1 after 15,304ms. This was not a 60-second process timeout. Both Settings JUnit reports contain ERROR at initial launchApp (stopApp false), sequence 2: `Command failed (host:transport:emulator-5554): device offline`. No Settings UI assertions ran. The second suite lasted 3.897 seconds.

The recovery readiness JSON records successful platform adb state, boot completion, reverse mapping, app PID and resumed Activity. Nevertheless the fresh Maestro session failed with Dadb AdbServer.send / AdbServerDadb.open and DeviceServerDiedException during deviceInfo. Guest adbd logged host-18 connection termination/write failure and an offline transport. A later hierarchy capture succeeded. These observations establish transport loss, not its underlying cause; an app defect, emulator crash, tool-version incompatibility or a particular corrective pin has not been established.

Upstream reports describe related Dadb device-offline behavior while platform adb remains usable: [Maestro #3451](https://github.com/mobile-dev-inc/Maestro/issues/3451) and [#3720](https://github.com/mobile-dev-inc/Maestro/issues/3720). They are corroborating reports, not proof of our cause or a validated fix.

## Concrete diagnostic fix

The shared command wrapper previously chose empty stderr through nullish coalescing, yielding a blank thrown error despite a nonzero status and stdout failure. It now records status, signal, launch/timeout error and separate nonempty stdout/stderr tails, bounded to 4,000 characters each. Per-command log files retain the original streams. This exposes the failure in hosted logs; it does not repair or waive the transport failure. Tool pins, timeouts, existing one-recovery limit, fresh evidence, installed candidate, decoder and UI assertions are unchanged. No local device commands were executed.

Validation: `node --test tooling/tests/native-command-diagnostics.test.mjs tooling/tests/native-ui-transport.test.mjs` passed 26 tests, zero failures/skips. Six new controls cover empty streams, stdout-only failure, both streams, timeout/signal, bounded tails and actual wrapper wiring. Existing recovery negatives remain passing. A hosted native retry is still required; no successful retry is asserted here.
