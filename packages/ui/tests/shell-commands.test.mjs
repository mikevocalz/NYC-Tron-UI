import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {validateRibbon,ribbonTabLabel,inlineGalleryItems} from "../src/components/shell/ribbon-model.ts";
import {validatePresets,filterPresets,galleryColumns,gridFocusTarget} from "../src/components/shell/preset-model.ts";
import {bindingFromChord,normalizeBinding,isAssignableBinding,findConflict,bindingKeycaps,bindingSpoken,commandForChord} from "../src/components/shell/shortcut-model.ts";
import {createA11yStore,queueAnnouncement,motionDuration,modalityAfterKey} from "../src/components/shell/a11y-model.ts";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");

test("ribbon ids are unique, contextual tabs name their group, galleries keep the selection inline",()=>{
  const gallery={kind:"gallery",id:"styles",label:"Styles",selectedId:"s6",inline:3,
    items:["s1","s2","s3","s4","s5","s6"].map(id=>({id,label:id,preview:null}))};
  const tabs=[{id:"home",label:"Home",groups:[{id:"clip",label:"Clipboard",commands:[{kind:"button",id:"paste",label:"Paste"}]}]},
    {id:"format",label:"Format",contextualGroup:"Picture",groups:[{id:"g",label:"Styles",commands:[gallery]}]}];
  validateRibbon(tabs);
  assert.equal(ribbonTabLabel(tabs[1]),"Format, Picture tools");
  assert.deepEqual(inlineGalleryItems(gallery).map(i=>i.id),["s1","s2","s6"]);
  assert.deepEqual(inlineGalleryItems({...gallery,selectedId:"s2"}).map(i=>i.id),["s1","s2","s3"]);
  assert.throws(()=>validateRibbon([...tabs,{id:"paste",label:"X",groups:[]}]),/Duplicate/);
  assert.throws(()=>validateRibbon([{id:"t",label:"T",groups:[{id:"g2",label:"G",commands:[{...gallery,selectedId:"zz"}]}]}]),/missing item/);
  assert.throws(()=>validateRibbon([{id:"t",label:" ",groups:[]}]),/label/);
});

test("preset grids fit columns, filter favorites and move focus without wrapping",()=>{
  const presets=[{id:"a",name:"Warm",favorite:true},{id:"b",name:"Cool"},{id:"c",name:"Mono",favorite:true}];
  validatePresets(presets);
  assert.deepEqual(filterPresets(presets,"favorites").map(p=>p.id),["a","c"]);
  assert.equal(filterPresets(presets,"all").length,3);
  assert.equal(galleryColumns(358,112,8),3);
  assert.equal(galleryColumns(100,112,8),1);
  assert.equal(galleryColumns(0,112,8),1);
  assert.equal(gridFocusTarget(0,"ArrowRight",7,3),1);
  assert.equal(gridFocusTarget(0,"ArrowRight",7,3,true),0);
  assert.equal(gridFocusTarget(1,"ArrowDown",7,3),4);
  assert.equal(gridFocusTarget(5,"ArrowDown",7,3),5);
  assert.equal(gridFocusTarget(4,"ArrowUp",7,3),1);
  assert.equal(gridFocusTarget(2,"End",7,3),6);
  assert.equal(gridFocusTarget(2,"Enter",7,3),null);
  assert.throws(()=>validatePresets([{id:"a",name:"x"},{id:"a",name:"y"}]),/Duplicate/);
});

test("bindings come from key chords with Mod meaning Command on Apple and Control elsewhere",()=>{
  assert.equal(bindingFromChord({key:"s",metaKey:true,shiftKey:true},true),"Mod+Shift+S");
  assert.equal(bindingFromChord({key:"s",ctrlKey:true,shiftKey:true},false),"Mod+Shift+S");
  assert.equal(bindingFromChord({key:"k",ctrlKey:true,metaKey:true},true),"Mod+Ctrl+K");
  assert.equal(bindingFromChord({key:"Shift",shiftKey:true},false),undefined);
  assert.equal(bindingFromChord({key:" ",altKey:true},false),"Alt+Space");
  assert.equal(bindingFromChord({key:"Dead"},false),undefined);
  assert.equal(normalizeBinding("shift+mod+s"),undefined,"modifier names are case sensitive");
  assert.equal(normalizeBinding("Shift+Cmd+s"),"Mod+Shift+S");
  assert.equal(normalizeBinding("Control+Option+ArrowLeft"),"Ctrl+Alt+ArrowLeft");
  assert.equal(normalizeBinding("Mod+Mod+S"),undefined);
  assert.equal(normalizeBinding("Hyper+S"),undefined);
});

