import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { filterCommands, nextActiveCommand, reconcileActiveCommand, validateCommands, normalizeSearchText }
  from "../src/components/overlays/command-filter.ts";
import { cycleFocusIndex, cycleFocusTarget } from "../src/components/overlays/focus-cycle.ts";
import { placePopover, placementSide } from "../src/components/overlays/popover-position.ts";

const commands=[
  {id:"file.open",label:"Open file",keywords:["load"],group:"File"},
  {id:"file.save",label:"Save",keywords:["write"],group:"File"},
  {id:"view.reopen",label:"Reopen closed tab",group:"View"},
  {id:"edit.delete",label:"Delete selection",danger:true,disabled:true,group:"Edit"},
  {id:"edit.cafe",label:"Café mode",description:"Ambient preset"}
];

test("empty query keeps every command in the caller's order",()=>{
  assert.deepEqual(filterCommands(commands,"  ").map(c=>c.id),commands.map(c=>c.id));
});
test("label prefix outranks word prefix, substring and keyword matches",()=>{
  assert.deepEqual(filterCommands(commands,"op").map(c=>c.id),["file.open","view.reopen"]);
  assert.deepEqual(filterCommands(commands,"write").map(c=>c.id),["file.save"]);
  assert.deepEqual(filterCommands(commands,"file").map(c=>c.id),["file.open","file.save"]);
});
test("every token must match and search ignores case and accents",()=>{
  assert.deepEqual(filterCommands(commands,"OPEN load").map(c=>c.id),["file.open"]);
  assert.deepEqual(filterCommands(commands,"open xyz"),[]);
  assert.deepEqual(filterCommands(commands,"cafe").map(c=>c.id),["edit.cafe"]);
  assert.deepEqual(filterCommands(commands,"ambient").map(c=>c.id),["edit.cafe"]);
  assert.equal(normalizeSearchText(" ÉCLAIR "),"eclair");
});
test("disabled commands stay visible but are never highlighted",()=>{
  const results=filterCommands(commands,"delete");
  assert.deepEqual(results.map(c=>c.id),["edit.delete"]);
  assert.equal(reconcileActiveCommand(results,undefined),undefined);
  assert.equal(nextActiveCommand(results,undefined,"ArrowDown"),undefined);
});
test("arrow keys wrap over enabled results and stale highlights are replaced",()=>{
  const all=filterCommands(commands,"");
  assert.equal(nextActiveCommand(all,undefined,"ArrowDown"),"file.open");
  assert.equal(nextActiveCommand(all,undefined,"ArrowUp"),"edit.cafe");
  assert.equal(nextActiveCommand(all,"view.reopen","ArrowDown"),"edit.cafe");
  assert.equal(nextActiveCommand(all,"edit.cafe","ArrowDown"),"file.open");
  assert.equal(nextActiveCommand(all,"file.open","ArrowUp"),"edit.cafe");
  assert.equal(nextActiveCommand(all,"file.save","Home"),"file.open");
  assert.equal(nextActiveCommand(all,"file.save","End"),"edit.cafe");
  assert.equal(nextActiveCommand(all,"file.save","Enter"),undefined);
  assert.equal(reconcileActiveCommand(all,"file.save"),"file.save");
  assert.equal(reconcileActiveCommand(filterCommands(commands,"reopen"),"file.save"),"view.reopen");
});
test("duplicate IDs and empty labels are rejected",()=>{
  assert.throws(()=>validateCommands([{id:"a",label:"A"},{id:"a",label:"B"}]),/ID/);
  assert.throws(()=>validateCommands([{id:"a b",label:"A"}]),/ID/);
  assert.throws(()=>validateCommands([{id:"a",label:" "}]),/label/);
  assert.doesNotThrow(()=>validateCommands(commands));
});
test("Tab cycling wraps both ways and enters from outside the list",()=>{
  assert.equal(cycleFocusIndex(3,0,false),1);
  assert.equal(cycleFocusIndex(3,2,false),0);
  assert.equal(cycleFocusIndex(3,0,true),2);
  assert.equal(cycleFocusIndex(3,-1,false),0);
  assert.equal(cycleFocusIndex(3,-1,true),2);
  assert.equal(cycleFocusIndex(0,0,false),-1);
  assert.equal(cycleFocusTarget(["search","a","b"],"b",false),"search");
  assert.equal(cycleFocusTarget(["search","a","b"],"search",true),"b");
  assert.equal(cycleFocusTarget(["a"],"a",false),"a");
  assert.equal(cycleFocusTarget([],undefined,false),undefined);
});
test("placement side follows the usable region, so native popovers flip above near a bottom edge",()=>{
  const region=[{x:0,y:0,width:400,height:800}];
  const top={x:20,y:40,width:40,height:40};
  assert.equal(placementSide(top,placePopover(top,region,200,300)),"below");
  const bottom={x:20,y:700,width:40,height:40};
  assert.equal(placementSide(bottom,placePopover(bottom,region,200,300)),"above");
});
test("palette uses the kit TextField, placePopover and RN-Android-safe roles",()=>{
  const source=readFileSync(resolve("packages/ui/src/components/overlays/CommandPalette.tsx"),"utf8");
  assert.match(source,/import \{TextField\} from "\.\.\/TextField\.tsx"/);
  assert.match(source,/placePopover\(anchor,usableRegions/);
  assert.match(source,/role="option"/);
  assert.doesNotMatch(source,/accessibilityRole="(option|listbox|combobox)"/);
  const pkg=JSON.parse(readFileSync(resolve("packages/ui/package.json"),"utf8"));
  for(const name of ["CommandPalette","command-filter","focus-cycle","focus-restore"])
    assert.equal(pkg.exports["./components/overlays/"+name].default,"./dist/components/overlays/"+name+".js");
});
