// Fails when the Release bundle carries more than one copy of React or
// react-native-windows, or any core react-native file. Two copies leave the native window blank because the
// library's components register with a renderer that never mounts.
// A copy is identified by its package root: any bundled file under
// ".../node_modules/<name>/" counts toward that root.
import {readFileSync} from "node:fs";
const mapPath=process.argv[2];
if(!mapPath)throw new Error("usage: check-bundle-singletons.mjs <packager source map>");
const sources=JSON.parse(readFileSync(mapPath,"utf8")).sources.map(s=>s.replace(/\\/g,"/"));
let failed=false;
for(const name of ["react","react-native-windows"]){
 const marker=`/node_modules/${name}/`;
 const roots=new Set();
 for(const source of sources){
  const at=source.lastIndexOf(marker);
  if(at>=0)roots.add(source.slice(0,at+marker.length));
 }
 console.log(`${name}: ${roots.size} cop${roots.size===1?"y":"ies"}`);
 for(const root of roots)console.log("  "+root);
 if(roots.size!==1)failed=true;
}
// The out-of-tree redirect sends react-native imports to react-native-windows;
// core react-native files in a Windows bundle mean that redirect was lost.
const core=sources.filter(source=>source.includes("/node_modules/react-native/"));
console.log(`react-native core files: ${core.length}`);
if(core.length>0)failed=true;
if(failed)throw new Error("Bundle must contain exactly one React, one react-native-windows and no core react-native files");
