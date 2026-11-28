# Native CI startup follow-up

Status: fix candidate; hosted runtime retry required. No native flow
passed in the failed run, and no acceptance or owner approval changes here.

## Observed failures

The lead's Android log for [job 137468083008](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/45106192034/job/137468083008)
reports emulator 37.3.10 exiting because software CPU emulation (`-accel off`)
is unsupported without a hardware accelerator. The actual job log reads:

> ERROR | Software CPU emulation (-accel off) is not supported. A hardware CPU accelerator is required (or set ANDROID_I_WANT_MY_TCG=yes to force TCG software emulation).

The action then waited for a device that had never booted. Its default `auto` setting checks read/write
access to `/dev/kvm` and disables hardware acceleration when that check fails;
see the [action's implementation](https://github.com/ReactiveCircus/android-emulator-runner/blob/main/src/main.ts)
and [input contract](https://github.com/ReactiveCircus/android-emulator-runner/blob/main/action.yml).

The iOS [job 137468083110](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/45106192034/job/137468083110)
passed compilation under Xcode 27.1, then stopped at the exact Maestro-version
check. The old error omitted exit status and output, so the exact startup
failure in that job cannot be determined from that generic message alone.
Neither platform executed the native fixture flow in this run.

## Reproduced pinned CLI startup

The unchanged installer downloaded Maestro 2.12.1 into a new task-owned
directory and verified its pinned archive SHA256
`54dbb0716425626604973cbb374c585ca30272375d9ce15177a1152765ddd9d7`.
Only `maestro --version` was executed with Java 17; no local device discovery,
installation, launch or interaction command was run. HOME was not changed.
Additional local probes used a task-owned Java `user.home`, leaving the user's
Maestro state and caches alone.

- Default startup exited 1 with an analytics-state `NoSuchFileException` for
  the absent default Maestro state directory. The CLI itself documented
  `MAESTRO_CLI_NO_ANALYTICS` as the opt-out.
- With analytics disabled, startup exited 0 but stdout contained a promotional
  analysis notification before the version. That notification documented
  `MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED=true`.
- With both documented switches, stdout was exactly `2.12.1` plus newline,
  stderr was empty and exit status was 0. The final production helper repeated
  that result against the same verified CLI.

The [portable diagnostic record](standalone-v1-2026-11-23-NATIVE-CI-version-repro.json)
contains the real statuses, durations and streams. The original user-home prefix
in the failing stderr is visibly redacted; the raw local record remains separate.
These reproductions establish startup behaviors that the old guard could not
distinguish. They do not invent the missing historical CI exit details or prove
an application runtime pass.

## Narrow changes

Android uses the repository's existing KVM udev permission pattern, then
requires a character device with read/write access before the action starts.
The action explicitly keeps hardware acceleration enabled and passes
`-accel on`; its pre-launch hook runs the installed emulator's `-accel-check`.
[Android's command-line reference](https://developer.android.com/studio/run/emulator-commandline)
documents that `on` fails when acceleration is unavailable. There is no TCG
override, software CPU fallback, skipped scenario or weakened assertion.

The version helper applies both documented notification switches to the version
probe and actual flow subprocesses. It preserves HOME and existing JVM options,
requires the same exact trimmed stdout and zero exit status, and still rejects
`2.12.10`, duplicate version lines and banners. No substring parser was added.

Native proof exclusively creates its fresh output directory before probing.
`maestro-version.json` is written before every version failure and is retained
by the existing always-uploaded proof artifact. It records status, signal,
elapsed time, process error and bounded stdout/stderr. The probe has a 60-second
deadline, a hard kill signal and a 64-KiB subprocess output bound; each retained
stream is capped at 32 KiB. Successful receipts include the diagnostic's hash.
Existing archive integrity, exact version, fresh stage/PNG, executed JUnit,
platform binding and component/import coverage checks remain mandatory.

## Validation and limits

Twenty-five focused tests passed with zero failures or skips. They cover the
existing nine archive/native guards, eight startup diagnostic cases, three candidate/KVM
workflow contracts and five strict release integration contracts. Negative
startup cases include wrong/ambiguous version, nonzero exit with correct version
text, timeout, oversized output and missing executable. YAML parsing and
whitespace checks passed. The unchanged installer still verifies the pinned
archive digest. The Ubuntu candidate job now explicitly runs
`node --test tooling/kitchen-sink/*.test.mjs`; its exact command passed all twenty
kitchen tests locally. The new candidate-coverage regression prevents reverting
to only the older proof.test.mjs file. The five release integration tests remain
in the global tooling/tests discovery.

The independent reviewer also ran the actual helper against the verified CLI
with task-owned Java state and observed exact version output, exit 0 and empty
stderr. Linux KVM availability and the full iOS/Android flows require the new
hosted run. No dependency, native source/configuration, fixture acceptance path,
stability label or distribution approval was changed by this follow-up.
