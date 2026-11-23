# Android runner KVM permission follow-up

Status: fix candidate; hosted retry required. No emulator or native fixture flow
ran in the failed job. No acceptance, stability or owner approval is changed.

## Actual completed-job evidence

The GitHub connector retrieved the complete log for
[Android job 137477118207](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/45109064264/job/137477118207).
The installed-archive release build completed successfully in 6 minutes 4 seconds:
331 actionable tasks, all executed. The pinned Maestro installer also completed.

The KVM block printed its udev rule at 04:05:56.676 UTC and exited with code 1
at 04:05:56.752 UTC. The script had neither command tracing nor per-command
diagnostics. The log therefore does **not** establish whether reload, trigger,
character-device, read-access or write-access checking failed. Asynchronous udev
completion is a possible mechanism, not a proven diagnosis. The emulator action
was never reached, and the later upload correctly found no application proof.

## Runner-only fix

The existing Ubuntu job now traces its small KVM setup block and prints runner
identity and the device's permissions. A failure trap reports the failing line
and original status, prints available device diagnostics, then exits with that
same nonzero status. The trap's diagnostic-only `ls` fallback cannot turn a
failed permission gate into success.

The block verifies that `/dev/kvm` is a character device before changing its
permissions. It preserves the existing KVM-specific udev rule, reload and trigger,
then waits with `udevadm settle --timeout=10`. It synchronously applies
`chmod 0666 /dev/kvm`, prints the resulting mode, and repeats the required
character-device, read and write checks. All changes occur on the disposable
hosted runner and target only its KVM device/rule. No local host permissions or
user files were changed.

[The udev reference](https://www.freedesktop.org/software/systemd/man/255/udevadm.html)
distinguishes triggering events from waiting for completion and documents the
bounded settle command. Synchronous chmod addresses the current node directly
instead of assuming a rule trigger has already changed access.

The action still requires hardware acceleration, runs `-accel-check` before
launch, and uses `-accel on`. There is no software CPU fallback, TCG override,
ignored setup failure or skipped native acceptance scenario. The iOS workflow,
Maestro version/archive validation, fresh-output/JUnit/PNG guards, dependencies,
app code and native configuration are unchanged.

## Regression evidence and remaining limits

Six new tests execute the **actual extracted workflow shell block** with shell
doubles for sudo, udev, identity, listing and permission checks. They never run
real host permission commands or access a real KVM/emulator. The passing case
requires bounded settle followed by synchronous chmod before write access can
succeed. Negative cases cover a missing character device, unreadable device,
unwritable device, failed chmod and failed udev reload. Each preserves failure
and reports diagnostics; a missing device stops before permission changes.

The complete targeted run passed 31 tests with zero failures or skips: 26 kitchen
startup/KVM/proof tests and five release integration contracts. The existing
Ubuntu candidate wildcard includes the new tests. Workflow YAML parsing and
whitespace checks also passed. The real Linux KVM permission state, emulator boot
and application scenarios remain unverified until the new hosted run succeeds.
No local device discovery, install, launch or interaction was performed.
