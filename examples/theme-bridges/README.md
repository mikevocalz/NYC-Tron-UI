# Consuming NYC-Tron without inheriting a theme

## Moyo Learn — neubrutalist

Import Moyo's **existing generated** CSS:
```css
@import 'tailwindcss';
@import 'uniwind';
@import '@acme/theme/theme-native.css';
@source '../node_modules/@nyc-tron/ui/dist/components';
```

Use the Moyo semantic classes:
```tsx
import { Button } from '@nyc-tron/ui/components/Button';
import { Card } from '@nyc-tron/ui/components/Card';

<Button
  title="Start tutoring"
  unstyled
  className="rounded-control border-[3px] border-border-strong shadow-card bg-primary"
  labelClassName="font-display text-on-primary"
  onPress={startLesson}
/>
<Card className="border-2 border-border-strong shadow-card bg-surface-raised" />
```

The package publishes only `dist/`, so `@source` must point there; a `src/`
path finds no class names in an installed package. The token names every
component expects are listed in [docs/THEME_TOKENS.md](../../docs/THEME_TOKENS.md).

No Moyo colors or font names live inside NYC-Tron UI; they come from the
consuming app's `@acme/theme` output. The consumer's own tailored Tailwind
merger handles its custom typography scale. In a real app, connect to the
existing Better Auth/guardian-verified tutoring route (this snippet is UI-only).

## NYC-MON — daylit / neon geometry

Use NYC-MON's own `@acme/theme/theme-native.css` and classes;
NeonBlade-derived cut geometry is separately available from
`@nyc-tron/geometry/corner-cut`. Don't force every app to use cut corners,
glow, DistrictTone, game HUDs, or an NYC-MON night palette.

```tsx
import { cornerCutPolygon } from '@nyc-tron/geometry/corner-cut';
import { Button } from '@nyc-tron/ui/components/Button';

<Button
  title="Battle"
  unstyled
  className="rounded-none bg-primary text-on-primary border-2 border-border-strong"
  labelClassName="font-display uppercase tracking-wider"
  onPress={launch}
/>
```

A native shaped frame must use a verified renderer adapter (Skia v3,
CSS clip-path on web, etc.), not pass polygons directly to AppKit/WinUI.

## Forge 2046 — professional studio

Forge supplies its own theme variables, editor keyboard bindings, motion and
document lifecycle. UI components import directly from NYC-Tron:

```tsx
import { WaveformLane } from '@nyc-tron/ui/components/forge/WaveformLane';
import { NativeSeekBar } from '@nyc-tron/ui/components/forge/NativeSeekBar';
import { FRAME_RATES } from '@nyc-tron/ui/components/forge/timebase';

<NativeSeekBar
  frame={playheadFrame}
  durationFrames={durationFrames}
  frameRate={FRAME_RATES.NTSC_2997}
  onSeek={frame => player.seekFrame(frame)}
  className="rounded-xl bg-surface-raised"
/>
<WaveformLane peaks={actualPeaks} barClassName="bg-accent" />
```

NativeSeekBar requires the *optional* `@expo/ui` Expo SDK 58 adapter; it
is not available on an unverified Windows / Spark desktop host. `actualPeaks`
must be produced by an audio analyzer; the component does not synthesize them.

## Tailwind/Uniwind + native OS controls

The app's Tailwind v4 CSS and `@source` path choose the visual theme.
For Windows native NavigationView/AppKit dropdowns, *CSS className is not a
native resource dictionary*. A future platform adapter must map
`TronTheme` semantic colors, corner radii, density and motion values into
WinUI/XAML resources or the supported AppKit/SwiftUI/Compose properties.
Native focus, screen reader and system menu behavior take precedence over
unsupported decorative styles. There is no guarantee that every CSS utility
will restyle every OS-native control.
