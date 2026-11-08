// Source contracts for the three native modules. If a module name drifts, a
// platform drops out of autolinking, or the Swift side picks up ExpoUI again
// (#36), nothing fails at build time: the JS falls back to "not available"
// forever. These checks fail first.
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {dirname,join,resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {HAPTICS_MODULE_NAME,DOCUMENTS_MODULE_NAME,PLAYBACK_SESSION_MODULE_NAME,MEDIA_DECODER_MODULE_NAME,MEDIA_ENCODER_MODULE_NAME} from "../src/module-names.ts";
import {HAPTIC_KINDS} from "../src/haptics/kinds.ts";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=path=>readFileSync(join(root,path),"utf8");
const kt="android/src/main/java/com/nyctron/platformservices";
const config=JSON.parse(read("expo-module.config.json"));
const modules=[[HAPTICS_MODULE_NAME,"NYCTronHapticsModule"],[DOCUMENTS_MODULE_NAME,"NYCTronDocumentsModule"],
  [PLAYBACK_SESSION_MODULE_NAME,"NYCTronPlaybackSessionModule"],[MEDIA_DECODER_MODULE_NAME,"NYCTronMediaDecoderModule"],
  [MEDIA_ENCODER_MODULE_NAME,"NYCTronMediaEncoderModule"]];

test("SwiftPM preserves CocoaPods framework linkage and the established iOS floor",()=>{
  const pod=read("ios/NYCTronPlatformServices.podspec"),spm=read("Package.swift");
  const frameworks=pod.match(/s\.frameworks\s*=([^\n]+)/)[1].match(/'([^']+)'/g).map(s=>s.slice(1,-1));
  for(const framework of frameworks)assert.ok(spm.includes(`.linkedFramework("${framework}")`),framework);
  assert.match(spm,/\.iOS\("16\.4"\)/);
  assert.match(spm,/path: "ios"/);
  assert.ok(JSON.parse(read("package.json")).files.includes("Package.swift"),"release tarball must preserve the manifest");
});

test("expo-module.config.json autolinks both platforms; android stays off the legacy list",()=>{
  assert.deepEqual(config.platforms,["apple","android"]);
  assert.deepEqual(config.apple.modules,modules.map(m=>m[1]));
  assert.match(read("ios/NYCTronMediaDecoderModule.swift"),/@ExpoModule\("NYCTronMediaDecoder"\)/);
  assert.match(read("ios/NYCTronMediaEncoderModule.swift"),/@ExpoModule\("NYCTronMediaEncoder"\)/);
  assert.equal(config.android?.modules,undefined);
  assert.match(read("android/build.gradle"),/expoModule\s*\{[^}]*\bv2 true\b/);
});

test("each module registers the JS name on both platforms",()=>{
  for(const [name,cls] of modules){
    assert.match(read(`ios/${cls}.swift`),new RegExp(`@ExpoModule\\("${name}"\\)\\s*\\npublic final class ${cls}: Module`));
    assert.match(read(`${kt}/${cls}.kt`),new RegExp(`@ExpoModule\\("${name}"\\)\\s*\\nclass ${cls} : Module\\(\\)`));
  }
});

test("the JS-facing functions and events exist on both platforms",()=>{
  const expect={NYCTronHapticsModule:["play","prepare"],NYCTronDocumentsModule:["pick","restoreAccess","releaseAccess","share"],
    NYCTronPlaybackSessionModule:["activate","deactivate"],NYCTronMediaDecoderModule:["probe","decodeFrame","decodeAudio","clearCache"],
    NYCTronMediaEncoderModule:["probe","encode","clearCache"]};
  for(const [cls,fns] of Object.entries(expect))for(const fn of fns){
    assert.match(read(`ios/${cls}.swift`),new RegExp(`@JS[\\s\\S]*?func ${fn}\\(`),`${cls}.swift ${fn}`);
    assert.match(read(`${kt}/${cls}.kt`),new RegExp(`@JS\\s*\\n\\s*(suspend )?fun ${fn}\\(`),`${cls}.kt ${fn}`);
  }
  assert.match(read("ios/NYCTronPlaybackSessionModule.swift"),/@Event\("session"\)\s*\n\s*var onSession: \(SessionEventRecord\) -> Void/);
  assert.match(read(`${kt}/NYCTronPlaybackSessionModule.kt`),/@Event\("session"\)\s*\n\s*val onSession = event<SessionEventRecord>\(\)/);
});

test("every haptic kind maps on both platforms",()=>{
  const swift=read("ios/HapticFeedbackKind.swift"),kotlin=read(`${kt}/HapticConstant.kt`);
  for(const kind of HAPTIC_KINDS){
    const swiftCase=kind.includes("-")?`= "${kind}"`:`case ${kind}`;
    assert.ok(swift.includes(swiftCase),`Swift ${kind}`);
    assert.ok(kotlin.includes(`"${kind}"`),`Kotlin ${kind}`);
  }
});

test("session events JS understands are the ones both platforms emit",()=>{
  const ios=read("ios/Extensions/Notification+sessionEventRecord.swift");
  for(const t of ["interruption-began","interruption-ended","output-lost","media-services-reset"])assert.ok(ios.includes(`"${t}"`),t);
  const android=read(`${kt}/AudioFocusController.kt`)+read(`${kt}/OutputLossCallback.kt`);
  for(const t of ["focus-lost","focus-gained","output-lost"])assert.ok(android.includes(`"${t}"`),t);
  for(const r of ["headphones-unplugged","bluetooth-disconnected"]){
    assert.ok(ios.includes(`"${r}"`),r);assert.ok(android.includes(`"${r}"`),r);
  }
});

test("Android shares app files through the kit's own FileProvider with a per-app authority",()=>{
  const manifest=read("android/src/main/AndroidManifest.xml");
  assert.match(manifest,/android:name="com\.nyctron\.platformservices\.NYCTronFileProvider"/);
  assert.match(manifest,/android:authorities="\$\{applicationId\}\.nyctron\.files"/);
  assert.match(manifest,/android:exported="false"/);
  assert.match(read(`${kt}/ShareOptionsRecord+chooserIntent.kt`),/packageName \+ "\.nyctron\.files"/);
  assert.match(read("android/src/main/res/xml/nyctron_file_paths.xml"),/<cache-path/);
  assert.doesNotMatch(manifest,/uses-permission/,"no permission: haptics use performHapticFeedback, files use SAF");
});

test("no Swift file imports ExpoUI and the podspec does not depend on it",()=>{
  const files=[...readdirSync(join(root,"ios")).filter(f=>f.endsWith(".swift")).map(f=>"ios/"+f),
    ...readdirSync(join(root,"ios/Extensions")).map(f=>"ios/Extensions/"+f)];
  for(const f of files)assert.doesNotMatch(read(f),/import ExpoUI/,f);
  assert.doesNotMatch(read("ios/NYCTronPlatformServices.podspec"),/s\.dependency 'ExpoUI'/);
  assert.match(read("ios/NYCTronPlatformServices.podspec"),/s\.dependency 'ExpoModulesCore'/);
});
