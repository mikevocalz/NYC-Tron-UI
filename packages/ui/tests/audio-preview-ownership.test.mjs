import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createAudioPreviewOwner,audioGestureCurrent,audioResponderCurrent} from '../src/components/forge/audio/audio-preview-owner.ts';
test('geometry/source/disable restoration reaches the original preview callback and committed value',()=>{
 const owner=createAudioPreviewOwner(),old=[],next=[];const original=v=>old.push(v),replacement=v=>next.push(v);
 owner.publish('doc1:length160',original,0.5,0.8);owner.publish('doc1:length160',original,0.5,0.9);
 owner.clear('doc1:length160');assert.deepEqual(old,[0.8,0.9,0.5]);
 owner.publish('doc2:length320',replacement,0.2,0.4);owner.clear('doc1:length160');assert.deepEqual(next,[0.4]);owner.clear();owner.clear();assert.deepEqual(next,[0.4,0.2]);
});
test('EQ tuple previews preserve the original callback without restoring on every move',()=>{
 const owner=createAudioPreviewOwner(),calls=[],notify=(index,edit)=>calls.push([index,edit]);
 const before={index:2,edit:{freqHz:1000,gainDb:0}};
 owner.publish('eq',v=>notify(v.index,v.edit),before,{index:2,edit:{freqHz:1100,gainDb:1}},notify);
 owner.publish('eq',v=>notify(v.index,v.edit),before,{index:2,edit:{freqHz:1200,gainDb:2}},notify);
 assert.deepEqual(calls.map(v=>v[1].gainDb),[1,2]);owner.clear();assert.deepEqual(calls.map(v=>v[1].gainDb),[1,2,0]);
});
test('callback replacement restores its predecessor before admitting new live audio',()=>{
 const owner=createAudioPreviewOwner(),calls=[];owner.publish('same',v=>calls.push(['old',v]),1,2);owner.publish('same',v=>calls.push(['new',v]),3,4);owner.clear();assert.deepEqual(calls,[['old',2],['old',1],['new',4],['new',3]]);
});
test('queued audio responder input requires matching source/geometry and enabled admission',()=>{
 assert.equal(audioGestureCurrent(null,'new',false),false);assert.equal(audioGestureCurrent('old','new',false),false);assert.equal(audioGestureCurrent('new','new',true),false);assert.equal(audioGestureCurrent('new','new',false),true);
});
test('EQ and fader native identities do not include geometry keys',()=>{
 const source=file=>readFileSync(new URL('../src/components/forge/audio/'+file,import.meta.url),'utf8');
 assert.doesNotMatch(source('EQFrequencyGraph.tsx'),/<EQFrequencyGraphBody\s+key=/);assert.match(source('EQFrequencyGraph.tsx'),/gestureBoundary=\{owner\}/);assert.match(source('EQFrequencyGraph.tsx'),/applied===false/);assert.match(source('EQFrequencyGraph.tsx'),/qScope=useEditorBoundary\(\[scope,revision,selectedIndex/);assert.match(source('EQFrequencyGraph.tsx'),/<PrecisionScrubber scope=\{qScope\}/);
 assert.doesNotMatch(source('LevelFader.tsx'),/<LevelFaderBody\s+key=/);assert.match(source('LevelFader.tsx'),/audioResponderCurrent\(admitted.current,boundaryRef.current/);
 assert.doesNotMatch(source('LevelFader.vertical.tsx'),/<GestureDetector\s+key=/);assert.match(source('LevelFader.vertical.tsx'),/previews.current!.clear\(owner\)/);
});

test('late termination from a preceding responder cannot cancel a newer active gesture',()=>{
 assert.equal(audioResponderCurrent('current','current',false,12,11),false);
 assert.equal(audioResponderCurrent('current','current',false,12,12),true);
 assert.equal(audioResponderCurrent('old','current',false,12,12),false);
});

test('reentrant restore cannot forward an abandoned value into a newer preview host',()=>{
 const owner=createAudioPreviewOwner(),calls=[];const newer=v=>calls.push(['new',v]);
 owner.publish('old',v=>{calls.push(['old',v]);if(v===1)owner.publish('new',newer,3,4);},1,2);
 const accepted=owner.publish('replacement',v=>calls.push(['replacement',v]),5,6);
 assert.equal(accepted,false);assert.deepEqual(calls,[['old',2],['old',1],['new',4]]);
 owner.clear('replacement');assert.deepEqual(calls,[['old',2],['old',1],['new',4]]);owner.clear();assert.deepEqual(calls.at(-1),['new',3]);
});

test('reentrant unscoped clear vetoes a replacement while original preview is detached',()=>{
 const owner=createAudioPreviewOwner(),calls=[];
 owner.publish('old',v=>{calls.push(['old',v]);if(v===1)owner.clear();},1,2);
 assert.equal(owner.publish('replacement',v=>calls.push(['replacement',v]),3,4),false);
 assert.deepEqual(calls,[['old',2],['old',1]]);
 // An obsolete scoped cleanup is not a veto of a different current owner.
 owner.publish('new',v=>calls.push(['new',v]),5,6);owner.clear('old');owner.clear('new');assert.deepEqual(calls.slice(-2),[['new',6],['new',5]]);
});
