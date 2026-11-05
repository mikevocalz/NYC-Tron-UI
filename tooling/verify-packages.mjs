import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

// Every workspace package under packages/ is a release artifact. Discover them
// instead of listing names so a newly merged package cannot skip these rules.
const packagesRoot=resolve("packages");
const packages=readdirSync(packagesRoot,{withFileTypes:true})
  .filter(e=>e.isDirectory()&&existsSync(join(packagesRoot,e.name,"package.json")))
  .map(e=>e.name)
  .sort();
const failures=[];
const fail=message=>failures.push(message);

// Each export condition must name compiled output: types -> .d.ts, runtime -> .js.
const conditionExtension={types:".d.ts","react-native":".js",default:".js"};

const bareName=spec=>spec.startsWith("@")?spec.split("/").slice(0,2).join("/"):spec.split("/")[0];
const importSpecifiers=text=>[...text.matchAll(/(?:^|[\s;])(?:import|export)\s*(?:[^"';]*?\sfrom\s*)?["']([^"']+)["']/g)].map(m=>m[1]);

// Names exported by a compiled .js or .d.ts file, following `export * from`.
// Relative .ts/.tsx specifiers in declarations map to the sibling .d.ts.
function exportedNames(file,seen=new Set()){
  const names=new Set();
  if(seen.has(file)||!existsSync(file))return names;
  seen.add(file);
  const text=readFileSync(file,"utf8");
  for(const m of text.matchAll(/^export\s+(?:declare\s+)?(?:async\s+)?(?:function\*?|const|let|var|class|interface|type|enum|abstract\s+class)\s+([A-Za-z_$][\w$]*)/gm))names.add(m[1]);
  for(const m of text.matchAll(/^export\s+(?:type\s+)?\{([^}]*)\}/gm)){
    for(const part of m[1].split(",")){
      const name=part.trim().replace(/^type\s+/,"").split(/\s+as\s+/).pop()?.trim();
      if(name)names.add(name);
    }
  }
  for(const m of text.matchAll(/^export\s+\*\s+from\s+["'](\.[^"']+)["']/gm)){
    const base=resolve(dirname(file),m[1]);
    const candidates=file.endsWith(".d.ts")
      ?[base.replace(/\.(tsx?|jsx?)$/,".d.ts"),base+".d.ts"]
      :[base];
    for(const c of candidates)exportedNames(c,seen).forEach(n=>names.add(n));
  }
  return names;
}

let verified=0;
let scanned=0;
const peerReport=[];
for (const pkgName of packages) {
  const dir=join(packagesRoot,pkgName);
  const manifest=JSON.parse(readFileSync(join(dir,"package.json"),"utf8"));
  const id=manifest.name;
  if(manifest.private!==true)fail(id+": must stay private (release tarballs only, no npm publish)");
  if(!manifest.files?.includes("dist"))fail(id+": files must include dist");
  for(const field of ["main","types"]){
    if(manifest[field]&&!manifest[field].startsWith("./dist/"))fail(id+": "+field+" must point at ./dist, got "+manifest[field]);
  }
  if(!manifest.exports||typeof manifest.exports!=="object")fail(id+": missing exports map");
  for(const [key,value] of Object.entries(manifest.exports??{})) {
    if(!value||typeof value!=="object"){fail(id+": bad export "+key);continue;}
    for(const [condition,extension] of Object.entries(conditionExtension)){
      const target=value[condition];
      if(!target){fail(id+": export "+key+" is missing the "+condition+" condition");continue;}
      if(!target.startsWith("./dist/"))fail(id+": export "+key+" "+condition+" must point at ./dist, got "+target);
      if(!target.endsWith(extension))fail(id+": export "+key+" "+condition+" must end in "+extension+", got "+target);
      if(!existsSync(join(dir,target)))fail(id+": missing compiled "+target);
    }
    if(value.browser&&!existsSync(join(dir,value.browser)))fail(id+": missing compiled "+value.browser);
    verified++;
  }
  if(pkgName==="ui"&&
    (!manifest.exports["./components/forge/WaveformLane"]||
     !manifest.exports["./components/forge/NativeSeekBar"]||
     !manifest.exports["./components/forge/ColorChannels"]||
     !manifest.exports["./components/forge/audio/LevelFader"]||
     !manifest.exports["./components/forge/color/HsvPicker"])) {
    fail("Professional control subpaths must be addressable");
  }
  if(pkgName==="ui")for(const sub of ["data/TreeGrid","data/tree-grid","forge/SpreadsheetGrid","forge/sheet-window","forge/range-tsv","forge/formula-refs"]){
    if(!manifest.exports["./components/"+sub])fail("Missing data grid subpath "+sub);
  }
  const runtimeDeps={...manifest.dependencies,...manifest.optionalDependencies};
  for(const bad of ["@acme/theme","@nitro-forge/ignition","@nitro-forge/prism","@nitro-forge/cadence"]) {
    if(bad in runtimeDeps||bad in (manifest.peerDependencies??{}))fail(id+": forbidden UI dependency "+bad);
  }
  // A tarball installed by URL cannot resolve a sibling from the registry
  // (@nyc-tron/* is not on npm), so siblings must be peers the app installs.
  for(const dep of Object.keys(runtimeDeps)){
    if(dep.startsWith("@nyc-tron/"))fail(id+": "+dep+" must be a peerDependency, not a dependency");
  }

  // Import graph over compiled output.
  const distDir=join(dir,"dist");
  if(!existsSync(distDir)){fail(id+": dist was not built");continue;}
  const walk=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>
    e.isDirectory()?walk(join(d,e.name)):e.name.endsWith(".js")?[join(d,e.name)]:[]);
  const graph=new Map();
  for (const file of walk(distDir)) {
    const text=readFileSync(file,"utf8");
    const relative=[];const bare=new Set();
    for (const spec of importSpecifiers(text)) {
      if(spec.startsWith(".")){
        // Node ESM (SSR, Vitest, plain node) rejects extensionless relative
        // imports in "type": "module" packages even though Metro accepts them.
        if(!spec.endsWith(".js"))fail("Extensionless relative import "+spec+" in "+file);
        const target=resolve(dirname(file),spec);
        if(!existsSync(target))fail("Unresolved relative import "+spec+" in "+file);
        relative.push(target);
      }else bare.add(bareName(spec));
    }
    graph.set(file,{relative,bare});
    scanned++;
  }
  const declared=new Set([...Object.keys(runtimeDeps),...Object.keys(manifest.peerDependencies??{})]);
  const optionalPeers=new Set(Object.entries(manifest.peerDependenciesMeta??{})
    .filter(([,meta])=>meta?.optional).map(([name])=>name));
  for(const {bare} of graph.values())for(const name of bare){
    if(!declared.has(name))fail(id+": dist imports undeclared package "+name);
  }
  const reach=entry=>{
    const seen=new Set();const out=new Set();const stack=[entry];
    while(stack.length){
      const file=stack.pop();
      if(seen.has(file))continue;seen.add(file);
      const node=graph.get(file);if(!node)continue;
      node.bare.forEach(n=>out.add(n));
      stack.push(...node.relative);
    }
    return out;
  };
  for(const [key,value] of Object.entries(manifest.exports??{})){
    if(!value?.default)continue;
    const needs=[...reach(join(dir,value.default))].filter(n=>optionalPeers.has(n)).sort();
    // The package root must load with required peers only. Subpaths may need
    // an optional peer; importing that subpath is how the app opts in.
    if(key==="."&&needs.length)fail(id+": root export statically imports optional peer(s) "+needs.join(", "));
    if(needs.length)peerReport.push(id+(key==="."?"":key.slice(1))+" -> "+needs.join(", "));
    // The types condition must declare every value the runtime exports;
    // otherwise `import { X } from "<subpath>"` fails to typecheck.
    for(const condition of ["default","react-native"]){
      if(!value.types||!value[condition])continue;
      const declared=exportedNames(join(dir,value.types));
      const missing=[...exportedNames(join(dir,value[condition]))].filter(n=>!declared.has(n));
      if(missing.length)fail(id+": export "+key+" types ("+value.types+") does not declare "+missing.join(", ")+" exported by "+condition);
    }
  }
}
if(failures.length){
  console.error(failures.map(f=>"  - "+f).join("\n"));
  throw new Error(failures.length+" package rule violation(s)");
}
console.log("Packages: "+packages.join(", "));
console.log("Validated "+verified+" built conditional package exports and "+scanned+" ESM files.");
console.log("Subpaths that need an optional peer installed:\n"+peerReport.map(l=>"  "+l).join("\n"));
