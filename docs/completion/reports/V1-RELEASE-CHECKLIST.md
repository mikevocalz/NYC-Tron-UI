# 1.0.0 release checklist

Status: **prepared; not published.** This change creates no tag, release or
approval. All sixteen release archives carry version `1.0.0`. The latest
published release is
[v1.0.0-rc.2](https://github.com/mikevocalz/NYC-Tron-UI/releases/tag/v1.0.0-rc.2).
rc.3 was prepared but never published, so 1.0.0 follows rc.2 directly.

## Where 1.0.0 is distributed

NYC-Tron is distributed as tarballs attached to a GitHub release, not through
npm. Every `package.json` stays `"private": true`, and
[`.github/workflows/release.yml`](../../../.github/workflows/release.yml) never
publishes to a registry. Consumers install by release URL, for example
`https://github.com/mikevocalz/NYC-Tron-UI/releases/download/v1.0.0/nyc-tron-ui-1.0.0.tgz`.
Publishing to the npm registry would be a separate change: remove `private`,
choose the `@nyc-tron` scope owner and add a publish step.

## What is ready

| Requirement | State in this change |
| --- | --- |
| Sixteen package versions and exact internal desktop peers | `1.0.0` everywhere. |
| Desktop API snapshots | Only the internal `@nyc-tron/core` and `@nyc-tron/windows-fluent` version identities change; `tooling/desktop-provenance.mjs` proves the snapshots equal the published rc.2 snapshots once that relabel is reversed. |
| Inventory, API, registry and LLM files | Regenerated: 164 public component exports, 10 stable and 154 preview, owner-confirmed. |
| CHANGELOG | `[1.0.0]` section lists everything since rc.2. |
| Pull request checks | Every check green on the release-preparation pull request. |

## What only the owner can do

The stable/preview labels are confirmed (step 1 below is done), so two owner
steps remain. With the labels confirmed, `node tooling/release-readiness.mjs
--version 1.0.0` also lists the per-component library evidence the release
workflow gathers from the installed archives; run locally it reports those as
missing, which is expected.

1. **Confirm the stable/preview labels. Done 2026-11-28.** The owner confirmed
   Button, Card, TextField, NavigationRail and NavigationShell as stable (ten
   exports with their root and subpath aliases); the other 154 exports are
   preview. Stable is a semver promise for that public API. The record is
   [`docs/library/stability-review.json`](../../library/stability-review.json),
   bound to proposal digest
   `15985e10df57473baba5460c56285cd473a90674c145dcbfa119446fd753a7a9`. If an
   export is added, removed or relabelled the digest changes and the labels must
   be confirmed again.
2. **Build the candidate archives.** Run the release workflow for `1.0.0`. It
   runs every CI gate, packs the sixteen archives and keeps them with
   `SHA256SUMS` as the `release-candidate-v1.0.0` artifact before the stable
   gate stops on the pending distribution review. No release is created.
3. **Approve distribution.** After reviewing those archives and their notices,
   the owner posts this exact comment on a pull request in this repository:

   ```text
   NYC-Tron distribution approval
   Version: 1.0.0
   SHA256SUMS-SHA256: <sha256 of the exact SHA256SUMS file>
   I approve distribution of these NYC-Tron release archives with their included licenses and source notices.
   ```

   [`docs/completion/distribution-review.json`](../distribution-review.json) then
   records `status: "approved"`, the reviewer, `manifestSha256` and the comment
   URL. Re-running the release workflow reads that comment through GitHub's API
   and only then creates the `v1.0.0` release.

The full gate is described in [V1-RELEASE-GATES.md](V1-RELEASE-GATES.md).

## After 1.0.0 is published

In this repository:

- Point the installation guide (`website/guides.mjs`, regenerated into
  `llms/guides.txt`), the README status line and `tooling/docs-clean-consumer.mjs`
  at the v1.0.0 URLs. They keep the rc.2 URLs until then, because the
  documentation check installs from a release that must already exist.
- Date the `[1.0.0]` CHANGELOG heading.

In Nitro Forge:

- Replace the rc.2 tarball URLs for `@nyc-tron/core` and `@nyc-tron/ui` with
  the v1.0.0 ones.
- Drop the patch Forge applies to rc.2. 1.0.0 ships the general subpaths the
  editor controls import (for example `components/shell/precision` and
  `components/gestures/value-gesture`), so the patch should have nothing left
  to add; confirm by installing without it.
- Re-run Forge's typecheck and tests against the installed 1.0.0 archives, and
  check every `@nyc-tron/ui/components/forge/*` import is gone (1.0.0 removes
  those subpaths; see [MIGRATION.md](../../MIGRATION.md#editor-controls-moved-to-nitro-forge-d10)).
- Optionally adopt `TronThemeProvider` or keep Forge's own CSS variables; both
  keep working.
