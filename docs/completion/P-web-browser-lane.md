# Web browser acceptance lane — Playwright Chromium

Date: 2026-11-08. Platform gate: `web` only. Status recorded: `partial`.

## What ran

```sh
cd packages/ui/tests/browser
npm ci --ignore-scripts --no-audit --no-fund
npx playwright test
```

Playwright 1.62.1 drove headless Chromium (chromium-1234) on macOS arm64 against
`server.mjs`, which esbuild-bundles each fixture (React Native Web 0.21.4,
Tailwind v4 tokens, Uniwind shim) and serves it on `http://127.0.0.1:4179`.
Every `*.spec.mjs` file ran: **81 spec files,
657 tests, 657 passed, 0 failed, 0 skipped** in 1.8 minutes.
Raw per-test log and machine-readable summary: `P-web-browser-proof.json`.

## Row coverage

Each spec's component coverage was derived from the esbuild metafile inputs of
the fixture page(s) it loads — the real component sources bundled into the page
the spec drives — matched to canonical `sourceCandidates`. Bundle inclusion
shows the component rendered inside a passing spec's page; it does not prove
every prop path of that component was exercised. 177
of 341 rows have at least one passing web spec; those rows now carry
`platformEvidence.web = {status: "partial"}`. Specs that only exercise
non-canonical supporting primitives (for example `forms.spec.mjs`,
`primitives.spec.mjs`, `ink.spec.mjs`, `pairing.spec.mjs`) map to no rows and
are listed for completeness.

