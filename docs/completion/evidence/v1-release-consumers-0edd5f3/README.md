# Installed consumer checkpoint at 0edd5f3

The [installed-consumer workflow](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42847218857)
passed for PR head `0edd5f302e99877191ba9a412c5c060571a5f6c9`, with actual
tested merge `e597d73757911e9a58005d577b3c2bf2496bd798`. The retained consumer
and Playwright reports all name that tested merge.

| Consumer | Actual result | Original artifact |
|---|---|---|
| Basic UI | One Chromium test passed; the Expo-only case was intentionally skipped because this fixture omits Expo and unrelated optional peers | `13780085424`, ZIP SHA-256 `5c2fb842ef1b9a7cc5e7fc4061c60f10975e669a92a1cf35ff776dc758fb5459` |
| Expo/web | Both Chromium tests passed, no skips, failures or flaky results | `13781694581`, ZIP SHA-256 `6dc946a3941e67b5c5d80c3d67a49f96b02b3ee582c44419e8bd6e0c815a7497` |

The first Expo/web attempt, job `129937843015`, stopped before building when
Corepack's request for the pinned pnpm archive ended with `ECONNRESET`. The
[original log excerpt](initial-network-failure.log) is retained verbatim. A
single job retry used the same source and tests; replacement job `129960948924`
completed the build, actual archive installation and browser checks. The basic
artifact remains the original successful attempt's artifact.

Both ZIPs were independently downloaded and matched GitHub's recorded digest
before extraction. Every original artifact entry is retained here, including
the generated lockfiles, installed-package receipts, browser input graph,
Playwright report and narrow/wide screenshots. [verification.json](verification.json)
records the source comparison, test counts, original artifact metadata and
per-file hashes. [SHA256SUMS](SHA256SUMS) covers these retained files. The two
wide captures were visually inspected; these minimally styled fixtures test
package consumption and app-owned data rather than the reference app's design.

This checkpoint does not include the later desktop interaction implementation
or correct the separate isolated overlay fixture's missing `core/overlays`
alias. Those changes require their own combined-candidate runs.
