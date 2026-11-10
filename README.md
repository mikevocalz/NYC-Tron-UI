# NYC-Tron UI

**Themeable, independently maintained UI for React Native and Expo on iOS, Android and web, with an experimental Windows adapter.**

This library is extracted from the NYC-MON / NeonBlade UI work and the
independent layout work in NYC-MON, Moyo Learn, the universal spatial starter and
Nitro Forge. **The app owns the theme; NYC-Tron owns accessible component behavior
and documented platform contracts.** No NYC-MON palette is imposed on consumers.

> **Status: v1.0.0, library scope.** v1.0.0 ships as 14 GitHub Release
> tarballs plus `SHA256SUMS`; see [Installing from a release](#installing-from-a-release).
> Nothing is published to npm. Of the 341 rows in
> `docs/completion/library-progress.json`, 329 are library scope and marked
> implemented; the other 12 (N-rows owned by Forge) are outside the library.
> All 341 rows keep `acceptance: "unverified"`: CI runs Node, mocked-render
> and Chromium tests and compiles the iOS SwiftUI, Android Compose and
> Windows sources, but no row has a recorded device acceptance run. Support
> tiers, struck items and deferrals are in [v1.0.0 decisions](docs/V1_DECISIONS.md)
> and [Support policy](docs/SUPPORT.md).

## Use only the parts you need

For the Expo Exact-inspired presentation direction, read
[Native feel and adaptive content](docs/EXACT_NATIVE_FEEL.md). The
[account screen reference](examples/native-feel/README.md) demonstrates bounded
forms, wrapping columns, live appearance choices and retained drafts using
the same component tree on small and large web containers.

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

## Packages

| Package | Tier | What it is |
| --- | --- | --- |
| `@nyc-tron/core` | Supported | Pure layout and theme policies (navigation shell, folds, spatial, pane plan); no React or renderer imports |
| `@nyc-tron/geometry` | Supported | Corner-cut path geometry and standalone overlay placement; pure functions |
| `@nyc-tron/icons` | Supported | Original 24px outline/filled icon catalog with native and web renderers |
| `@nyc-tron/panes` | Supported | Master/Detail/Inspector host over `@nyc-tron/core/pane-plan` |
| `@nyc-tron/ui` | Supported | React Native components, one subpath per component (551 export keys at this commit) |
| `@nyc-tron/expo-controls` | Supported | Expo 58 SwiftUI/Compose picker, action menus, popovers and tooltips |
| `@nyc-tron/native-controls` | Supported | SwiftUI and Jetpack Compose instruments (ArcKnob, XYPad, Display P3 disc, video player) |
| `@nyc-tron/native-navigation` | Supported | Expo SDK 58 navigation rail: Material3 NavigationRail on Android, SwiftUI on iOS |
| `@nyc-tron/hardware-keys` | Supported | Hardware keyboard shortcuts: `UIKeyCommand` on iOS, unhandled `KeyEvent` listeners on Android, `document` keydown on web |
| `@nyc-tron/platform-services` | Supported; media decoding experimental | Haptics, document picking and sharing, audio session lifecycle, checkpoints, media decoding |
| `@nyc-tron/reserved-regions` | Supported | Fold and hinge geometry: Jetpack WindowManager on Android, `UIView.reservedRegions` on iOS 27.1+, Viewport Segments on web |
| `@nyc-tron/native-charts` | Experimental | Line, column and area charts: Swift Charts on iOS, Vico on Android |
| `@nyc-tron/windows-fluent` | Experimental | WinUI 3 NavigationView host-shell source plus a typed controller contract |
| `@nyc-tron/windows-fluent-fabric` | Experimental | WinUI 3 NavigationView as an RNW 0.85 Fabric XAML island (`TronNavigationView`) |

The two Windows packages sit on the React Native 0.85 lane and cannot be
installed in the same app as the React Native 0.88 packages. See
[Support policy](docs/SUPPORT.md).

## Installing from a release

The packages are not on npm. Each tagged release (`v*`) attaches one `.tgz` per
package to a GitHub Release, plus a `SHA256SUMS` file. Pin the tarball URL
in the consuming app's `package.json`:

```text
https://github.com/mikevocalz/NYC-Tron-UI/releases/download/v<version>/nyc-tron-<name>-<version>.tgz
```

`<name>` is the package name without the `@nyc-tron/` scope, for example
`nyc-tron-reserved-regions-1.0.0.tgz` and
`nyc-tron-windows-fluent-fabric-1.0.0.tgz`.

For v1.0.0:

```json
{
  "dependencies": {
    "@nyc-tron/core": "https://github.com/mikevocalz/NYC-Tron-UI/releases/download/v1.0.0/nyc-tron-core-1.0.0.tgz",
    "@nyc-tron/ui": "https://github.com/mikevocalz/NYC-Tron-UI/releases/download/v1.0.0/nyc-tron-ui-1.0.0.tgz",
    "@nyc-tron/panes": "https://github.com/mikevocalz/NYC-Tron-UI/releases/download/v1.0.0/nyc-tron-panes-1.0.0.tgz"
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
In `ui`, every peer except `react` and `react-native` is optional and only
needed by the subpaths that import it; importing `Button` pulls none of them.
[Support policy](docs/SUPPORT.md) lists the subpaths that need
`react-native-skia`, and [packages/ui/README.md](packages/ui/README.md)
covers the others.

To check the tarballs before pinning them, download them with the release's
`SHA256SUMS` and verify:

```sh
gh release download v1.0.0 --repo mikevocalz/NYC-Tron-UI \
  -p SHA256SUMS -p 'nyc-tron-core-*.tgz' -p 'nyc-tron-ui-*.tgz'
shasum -a 256 -c SHA256SUMS --ignore-missing
```

`--ignore-missing` skips the packages you did not download. pnpm records each
tarball's integrity hash in the lockfile on first install, so later installs
fail if a release asset changes.

Upgrading from `v0.1.0-alpha.4`: see [Migration](docs/MIGRATION.md).

## Licensing

NYC-Tron's original code is MIT, `Copyright (c) 2026 NYC-Tron UI
contributors` ([LICENSE](LICENSE)). Ported files keep their upstream license
and header; [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) lists them, and
upstream license texts ship in each tarball's `licenses/` directory.

`@nyc-tron/platform-services` depends on `mediabunny` 1.65.2, unmodified,
which is MPL-2.0. Its license text ships at
`packages/platform-services/third-party/mediabunny/LICENSE`, and
THIRD_PARTY_NOTICES.md gives the source location. An app that bundles
`@nyc-tron/platform-services` must keep that notice. The owner's sign-off that
this satisfies MPL-2.0 for tarball distribution is a release gate in
[v1.0.0 decisions](docs/V1_DECISIONS.md) D2.

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

These are package, source and unit gates. Native compiles run in separate
workflows (`native-controls-port.yml`, `winui-native.yml`,
`winui-fabric.yml`). None of them is a device acceptance run, and no signed
distribution exists.

Repository tooling needs Node `>=24.19.0` (root `package.json` `engines`).
