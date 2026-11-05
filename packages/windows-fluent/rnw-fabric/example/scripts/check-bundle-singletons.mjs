// Fails when the Release bundle carries more than one copy of React or
// react-native-windows. Two copies leave the native window blank because the
// library's components register with a renderer that never mounts.
import {readFileSync} from "node:fs";
const mapPath=process.argv[2];
if(!mapPath)throw new Error("usage: check-bundle-singletons.mjs <packager source map>");
const sources=JSON.parse(readFileSync(mapPath,"utf8")).sources.map(s=>s.replace(/\\/g,"/"));
const copies=entry=>[...new Set(sources.filter(s=>s.endsWith(entry)))];
let failed=false;
for(const entry of ["/node_modules/react/index.js","/node_modules/react-native-windows/index.windows.js"]){
 const found=copies(entry);
 console.log(`${entry}: ${found.length} cop${found.length===1?"y":"ies"}`);
 for(const path of found)console.log("  "+path);
 if(found.length!==1)failed=true;
}
if(failed)throw new Error("Bundle must contain exactly one React and one react-native-windows");
