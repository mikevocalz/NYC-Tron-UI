// Contracts for @nyc-tron/reserved-regions.
//
// The hook finds the native module by name (globalThis.expoV2 on Android,
// requireOptionalNativeModule on iOS). If the name drifts, or a platform drops
// out of autolinking, nothing fails to build: the hook returns [] forever and
// no pane ever snaps to the hinge. The source checks below fail first.
// Hook behavior runs the real TypeScript with mocked react / react-native /
// expo boundaries; that is not a device or reconciler test.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { NATIVE_MODULE_NAME, regionsEqual, toRegions, NO_REGIONS, NO_WINDOW_CONTROLS, toWindowControlsInsets, windowControlsEqual } from "../src/payload.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = path => readFileSync(join(root, path), "utf8");
const kotlinDir = "android/src/main/java/com/nyctron/reservedregions";
const config = JSON.parse(read("expo-module.config.json"));
const margins = { top: 0, left: 0, bottom: 0, right: 0 };
const hinge = { kind: "division", x: 540, y: 0, width: 24, height: 720, margins, active: true,
  orientation: "vertical", state: "flat", occlusionType: "full", separating: true };

test("expo-module.config.json autolinks both platforms", () => {
  assert.deepEqual(config.platforms, ["apple", "android"]);
});

