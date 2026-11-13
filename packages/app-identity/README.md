# @nyc-tron/app-identity

Checks an app's launcher name against the label box each launcher gives it,
and derives every launcher icon format from one 1024 px square PNG. Node 24 or
later; no dependencies.

Install it from the release archive, like the other NYC-Tron packages:

```sh
npm install --save-dev https://github.com/mikevocalz/NYC-Tron-UI/releases/download/v<version>/nyc-tron-app-identity-<version>.tgz
```

## Launcher label check

```sh
npx nyc-tron-launcher-check app.json [desktop.config.json ...] [--strict] [--json]
npx nyc-tron-launcher-check --name "Tron Lab" --platforms ios,android
```

It reads an Expo `app.json` (or `npx expo config --json` saved to a file), a
Spark `desktop.config.json` and a React Native Windows `app.json`, and prints
one row per launcher target:

- `PASS` with the spare width,
- `OVERFLOW` with the measured width, the box and how far over,
- `FAIL` for an empty or whitespace-only label,
- `NOT RUN` with the reason, when the target has no measured box or the label
  has a character the measuring font lacks.

It never shortens a name. Exit codes: `0` every measured target fits, `1`
overflow, empty label or identity error, `2` usage error, `3` (`--strict`
only) a target that applies was NOT RUN.

Apple targets are measured with AppKit's system font through `osascript`, so
they need macOS; elsewhere they are NOT RUN. Android Launcher3 is measured
from the Roboto advance widths in `dist/fonts/`.

The boxes, fonts and how each was measured are in `dist/launcher-targets.json`
and in [docs/APP_IDENTITY.md](https://github.com/mikevocalz/NYC-Tron-UI/blob/main/docs/APP_IDENTITY.md).

## Icons

```sh
npx nyc-tron-derive-icons assets/icon.png --out assets/icon --formats android,web,macos,windows
```

Pass only the formats of the platforms the app ships on. It refuses a source
that is not 1024 px square, has a transparent or mixed-colour edge, or has a
glyph outside the Android adaptive-icon safe zone.

## From code

```js
import { checkLabels, describeConfig, run, deriveIcons, FORMATS } from "@nyc-tron/app-identity";
```

## Licence

MIT (`LICENSE`). The Roboto advance-width data is covered by
`THIRD_PARTY_NOTICES.md` and `licenses/Roboto-Apache-2.0.txt`.
