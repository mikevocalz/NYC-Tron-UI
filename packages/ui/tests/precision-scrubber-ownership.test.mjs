import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createScrubberModel,initialScrubberState} from '../src/components/forge/inputs/precision-scrubber-model.ts';
function fixture(){let props={value:10,min:0,max:100,step:1,onCommit:()=>{}};let state=initialScrubberState(10,1);const store={getState:()=>state,setState:p=>{state={...state,...p};}};const model=createScrubberModel(store,()=>props);return {store,model,set:p=>{props={...props,...p};}};}
const point=(x,y=0)=>({x,y});
test('source replacement restores original preview callback/value and consumes old release/draft handlers',()=>{
 const f=fixture(),old=[],next=[],commits=[];
 f.set({onPreview:v=>old.push(v),onCommit:v=>commits.push(v)});f.model.admit('a:1');const a=f.model.scoped('a:1');
 a.begin(point(0));a.move(point(16),1);assert.deepEqual(old,[12]);
 f.set({value:30,onPreview:v=>next.push(v)});f.model.admit('b:2');const b=f.model.scoped('b:2');
 assert.deepEqual(old,[12,10]);assert.deepEqual(next,[]);assert.equal(f.store.getState().preview,30);
 a.release(point(24));a.startEditing();a.changeDraft('90');a.applyDraft();assert.deepEqual(commits,[]);
 b.startEditing();b.changeDraft('35');assert.equal(f.store.getState().draft,'35');
 f.model.admit('a:3');a.applyDraft();assert.deepEqual(commits,[]);assert.equal(f.store.getState().editing,false);
});
test('old pending rejection/finally cannot clear new-source pending state or publish old errors',async()=>{
 const f=fixture();let rejectOld,resolveNew;
 f.set({onCommit:()=>new Promise((_,reject)=>{rejectOld=reject;})});f.model.admit('a');const old=f.model.scoped('a').nudge(1);
 assert.equal(f.store.getState().pending,true);
 f.set({value:40,onCommit:()=>new Promise(resolve=>{resolveNew=resolve;})});f.model.admit('b');const current=f.model.scoped('b').nudge(1);
 rejectOld(new Error('old source failed'));await old;
 assert.equal(f.store.getState().pending,true);assert.equal(f.store.getState().error,undefined);assert.equal(f.store.getState().preview,41);
 resolveNew();await current;assert.equal(f.store.getState().pending,false);assert.equal(f.store.getState().preview,40);
});
test('same admitted identity retains drafts; config admission resets them and invalidation blocks queued events',()=>{
 const f=fixture();f.model.admit('stable');const events=f.model.scoped('stable');events.startEditing();events.changeDraft('19');f.model.admit('stable');assert.equal(f.store.getState().draft,'19');
 f.set({max:50});f.model.admit('config');assert.equal(f.store.getState().editing,false);events.changeDraft('49');assert.equal(f.store.getState().draft,'10');
 const current=f.model.scoped('config');f.model.invalidate();current.startEditing();assert.equal(f.store.getState().editing,false);
});
test('preview callback replacement during a gesture restores its original host',()=>{
 const f=fixture(),old=[],replacement=[];f.set({onPreview:v=>old.push(v)});f.model.admit('a');const a=f.model.scoped('a');a.begin(point(0));a.move(point(8),1);
 f.set({onPreview:v=>replacement.push(v),value:20});a.cancel();assert.deepEqual(old,[11,10]);assert.deepEqual(replacement,[]);
});
test('native body and input are retained across boundary changes',()=>{
 const source=readFileSync(new URL('../src/components/forge/inputs/PrecisionScrubber.tsx',import.meta.url),'utf8');
 assert.doesNotMatch(source,/<PrecisionScrubberBody\s+key=/);assert.match(source,/controller.admit\(boundary\)/);assert.match(source,/controller.scoped\(boundary\)/);assert.match(source,/useEditorBoundary\(\[signature\]\)/);
});

test('unmount invalidation restores raw preview even after the final write gate closes',()=>{
 const f=fixture(),previews=[],writes=[];let mounted=true;
 f.set({onPreview:v=>previews.push(v),onCommit:v=>{if(mounted)writes.push(v);}});
 f.model.admit('a');const events=f.model.scoped('a');events.begin(point(0));events.move(point(24),1);
 mounted=false;f.model.invalidate();events.release(point(32));assert.deepEqual(previews,[13,10]);assert.deepEqual(writes,[]);
});

test('throwing preview restoration cannot strand state or retain old event admission',()=>{
 const f=fixture();let restore=false;const failure=new Error('host restoration');
 f.set({onPreview:()=>{if(restore)throw failure;}});f.model.admit('a');const a=f.model.scoped('a');a.begin(point(0));a.move(point(8),1);
 restore=true;f.set({value:30});assert.throws(()=>f.model.admit('b'),error=>error===failure);
 assert.equal(f.model.dragging,false);assert.equal(f.store.getState().active,false);assert.equal(f.store.getState().pending,false);assert.equal(f.store.getState().editing,false);assert.equal(f.store.getState().preview,30);
 a.startEditing();assert.equal(f.store.getState().editing,false);
 const b=f.model.scoped('b');restore=false;b.begin(point(0));b.move(point(8),1);restore=true;
 assert.throws(()=>f.model.invalidate(),error=>error===failure);assert.equal(f.store.getState().active,false);b.startEditing();assert.equal(f.store.getState().editing,false);
});

for(const action of ['release','begin'])for(const replacement of ['admit','invalidate'])test(`reentrant ${replacement} during ${action} restoration consumes the old continuation`,async()=>{
 const f=fixture(),writes=[];let replacing=false;
 f.set({onCommit:v=>writes.push(v),onPreview:()=>{if(replacing){f.set({value:30});if(replacement==='admit')f.model.admit('b');else f.model.invalidate();}}});
 f.model.admit('a');const a=f.model.scoped('a');a.begin(point(0));a.move(point(16),1);replacing=true;
 if(action==='release')await a.release(point(16));else a.begin(point(20));
 assert.deepEqual(writes,[]);assert.equal(f.store.getState().pending,false);assert.equal(f.store.getState().active,false);assert.equal(f.store.getState().preview,30);assert.equal(f.model.dragging,false);
 a.release(point(32));assert.deepEqual(writes,[]);
});
test('reentrant newer admission pending work survives the older admission finally',async()=>{
 const f=fixture();let restoring=false,resolveNew,newRequest;
 f.set({onPreview:()=>{if(restoring){f.set({value:30,onCommit:()=>new Promise(resolve=>{resolveNew=resolve;})});f.model.admit('c');newRequest=f.model.scoped('c').nudge(1);}}});
 f.model.admit('a');const a=f.model.scoped('a');a.begin(point(0));a.move(point(8),1);restoring=true;f.model.admit('b');
 assert.equal(f.store.getState().pending,true);assert.equal(f.store.getState().preview,31);resolveNew();await newRequest;assert.equal(f.store.getState().preview,30);
});
