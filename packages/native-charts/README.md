# NYC-Tron native charts

Line, column and area charts drawn by the platform: Swift Charts on iOS 16.4+
and Vico 3.2.3 (Jetpack Compose) on Android. Both register as `TronChartView`,
the same way `@nyc-tron/native-controls` does: Expo Modules Core's SwiftUI
`View` DSL on iOS and `ExpoUIView` on Android. The iOS pod does not depend on
ExpoUI, so it also builds under Expo 58's SwiftPM integration.

## Installation

Add `@nyc-tron/native-charts` and `@expo/ui` 58 to an Expo SDK 58 development
build, then prebuild. Expo Go cannot load it.

```tsx
import { NativeChart } from "@nyc-tron/native-charts/NativeChart";
import { chartColorsFromTheme } from "@nyc-tron/native-charts/types";

<NativeChart
  kind="line"
  series={[{ id: "in", label: "Input", points: [{ x: 0, y: -18 }, { x: 1, y: -12 }] }]}
  colors={chartColorsFromTheme(theme.colors)}
  xAxisLabel="Bar"
  yAxisLabel="dBFS"
/>
```

## Props

- `series`: `{ id, label, points: [{ x, y }], color? }[]`. `id` and `label`
  must each be unique; every `x` and `y` must be finite.
- `kind`: `"line" | "column" | "area"`, applied to every series.
- `colors`: `{ series, axis, grid, label }`. `chartColorsFromTheme` maps
  NYC-Tron tokens (`primary`, `accent`, `focus`, `danger` for series;
  `textMuted`, `border`, `text` for axis, grid and labels). On Android colors
  must be hex strings.
- `xAxisLabel`, `yAxisLabel`: optional axis titles.
- `height` (default 240) and `width` (defaults to the parent's width).

The chart is controlled and read-only: it has no events. Invalid input throws
in JS before anything reaches native code.

## Accessibility

Each chart is one accessibility element with a spoken summary built natively
with the same wording on both platforms, for example: "Line chart. X axis:
Bar. Y axis: dBFS. Input: 6 points, from -18 to -6."

## Platform status

- iOS and Android: native source, compiled in CI by the example app lanes in
  `.github/workflows/native-controls-port.yml`. Not yet tested on hardware.
- Web, Windows, macOS: deferred. `NativeChart.web.tsx` renders the text
  "Charts aren't available on this platform yet." instead of an imitation
  chart.

## Vico version

Vico 3.3.x is compiled with Kotlin 2.4, which the Kotlin 2.2.10 compiler in
Expo SDK 58 cannot read. 3.2.3 (Kotlin 2.3.21, Compose 1.11) is the newest
release that links. Revisit when Expo raises its Kotlin version.

See `THIRD_PARTY_NOTICES.md` for Vico's Apache-2.0 notice.
