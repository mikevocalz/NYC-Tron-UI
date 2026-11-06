import test from 'node:test';
import assert from 'node:assert/strict';
import {createActionOwner} from '../src/components/shell/action-owner.ts';
import {filterAssets,selectAsset,formatAssetBytes} from '../src/components/shell/asset-browser-model.ts';
import {validateHistory} from '../src/components/shell/history-model.ts';
import {findLiteralText,replaceLiteralText,validateFindResponse} from '../src/components/shell/find-replace-model.ts';
import {validateFeedback} from '../src/components/shell/progress-model.ts';
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};};
const document={id:'doc',revision:'1'};
const query=(text,extra={})=>({document,text,caseSensitive:false,wholeWord:false,...extra});

test('asset list sorts folders first, uses natural names, searches metadata and preserves source order',()=>{
 const entries=[{id:'10',name:'Take 10',kind:'file',mediaType:'audio/wav',byteLength:1024},{id:'f',name:'Source',kind:'folder'},{id:'2',name:'Take 2',kind:'file',modifiedMs:9}];
 assert.deepEqual(filterAssets(entries,'','name').map(row=>row.id),['f','2','10']);
 assert.deepEqual(filterAssets(entries,'take WAV','size').map(row=>row.id),['10']);
 assert.deepEqual(entries.map(row=>row.id),['10','f','2']);
 assert.equal(formatAssetBytes(1536),'1.5 KiB');
 assert.throws(()=>filterAssets([...entries,entries[0]],'','name'),/distinct/);
 assert.throws(()=>filterAssets(entries,'x'.repeat(257),'name'),/256/);
});
test('asset ranges follow the filtered display order and toggles retain off-page selections',()=>{
 const entries=['a','b','c','d'].map(id=>({id,name:id,kind:'file'}));
 assert.deepEqual(selectAsset(entries,['elsewhere'],'c','range','a'),['a','b','c']);
 assert.deepEqual(selectAsset(entries,['elsewhere','b'],'b','toggle',null),['elsewhere']);
 assert.deepEqual(selectAsset(entries,[],'d','range','missing'),['d']);
});
test('history cursor validates initial, current and undone states without changing the host history',()=>{
 const entries=[{id:'a',label:'Draw'},{id:'b',label:'Move'}];
 for(const cursor of [0,1,2])validateHistory(entries,cursor);
 assert.throws(()=>validateHistory(entries,-1),RangeError);
 assert.throws(()=>validateHistory(entries,3),RangeError);
 assert.throws(()=>validateHistory([entries[0],entries[0]],1),/distinct/);
 assert.deepEqual(entries,[{id:'a',label:'Draw'},{id:'b',label:'Move'}]);
});
test('find is literal, Unicode-aware, uses UTF-16 ranges and distinguishes whole words',()=>{
 const result=findLiteralText('🙂 a.b A.B acb a.bx',query('a.b',{wholeWord:true}));
 assert.equal(result.total,2);assert.deepEqual(result.matches.map(row=>[row.start,row.end]),[[3,6],[7,10]]);
 assert.equal(findLiteralText('École école écoles',query('école',{wholeWord:true})).total,2);
 assert.equal(findLiteralText('a a_a a',query('a',{wholeWord:true})).total,2);
});
test('literal replacement commits one plan, preserves dollar signs, and rejects stale revisions/tokens',()=>{
 const source={...document,text:'World world WORLD'};const search=findLiteralText(source.text,query('world'));
 const base={query:query('world'),searchToken:search.token,replacement:'$&'};
 assert.equal(replaceLiteralText(source,{...base,kind:'one',matchId:search.matches[1].id}),'World $& WORLD');
 assert.equal(replaceLiteralText(source,{...base,kind:'all'}),'$& $& $&');
 assert.throws(()=>replaceLiteralText({...source,revision:'2'},{...base,kind:'all'}),/changed/);
 assert.throws(()=>replaceLiteralText(source,{...base,searchToken:'other',kind:'all'}),/changed/);
 assert.throws(()=>replaceLiteralText(source,{...base,kind:'one',matchId:'999:1000'}),/no longer exists/);
});
test('find reports the full count while bounding previews and rejects invalid provider records',()=>{
 const response=findLiteralText('x '.repeat(1500),query('x'),10);assert.equal(response.total,1500);assert.equal(response.matches.length,10);
 validateFindResponse(response);
 assert.throws(()=>validateFindResponse({...response,total:1}),RangeError);
 assert.throws(()=>validateFindResponse({...response,matches:[]}),RangeError);
 assert.throws(()=>validateFindResponse({...response,matches:[response.matches[0],response.matches[0]]}),RangeError);
});
test('reported job status controls available actions and unknown progress stays unknown',()=>{
 validateFeedback([{id:'a',title:'Saved',tone:'success'}],[{id:'j',title:'Export',status:'running',progress:null,actions:['pause','cancel']}]);
 assert.throws(()=>validateFeedback([],[{id:'j',title:'Export',status:'completed',progress:.4,actions:[]}]),/full progress/);
 assert.throws(()=>validateFeedback([],[{id:'j',title:'Export',status:'running',progress:.4,actions:['retry']}]),/status/);
 assert.throws(()=>validateFeedback([],[{id:'j',title:'Export',status:'failed',progress:null,actions:['retry'],error:''}]),/actual error/);
});
test('request owner cancels replaced operations and never consumes their late results',async()=>{
 let scope='a';const owner=createActionOwner(()=>scope);owner.activate();const old=deferred();let signal;const consumed=[];
 const first=owner.run('old',value=>{signal=value;return old.promise;},value=>consumed.push(value));
 const second=owner.run('new',()=>42,value=>consumed.push(value));assert.equal(signal.aborted,true);
 assert.equal(await second,true);old.resolve(10);assert.equal(await first,false);assert.deepEqual(consumed,[42]);
 const pending=deferred();const stale=owner.run('scope',()=>pending.promise,value=>consumed.push(value));scope='b';pending.resolve(99);
 assert.equal(await stale,false);assert.deepEqual(consumed,[42]);
});
test('unmount/cancel suppress stale failures and a remount can accept a new operation',async()=>{
 const owner=createActionOwner(()=> 'doc');owner.activate();const wait=deferred();let signal;
 const result=owner.run('save',value=>{signal=value;return wait.promise;});owner.deactivate();assert.equal(signal.aborted,true);
 wait.reject(Error('Late failure'));assert.equal(await result,false);assert.equal(owner.store.getState().error,null);
 owner.activate();assert.equal(await owner.run('save',()=>{throw Error('Write failed');}),false);assert.equal(owner.store.getState().error,'Write failed');
 assert.equal(await owner.run('save',()=>{}),true);assert.equal(owner.store.getState().error,null);
});
