/**
 * Keyboard helpers shared by the studio shell controls. React Native Web
 * delivers a browser KeyboardEvent as `nativeEvent`; desktop hosts can
 * deliver the same fields. Hosts without key events use the native
 * screen-reader actions alongside these rules.
 *
 * Horizontal arrows follow reading direction: in RTL, ArrowLeft moves to the
 * next item. Vertical arrows never flip.
 */
export interface ShellKey {
  readonly key:string;
  readonly altKey:boolean;
  readonly ctrlKey:boolean;
  readonly metaKey:boolean;
  readonly shiftKey:boolean;
  preventDefault():void;
  stopPropagation():void;
  readonly target:unknown;
}

/** Read the key data from an RN web or desktop keydown event. */
export function shellKey(event:unknown):ShellKey{
  const e=event as Record<string,unknown>&{nativeEvent?:Record<string,unknown>;preventDefault?:()=>void;stopPropagation?:()=>void;currentTarget?:unknown;target?:unknown};
  const n=e.nativeEvent??e;
  return {
    key:String(n.key??""),altKey:!!n.altKey,ctrlKey:!!n.ctrlKey,metaKey:!!n.metaKey,shiftKey:!!n.shiftKey,
    preventDefault:()=>e.preventDefault?.(),stopPropagation:()=>e.stopPropagation?.(),
    target:e.currentTarget??e.target,
  };
}

/** Orientation of a list of focus stops. */
export type ShellAxis="horizontal"|"vertical";

/** +1/-1 for an arrow that moves along `axis`, or null for any other key. */
export function arrowStep(key:string,axis:ShellAxis,rtl:boolean):1|-1|null{
  if(axis==="horizontal"){
    if(key==="ArrowRight")return rtl?-1:1;
    if(key==="ArrowLeft")return rtl?1:-1;
    return null;
  }
  if(key==="ArrowDown")return 1;
  if(key==="ArrowUp")return -1;
  return null;
}

/**
 * Roving focus target for arrows (wrapping), Home and End over the enabled
 * entries of `disabled`. `current` -1 enters at the first or last stop.
 * Returns null for any other key or when every entry is disabled.
 */
export function rovingTarget(current:number,key:string,disabled:readonly boolean[],axis:ShellAxis,rtl:boolean):number|null{
  const enabled=disabled.flatMap((off,i)=>off?[]:[i]);
  if(!enabled.length)return null;
  if(key==="Home")return enabled[0]!;
  if(key==="End")return enabled[enabled.length-1]!;
  const step=arrowStep(key,axis,rtl);
  if(step===null)return null;
  const at=enabled.indexOf(current);
  if(at<0)return step===1?enabled[0]!:enabled[enabled.length-1]!;
  return enabled[(at+step+enabled.length)%enabled.length]!;
}

/** True when a DOM node on RN web lays out right to left. Native callers use I18nManager. */
export function nodeIsRTL(node:unknown):boolean{
  const view=globalThis as {getComputedStyle?:(n:unknown)=>{direction?:string}};
  if(!node||typeof view.getComputedStyle!=="function")return false;
  try{return view.getComputedStyle(node).direction==="rtl";}catch{return false;}
}
