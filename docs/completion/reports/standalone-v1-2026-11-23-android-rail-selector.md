# Kitchen rail selectors after native AX flattening

[Android run 45113126507](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/45113126507/job/137489963354) failed while scrolling to Editor childOf rail-demo. The failure hierarchy exposes the later shell's Editor and Unavailable accessibility names under generic containers, without their React rail parent. The lead's local Argent diagnostic also found the fully visible standalone rail flattened. The prior childOf fix assumed React ancestry established native accessibility ancestry; that assumption was incorrect, and this follow-up supersedes it without changing the historical evidence.

The app-owned kitchen fixture now gives the collapsed shell contextual names: Shell Library, Shell Editor and Shell Unavailable. The standalone rail retains Library, Editor and Unavailable. This identifies which example each action belongs to for assistive technology; hidden visual labels, icons, item IDs, selection callbacks and disabled state stay intact. No NavigationItem props or public API changes are required.

The native flow scrolls to and taps anchored ^Editor$, then checks its selected state. It scrolls to anchored ^Unavailable$ before checking disabled state. These selectors do not depend on native parents, coordinates or guessed geometry, and cannot match Shell Editor or the explanatory paragraph. Both modes retain the same twenty-seven assertion intents in the same order, including selected-result, collapse, retained draft, physical edge and RTL checks. No viewport, version, dependency, timeout, native configuration, collector or approval change is introduced.

The fixture naming change and native selectors must land atomically. Applying only the flow to the old duplicate shell names would not establish unique target identity. The web proof now checks each standalone and Shell name is globally unique, checks the Shell name within its own fixture, then runs the existing selected/disabled/state/geometry checks. Saved historical QA records remain historical; they are not relabelled as current native results.

## Actual checks and limits

- All thirty-five kitchen unit/startup/collector/flow regressions passed with zero skips/failures. Anchored matching rejects the later Shell Editor even in a flattened synthetic accessibility list.
- TypeScript checking of the updated app fixture against the unchanged installed libraries passed.
- A task-owned development Expo export, using existing libraries read-only, passed thirty-two direct/root browser assertions for unique names, collapsed names, selection and disabled state.
- The complete updated web check passed 124 assertions across four appearance/import cases, including automated accessibility scans with zero violations and the existing narrow-pane/phone layout checks.

The development export preserves its original installed-library source commit f0dd6ddf6358391ae5a358155c9497c0b92d66ab and sourceDirty true. It is explicitly ineligible as current candidate acceptance; the accompanying development JSON records that boundary and the actual archive/hash identity. No new native execution pass is claimed. The lead owns the actual Android check; hosted current-source archive/native flows must provide their own receipt.

Failure hierarchy SHA256: ae4f6a26c2e97458aa15e91194bb107e306aa421cf6aa10fd4e087b0bf59a01d.
