import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const json=p=>JSON.parse(readFileSync(p,'utf8'));
const packages=readdirSync('packages',{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>`packages/${e.name}/package.json`).filter(p=>{try{json(p);return true}catch{return false}});
const desktop=['packages/windows-fluent/rnw-fabric/package.json','packages/macos-appkit/spark/package.json'];packages.push(...desktop);
const names=new Set(packages.map(p=>json(p).name));
assert.equal(packages.length,16);
for(const p of packages){const m=json(p);assert.equal(m.version,'1.0.0-rc.2');assert.equal(m.private,true);if(desktop.includes(p))for(const[n,v]of Object.entries(m.peerDependencies??{}))if(names.has(n))assert.equal(v,'1.0.0-rc.2');console.log(`${m.name} ${m.version} private=${m.private}`)}
assert.equal(json('package.json').version,'0.1.0');
for(const p of ['examples/macos-appkit/spark/package.json','packages/windows-fluent/rnw-fabric/example/package.json'])for(const[n,v]of Object.entries(json(p).dependencies))if(names.has(n))assert.match(v,/1\.0\.0-rc\.2\.tgz$/);
for(const p of ['docs/api-signatures-macos.json','docs/api-signatures-windows.json'])assert.equal(readFileSync(p,'utf8'),execFileSync('git',['show',`3fc325d:${p}`],{encoding:'utf8'}).replaceAll('1.0.0-rc.1','1.0.0-rc.2'));
for(const p of ['pnpm-lock.yaml','packages/ui/tests/browser/package-lock.json','packages/expo-controls/tests/browser/package-lock.json'])assert.equal(readFileSync(p,'utf8'),execFileSync('git',['show',`3fc325d:${p}`],{encoding:'utf8'}));
console.log('PASS:16 archive versions, exact desktop peer/example pins, root tooling version, metadata-only API identity edits, unchanged three tracked locks');
