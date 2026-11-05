# NYC-Tron UI

**Themeable, independently maintained cross-platform UI for React Native, Expo, desktop, web and spatial applications.**

This library is extracted from the NYC-MON / NeonBlade UI work and the
independent layout work in NYC-MON, Moyo Learn, the universal spatial starter and
Nitro Forge. **The app owns the theme; NYC-Tron owns accessible component behavior
and documented platform contracts.** No NYC-MON palette is imposed on consumers.

> **Status: alpha prerelease, not native-certified.** The first prerelease,
> [v0.1.0-alpha.1](https://github.com/mikevocalz/NYC-Tron-UI/releases/tag/v0.1.0-alpha.1)
> (2026-11-05), ships one tarball per package plus `SHA256SUMS` as GitHub
> Release assets; see [Installing from a release](#installing-from-a-release).
> Nothing is published to npm. CI validates pure policies, source boundaries,
> builds, types and tarball contents, but WinUI/Fluent, AppKit, SwiftUI,
> Compose, Viro and device behavior still need separate native adapters and
> device validation.

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

## Installing from a release

The packages are not on npm. Each tagged release (`v*`) attaches one `.tgz` per
package to a GitHub prerelease, plus a `SHA256SUMS` file. Pin the tarball URL
in the consuming app's `package.json`:

```text
https://github.com/mikevocalz/NYC-Tron-UI/releases/download/<tag>/<file>.tgz
```

| Package | File for tag `v<version>` |
| --- | --- |
| `@nyc-tron/core` | `nyc-tron-core-<version>.tgz` |
| `@nyc-tron/geometry` | `nyc-tron-geometry-<version>.tgz` |
| `@nyc-tron/ui` | `nyc-tron-ui-<version>.tgz` |
| `@nyc-tron/panes` | `nyc-tron-panes-<version>.tgz` |
| `@nyc-tron/native-controls` | `nyc-tron-native-controls-<version>.tgz` |
| `@nyc-tron/expo-controls` | `nyc-tron-expo-controls-<version>.tgz` |

For the current prerelease, `v0.1.0-alpha.1`:

```json
{
  "dependencies": {
    "@nyc-tron/core": "https://github.com/mikevocalz/NYC-Tron-UI/releases/download/v0.1.0-alpha.1/nyc-tron-core-0.1.0-alpha.1.tgz",
    "@nyc-tron/ui": "https://github.com/mikevocalz/NYC-Tron-UI/releases/download/v0.1.0-alpha.1/nyc-tron-ui-0.1.0-alpha.1.tgz",
    "@nyc-tron/panes": "https://github.com/mikevocalz/NYC-Tron-UI/releases/download/v0.1.0-alpha.1/nyc-tron-panes-0.1.0-alpha.1.tgz"
  }
}
```

Install only the packages you import. Sibling packages are peer dependencies,
because a tarball cannot fetch `@nyc-tron/*` from a registry: `@nyc-tron/panes`
needs `@nyc-tron/core` from the same release listed next to it. Every
`exports` condition (`types`, `react-native`, `default`) points at compiled
`dist/*.js` and `dist/*.d.ts`; no tarball ships `src/`.

Peers: `react` and `react-native` are required by `ui`, `panes` and
`native-controls`. `panes` also needs `zustand`. `native-controls` needs
`expo` and `@expo/ui` (it is an Expo module with SwiftUI and Compose views).
`expo-controls` needs `expo`, `@expo/ui` and `zustand`.
In `ui`, `@expo/ui`, `@tanstack/react-table` and `zustand` are optional and
only needed by the subpaths listed in [packages/ui/README.md](packages/ui/README.md);
importing `Button` pulls none of them.

To check the tarballs before pinning them, download them with the release's
`SHA256SUMS` and verify:

```sh
gh release download v0.1.0-alpha.1 --repo mikevocalz/NYC-Tron-UI \
  -p SHA256SUMS -p 'nyc-tron-core-*.tgz' -p 'nyc-tron-ui-*.tgz'
shasum -a 256 -c SHA256SUMS --ignore-missing
```

`--ignore-missing` skips the packages you did not download. pnpm records each
tarball's integrity hash in the lockfile on first install, so later installs
fail if a release asset changes.

**Licensing status.** Each tarball carries `THIRD_PARTY_NOTICES.md` and the
upstream MIT texts in `licenses/` (NYC-MON, NeonBlade UI, AudioKit Controls).
`@nyc-tron/native-controls` also ships its own MIT `LICENSE`. The other
packages have no license of their own yet: per
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), the upstream notices do not
license the NYC-Tron-specific additions for general redistribution, and the
ownership and publishing review is still open. Release tarballs are for the
maintainer's own consuming apps (Nitro Forge, Moyo, NYC-MON) until that review
is done.

Maintainers: `pnpm pack:release` builds and packs everything into
`release-packs/` with the same checks the release workflow runs. To cut a
release, set every package version, merge, then push tag `v<version>` (or run
the "NYC-Tron release tarballs" workflow with that version). The workflow
refuses a tag that does not match the package versions and never replaces an
existing release.

## Development

```bash
corepack enable
corepack pnpm install --frozen-lockfile
corepack pnpm test
corepack pnpm typecheck
corepack pnpm packcheck
```

TypeScript now emits ESM and declarations under each package's `dist/`, and
`packcheck` verifies every subpath resolves to compiled output and that no
package root imports an optional peer. `verify` also packs every package and
checks the tarball contents.
These are package/source/unit gates. No native device build, signed distribution or
cross-repository migration has been completed by this scaffold.
