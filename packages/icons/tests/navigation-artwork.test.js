import test from "node:test";
import assert from "node:assert/strict";
import { getGlyph } from "../src/glyphs.js";
import { hasIconId } from "../src/catalog.js";

const ids = [
 ...["chevron-left","chevron-right","chevron-up","chevron-down","arrow-left","arrow-right","arrow-up","arrow-down","more-horizontal","more-vertical","sidebar-left","sidebar-right","split-view","grid-view","list-view","external-link","pin","unpin"].map(id=>"navigation/"+id),
 ...["device-phone","device-tablet","device-foldable","device-duo","device-desktop","device-watch"].map(id=>"devices/"+id),
 "layout/folding-book","layout/folding-tabletop","edit/lock","edit/unlock","file/download","file/upload"
];
function validatePath(path) {
 const token=/[MmLlHhVvCcSsQqTtAaZz]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g;
 assert.equal(path.replace(token,"").replace(/[\s,]/g,""),"","Unrecognized SVG token");
 const tokens=path.match(token)??[];
 const arities={M:2,L:2,H:1,V:1,C:6,S:4,Q:4,T:2,A:7,Z:0};
 let i=0;
 while(i<tokens.length) {
  const command=tokens[i++].toUpperCase();
  assert.ok(command in arities,"Expected SVG command");
  const values=[];
  while(i<tokens.length&&!/^[a-z]$/i.test(tokens[i]))values.push(Number(tokens[i++]));
  assert.ok(values.every(Number.isFinite));
  const arity=arities[command];
  if(arity===0)assert.equal(values.length,0);
  else {
   assert.ok(values.length>=arity,"Incomplete "+command);
   assert.equal(values.length%arity,0,"Incomplete repeated "+command);
   if(command==="A")for(let j=0;j<values.length;j+=7) {
    assert.ok(values[j]>=0&&values[j+1]>=0,"Negative arc radius");
    assert.ok([0,1].includes(values[j+3])&&[0,1].includes(values[j+4]),"Invalid arc flag");
   }
  }
 }
}
test("navigation and adaptive-device batch has distinct, valid paired artwork",()=>{
 assert.equal(ids.length,30);
 for(const id of ids) {
  assert.ok(hasIconId(id),id+" must be a registered semantic ID");
  const outline=getGlyph(id,"outline"),filled=getGlyph(id,"filled");
  assert.ok(outline?.length,id);
  assert.ok(filled?.length,id);
  assert.notDeepEqual(outline,filled,id+" must have authored selected artwork");
  for(const paths of [outline,filled])for(const [path] of paths)validatePath(path);
 }
});
test("SVG validation rejects truncated arcs rather than silently losing artwork",()=>{
 assert.throws(()=>validatePath("M11 20a1 1 0 1 0 2 0 1 0-2 0z"));
 assert.throws(()=>validatePath("M0 0a1 1 0 2 0 2 0"));
});
test("hardware and physical-side icons remain distinct",()=>{
 assert.notDeepEqual(getGlyph("devices/device-duo"),getGlyph("devices/device-foldable"));
 assert.notDeepEqual(getGlyph("layout/folding-book"),getGlyph("layout/folding-tabletop"));
 assert.notDeepEqual(getGlyph("navigation/sidebar-left"),getGlyph("navigation/sidebar-right"));
});
