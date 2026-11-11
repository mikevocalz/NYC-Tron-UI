# c3a52cf rendered browser and installed-consumer results

All five jobs below completed successfully for helper
`c3a52cfc25e90ea01f802c360cacfdc34f0f24b8`, through actual PR checkout
`a79c975bd77834ab80f1fe3fda022009ecd48de0`. Every complete original log
explicitly identifies that checkout. The helper and actual merge share tree
`3d38ebbc0f68124cfc1b7ec654382931bf1a7cf2`; the merge's ordered parents are
`0edd5f302e99877191ba9a412c5c060571a5f6c9` and the helper head.

## Actual results

| Lane | Exact job | Result |
|---|---|---|
| Overlays | [130215724441](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42926949948/job/130215724441) | 32 browser tests passed |
| Reference flows | [130215724514](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42926949921/job/130215724514) | Three model tests passed, zero failures/skips; 29 browser tests passed |
| Instruments | [130215724430](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42926949979/job/130215724430) | 686 browser tests passed |
| Basic installed consumer | [130215725439](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42926949959/job/130215725439) | One passed, one explicitly skipped |
| Expo installed consumer | [130215725740](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42926949959/job/130215725740) | Two passed |

The basic consumer deliberately skips the Expo-only browser-exports case.
The Expo lane actually passes that case. Both lanes pass the installed-UI/reflow
case. The skipped case is retained as a skip; it is not added to the pass count.

The original overlay fixture alias is the already-reviewed one-line correction
introduced before f450. The c3 change concerns only Windows token-query
diagnostics and its mandatory runtime regression. No browser assertions were
weakened to produce these results.

## Original logs and artifact boundaries

All five complete decoded job logs are retained with original line endings.
Root independently fetched the logs, confirmed the actual checkout and result
lines, and computed the exact UTF-8 bytes, SHA-256 and Git blob identities
recorded in [receipt.json](receipt.json).

[workflow-metadata.json](workflow-metadata.json) retains the completed normalized
job and artifact metadata. Artifact sizes and archive digests are reported by
GitHub/the producer. The ZIPs have not been independently rehashed or extracted,
and their PNGs have not been visually inspected in the unavailable execution
workspace. The browser results above are actual CI test results, not claims of
local rendering or separately inspected screenshot fidelity.

The [same-revision Windows native receipt](../v1-windows-c3a52cf-elevated-drag-failure/README.md)
records a successful corrected token query and a failed rejected-drop assertion.
These browser passes do not make that native gate pass, certify all eight
platforms, or establish the final combined candidate. A later frozen source and
its canonical original archives still require their own complete release run.
