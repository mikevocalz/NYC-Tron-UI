import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const packages=["core","geometry","ui","icons"];
// Packages that publish hand-written ESM from src instead of a tsc dist.
const sourcePackages=new Set(["icons"]);
const outDir=pkgName=>sourcePackages.has(pkgName)?"src":"dist";
let verified=0;
for (const pkgName of packages) {
  const dir=resolve("packages",pkgName);
  const manifest=JSON.parse(readFileSync(join(dir,"package.json"),"utf8"));
  if(manifest.private!==true)throw new Error("Package must stay private until distribution review: "+pkgName);
  if(!manifest.files.includes(outDir(pkgName)))throw new Error("Missing "+outDir(pkgName)+" files declaration: "+pkgName);
  for(const [key,value] of Object.entries(manifest.exports)) {
    if(!value || typeof value!=="object")throw new Error("Bad export "+pkgName+":"+key);
    for(const condition of ["types","default","react-native","browser"]){
      if(!value[condition] && (condition==="react-native"||condition==="browser"))continue;
      if(!value[condition])throw new Error("Missing "+condition+" export "+key);
      if(!existsSync(join(dir,value[condition])))throw new Error("Missing compiled "+pkgName+":"+value[condition]);
      if(!value[condition].startsWith("./"+outDir(pkgName)+"/"))throw new Error("Export outside "+outDir(pkgName)+" "+pkgName+":"+value[condition]);
    }
    verified++;
  }
  if(pkgName==="ui" &&
    (!manifest.exports["./components/forge/WaveformLane"] ||
     !manifest.exports["./components/forge/NativeSeekBar"] ||
     !manifest.exports["./components/forge/ColorChannels"])) {
    throw new Error("Professional control subpaths must be addressable");
  }
  const dependencies={...manifest.dependencies,...manifest.optionalDependencies};
  for(const bad of ["@acme/theme","@nitro-forge/ignition","@nitro-forge/prism","@nitro-forge/cadence","@nitro-forge/icons"]) {
    if(bad in dependencies)throw new Error("Forbidden UI dependency "+bad);
  }
}
// Node ESM (SSR, Vitest, plain node) rejects extensionless relative imports in
// "type": "module" packages even though Metro accepts them.
let scanned=0;
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>
  e.isDirectory()?walk(join(dir,e.name)):e.name.endsWith(".js")?[join(dir,e.name)]:[]);
for (const pkgName of packages) {
  for (const file of walk(resolve("packages",pkgName,outDir(pkgName)))) {
    const text=readFileSync(file,"utf8");
    for (const m of text.matchAll(/(?:from|import)\s*["'](\.{1,2}\/[^"']+)["']/g)) {
      if(!m[1].endsWith(".js"))throw new Error("Extensionless relative import "+m[1]+" in "+file);
      if(!existsSync(resolve(dirname(file),m[1])))throw new Error("Unresolved relative import "+m[1]+" in "+file);
    }
    scanned++;
  }
}
console.log("Validated "+verified+" built conditional package exports and "+scanned+" ESM files.");
