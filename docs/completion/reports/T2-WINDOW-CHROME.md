# T2 window chrome: decision and evidence

Gate T2 adds a window title bar and window controls bound to the
`@nyc-tron/core/window-lifecycle` registry. This file is the decision record
the five added inventory rows (W-01 to W-05 in
`docs/completion/library-progress.json`, `additions`) point to, and the index
of their evidence.

## ADR: the window-chrome rows are part of 1.0.0

Status: decided 2026-11-12 by the integrator (A0) on the owner's instruction
to decide: part of 1.0.0.

> Owner confirmation: pending. Reply on the T2 pull request to confirm, or to
> move the rows to the first minor release.

Context. The program prompt (§6 T2.7) asks whether the new rows belong to
`1.0.0` or the first minor, with `1.0.0` as the default because the owner asked
for window controls. The canonical inventory is the SHA-pinned 341-row
baseline, and `tooling/verify-component-program.mjs` refuses any change to its
IDs, names or count.

Decision.

- The baseline stays frozen. The new rows live in an `additions` list with the
  same fields and the same per-row rules, plus `gate` and `decision`.
- Additions count as stable blockers: `tooling/release-readiness.mjs` blocks a
  stable release while any added row lacks accepted proof on all eight
  platforms, exactly as for canonical rows.
- Additions can be added but not dropped. `RECORDED_ADDITION_IDS` in the
  validator lists W-01 to W-05, and removing one fails validation, so nobody
  can pass the stable gate by deleting a row.

Consequences. Stable `1.0.0` needs eight-platform acceptance for 346 rows
instead of 341. A prerelease (`rc.2`) is unaffected. Moving the rows to the
first minor later means removing them from `RECORDED_ADDITION_IDS` in a
reviewed change that cites the owner's decision.

This changes release tooling, so it needs R1 review.

## Rows

| ID | Name | Owner | Source |
| --- | --- | --- | --- |
| W-01 | WindowChromeController | `@nyc-tron/core/window-chrome` | `packages/core/src/window-chrome.ts` |
| W-02 | WindowTitleBar | `@nyc-tron/ui/components/window/WindowTitleBar` | `packages/ui/src/components/window/WindowTitleBar.tsx` |
| W-03 | MacOSWindowChrome | `@nyc-tron/macos-appkit/window-chrome` | `packages/macos-appkit/spark/src/window-chrome.ts` |
| W-04 | WindowsCaptionChrome | `@nyc-tron/windows-fluent-fabric` window chrome | `packages/windows-fluent/rnw-fabric/src/window-chrome.ts` |
| W-05 | WindowControlsInset | `@nyc-tron/reserved-regions` | `packages/reserved-regions/src/useWindowControlsInsets.native.ts` |

Every row is `acceptance: "unverified"`. The receipts below are evidence for
their own commit and platform; none of them accepts a row.

## Evidence

Filled in at the final commit of the T2 pull request.
