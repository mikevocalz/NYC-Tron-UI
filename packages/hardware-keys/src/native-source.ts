// iOS / Android key source over the NYCTronHardwareKeys Expo module.
//
// Android: SDK 58 exposes @ExpoModule objects on globalThis.expoV2.modules.
// Apple: the Swift @ExpoModule is reachable through requireOptionalNativeModule.
// No module linked -> no source, never a throw.
import {requireOptionalNativeModule} from "expo";
import {TextInput} from "react-native";
import type {ChordRecorder} from "@nyc-tron/ui/components/shell/shortcut-model";
import type {NativeKeyBinding} from "@nyc-tron/ui/components/shell/keyboard-map";
import {createBindingRegistry} from "./binding-registry.ts";
import type {KeySource,Subscription} from "./key-source.ts";
import {NATIVE_MODULE_NAME,toChord,type HardwareKeyChord} from "./payload.ts";

interface HardwareKeysNative {
  isSupported():boolean;
  setBindings(bindings:readonly NativeKeyBinding[]):Promise<void>|void;
  setRecording(active:boolean):Promise<void>|void;
  addListener(eventName:"chord",listener:(payload:unknown)=>void):Subscription;
}
interface ExpoModulesV2Global {
  expoV2?:{modules?:Record<string,HardwareKeysNative|undefined>};
}

const legacyNative=requireOptionalNativeModule<HardwareKeysNative>(NATIVE_MODULE_NAME);

function nativeModule():HardwareKeysNative|null{
  const v2=(globalThis as typeof globalThis&ExpoModulesV2Global).expoV2?.modules?.[NATIVE_MODULE_NAME];
  return v2??legacyNative??null;
}

/**
 * True when this binary links the native module and the OS can deliver
 * hardware keys to it (Android 9 and later; every supported iOS).
 */
export function isHardwareKeysAvailable():boolean{
  const native=nativeModule();
  if(!native)return false;
  try{return native.isSupported();}catch{return false;}
}

// A failed push leaves the previous bindings in place; the next change retries.
const ignore=()=>undefined;
let registry:ReturnType<typeof createBindingRegistry>|undefined;
function bindings(native:HardwareKeysNative){
  if(!registry)registry=createBindingRegistry(list=>{Promise.resolve(native.setBindings(list)).catch(ignore);});
  return registry;
}

/** Every chord the module delivers, registered bindings and recordings alike. */
export function addHardwareKeyListener(listener:(chord:HardwareKeyChord)=>void):Subscription{
  const native=nativeModule();
  if(!native)return {remove(){}};
  return native.addListener("chord",payload=>{const chord=toChord(payload);if(chord)listener(chord);});
}

let recordings=0;
/**
 * The recorder KeyboardShortcutHUD takes as `recorder` on iOS and Android,
 * or undefined when hardware keys are unavailable (the HUD then stays
 * read-only on native).
 */
export function getHardwareKeyRecorder():ChordRecorder|undefined{
  const native=nativeModule();
  if(!native||!isHardwareKeysAvailable())return undefined;
  return {
    startRecording(onChord){
      const sub=addHardwareKeyListener(chord=>{if(chord.recording)onChord(chord);});
      recordings+=1;
      if(recordings===1)Promise.resolve(native.setRecording(true)).catch(ignore);
      let live=true;
      return {remove(){
        if(!live)return;
        live=false;
        sub.remove();
        recordings-=1;
        if(recordings===0)Promise.resolve(native.setRecording(false)).catch(ignore);
      }};
    },
  };
}

let source:KeySource|undefined;
/**
 * The module as a {@linkcode KeySource}, or undefined when it is not linked.
 * One instance per JS runtime, so a hook's effect does not resubscribe on
 * every render.
 */
export function nativeKeySource():KeySource|undefined{
  if(source)return source;
  const native=nativeModule();
  if(!native||!isHardwareKeysAvailable())return undefined;
  source={
    // Recording chords belong to the recorder, never to command dispatch.
    addChordListener:listener=>addHardwareKeyListener(chord=>{if(!chord.recording)listener(chord);}),
    registerBindings:list=>bindings(native).register(list),
    isTextInputFocused:()=>TextInput.State?.currentlyFocusedInput?.()!=null,
  };
  return source;
}
