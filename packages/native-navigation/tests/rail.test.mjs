import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { defaultIndicatorColor, resolvePhysicalRightRailRegion, resolveRailDimensions, validateNavigationItems } from "../src/navigation-model.ts";
import { resolveUsableRegions } from "../../core/src/folds.ts";

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

test("rail host dimensions preserve custom measurements and reject invalid geometry",()=>{
 assert.deepEqual(resolveRailDimensions(false),{width:80,height:"100%"});
 assert.deepEqual(resolveRailDimensions(true),{width:208,height:"100%"});
 assert.deepEqual(resolveRailDimensions(true,96,240),{width:96,height:240});
 assert.deepEqual(resolveRailDimensions(false,64,44),{width:64,height:44});
 for(const width of [NaN,Infinity,-Infinity,-1,0,63.99])
   assert.throws(()=>resolveRailDimensions(false,width,240),/width/);
 for(const height of [NaN,Infinity,-Infinity,-1,0,43.99])
   assert.throws(()=>resolveRailDimensions(true,208,height),/height/);
});

test("rail region follows the physical right segment around hinges, never text direction",()=>{
 // Surface Duo double portrait: vertical separating hinge between two 540-wide screens.
 const duo=resolveUsableRegions({container:{x:0,y:0,width:1114,height:720},
   features:[{bounds:{x:540,y:0,width:34,height:720},orientation:"vertical",separating:true,occlusion:"full"}]});
 assert.deepEqual(resolvePhysicalRightRailRegion(duo),{x:574,y:0,width:540,height:720});
 // Horizontal fold (tabletop/book-rotated): the rail stays in one segment, not across the fold.
 const tabletop=resolveUsableRegions({container:{x:0,y:0,width:720,height:1114},
   features:[{bounds:{x:0,y:540,width:720,height:34},orientation:"horizontal",separating:true,occlusion:"full"}]});
 const region=resolvePhysicalRightRailRegion(tabletop);
 assert.deepEqual(region,{x:0,y:0,width:720,height:540});
 assert.ok(region.y+region.height<=540);
 // Unequal horizontal split prefers the taller segment.
 assert.deepEqual(resolvePhysicalRightRailRegion([{x:0,y:0,width:400,height:200},{x:0,y:230,width:400,height:500}]),
   {x:0,y:230,width:400,height:500});
 assert.throws(()=>resolvePhysicalRightRailRegion([]),/usable region/);
 assert.throws(()=>resolvePhysicalRightRailRegion([{x:0,y:0,width:0,height:10}]),/usable region/);
});

test("selected indicator is a fully rounded pill filled from a theme token on every renderer",()=>{
 assert.equal(defaultIndicatorColor("#B2A7FF"),"#B2A7FF26");
 assert.equal(defaultIndicatorColor("red"),undefined);
 assert.equal(defaultIndicatorColor(undefined),undefined);
 const ios=readFileSync("packages/native-navigation/ios/TronNavigationRailView.swift","utf8");
 const android=readFileSync("packages/native-navigation/android/src/main/java/com/nyctron/navigation/TronNavigationRailView.kt","utf8");
 const web=readFileSync("packages/native-navigation/src/NativeNavigationRail.web.tsx","utf8");
 assert.match(ios,/Capsule\(\)\.fill/);
 assert.match(ios,/\.contentShape\(Capsule\(\)\)/);
 assert.doesNotMatch(ios,/RoundedRectangle\(cornerRadius/);
 assert.match(ios,/props\.indicatorColor/);
 assert.match(android,/indicatorColor = indicator/);
 assert.match(web,/borderRadius:9999/);
 assert.match(web,/accessibilityRole="tab"/);
});
