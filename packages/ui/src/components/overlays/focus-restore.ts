import { useEffect, useRef } from "react";
import { Platform } from "react-native";

type Focusable={focus:()=>void};
type FocusDocument={activeElement:unknown;contains:(node:unknown)=>boolean};

/**
 * Web only: remembers the element that had focus when `open` became true
 * (normally the trigger) and returns focus to it when the overlay closes.
 * The restore runs after the current task so it lands after RN web's Modal
 * has unmounted its focus trap. Native platforms return focus themselves.
 */
export function useRestoreFocus(open:boolean):void{
  const saved=useRef<Focusable|null>(null);
  const wasOpen=useRef(false);
  // Read the opener during render, before any child (an autoFocus field, an
  // onShow handler) moves focus into the overlay.
  if(open&&!wasOpen.current&&Platform.OS==="web"){
    const active=(globalThis as {document?:FocusDocument}).document?.activeElement as Partial<Focusable>|null|undefined;
    saved.current=active&&typeof active.focus==="function"?active as Focusable:null;
  }
  wasOpen.current=open;
  useEffect(()=>{
    if(Platform.OS!=="web"||open)return;
    const doc=(globalThis as {document?:FocusDocument}).document;
    const target=saved.current;
    saved.current=null;
    if(!doc||!target)return;
    const timer=setTimeout(()=>{if(doc.contains(target))target.focus();},0);
    return ()=>clearTimeout(timer);
  },[open]);
}
