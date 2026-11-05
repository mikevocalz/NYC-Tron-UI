/** Callbacks for {@linkcode createValueGesture}. */
export interface ValueGestureCallbacks<T> {
  /** Read on every transition, so a control disabled mid-drag cancels. */
  disabled():boolean;
  equals(a:T,b:T):boolean;
  /** Visual preview during a drag, and the restored start value on cancel. */
  preview(value:T):void;
  /** Called at most once per gesture, on release, and only when the value changed. */
  commit(value:T):void;
}
/** Handle returned by {@linkcode createValueGesture}. */
export interface ValueGesture<T> {
  readonly active:boolean;
  begin(start:T):void;
  /** Previews `next`; ignored when no gesture is active. */
  update(next:T):void;
  release():void;
  /** Restores the start value through `preview`; never commits. */
  cancel():void;
}
/**
 * One value-editing gesture: begin, any number of previews, then a single commit
 * on release or a restore on cancel. Shared by the color tracks and wheels and
 * the timeline edit handles so each engine sees one commit per gesture end.
 */
export function createValueGesture<T>(callbacks:ValueGestureCallbacks<T>):ValueGesture<T>{
  let session:{start:T;current:T}|undefined;
  const cancel=()=>{
    if(!session)return;
    const {start}=session;
    session=undefined;
    callbacks.preview(start);
  };
  return {
    get active(){return session!==undefined;},
    begin(start){
      cancel();
      if(callbacks.disabled())return;
      session={start,current:start};
    },
    update(next){
      if(!session)return;
      if(callbacks.disabled()){cancel();return;}
      if(callbacks.equals(next,session.current))return;
      session.current=next;
      callbacks.preview(next);
    },
    release(){
      if(!session)return;
      const {start,current}=session;
      session=undefined;
      if(callbacks.disabled()){callbacks.preview(start);return;}
      if(!callbacks.equals(start,current))callbacks.commit(current);
    },
    cancel,
  };
}
