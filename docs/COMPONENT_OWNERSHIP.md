# Component inventory and ownership

The **source owner** for every reusable generic or professional Forge control is
`NYC-Tron-UI/packages/ui/src/components/`. Nitro Forge owns document engines,
complex editor screen composition and its cross-engine suite application.

| Component | Source owner / import | Implementation status | Prior source |
| --- | --- | --- | --- |
| Button | `@nyc-tron/ui/components/Button` | RN semantic foundation | NYC-MON Button, Moyo Button |
| Card | `@nyc-tron/ui/components/Card` | RN semantic foundation | NYC-MON / Moyo Card |
| NavigationRail / Shell | `@nyc-tron/ui/components/NavigationRail` | Controlled RN shell, NOT WinUI | NYC-MON / Moyo adaptive |
| DataTable | `@nyc-tron/ui/components/data/DataTable` | TanStack Table v9 headless + custom RN renderer; source/typecheck | Moyo / NYC-MON headless table patterns |
| SpreadsheetGrid | `@nyc-tron/ui/components/forge/SpreadsheetGrid` | TanStack Table v9 visible row/column model + custom two-axis viewport and formula bar; native QA pending | Forge Tally Rust adapter PR #39 |
| WaveformLane | `@nyc-tron/ui/components/forge/WaveformLane` | Source extracted, RN UI | Forge PR #25 / #35 |
| NativeSeekBar | `@nyc-tron/ui/components/forge/NativeSeekBar` | Source extracted, Expo 58 @expo/ui; native build unverified | Forge PR #25 |
| ColorChannels | `@nyc-tron/ui/components/forge/ColorChannels` | Source extracted, Expo 58 @expo/ui; native build unverified | Forge PR #26 / #34 |
| Corner-cut geometry | `@nyc-tron/geometry/corner-cut` | Pure geometry tests | NYC-MON NeonBlade port |
| WindowsNavigationView | Future native Windows adapter | **NOT IMPLEMENTED** | WinUI 3 NavigationView |
| Native dropdown/menu/flyout | Future target-specific adapters | **NOT IMPLEMENTED** | Spark AppKit, WinUI, Expo UI |
| AdaptivePanes/Inspector | Existing consumer implementation; extraction pending | **NOT EXTRACTED** | NYC-MON / Moyo |
| Multi-hinge region planner | `@nyc-tron/core/folds` | Pure contract/tests | NYC-MON adaptive geometry |
| Spatial panels | `@nyc-tron/core/spatial` | Pure specification, no renderer | Viro / spatial starter |
| PrecisionScrubber / draggable fields | `components/forge/PrecisionScrubber` planned | **NOT EXTRACTED** | Forge PR #32 |
| RecordingTrack | `@nyc-tron/ui/components/forge/audio/RecordingTrack` | Controlled RN view over `RecordingViewState`; lane is `forge/WaveformLane`; mocked-host render tests only, native QA pending | Forge PR #37 `NativeRecordingTrack`, `NativeSourceRecordingTrack` (view parts) |
| LevelMeter | `@nyc-tron/ui/components/forge/audio/LevelMeter` | Controlled RN view; dBFS math and throttled band announcements tested; screen-reader output on device unverified | Forge PR #37 meter history |
| AudioPreview | `@nyc-tron/ui/components/forge/audio/AudioPreview` | Controlled RN view over `PreviewViewState`; mocked-host render tests only | Forge PR #37 `NativeAudioPreview` (view parts) |
| DevicePairingDialog | `@nyc-tron/ui/components/forge/devices/DevicePairingDialog` | Controlled RN Modal over `PairingState`; transport-agnostic; mocked-host render tests only | Forge PR #20 `PenConnectionDialog` |
| Track/mixer/fader / EQ controls | `components/forge/audio/` planned (recording views above exist) | **NOT EXTRACTED** | Forge Cadence work |
| Timeline/tracks/edit handles | `components/forge/timeline/` planned | **NOT EXTRACTED** | Forge Splice work |
| Layers, brushes, paint controls | `components/forge/graphics/` planned | **NOT EXTRACTED** | Forge Prism work |
| Color-wheel/HSV and eyedropper | `components/forge/color/` planned | **NOT EXTRACTED** | Forge PR #34 |
| Native whiteboard/ink / Muse tools | `components/forge/ink/` planned | **NOT EXTRACTED** | Forge PRs #18–20 |
| Advanced grid cells/formula references, frozen panes and clipboard | `components/forge/spreadsheet/` planned | **NOT EXTRACTED** (base SpreadsheetGrid exists) | Forge Tally |
| Text editor/typography | `components/forge/document/` planned | **NOT EXTRACTED** | Forge Quill |
| PDF annotations | `components/forge/pdf/` planned | **NOT EXTRACTED** | Forge Folio |
| Slide/canvas transitions | `components/forge/slides/` planned | **NOT EXTRACTED** | Forge Pitch |
| Unified icon glyphs/Rive | `components/icons/` planned | **NOT EXTRACTED** | Forge PR #21 |

