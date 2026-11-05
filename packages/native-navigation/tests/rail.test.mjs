import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateNavigationItems } from "../src/navigation-model.ts";

test("stable native rail selection contract rejects invalid and duplicate destinations",()=>{
 const items=[{id:"home",label:"Home"},{id:"lessons",label:"Lessons",disabled:true}];
 assert.doesNotThrow(()=>validateNavigationItems(items,"home"));
 assert.doesNotThrow(()=>validateNavigationItems(items,null));
 assert.throws(()=>validateNavigationItems(items,"unknown"),/destination/);
 assert.throws(()=>validateNavigationItems([...items,items[0]],"home"),/unique/);
 assert.throws(()=>validateNavigationItems([{id:"empty",label:""}],"empty"),/unique/);
 assert.throws(()=>validateNavigationItems(Array.from({length:21},(_,i)=>({id:String(i),label:String(i)})),null),/20/);
});
test("native module uses ExpoUI native views and platform components",()=>{
 const ios=readFileSync("packages/native-navigation/ios/TronNavigationRailView.swift","utf8");
 const android=readFileSync("packages/native-navigation/android/src/main/java/com/nyctron/navigation/TronNavigationRailView.kt","utf8");
 const iosModule=readFileSync("packages/native-navigation/ios/NYCTronNavigationModule.swift","utf8");
 const androidModule=readFileSync("packages/native-navigation/android/src/main/java/com/nyctron/navigation/NYCTronNavigationModule.kt","utf8");
 assert.match(ios,/ExpoSwiftUI\.View/);
 assert.match(ios,/props\.onSelect/);
 assert.match(android,/androidx\.compose\.material3\.NavigationRail/);
 assert.match(android,/NavigationRailItem\(/);
 assert.match(iosModule,/ExpoUIView\(TronNavigationRailView\.self\)/);
 assert.match(androidModule,/ExpoUIView<TronRailProps>/);
});
test("native import is isolated from web fallback and Tally/Forge engines",()=>{
 const pkg=JSON.parse(readFileSync("packages/native-navigation/package.json","utf8"));
 const leaf=pkg.exports["./NativeNavigationRail"];
 assert.match(leaf["react-native"],/\.native\.js$/);
 assert.match(leaf.browser,/\.web\.js$/);
 assert.ok(!pkg.dependencies?.["@nitro-forge/ignition"]);
 const web=readFileSync("packages/native-navigation/src/NativeNavigationRail.web.tsx","utf8");
 assert.doesNotMatch(web,/requireNativeView|from "@expo\/ui"/);
});
