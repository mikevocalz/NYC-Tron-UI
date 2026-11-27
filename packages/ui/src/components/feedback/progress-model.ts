// Behaviour adapted from NYC-MON packages/ui/progress/progress-model.ts (MIT).

/**
 * Pure logic for Spinner and ProgressBar. No React or React Native import, so
 * node:test runs it directly.
 */

/** Throws a RangeError unless `min` and `max` are finite and `min < max`. */
export function assertProgressRange(min:number,max:number):void{
  if(!Number.isFinite(min)||!Number.isFinite(max))throw new RangeError("Progress min and max must be finite numbers");
  if(min>=max)throw new RangeError("Progress min must be less than max");
}

/**
 * Throws a RangeError for a value that is present but not finite. `undefined`
 * is allowed: it means the end is not known yet.
 */
export function assertProgressValue(value:number|undefined):void{
  if(value!==undefined&&!Number.isFinite(value))throw new RangeError("Progress value must be a finite number");
}

/** `(value - min) / (max - min)`, clamped to 0..1. `undefined` reads as 0. Validates the range. */
export function progressFraction(value:number|undefined,min=0,max=100):number{
  assertProgressRange(min,max);
  assertProgressValue(value);
  if(value===undefined)return 0;
  return Math.min(1,Math.max(0,(value-min)/(max-min)));
}

/** No value, or an explicit flag, means the work has no known end yet. */
export function isIndeterminate(value:number|undefined,indeterminate?:boolean):boolean{
  return indeterminate===true||value===undefined;
}

/** Whole percent for a visible or spoken label, e.g. `"46%"`. */
export function percentLabel(fraction:number):string{
  return `${Math.round(Math.min(1,Math.max(0,fraction))*100)}%`;
}

/** Context passed to a `valueText` formatter. */
export interface ProgressValueContext {
  readonly min:number;
  readonly max:number;
  /** 0..1 after clamping. */
  readonly fraction:number;
}

export interface ProgressA11yInput {
  value?:number;
  min?:number;
  max?:number;
  indeterminate?:boolean;
  /** What is in progress, e.g. "Uploading photos". */
  label?:string;
  /** Spoken value for a known value, e.g. `(v,{max})=>`${v} of ${max} files``. Defaults to a whole percent. */
  valueText?:(value:number,context:ProgressValueContext)=>string;
  /** Spoken value while indeterminate. @default "Loading" */
  busyText?:string;
}

export interface ProgressA11y {
  readonly accessibilityLabel:string|undefined;
  readonly accessibilityState:{readonly busy:boolean};
  readonly accessibilityValue:{readonly min:number;readonly max:number;readonly now?:number;readonly text:string};
  readonly busy:boolean;
  readonly fraction:number;
}

/**
 * Accessibility values for a progress root. Indeterminate progress leaves out
 * `now`, which is how screen readers know there is no value to announce, and
 * sets `busy`. A value outside the range is clamped to it. Throws a
 * RangeError for an invalid range or a non-finite value.
 */
export function progressA11y({value,min=0,max=100,indeterminate,label,valueText,busyText="Loading"}:ProgressA11yInput):ProgressA11y{
  const fraction=progressFraction(value,min,max);
  const busy=isIndeterminate(value,indeterminate);
  if(busy)return {accessibilityLabel:label,accessibilityState:{busy:true},accessibilityValue:{min,max,text:busyText},busy,fraction:0};
  const now=Math.round((min+fraction*(max-min))*100)/100;
  const text=valueText?valueText(now,{min,max,fraction}):percentLabel(fraction);
  return {accessibilityLabel:label,accessibilityState:{busy:false},accessibilityValue:{min,max,now,text},busy,fraction};
}

/**
 * How many of `count` discrete pieces are lit. Any progress above zero lights
 * at least one, so a started task never looks untouched, and the last piece
 * only lights at 100%, so a nearly done task never looks done.
 */
export function litCount(fraction:number,count:number):number{
  if(count<=0||fraction<=0)return 0;
  if(fraction>=1)return count;
  return Math.min(count-1,Math.max(1,Math.floor(fraction*count)));
}

/** Fill of each of `count` segments from the start edge: full, then one partial, then empty. */
export function blockFills(fraction:number,count:number):number[]{
  const f=Math.min(1,Math.max(0,fraction))*count;
  return Array.from({length:Math.max(0,count)},(_,i)=>Math.min(1,Math.max(0,f-i)));
}

/** Round a 0..1 fill down to whole steps. */
export function quantize(fraction:number,steps:number):number{
  if(steps<=0)return fraction;
  return Math.floor(Math.min(1,Math.max(0,fraction))*steps+1e-9)/steps;
}

/** Clamp an integer prop into its documented range. */
export function clampInt(value:number|undefined,min:number,max:number,fallback:number):number{
  if(value===undefined||!Number.isFinite(value))return fallback;
  return Math.min(max,Math.max(min,Math.round(value)));
}

/**
 * A system accessibility setting (reduce motion, screen reader) as an
 * external store for `useSyncExternalStore`. The platform is read and
 * listened to only while something subscribes. `read` may return a promise;
 * `listen` returns a subscription with `remove()`. Errors from either leave
 * the flag false.
 */
export interface SystemFlag {
  get():boolean;
  subscribe(listener:()=>void):()=>void;
}

export function createSystemFlag(
  read:()=>Promise<boolean>|boolean|undefined,
  listen:(receive:(value:boolean)=>void)=>{remove():void}|undefined,
):SystemFlag{
  let value=false,subscription:{remove():void}|null=null,active=false;
  const listeners=new Set<()=>void>();
  const set=(next:boolean)=>{
    next=!!next;
    if(next===value)return;
    value=next;
    for(const listener of [...listeners])listener();
  };
  return {
    get:()=>value,
    subscribe(listener){
      listeners.add(listener);
      if(!active){
        active=true;
        try{
          const result=read();
          if(result&&typeof (result as Promise<boolean>).then==="function")(result as Promise<boolean>).then(v=>{if(active)set(v);},()=>{});
          else if(result!==undefined)set(result as boolean);
        }catch{/* unsupported platform: stays false */}
        try{subscription=listen(set)??null;}catch{subscription=null;}
      }
      return ()=>{
        listeners.delete(listener);
        if(listeners.size===0&&active){active=false;subscription?.remove();subscription=null;}
      };
    },
  };
}
