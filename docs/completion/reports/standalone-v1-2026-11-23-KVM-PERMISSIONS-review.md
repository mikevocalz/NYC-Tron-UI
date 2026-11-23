# Independent KVM permission follow-up review

Verdict: PASS for this draft runner-only correction. Hosted KVM and native runtime results remain pending.

Reviewer: skill_discovery, independent of implementation by argent_environment_inspector. Applied standalone engineering code-review skill knowledge-work-plugins/engineering/1.2.0/skills/code-review/SKILL.md. No implementation edits or local device/permission commands were performed by reviewer.

Reviewed the exact three-file patch and implementation report. The prior log establishes only that the KVM setup block exited1 after printing the rule; it does not establish the precise failing command or a race. The report preserves that uncertainty. Tracing, runner identity, device mode and an ERR trap now expose the failed command/line and preserve its exit status. Diagnostic ls failure is ignored only inside the failure handler and cannot convert a gate failure into success.

The block requires a character device before altering permissions, preserves the KVM-specific udev rule/reload/trigger, waits at most10seconds for pending events, applies synchronous chmod0666 only to /dev/kvm, and rechecks character/read/write access. Independently checked the [udevadm reference](https://www.freedesktop.org/software/systemd/man/255/udevadm.html): settle waits for queued events and returns nonzero on timeout. A missing device, failed reload/chmod or denied access still fails. Hardware acceleration/preflight remain mandatory; there is no software CPU fallback or evidence bypass. The permission scope is the disposable hosted runner, not a developer machine. iOS, archive identity, Maestro pin, receipts, JUnit, fresh screenshots and app configuration are untouched.

Independent execution:31 targeted tests passed, zero failures/skips. Six tests execute the actual extracted shell with doubles, including successful bounded-settle/chmod ordering and missing/unreadable/unwritable device, failed chmod and failed reload rejection. These tests do not invoke host sudo/udev or real KVM. Existing candidate wildcard discovers these tests before packing, and five strict release integration guards pass. git diff --check passed. All three final source/report SHA256s and the patch digest independently match the frozen manifest.

No claim is made that a real hosted device is currently available, that the unknown original failure is fixed, or that emulator/app scenarios passed. The next hosted run must prove access, acceleration, boot and both native import-path scenarios. Owner labels/approval and release/publication restrictions remain unchanged.

## Frozen bindings

```json
{
  "schemaVersion": 1,
  "base": "4076da6ddde38e1d3c9bf55f73857bac609e6ffe",
  "alsoAppliesToKitchenBase": "ef8f9598d1990e12d80dd55ab8f74abc7654b3d7",
  "files": {
    ".github/workflows/kitchen-sink.yml": "724d7ea4949b14a804766148f821715a1450c447c4675b414687231706b669c5",
    "docs/completion/reports/standalone-v1-2026-11-23-KVM-PERMISSIONS.md": "a4c5d603c15be64484c4991786ce28c9f71222f574571f492cda31c7abc4f5dc",
    "tooling/kitchen-sink/kvm-permissions.test.mjs": "2ff5e747d023a7911edfcaa63ed9e402c9c6313843642a940af3c476c9a7cc87"
  },
  "patchSha256": "df5ddb27eba5c75211ac186549c51dce5821a2864ff5eac3e5ac35dfc5dafcc7",
  "validation": {
    "targetedTests": 31,
    "candidateTests": 26,
    "failed": 0,
    "skipped": 0,
    "realKvmAndNativeFlows": "NOT RUN; hosted retry required"
  }
}
```
