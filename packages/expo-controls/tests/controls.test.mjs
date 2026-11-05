import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { normalizeMenuActions,findEnabledMenuAction,enabledMenuLeaves,menuFocusTarget } from "../src/components/menu-model.ts";
test("keyboard traversal skips disabled sections and wraps through enabled leaves",()=>{
 const actions=[{id:"first",title:"First"},{id:"blocked",title:"Blocked",disabled:true},
  {id:"section",title:"Section",subactions:[{id:"last",title:"Last",checked:false}]},
  {id:"hidden",title:"Disabled group",disabled:true,subactions:[{id:"child",title:"Child"}]}];
 assert.deepEqual(enabledMenuLeaves(actions).map(item=>item.id),["first","last"]);
 assert.equal(menuFocusTarget(actions,undefined,"Home"),"first");
 assert.equal(menuFocusTarget(actions,undefined,"End"),"last");
 assert.equal(menuFocusTarget(actions,"first","ArrowDown"),"last");
 assert.equal(menuFocusTarget(actions,"last","ArrowDown"),"first");
 assert.equal(menuFocusTarget(actions,"first","ArrowUp"),"last");
 assert.equal(menuFocusTarget(actions,"removed","ArrowDown"),"first");
 assert.equal(menuFocusTarget(actions,"removed","ArrowUp"),"last");
 assert.equal(menuFocusTarget(actions,"first","Enter"),undefined);
 assert.equal(menuFocusTarget([],undefined,"Home"),undefined);
 assert.equal(menuFocusTarget([{id:"x",title:"X",disabled:true}],undefined,"End"),undefined);
});
test("native menu tree retains disabled, destructive and checked states",()=>{
 const actions=[{id:"edit",title:"Edit"},{id:"remove",title:"Remove",destructive:true,disabled:true},
 {id:"pin",title:"Pin",checked:true},{id:"share",title:"Share",
  subactions:[{id:"sms",title:"Message"}]}];
 const result=normalizeMenuActions(actions);
 assert.equal(result[1].attributes.destructive,true);
 assert.equal(result[1].attributes.disabled,true);
 assert.equal(result[2].state,"on");
 assert.equal(result[3].subactions[0].id,"sms");
 assert.equal(findEnabledMenuAction(actions,"remove"),undefined);
 assert.equal(findEnabledMenuAction(actions,"sms").title,"Message");
});
test("duplicate, missing or cyclic action IDs are rejected before native render",()=>{
 assert.throws(()=>normalizeMenuActions([{id:"a",title:"A"},{id:"a",title:"B"}]),/ID/);
 assert.throws(()=>normalizeMenuActions([{id:"a",title:""}]),/title/);
 assert.throws(()=>normalizeMenuActions([{id:"a",title:"A",subactions:[
  {id:"b",title:"B",subactions:[{id:"c",title:"C",subactions:[
   {id:"d",title:"D",subactions:[{id:"e",title:"E",subactions:[{id:"f",title:"F"}]}]}
  ]}]}
 ]}]),/four levels/);
});
test("native menu is iOS/Android Expo component and web has active fallback",()=>{
 const base=resolve("packages/expo-controls/src/components");
 const native=readFileSync(resolve(base,"NativeActionMenu.native.tsx"),"utf8");
 const web=readFileSync(resolve(base,"NativeActionMenu.web.tsx"),"utf8");
 assert.match(native,/from "@expo\/ui\/community\/menu"/);
 assert.match(native,/onPressAction/);
 assert.match(web,/onPress=\{\(\)=>run\(action.id\)\}/);
 assert.doesNotMatch(web,/@expo\/ui\/community\/menu/);
});
test("dropdown caption names the picker for screen readers on every platform",()=>{
 const base=resolve("packages/expo-controls/src/components");
 const native=readFileSync(resolve(base,"NativeDropdown.native.tsx"),"utf8");
 const web=readFileSync(resolve(base,"NativeDropdown.tsx"),"utf8");
 // iOS: SwiftUI Picker carries the label.
 assert.match(native,/<SwiftUIPicker label=\{label\}/);
 // Android: the exposed-dropdown anchor field carries it as contentDescription.
 assert.match(native,/semantics\(\{contentDescription:label\}\)/);
 // The visible caption is not announced a second time on native.
 assert.match(native,/<Text accessibilityElementsHidden importantForAccessibility="no"/);
 // Web: the caption names the group around the <select>.
 assert.match(web,/role="group" aria-label=\{label\}/);
 const pkg=JSON.parse(readFileSync(resolve("packages/expo-controls/package.json"),"utf8"));
 assert.equal(pkg.exports["./NativeDropdown"]["react-native"],"./dist/components/NativeDropdown.native.js");
 assert.equal(pkg.exports["."]["react-native"],"./dist/index.native.js");
});

