/*
 * Behaviour adapted from NYC-MON packages/ui/Toast.tsx and
 * packages/ui/ToastCard.tsx (MIT), mikevocalz/nyc-mon commit
 * 5ed8cf8322c685c86dbe03f4ac7b801255d1b907. Copyright (c) 2025 Gursel Cakar,
 * MIT. Notices: THIRD_PARTY_NOTICES.md. Modified for NYC-Tron UI (2026-11):
 * pure queue, timing and validation rules split out for unit tests.
 */

/**
 * Toast queue as a plain external store, for `useSyncExternalStore`. No React
 * or React Native import, so node:test runs it with a fake clock.
 *
 * Rules:
 * - At most `maxVisible` toasts are shown, oldest first; the rest wait in
 *   arrival order and start their timer only once shown.
 * - Showing a toast with an id that is already present replaces it in place
 *   and restarts its timer, so repeated events do not stack.
 * - A toast with an action, or with the danger tone, stays until dismissed
 *   unless a duration is passed; an action toast's duration is never shorter
 *   than {@linkcode MIN_ACTION_TOAST_DURATION} (WCAG 2.2.1 Timing
 *   Adjustable: people need time to reach the action).
 * - Timers pause while any pause reason is held (pointer over the viewport,
 *   focus inside it, a screen reader running) and resume with the time that
 *   was left.
 */

export type ToastTone="info"|"success"|"danger"|"neutral";
/** `status` is a polite live region, `alert` an assertive one. */
export type ToastLive="status"|"alert";

export interface ToastAction {
  /** Verb first, e.g. "Undo". */
  readonly label:string;
  readonly onPress:()=>void;
}

export interface ToastOptions {
  /** Pass a stable id to replace a toast instead of stacking a new one. */
  readonly id?:string;
  /** @default "info" */
  readonly tone?:ToastTone;
  /** One sentence naming what happened. */
  readonly title:string;
  readonly description?:string;
  /** One action. More than one belongs in a dialog, not a toast. */
  readonly action?:ToastAction;
  /**
   * Milliseconds before the toast hides by itself; `Infinity` keeps it until
   * dismissed. Defaults to the store's `defaultDuration`, or `Infinity` for a
   * toast with an action or the danger tone.
   */
  readonly duration?:number;
  /** @default "alert" for the danger tone, otherwise "status" */
  readonly live?:ToastLive;
}

export interface ToastItem {
  readonly id:string;
  readonly tone:ToastTone;
  readonly title:string;
  readonly description?:string;
  readonly action?:ToastAction;
  /** Resolved milliseconds, or `Infinity`. */
  readonly duration:number;
  readonly live:ToastLive;
  /** Bumped each time the toast is replaced by id, so a view can re-announce it. */
  readonly revision:number;
}

export interface ToastSnapshot {
  /** Shown toasts, oldest first. */
  readonly visible:readonly ToastItem[];
  /** Toasts waiting for a free slot. */
  readonly queued:number;
  readonly paused:boolean;
}

/** Timer and clock, injectable for tests. */
export interface ToastScheduler {
  now():number;
  set(run:()=>void,ms:number):unknown;
  clear(handle:unknown):void;
}

export interface ToastStoreOptions {
  /** @default 3 */
  readonly maxVisible?:number;
  /** Waiting toasts kept beyond the visible ones; the oldest waiting toast is dropped past this. @default 50 */
  readonly maxQueued?:number;
  /** @default 5000 */
  readonly defaultDuration?:number;
  readonly scheduler?:ToastScheduler;
}

export interface ToastStore {
  /** Adds or replaces a toast and returns its id. */
  show(options:ToastOptions):string;
  /** Removes one toast, or every toast when `id` is omitted. Returns whether anything was removed. */
  dismiss(id?:string):boolean;
  /** Holds timers for `reason` (e.g. "hover", "focus", "screen-reader"). */
  pause(reason:string):void;
  /** Releases `reason`; timers run again once no reason is held. */
  resume(reason:string):void;
  getSnapshot():ToastSnapshot;
  subscribe(listener:()=>void):()=>void;
}

export const DEFAULT_TOAST_DURATION=5000;
export const MIN_ACTION_TOAST_DURATION=6000;

const systemScheduler:ToastScheduler={
  now:()=>Date.now(),
  set:(run,ms)=>setTimeout(run,ms),
  clear:handle=>clearTimeout(handle as ReturnType<typeof setTimeout>),
};

/**
 * Resolved display time for a toast. Throws a RangeError for a duration that
 * is NaN, zero or negative.
 */
export function resolveToastDuration(
  {duration,action,tone="info"}:Pick<ToastOptions,"duration"|"action"|"tone">,
  defaultDuration=DEFAULT_TOAST_DURATION,
):number{
  if(duration!==undefined&&(Number.isNaN(duration)||duration<=0))throw new RangeError("Toast duration must be a positive number of milliseconds or Infinity");
  if(duration===undefined)return action||tone==="danger"?Infinity:defaultDuration;
  return action?Math.max(duration,MIN_ACTION_TOAST_DURATION):duration;
}

