# Migrating from 0.1.0-alpha.4 to 1.0.0

## Editor controls moved to Nitro Forge (D10)

From the release after v1.0.0-rc.2, `@nyc-tron/ui` no longer ships the 453
`components/forge/*` subpaths. The owner moved the editor controls to
`@nitro-forge/editor-controls` in [Nitro Forge](https://github.com/mikevocalz/nitro-forge)
([decision D10](V1_DECISIONS.md#d10-editor-controls-move-to-nitro-forge)).
v1.0.0-rc.2 is the last Tron release that contains them.

Change each import:

```diff
- import { LevelFader } from "@nyc-tron/ui/components/forge/audio/LevelFader";
+ import { LevelFader } from "@nitro-forge/editor-controls/audio/LevelFader";
```

The rule is `@nyc-tron/ui/components/forge/<path>` ->
`@nitro-forge/editor-controls/<path>` for 450 subpaths. Three stayed in Tron
under `components/shell`:

| Old import | New import |
| --- | --- |
| `@nyc-tron/ui/components/forge/inputs/precision` | `@nyc-tron/ui/components/shell/precision` |
| `@nyc-tron/ui/components/forge/inputs/precision-scrubber-model` | `@nyc-tron/ui/components/shell/precision-scrubber-model` |
| `@nyc-tron/ui/components/forge/inputs/PrecisionScrubber` | `@nyc-tron/ui/components/shell/PrecisionScrubber` |

[`docs/library/editor-controls-migration.json`](library/editor-controls-migration.json)
lists all 453 removed subpaths with their replacements. To find what to change
in an app, search for the old prefix:

```sh
grep -rn "@nyc-tron/ui/components/forge/" src
```

Then add `@nitro-forge/editor-controls` to the app's dependencies, alongside
`@nyc-tron/ui` (Forge's package imports Tron's general UI, so both are needed).
Apps that render the Skia-based canvas and ink controls install
`react-native-skia` for Forge's package; `@nyc-tron/ui` no longer declares it,
nor `expo-linear-gradient`.

Twenty general subpaths were added to `@nyc-tron/ui` at the same time, listed in
D10. No other import path changed.

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

## Removed or renamed exports

Apart from the D10 removal above, none. Comparing the `exports` keys of every `packages/*/package.json` and
`packages/windows-fluent/rnw-fabric/package.json` at tag `v0.1.0-alpha.4`
against commit `d5207cc7` finds no removed key and no changed target for any
existing key.

Added export keys at `d5207cc7`:

| Package | Added |
| --- | --- |
| `@nyc-tron/ui` | 250 subpaths (301 at alpha.4, 551 at `d5207cc7`) |
| `@nyc-tron/native-controls` | `./DisplayP3DiscLayer`, `./NativeVideoPlayer` |
| `@nyc-tron/expo-controls` | `./FindReplacePopover` |
| `@nyc-tron/geometry` | `./overlay-placement` |
| `@nyc-tron/panes` | `./SafeAreaFoldableLayout` |
| `@nyc-tron/platform-services` | `./checkpoints` |

The uncommitted v1.0.0 preparation work on `release/v1.0.0-prep` adds the
`@nyc-tron/ui` keys `./components/forge/range-paste` and
`./components/data/tree-row-heights`, and `@nyc-tron/panes/window-lifecycle`. Check the final tag's manifest if you
depend on them.

This comparison covers export keys only. It does not compare component props
or function signatures behind unchanged keys.

## New optional peers

| Package | Peer | Optional | Needed by |
| --- | --- | --- | --- |
| `@nyc-tron/ui` | `react-native-skia` `>=3.9.1 <4` | yes | Six canvas and ink subpaths; see [Support policy](SUPPORT.md#optional-peer-react-native-skia) |
| `@nyc-tron/platform-services` | `expo-file-system` `^58.0.0` | yes | Not traced per subpath for this guide |

No required peer was added or changed.

## License

All 14 package directories have an MIT `LICENSE` for NYC-Tron original code
in the v1.0.0 preparation working tree (nine of them are new, uncommitted files
at the time of writing). Ported files
keep their upstream licenses, listed in `THIRD_PARTY_NOTICES.md`. If you
bundle `@nyc-tron/platform-services`, keep the `mediabunny` MPL-2.0 notice.
