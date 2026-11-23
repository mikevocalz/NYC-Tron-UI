# PR #88 — independent export-stability decision memo (2026-11-23)

**Status: review only. No classification, release, tag, package or merge authorization.**

Source: PR #88 head `d186a8250e924a165730efb8fc828c95aacb1ecf`, proposed CI merge `9303459c73be9b039aa2a7c1ee397b2fbc17f867`. Reviewed repository files: `packages/ui/src/components/{Button,Card,TextField,NavigationRail}.tsx`, `packages/ui/package.json`, `docs/library/documentation.json`, `docs/completion/reports/RC3-RELEASE-CHECKLIST.md`, the T5 kitchen and documentation reports and T6 readiness snapshot, plus the PR description. This review did **not** execute builds or fetch raw hosted CI artifacts. The latest CI claims below are **reported by the PR** and should be verified against exact run artifacts before promotion.

## Proposed decision (requires owner approval)

| Component identity | Root export | Direct export | Proposed tier | Recommendation | Rationale |
|---|---|---|---|---|---|
| Button | `@nyc-tron/ui#Button` | `@nyc-tron/ui/components/Button#Button` | stable / stable | **stable / stable, conditional** | Typed variants/size, press behavior, loading+disabled, accessible name/state, kitchen root/direct evidence. Check small 40pt visual control plus hitSlop against platform touch-target expectations. |
| Card | `@nyc-tron/ui#Card` | `@nyc-tron/ui/components/Card#Card` | stable / stable | **stable / stable, conditional** | Compact presentation API and three surfaces; app supplies tokens. |
| TextField | `@nyc-tron/ui#TextField` | `@nyc-tron/ui/components/TextField#TextField` | stable / stable | **stable / stable, conditional** | Typed `TextInputProps`, label and accessibility hint, web-describedby/invalid, native disabled state, validation/draft tests. Assistive speech and interruption handling remain outside current proof. |
| NavigationRail | `@nyc-tron/ui#NavigationRail` | `@nyc-tron/ui/components/NavigationRail#NavigationRail` | stable / stable | **preview / preview** | Source uses tablist/tab roles, but T5 explicitly says full tablist arrow-key handling is not authored or claimed. Focus/selection semantics and native assistive output merit targeted verification. |
| NavigationShell | `@nyc-tron/ui#NavigationShell` | `@nyc-tron/ui/components/NavigationRail#NavigationShell` | stable / stable | **preview / preview** | Physical edge remains independent of RTL, observed in kitchen flow. Additional compatibility guidance needed for nested layout, focus continuity and window/host constraints. |

**Conditional proposal totals: 6 stable / 472 preview across 478 export identities.** Neither tier is currently owner-confirmed; the underlying proposals remain 10 stable / 468 preview. Do not modify `docs/library/components.json`, owner confirmation, or readiness inputs without explicit owner direction. Root/direct aliases of the same component should share a tier unless separate evidence justifies otherwise.

## Evidence matrix and important boundaries

- **Export / API:** `packages/ui/package.json` has explicit root and direct `types`, `react-native`, and default entries. T6 describes 16 built archives, 622 subpaths, 3,354 reachable declarations and unchanged public APIs. These prove source declarations and export presence, not future compatibility or all-host behavior.
- **Documentation:** T5 reports all 478 routes/examples, nine guides, five Chromium browser tests and zero automated axe failures in eight template/viewport checks. Declaration examples are not runtime certification of every component.
- **Expo kitchen:** Both direct and root imports use the five named identities. T5 covers Button states, three Card surfaces, TextField label/errors/retained draft, NavigationRail selection/disabled/collapsed names, and NavigationShell RTL/physical edge at narrow and wide host widths.
- **Hosted runtime, as reported in PR:** Android direct/root, iOS direct/root on pinned Duo/iOS 27.2/C898, 72 unit, one declarations and 124 web checks, seven receipt kinds, and 12 workflow successes. Native RNW/AppKit acceptance is reported as 20/19 checks but explicitly partial component coverage. No physical hardware or universal visionOS/Quest/PICO certification. iOS interruption cancellation remains unverified.
- **Accessibility:** DOM roles/names and zero axe violations do not establish full keyboard tablist behavior or VoiceOver/TalkBack speech. Source-level `NavigationRail` sets `accessibilityRole="tablist"` on container and `"tab"` on items but does not implement roving focus / arrow-key management. T5 docs explicitly exclude complete keyboard traversal, 200% browser zoom and native spoken output.
- **Support tiers:** iOS, Android and web are intended tier 1. macOS Spark and RNW Windows are historical scoped lists with partial host acceptance; unmeasured exports are not verified. XR and physical hardware remain unverified.

## Gate discrepancy requiring reconciliation

The checked-in `standalone-v1-2026-11-23-T6-readiness.json` is a historical **blocked draft snapshot**: 478 owner-confirmation pending, 0 receipts, and `NOT RUN` for all seven check kinds on each ten planning exports. Its local `RC3-RELEASE-CHECKLIST.md` similarly says no clean rc.3 runtime receipts. In contrast, PR #88's later narrative states that clean merge `9303459c` has all seven receipts, 16 checked archives, `missing[]` for all ten, and strict readiness exits 1 *only* due to owner confirmation. Treat these as different points in time; require the final exact-source machine-readable strict readiness output and archived receipts before a release. Avoid modifying historical snapshots to falsely imply the earlier runs passed.

PR-reported CI run references:
- Kitchen: https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/45154050927
- Docs: https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/45154050781
- Native / launcher: https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/45154050900
- PR-reported assembled SHA256SUMS digest: `ba71c39f846b067149f8406cdd654030d33d2bf54b0b2ba003366be50c527336` (not independently recomputed in this review).

## Work remaining before owner-authorized release

1. Owner selects a tier for **every one** of 478 exports (recommended 6 stable and 472 preview, pending narrower target verification). Record the exact confirmation through the existing mechanism; do not infer consent from this memo.
2. Run focused browser keyboard tests for NavigationRail Tab / Shift+Tab / Arrow keys / Home / End, selection and disabled handling. Decide whether to implement tablist semantics or use a more accurate navigation role; validate screen-reader speech before calling it stable.
3. Verify shell focus preservation, nested rail layout, changed host/window sizes and direction changes; make exact supported contract explicit in API docs. Verify TextField native accessibility announcements and interruption/cancel behavior if the release intends to guarantee them.
4. Fetch and inspect all **twelve** workflow conclusions, run/attempt IDs, commits, seven actual per-kind receipts, docs and the sixteen actual tested archives. Run the unchanged strict readiness gate against final clean source; preserve the machine-readable output.
5. Reconcile the final CI source with the reviewed tree and the prerequisite PR merges. Historical dirty artifacts, earlier failed receipts, and previous release tarballs must not substitute.
6. Verify SHA256SUMS and reuse exact independently tested AppKit/RNW archive bytes, package declarations/peer matrix, frozen dependency state, and final release workflow output; prerelease must still pass `--require-library`.
7. Keep `1.0.0-rc.3` private as GitHub Release tarballs; no npm, tag, release, merge, or Forge rc.3 pin before explicit owner approval and actual release evidence. Stable distribution retains its distinct exact version/checksum/comment approval algorithm.

**No code or classification changes are proposed by this memo itself.**
