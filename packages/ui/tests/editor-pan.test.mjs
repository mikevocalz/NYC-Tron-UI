// Real hook logic with mocked React/RNGH boundaries; not native device validation.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';

function panHarness(){
 const effects=[],events=[],exports={};
 const code=ts.transpileModule(readFileSync(new URL('../src/components/gestures/useEditorPan.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 runInNewContext(code,{exports,require:name=>{
  if(name==='react')return {useContext:()=>({gestures:[]}),useRef:current=>({current}),useLayoutEffect:fn=>effects.push(fn)};
  if(name==='react-native-gesture-handler')return {usePanGesture:options=>options};
  return {CanvasGestureRelations:{}};
 }});
 const pan=exports.useEditorPan({onBegin:()=>events.push('begin'),onMove:()=>events.push('move'),onRelease:()=>events.push('commit'),onCancel:()=>events.push('cancel')});
 const cleanups=effects.map(fn=>fn()).filter(Boolean);
 const event={numberOfPointers:1,absoluteX:10,absoluteY:20};
 pan.onBegin(event);pan.onActivate();pan.onUpdate({...event,absoluteX:30});
 return {pan,events,event,unmount:()=>cleanups.forEach(fn=>fn())};
}
for(const reason of ['touch cancellation','canceled deactivation','finalization','second contact','unmount']){
 test(`editor pan rolls back once after ${reason} and ignores late release`,()=>{
  const {pan,events,event,unmount}=panHarness();
  if(reason==='touch cancellation')pan.onTouchesCancel();
  if(reason==='canceled deactivation')pan.onDeactivate({...event,canceled:true});
  if(reason==='finalization')pan.onFinalize();
  if(reason==='second contact')pan.onTouchesDown({numberOfTouches:2});
  if(reason==='unmount')unmount();
  pan.onTouchesUp({changedTouches:[event]});pan.onDeactivate({...event,canceled:false});pan.onFinalize();
  assert.deepEqual(events,['begin','move','cancel']);
 });
}
test('editor pan commits exactly once on successful release',()=>{
 const {pan,events,event}=panHarness();
 pan.onTouchesUp({changedTouches:[event]});pan.onDeactivate({...event,canceled:false});pan.onFinalize();
 assert.deepEqual(events,['begin','move','move','commit']);
});
