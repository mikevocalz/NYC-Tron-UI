# f450eaa rendered browser and installed-consumer results

The earlier helper overlay run failed during fixture bundling because its
source aliases omitted `@nyc-tron/core/overlays`. The new helper carries the
already-reviewed aggregate correction from `2899ffde`, exact server blob
`2687299e55689f6fca67d7a8904eb85923d2aaa9`. Removing that single alias line
reproduces its previous blob `4fdde0ddb7c1a3befdc00dc89038d4ea9af7d606`.
Real component source and all browser assertions remain unchanged.

## Actual CI result

Every complete original job log confirms actual checkout
`3765f328a994524b530c8876b8e2228c2d36a878`, tree
`0ddf3e304dc2e1265baeaa24984674bd5985a64b`.
Root and the independent reviewer verified its ordered parents:
`0edd5f302e99877191ba9a412c5c060571a5f6c9` and helper head
`f450eaa21589bcc72e6d25f31a1b205e7015ff01`.

| Job | Complete original log result | Retained full log |
|---|---|---|
| [Overlay Chromium](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42924119465/job/130206100772) | 32 passed, 11.9 seconds | [overlay-job.log](overlay-job.log) |
| [Instrument Chromium](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42924119412/job/130206100789) | 686 passed, 4.3 minutes | [instrument-job.log](instrument-job.log) |
| [Expo installed consumer](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42924119515/job/130206100867) | 2 passed | [expo-consumer-job.log](expo-consumer-job.log) |
| [Basic installed consumer](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42924119515/job/130206101226) | 1 passed, 1 skipped | [basic-consumer-job.log](basic-consumer-job.log) |

The basic lane skips the named Expo-browser-export case because it does not
install those optional dependencies. The separate Expo lane actually passed
that case. Both lanes passed the installed UI/reflow case; the basic skip is
not counted as a pass or hidden in a combined test total.

The overlay workflow now reaches actual rendered menu, popover, command-palette
and tooltip assertions, including keyboard/focus behavior and responsive
light/dark cases. This closes that helper's former bundle-before-tests blocker.
The complete logs retain the exact individual test names and outcomes.

## Byte identity and retained metadata

Root separately retrieved all four complete job logs, without filtering,
normalizing or rebuilding their contents. Its UTF-8 byte counts and SHA-256
digests match the independent reviewer's retrievals.

| Original log | UTF-8 bytes | SHA-256 |
|---|---:|---|
| Overlay | 43,683 | `2c89f0b4afe4591eae257fe3ba53900ca94edebb192b6c04fafb9c4411773776` |
| Instrument | 148,260 | `56d4763b718196367a0bdfdadab4fc5ee59cbf7fefe13eb17fd074c8c2e34138` |
| Expo consumer | 48,243 | `65e16457de8759c710ba193726d195286574981af5e837224fde5140717ded1c` |
| Basic consumer | 48,238 | `420a79df7f1bb2243bf16cf5a3eae2b82f8635f755d5a3d389646502515b73b4` |

[receipt.json](receipt.json) records source/log identities and exact test counts.
[workflow-metadata.json](workflow-metadata.json) retains normalized job and
artifact responses. Original render artifacts remain available in GitHub:
overlay `13812878389`, instrument `13813526248`, Expo consumer
`13813167598`, and basic consumer `13811939560`.

Their ZIP byte identities are metadata-reported only. The execution workspace
is unavailable, so these archives have not been independently rehashed or
extracted, and their PNGs have not been independently viewed. This receipt
retains complete CI logs and metadata; it does not claim those original archive
members have been copied into the repository.

These are actual results for this exact helper merge. They do not constitute
a local browser run, native Windows acceptance, every component's eight-platform
acceptance, or validation of the final frozen combined candidate. The latter
still requires its own canonical-archive consumer and browser gates.
