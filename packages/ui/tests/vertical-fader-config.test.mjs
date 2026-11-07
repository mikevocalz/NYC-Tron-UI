import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import * as level from '../src/components/forge/audio/level.ts';
import {audioTargetSize} from '../src/components/forge/audio/audio-chrome.ts';

test('vertical fader uses compatible RNGH axis activation and failure thresholds',()=>{
  let pan;
  const element=(type,props)=>({type,props});
  const mocks={
    react:{useRef:value=>({current:value}),useLayoutEffect:()=>{}},
    'react/jsx-runtime':{jsx:element,jsxs:element},
    'react-native':{Text:'Text',TextInput:'TextInput',View:'View'},
    'react-native-gesture-handler':{
      GestureDetector:'GestureDetector',
      usePanGesture:config=>{
        // RNGH 3 rejects minDistance combined with any axis offset.
        assert.ok(config.minDistance===undefined||[config.activeOffsetX,config.activeOffsetY,config.failOffsetX,config.failOffsetY].every(v=>v===undefined));
        pan=config;return config;
      },
      useTapGesture:config=>config,useCompetingGestures:(...gestures)=>gestures,
    },
    'zustand/vanilla':{createStore:init=>{let state=init();return {getState:()=>state,setState:next=>{state={...state,...next};}};}},
    zustand:{useStore:(store,selector)=>selector(store.getState())},
    './audio-chrome.ts':{audioTargetSize},'./level.ts':level,
    '../../Button.tsx':{Button:'Button'},'../../feedback/ErrorMessage.tsx':{ErrorMessage:'ErrorMessage'},
    '../inputs/useScopedControl.ts':{controlIdentity:(...parts)=>parts,useScopedControl:(_owner,props)=>({pending:false,current:()=>props,run:()=>{}})},
  };
  const code=ts.transpileModule(readFileSync(new URL('../src/components/forge/audio/LevelFader.vertical.tsx',import.meta.url),'utf8'),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX},
  }).outputText;
  const exports={};
  runInNewContext(code,{exports,require:name=>{assert.ok(name in mocks,`Unexpected import ${name}`);return mocks[name];}});
  exports.NativeVerticalFader({value:0.5,label:'Bass',onCommit:()=>{}});
  assert.deepEqual(Array.from(pan.activeOffsetY),[-4,4]);
  assert.deepEqual(Array.from(pan.failOffsetX),[-8,8]);
  assert.equal(pan.maxPointers,1);
});
