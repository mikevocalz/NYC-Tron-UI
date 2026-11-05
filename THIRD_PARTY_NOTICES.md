# Third-party provenance (initial extraction)

This private repository uses adapted concepts/source from the user's existing
projects. Copying source into a new package does **not** remove upstream license
requirements.

- NYC-MON (`mikevocalz/nyc-mon`) UI sources, especially
  `packages/ui/neon/corner-cut.ts`, `packages/ui/adaptive-panes/` and
  `packages/ui/arrangement/`. This is the extraction reference, not a
  promise that entire branded screens have been imported.
- NeonBlade UI (https://github.com/vprix21/neonblade-ui), MIT-licensed
  third-party inspiration/source cited in NYC-MON. Preserve the original
  author's MIT copyright/license notice whenever substantial code is copied.
- Nitro Forge (`mikevocalz/nitro-forge`) draft PRs #25, #26, #32, #34
  and #35: references for professional instrument contracts and the later
  source migration; they are **not** merged, packaged or certified here.
- The core/fold/spatial policy is reimplemented from the named NYC-MON
  authoring and acceptance contract, not a wholesale fork of app source.

See each source repository's own LICENSE/THIRD_PARTY_NOTICES before importing
more source or publishing NYC-Tron as a distributable library. No external
fonts, icons, branding, binary SDKs or artwork are redistributed here.

## License notice retained for source port lineage

**NeonBlade UI** — https://github.com/vprix21/neonblade-ui
MIT License — Copyright (c) 2026 NeuronRush. Original source license
preserved verbatim in `licenses/NEONBLADE-MIT.txt`.

**GridCraft for Android** — https://github.com/artcraft-android/gridcraft-android
Pinned commit `72d5bfc0729d0966e9bd966c2eabaa0312eea3ff`.
Copyright (c) 2026 ArtCraft Team and the GridCraft contributors. Licensed under
the MIT License or the Apache License, Version 2.0, at your option. Both texts
are kept verbatim in `licenses/GridCraft-MIT.txt` and
`licenses/GridCraft-Apache-2.0.txt`; the upstream `NOTICE` file is carried as
`licenses/GridCraft-NOTICE.txt`.

Ported files, each with a header naming the source file, the commit, the
copyright line and a modification notice (Apache-2.0 section 4(b)):

| NYC-Tron file | GridCraft source |
| --- | --- |
| `packages/ui/src/components/forge/spreadsheet/reference-colors.ts` | `apps/gridcraft-android/android/app/src/main/java/io/github/artcraftandroid/gridcraft/ui/editor/FormulaRefs.kt` (per-reference color assignment) |
| `packages/ui/src/components/forge/spreadsheet/cards-model.ts` | `.../ui/editor/Cards.kt` (card title/preview-field model) |
| `packages/ui/src/components/forge/spreadsheet/SpreadsheetCardsView.tsx` | `.../ui/editor/Cards.kt` (Cards View list, detail and field editing) |

Only code was ported. No GridCraft icons (Lucide, ISC), fonts, brand files or
other assets are copied; GridCraft's `ATTRIBUTION.md` lists those and none of
them are used here. The ArtCraft name and marks are not used.

**NYC-MON upstream license** — `mikevocalz/nyc-mon/LICENSE`
MIT License — Copyright (c) 2025 Gursel Cakar. The source repository's
license text is preserved verbatim in `licenses/NYC-MON-MIT.txt`.

These notices do **not** license private NYC-Tron-specific additions for
general redistribution. Complete a separate ownership, attribution and
publishing review before removing `private: true` from package manifests.
