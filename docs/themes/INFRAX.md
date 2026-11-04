# InFraX visual direction — NYC-Tron-UI + Web Designer Pro

Source: user-supplied `web-designer-pro.zip` design skill, November 2026. This preset defines the native/semantic token layer; it does **not** copy the ZIP's HTML kits or distribute its font files.

**Signature:** deep-navy infrastructure console, one disciplined industrial orange, sharp but readable typography, warm-white information canvas, crisp evidence indicators, and restrained Kinetrell motion. Keep InFraX's existing branded look rather than applying NYC-MON's TRON imagery or Moyo's neubrutalist treatment.

- Hero: three planes (ground/depth, live **sourced** intelligence subject, contextual requirement card), no made-up statistics.
- Core workstation: sortable responsive table with horizontal overflow and sticky identifier, selected candidate source-drawer; no tiny 9px desktop text.
- Mobile and foldables: rail collapses and panes reflow around reported hinges/occlusion using NYC-Tron geometry; no naive full-screen overlay over a separating hinge.
- Status color must convey verified/unknown/error semantics and always include text. Never animate a fake "Live" badge.
- Motion: Kinetrell on supported web/native adapter, 120ms response, 240ms main transition, respect reduced-motion; content never invisible pending JS.
- Native: Compose/SwiftUI/Fluent where platform adapter support exists; browser has semantic native host rather than raw HTML application components.
- Explicitly test empty, pending, stale, conflict, permission-denied and offline states at 390px, 768px, 1280px and 1440px with keyboard and reduced motion.

## Tokens

`infraxTokens(INFRAX_THEME)` and `infraxTokens(INFRAX_DARK_THEME)` return the
13 CSS variables listed in [THEME_TOKENS.md](../THEME_TOKENS.md), so every
NYC-Tron component recipe resolves. Spread them into the app's light and dark
theme blocks. Pass `{ appearance }` when a customized theme object should map
as dark, and `{ status }` to replace the danger and accent colors.

Labels on the brand orange are navy (`#000d1a`, 6.67:1). White on `#f37021`
is 2.94:1 and fails WCAG AA for button text. The light accent is the darker
`#b04d0c` so wires, knob rings and waveform bars reach 3:1 on the sunken
surface; dark mode keeps `#f37021`. `packages/core/tests/infrax-theme.test.mjs`
checks every text pair at 4.5:1 and the accent and focus at 3:1 in both
appearances.

The preset is imported from its subpath only; the theme-agnostic
`@nyc-tron/core` root does not re-export it.

`@nyc-tron/core/presets/infrax` is a **private unmerged export** until its base PRs ship. Host app should not attempt to install it from npm before that gate.
