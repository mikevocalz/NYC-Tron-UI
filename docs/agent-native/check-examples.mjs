// Extracts every ```tsx example=<name> block from the given markdown files into a temp dir and type-checks it.
// Usage: node docs/agent-native/check-examples.mjs <out-dir> <tsc-path> <node_modules-dir> <md>...
// <node_modules-dir> must hold react, @types/react and react-native (0.88 types_generated). Nothing is installed by this script.
import fs from "node:fs";import path from "node:path";import {spawnSync} from "node:child_process";
const [out,tsc,nm,...mds]=process.argv.slice(2);const repo=process.cwd();
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out+"/examples",{recursive:true});
let n=0;const names=new Set();
for(const md of mds){for(const m of fs.readFileSync(md,"utf8").matchAll(/^```tsx example=(\S+)\n([\s\S]*?)^```/gm)){
 if(names.has(m[1])){console.error("duplicate example name",m[1]);process.exit(2)}names.add(m[1]);fs.writeFileSync(`${out}/examples/${m[1]}.tsx`,m[2]);n++;}}
fs.symlinkSync(nm,out+"/node_modules");
const R=p=>path.join(repo,p);
fs.writeFileSync(out+"/tsconfig.json",JSON.stringify({extends:R("tsconfig.base.json"),compilerOptions:{ignoreDeprecations:"6.0",baseUrl:".",jsxImportSource:"react",types:[],noEmit:true,paths:{
 "@nyc-tron/ui":[R("packages/ui/src/index.ts")],"@nyc-tron/ui/components/*":[R("packages/ui/src/components/*")],
 "@nyc-tron/core":[R("packages/core/src/index.ts")],"@nyc-tron/core/*":[R("packages/core/src/*")],
 "@nyc-tron/icons":[R("packages/icons/src/index.ts")],"@nyc-tron/icons/*":[R("packages/icons/src/*")],
 "react-native":["./node_modules/react-native/types_generated/index.d.ts"],"react":["./node_modules/@types/react"],"react/*":["./node_modules/@types/react/*"],"*":["./node_modules/*","./node_modules/@types/*"]}},include:["examples/**/*.tsx"]},null,1));
const r=spawnSync("node",[tsc,"-p",out+"/tsconfig.json"],{encoding:"utf8"});
const errs=(r.stdout+r.stderr).split("\n").filter(l=>l.startsWith("examples/"));
console.log(`${n} examples, ${errs.length} errors in examples`);console.log(errs.join("\n"));process.exit(errs.length?1:0);
