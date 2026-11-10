// Packs every package under packages/ into one directory, checks each tarball,
// and writes SHA256SUMS. Used by .github/workflows/release.yml and by hand:
//
//   node tooling/pack-release.mjs <out-dir> [--expect-version 0.1.0]
//
// Run `pnpm -r build` first. The packages stay "private": these tarballs are
// GitHub Release assets installed by URL, never npm publishes.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";

const args=process.argv.slice(2);
const outDir=resolve(args[0]??"release-packs");
const expectIndex=args.indexOf("--expect-version");
const expectVersion=expectIndex>=0?args[expectIndex+1]:undefined;
if(expectIndex>=0&&!expectVersion)throw new Error("--expect-version needs a value");

const root=resolve(".");
const packagesRoot=join(root,"packages");
const packages=readdirSync(packagesRoot,{withFileTypes:true})
  .filter(e=>e.isDirectory()&&existsSync(join(packagesRoot,e.name,"package.json")))
  .map(e=>e.name)
  .sort();

rmSync(outDir,{recursive:true,force:true});
mkdirSync(outDir,{recursive:true});

const failures=[];
const fail=message=>failures.push(message);
const results=[];

for(const pkgName of packages){
  const dir=join(packagesRoot,pkgName);
  const manifest=JSON.parse(readFileSync(join(dir,"package.json"),"utf8"));
  const id=manifest.name;
  if(expectVersion&&manifest.version!==expectVersion){
    fail(id+": version "+manifest.version+" does not match release version "+expectVersion);
    continue;
  }

  // Packages without their own notices ship the repository-level provenance
  // file and the upstream MIT texts it cites. Staged only for the pack.
  const staged=[];
  if(!existsSync(join(dir,"THIRD_PARTY_NOTICES.md"))&&manifest.files.includes("THIRD_PARTY_NOTICES.md")){
    cpSync(join(root,"THIRD_PARTY_NOTICES.md"),join(dir,"THIRD_PARTY_NOTICES.md"));
    staged.push(join(dir,"THIRD_PARTY_NOTICES.md"));
  }
  if(!existsSync(join(dir,"licenses"))&&manifest.files.includes("licenses")){
    cpSync(join(root,"licenses"),join(dir,"licenses"),{recursive:true});
    staged.push(join(dir,"licenses"));
  }

  const expectInTarball=["package/package.json","package/LICENSE"];
  if(!existsSync(join(dir,"LICENSE")))fail(id+": LICENSE is missing");
  if(!manifest.files.includes("LICENSE"))fail(id+": files must list LICENSE");
  for(const name of ["README.md","THIRD_PARTY_NOTICES.md"]){
    if(existsSync(join(dir,name))||staged.includes(join(dir,name)))expectInTarball.push("package/"+name);
  }
  // Every THIRD_PARTY*.md file and third-party/ tree named in "files" must ship.
  const prefixesInTarball=[];
  for(const entry of manifest.files){
    if(/^THIRD_PARTY.*\.md$/.test(entry))expectInTarball.push("package/"+entry);
    if(entry.replace(/\/$/,"")==="third-party")prefixesInTarball.push("package/third-party/");
  }
  if(!existsSync(join(dir,"README.md")))fail(id+": README.md is missing");
  if(existsSync(join(dir,"licenses"))){
    for(const f of readdirSync(join(dir,"licenses")))expectInTarball.push("package/licenses/"+f);
  }

  let packed;
  try{
    // --json reports the produced filename; prepack rebuilds dist.
    // pnpm is pnpm.cmd on Windows, which execFileSync only runs through a shell.
    const json=execFileSync("pnpm",["pack","--json","--pack-destination",outDir],{cwd:dir,encoding:"utf8",stdio:["ignore","pipe","inherit"],shell:process.platform==="win32"});
    packed=JSON.parse(json.slice(json.indexOf("{")));
  }finally{
    for(const path of staged)rmSync(path,{recursive:true,force:true});
  }
  const tarball=isAbsolute(packed.filename)?packed.filename:join(outDir,packed.filename);
  const entries=new Set(execFileSync("tar",["-tzf",tarball],{encoding:"utf8"}).split(/\r?\n/).filter(Boolean));

  for(const path of expectInTarball){
    if(!entries.has(path))fail(id+": tarball is missing "+path);
  }
  for(const prefix of prefixesInTarball){
    if(![...entries].some(e=>e.startsWith(prefix)&&!e.endsWith("/")))fail(id+": tarball has no files under "+prefix);
  }
  if(![...entries].some(e=>e.startsWith("package/dist/")))fail(id+": tarball has no dist/");
  if([...entries].some(e=>e.startsWith("package/src/")))fail(id+": tarball ships src/; exports must not need it");

  // Check the manifest as packed: pnpm rewrites workspace: specifiers.
  const packedManifest=JSON.parse(execFileSync("tar",["-xzOf",tarball,"package/package.json"],{encoding:"utf8"}));
  const text=JSON.stringify(packedManifest);
  if(text.includes("workspace:"))fail(id+": packed package.json still contains a workspace: specifier");
  for(const field of ["main","types"]){
    const target=packedManifest[field];
    if(target&&!entries.has("package/"+target.replace(/^\.\//,"")))fail(id+": "+field+" target "+target+" is not in the tarball");
  }
  for(const [key,value] of Object.entries(packedManifest.exports??{})){
    for(const [condition,target] of Object.entries(value)){
      if(typeof target!=="string")continue;
      if(!target.startsWith("./dist/"))fail(id+": export "+key+" "+condition+" points outside dist: "+target);
      if(!entries.has("package/"+target.replace(/^\.\//,"")))fail(id+": export "+key+" "+condition+" target "+target+" is not in the tarball");
    }
  }

  const sha=createHash("sha256").update(readFileSync(tarball)).digest("hex");
  const file=tarball.slice(outDir.length+1);
  results.push({id,file,sha,entries:entries.size});
}

if(failures.length){
  console.error(failures.map(f=>"  - "+f).join("\n"));
  throw new Error(failures.length+" release tarball check(s) failed");
}
writeFileSync(join(outDir,"SHA256SUMS"),results.map(r=>r.sha+"  "+r.file).join("\n")+"\n");
for(const r of results)console.log(r.file+"  "+r.id+"  "+r.entries+" files  sha256 "+r.sha);
console.log("Wrote "+results.length+" tarballs and SHA256SUMS to "+outDir);
