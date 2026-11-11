import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
import {runInNewContext} from "node:vm";
import ts from "typescript";
import * as sharedOverlays from "../../../core/src/overlays.ts";

// Runs the real KeyboardShortcutHUD on a mocked iOS host with a fake
// ChordRecorder. It proves the native recording contract (Change starts the
// recorder, a chord rebinds, a conflict asks, Escape cancels, closing stops
// the recorder), not React reconciliation or real UIKit key delivery.
const src=resolve(dirname(fileURLToPath(import.meta.url)),"../../src/components");

function harness(os){
  const slots=[];
  const effects=[];
  let cursor=0;
  const element=(type,props)=>({type,props});
  const store=init=>{let value=init();const subs=new Set();
    return {getState:()=>value,setState:next=>{value={...value,...(typeof next==="function"?next(value):next)};subs.forEach(s=>s());}};};
  const mocks={
    // Resolve the real peer-free implementation after its shared-owner extraction.
    "@nyc-tron/core/overlays": sharedOverlays,
    react:{
      useRef:v=>{const i=cursor++;return slots[i]??(slots[i]={current:v});},
      useEffect:(fn,deps)=>{const i=cursor++;const prev=slots[i];
        if(!prev||!deps||deps.some((d,k)=>d!==prev.deps[k])){prev?.cleanup?.();const slot={deps,cleanup:undefined};slots[i]=slot;effects.push(()=>{slot.cleanup=fn()??undefined;});}},
    },
    "react/jsx-runtime":{jsx:element,jsxs:element,Fragment:"Fragment"},
    "react-native":{Modal:"Modal",Pressable:"Pressable",ScrollView:"ScrollView",Text:"Text",View:"View",TextInput:"TextInput",
      Platform:{OS:os},useWindowDimensions:()=>({width:390,height:844})},
    "zustand/vanilla":{createStore:store},
    zustand:{useStore:(s,selector)=>selector(s.getState())},
  };
  mocks.react.useLayoutEffect=mocks.react.useEffect;
  const cache=new Map();
  function load(path){
    if(cache.has(path))return cache.get(path);
    const exports={};
    cache.set(path,exports);
    const code=ts.transpileModule(readFileSync(path,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,
      target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,verbatimModuleSyntax:false}}).outputText;
    runInNewContext(code,{exports,globalThis,require:name=>mocks[name]??load(resolve(dirname(path),name))},{filename:path});
    return exports;
  }
  const {KeyboardShortcutHUD}=load(resolve(src,"shell/KeyboardShortcutHUD.tsx"));
  return {render:props=>{cursor=0;const tree=KeyboardShortcutHUD(props);effects.splice(0).forEach(run=>run());return tree;},unmount:()=>slots.forEach(slot=>slot?.cleanup?.())};
}

function find(node,predicate,out=[]){
  if(!node||typeof node!=="object")return out;
  if(Array.isArray(node)){node.forEach(n=>find(n,predicate,out));return out;}
  if(node.props){
    if(predicate(node))out.push(node);
    find(node.props.children,predicate,out);
  }
  return out;
}
const byLabel=(tree,label)=>find(tree,n=>n.props.accessibilityLabel===label)[0];
const texts=tree=>find(tree,n=>n.type==="Text").flatMap(n=>[n.props.children].flat()).filter(t=>typeof t==="string");

function fakeRecorder(){
  const r={active:0,listener:undefined,starts:0,
    startRecording(onChord){r.active++;r.starts++;r.listener=onChord;return {remove(){r.active--;r.listener=undefined;}};}};
  return r;
}

const commands=[{id:"save",label:"Save",group:"File",binding:"Mod+S",defaultBinding:"Mod+S"},
  {id:"export",label:"Export",group:"File",binding:"Mod+E"}];

test("native without a recorder stays read-only, as before",()=>{
  const {render}=harness("ios");
  const tree=render({visible:true,onDismiss(){},commands,onRebind(){},apple:true});
  assert.equal(byLabel(tree,"Change shortcut for Save"),undefined);
});

