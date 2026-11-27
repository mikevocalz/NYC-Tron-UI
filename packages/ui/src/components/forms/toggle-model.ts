/**
 * Pure rules shared by Switch, Checkbox and RadioGroup, kept out of the
 * components so they are unit tested without a renderer.
 */
import { rovingStop } from "./choice-keys.ts";

/** Checkbox value. `"indeterminate"` is shown as a dash and announced as mixed. */
export type CheckedState=boolean|"indeterminate";

/** Value after a press: indeterminate and unchecked become checked, checked becomes unchecked. */
export function nextCheckedState(state:CheckedState):boolean{
  return state!==true;
}

/** The `accessibilityState.checked` / `aria-checked` value for a checkbox state. */
export function a11yChecked(state:CheckedState):boolean|"mixed"{
  return state==="indeterminate"?"mixed":state;
}

/**
 * Spoken value for a checkbox on hosts that take the state as words (the
 * iOS fork's accessibilityValue, Android's mixed-state description).
 */
export function checkedValueText(state:CheckedState):string{
  return state==="indeterminate"?"Partially checked":state?"Checked":"Not checked";
}

/** SF Symbol that draws a checkbox state on iOS. */
export function checkboxSymbol(state:CheckedState):"checkmark.square.fill"|"minus.square.fill"|"square"{
  return state==="indeterminate"?"minus.square.fill":state?"checkmark.square.fill":"square";
}

/** SF Symbol that draws a radio item on iOS. */
export function radioSymbol(checked:boolean):"largecircle.fill.circle"|"circle"{
  return checked?"largecircle.fill.circle":"circle";
}

/** Material 3 `TriStateCheckbox` state for a checkbox value. */
export function toggleableState(state:CheckedState):"on"|"off"|"indeterminate"{
  return state==="indeterminate"?"indeterminate":state?"on":"off";
}

export type SwitchSize="sm"|"md";
/** Track and thumb geometry in points. `offStart`/`onStart` are the thumb's start margin. */
export interface SwitchGeometry{
  readonly trackWidth:number;readonly trackHeight:number;readonly trackBorder:number;
  readonly thumb:number;readonly offStart:number;readonly onStart:number;
}
const TRACKS:Record<SwitchSize,{w:number;h:number}>={sm:{w:36,h:20},md:{w:48,h:28}};
const TRACK_BORDER=2,THUMB_GAP=2;

/**
 * Geometry for a switch size. The thumb sits `THUMB_GAP` inside the track's
 * border at both ends, so it travels the same distance in LTR and RTL; the
 * caller applies `offStart`/`onStart` as `marginStart`, which RTL mirrors.
 */
export function switchGeometry(size:SwitchSize):SwitchGeometry{
  const t=TRACKS[size];
  if(!t)throw new RangeError(`Unknown switch size ${String(size)}`);
  const innerW=t.w-2*TRACK_BORDER,innerH=t.h-2*TRACK_BORDER;
  const thumb=innerH-2*THUMB_GAP;
  return {trackWidth:t.w,trackHeight:t.h,trackBorder:TRACK_BORDER,thumb,
    offStart:THUMB_GAP,onStart:innerW-thumb-THUMB_GAP};
}

/** Validates an app-supplied animation length (0 to 1000 ms). */
export function validateDuration(ms:number):number{
  if(!Number.isFinite(ms)||ms<0||ms>1000)throw new RangeError("Switch animation must be 0 to 1000 ms");
  return ms;
}

export type ToggleKind="switch"|"checkbox"|"radio";
/**
 * What a web keydown does on a toggle (WAI-ARIA APG): Space activates every
 * kind; Enter also activates a switch. A held key's repeats are swallowed so
 * one press toggles once. `null` lets the event through (Tab, Enter on a
 * checkbox so a form can still submit).
 */
export function toggleKeyAction(key:string,kind:ToggleKind,repeat=false):"activate"|"swallow"|null{
  const space=key===" "||key==="Spacebar";
  if(!space&&!(kind==="switch"&&key==="Enter"))return null;
  return repeat?"swallow":"activate";
}

/** Whether a web keydown is an auto-repeat of a held key. */
export function keyRepeat(event:unknown):boolean{
  const e=event as {repeat?:unknown;nativeEvent?:{repeat?:unknown}}|undefined;
  return Boolean(e?.nativeEvent?.repeat??e?.repeat);
}

/**
 * Throws when a toggle has no accessible name. A visible `label` is the
 * default; `accessibilityLabel` alone is for a control whose name is
 * already printed next to it. Returns the name a screen reader gets:
 * `accessibilityLabel` when given, otherwise `label`.
 */
export function requireName(component:string,label:string|undefined,accessibilityLabel:string|undefined):string{
  const name=accessibilityLabel?.trim()?accessibilityLabel:label?.trim()?label:"";
  if(!name)throw new TypeError(`${component} needs a label or an accessibilityLabel`);
  return name;
}

/**
 * True when a press came from a key. React Native Web fires `onPress` on the
 * Enter/Space keyup; the key handler already acted, so the press is ignored.
 */
export function isKeyboardPress(event:unknown):boolean{
  const e=event as {type?:unknown;nativeEvent?:{type?:unknown}}|undefined;
  return String(e?.nativeEvent?.type??e?.type??"").startsWith("key");
}

/** A radio registered with its group. `node` is the host element (a DOM node on web). */
export interface RadioEntry{readonly value:string;readonly disabled:boolean;readonly node?:unknown}
type DomNode={compareDocumentPosition?:(other:unknown)=>number};
const FOLLOWING=4;

/**
 * Radios in screen order. On web the DOM decides, so reordered children keep
 * arrow keys in visual order; without DOM nodes registration order stands.
 */
export function documentOrder<T extends RadioEntry>(entries:readonly T[]):T[]{
  const indexed=entries.map((e,i)=>({e,i}));
  indexed.sort((a,b)=>{
    const an=a.e.node as DomNode|undefined,bn=b.e.node;
    if(an&&bn&&typeof an.compareDocumentPosition==="function"&&an!==bn){
      return (an.compareDocumentPosition(bn)&FOLLOWING)?-1:1;
    }
    return a.i-b.i;
  });
  return indexed.map(x=>x.e);
}

/**
 * Value of the radio that holds the group's single Tab stop: the checked
 * radio when it is enabled, otherwise the first enabled one; null when all
 * are disabled.
 */
export function radioTabStop(entries:readonly RadioEntry[],selected:string):string|null{
  const i=rovingStop(entries.findIndex(e=>e.value===selected),entries.map(e=>e.disabled));
  return i>=0?entries[i]!.value:null;
}
