import test from "node:test";
import assert from "node:assert/strict";
import {createKeyboardMap,isTextEditingBinding,reservedBindingReason,toNativeKeyBinding} from "../src/components/shell/keyboard-map.ts";

const entries=[
  {id:"save",label:"Save",binding:"Mod+S"},
  {id:"export",label:"Export",binding:"Mod+Shift+s"},
  {id:"undo",label:"Undo",binding:"Mod+Z"},
  {id:"brush",label:"Brush",binding:"B"},
  {id:"help",label:"Help",binding:"F1",allowInTextInput:true},
  {id:"nudge",label:"Nudge layer",binding:"ArrowUp",scope:"canvas"},
  {id:"grid-up",label:"Cell up",binding:"ArrowUp",scope:"grid"},
  {id:"close-sheet",label:"Close sheet",binding:"Mod+W",scope:"sheet"},
  {id:"close-doc",label:"Close document",binding:"Mod+W"},
  {id:"off",label:"Disabled",binding:"Mod+D",disabled:true},
];

test("the innermost active scope wins; global is the fallback",()=>{
  const map=createKeyboardMap(entries,true);
  assert.equal(map.resolveBinding("Mod+W")?.id,"close-doc");
  assert.equal(map.resolveBinding("Mod+W",{activeScopes:["sheet"]})?.id,"close-sheet");
  assert.equal(map.resolveBinding("ArrowUp",{activeScopes:["grid","canvas"]})?.id,"grid-up");
  assert.equal(map.resolveBinding("ArrowUp",{activeScopes:["canvas"]})?.id,"nudge");
  assert.equal(map.resolveBinding("ArrowUp"),undefined,"a scoped binding is dead outside its scope");
});

test("chords resolve through #39's bindingFromChord: Command on Apple, Control elsewhere",()=>{
  const apple=createKeyboardMap(entries,true);
  const other=createKeyboardMap(entries,false);
  assert.equal(apple.resolve({key:"s",metaKey:true})?.id,"save");
  assert.equal(apple.resolve({key:"s",ctrlKey:true}),undefined,"Control+S is not Mod+S on a Mac");
  assert.equal(other.resolve({key:"s",ctrlKey:true})?.id,"save");
  assert.equal(other.resolve({key:"S",ctrlKey:true,shiftKey:true})?.id,"export");
  assert.equal(other.resolve({key:"Shift",shiftKey:true}),undefined,"a lone modifier is never a chord");
});

test("a focused text field keeps typing and editing keys unless the command opts in",()=>{
  const map=createKeyboardMap(entries,false);
  const typing={textInputFocused:true};
  assert.equal(map.resolveBinding("B",typing),undefined);
  assert.equal(map.resolveBinding("Mod+Z",typing),undefined,"the field undoes its own text");
  assert.equal(map.resolveBinding("Mod+S",typing)?.id,"save","Mod+S still saves while typing");
  assert.equal(map.resolveBinding("F1",typing)?.id,"help");
  assert.equal(map.resolveBinding("B")?.id,"brush");
});

test("disabled commands never dispatch and are not registered natively",()=>{
  const map=createKeyboardMap(entries,false);
  assert.equal(map.resolveBinding("Mod+D"),undefined);
  assert.ok(!map.nativeBindings().some(b=>b.binding==="Mod+D"));
});

test("conflicts are per scope; the first registration dispatches",()=>{
  const map=createKeyboardMap([...entries,{id:"save-as",label:"Save as",binding:"Mod+S"}],false);
  assert.deepEqual(map.conflicts(),[{binding:"Mod+S",scope:"global",ids:["save","save-as"]}]);
  assert.equal(map.resolveBinding("Mod+S")?.id,"save");
  assert.deepEqual(createKeyboardMap(entries,false).conflicts(),[],"the same chord in two scopes is shadowing, not a conflict");
  assert.throws(()=>createKeyboardMap([entries[0],entries[0]],false),/Duplicate keyboard command id "save"/);
});

test("reserved OS chords are reported per platform",()=>{
  const list=[{id:"quit",label:"Quit",binding:"Mod+Q"},{id:"close",label:"Close",binding:"Alt+F4"}];
  assert.deepEqual(createKeyboardMap(list,true).reserved(),[{id:"quit",binding:"Mod+Q",reason:"quits the app"}]);
  assert.deepEqual(createKeyboardMap(list,false).reserved(),[{id:"close",binding:"Alt+F4",reason:"closes the window"}]);
  assert.equal(reservedBindingReason("Mod+Shift+S",true),undefined);
});

test("native bindings are split, deduplicated, titled by the first command and keep text editing out of priority",()=>{
  const map=createKeyboardMap(entries,true);
  const native=map.nativeBindings();
  const wClose=native.filter(b=>b.binding==="Mod+W");
  assert.equal(wClose.length,1);
  assert.deepEqual(toNativeKeyBinding("Mod+Shift+s","Export"),
    {binding:"Mod+Shift+S",key:"S",mod:true,ctrl:false,alt:false,shift:true,title:"Export",overridesSystem:true});
  assert.equal(native.find(b=>b.binding==="Mod+Z")?.overridesSystem,false);
  assert.equal(toNativeKeyBinding("Mod+",""),undefined);
  assert.ok(isTextEditingBinding("Cmd+c"));
});
