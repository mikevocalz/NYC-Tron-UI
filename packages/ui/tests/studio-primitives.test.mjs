import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { arrowStep, nextChoiceIndex, rovingStop, typeaheadIndex } from "../src/components/forms/choice-keys.ts";
const read=name=>readFileSync(new URL("../src/components/"+name,import.meta.url),"utf8");
const pkg=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));

test("horizontal arrows follow reading direction; vertical never flips",()=>{
  assert.equal(arrowStep("ArrowRight","horizontal",false),1);
  assert.equal(arrowStep("ArrowRight","horizontal",true),-1);
  assert.equal(arrowStep("ArrowLeft","horizontal",true),1);
  assert.equal(arrowStep("ArrowDown","horizontal",false),null);
  assert.equal(arrowStep("ArrowDown","vertical",true),1);
  assert.equal(arrowStep("ArrowRight","vertical",false),null);
  assert.equal(arrowStep("ArrowUp","both",true),-1);
});
test("choice keys wrap, skip disabled items and jump with Home/End",()=>{
  const off=[false,true,false,false];
  assert.equal(nextChoiceIndex(0,"ArrowRight",off),2);
  assert.equal(nextChoiceIndex(3,"ArrowRight",off),0);
  assert.equal(nextChoiceIndex(0,"ArrowLeft",off),3);
  assert.equal(nextChoiceIndex(0,"ArrowLeft",off,{rtl:true}),2);
  assert.equal(nextChoiceIndex(2,"Home",off),0);
  assert.equal(nextChoiceIndex(0,"End",[false,false,true]),1);
  assert.equal(nextChoiceIndex(-1,"ArrowRight",off),0);
  assert.equal(nextChoiceIndex(-1,"ArrowLeft",off),3);
  assert.equal(nextChoiceIndex(3,"ArrowDown",off,{axis:"vertical",wrap:false}),3);
  assert.equal(nextChoiceIndex(0,"Enter",off),null);
  assert.equal(nextChoiceIndex(0,"ArrowRight",[true,true]),null);
});
test("roving tab stop lands on the selection or the first enabled item",()=>{
  assert.equal(rovingStop(2,[false,false,false]),2);
  assert.equal(rovingStop(-1,[true,false]),1);
  assert.equal(rovingStop(0,[true,false]),1);
  assert.equal(rovingStop(-1,[true,true]),-1);
});
test("typeahead finds the next enabled label after the active one",()=>{
  const labels=["Inter","IBM Plex","Source","Serif Mono"],off=[false,false,false,true];
  assert.equal(typeaheadIndex(labels,off,0,"i"),1);
  assert.equal(typeaheadIndex(labels,off,1,"I"),0);
  assert.equal(typeaheadIndex(labels,off,-1,"s"),2);
  assert.equal(typeaheadIndex(labels,off,2,"s"),2);
  assert.equal(typeaheadIndex(labels,off,0," "),-1);
});
test("studio primitives are addressable subpaths and stay out of the root barrel",()=>{
  const root=readFileSync(new URL("../src/index.ts",import.meta.url),"utf8");
  for(const name of ["Select","SegmentedControl","TabBar","Toolbar","List","IconButton","FieldGroup","forms/choice-keys"]){
    const entry=pkg.exports["./components/"+name];
    assert.ok(entry,"missing subpath "+name);
    assert.equal(entry.default,`./dist/components/${name}.js`);
    assert.equal(entry.types,`./dist/components/${name}.d.ts`);
    assert.ok(!root.includes(`./components/${name}.tsx`),name+" must not join the root barrel");
  }
});
test("studio primitives expose the semantics their pattern requires",()=>{
  const seg=read("SegmentedControl.tsx");
  assert.match(seg,/role="radiogroup"/);assert.match(seg,/role="radio" aria-checked=\{active\}/);
  assert.match(seg,/tabIndex:i===stop\?0:-1/);
  const tabs=read("TabBar.tsx");
  assert.match(tabs,/role=\{nav\?"navigation":"tablist"\}/);
  assert.match(tabs,/role=\{nav\?"link":"tab"\}/);
  assert.match(tabs,/aria-selected=\{nav\?undefined:active\}/);
  assert.match(tabs,/"aria-current":nav&&active\?"page":undefined/);
  const select=read("Select.tsx");
  for(const attr of ['role="combobox"','"aria-activedescendant"','"aria-expanded"','role="option"','"aria-haspopup":"listbox"'])
    assert.ok(select.includes(attr),"Select missing "+attr);
  assert.match(read("Toolbar.tsx"),/role="toolbar"/);
  assert.match(read("Toolbar.tsx"),/accessibilityRole="header"/);
  const list=read("List.tsx");
  assert.match(list,/role="list"/);assert.match(list,/role="listitem"/);
  assert.match(read("FieldGroup.tsx"),/role="group" aria-label=\{title\}/);
  const icon=read("IconButton.tsx");
  assert.match(icon,/accessibilityLabel=\{ariaLabel\}/);
  assert.match(icon,/"aria-pressed":selected/);
});
test("every studio primitive meets 44pt and gives selection a forced-colors cue",()=>{
  for(const name of ["SegmentedControl.tsx","TabBar.tsx","List.tsx","IconButton.tsx","Select.tsx"]){
    const text=read(name);
    assert.match(text,/min-h-11|h-11 w-11|min-h-12/,name+" touch target");
    assert.match(text,/forced-colors:border-\[Highlight\]/,name+" forced-colors selection");
  }
  assert.match(read("IconButton.tsx"),/size==="sm"\?"h-11 w-11":"h-12 w-12"/);
});
