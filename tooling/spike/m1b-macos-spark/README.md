# M1-b spike — @nyc-tron/ui components on a real Spark (react-native-macos) host

Goal: render real `packages/ui` component sources inside a Spark macOS app —
the first NYC-Tron component code running on an AppKit-backed RN runtime.

## Layout

- `TronSparkApp/` — Spark app scaffolded by `spark create TronSparkApp
  --platform macos` (@legendapp/spark 0.0.3, Expo 55.0.32, RN 0.83.10,
  react-native-macos 0.83.0, React 19.2.0). Own npm lockfile, isolated from
  the repo's pnpm workspace — required because the repo pins Expo 58 / RN
  0.88 which cannot share a host with Spark (see docs/completion/M1a-macos-spike.md).
- `TronSparkApp/src/nyc-tron/` — **verbatim** copies of
  `packages/ui/src/components/{Button,SegmentedControl,Card,TextField}.tsx`,
  `styles.ts`, `forms/choice-keys.ts` (see `PROVENANCE.md` for the source
  commit). No edits; all compat lives in the app, not in `packages/*`.
- `TronSparkApp/global.css` — app-owned Tailwind v4 theme (same dark palette
  as `examples/native-instruments/global.css`) consumed through `uniwind`.
- `evidence/` — window captures and the AX tree dump (see
  `docs/completion/M1b-macos-spark.md`).

## Reproduce

```sh
cd tooling/spike/m1b-macos-spark
npm install @legendapp/spark@0.0.3
npx spark create TronSparkApp --platform macos   # or reuse the committed app dir
cd TronSparkApp
npm install          # installs deps + uniwind/tailwindcss already in package.json
npx spark doctor     # "Dependency pins match… Native toolchain available."
npx spark dev        # press `d` to open Spark Runner (first run downloads it to ~/.spark)
```

`package.json` already carries the M1-a workaround:
`expo.autolinking.exclude = ["react-native-windows"]` (RNW's CLI config
probes for PowerShell and kills Metro otherwise — `spark build` applies this
itself, `spark dev` does not).

Headless alternative to pressing `d`: launch the cached Runner directly
(what `spark dev` does internally, see spark-cli `dist/dev.js`):

```sh
RUNNER=~/.spark/downloads/0.0.3/<hash>/SparkRunner.app/Contents/MacOS/SparkRunner
SPARK_WINDOW_CONFIG='{"size":{"width":1000,"height":700},"restoreBounds":true}' \
SPARK_PROJECT_ID=<extra.spark.projectId from app.json> \
SPARK_PROJECT_NAME=TronSparkApp SPARK_PROJECT_VERSION=0.0.1 \
SPARK_BUNDLE_URL='http://127.0.0.1:8081/index.bundle?platform=macos&dev=true&minify=false' \
"$RUNNER" -RCT_jsLocation 127.0.0.1:8081 &
```

Evidence capture: `screencapture -x -l<CGWindowID>` (window id via
`CGWindowListCopyWindowInfo`); AX tree via System Events
(`UI elements of window 1` of process "SparkRunner").
