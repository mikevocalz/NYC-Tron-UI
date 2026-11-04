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
| `primary` | `--color-primary` | `bg-primary`, `bg-primary/10` | Button (primary), NavigationRail selected item, SpreadsheetGrid selected cell |
| `onPrimary` | `--color-on-primary` | `text-on-primary` | Text on `primary` |
| `surfaceRaised` | `--color-surface-raised` | `bg-surface-raised` | Card, Button (secondary), rail, tables, Forge controls |
| `surfaceSunken` | `--color-surface-sunken` | `bg-surface-sunken` | Card (sunken), table and tree headers, sort chips, inputs, waveform lane, XY pad, graph canvas and node title bars |
| `border` | `--color-border` | `border-border` | Every bordered surface |
| `text` | `--color-text` | `text-text` | Body text in Button, rail, DataTable, SpreadsheetGrid |
| `textMuted` | `--color-text-muted` | `text-text-muted` | Card field labels, row numbers, hints |
| `danger` | `--color-danger` | `bg-danger`, `border-danger`, `text-danger` | Button (danger), cell commit errors |
| `onDanger` | `--color-on-danger` | `text-on-danger` | Text on `danger` |
| `accent` | `--color-accent` | `bg-accent`, `border-accent` | WaveformLane bars, InstrumentKnob ring, InstrumentXYPad, PatchGraph wires and ports, ImageCropOverlay frame |
| `focus` | `--color-focus` | `ring-focus`, `border-focus` | Keyboard focus rings, focused formula input |
| `controlRadius` | `--radius-control` | `rounded-control` | Buttons, rail items, inputs, chips |
| `cardRadius` | `--radius-card` | `rounded-card` | Card, record cards |

`danger`, `onDanger` and `accent` are optional in `TronTheme`; a theme that
omits them leaves those recipes without a color, so define them for any app
that shows errors or the Forge controls. `themeCssVariables(theme)` from
`@nyc-tron/core/theme` returns these variables for a validated theme.

### Native-only metrics

`shape.borderWidth`, `density`, `motion.fastMs` and `motion.standardMs` have
no Tailwind class token. Native adapters map them to platform resources
(stroke width, control density, animation durations).

### Deprecated `TronTheme` keys

Still accepted by `validateTheme()` and still readable on the validated
theme, so existing callers keep working. Passing both names with different
values throws.

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
