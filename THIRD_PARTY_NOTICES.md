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

**ProCraft for Android** — https://github.com/artcraft-android/procraft-android
MIT License or Apache License 2.0, at your option. Copyright (c) 2026 ArtCraft
Team and the ProCraft contributors. Ported from
`android/app/src/main/java/io/github/artcraftandroid/procraft/ui/ColorPanel.kt`
at commit `c2f7518d03141c746a365f90d8df05a44ddef002` into
`packages/ui/src/components/forge/color/wheel-geometry.ts` and
`floating-palette.ts`; both files carry a modification notice (Apache-2.0
section 4(b)). License texts and ProCraft's NOTICE are preserved verbatim in
`licenses/ProCraft-LICENSE-MIT.txt`, `licenses/ProCraft-LICENSE-APACHE.txt` and
`licenses/ProCraft-NOTICE.txt`. No ProCraft fonts, icons, HDR environments or
other assets are copied.

**WordCraft for Android** — https://github.com/artcraft-android/wordcraft-android
Pinned commit `b2b7cf913c6f61604062e2db30962f32ec921b11`.
Copyright (c) 2026 ArtCraft Team and the WordCraft contributors. Licensed under
the MIT License or the Apache License, Version 2.0, at your option. Both texts
are kept verbatim in `licenses/WordCraft-MIT.txt` and
`licenses/WordCraft-Apache-2.0.txt`; the upstream `NOTICE` file is carried as
`licenses/WordCraft-NOTICE.txt`.

| NYC-Tron file | WordCraft source |
| --- | --- |
| `packages/ui/src/components/forge/office/read-aloud-model.ts` | `crates/engine/src/speech.rs` (sentence splitting, abbreviation and initial rules, spoken-text tidying, word spans, speed limits) |

**PdfCraft for Android** — https://github.com/artcraft-android/pdfcraft-android
Pinned commit `c643244e0e00c1f0b746ceaff4661a91921e907e`.
Copyright (c) 2026 ArtCraft Team and the PdfCraft contributors. Licensed under
the MIT License or the Apache License, Version 2.0, at your option. Both texts
are kept verbatim in `licenses/PdfCraft-MIT.txt` and
`licenses/PdfCraft-Apache-2.0.txt`; the upstream `NOTICE` file is carried as
`licenses/PdfCraft-NOTICE.txt`.

| NYC-Tron file | PdfCraft source |
| --- | --- |
| `packages/ui/src/components/forge/pdf/search-model.ts` | `apps/pdfcraft-android/android/app/src/main/java/io/github/artcraftandroid/pdfcraft/ui/viewer/Search.kt` (search from the current page with wrap-round, page-ordered hit insertion, wrapping next/previous) |

Each ported file starts with a header naming the source file, the commit, the
copyright line, both licenses and a dated modification notice (Apache-2.0
section 4(b)). Only code was ported. No WordCraft or PdfCraft icons (Lucide,
ISC), fonts, CMaps, hyphenation data, brand files or other assets are copied,
and the ArtCraft names and marks are not used in the UI.

**NYC-MON upstream license** — `mikevocalz/nyc-mon/LICENSE`
MIT License — Copyright (c) 2025 Gursel Cakar. The source repository's
license text is preserved verbatim in `licenses/NYC-MON-MIT.txt`.

These notices do **not** license private NYC-Tron-specific additions for
general redistribution. Complete a separate ownership, attribution and
publishing review before removing `private: true` from package manifests.
