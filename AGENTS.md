# NYC-Tron UI — product and contribution rules

First read the source layout skill from NYC-MON:
`mikevocalz/nyc-mon/skills/mikevocalz-foldable-layouts/SKILL.md`, 2026-10-15
revision, Git blob `d60f539b263863027ec7593ffaea38304ad1e5d8`.
Read official Expo skills and relevant native platform API docs before making
native changes. Preserve the existing Moyo and NYC-MON product contracts.

1. **One UI owner:** general app components live under
   `packages/ui/src/components/` and expose per-component package subpaths.
   Editor controls (canvas, layers, timeline, audio, spreadsheet, office and
   similar) belong to `@nitro-forge/editor-controls` in Nitro Forge
   ([D10](docs/V1_DECISIONS.md#d10-editor-controls-move-to-nitro-forge)); do
   not add them or a `components/forge/` tree here. Engine operations are never
   defined or copied here. No import from or dependency on `@nitro-forge/*` in
   this repository; `tooling/verify-packages.mjs` enforces both.
2. **Components never hardcode colors.** Every recipe reads the semantic
   tokens (docs/THEME_TOKENS.md) through Tailwind v4 + Uniwind CSS. Tron ships
   an optional neutral default light/dark theme (`@nyc-tron/core/presets/tron`,
   `@nyc-tron/core/theme.css`) and `TronThemeProvider`; the consuming app can
   override any token or replace the theme entirely, and fonts, radius,
   density and motion stay app-overridable. No NYC-MON palette, duplicate
   styling stack, or raw HTML UI.
3. **Platform implementations must be real.** Windows native Fluent
   NavigationView, macOS AppKit controls, iOS SwiftUI and Android Compose are
   separate adapter workstreams. Do not claim them implemented by RN Views.
   Expo Modules v2 only on compatible Expo 58 hosts, Nitro v1 only where ABI
   verified; Spark SDK 55 desktop must remain isolated.
4. **Navigation shell policy, NOT width-only device guesses:**
   ordinary native phone -> bottom tabs; verified foldable/dual-screen/tablet/
   headset -> physical RIGHT rail even in RTL; Windows desktop -> LEFT
   collapsible drawer; macOS desktop -> native sidebar; web -> header and
   phone-width tabs. Preserve the app-authored router's selection.
5. **Adaptive geometry:** multiple hinges, offset panes, zero-width separating
   folds, nonoccluding creases, book/tabletop modes; no controls overlapping
   hinges. Product state and media/call/XR session live above layout wrappers.
6. **Dependency isolation:** no monolithic barrel importing specialized
   instruments, no whole Forge dependency for an audio scrubber, no engine
   dependency from UI. Per-component subpath imports must resolve independently.
7. **State/motion:** existing Zustand/refs and authored motion adapters;
   avoid useState for new app state. No duplicate pane/Inspector implementations.
8. **Accessibility:** keyboard, VoiceOver/TalkBack/Narrator, pointer, text
   scaling, high contrast, RTL, reduced motion and drag cancellation are gates.
9. **Provenance:** preserve original source and third-party licenses. The
   repository is public. Packages ship only as GitHub Release tarballs (see
   README); don't publish to npm until licensing, native support and consumer
   acceptance are documented.
10. **Honesty:** report unit/source checks separately from actual simulator,
    Surface Duo, headset, Windows or macOS native validation.

## Writing and native skills

User requirement (2026-11-06): apply `nyc-mon/skills/no-ai-slop/SKILL.md` to
user-facing updates and documentation. Use the relevant React Native, Nitro v1,
Swift/Kotlin/C++ and native testing skills before implementation or debugging.
Keep each skill's platform/version guidance aligned with this repository's
pinned runtime and preserve its state, window and ownership contracts.

User requirement (2026-11-07): use subagents for scoped implementation and independent review. Apply relevant native, domain and project skills, and the no-ai-slop skill, to implementation and reports.

## Native feel and adaptive content

User direction (2026-11-09): learn from Expo Exact and its Softwear preview.
Read [Native feel and adaptive content](docs/EXACT_NATIVE_FEEL.md) before changing
shared control presentation or responsive composition. Explicit supported app
styling wins; unspecified presentation uses native platform defaults, followed
by documented shared fallbacks. Keep appearance choices consistent between app
surfaces and native hosts. Constrain reading/form widths, arrange related content
within the current safe container, and preserve mounted children and product
state while resizing. Continue using the navigation and pane owners above.
Record browser and native evidence separately; upstream speed claims are not
NYC-Tron measurements.

## Approved v1 completion checkpoint

User direction (2026-11-22): NYC-Tron UI is an independent UI library.
Nitro Forge consumes Tron; Tron never imports, waits on, or is gated by Forge.
Forge owns its component acceptance program. Tron's v1 scope comes from its
public exports and its own library evidence, documentation and distribution
review, as recorded in [D9](docs/V1_DECISIONS.md#d9-standalone-ui-library-v1).

User direction (2026-11-27 and 2026-11-28,
[D10](docs/V1_DECISIONS.md#d10-editor-controls-move-to-nitro-forge)): Tron
ships general app components only. The editor controls moved to
`@nitro-forge/editor-controls`, which removed the 453 `./components/forge/*`
subpaths and added 20 general subpaths. That removal is the one exception to
D9's rule that no public import path is removed.

Preserve all other public APIs and dated evidence. The manifest, program handoff and
stable-gate migration land separately; this decision does not change validators
or acceptance statuses. Stable publication still requires the owner's own
comment approving the exact version and sixteen-archive checksum binding.

## Program handoff transition

The former program ledger URL is now a pinned pointer to Forge. Original
records, validator and regression tests remain under the dated completion
report archive. The standalone release gate reads `docs/library/components.json` and exact
candidate evidence. The read-only historical reader lives inside the dated
archive; Qt correspondence and archived program rows cannot block Tron release.
Qt correspondence is a dated downstream case study, and the Forge import map
is a lookup only; since D10 it reads moved rows from
`docs/library/editor-controls-migration.json`. Do not change acceptance or owner-approval records to make
this intermediate transition pass.

## For AI agents

Agents that use the library in an app start at [llms.txt](llms.txt), read one
group file under `llms/`, and look exports up in
[registry/components.json](registry/components.json) (schema in
`registry/schema.json`). Follow [skills/nyc-tron-ui/SKILL.md](skills/nyc-tron-ui/SKILL.md):
per-component subpath imports, the app's semantic tokens, Zustand state and
the accessibility notes on each component. `llms.txt`, `llms-full.txt`,
`llms/` and `registry/` are generated by `node tooling/llms.mjs --write` from
`docs/library/components.json` and the docs catalog; never edit them by hand.
Regenerate them in the same change as an inventory update; CI checks them with
`node tooling/llms.mjs --check`. The rules above still apply.
