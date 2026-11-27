# Semantic theme tokens

NYC-Tron components ship no colors. Their default (non-`unstyled`) recipes use
the Tailwind v4 utilities below, and the consuming app's theme CSS must define
the matching variables for both light and dark appearance. A missing variable
does not fail the build; the utility silently produces no style, so text can
end up in the platform-default black on a dark surface.

`packages/ui/tests/contracts.test.mjs` fails if a component uses a token that
is not listed here, or hardcodes a hex color. Components that take an
`accentColor` (or popover `surfaceColor`/`textColor`) prop use it only when
the caller passes one; otherwise the token applies.

| `TronTheme` key | Variable | Utilities | Used by |
| --- | --- | --- | --- |
| `primary` | `--color-primary` | `bg-primary`, `bg-primary/10`, `border-primary`, `text-primary` | Button (primary), Switch track (on), Checkbox and Radio checked fill, ProgressBar fill, NavigationRail selected item, SegmentedControl/TabBar active item, Select chosen option, ListItem and IconButton selected tint, SpreadsheetGrid selected range and fill handle, TreeGrid selected rows; reference tones 1 and 5, sparkline marks, spreadsheet panel checkboxes and selected chips; InkToolbar selected tool and pressure switch; mute on, selected/dragged MIDI note and velocity bar, accented step, chosen beat unit, tap tempo while tapping, downbeat dot |
| `onPrimary` | `--color-on-primary` | `text-on-primary`, `bg-on-primary`, `border-on-primary` | Text on `primary`; Checkbox check and dash marks, Switch thumb ring when on (web forks); InkToolbar selected tool label; MIDI note end grip and accent dot on `primary` |
| `surfaceRaised` | `--color-surface-raised` | `bg-surface-raised` | Card, Button (secondary), rail, tables, Forge controls, PrecisionScrubber buttons and active scale; HsvPicker thumb inner ring; LevelFader card; InkToolbar; Office cluster: toolbars, read-aloud transport, comment cards, empty slides |
| `surfaceSunken` | `--color-surface-sunken` | `bg-surface-sunken` | Card (sunken), Select trigger, SegmentedControl well, table and tree headers, sort chips, inputs, waveform lane, XY pad, graph canvas and node title bars; HsvPicker steppers; LevelFader rail, thumb and step buttons; LevelMeter track, DevicePairingDialog device rows; InkToolbar size and opacity steppers; Office cluster: text fields, filmstrip background, list preview |
| `border` | `--color-border` | `border-border` | Every bordered surface; InkToolbar dividers and swatch rings |
| `text` | `--color-text` | `text-text`, `bg-text` | Body text in Button, rail, DataTable, SpreadsheetGrid, recording and pairing copy; `bg-text` for the LevelMeter peak-hold marker; HsvPicker thumb outer ring; InkToolbar labels and size dot |
| `textMuted` | `--color-text-muted` | `text-text-muted`, `border-text-muted`, `bg-text-muted` | Card field labels, row numbers, hints, recording and preview status; PrecisionScrubber hover edge; DragGrabHandle grip; HsvPicker and ColorChannels labels and hex readout; LevelFader dB readout, `bg-text-muted` for the LevelFader unity mark; InkToolbar notice line |
| `danger` | `--color-danger` | `bg-danger`, `border-danger`, `text-danger` | Button (danger, incl. RecordingTrack "Stop and save"), cell commit errors, StatusBar recording dot and error text, recording/preview/pairing problem copy, LevelMeter clipping fill; Office cluster: failed reply and animation errors (text only) |
| `onDanger` | `--color-on-danger` | `text-on-danger` | Text on `danger` |
| `accent` | `--color-accent` | `bg-accent`, `bg-accent/10`, `border-accent`, `text-accent` | Dragging PaneSplitter divider, DocumentTabBar unsaved marker, StatusBar render progress, SpreadsheetGrid formula reference highlights (tones 2 and 6), sparkline low mark, WaveformLane bars, LevelMeter fill, InstrumentKnob ring, InstrumentXYPad, PatchGraph wires and ports, ImageCropOverlay frame, PrecisionScrubber ticks, track and active edge; LevelFader fill and thumb border; PanControl fill and thumb, solo on (with `text-surface-raised`), MIDI notes, velocity bars, active steps, beat dots; Office cluster: selected toggles and rows (`bg-accent/10`, `border-accent`), slide selection, snap guides, sorter check badge |
| `info` | `--color-info` | `bg-info`, `bg-info/10`, `border-info`, `text-info` | Banner (info) border and mark, Badge (info) dot, reference tones 4 and 8, SheetTabs tone |
| `success` | `--color-success` | `bg-success`, `bg-success/10`, `border-success`, `text-success` | Banner (success) border and mark, Badge (success) dot, reference tones 3 and 7, sparkline high mark, SheetTabs tone |
| `focus` | `--color-focus` | `ring-focus`, `border-focus` | Keyboard focus rings, focused PaneSplitter divider, focused formula input, SpreadsheetGrid active cell, TreeGrid focused row, focused PrecisionScrubber scale and value field; InkToolbar controls; Office cluster: selected slide object outline and resize handle, focused swatch |
| `controlRadius` | `--radius-control` | `rounded-control` | Buttons, rail items, inputs, chips; InkToolbar controls |
| `cardRadius` | `--radius-card` | `rounded-card` | Card, record cards |