test("only modified keys or function keys can be assigned, and conflicts are found",()=>{
  assert.ok(isAssignableBinding("Mod+S"));
  assert.ok(isAssignableBinding("F5"));
  assert.ok(isAssignableBinding("Alt+1"));
  assert.ok(!isAssignableBinding("S"));
  assert.ok(!isAssignableBinding("Shift+S"));
  const commands=[{id:"save",label:"Save",binding:"Mod+S"},{id:"export",label:"Export",binding:"Mod+Shift+E"},{id:"open",label:"Open"}];
  assert.equal(findConflict(commands,"open","Cmd+s")?.id,"save");
  assert.equal(findConflict(commands,"save","Mod+S"),undefined);
  assert.equal(commandForChord(commands,{key:"e",ctrlKey:true,shiftKey:true},false)?.id,"export");
  assert.equal(commandForChord(commands,{key:"e",metaKey:true,shiftKey:true},true)?.id,"export");
});

test("keycaps and spoken names follow the platform",()=>{
  assert.deepEqual(bindingKeycaps("Mod+Shift+S",true),["⌘","⇧","S"]);
  assert.deepEqual(bindingKeycaps("Mod+Shift+S",false),["Ctrl","Shift","S"]);
  assert.deepEqual(bindingKeycaps("Alt+ArrowLeft",false),["Alt","Left"]);
  assert.equal(bindingSpoken("Mod+Alt+S",true),"Command Option S");
  assert.equal(bindingSpoken("Mod+Alt+S",false),"Control Alt S");
});

test("the a11y store queues repeat announcements and zeroes motion when reduced",()=>{
  const store=createA11yStore();
  queueAnnouncement(store,"Saved");
  queueAnnouncement(store,"Saved");
  assert.deepEqual(store.getState().announcement,{text:"Saved",politeness:"polite",seq:2});
  queueAnnouncement(store,"   ");
  assert.equal(store.getState().announcement.seq,2);
  queueAnnouncement(store,"Export failed","assertive");
  assert.equal(store.getState().announcement.politeness,"assertive");
  assert.equal(motionDuration(200,{reduceMotion:true}),0);
  assert.equal(motionDuration(200,{reduceMotion:false}),200);
  assert.throws(()=>motionDuration(-1,{reduceMotion:false}),RangeError);
  assert.equal(modalityAfterKey("pointer","Tab",false),"keyboard");
  assert.equal(modalityAfterKey("pointer","a",false),"pointer");
  assert.equal(modalityAfterKey("pointer","k",true),"keyboard");
});

test("command and overlay sources keep Android-safe roles and 44pt targets",()=>{
  for(const file of ["SplitButton.tsx","RibbonTabs.tsx","PresetGallery.tsx","KeyboardShortcutHUD.tsx"]){
    const text=readFileSync(resolve(root,"src/components/shell",file),"utf8");
    assert.ok(/min-h-11|minHeight:44/.test(text),file+" has 44pt targets");
  }
  const menu=readFileSync(resolve(root,"src/components/shell/ContextMenu.tsx"),"utf8");
  assert.ok(menu.includes("onContextMenu")&&menu.includes("onLongPress")&&menu.includes("isContextMenuKey"),"pointer, touch and keyboard paths");
  const split=readFileSync(resolve(root,"../expo-controls/src/components/NativeSplitButton.native.tsx"),"utf8");
  assert.ok(split.includes("SplitButtonLayout")&&split.includes("SwiftUIMenu"),"OS split buttons");
});