| Spec | Tests | Fixtures | Canonical rows bundled |
| --- | --- | --- | --- |
| `analysis-shots.spec.mjs` | 8 | `/analysis`, `/analysis`, `/analysis`, `/analysis` | E-05, E-17 |
| `analysis.spec.mjs` | 6 | `/analysis`, `/analysis`, `/analysis`, `/analysis`, `/analysis`, `/analysis`, `/analysis` | E-05, E-17 |
| `artboard.spec.mjs` | 8 | `/artboard` | B-10, B-14 |
| `automation-shots.spec.mjs` | 7 | `/automation`, `/automation`, `/automation` | E-11, E-12 |
| `automation.spec.mjs` | 9 | `/automation`, `/automation`, `/automation` | E-11, E-12 |
| `canvas-guides-shots.spec.mjs` | 6 | `/canvas-guides`, `/canvas-guides`, `/canvas-guides`, `/canvas-guides`, `/canvas-guides` | A-12, B-03, B-04, B-05, B-08, B-25, N-06 |
| `canvas-guides.spec.mjs` | 11 | `/canvas-guides`, `/canvas-guides` | A-12, B-03, B-04, B-05, B-08, B-25, N-06 |
| `canvas-navigation.spec.mjs` | 9 | `/canvas-navigation`, `/canvas-navigation` | B-02 |
| `color-adjustments.spec.mjs` | 14 | `/color-adjustments`, `/color-adjustments`, `/color-adjustments` | A-13, A-14, C-02, C-04, C-06, C-11, C-16, C-17, C-19, C-20, C-21, C-22, C-23, C-24, C-27 |
| `color-management.spec.mjs` | 9 | `/color-management`, `/color-management`, `/color-management` | A-13, C-06, C-07, C-08, C-09, C-10, C-14, C-15, C-25 |
| `color-shots.spec.mjs` | 5 | `/color`, `/color`, `/color` | B-28, C-03, C-05, C-06, C-12, C-13, C-18, C-26, C-27 |
| `color.spec.mjs` | 13 | `/color`, `/color`, `/color`, `/color`, `/color`, `/color`, `/color` | B-28, C-03, C-05, C-06, C-12, C-13, C-18, C-26, C-27 |
| `command-ownership.spec.mjs` | 4 | `/command-ownership` | A-05, A-06, A-07, A-08, A-17 |
| `composition-tree.spec.mjs` | 3 | `/composition-tree` | G-01 |
| `eqdyn-shots.spec.mjs` | 6 | `/eqdyn`, `/eqdyn`, `/eqdyn`, `/eqdyn` | A-12, E-21, E-22, N-06 |
| `eqdyn.spec.mjs` | 10 | `/eqdyn`, `/eqdyn`, `/eqdyn` | A-12, E-21, E-22, N-06 |
| `forms-shots.spec.mjs` | 6 | `/forms`, `/forms`, `/forms` | — |
| `forms.spec.mjs` | 7 | `/forms`, `/forms` | — |
| `gpu-canvas.spec.mjs` | 3 | `/gpu-canvas` | B-01 |
| `hardware-keys.spec.mjs` | 3 | `/shell-commands` | A-08, A-17, A-19, A-21, A-23, A-27, A-28, N-06, N-07 |
| `ink.spec.mjs` | 10 | `/ink`, `/ink`, `/ink` | — |
| `layer-blend.spec.mjs` | 10 | `/layer-blend`, `/layer-blend` | A-12, B-11, N-06 |
| `layer-panels-shots.spec.mjs` | 6 | `/layer-panels`, `/layer-panels`, `/layer-panels`, `/layer-panels` | A-12, B-09, B-10, B-12, B-13, B-14, B-27, N-06 |
| `layer-panels.spec.mjs` | 12 | `/layer-panels`, `/layer-panels`, `/layer-panels`, `/layer-panels`, `/layer-panels` | A-12, B-09, B-10, B-12, B-13, B-14, B-27, N-06 |
| `layer-tree.spec.mjs` | 12 | `/layer-tree`, `/layer-tree` | A-12, B-09, B-13, N-06 |
| `layers.spec.mjs` | 4 | `/(root)` | A-12, B-09, B-13, D-04, N-06 |
| `mask-clip.spec.mjs` | 10 | `/mask-clip` | A-12, B-10, B-12, B-13, N-06 |
| `media6.spec.mjs` | 10 | `/media6`, `/media6`, `/media6` | N-20 |
| `midi2-shots.spec.mjs` | 7 | `/midi2`, `/midi2`, `/midi2` | E-24, E-25 |
| `midi2.spec.mjs` | 8 | `/midi2`, `/midi2`, `/midi2` | E-24, E-25 |
| `mixer.spec.mjs` | 10 | `/mixer`, `/mixer`, `/mixer` | A-12, E-02, E-13, E-18, E-19, E-20, E-24, E-25, E-26, E-27, N-06 |
| `mixer2-shots.spec.mjs` | 7 | `/mixer2`, `/mixer2`, `/mixer2` | E-13, E-18, E-19, E-20 |
| `mixer2.spec.mjs` | 6 | `/mixer2`, `/mixer2` | E-13, E-18, E-19, E-20 |
| `motion-curves.spec.mjs` | 5 | `/motion-curves` | A-13, G-03, G-04, G-13 |
| `motion-effects.spec.mjs` | 5 | `/motion-effects` | A-13, G-10 |
| `motion-expression.spec.mjs` | 5 | `/motion-expression` | G-11 |
| `motion-node-graph.spec.mjs` | 5 | `/motion-node-graph` | A-13, G-14 |
| `motion-path.spec.mjs` | 3 | `/motion-path` | B-21, G-06 |
| `motion-queue.spec.mjs` | 6 | `/motion-queue`, `/motion-queue`, `/motion-queue` | A-13, G-05, G-15 |
| `motion-settings.spec.mjs` | 4 | `/motion-settings` | A-13, G-07, G-08, G-09, G-12 |
| `motion-timeline.spec.mjs` | 5 | `/motion-timeline` | A-13, G-02 |
| `multi-selection.spec.mjs` | 10 | `/multi-selection`, `/multi-selection` | A-11, A-13, B-07, B-19 |
| `office-shots.spec.mjs` | 17 | `/office`, `/office`, `/office`, `/office` | A-13, H-03, H-07, H-15, H-21, J-01, J-02, J-05, J-09, K-04, K-06, K-07, K-18 |
| `office.spec.mjs` | 16 | `/office`, `/office` | A-13, H-03, H-07, H-15, H-21, J-01, J-02, J-05, J-09, K-04, K-06, K-07, K-18 |
| `overlay-ownership.spec.mjs` | 10 | `/overlay-ownership` | A-18, A-19, A-20, A-21, A-23, A-25, A-27, A-30 |
| `pairing.spec.mjs` | 8 | `/pairing`, `/pairing`, `/pairing`, `/pairing`, `/pairing`, `/pairing` | — |
| `panel-layout.spec.mjs` | 3 | `/panel-layout`, `/panel-layout` | A-12, B-09, B-10, B-12, B-13, B-14, N-06 |
| `photo-catalog.spec.mjs` | 5 | `/photo-catalog` | A-12, A-13, B-27, F-01, F-02, F-12, F-18, N-06 |
| `photo-develop.spec.mjs` | 7 | `/photo-develop`, `/photo-develop`, `/photo-develop` | A-13, F-03, F-04, F-05, F-06, F-07, F-08 |
| `photo-masks.spec.mjs` | 8 | `/photo-masks`, `/photo-masks` | A-13, B-24, F-09, F-10, F-11, F-16 |
| `photo-workflow.spec.mjs` | 6 | `/photo-workflow`, `/photo-workflow`, `/photo-workflow` | A-13, F-13, F-14, F-15, F-17 |
| `precision-ownership.spec.mjs` | 11 | `/precision-ownership` | A-09, A-10, A-11, A-12, A-13, A-14, A-15, A-16, A-21, N-06 |
| `primitives.spec.mjs` | 14 | `/primitives`, `/primitives`, `/primitives` | — |
| `routing-shots.spec.mjs` | 6 | `/routing`, `/routing`, `/routing`, `/routing`, `/routing` | E-19, E-20, E-23 |
| `routing.spec.mjs` | 11 | `/routing`, `/routing`, `/routing`, `/routing`, `/routing`, `/routing`, `/routing`, `/routing`, `/routing` | E-19, E-20, E-23 |
| `scrubber.spec.mjs` | 6 | `/(root)` | A-12, B-09, B-13, D-04, N-06 |
| `seekbar.spec.mjs` | 7 | `/(root)`, `/(root)` | A-12, B-09, B-13, D-04, N-06 |
| `selection-bounds.spec.mjs` | 9 | `/selection-bounds`, `/selection-bounds`, `/selection-bounds` | B-02, B-06 |
| `selection-tools-shots.spec.mjs` | 5 | `/selection-tools`, `/selection-tools`, `/selection-tools`, `/selection-tools`, `/selection-tools` | A-12, B-19, B-20, B-30, B-31, B-34, N-06 |
| `selection-tools.spec.mjs` | 13 | `/selection-tools`, `/selection-tools` | A-12, B-19, B-20, B-30, B-31, B-34, N-06 |
| `shell-commands-shots.spec.mjs` | 7 | `/shell-commands`, `/shell-commands`, `/shell-commands`, `/shell-commands` | A-08, A-17, A-19, A-21, A-23, A-27, A-28, N-06, N-07 |
| `shell-commands.spec.mjs` | 8 | `/shell-commands` | A-08, A-17, A-19, A-21, A-23, A-27, A-28, N-06, N-07 |
| `shell-consumers.spec.mjs` | 8 | `/shell-consumers`, `/shell-consumers` | A-21, A-22, A-24, A-26, A-29 |
| `shell-inspector-shots.spec.mjs` | 8 | `/shell-inspector`, `/shell-inspector`, `/shell-inspector`, `/shell-inspector` | A-09, A-10, A-11, A-13, A-14, A-15, A-16, A-21 |
| `shell-inspector.spec.mjs` | 11 | `/shell-inspector`, `/shell-inspector` | A-09, A-10, A-11, A-13, A-14, A-15, A-16, A-21 |
| `shell-layout-shots.spec.mjs` | 8 | `/shell-layout`, `/shell-layout`, `/shell-layout`, `/shell-layout`, `/shell-layout` | A-03, A-04, A-05, A-06, A-25, N-08 |
| `shell-layout.spec.mjs` | 11 | `/shell-layout` | A-03, A-04, A-05, A-06, A-25, N-08 |
| `shots.spec.mjs` | 14 | `/(root)`, `/(root)`, `/(root)` | A-12, B-09, B-13, D-04, N-06 |
| `spreadsheet.spec.mjs` | 13 | `/spreadsheet` | A-13, I-01, I-03, I-08, I-13, I-14, I-17, I-20 |
| `studio-gaps.spec.mjs` | 18 | `/studio-gaps`, `/studio-gaps`, `/studio-gaps`, `/studio-gaps` | A-12, B-09, B-13, N-06 |
| `thumbnail-ownership.spec.mjs` | 3 | `/thumbnail-ownership` | B-10 |
| `timeline-shots.spec.mjs` | 5 | `/timeline`, `/timeline`, `/timeline` | D-04, D-06, D-07, D-08, D-10, D-11, D-12, D-14, D-15, D-19, D-20, D-25 |
| `timeline.spec.mjs` | 13 | `/timeline`, `/timeline`, `/timeline`, `/timeline`, `/timeline`, `/timeline`, `/timeline`, `/timeline` | D-04, D-06, D-07, D-08, D-10, D-11, D-12, D-14, D-15, D-19, D-20, D-25 |
| `timeline2-shots.spec.mjs` | 5 | `/timeline2`, `/timeline2`, `/timeline2` | D-09, D-10, D-11, D-12, D-13, D-15, D-18, D-19, D-21, D-22, D-23, D-24, D-31, D-37, D-41 |
| `timeline2.spec.mjs` | 9 | `/timeline2` | D-09, D-10, D-11, D-12, D-13, D-15, D-18, D-19, D-21, D-22, D-23, D-24, D-31, D-37, D-41 |
| `unit-boundary.spec.mjs` | 4 | `/unit-boundary`, `/unit-boundary` | A-13 |
| `vector-shots.spec.mjs` | 5 | `/vector`, `/vector`, `/vector` | A-12, B-21, B-22, B-23, B-24, N-06 |
| `vector.spec.mjs` | 19 | `/vector`, `/vector` | A-12, B-21, B-22, B-23, B-24, N-06 |
| `workspace-continuity.spec.mjs` | 6 | `/workspace-continuity` | A-01, A-02, A-03, A-04, N-08 |
| `workspace5-shots.spec.mjs` | 5 | `/workspace5`, `/workspace5`, `/workspace5` | A-01, A-02, A-03, A-04, A-07, A-30, C-01, C-05, C-06, C-13, N-08 |
| `workspace5.spec.mjs` | 8 | `/workspace5`, `/workspace5` | A-01, A-02, A-03, A-04, A-07, A-30, C-01, C-05, C-06, C-13, N-08 |

## Limits

- Headless Chromium only; no physical device, no packaged web build, no screen
  reader narration pass.
- `web` is one of eight required platforms; every covered row remains
  `acceptance: unverified` until ios, android, macos, windows, visionos, quest
  and pico evidence exists.
- `*-shots.spec.mjs` files write review captures under the gitignored
  `shots/` directory; they are not pixel goldens.
- The lane covers React Native Web builds (`.web.tsx` resolution) plus the web
  build of `@expo/ui` universal; native-only adapters are out of scope here.
