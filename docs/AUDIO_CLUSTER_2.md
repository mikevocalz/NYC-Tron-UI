# Audio cluster 2: local source completion

The recovered audio worker files are integrated after phases 2 and 3. Twenty-one component/model subpaths are added under `@nyc-tron/ui/components/forge/audio/` and `/midi/`. These additions remain unpublished; production alpha.3 tarballs do not contain them.

| Surface | Behavior and ownership |
| --- | --- |
| BusAndRoutingMatrix | Output to master/bus, post-fader send add/edit/remove; measured cards/grid layout |
| InsertEffectRack, PluginPresetBrowser | Gain/EQ/compressor slots, bypass, reorder, remove, factory presets; selected slot and last-applied preset remain host-owned |
| EQFrequencyGraph, DynamicsTransferGraph | Controlled engine response/transfer curves, one commit per handle drag/key; no UI-side DSP |
| AutomationLane, AutomationModePicker | Absolute project ticks; atomic point add/move/remove; supported off/read modes |
| LoudnessMeter, SpectrogramView | Controlled offline measurement, silent/loading/error states; LUFS, sample peak and bounded pooled spectrum display |
| MixGroupBar and mixer extensions | Group solo/mute, solo-safe, bus balance, routing labels and measured meter input |
| MIDIVelocityLane and MidiChannelPicker | One batch write per drawn velocity line/ramp; zero-based channel values displayed as 1–16 |

Generic UI stays in NYC-Tron. Forge owns engine operations and `CadenceMixerAdapter`; there are no runtime Forge imports here. Per-instance component state uses vanilla Zustand stores retained in refs with selector subscriptions. Native input/resources remain refs. Style uses consumer tokens. Graph/time axes remain left to right while layout chrome follows RTL.

Integration fixed an Android-invalid `group` accessibilityRole, missing web value/checked semantics and web automation click coordinates. Native accessibilityValue remains intact; web uses explicit ARIA values, verified by browser assertions. Recovered `useState` in analysis displays was replaced with the established Zustand pattern. Existing LevelFader/LevelMeter/PanControl also use the shared value helper so mixer accessibility is consistent.

Tests cover one commit per gesture, cancellation/rejection retaining committed state, keyboard alternatives, disabled/empty/error states, 44pt targets, no page overflow, phones/tablets and RTL. Browser fixtures are controlled stand-ins; Forge tests separately exercise real Rust. Fifty-seven captures were reviewed via six contact sheets; the design detector reports no findings.

Analysis is offline over a bounded rendered range. Meter ballistics and polling are host-owned; no new realtime audio callback or device input is supplied. Loudness is a BS.1770-style engine measurement, not a certification claim; sample peak is explicitly not true peak. Write/touch/latch automation needs a live transport backend and remains absent. Native playback scheduling, decoder/input devices, recorder/comping and external plugin hosting remain separate work. No native build, screen-reader session, physical foldable or audio-device validation occurred in this phase. App-window, orientation, navigation and manifest contracts are unchanged.

Public control source is original; this phase introduces no new third-party source port. Existing package license and notice handling remains intact. Build/source/browser checks and the explicit Forge built-source contract gate must pass before any later release includes this cluster.
