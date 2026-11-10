import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const root=new URL("../",import.meta.url);
const read=path=>readFileSync(new URL(path,root),"utf8");

test("RNW 0.85 native codegen includes Fabric view and strongly typed events",()=>{
 const p=JSON.parse(read("package.json"));
 assert.equal(p.devDependencies["react-native-windows"],"0.85.0");
 assert.equal(p.devDependencies["react-native"],"0.85.3");
 assert.equal(p.codegenConfig.windows.generators[0],"componentsWindows");
 const spec=read("src/TronNavigationViewNativeComponent.ts");
 assert.match(spec,/codegenNativeComponent<NativeProps>\("TronNavigationView"\)/);
 for(const key of ["onDestinationInvoked","onPaneOpenChanged","onSettingsInvoked"]){
  assert.ok(spec.includes(key),key);
 }
});
test("C++ registers a native WinUI XAML island, not a fabricated React View",()=>{
 const cpp=read("windows/NYCTronFluentFabric/TronNavigationView.cpp");
 assert.match(cpp,/SetContentIslandComponentViewInitializer/);
 assert.match(cpp,/m_xamlIsland\.Content\(m_navigation\)/);
 assert.match(cpp,/islandView\.Connect\(m_xamlIsland\.ContentIsland\(\)\)/);
 assert.match(cpp,/mode == "compact" \? Mode::LeftCompact/);
 assert.match(cpp,/onDestinationInvoked/);
});
test("the Windows Fabric peer lane cannot be silently installed into Expo58",()=>{
 const p=JSON.parse(read("package.json"));
 assert.equal(p.peerDependencies["react-native"],"0.85.3");
 assert.ok(!JSON.stringify(p).includes("@expo/ui"));
});

