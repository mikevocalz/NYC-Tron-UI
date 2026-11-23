# Targeted iOS post-boot verification

Status: fix candidate; hosted retry required. No native acceptance or owner
approval is changed, and no application runtime pass is claimed.

## Actual failure

The retained target artifact from source `900d8ca3` shows successful boot readiness
for the strictly selected iPhone 17. `bootstatus.log` reports “Device already
booted, nothing to do.” and exit 0. The following `failure.txt` reports:

```text
Pinned iOS setup failed at booted-devices: ETIMEDOUT
```

That label belongs to a second all-runtime `simctl list devices available --json`
call with a 90-second timeout. Initial strict selection had already succeeded.
The redundant global enumeration timed out after boot readiness; this evidence
does not establish the underlying CoreSimulator cause. Application fixture
scenarios were not reached by this setup path.

## Narrow verification change

The initial full inventory, exact iPhone 17/iOS 27.0 selection, availability
requirement, no-fallback policy and boot command remain unchanged. After the
existing required `bootstatus <selected-UDID> -b` succeeds, the helper now runs:

```text
simctl getenv <selected-UDID> SIMULATOR_UDID
```

This targeted query has a 30-second bound and must return that exact selected
UDID after whitespace trimming. A blank value, different identity, failed
bootstatus or failed/timed-out query prevents readiness metadata and UDID export.
The successful bootstatus and responding selected simulator establish readiness;
the immutable selected identity binds the original runtime/name. The script
does not infer identity from a viewport or silently select another simulator.

Selection metadata retains the original runtime/name and adds the verification
method and returned UDID. Initial inventory and boot diagnostics remain retained;
the new query writes `booted-device-identity.log`, and errors still write
`failure.txt`. Driver lifecycle, clear-state flows, all root/direct assertions,
archive checks and native receipt gates are untouched. This replaces redundant
global observation with a required target-specific check rather than declaring
success after bootstatus alone.

## Validation

Twelve focused iOS tests passed, zero failed or skipped. Five added cases cover
the exact selected-target command sequence and time budgets, unchanged metadata,
no second global inventory, wrong/empty identity rejection, bootstatus failure
before identity lookup, and targeted-query timeout propagation. Tests use an
injected command recorder; no local simulator command is executed. JavaScript
syntax and whitespace checks passed. No dependency installation or new consumer
was needed. A new hosted run must verify this path and then execute both complete
native fixture modes before any passing iOS receipt can be recorded.
