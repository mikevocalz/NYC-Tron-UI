import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
test('SwiftPM preserves native-controls CocoaPods frameworks, target, iOS floor and packed manifest',()=>{
 const pod=read('ios/NYCTronInstruments.podspec'),spm=read('Package.swift');
 const frameworks=pod.match(/s\.frameworks\s*=([^\n]+)/)[1].match(/'([^']+)'/g).map(x=>x.slice(1,-1));
 for(const framework of frameworks)assert.ok(spm.includes(`.linkedFramework("${framework}")`),framework);
 const floor=pod.match(/s\.platforms\s*=\s*\{\s*ios:\s*'([^']+)'/)[1];
 assert.ok(spm.includes(`.iOS("${floor}")`));
 assert.match(spm,/name: "NYCTronInstruments"/);
 assert.match(spm,/path: "ios"/);
 assert.ok(JSON.parse(read('package.json')).files.includes('Package.swift'));
});
