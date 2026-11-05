import type {ChordRecorder} from "@nyc-tron/ui/components/shell/shortcut-model";
import type {Subscription} from "./key-source.ts";
import type {HardwareKeyChord} from "./payload.ts";
import {useKeySource,type UseHardwareKeyboardOptions} from "./useHardwareKeyboard.ts";
import {webKeySource} from "./web-source.ts";

/**
 * Runs the {@linkcode UseHardwareKeyboardOptions.map} command for each
 * hardware keydown: document keydown on web, the native module on iOS and
 * Android. Mount it once near the root and pass the active scopes down.
 */
export function useHardwareKeyboard(options:UseHardwareKeyboardOptions):void{
  useKeySource(webKeySource,options);
}

/** Web always has hardware key events when a document exists. */
export function isHardwareKeysAvailable():boolean{
  return typeof (globalThis as {document?:unknown}).document!=="undefined";
}

/** Undefined on web: KeyboardShortcutHUD records from the browser itself. */
export function getHardwareKeyRecorder():ChordRecorder|undefined{
  return undefined;
}

/** Every document keydown as a chord. */
export function addHardwareKeyListener(listener:(chord:HardwareKeyChord)=>void):Subscription{
  return webKeySource.addChordListener(chord=>{listener({...chord,ctrlKey:!!chord.ctrlKey,metaKey:!!chord.metaKey,
    altKey:!!chord.altKey,shiftKey:!!chord.shiftKey,isRepeat:false,recording:false});return false;});
}
