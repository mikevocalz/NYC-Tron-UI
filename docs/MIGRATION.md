# Migrating from 0.1.0-alpha.4 to 1.0.0

Version 1.0.0 remains a release candidate. The URLs below become usable after
publication; this guide does not establish that a v1.0.0 release exists.

## Install URLs

Replace the tag and the version in every tarball URL:

```diff
- "@nyc-tron/ui": "https://github.com/mikevocalz/NYC-Tron-UI/releases/download/v0.1.0-alpha.4/nyc-tron-ui-0.1.0-alpha.4.tgz"
+ "@nyc-tron/ui": "https://github.com/mikevocalz/NYC-Tron-UI/releases/download/v1.0.0/nyc-tron-ui-1.0.0.tgz"
```

Change every `@nyc-tron/*` package in the same commit. Sibling packages are
peer dependencies resolved from tarballs, so mixing alpha.4 and 1.0.0 tarballs
is untested. Verify the new tarballs against the v1.0.0 `SHA256SUMS` as shown
in the [README](../README.md#installing-from-a-release). pnpm will record new
integrity hashes in the lockfile.

The distribution inventory contains fifteen archives: thirteen workspace
packages and the separate `@nyc-tron/windows-fluent-fabric` and
`@nyc-tron/macos-appkit` adapters. Install the packages your app uses within its
compatible runtime lane. The desktop adapters require RNW 0.85 and Spark/Expo 55
respectively; they cannot join the Expo 58 / React Native 0.88 installation.
Their peer pins and native host requirements are documented in
[Support policy](SUPPORT.md#three-isolated-runtime-lanes).

## Removed or renamed exports

At published source checkpoint
[`eb96c7a32e92be358964f432e29244fbc996cf3c`](https://github.com/mikevocalz/NYC-Tron-UI/commit/eb96c7a32e92be358964f432e29244fbc996cf3c),
comparing every existing package's `exports`
against the immutable alpha.4 commit
[`0554d190c211b224e3f894d63466bf9880efe539`](https://github.com/mikevocalz/NYC-Tron-UI/commit/0554d190c211b224e3f894d63466bf9880efe539)
finds no removed key and no changed target for any existing key. The new
AppKit package has no alpha.4 counterpart.

Added export keys at that source checkpoint:

| Package | Added |
| --- | --- |
| `@nyc-tron/ui` | 254 subpaths (301 at alpha.4, 555 at the candidate checkpoint) |
| `@nyc-tron/core` | `./window-lifecycle`, `./overlays` |
| `@nyc-tron/native-controls` | `./DisplayP3DiscLayer`, `./NativeVideoPlayer`, `./NativePointerInput`, `./pointer-input` |
| `@nyc-tron/expo-controls` | `./FindReplacePopover` |
| `@nyc-tron/geometry` | `./overlay-placement` |
| `@nyc-tron/panes` | `./SafeAreaFoldableLayout`, `./window-lifecycle` |
| `@nyc-tron/platform-services` | `./checkpoints` |
| `@nyc-tron/windows-fluent-fabric` | `./navigation-binding`, `./navigation-host`, `./windows`, `./window-controller`, `./window-types`, `./overlays`, `./drag-drop` |
| `@nyc-tron/macos-appkit` | New package: fifteen typed subpaths, plus `./package.json`; see its [public entry points](../packages/macos-appkit/spark/README.md) |

The UI additions include the committed `./components/forge/range-paste` and
`./components/data/tree-row-heights` subpaths. The pure window lifecycle and
overlay contracts now live in peer-free `@nyc-tron/core`; the existing panes
window-lifecycle entry and UI overlay exports remain compatible re-exports.

The export comparison alone does not establish component-prop or function
signature compatibility. The current candidate also checks reachable public
declarations and ordered export conditions, with separate snapshots for the
workspace, Windows and AppKit lanes. See the
[public API gate](completion/reports/V1-RELEASE-GATES.md#public-api-gate) for its
scope and commands.

## Peer additions

| Package | Peer | Optional | Needed by |
| --- | --- | --- | --- |
| `@nyc-tron/ui` | `react-native-skia` `>=3.9.1 <4` | yes | Six canvas and ink subpaths; see [Support policy](SUPPORT.md#optional-peer-react-native-skia) |
| `@nyc-tron/platform-services` | `expo-file-system` `^58.0.0` | yes | Not traced per subpath for this guide |

The existing workspace packages added only the optional peers above. The
Windows Fabric adapter now also requires `@nyc-tron/core` and
`@nyc-tron/windows-fluent`, both at `1.0.0`; install their matching release
archives alongside it. The new AppKit adapter has its own pinned Spark runtime
and `@nyc-tron/core` peer. Follow each adapter's native setup instead of
installing it into an existing Expo 58 host.

## License

All fifteen distributable package directories have a committed MIT `LICENSE`
for NYC-Tron original code and include it in their published file list. Ported
files keep the upstream licenses recorded in
[THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md). If you bundle
`@nyc-tron/platform-services`, retain the unmodified `mediabunny` dependency's
MPL-2.0 license and source-availability notice.

The exact fifteen archives, their bundled notices and checksum manifest still
require the recorded [owner distribution review](V1_DECISIONS.md#d2-licensing-and-provenance)
before stable publication. The license inventory does not supply that approval
or change any platform acceptance status.
