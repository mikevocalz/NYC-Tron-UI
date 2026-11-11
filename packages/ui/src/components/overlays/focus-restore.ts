import {useEffect,useRef} from 'react';
import {Platform} from 'react-native';
type Focusable={focus:()=>void;getClientRects?:()=>{length:number}};
type FocusDocument={activeElement:unknown;body?:unknown;documentElement?:unknown;contains:(node:unknown)=>boolean};
/** Restore the web opener after close or conditional unmount without replacing a newer focus choice. */
export function useRestoreFocus(open:boolean):void {
 const saved=useRef<Focusable|null>(null),wasOpen=useRef(false),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 // Capture before child autoFocus/onShow moves focus into the overlay.
 if(open&&!wasOpen.current&&Platform.OS==='web'){
  const active=(globalThis as {document?:FocusDocument}).document?.activeElement as Partial<Focusable>|null|undefined;
  saved.current=active&&typeof active.focus==='function'?active as Focusable:null;
 }
 wasOpen.current=open;
 const restore=()=>{
  if(Platform.OS!=='web')return;
  const target=saved.current;saved.current=null;if(!target)return;
  if(timer.current!==null)clearTimeout(timer.current);
  timer.current=setTimeout(()=>{
   timer.current=null;const doc=(globalThis as {document?:FocusDocument}).document;if(!doc||!doc.contains(target))return;
   const active=doc.activeElement as Focusable|null|undefined;
   const vacant=!active||active===doc.body||active===doc.documentElement||!doc.contains(active)||active.getClientRects?.().length===0;
   if(vacant)target.focus();
  },0);
 };
 useEffect(()=>{if(open){if(timer.current!==null){clearTimeout(timer.current);timer.current=null;}}else restore();},[open]);
 useEffect(()=>{if(wasOpen.current&&timer.current!==null){clearTimeout(timer.current);timer.current=null;}return restore;},[]);
}
