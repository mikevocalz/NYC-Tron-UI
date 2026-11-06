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

**FilmCraft for Android** — https://github.com/artcraft-android/filmcraft-android
MIT License or Apache License 2.0, at your option. Copyright (c) 2026 ArtCraft
Team and the FilmCraft contributors. Ported from
`apps/filmcraft-android/android/app/src/main/java/io/github/artcraftandroid/filmcraft/ui/editor/TimelineMath.kt`
and `Timeline.kt` at commit `c41b58467edd28d098336286528159b24c5203b5` into
`packages/ui/src/components/forge/timeline/ruler.ts` and
`ClipTrimHandles.tsx`; both files carry a modification notice (Apache-2.0
section 4(b)). License texts and FilmCraft's NOTICE are preserved verbatim in
`licenses/FilmCraft-LICENSE-MIT.txt`, `licenses/FilmCraft-LICENSE-APACHE.txt`
and `licenses/FilmCraft-NOTICE.txt`. No FilmCraft fonts, icons, models or
other assets are copied. No CapCraft (AGPL-3.0) source is used.

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

## Floating UI coordinate placement (geometry subpath)

`packages/geometry/src/overlay-placement.ts` adapts the MIT-licensed Floating UI coordinate calculation and inlines its pure axis/alignment helpers at commit `e1e9f88993c19426563decfcc991feb706f1ac66`. Copyright (c) 2021 Floating UI contributors. The exact source/helper/license blobs and modification boundary are recorded in `packages/geometry/THIRD_PARTY_NOTICES.md`; the complete license is `packages/geometry/licenses/floating-ui-MIT.txt`. This port does not include a DOM renderer, native overlay host or the other candidate libraries listed in the source-admission document.

## Optional Skia 3 rendering runtime

`GPUCanvasViewport` uses `react-native-skia` 3.9.1 through an optional peer,
without copying its implementation or bundling its native binaries into the UI
tarball. Its MIT notice is retained in `licenses/REACT-NATIVE-SKIA-MIT.txt`:
Copyright 2026-present William Candillon; Copyright 2021-2026 Shopify Inc.
The native acceptance app pins that version and receives its declared Dawn,
Graphite and CanvasKit runtime dependencies. Their upstream binary/dependency
notices remain applicable to applications distributing those runtimes.
