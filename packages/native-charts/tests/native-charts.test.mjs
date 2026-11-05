import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  toNativeChartProps, chartColorsFromTheme, NATIVE_CHART_KINDS, CHART_UNAVAILABLE_MESSAGE,
} from "../src/NativeChart.types.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = path => readFileSync(resolve(root, path), "utf8");
const kt = "android/src/main/java/com/nyctron/charts/";
const colors = { series: ["#111111", "#222222"], axis: "#333333", grid: "#444444", label: "#555555" };

// Keys of NativeChartWireProps, read from the TS source so a rename on any side fails here.
function tsInterfaceKeys(source, name) {
  const body = source.match(new RegExp("export interface " + name + " \\{([^}]*)\\}"))[1];
  return [...body.matchAll(/(\w+)\s*:/g)].map(m => m[1]).sort();
}
const swiftFields = source => [...source.matchAll(/@Field var (\w+)/g)].map(m => m[1]).sort();
const kotlinVals = source => [...source.matchAll(/^\s*(?:@Field )?val (\w+)\s*:/gm)].map(m => m[1]).sort();

test("Swift and Kotlin props carry exactly the TS wire props", () => {
  const ts = read("src/NativeChart.types.ts");
  const wire = tsInterfaceKeys(ts, "NativeChartWireProps");
  assert.deepEqual(swiftFields(read("ios/TronChartProps.swift")), wire);
  assert.deepEqual(kotlinVals(read(kt + "TronChartProps.kt")).filter(k => k !== "modifiers"), wire);
  const series = tsInterfaceKeys(ts, "NativeChartWireSeries");
  assert.deepEqual(swiftFields(read("ios/TronChartSeries.swift")), series);
  assert.deepEqual(kotlinVals(read(kt + "TronChartSeries.kt")), series);
  const point = tsInterfaceKeys(ts, "NativeChartWirePoint");
  assert.deepEqual(swiftFields(read("ios/TronChartPoint.swift")), point);
  assert.deepEqual(kotlinVals(read(kt + "TronChartPoint.kt")), point);
});

test("both platforms accept the same chart kinds", () => {
  const swift = [...read("ios/TronChartKind.swift").matchAll(/case (\w+)/g)].map(m => m[1]);
  const kotlin = [...read(kt + "TronChartKind.kt").matchAll(/\w+\("(\w+)", "\w+"\)/g)].map(m => m[1]);
  assert.deepEqual(swift, [...NATIVE_CHART_KINDS]);
  assert.deepEqual(kotlin, [...NATIVE_CHART_KINDS]);
});

test("autolinking registers the same module and view on Apple and Android", () => {
  const conf = JSON.parse(read("expo-module.config.json"));
  assert.deepEqual(conf.platforms, ["apple", "android"]);
  assert.deepEqual(conf.coreFeatures, ["swiftui", "compose"]);
  const swift = read("ios/NYCTronChartsModule.swift");
  const android = read(kt + "NYCTronChartsModule.kt");
  assert.match(swift, /Name\("NYCTronCharts"\)/);
  assert.match(android, /Name\("NYCTronCharts"\)/);
  assert.match(swift, /ExpoUIView\(TronChartView\.self\)/);
  assert.match(android, /ExpoUIView<TronChartProps>\("TronChartView"\)/);
  assert.match(read("src/NativeChart.native.tsx"), /requireNativeView<NativeChartWireProps>\("NYCTronCharts", "TronChartView"\)/);
  assert.ok(existsSync(resolve(root, "ios/NYCTronCharts.podspec")));
});