**Important:** An npm import subpath chooses one entry point, not an independent
npm installation. Avoid grouping heavy optional native backends into a single
JS entry. Once package sizes are measurable, release separate optional packages
per native capability if necessary. All components still have ONE source owner
in NYC-Tron UI.

Use `unstyled` with a complete app-authored Tailwind recipe when the desired
visual style conflicts with the library's default recipe. This keeps Moyo's
neubrutalist strokes/shadows distinct from NYC-MON's cut-corner look and from
Forge's professional dark editor controls.

### Responsive table split

`@nyc-tron/ui/components/data/DataTable` is a TanStack Table v9 native
record list: it renders mobile label/value cards inside narrow panes and
full columns in wide ones.

`@nyc-tron/ui/components/forge/SpreadsheetGrid` is a **true**
editable coordinate sheet: on mobile it retains rows/column headers and
horizontal scrolling, stacks the formula bar, and expands touch targets.
It receives data from the separate Tally Rust engine, not from a fake
TanStack document engine.

Read [Responsive tables](RESPONSIVE_TABLES.md) for limitations and mobile
acceptance gates.

## Forge package choices

```text
Image:         @nitro-forge/prism     + /forge/* graphics controls you need
Audio:         @nitro-forge/cadence   + /forge/WaveformLane etc.
Video:         @nitro-forge/splice    + /forge/NativeSeekBar etc.
Documents:     @nitro-forge/quill     + /forge/document/* controls
Spreadsheets:  @nitro-forge/tally     + /forge/spreadsheet/* controls
Slides:        @nitro-forge/pitch     + /forge/slides/* controls
PDF:           @nitro-forge/folio     + /forge/pdf/* controls
All editors:   the consumer installs the above packages; there is no new
               monolithic native engine dependency inside NYC-Tron UI.
```

Some of these package names currently exist only on Nitro Forge draft PRs.
Do not claim npm availability or cross-platform native completion until
their respective distributions and PRs pass.

## 2026-11-04 advanced controls

PR #2 adds source-level prototype controls: InstrumentKnob/InstrumentXYPad, TreeGrid, PatchGraph, ImageCropOverlay and CommandPopover. All source resides in NYC-Tron (not Forge). See [the advanced native catalog](ADVANCED_NATIVE_COMPONENTS.md) and @nyc-tron/core/advanced-catalog for complete planned ports and review gates. Native OS adapters, device QA and source licenses are **not** completed by this extraction.

## 2026-11-05 recording views and device pairing

Per Nitro Forge PR #38 the dependency runs one way: Forge imports these views,
NYC-Tron never imports Forge. Microphone capture, PCM buffers, WAV writing,
playback graphs, Bluetooth discovery and the recorder, player and pen
controllers stay in Forge. NYC-Tron receives only controlled views and their
pure state models:

- `forge/audio/recording-model`, `forge/audio/preview-model`,
  `forge/audio/level-meter` and `forge/devices/pairing-model` hold the state
  unions and copy. Forge maps its controller phase onto them.
- Every state has copy and a recovery action: microphone permission denied
  (Settings when the app passes `onOpenSettings`, otherwise ask again), no
  input device, interrupted take (save what was recorded), recorder error,
  no pairing device found (search again), and each pairing error code
  (`permission-denied`, `radio-off`, `connection-failed`, `unknown`) with retry.
- `LevelMeter` is a `progressbar` whose value text is a band, not a number.
  With `announce` it speaks band changes at low priority, at most once per
  `announceIntervalMs` (2 s default); clipping is spoken at once. The bar is not
  a live region. Status lines are polite live regions that change once per phase.
- Closing a connected `DevicePairingDialog` calls `onDone`, never `onCancel`, so
  dismissing the dialog does not disconnect the device.

Evidence is Node tests of the state models plus mocked-host render tests that
run the real components. No simulator, device, TalkBack or VoiceOver pass has
been done for these views.
