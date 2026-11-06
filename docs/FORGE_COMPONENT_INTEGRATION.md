# Forge component integration — November 5, 2026

This branch combines the existing component implementations from PRs #22,
#35, #38, #39, #40, #41 and #42 on top of `main` at `c9e8601`.
It resolves their shared export, theme, test-runner and documentation conflicts.
It does not establish that the entire Forge component inventory is complete.

| Group | Source PRs | Included implementation |
| --- | --- | --- |
| Shell layout | #35 | PaneSplitter, AdaptiveDock, DocumentTabBar, ToolRail, StatusBar |
| Inspector and inputs | #38 | InspectorPanel/Section/Search, PropertyRow, UnitInput, SliderField, RangeSlider, RotaryKnob |
| Commands | #39 | RibbonTabs, SplitButton, ContextMenu, PresetGallery, KeyboardShortcutHUD, FocusAndA11yLayer |
| Spreadsheet | #40 | Grid fill interaction, formula references, tabs, charts, sparklines, freeze/split, cards |
| Mixer and MIDI | #41 | Mixer, channel strip, pan, solo/mute, tempo, piano roll, velocity lane, step sequencer, waveform scrolling |
| Office | #42 | Slide filmstrip/sorter/canvas/animation, rich text/list/outline, PDF search/annotations/comments, read-aloud transports |
| Recording and pairing | #22 | LevelMeter, RecordingTrack, AudioPreview, DevicePairingDialog |

## Integration decisions

- Keep reusable controls in NYC-Tron and keep the existing per-component
  exports. Forge engine packages remain separate; no Forge import enters UI.
- Preserve all existing test lanes, including native-charts and reserved-regions.
- Use the current fixture server, which discovers `fixtures/*.tsx`, and also
  register the spreadsheet branch's root-level fixture. Keep
  `UI_ACCEPTANCE_PORT` as the shared browser-lane setting.
- Preserve every source-port notice and license from the contributing branches.
- Update the recording render harness for WaveformLane's current gesture-store
  hook and PanResponder host. The harness still renders the real waveform;
  it does not stub out the component or remove the failing tests.

## Validation in this session

- Frozen workspace install with repository-pinned pnpm 10.32.1: PASS.
- Unit/source and mocked-host render tests: 410 PASS, zero skipped.
- Workspace TypeScript and emitted builds: PASS.
- Package checks: 227 conditional exports and 277 ESM files PASS.
- Package archive generation: eight tarballs PASS (not published).
- Browser workspace frozen npm install: PASS.
- Chromium download: FAILED (downloaded archive could not be extracted).
  Browser interactions and screenshots were not validated in this session.
- Native builds, hardware interaction, screen-reader output and consumer app
  integration: NOT RUN.

The host's default pnpm was 11.25.0, which rejected recently published lockfile
entries under its default age policy. The successful installation used the
repository's declared pnpm 10.32.1 without changing the lockfile or repo policy.

## Still required for full completion

The source branches' deferred operations remain deferred. In particular:
spreadsheet fill persistence and chart/sparkline storage need engine support;
Cadence needs live playback/metronome integration; office controls still depend
on missing rendering, rich-text, slide and annotation operations documented in
Forge PR #53. The UI only shows capabilities backed by callbacks.

Forge engine adapters are tracked in nitro-forge PRs #50 (Tally), #52
(Cadence), and #53 (Pitch/Quill/Folio), with their prerequisites. This branch
does not merge those engine changes or change the released NYC-Tron pin.

Platform acceptance remains separate: iOS/Android, Windows, macOS, QNX and XR
are not certified by source, TypeScript, mocked hosts or browser tests. No
package publication, release, application deployment or Vercel build is part
of this integration.