test("apple: the listed Swift class is the v2 module registered under the shared JS name", () => {
  assert.deepEqual(config.apple?.modules, ["NYCTronReservedRegionsModule"]);
  const swift = read("ios/NYCTronReservedRegionsModule.swift");
  assert.match(swift, new RegExp(`@ExpoModule\\("${NATIVE_MODULE_NAME}"\\)\\s*\\n\\s*public final class NYCTronReservedRegionsModule: Module`));
  assert.match(swift, /@JS[\s\S]*?func query\(\) async -> \[ReservedRegionRecord\]/);
  // SDKs before 27.1 lack UIView.ReservedRegion; the gate keeps CI's Xcode building.
  assert.match(swift, /#if canImport\(UIKit, _version: 9127\.0\.85\)/);
  assert.match(read("ios/Extensions/ReservedRegionRecord+region.swift"), /#if canImport\(UIKit, _version: 9127\.0\.85\)/);
  assert.match(read("ios/NYCTronReservedRegions.podspec"), /s\.dependency 'ExpoModulesCore'/);
});

test("android: the Kotlin v2 module is compiled in by the v2 plugin, not the legacy list", () => {
  assert.equal(config.android?.modules, undefined, "android.modules must stay unset for a v2 module");
  assert.match(read("android/build.gradle"), /expoModule\s*\{[^}]*\bv2 true\b/);
  assert.match(read("android/build.gradle"), /androidx\.window:window:/);
  const kotlin = read(`${kotlinDir}/NYCTronReservedRegionsModule.kt`);
  assert.match(kotlin, new RegExp(`@ExpoModule\\("${NATIVE_MODULE_NAME}"\\)\\s*\\nclass NYCTronReservedRegionsModule : Module\\(\\)`));
  assert.match(kotlin, /@JS\s*\n\s*suspend fun query\(\): List<ReservedRegionRecord>/);
  assert.match(kotlin, /@Event\("changed"\)\s*\n\s*val onChanged = event<List<ReservedRegionRecord>>/);
});

test("android record carries every ReservedRegion field; dp conversion uses display density", () => {
  const record = read(`${kotlinDir}/ReservedRegionRecord.kt`);
  for (const field of ["kind", "x", "y", "width", "height", "margins", "active", "orientation", "state", "occlusionType", "separating"]) {
    assert.match(record, new RegExp(`\\bval ${field}:`), `ReservedRegionRecord.${field} missing`);
  }
  const convert = read(`${kotlinDir}/WindowLayoutInfo+toReservedRegionRecords.kt`);
  assert.match(convert, /displayMetrics\.density/);
  assert.match(convert, /filterIsInstance<FoldingFeature>\(\)/);
});

test("the package ships the native sources and no Gradle build output", () => {
  const files = JSON.parse(read("package.json")).files;
  for (const f of ["Package.swift", "ios", "android/build.gradle", "android/src", "expo-module.config.json"]) assert.ok(files.includes(f), f);
  assert.ok(!files.includes("android"), "android/ would ship android/build/ after a local Gradle run");
});

test("toRegions accepts the v2 array and a { regions } body, drops malformed entries", () => {
  assert.deepEqual(toRegions([hinge]), [hinge]);
  assert.deepEqual(toRegions({ regions: [hinge] }), [hinge]);
  assert.equal(toRegions(null), NO_REGIONS);
  assert.equal(toRegions([{ ...hinge, x: NaN }, { ...hinge, kind: "notch" }, { ...hinge, width: -1 }]), NO_REGIONS);
  // Kotlin nullable fields arrive as null on UIKit-shaped records: absent, not null.
  const uikit = toRegions([{ kind: "division", x: 1, y: 2, width: 0, height: 9, margins, active: false,
    orientation: null, state: null, occlusionType: null, separating: null }])[0];
  assert.deepEqual(Object.keys(uikit).sort(), ["active", "height", "kind", "margins", "width", "x", "y"]);
  assert.deepEqual(toRegions([{ ...hinge, margins: undefined }])[0].margins, margins);
});

test("regionsEqual compares by value", () => {
  assert.ok(regionsEqual([hinge], [{ ...hinge, margins: { ...margins } }]));
  assert.ok(!regionsEqual([hinge], [{ ...hinge, state: "halfOpened" }]));
  assert.ok(!regionsEqual([hinge], []));
});

// --- hook harness ----------------------------------------------------------
function load(entry, mocks) {
  const cache = new Map();
  const run = path => {
    if (cache.has(path)) return cache.get(path);
    const exports = {};
    cache.set(path, exports);
    const code = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    runInNewContext(code, { exports, globalThis: mocks.globalThis ?? {}, window: mocks.window,
      navigator: mocks.navigator, Object, Array, Math, Number,
      require: name => name in mocks ? mocks[name] : run(resolve(dirname(path), name)) }, { filename: path });
    return exports;
  };
  return run(join(root, "src", entry));
}
function reactMock(overrideValue = null) {
  const effects = [];
  const refs = [];
  let cursor = 0;
  return {
    effects,
    reset() { cursor = 0; },
    react: {
      createContext: value => ({ value }),
      use: () => overrideValue,
      useRef: v => refs[cursor++] ?? (refs[cursor - 1] = { current: v }),
      useEffect: effect => { effects.push(effect); },
      useSyncExternalStore: (_subscribe, get) => get(),
    },
    "react/jsx-runtime": { jsx: (type, props) => ({ type, props }) },
  };
}
const zustandMocks = {
  "zustand/vanilla": { createStore: init => {
    let state = init();
    return { getState: () => state, setState: next => { state = { ...state, ...next }; } };
  } },
  zustand: { useStore: (store, selector) => selector(store.getState()) },
};
const tick = () => new Promise(r => setImmediate(r));
// Values built inside the vm context carry its intrinsics; compare as plain data.
const plain = v => JSON.parse(JSON.stringify(v));

function nativeHarness({ os, v2, legacy, override = null }) {
  const r = reactMock(override);
  const mod = load("useReservedRegions.native.ts", {
    ...r, ...zustandMocks,
    globalThis: v2 ? { expoV2: { modules: { [NATIVE_MODULE_NAME]: v2 } } } : {},
    expo: { requireOptionalNativeModule: name => name === NATIVE_MODULE_NAME ? legacy ?? null : null },
    "react-native": { Platform: { OS: os }, useWindowDimensions: () => ({ width: 1080, height: 720 }) },
  });
  return { r, render: () => { r.reset(); return mod.useReservedRegions(); }, mod };
}

test("android: the v2 module answers the snapshot and the changed event", async () => {
  let listener; let removed = false;
  const v2 = { query: async () => [hinge],
    addListener: (name, fn) => { assert.equal(name, "changed"); listener = fn; return { remove() { removed = true; } }; } };
  const h = nativeHarness({ os: "android", v2 });
  assert.deepEqual(plain(h.render()), []);
  const cleanup = h.r.effects.at(-1)();
  await tick();
  assert.deepEqual(plain(h.render()), [hinge]);
  listener([{ ...hinge, state: "halfOpened" }]);
  assert.equal(h.render()[0].state, "halfOpened");
  cleanup();
  assert.ok(removed, "listener removed on unmount so native collection stops");
  listener([]);
  assert.equal(h.render().length, 1, "late events after unmount are ignored");
});

test("ios: legacy lookup, query only, no changed subscription", async () => {
  let subscribed = false;
  const legacy = { query: async () => [{ kind: "occlusion", x: 10, y: 0, width: 120, height: 36, margins, active: true }],
    addListener: () => { subscribed = true; return { remove() {} }; } };
  const h = nativeHarness({ os: "ios", legacy });
  h.render(); h.r.effects.at(-1)(); await tick();
  assert.equal(h.render()[0].kind, "occlusion");
  assert.equal(subscribed, false);
  assert.equal(h.mod.isReservedRegionsAvailable(), true);
});

test("no linked module and a failed query both mean no regions", async () => {
  const none = nativeHarness({ os: "android" });
  none.render(); none.r.effects.at(-1)();
  assert.deepEqual(plain(none.render()), []);
  assert.equal(none.mod.isReservedRegionsAvailable(), false);
  const failing = nativeHarness({ os: "ios", legacy: { query: async () => { throw new Error("x"); } } });
  failing.render(); failing.r.effects.at(-1)(); await tick();
  assert.deepEqual(plain(failing.render()), []);
});

test("an override wins and the native module is never queried", () => {
  let queried = false;
  const h = nativeHarness({ os: "android", override: [hinge],
    v2: { query: async () => { queried = true; return []; } } });
  assert.deepEqual(plain(h.render()), [hinge]);
  h.r.effects.at(-1)();
  assert.equal(queried, false);
});

function webHarness(viewport, posture) {
  const r = reactMock();
  return load("useReservedRegions.ts", { ...r, window: { viewport }, navigator: { devicePosture: posture } });
}
const seg = (left, top, width, height) => ({ left, top, width, height, right: left + width, bottom: top + height });

test("web: side-by-side segments give a vertical hinge; folded posture separates", () => {
  const web = webHarness({ segments: [seg(0, 0, 400, 800), seg(424, 0, 400, 800)] }, { type: "folded" });
  const [region] = web.useReservedRegions();
  assert.deepEqual(plain(region), { kind: "division", x: 400, y: 0, width: 24, height: 800, margins,
    active: true, orientation: "vertical", state: "halfOpened", separating: true });
});

test("web: stacked segments give a horizontal hinge; a flat physical gap still separates", () => {
  const web = webHarness({ segments: [seg(0, 410, 800, 390), seg(0, 0, 800, 400)] }, { type: "continuous" });
  const [region] = web.useReservedRegions();
  assert.equal(region.orientation, "horizontal");
  assert.equal(region.y, 400);
  assert.equal(region.height, 10);
  assert.equal(region.state, "flat");
  assert.equal(region.separating, true);
});

test("web: a flat zero-size seam is one continuous surface", () => {
  const web = webHarness({ segments: [seg(0, 0, 400, 800), seg(400, 0, 400, 800)] }, { type: "continuous" });
  const [region] = web.useReservedRegions();
  assert.equal(region.width, 0);
  assert.equal(region.separating, false);
  assert.equal(region.active, false);
});

test("web: the snapshot is stable between reads and empty when hinge-blind", () => {
  const web = webHarness({ segments: [seg(0, 0, 400, 800), seg(400, 0, 400, 800)] }, undefined);
  assert.equal(web.useReservedRegions(), web.useReservedRegions(), "useSyncExternalStore needs a cached snapshot");
  assert.deepEqual(plain(webHarness(undefined, undefined).useReservedRegions()), []);
  assert.equal(webHarness(undefined, undefined).isReservedRegionsAvailable(), false);
});

 test("SwiftPM preserves the native product and SDK-gated source tree", () => {
  const manifest = read("Package.swift");
  assert.match(manifest, /name: "NYCTronReservedRegions"/);
  assert.match(manifest, /path: "ios"/);
  assert.match(manifest, /\.iOS\("16\.4"\)/);
  assert.match(manifest, /exclude: \["NYCTronReservedRegions.podspec"\]/);
});

test("iPadOS window controls: the native read is the corner-adapted safe area minus the plain one", () => {
  const swift = read("ios/NYCTronReservedRegionsModule.swift");
  assert.match(swift, /@JS\s*\n\s*@MainActor\s*\n\s*func windowControlsInsets\(\) async -> WindowControlsInsetsRecord/);
  // Xcode 26 (Swift 6.2) is the first SDK with UIView.LayoutRegion; older CI Xcodes still build.
  assert.match(swift, /#if compiler\(>=6\.2\)/);
  assert.match(swift, /#available\(iOS 26\.0, \*\)/);
  assert.match(swift, /directionalEdgeInsets\(for: \.safeArea\(\)\)/);
  assert.match(swift, /directionalEdgeInsets\(for: \.safeArea\(cornerAdaptation: \.horizontal\)\)/);
  assert.match(swift, /directionalEdgeInsets\(for: \.safeArea\(cornerAdaptation: \.vertical\)\)/);
  assert.match(read("ios/WindowControlsInsetsRecord.swift"), /@Record\s*\nstruct WindowControlsInsetsRecord \{\s*\n\s*var leading: Double\s*\n\s*var trailing: Double\s*\n\s*var height: Double/);
  // Both entries export the hook; web answers zeros because a page has no system controls over it.
  assert.match(read("src/index.native.ts"), /useWindowControlsInsets \} from "\.\/useWindowControlsInsets\.native\.ts"/);
  assert.match(read("src/index.ts"), /useWindowControlsInsets \} from "\.\/useWindowControlsInsets\.ts"/);
  assert.match(read("src/useWindowControlsInsets.native.ts"), /Platform\.OS === "ios" \? requireOptionalNativeModule/);
});

test("iPadOS window controls: malformed, negative and absurd fields read as no inset", () => {
  assert.deepEqual(toWindowControlsInsets({ leading: 94, trailing: 0, height: 32 }), { leading: 94, trailing: 0, height: 32 });
  assert.equal(toWindowControlsInsets({ leading: 0, trailing: 0, height: 0 }), NO_WINDOW_CONTROLS);
  for (const payload of [null, undefined, 3, "94", [], {}]) assert.equal(toWindowControlsInsets(payload), NO_WINDOW_CONTROLS);
  assert.deepEqual(toWindowControlsInsets({ leading: -4, trailing: Number.NaN, height: Infinity }), NO_WINDOW_CONTROLS);
  assert.deepEqual(toWindowControlsInsets({ leading: 20_000, trailing: "8", height: 30 }), { leading: 0, trailing: 0, height: 30 });
  assert.equal(windowControlsEqual({ leading: 94, trailing: 0, height: 32 }, { leading: 94, trailing: 0, height: 32 }), true);
  assert.equal(windowControlsEqual({ leading: 94, trailing: 0, height: 32 }, NO_WINDOW_CONTROLS), false);
  assert.equal(Object.isFrozen(NO_WINDOW_CONTROLS), true);
});
