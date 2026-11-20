# components.json contract for the @nyc-tron registry

Status: phase 2 build C1. Facts below were checked against shadcn 4.23.0 on 2026-11-20. The generator is `tooling/registry/build-registry.mjs`; the repo's own `components.json` is generated from `tooling/registry/config.json`.

## Why platform targets are not in components.json

shadcn validates `components.json` strictly. A file with an `x-nyc-tron` key fails every command with "Invalid configuration", so platform targets live here and in each item's `meta.platforms`.

## What a consumer needs

```json
{
  "style": "new-york",
  "tailwind": { "css": "global.css", "baseColor": "neutral" },
  "aliases": { "components": "@/components", "ui": "@/components/ui", "lib": "@/lib", "utils": "@/lib/utils", "hooks": "@/hooks" },
  "registries": { "@nyc-tron": "https://raw.githubusercontent.com/mikevocalz/NYC-Tron-UI/<tag>/r/{name}.json" }
}
```

- `style`, `tailwind.baseColor`, `tailwind.css` and `aliases` are the required keys. `rsc`, `iconLibrary` and `tailwind.config` are not. The repo copy also sets `rsc: false` and `tsx: true`.
- `tailwind.css` only has to exist if an item carries `cssVars`. No NYC-Tron item does; tokens ship as TypeScript.
- The project needs a `tsconfig.json` with a `paths` entry for the alias prefix (`@/*`). `shadcn add` stops without one.
- Replace `<tag>` with the release tag. The repo keeps that tag in one place, `tag` in `tooling/registry/config.json`.

## Where files land

| Registry target | Lands in | Imported as |
|---|---|---|
| `@components/nyc-tron/ui/<path>` | `<aliases.components>/nyc-tron/ui/<path>` | `<aliases.components>/nyc-tron/ui/<path without extension>` |
| `@lib/nyc-tron/core/<path>` | `<aliases.lib>/nyc-tron/core/<path>` | `<aliases.lib>/nyc-tron/core/<path without extension>` |

The generated files import each other with the default alias prefix (`@/components/...`, `@/lib/...`). `shadcn add` rewrites that prefix to the consumer's `aliases.components` and `aliases.lib` (checked with `~/kit/components` and `~/kit/lib`). Imports carry no file extension, so Metro picks `.native`, `.web` and `.ios` variants by platform.

## Item names

- `<name>` is the `@nyc-tron/ui` export path after `./components/`, slashes kept: `Button`, `shell/UnitInput`, `forge/audio/LoudnessMeter`.
- `root` is the root barrel (`@nyc-tron/ui`). `index` is avoided because shadcn once used `index.json` for a registry index.
- `core/<module>` and `tokens` are support items: the `@nyc-tron/core` modules that `ui` imports. They carry `meta.support: true`. `list` returns them with the 556 ui items.
- Files that are not exported subpaths (helpers, `*.types.ts`, `*.shared.tsx`) are bundled into every item that imports them. When two items share one, `shadcn add` writes it once and skips the identical copy.

## Item meta

| Key | Meaning |
|---|---|
| `tier` | 1 or 2, from `tier1.json`. Support items have none. |
| `docs` | `handwritten` for tier 1, `generated` for tier 2. |
| `platforms` | Subset of `ios, android, web, windows, macos, qnx`, in that order. From the source: a `Platform.OS` or `Platform.select` branch, a `.native` or `.web` file, or an export condition. `[]` means the source names none. It does not mean "all". |
| `a11yStatus` | `reviewed-pass`, `reviewed-fail` or `unverified` (decision 34). Tier 2 is `unverified`. Nothing is `verified`: nothing was rendered. |
| `peers` | `react` and `react-native` ranges the item needs. They are not in `dependencies`, so `add` never moves the app's React Native version. |
| `optionalPeers` | Packages in `dependencies` that the library lists as optional peers. The item imports them, so `add` installs them. |
| `requiresNativeRebuild` | `true` when `dependencies` includes a package with native code (`react-native-gesture-handler`, `@expo/ui`, `react-native-skia`, `expo-linear-gradient`, `expo-drag-drop-content-view`). `add` runs a JavaScript install only; rebuild the app afterwards. |
| `subpath`, `exports` | The package import specifier and the exported names. |

## Not installable

`registry-excluded.json` lists subpaths a file copy cannot install, with `reason`, `install` and a JS-side `description` for `llms.txt`. Today that is the native packages (Swift, Kotlin, C++, C# or WinUI files): `macos-appkit`, `windows-fluent-fabric`, `windows-fluent`, `native-controls`, `platform-services`, `native-charts`, `native-navigation`, `reserved-regions` and `hardware-keys`. Install them from the release tarball and rebuild the native app. No `@nyc-tron/ui` subpath is excluded.

## Regenerating

```
node tooling/registry/build-registry.mjs   # registry.json, r/, registry-excluded.json, components.json
node tooling/registry/check-imports.mjs    # every import in every r/*.json resolves, or it exits 1
```

Both commands are deterministic. Run them again after any change under `packages/ui/src` or `packages/core/src`. CI (`.github/workflows/registry.yml`) fails when the committed output differs from a fresh run.
