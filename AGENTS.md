# NYC-Tron UI — product and contribution rules

First read the source layout skill from NYC-MON:
`mikevocalz/nyc-mon/skills/mikevocalz-foldable-layouts/SKILL.md`, 2026-10-15
revision, Git blob `d60f539b263863027ec7593ffaea38304ad1e5d8`.
Read official Expo skills and relevant native platform API docs before making
native changes. Preserve the existing Moyo and NYC-MON product contracts.

1. **One UI owner:** generic and Forge/editor controls live under
   `packages/ui/src/components/` and expose per-component package subpaths.
   Engine operations are never defined or copied here. No import from
   `@nitro-forge/*` in this repository.
2. **The app owns style.** Tailwind v4 + Uniwind CSS, tokens, fonts, radius,
   border geometry, motion and density come from the consuming app. No global
   NYC-MON theme, hardcoded palettes, duplicate styling stack, or raw HTML UI.
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

User direction (2026-11-10): complete the v1 proposal and all twelve remaining
native/service rows. The earlier implementation-first testing pause was
superseded for that work. The original 341 IDs and eight required platforms
remain intact. Follow the current [completion program](docs/completion/PROGRAM.md)
and its [candidate evidence](docs/completion/reports/V1-RELEASE-GATES.md);
earlier phase reports describe their own commits. Source ownership is complete,
but stable release still requires the actual platform evidence and owner
distribution review documented in the release conditions.

## Agent-native

User direction (2026-11-19): make the library usable by agents and by people who never open this repo. Nothing in this section replaces a rule above. It adds the files an agent reads first and the commands that keep them honest.

Read order for an agent that consumes the library: [`SKILL.md`](SKILL.md) (also at `skills/nyc-tron-ui/SKILL.md` for skill installers), then [`llms.txt`](llms.txt), then one page at `docs/components/<id>.md`. `llms-full.txt` holds every page and is about 500k tokens; do not read it whole.

- **Pages.** `docs/components/` has one page per registry item (565: 561 `@nyc-tron/ui` subpaths and 4 `@nyc-tron/core` support modules). Format and CI checks: [`docs/agent-native/doc-template.md`](docs/agent-native/doc-template.md). Tier 1 pages (64) are hand-reviewed and say `docs: "handwritten"`. Tier 2 pages say `docs: "generated"` and keep every section between `generated:begin` and `generated:end` markers.
- **Regenerate, do not hand-edit.** After a change to a component's props, imports, tokens or comments, run `node tooling/docs/build-docs.mjs`, then `node tooling/docs/build-llms.mjs` and `node tooling/docs/build-site.mjs`. Commit the result. `.github/workflows/docs.yml` regenerates all three and fails on any diff. To write a generated page by hand, set its front matter to `docs: "handwritten"` and delete the markers; the generator then leaves it alone.
- **Check.** `node tooling/docs/check-docs.mjs` runs the 12 template checks plus registry, link, token and import-form checks (both install labels present, every example specifier resolves to a registry `files[].target`). It exits non-zero on a failure. Pass `--tsc <tsc.js> --node-modules <dir>` to type-check the examples with both forms mapped to the source; `node tooling/docs/check-docs-control.mjs` proves the checks fail on planted bad pages.
- **Registry files are generated.** `registry.json`, `r/*.json` and `registry-excluded.json` come from `tooling/registry/build-registry.mjs`. Do not edit them. The registry namespace entry lives in `components.json`.
- **Tokens, not literals.** A new colour, spacing, radius, font size or opacity in `packages/*/src` is a token, never a literal. Colours are the 13 theme variables. Spacing keys are unit multiples (`space[2]` is 8px; write half steps as `space[1.5]`, and note `border[1]` is 1px, each table has its own keys). The gate `tooling/codemod/check-no-hardcoded.mjs` covers padding, margin, gap, radius, borderWidth, fontSize, lineHeight, opacity, 44pt min sizes and colour literals. It does not check offsets (`top`, `left`, `right`, `bottom`), width, height, flex, zIndex, shadowRadius, elevation or native code. `docs/agent-native/tokens.json` is the inventory and `docs/agent-native/audit-literals.mjs` counts what is left. A page's front-matter `tokens` list comes from the source scan, so a new literal shows up in a docs diff.
- **Claims stay narrow.** `a11yStatus` is `reviewed-pass`, `reviewed-fail` or `unverified` for tier 1, from reading source (rule 10 applies). `verified` needs a rendered check and an `Evidence:` path. Every `Install` section gives a "Registry install" block (the command and the `@/components/nyc-tron/ui/...` import) and a "Tarball install" block (the `@nyc-tron/ui/...` import), and every `Example` uses the registry import. The registry install stays unverified until a clean app installs from the live `r/` URL. The URL ref is `ref` in `tooling/registry/config.json` (`main` until a release tag exists); `node tooling/registry/set-ref.mjs <ref>` changes it. Native-only packages are listed in `registry-excluded.json` and install from the release tarball.
- **Writing.** Pages, `llms.txt`, `SKILL.md` and this section follow the no-ai-slop rule above: lead with the point, name the prop or file, no marketing words.
