// One release-specific proof; the live API signature checker remains unchanged.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { isMainModule } from './library-components.mjs';
const packages=['@nyc-tron/core','@nyc-tron/windows-fluent'];
const history='docs/completion/reports/standalone-v1-2026-11-23-desktop-provenance';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
// The candidate is whatever version the workspace packages carry now (rc.3, then
// 1.0.0); the reviewed baseline stays the published rc.2 snapshots.
export const BASELINE='1.0.0-rc.2';
export const CANDIDATE=JSON.parse(readFileSync(new URL('../packages/core/package.json',import.meta.url),'utf8')).version;
export function reverseInternalReleaseIdentity(candidate){
 const mapIdentity=id=>{for(const name of packages){const from=name+'@'+CANDIDATE+'/';if(id.startsWith(from))return name+'@'+BASELINE+'/'+id.slice(from.length);}return id;};
 const reversed=structuredClone(candidate);
 // Only graph identity locations may change. Signatures and export conditions
 // remain completely untouched, including any public string literal types.
 for(const paths of Object.values(reversed.packages??{}))for(const variants of Object.values(paths))for(const variant of variants)for(const [symbol,ids]of Object.entries(variant.symbols))variant.symbols[symbol]=ids.map(mapIdentity);
 for(const record of Object.values(reversed.declarations??{}))record.references=record.references.map(mapIdentity);
 const external={};
 for(const [id,record]of Object.entries(reversed.externalTypes??{})){
  const mapped=mapIdentity(id);
  if(Object.hasOwn(external,mapped))throw Error('Release identity key collision: '+mapped);
  if(packages.includes(record.package)&&record.version===CANDIDATE)record.version=BASELINE;
  external[mapped]=record;
 }
 reversed.externalTypes=external;
 return reversed;
}
export function proveIdentityOnly(beforeBytes,candidateBytes){
 const reversed=Buffer.from(JSON.stringify(reverseInternalReleaseIdentity(JSON.parse(candidateBytes)),null,2)+'\n');
 if(!Buffer.from(beforeBytes).equals(reversed))throw Error('Not solely the reviewed internal release identity change: full original bytes differ');
 return {originalSha256:sha(beforeBytes),candidateSha256:sha(candidateBytes),reversedSha256:sha(reversed),originalBytes:beforeBytes.length,candidateBytes:candidateBytes.length,exactOriginalByteEquality:true};
}
export function collectProof(root=process.cwd()){
 return {schemaVersion:1,kind:'desktop-release-provenance',from:BASELINE,to:CANDIDATE,allowedInternalPackages:packages,checker:'tooling/api-signatures.mjs (unchanged; no normalization)',snapshots:['windows','macos'].map(lane=>{const original=history+'/api-signatures-'+lane+'-rc2.json',candidate='docs/api-signatures-'+lane+'.json';return {lane,original,candidate,...proveIdentityOnly(readFileSync(resolve(root,original)),readFileSync(resolve(root,candidate)))};})};
}
if(isMainModule(import.meta.url)){
 const proof=collectProof();
 if(process.argv[2]==='--write')writeFileSync(history+'/proof.json',JSON.stringify(proof,null,2)+'\n');
 else if(process.argv.length>2)throw Error('Usage: node tooling/desktop-provenance.mjs [--write]');
 console.log(JSON.stringify(proof,null,2));
}