/**
 * Compose `SnackbarDuration` for a resolved toast duration: Compose has only
 * short (4s), long (10s) and indefinite. Each time maps to the shortest
 * length that is not shorter than asked; past 10s that is indefinite.
 */
export function snackbarDuration(ms:number):"short"|"long"|"indefinite"{
  if(ms<=4000)return "short";
  if(ms<=10000)return "long";
  return "indefinite";
}

/** Live region politeness for a toast: assertive only for danger unless set. */
export function resolveToastLive({live,tone="info"}:Pick<ToastOptions,"live"|"tone">):ToastLive{
  return live??(tone==="danger"?"alert":"status");
}

interface Entry { item:ToastItem; remaining:number; deadline:number|null; handle:unknown; timing:boolean }

const positiveInt=(value:number,name:string,min:number)=>{
  if(!Number.isInteger(value)||value<min)throw new RangeError(`${name} must be an integer of at least ${min}`);
  return value;
};

export function createToastStore({
  maxVisible=3,maxQueued=50,defaultDuration=DEFAULT_TOAST_DURATION,scheduler=systemScheduler,
}:ToastStoreOptions={}):ToastStore{
  positiveInt(maxVisible,"maxVisible",1);
  positiveInt(maxQueued,"maxQueued",0);
  if(!(defaultDuration>0))throw new RangeError("defaultDuration must be a positive number of milliseconds or Infinity");
  let entries:Entry[]=[];
  let seq=0;
  const reasons=new Set<string>();
  const listeners=new Set<()=>void>();
  let snapshot:ToastSnapshot={visible:[],queued:0,paused:false};

  const stop=(entry:Entry)=>{
    if(!entry.timing)return;
    scheduler.clear(entry.handle);
    if(entry.deadline!==null)entry.remaining=Math.max(0,entry.deadline-scheduler.now());
    entry.timing=false;entry.handle=undefined;entry.deadline=null;
  };
  const start=(entry:Entry)=>{
    if(entry.timing||!Number.isFinite(entry.remaining))return;
    const id=entry.item.id,revision=entry.item.revision;
    entry.deadline=scheduler.now()+entry.remaining;
    entry.timing=true;
    entry.handle=scheduler.set(()=>{
      const current=entries.find(e=>e.item.id===id);
      if(current&&current.item.revision===revision){current.timing=false;remove(id);}
    },entry.remaining);
  };
  const sync=()=>{
    entries.forEach((entry,index)=>{
      if(index<maxVisible&&reasons.size===0)start(entry);else stop(entry);
    });
  };
  const emit=()=>{
    snapshot={visible:entries.slice(0,maxVisible).map(e=>e.item),queued:Math.max(0,entries.length-maxVisible),paused:reasons.size>0};
    for(const listener of [...listeners])listener();
  };
  const remove=(id:string)=>{
    const index=entries.findIndex(e=>e.item.id===id);
    if(index<0)return false;
    stop(entries[index]!);
    entries=entries.filter((_,i)=>i!==index);
    sync();emit();
    return true;
  };

  return {
    show(options){
      if(typeof options.title!=="string"||!options.title.trim())throw new TypeError("A toast needs a title in words");
      if(options.id!==undefined&&!options.id)throw new TypeError("A toast id must not be empty");
      if(options.action&&(!options.action.label?.trim()||typeof options.action.onPress!=="function"))throw new TypeError("A toast action needs a label and onPress");
      const tone=options.tone??"info";
      const duration=resolveToastDuration(options,defaultDuration);
      const id=options.id??`toast-${++seq}`;
      const existing=entries.find(e=>e.item.id===id);
      const item:ToastItem={
        id,tone,title:options.title,duration,live:resolveToastLive(options),revision:(existing?.item.revision??-1)+1,
        ...(options.description===undefined?{}:{description:options.description}),
        ...(options.action===undefined?{}:{action:options.action}),
      };
      if(existing){
        stop(existing);
        existing.item=item;existing.remaining=duration;
      }else{
        entries=[...entries,{item,remaining:duration,deadline:null,handle:undefined,timing:false}];
        if(entries.length>maxVisible+maxQueued){
          const dropped=entries[maxVisible]!;
          stop(dropped);
          entries=entries.filter(e=>e!==dropped);
        }
      }
      sync();emit();
      return id;
    },
    dismiss(id){
      if(id!==undefined)return remove(id);
      if(!entries.length)return false;
      entries.forEach(stop);
      entries=[];
      emit();
      return true;
    },
    pause(reason){
      if(reasons.has(reason))return;
      reasons.add(reason);
      sync();emit();
    },
    resume(reason){
      if(!reasons.delete(reason))return;
      sync();emit();
    },
    getSnapshot:()=>snapshot,
    subscribe(listener){
      listeners.add(listener);
      return ()=>{listeners.delete(listener);};
    },
  };
}
