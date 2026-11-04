# NYC-Tron UI

**Themeable, independently maintained cross-platform UI for React Native, Expo, desktop, web and spatial applications.**

This library is extracted from the NYC-MON / NeonBlade UI work and the
independent layout work in NYC-MON, Moyo Learn, the universal spatial starter and
Nitro Forge. **The app owns the theme; NYC-Tron owns accessible component behavior
and documented platform contracts.** No NYC-MON palette is imposed on consumers.

> **Status: foundational extraction (not a published/native-certified release).**
> This private repo started with only a README. CI can validate pure policies and
> source boundaries, but WinUI/Fluent, AppKit, SwiftUI, Compose, Viro and device
> behavior require separate native adapters and device validation.

## Use only the parts you need

```tsx
import { Button } from "@nyc-tron/ui/components/Button";
import { Card } from "@nyc-tron/ui/components/Card";
import { NavigationRail } from "@nyc-tron/ui/components/NavigationRail";

// Optional professional editor controls; NO Nitro Forge engine needed:
import { WaveformLane } from "@nyc-tron/ui/components/forge/WaveformLane";
import { NativeSeekBar } from "@nyc-tron/ui/components/forge/NativeSeekBar";
```

Pure layout policies are independently importable:

```ts
import { resolveNavigationShell } from "@nyc-tron/core/navigation";
import { resolveUsableRegions } from "@nyc-tron/core/folds";
import { validateSpatialPanelSet } from "@nyc-tron/core/spatial";
```

The `@expo/ui` native seek bar is an *optional Expo SDK 58+ component*.
Importing `Button` does not import it, a document engine, Viro, or Skia.

## Studio/Forge boundary

NYC-Tron UI is the **only shared component home**. Nitro Forge owns its Rust
editor engines and suite applications; it imports controls from NYC-Tron, not
the other way around:

```text
Moyo / NYC-MON / Forge / other consumer apps
      |
      +-- @nyc-tron/ui/components/...       small reusable UI pieces
      +-- @nyc-tron/ui/components/forge/... professional controls (optional)
      +-- @nyc-tron/core                  navigation/fold/spatial policies
      |
      +-- @nitro-forge/prism               image engine only if needed
      +-- @nitro-forge/cadence             audio engine only if needed
      +-- @nitro-forge/ignition            shared document host where needed
```

The full Forge suite can install all editor packages; an app integrating only
one editor can install only that package and chosen controls. Avoid circular
`@nyc-tron -> @nitro-forge -> @nyc-tron` dependency graphs.

## App-specific Tailwind v4 / Uniwind styling

Components expose `className`, class slots (`labelClassName`,
`barClassName`, `cellClassName` etc.), normal native styles and semantic token names. A host
imports its OWN theme CSS and tells Tailwind where the component source lives:

```css
@import "tailwindcss";
@import "uniwind";
@import "@acme/theme/theme-native.css"; /* example: Moyo's OWN brand */

@source "../node_modules/@nyc-tron/ui/dist/components";
```

Choose an actual path resolvable from the consuming workspace; with pnpm
symlinks and emitted distributions, the source path may differ. The library
**does not** import, regenerate or overwrite an app's global CSS, reset tokens,
or install its own visual identity. On web, use the host's existing Tailwind v4
`theme.css` and `@source` setup. A consumer can have neubrutalist cards,
futuristic shapes, minimal Fluent-like surfaces or a completely new style.

Native platform controls *cannot* automatically accept every arbitrary CSS
utility; a native adapter maps supported semantic theme values to OS resources,
while RN-presentational controls are Tailwind/Uniwind customizable. Preserve
native accessibility, focus/hit geometry, and the OS's essential behaviors.

The default recipes need the semantic variables listed in
[Theme tokens](docs/THEME_TOKENS.md), defined for light and dark.

See [Architecture](docs/ARCHITECTURE.md), [Component ownership](docs/COMPONENT_OWNERSHIP.md),
[Source provenance](THIRD_PARTY_NOTICES.md), [Readiness](docs/ROSTER.md).

## Responsive data and spreadsheet views

- `@nyc-tron/ui/components/data/DataTable` turns narrow-pane rows into
  labeled mobile record cards, with TanStack sorting still available.
- `@nyc-tron/ui/components/forge/SpreadsheetGrid` remains a horizontally
  scrollable, touch-sized spreadsheet with a mobile stacked formula bar.
- Read [Responsive tables](docs/RESPONSIVE_TABLES.md) for full contracts,
  optional measured dimensions, and physical-device validation gaps.

## Development

```bash
corepack enable
corepack pnpm install --no-frozen-lockfile
corepack pnpm test
corepack pnpm typecheck
corepack pnpm packcheck
```

TypeScript now emits ESM and declarations under each package's `dist/`, and
`packcheck` verifies every subpath resolves before inspecting the npm tarballs.
These are package/source/unit gates. No native device build, signed distribution or
cross-repository migration has been completed by this scaffold.