test("native renderers use Swift Charts and Vico from Maven, not copied source", () => {
  assert.match(read("ios/TronChartView.swift"), /^import Charts$/m);
  assert.match(read("ios/NYCTronCharts.podspec"), /s\.frameworks\s*=\s*'Charts'/);
  const gradle = read("android/build.gradle");
  assert.match(gradle, /implementation 'com\.patrykandpatrick\.vico:compose-m3:\d+\.\d+\.\d+'/);
  assert.doesNotMatch(gradle, /vico:compose-m3:[^']*[+\[]/, "Vico version must be pinned exactly");
  assert.match(read(kt + "TronChartView.kt"), /import com\.patrykandpatrick\.vico\.compose\.cartesian\.CartesianChartHost/);
  assert.match(read("THIRD_PARTY_NOTICES.md"), /Apache License 2\.0/);
});

test("both platforms publish a spoken summary with the same wording", () => {
  const swift = read("ios/TronChartSummary.swift");
  const kotlin = read(kt + "TronChartSummary.kt");
  for (const phrase of ['" chart"', '"X axis: ', '"Y axis: ', '"No data"', ': no points"', '"point"', '"points"', ", from ", " to "]) {
    assert.ok(swift.includes(phrase), "swift " + phrase);
    assert.ok(kotlin.includes(phrase), "kotlin " + phrase);
  }
  assert.match(read("ios/TronChartView.swift"), /\.accessibilityLabel\(TronChartSummary\.describe\(/);
  assert.match(read(kt + "TronChartView.kt"), /clearAndSetSemantics \{ contentDescription = summary \}/);
});

test("wire props: sorted points, palette cycling, explicit color wins", () => {
  const wire = toNativeChartProps({
    kind: "area", colors, xAxisLabel: "Bar",
    series: [
      { id: "a", label: "A", points: [{ x: 2, y: 1 }, { x: 0, y: 3 }] },
      { id: "b", label: "B", points: [] },
      { id: "c", label: "C", points: [{ x: 1, y: 1 }], color: "#ABCDEF" },
    ],
  });
  assert.deepEqual(wire.series.map(s => s.color), ["#111111", "#222222", "#ABCDEF"]);
  assert.deepEqual(wire.series[0].points, [{ x: 0, y: 3 }, { x: 2, y: 1 }]);
  assert.equal(wire.yAxisLabel, "");
  assert.equal(wire.axisColor, "#333333");
});

test("wire props reject input a native chart cannot draw honestly", () => {
  const base = { kind: "line", colors, series: [] };
  assert.throws(() => toNativeChartProps({ ...base, kind: "pie" }), TypeError);
  assert.throws(() => toNativeChartProps({ ...base, series: [{ id: "a", label: "A", points: [{ x: 0, y: NaN }] }] }), RangeError);
  assert.throws(() => toNativeChartProps({ ...base, series: [{ id: "a", label: "A", points: [] }, { id: "a", label: "B", points: [] }] }), RangeError);
  assert.throws(() => toNativeChartProps({ ...base, series: [{ id: "a", label: "A", points: [] }, { id: "b", label: "A", points: [] }] }), RangeError);
  assert.throws(() => toNativeChartProps({ ...base, colors: { ...colors, series: [] }, series: [{ id: "a", label: "A", points: [] }] }), TypeError);
  assert.throws(() => toNativeChartProps({ ...base, colors: { ...colors, grid: "" } }), TypeError);
});

test("chart colors come from semantic theme tokens", () => {
  const out = chartColorsFromTheme({ primary: "p", accent: "a", focus: "f", text: "t", textMuted: "m", border: "b" });
  assert.deepEqual(out, { series: ["p", "a", "f"], axis: "m", grid: "b", label: "t" });
});

test("web renders an explicit unavailable notice, not a chart", () => {
  const web = read("src/NativeChart.web.tsx");
  assert.match(web, /CHART_UNAVAILABLE_MESSAGE/);
  assert.doesNotMatch(web, /requireNativeView|<svg|<canvas|Path|Polyline/i);
  assert.equal(CHART_UNAVAILABLE_MESSAGE, "Charts aren't available on this platform yet.");
  const pkg = JSON.parse(read("package.json"));
  for (const key of [".", "./NativeChart"]) {
    assert.match(pkg.exports[key].browser, /\.web\.js$/);
    assert.match(pkg.exports[key]["react-native"], /^\.\/dist\/.*\.native\.js$/);
  }
});

test("example app renders a native chart so the compile lanes build it", () => {
  const app = read("../../examples/native-instruments/App.tsx");
  assert.match(app, /from "@nyc-tron\/native-charts\/NativeChart"/);
  assert.match(app, /<NativeChart /);
  const ns = read("android/build.gradle").match(/namespace\s+"([^"]+)"/)[1];
  const example = JSON.parse(read("../../examples/native-instruments/app.json")).expo;
  assert.ok(!example.android.package.startsWith(ns + ".") && example.android.package !== ns);
});
