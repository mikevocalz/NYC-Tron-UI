# Third-party notices

NYC-Tron UI's own code is MIT-licensed (see `LICENSE`). This file lists the
code and dependencies that come from elsewhere and keep their own licenses.
Copying source into a package does not remove upstream license requirements.
Each ported file carries a header naming its source file, the upstream commit,
the copyright line and a modification notice. The upstream license texts are in
`licenses/`.

This file is a record of provenance, not legal advice or a legal sign-off.

## NYC-MON and NeonBlade UI

- NYC-MON (`mikevocalz/nyc-mon`). Ported or adapted:
  `packages/geometry/src/corner-cut.ts` (from `packages/ui/neon/corner-cut.ts`),
  `packages/core/src/folds.ts` (from `packages/ui/reserved-regions.types.ts`),
  `packages/core/src/navigation.ts` (derived from the pinned
  `mikevocalz-foldable-layouts` skill, section 2), and the reserved-regions
  hook, override and native modules in `packages/reserved-regions`.
  License: MIT, Copyright (c) 2025 Gursel Cakar. Text preserved verbatim in
  `licenses/NYC-MON-MIT.txt`.
- NeonBlade UI (https://github.com/vprix21/neonblade-ui), MIT, Copyright (c)
  2026 NeuronRush. Its vocabulary underlies the NYC-MON corner-cut source. Text
  preserved verbatim in `licenses/NEONBLADE-MIT.txt`.
- Nitro Forge (`mikevocalz/nitro-forge`), the owner's own repository:
  `packages/ui/src/components/forge/waveform.ts` (min/max extrema math from the
  draft media-ui WaveformLane, PR #25) and the icon extraction in
  `packages/icons`. Nitro Forge draft PRs #25, #26, #32, #34 and #35 are
  references only; they are not merged, packaged or certified here.

## ArtCraft family

All five upstreams below are licensed MIT or Apache-2.0 at the user's option,
Copyright (c) 2026 ArtCraft Team and the respective project contributors. Both
license texts and each upstream NOTICE file are kept in `licenses/`. Only code
was ported. No ArtCraft fonts, icons (Lucide, ISC), models, HDR environments,
CMaps, hyphenation data, brand files or other assets are copied, and the
ArtCraft names and marks are not used. No CapCraft (AGPL-3.0) source is used.
Each file below starts with a header naming the source file, the commit, the
copyright line and a dated modification notice (Apache-2.0 section 4(b)).

### ProCraft for Android

https://github.com/artcraft-android/procraft-android, commit
`c2f7518d03141c746a365f90d8df05a44ddef002`. Texts:
`licenses/ProCraft-LICENSE-MIT.txt`, `licenses/ProCraft-LICENSE-APACHE.txt`,
`licenses/ProCraft-NOTICE.txt`. Kotlin paths below are under
`android/app/src/main/java/io/github/artcraftandroid/procraft/ui/`.

All NYC-Tron paths are under `packages/ui/src/components/forge/`.

| NYC-Tron file | ProCraft source |
| --- | --- |
| `color/wheel-geometry.ts` | `ColorPanel.kt` (`Disc` picker ring and disc geometry) |
| `color/floating-palette.ts` | `ColorPanel.kt` (`UndockHandle` and floating palette) |
| `canvas/ruler-model.ts` | `crates/engine/src/guide.rs` (`LengthUnit`) |
| `canvas/snap-grid-model.ts` | `crates/engine/src/transform.rs` (`snap_offset`) |
| `canvas/transform-origin-model.ts` | `crates/engine/src/transform.rs` (`MAGNETIC_STEP`, 15 degree steps) |
| `layers/clipping-model.ts` | `LayersPanel.kt` (`LayerRow` clipped-layer rules) |
| `layers/ClippingMaskControls.tsx` | `LayersPanel.kt` (`LayerRow` clipping controls) |
| `layers/layer-thumbnail-model.ts` | `LayersPanel.kt` (`Thumb`, `checker`) |
| `layers/LayerThumbnail.tsx` | `LayersPanel.kt` (`Thumb`) |
| `layers/MaskThumbnailAndEditor.tsx` | `LayersPanel.kt` (`Thumb` and mask editing) |
| `canvas-tools/reference-board-model.ts` | `ReferenceUi.kt` and `crates/core/src/reference_view.rs` (`ReferenceWindow`) |
| `canvas-tools/ReferenceImageBoard.tsx` | `ReferenceUi.kt` (reference window) |
| `canvas-tools/color-drop-model.ts` | `ColorDropUi.kt` (`dropSource`, `DropDot`) |
| `canvas-tools/ColorDropCanvasTarget.tsx` | `ColorDropUi.kt` (tap or drag color chip) |
| `canvas-tools/gesture-map-model.ts` | `crates/core/src/gestures.rs` and `GestureControlsUi.kt` |
| `canvas-tools/GestureCustomizationPanel.tsx` | `GestureControlsUi.kt` (`GestureControls`) |

`layers/ClippingMaskControls.tsx` and `layers/MaskThumbnailAndEditor.tsx` also
carry "Modified for NYC-Tron UI on 2026-11-06: added document ownership and
permission guards; original licenses retained."

### FilmCraft for Android

https://github.com/artcraft-android/filmcraft-android, commit
`c41b58467edd28d098336286528159b24c5203b5`. Texts:
`licenses/FilmCraft-LICENSE-MIT.txt`, `licenses/FilmCraft-LICENSE-APACHE.txt`,
`licenses/FilmCraft-NOTICE.txt`. Kotlin paths are under
`apps/filmcraft-android/android/app/src/main/java/io/github/artcraftandroid/filmcraft/ui/editor/`.

| NYC-Tron file | FilmCraft source |
| --- | --- |
| `packages/ui/src/components/forge/timeline/ruler.ts` | `TimelineMath.kt` (`rulerStep`, `rulerLabel`) |
| `packages/ui/src/components/forge/timeline/ClipTrimHandles.tsx` | `Timeline.kt` (trim drag handles) |

### GridCraft for Android

https://github.com/artcraft-android/gridcraft-android, commit
`72d5bfc0729d0966e9bd966c2eabaa0312eea3ff`. Texts: `licenses/GridCraft-MIT.txt`,
`licenses/GridCraft-Apache-2.0.txt`, `licenses/GridCraft-NOTICE.txt`. GridCraft's
`ATTRIBUTION.md` lists assets; none are used. Kotlin paths are under
`apps/gridcraft-android/android/app/src/main/java/io/github/artcraftandroid/gridcraft/ui/editor/`.

| NYC-Tron file | GridCraft source |
| --- | --- |
| `packages/ui/src/components/forge/spreadsheet/reference-colors.ts` | `FormulaRefs.kt` (per-reference color assignment) |
| `packages/ui/src/components/forge/spreadsheet/cards-model.ts` | `Cards.kt` (card title and preview-field model) |
| `packages/ui/src/components/forge/spreadsheet/SpreadsheetCardsView.tsx` | `Cards.kt` (Cards View list, detail and field editing) |

### WordCraft for Android

https://github.com/artcraft-android/wordcraft-android, commit
`b2b7cf913c6f61604062e2db30962f32ec921b11`. Texts: `licenses/WordCraft-MIT.txt`,
`licenses/WordCraft-Apache-2.0.txt`, `licenses/WordCraft-NOTICE.txt`.

| NYC-Tron file | WordCraft source |
| --- | --- |
| `packages/ui/src/components/forge/office/read-aloud-model.ts` | `crates/engine/src/speech.rs` (sentence splitting, abbreviation and initial rules, spoken-text tidying, word spans, speed limits) |

### PdfCraft for Android

https://github.com/artcraft-android/pdfcraft-android, commit
`c643244e0e00c1f0b746ceaff4661a91921e907e`. Texts: `licenses/PdfCraft-MIT.txt`,
`licenses/PdfCraft-Apache-2.0.txt`, `licenses/PdfCraft-NOTICE.txt`.

| NYC-Tron file | PdfCraft source |
| --- | --- |
| `packages/ui/src/components/forge/pdf/search-model.ts` | `apps/pdfcraft-android/android/app/src/main/java/io/github/artcraftandroid/pdfcraft/ui/viewer/Search.kt` (search from the current page with wrap-round, page-ordered hit insertion, wrapping next and previous) |

That is 23 files with ArtCraft headers: 16 ProCraft, 2 FilmCraft, 3 GridCraft,
1 WordCraft, 1 PdfCraft.

## Floating UI coordinate placement

`packages/geometry/src/overlay-placement.ts` adapts `computeCoordsFromPlacement`
from https://github.com/floating-ui/floating-ui at commit
`e1e9f88993c19426563decfcc991feb706f1ac66` and inlines its pure axis and
alignment helpers. MIT, Copyright (c) 2021 Floating UI contributors. The blobs
and modification boundary are in `packages/geometry/THIRD_PARTY_NOTICES.md`; the
license is `packages/geometry/licenses/floating-ui-MIT.txt`. No Floating UI
runtime dependency is added.

## AudioKit Controls

`packages/native-controls` contains newly authored SwiftUI and Compose
adaptations of the interaction geometry and visual affordances of
https://github.com/AudioKit/Controls (commit
`717ce0d6d4e18f2849d484b578e0faf13bb38077`; `ArcKnob.swift`, `XYPad.swift`,
`Control.swift`, `TwoParameterControl.swift` were inspected). MIT, Copyright (c)
2022 Aurelius Prochazka. Text: `licenses/AudioKit-Controls-MIT.txt`. Details are
in `packages/native-controls/THIRD_PARTY_NOTICES.md`.

## React Native Skia (optional peer)

`GPUCanvasViewport` uses `react-native-skia` 3.9.1 through an optional peer
dependency. Its implementation is not copied and its native binaries are not
bundled. MIT, Copyright 2026-present William Candillon; Copyright 2021-2026
Shopify Inc. Text: `licenses/REACT-NATIVE-SKIA-MIT.txt`. The runtime's Dawn,
Graphite and CanvasKit dependencies keep their own notices, which apply to apps
that distribute them.

## Vico (Maven reference)

`packages/native-charts` resolves `com.patrykandpatrick.vico:compose-m3:3.2.3`
from Maven Central at Android build time. Apache-2.0, Copyright 2026 by Patryk
Goworowski and Patrick Michalik. No source is copied. Apps that ship the Android
build carry Vico's notice with their other attributions. See
`packages/native-charts/THIRD_PARTY_NOTICES.md`.

## Mediabunny (MPL-2.0)

`packages/platform-services` imports unmodified Mediabunny 1.65.2 in its web
frame decoder. Mediabunny is licensed under the Mozilla Public License 2.0; the
license text ships at `packages/platform-services/third-party/mediabunny/LICENSE`.
The complete Source Code Form is available from the
[npm source package](https://registry.npmjs.org/mediabunny/-/mediabunny-1.65.2.tgz)
and at
[upstream commit 173f6b70765fa3a6ffc1c82737514416fa559ef5](https://github.com/Vanilagy/mediabunny/tree/173f6b70765fa3a6ffc1c82737514416fa559ef5).
The npm archive's SHA512 integrity is
`sha512-goZpibvo/5hkc/56WVNm93Ini+o7K4y8aXA20c/BN1B+m3L5aHQa8MTvO+S1APg/YI8kMILtrX6QCqUtxLW7bA==`.
NYC-Tron imports the dependency and does not modify or copy its source.
Consumers that bundle its executable code must retain its notices and this
source-availability statement. The dependency closure also installs
`@types/dom-mediacapture-transform` 0.1.12 and `@types/dom-webcodecs` 0.1.13
(MIT, Copyright Microsoft Corporation; declaration packages). Full detail:
`packages/platform-services/THIRD_PARTY.md`. Owner distribution-review status is
tracked in `docs/V1_DECISIONS.md`, D2; this notice records provenance and source
availability, not an owner compliance attestation.

## React Native Windows sample pattern

`packages/windows-fluent/rnw-fabric` follows the XAML Fabric ContentIsland
pattern of the React Native Windows 0.85 sample
`packages/sample-custom-component/windows/SampleCustomComponent/ComboBox.cpp`.
MIT, Copyright (c) Microsoft Corporation and contributors. Text:
`licenses/REACT-NATIVE-WINDOWS-MIT.txt`.

## Legend Spark and the isolated AppKit host

`packages/macos-appkit/spark` imports Legend Spark 0.0.2 as an exact peer.
Its controls and window bindings are original NYC-Tron code; Spark's source
and native runtime are installed separately. The AppKit consumer retains
Spark's Expo 55 / React Native 0.83 / Nitro Modules 0.37.0 runtime and the
official release's matching patched SDK archives. The preparation receipt
records those archives and their verified hashes. They are not copied into
the NYC-Tron adapter archive. Exact dependency versions, upstream locations
and the native test-code boundary are recorded in
`packages/macos-appkit/spark/THIRD_PARTY_NOTICES.md`.

## Reviewed, no code used

`docs/advanced-gui-sources.json` records eight upstream files that were read
for design. Seven are `source-reviewed-not-ported`: `superlistapp/super_native_extensions`
(MIT), `caplin/FlexLayout` (MIT), `tauri-apps/tao` (Apache-2.0),
`TanStack/virtual` (MIT), `xyflow/xyflow` (MIT), `kando-menu/kando` (MIT) and
`react/react-native` `ReactEditText.kt` (MIT). No code from them is in this
repository. The eighth, `floating-ui/floating-ui`, is `partial-coordinate-port`
and is covered above.

`CommunityToolkit/Windows` (MIT, Copyright (c) .NET Foundation and
Contributors) and `microsoft/Win2D` (MIT, Copyright (c) Microsoft Corporation)
are listed as upstream candidates in `packages/core/src/advanced-catalog.ts`.
No code from either is in this repository, so their license texts are not
shipped.

## Not licensed here

No external fonts, icons, branding, binary SDKs or artwork are redistributed
except where named above.
