# Migrating from 0.1.0-alpha.4 to 1.0.0

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

None. Comparing the `exports` keys of every `packages/*/package.json` and
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