`danger`, `onDanger`, `accent`, `info` and `success` are optional in `TronTheme`; a theme that
omits them leaves those recipes without a color, so define them for any app
that shows errors or the Forge controls. `themeCssVariables(theme)` from
`@nyc-tron/core/theme` returns these variables for a validated theme.

### Native-only metrics

`shape.borderWidth`, `density`, `motion.fastMs` and `motion.standardMs` have
no Tailwind class token. Native adapters map them to platform resources
(stroke width, control density, animation durations).

### Deprecated `TronTheme` keys

Still accepted by `validateTheme()` and still readable on the validated
theme, so existing callers keep working. When both names are present the
current key wins, so spreading a validated theme and overriding `text`
replaces the stale `foreground` it carries.

| Deprecated | Use |
| --- | --- |
| `colors.surface` | `colors.surfaceRaised` |
| `colors.foreground` | `colors.text` |
| `colors.muted` | `colors.textMuted` |
| `colors.background` | `colors.surfaceSunken` |
| `shape.surfaceRadius` | `shape.cardRadius` |


## Reference light and dark values

These neutral values exist so a new consumer can render every component in
both appearances before its own brand theme is wired in. Replace all of them
with the app's design tokens; they are not an NYC-Tron brand.

```css
@import "tailwindcss";

@theme {
  --color-primary: #1f5fd1;
  --color-on-primary: #ffffff;
  --color-surface-raised: #ffffff;
  --color-surface-sunken: #f1f3f6;
  --color-border: #c9ced6;
  --color-text: #15181d;
  --color-text-muted: #5a626e;
  --color-danger: #b42318;
  --color-on-danger: #ffffff;
  --color-accent: #1f7a6d;
  --color-info: #1d5fa8;
  --color-success: #1e7a3c;
  --color-focus: #1f5fd1;
  --radius-control: 8px;
  --radius-card: 12px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #7aa7ff;
    --color-on-primary: #0b1730;
    --color-surface-raised: #1b1f26;
    --color-surface-sunken: #12151a;
    --color-border: #39404b;
    --color-text: #e8ebf0;
    --color-text-muted: #a3abb7;
    --color-danger: #ff8a80;
    --color-on-danger: #2b0703;
    --color-accent: #5fd0bf;
    --color-info: #8ab8ff;
    --color-success: #6fd08c;
    --color-focus: #7aa7ff;
  }
}
```

Uniwind and other native Tailwind runtimes take the same variable names through
their own light/dark theme mechanism; follow that runtime's documentation for
where the dark block goes. In the reference values, every text pair
(`on-primary` on `primary`, `on-danger` on `danger`, `text`, `text-muted` and
`danger` on both surfaces) is at least 5.5:1 in light and 6.9:1 in dark, and
`focus` against `surface-raised` is above 3:1. `border` is 1.58:1 in both
appearances, which is fine for dividers but below the 3:1 WCAG 1.4.11 asks
for when a border is the only visible edge of an input; raise it in your
palette if you rely on borders alone to show a text field.

## Expo UI universal components on web

On web, `Switch`, `Checkbox`, `Textarea` and `Sheet` render @expo/ui's
universal components, which do not read the `--color-*` tokens. They read
`--expo-ui-*` variables that their `Host` declares in its own stylesheet, with
fixed light and dark values. These are the variables the four components use,
and the Tron token each one takes:

| `--expo-ui-*` variable | Read by | Tron token |
| --- | --- | --- |
| `--expo-ui-primary-500` | Switch track (on), Checkbox box (checked), TextInput focus border | `--color-primary` (`primary`) |
| `--expo-ui-gray-300` | Switch track (off), Checkbox border (unchecked) | `--color-text-muted` (`textMuted`) |
| `--expo-ui-gray-200` | TextInput border | `--color-border` (`border`) |
| `--expo-ui-gray-500` | TextInput placeholder | `--color-text-muted` (`textMuted`) |
| `--expo-ui-gray-900` | TextInput text | `--color-text` (`text`) |
| `--expo-ui-background` | TextInput fill, Checkbox box (unchecked) | `--color-surface-sunken` (`surfaceSunken`) |
| `--expo-ui-foreground` | Switch and Checkbox built-in label text | `--color-text` (`text`) |

