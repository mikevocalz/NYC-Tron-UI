import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const packages=["core","geometry","ui","panes"];
let verified=0;
for (const pkgName of packages) {
  const dir=resolve("packages",pkgName);
  const manifest=JSON.parse(readFileSync(join(dir,"package.json"),"utf8"));
  if(manifest.private!==true)throw new Error("Package must stay private until distribution review: "+pkgName);
  if(!manifest.files.includes("dist"))throw new Error("Missing dist files declaration");
  for(const [key,value] of Object.entries(manifest.exports)) {
    if(!value || typeof value!=="object")throw new Error("Bad export "+pkgName+":"+key);
    for(const condition of ["types","default"]){
      if(!value[condition])throw new Error("Missing "+condition+" export "+key);
      if(!existsSync(join(dir,value[condition])))throw new Error("Missing compiled "+pkgName+":"+value[condition]);
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
  for(const bad of ["@acme/theme","@nitro-forge/ignition","@nitro-forge/prism","@nitro-forge/cadence"]) {
    if(bad in dependencies)throw new Error("Forbidden UI dependency "+bad);
  }
}
console.log("Validated "+verified+" built conditional package exports.");