test("native with a recorder: Change starts recording and the next chord rebinds",()=>{
  const {render}=harness("ios");
  const recorder=fakeRecorder();
  const rebinds=[];
  const props={visible:true,onDismiss(){},commands,onRebind:(id,b)=>rebinds.push([id,b]),recorder,apple:true};
  let tree=render(props);
  byLabel(tree,"Change shortcut for Save").props.onPress();
  tree=render(props);
  assert.equal(recorder.active,1);
  assert.ok(texts(tree).includes("Press the new shortcut on the hardware keyboard, or Esc to cancel"));
  recorder.listener({key:"k",metaKey:true,shiftKey:true});
  render(props);
  assert.deepEqual(rebinds,[["save","Mod+Shift+K"]]);
  assert.equal(recorder.active,0,"recording stops once the row is rebound");
});

test("native recording: a conflict asks first, a bare key is refused, Escape cancels",()=>{
  const {render}=harness("android");
  const recorder=fakeRecorder();
  const rebinds=[];
  const props={visible:true,onDismiss(){},commands,onRebind:(id,b)=>rebinds.push([id,b]),recorder,apple:false};
  let tree=render(props);
  byLabel(tree,"Change shortcut for Save").props.onPress();
  render(props);
  recorder.listener({key:"q"});
  tree=render(props);
  assert.ok(texts(tree).some(t=>/Add Ctrl or Alt/.test(t)));
  recorder.listener({key:"e",ctrlKey:true});
  tree=render(props);
  assert.deepEqual(rebinds,[],"a conflict never reassigns silently");
  byLabel(tree,"Replace shortcut for Export").props.onPress();
  render(props);
  assert.deepEqual(rebinds,[["export",undefined],["save","Mod+E"]]);
  byLabel(render(props),"Change shortcut for Save").props.onPress();
  render(props);
  assert.equal(recorder.active,1);
  recorder.listener({key:"Escape"});
  render(props);
  assert.equal(recorder.active,0);
  assert.equal(rebinds.length,2);
});

test("web ignores the recorder and records from the browser",()=>{
  const {render}=harness("web");
  const recorder=fakeRecorder();
  const props={visible:true,onDismiss(){},commands,onRebind(){},recorder,apple:false};
  byLabel(render(props),"Change shortcut for Save").props.onPress();
  render(props);
  assert.equal(recorder.starts,0);
});

test("native recorder drops delayed callbacks after scope replacement and removal",()=>{
 const {render,unmount}=harness("android"),recorder=fakeRecorder(),rebinds=[];
 const props={scope:"document-a",visible:true,onDismiss(){},commands,onRebind:(id,b)=>rebinds.push([id,b]),recorder,apple:false};
 byLabel(render(props),"Change shortcut for Save").props.onPress();render(props);
 const old=recorder.listener;assert.equal(recorder.active,1);
 render({...props,scope:"document-b"});render({...props,scope:"document-b"});
 assert.equal(recorder.active,0);old({key:"k",ctrlKey:true});assert.deepEqual(rebinds,[]);
 byLabel(render({...props,scope:"document-b"}),"Change shortcut for Save").props.onPress();render({...props,scope:"document-b"});
 const afterUnmount=recorder.listener;unmount();afterUnmount({key:"j",ctrlKey:true});assert.deepEqual(rebinds,[]);assert.equal(recorder.active,0);
});
test("removing the recording command stops capture and current conflicts still require confirmation",()=>{
 const {render}=harness("android"),recorder=fakeRecorder(),rebinds=[];
 const props={visible:true,onDismiss(){},commands,onRebind:(id,b)=>rebinds.push([id,b]),recorder,apple:false};
 byLabel(render(props),"Change shortcut for Save").props.onPress();render(props);
 const updated={...props,commands:commands.map(c=>c.id==="export"?{...c,binding:"Mod+K"}:c)};
 render(updated);recorder.listener({key:"k",ctrlKey:true});const tree=render(updated);
 assert.deepEqual(rebinds,[]);assert.ok(byLabel(tree,"Replace shortcut for Export"));
 render({...updated,commands:updated.commands.filter(c=>c.id!=="save")});
 assert.equal(recorder.active,0);
});
