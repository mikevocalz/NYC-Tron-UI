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
9. **Provenance:** preserve original source and third-party licenses. Current
   repository is private; don't publish until licensing, native support and
   consumer acceptance are documented.
10. **Honesty:** report unit/source checks separately from actual simulator,
    Surface Duo, headset, Windows or macOS native validation.