test("route approval remains app-owned and unrelated updates retain native items",()=>{
 const cpp=read("windows/NYCTronFluentFabric/TronNavigationView.cpp");
 // NavigationView undoes programmatic selection of items that do not select
 // on invoke, so the component restores the committed route instead.
 assert.doesNotMatch(cpp,/SelectsOnInvoked\(false\)/);
 assert.match(cpp,/m_navigation\.SelectionChanged\(/);
 assert.match(cpp,/DispatcherQueue\(\)\.TryEnqueue/);
 const conditional=cpp.indexOf("if (!m_itemsInitialized || props.itemsJson != m_itemsJson || footerJson != m_footerItemsJson)");
 const clear=cpp.indexOf("m_navigation.MenuItems().Clear()");
 const cache=cpp.indexOf("m_itemsInitialized = true",clear);
 const applySelection=cpp.indexOf("SetSelectedId(winrt::to_hstring(m_selectedId))");
 assert.ok(conditional>=0 && clear>conditional && cache>clear && applySelection>cache);
});

test("pane approval remains app-owned: a rejected toggle is put back",()=>{
 const cpp=read("windows/NYCTronFluentFabric/TronNavigationView.cpp");
 const start=cpp.indexOf("void OnPaneChanged(bool open)");
 const body=cpp.slice(start,cpp.indexOf("winrt::Microsoft::UI::Xaml::XamlIsland m_xamlIsland",start));
 assert.ok(start>=0);
 assert.match(body,/if \(open == m_paneOpen \|\| m_navigation\.IsPaneOpen\(\) != open\) return;/);
 // An overlay pane (Compact/Minimal) that NavigationView closed is never forced open.
 assert.match(body,/if \(open \|\| m_navigation\.DisplayMode\(\) == DisplayMode::Expanded\)/);
 assert.match(body,/m_paneRestorePending = m_navigation\.DispatcherQueue\(\)\.TryEnqueue/);
 assert.match(body,/self->m_navigation\.IsPaneOpen\(self->m_paneOpen\)/);
 // Queued writes cannot leave m_updatingFromJs set or throw out of the dispatcher.
 assert.match(cpp,/m_restorePending = m_navigation\.DispatcherQueue\(\)\.TryEnqueue/);
 assert.equal((cpp.match(/self->RunFromJs\(/g)??[]).length,2);
 assert.match(cpp,/void RunFromJs\(Write&& write, char const\* failure\) noexcept/);
 assert.match(cpp,/m_paneOpen = props\.paneOpen\.value_or\(false\);\s*m_navigation\.IsPaneOpen\(m_paneOpen\);/);
});

test("items and the NavigationView carry Narrator names",()=>{
 const cpp=read("windows/NYCTronFluentFabric/TronNavigationView.cpp");
 assert.match(cpp,/AutomationProperties::SetName\(item, label\)/);
 assert.match(cpp,/AutomationProperties::SetName\(m_navigation, title\)/);
});
test("library and consumer build against the same stable Windows App SDK",()=>{
 assert.doesNotMatch(read("windows/ExperimentalFeatures.props"),/UseExperimentalWinUI3/);
});
test("island width follows the committed pane state instead of a fixed width",()=>{
 const tsx=read("src/TronNavigationView.windows.tsx");
 assert.match(tsx,/width:paneOpen\?OPEN_PANE_WIDTH:COMPACT_PANE_WIDTH/);
});
test("consumer solution registers the x64 library project for solution builds",()=>{
 const host=read("example/scripts/prepare-host.mjs");
 assert.match(host,/windows\/NYCTronWindowsExample\.sln/);
 assert.match(host,/\|x64\.Build\.0 = /);
});

test("native failures reach JS through onNativeError instead of being swallowed",()=>{
 const spec=read("src/TronNavigationViewNativeComponent.ts");
 assert.match(spec,/onNativeError\?: DirectEventHandler<NativeError>/);
 const cpp=read("windows/NYCTronFluentFabric/TronNavigationView.cpp");
 const catches=[...cpp.matchAll(/catch \(\.\.\.\) \{\r?\n([^}]*)\}/g)].map(m=>m[1]);
 const reporting=catches.filter(body=>body.includes("ReportNativeError("));
 assert.ok(reporting.length>=2,"initialization and props catch blocks report");
 assert.match(cpp,/m_pendingErrors/);
 assert.match(cpp,/UpdateEventEmitter\(/);
 const tsx=read("src/TronNavigationView.windows.tsx");
 assert.match(tsx,/console\.error\(error\)/);
});
test("RTL layout passes authored direction with the host locale as fallback",()=>{
 assert.match(read("src/TronNavigationViewNativeComponent.ts"),/isRTL\?: boolean/);
 assert.match(read("src/TronNavigationView.windows.tsx"),/isRTL=\{nativeIsRTL\(style\)\}/);
 assert.match(read("windows/NYCTronFluentFabric/TronNavigationView.cpp"),/FlowDirection::RightToLeft/);
});
test("registration asks RNW to create its XamlApplication for the island",()=>{
 assert.match(read("windows/NYCTronFluentFabric/TronNavigationView.cpp"),/IReactViewComponentBuilder>\(\)\.XamlSupport\(true\)/);
});
test("Metro resolves the typed codegen source; types and default resolve to dist",()=>{
 const p=JSON.parse(read("package.json"));
 assert.equal(p.main,"./dist/index.js");
 assert.equal(p.types,"./dist/index.d.ts");
 const root=p.exports["."];
 assert.equal(root.types,"./dist/index.d.ts");
 // Metro must see the typed codegen spec: @react-native/babel-preset builds the
 // static view config from NativeProps and throws on compiled JS.
 assert.equal(root["react-native"],"./src/index.ts");
 assert.match(read("src/TronNavigationViewNativeComponent.ts"),/interface NativeProps/);
 assert.equal(root.default,"./dist/index.js");
 // RNW codegen reads the typed spec from src at consumer build time.
 assert.equal(p.codegenConfig.jsSrcsDir,"src");
 for(const entry of ["dist","src","windows"])assert.ok(p.files.includes(entry),entry);
});