NYC-Tron's components set these on their own `Host` element, so they follow
the app's tokens with no extra CSS (`expoUiWebHostStyle` in
`packages/ui/src/components/expo-ui-web-model.ts`). When an app passes an
explicit `color` to `Switch` or `Checkbox`, that color becomes the Host's
`seedColor` and replaces `--color-primary` for that control.

An app that renders @expo/ui's universal components itself can map them in
its global stylesheet. Each value is a Tron variable, so the one block follows
the app's light and dark tokens. `!important` is needed because the Host's
stylesheet loads after the app's and writes the primary scale inline; the `*`
rule also overrides any `seedColor` the app sets.

```css
:root,
[data-theme] {
  --expo-ui-background: var(--color-surface-sunken) !important;
  --expo-ui-foreground: var(--color-text) !important;
  --expo-ui-gray-200: var(--color-border) !important;
  --expo-ui-gray-300: var(--color-text-muted) !important;
  --expo-ui-gray-500: var(--color-text-muted) !important;
  --expo-ui-gray-900: var(--color-text) !important;
}

* {
  --expo-ui-primary-500: var(--color-primary) !important;
}
```

`expoUiCssVariables(theme)` in `@nyc-tron/core/theme` returns the same map
with a validated theme's literal colors, for a host element that cannot use
the CSS variables.

The universal `BottomSheet` reads none of these variables. Its web panel is
white, or black in dark mode, and its grabber is drawn for a light panel.
`Sheet` passes `containerColor="var(--color-surface-raised)"` so the panel
takes the app's surface; the grabber color does not follow it and can be
faint on a dark surface. On iOS and Android the sheet chrome is the
platform's, and Tron's content inside it is token styled.

Known limit: the Switch thumb and the Checkbox check mark are white. With a
light `primary` (the reference dark value is `#7aa7ff`) they are low
contrast; pass a darker `color` or a darker dark-mode `primary` if that
matters for your palette.

## Decision records

**2026-11-04: align `TronTheme` keys with the class tokens (BUILD).**
`TronTheme` used `surface`, `foreground` and `muted` while every component
recipe reads `surface-raised`, `text` and `text-muted`, and it had no
`surfaceSunken`, `danger`, `onDanger` or `accent`, so presets built from it had
to hand-translate and silently dropped values. Each color and radius key now
names one documented variable (`TRON_THEME_TOKENS`), the old names stay as
deprecated aliases, and `packages/core/tests/theme-tokens.test.mjs` fails if a
key, a variable or a native metric is missing from this file.

**2026-11-04: commit `pnpm-lock.yaml` and install with `--frozen-lockfile` (BUILD).**
CI used `--no-frozen-lockfile` with no lockfile, so every run resolved
whatever the registry served that minute; a metro release whose tarball was
not yet on the CDN broke local installs while CI happened to pass. The
lockfile is generated from the public registry (metro 0.87.3 resolves; no
pin), committed on each stacked branch, and CI fails if `package.json` and
the lockfile disagree.

**2026-11-05: add optional `info` and `success` tones (BUILD).** Banner,
Badge and the status marks ported from `@acme/ui` have info and success
tones, and borrowing `primary` and `accent` for them would tie a notice's
meaning to brand colors the app may change for other reasons. Both keys are
optional like `danger`; a theme without them leaves those borders and marks
uncolored. Reference values are 6.45:1 (info) and 5.38:1 (success) on
`surface-raised` in light, 8.17:1 and 8.72:1 in dark, so they also pass as
text colors, though the components only use them for borders and marks.

Recovery phase 5 consumers: WorkspaceHost, WorkspacePresetSwitcher, ContextualToolbar, FileImportExportSheet, ColorPickerDialog and presenter ink chrome use the existing surface/text/primary/accent/border/danger/focus tokens. Presenter stroke colors are document/session values supplied by the app; they are not theme defaults. No new global tokens were added.

**2026-11-27: map @expo/ui's web variables onto the Tron tokens (BUILD).**
Switch, Checkbox, Textarea and the new Sheet render @expo/ui's universal
components on web, as NYC-MON does, instead of NYC-Tron's own web forks.
Those components color themselves from `--expo-ui-*` variables with fixed
values, so a Tron theme would not reach them. Each component writes the
mapping in "Expo UI universal components on web" onto its own Host, the same
mapping is published as CSS for apps that use @expo/ui directly and as
`EXPO_UI_TOKEN_MAP` / `expoUiCssVariables` in core, and
`packages/core/tests/expo-ui-theme.test.mjs` fails if the CSS block and the
map disagree. No new Tron tokens were added.
