import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
import {runInNewContext} from "node:vm";
import ts from "@typescript/typescript6";

// Runs the real native FilePicker with mocked RN hosts and a fake document
// source. Proves the contract (no source -> nothing rendered, one pick per
// press, busy while open, cancel calls nothing, errors reach onError), not
// the OS picker itself.
const file=resolve(dirname(fileURLToPath(import.meta.url)),"../../src/components/files/FilePicker.native.tsx");

function harness(){
  const slots=[];
  let cursor=0;
  const element=(type,props)=>({type,props});
  const mocks={
    react:{useRef:v=>{const i=cursor++;return slots[i]??(slots[i]={current:v});}},
    "react/jsx-runtime":{jsx:element,jsxs:element},
    "react-native":{Pressable:"Pressable",Text:"Text"},
    "zustand/vanilla":{createStore:init=>{let v=init();return {getState:()=>v,setState:n=>{v={...v,...n};}};}},
    zustand:{useStore:(s,sel)=>sel(s.getState())},
  };
  const cache=new Map();
  const load=path=>{
    if(cache.has(path))return cache.get(path);
    const exports={};cache.set(path,exports);
    const code=ts.transpileModule(readFileSync(path,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,
      target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,verbatimModuleSyntax:false}}).outputText;
    runInNewContext(code,{exports,Promise,Error,String,require:n=>mocks[n]??load(resolve(dirname(path),n))},{filename:path});
    return exports;
  };
  const {FilePicker}=load(file);
  return props=>{cursor=0;return FilePicker(props);};
}

// Objects built inside the vm context have that realm's prototypes; compare plain copies.
const plain=v=>JSON.parse(JSON.stringify(v));
const doc={uri:"file:///cache/poster.nfd",name:"poster.nfd",size:1200};

test("without a source or a receiver, native renders nothing",()=>{
  const render=harness();
  assert.equal(render({label:"Open"}),null);
  assert.equal(render({label:"Open",documentSource:{pick:async()=>[]}}),null);
  assert.equal(render({label:"Open",onDocuments(){}}),null);
});

test("a press picks once with accept and multiple, and hands the documents over",async()=>{
  const render=harness();
  const calls=[];let release;
  const source={pick:opts=>{calls.push(opts);return new Promise(r=>{release=r;});}};
  const got=[];
  const props={label:"Open",accept:".nfd,image/png",multiple:true,documentSource:source,onDocuments:d=>got.push(...d)};
  const button=render(props);
  assert.equal(button.props.accessibilityRole,"button");
  assert.equal(button.props.accessibilityLabel,"Open");
  const pending=button.props.onPress();
  const busy=render(props);
  assert.equal(busy.props.disabled,true,"busy while the picker is open");
  assert.deepEqual(plain(busy.props.accessibilityState),{disabled:true,busy:true});
  await busy.props.onPress();
  assert.equal(calls.length,1,"a second tap does not stack pickers");
  release([doc]);
  await pending;
  assert.deepEqual(plain(calls[0]),{accept:".nfd,image/png",multiple:true});
  assert.deepEqual(got,[doc]);
  assert.equal(render(props).props.disabled,false);
});

test("cancel calls nothing; a failure goes to onError and unlocks the button",async()=>{
  const render=harness();
  let got=0;
  await render({label:"Open",documentSource:{pick:async()=>[]},onDocuments:()=>got++}).props.onPress();
  assert.equal(got,0);
  const errors=[];
  const props={label:"Open",documentSource:{pick:async()=>{throw new Error("Picker unavailable");}},onDocuments:()=>got++,onError:e=>errors.push(e.message)};
  await render(props).props.onPress();
  assert.deepEqual(errors,["Picker unavailable"]);
  assert.equal(render(props).props.disabled,false);
});
