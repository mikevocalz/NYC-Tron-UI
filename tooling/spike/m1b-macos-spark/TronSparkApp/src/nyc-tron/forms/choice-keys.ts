/**
 * Keyboard models shared by SegmentedControl, TabBar, Toolbar and Select.
 * Pure functions, so the rules are unit tested without a renderer.
 *
 * Horizontal arrows follow reading direction: in RTL, ArrowLeft moves to the
 * next item. Vertical arrows never flip.
 */
export type ChoiceAxis="horizontal"|"vertical"|"both";

/** Step for an arrow key, or null when the key does not move along `axis`. */
export function arrowStep(key:string,axis:ChoiceAxis,rtl:boolean):1|-1|null{
  const horizontal=axis!=="vertical",vertical=axis!=="horizontal";
  if(horizontal&&key==="ArrowRight")return rtl?-1:1;
  if(horizontal&&key==="ArrowLeft")return rtl?1:-1;
  if(vertical&&key==="ArrowDown")return 1;
  if(vertical&&key==="ArrowUp")return -1;
  return null;
}

/**
 * Next enabled index for a key in a single-select group (WAI-ARIA APG radio
 * group and tabs). Arrows wrap; Home/End jump to the first/last enabled item.
 * `current` -1 means nothing is selected. Returns null for any other key, or
 * when every item is disabled.
 */
export function nextChoiceIndex(
  current:number,key:string,disabled:readonly boolean[],
  {axis="horizontal",rtl=false,wrap=true}:{axis?:ChoiceAxis;rtl?:boolean;wrap?:boolean}={}
):number|null{
  const enabled=disabled.map((off,i)=>off?-1:i).filter(i=>i>=0);
  if(!enabled.length)return null;
  if(key==="Home")return enabled[0]!;
  if(key==="End")return enabled[enabled.length-1]!;
  const step=arrowStep(key,axis,rtl);
  if(step===null)return null;
  const pos=enabled.indexOf(current);
  if(pos<0)return step===1?enabled[0]!:enabled[enabled.length-1]!;
  const next=pos+step;
  if(wrap)return enabled[(next+enabled.length)%enabled.length]!;
  return enabled[Math.max(0,Math.min(enabled.length-1,next))]!;
}

/**
 * Roving tabindex: only the selected item is a Tab stop. With no selection
 * (or a disabled one) the first enabled item takes the stop.
 */
export function rovingStop(selected:number,disabled:readonly boolean[]):number{
  if(selected>=0&&selected<disabled.length&&!disabled[selected])return selected;
  return disabled.findIndex(off=>!off);
}

/** Typeahead: next enabled label after `from` that starts with `char`, wrapping. */
export function typeaheadIndex(
  labels:readonly string[],disabled:readonly boolean[],from:number,char:string
):number{
  if(char.length!==1||!/\S/.test(char))return -1;
  const ch=char.toLocaleLowerCase();
  for(let n=1;n<=labels.length;n++){
    const i=((from<0?-1:from)+n)%labels.length;
    if(!disabled[i]&&labels[i]!.toLocaleLowerCase().startsWith(ch))return i;
  }
  return -1;
}

/** Reading direction of a DOM node on RN web; native callers pass I18nManager.isRTL. */
export function domIsRTL(node:unknown):boolean{
  const view=globalThis as {getComputedStyle?:(n:unknown)=>{direction?:string}};
  if(!node||typeof view.getComputedStyle!=="function")return false;
  try{return view.getComputedStyle(node).direction==="rtl";}catch{return false;}
}

/** Key data of an RN web keydown; native never fires one. */
export type WebKey={key:string;altKey?:boolean;ctrlKey?:boolean;metaKey?:boolean;shiftKey?:boolean;
  preventDefault:()=>void;currentTarget:unknown};
export function webKey(event:unknown):WebKey{
  const e=event as {nativeEvent?:Partial<WebKey>;preventDefault:()=>void;currentTarget:unknown};
  const n=e.nativeEvent??{};
  return {key:String(n.key??""),altKey:n.altKey,ctrlKey:n.ctrlKey,metaKey:n.metaKey,shiftKey:n.shiftKey,
    preventDefault:()=>e.preventDefault(),currentTarget:e.currentTarget};
}
/** Modified arrows are browser/OS navigation, not selection. */
export const isModified=(k:WebKey)=>!!(k.altKey||k.ctrlKey||k.metaKey);
