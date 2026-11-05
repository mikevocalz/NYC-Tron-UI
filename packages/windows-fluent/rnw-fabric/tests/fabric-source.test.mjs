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
 assert.ok(cpp.includes("item.SelectsOnInvoked(false)"));
 assert.ok(cpp.includes("settings.SelectsOnInvoked(false)"));
 const conditional=cpp.indexOf("if (!m_itemsInitialized || props.itemsJson != m_itemsJson || footerJson != m_footerItemsJson)");
 const clear=cpp.indexOf("m_navigation.MenuItems().Clear()");
 const cache=cpp.indexOf("m_itemsInitialized = true",clear);
 const applySelection=cpp.indexOf("SetSelectedId(winrt::to_hstring(m_selectedId))");
 assert.ok(conditional>=0 && clear>conditional && cache>clear && applySelection>cache);
});
