import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {collectProof,proveIdentityOnly} from '../desktop-provenance.mjs';
import {diffApiSignatures} from '../api-signatures.mjs';
const before=readFileSync('docs/completion/reports/standalone-v1-2026-11-23-desktop-provenance/api-signatures-windows-rc2.json');
const candidate=readFileSync('docs/api-signatures-windows.json');
const encoded=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
test('both complete original snapshots survive exact scoped release-identity reversal',()=>{assert.ok(collectProof().snapshots.every(s=>s.exactOriginalByteEquality&&s.originalSha256===s.reversedSha256));});
for(const [name,mutate] of [
 ['real property type',s=>{const k=Object.keys(s.declarations).find(k=>s.declarations[k].signatures.some(v=>v.includes('readonly selectedId: string | null;')));s.declarations[k].signatures[0]=s.declarations[k].signatures[0].replace('readonly selectedId: string | null;','readonly selectedId: number | null;');}],
 ['public export removal',s=>{const p=Object.values(s.packages)[0];delete p[Object.keys(p)[0]];}],
 ['external dependency version',s=>{const k=Object.keys(s.externalTypes).find(k=>!k.startsWith('@nyc-tron/'));s.externalTypes[k].version='999.0.0';}]
])test(name+' still fails exact proof and unchanged API checker',()=>{const s=JSON.parse(candidate);mutate(s);assert.throws(()=>proveIdentityOnly(before,encoded(s)),/full original bytes differ/);assert.ok(diffApiSignatures(JSON.parse(candidate),s).length>0);});

test('version relabel key collisions fail closed',()=>{const s=JSON.parse(candidate);const k=Object.keys(s.externalTypes).find(k=>k.startsWith('@nyc-tron/core@1.0.0-rc.3/'));s.externalTypes[k.replace('@1.0.0-rc.3/','@1.0.0-rc.2/')]=s.externalTypes[k];assert.throws(()=>proveIdentityOnly(before,encoded(s)),/key collision/);});

test('public literal types containing a version identity cannot be relabelled away',()=>{const beforeGraph=JSON.parse(candidate),afterGraph=structuredClone(beforeGraph);const k=Object.keys(beforeGraph.declarations)[0];beforeGraph.declarations[k].signatures=['export type Marker = "@nyc-tron/core@1.0.0-rc.2/path";'];afterGraph.declarations[k].signatures=['export type Marker = "@nyc-tron/core@1.0.0-rc.3/path";'];assert.throws(()=>proveIdentityOnly(encoded(beforeGraph),encoded(afterGraph)),/full original bytes differ/);});
