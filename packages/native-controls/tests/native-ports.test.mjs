import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=path=>readFileSync(resolve(root,path),"utf8");

test("SDK58 autolinking registers identical custom controls on Apple and Android",()=>{
 const conf=JSON.parse(read("expo-module.config.json"));
 assert.deepEqual(conf.platforms,["apple","android"]);
 assert.deepEqual(conf.coreFeatures,["swiftui","compose"]);
 const swift=read("ios/NYCTronInstrumentsModule.swift");
 const android=read("android/src/main/java/com/nyctron/instruments/NYCTronInstrumentsModule.kt");
 for(const name of ["TronArcKnobView","TronXYPadView"]){
   assert.ok(swift.includes("ExpoUIView("+name+".self)"),name);
   assert.ok(android.includes('("'+name+'")'),name);
 }
 assert.match(swift,/Name\("NYCTronInstruments"\)/);
 assert.match(android,/Name\("NYCTronInstruments"\)/);
 assert.ok(existsSync(resolve(root,"ios/NYCTronInstruments.podspec")));
 assert.ok(existsSync(resolve(root,"android/build.gradle")));
});
test("all native views distinguish preview from final engine commit",()=>{
 for(const path of [
  "ios/TronArcKnobView.swift","ios/TronXYPadView.swift",
  "android/src/main/java/com/nyctron/instruments/TronArcKnobView.kt",
  "android/src/main/java/com/nyctron/instruments/TronXYPadView.kt"
 ]){
   const code=read(path);
   assert.match(code,/onPreview/);
   assert.match(code,/onCommit/);
   assert.doesNotMatch(code,/WebView/);
   if(path.endsWith(".swift"))assert.match(code,/\.onEnded/);
   else assert.match(code,/onDragEnd/);
 }
});
test("exports and original MIT source provenance are included",()=>{
 const pkg=JSON.parse(read("package.json"));
 for(const path of ["./ArcKnob","./XYPad"])assert.ok(pkg.exports[path],path);
 assert.match(read("THIRD_PARTY_NOTICES.md"),/717ce0d6d4e18f2849d484b578e0faf13bb38077/);
 assert.match(read("../../licenses/AudioKit-Controls-MIT.txt"),/Aurelius Prochazka/);
});
