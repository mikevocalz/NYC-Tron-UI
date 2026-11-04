# Semantic theme tokens

NYC-Tron components ship no colors. Their default (non-`unstyled`) recipes use
the Tailwind v4 utilities below, and the consuming app's theme CSS must define
the matching variables for both light and dark appearance. A missing variable
does not fail the build; the utility silently produces no style, so text can
end up in the platform-default black on a dark surface.

`packages/ui/tests/contracts.test.mjs` fails if a component uses a token that
is not listed here.

| Variable | Utilities | Used by |
| --- | --- | --- |
| `--color-primary` | `bg-primary`, `bg-primary/10` | Button (primary), NavigationRail selected item, SpreadsheetGrid selected cell |
| `--color-on-primary` | `text-on-primary` | Text on `primary` |
| `--color-surface-raised` | `bg-surface-raised` | Card, Button (secondary), rail, tables, Forge controls |
| `--color-surface-sunken` | `bg-surface-sunken` | Card (sunken), table headers, sort chips, formula input, waveform lane |
| `--color-border` | `border-border` | Every bordered surface |
| `--color-text` | `text-text` | Body text in Button, rail, DataTable, SpreadsheetGrid |
| `--color-text-muted` | `text-text-muted` | Card field labels, row numbers, hints |
| `--color-danger` | `bg-danger`, `border-danger`, `text-danger` | Button (danger), cell commit errors |
| `--color-on-danger` | `text-on-danger` | Text on `danger` |
| `--color-accent` | `bg-accent` | WaveformLane bars |
| `--color-focus` | `ring-focus`, `border-focus` | Keyboard focus rings, focused formula input |
| `--radius-control` | `rounded-control` | Buttons, rail items, inputs, chips |
| `--radius-card` | `rounded-card` | Card, record cards |

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
