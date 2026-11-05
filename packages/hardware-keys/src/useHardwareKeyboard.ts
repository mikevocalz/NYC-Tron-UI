import {useEffect,useRef} from "react";
import type {KeyChord} from "@nyc-tron/ui/components/shell/shortcut-model";
import type {KeyboardMap,KeyboardMapEntry} from "@nyc-tron/ui/components/shell/keyboard-map";
import type {KeySource} from "./key-source.ts";

/** Options for {@linkcode useHardwareKeyboard}. */
export interface UseHardwareKeyboardOptions {
  /** The commands and bindings, from `createKeyboardMap` in `@nyc-tron/ui/components/shell/keyboard-map`. */
  map:KeyboardMap;
  /** Runs the command a keydown resolved to. */
  onCommand:(entry:KeyboardMapEntry,chord:KeyChord)=>void;
  /** Active scopes, innermost first; `"global"` is implied. */
  activeScopes?:readonly string[];
  /** Pause dispatch, e.g. while a sheet that owns the keyboard is open. @default true */
  enabled?:boolean;
}

/**
 * Dispatches hardware keys to `onCommand` through `source`. Callers use the
 * platform hook exported from the package root, which binds the source.
 */
export function useKeySource(source:KeySource|undefined,options:UseHardwareKeyboardOptions):void{
  const {map,enabled=true}=options;
  // Latest callback and scopes without re-subscribing on every render.
  const latest=useRef(options);
  latest.current=options;
  useEffect(()=>{
    if(!source||!enabled)return;
    const registration=source.registerBindings(map.nativeBindings());
    const listener=source.addChordListener(chord=>{
      const {onCommand,activeScopes}=latest.current;
      const entry=map.resolve(chord,{activeScopes,textInputFocused:source.isTextInputFocused()});
      if(!entry)return false;
      onCommand(entry,chord);
      return true;
    });
    return ()=>{listener.remove();registration.remove();};
  },[source,map,enabled]);
}
