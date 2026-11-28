# Exact Duo CoreSimulator runtime identifier

Draft CI selector correction. New candidate native execution remains NOTRUN; no acceptance pass or release promotion is claimed.

The retained 334b available-devices artifact contains iPhone Duo UUID `C898E3E4-5033-4085-B886-963EE2D0C478` under **com.apple.CoreSimulator.SimRuntime.iOS-27-2-iPhone19-4**, not the generic iOS-27-2 key. The generic key contains regular iPhones. The prior selector therefore failed before app execution because it used the wrong exact inventory key. This is a concrete selector bug, not a newly inferred runtime incompatibility.

The retained inventory JSON is included verbatim after removing only the command log's trailing `Exit code: 0` suffix. It is stock hosted CI inventory, not a local device listing. Its selected UUID exactly matches the existing retained ef8 direct-flow SUCCESS JUnit fixture (iPhone Duo / iOS 27.2). That historical direct pass does not establish current fresh-driver acceptance or root-mode success.

The strict runtime constant now uses that complete observed device-specific key. A separate KITCHEN_IOS_VERSION='27.2' supplies the canonical JUnit display version; runtime IDs are no longer transformed into display versions by replacing hyphens. Exact actual-execution model/version/selected-UUID equality remains required per flow and its metadata now retains the separate version. No generic-key or prefix fallback was introduced.

Initial exact available inventory selection and required bootstatus remain. Fresh default iOS driver installation per mode, all component assertions, clearState, current-stage PNG checks, candidate provenance and the bounded anchored JUnit parser remain unchanged. No time/retry increase, app/window/orientation change or local device commands.

Validation: `node --test tooling/kitchen-sink/*.test.mjs` passed 69 tests, zero failures/skips. The new actual-inventory regression selects the observed UUID and validates it against the actual retained ef8 JUnit. Three negatives refuse generic/runtime-prefix lookalikes; existing wrong-device, wrong-version, wrong-UUID, malformed-XML and receipt guards continue passing. Hosted direct and root flows on the corrected selector remain required.
