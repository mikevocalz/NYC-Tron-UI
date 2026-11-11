import {advancePrecisionGesture,beginPrecisionGesture,clamp,formatStepValue,scrubPrecision,snapTypedPrecision,
  type PrecisionGesture,type ScrubMode} from "./precision.ts";
import type {DragPoint} from "../../gestures/drag-transport.ts";

/** Transient, view-local state of a {@linkcode PrecisionScrubber}. The committed value is always a prop. */
export interface ScrubberState {
  preview:number;
  active:boolean;
  pending:boolean;
  editing:boolean;
  draft:string;
  mode:ScrubMode;
  error:string|undefined;
}
/** The controlled inputs the model reads on every event. */
export interface ScrubberInputs {
  value:number;
  min:number;
  max:number;
  step:number;
  detents?:readonly number[];
  disabled?:boolean;
  onPreview?:(value:number)=>void;
  onCommit:(value:number)=>unknown;
}
/** Minimal store contract; a zustand vanilla store satisfies it. */
export interface ScrubberStore {
  getState():ScrubberState;
  setState(partial:Partial<ScrubberState>):void;
}
/** Pixels of horizontal travel per step. */
export const SCRUB_PIXELS_PER_STEP=8;

export function initialScrubberState(value:number,step:number):ScrubberState {
  return {preview:value,active:false,pending:false,editing:false,draft:formatStepValue(value,step),mode:"normal",error:undefined};
}

/**
 * Gesture, keyboard and text-entry logic for {@linkcode PrecisionScrubber}, free of
 * React and React Native. One completed adjustment calls `onCommit` once; cancel
 * restores the controlled value and re-sends it through `onPreview`.
 */
export function createScrubberModel(store:ScrubberStore,inputs:()=>ScrubberInputs){
  let gesture:PrecisionGesture|undefined;
  let previewOwner:{value:number;notify?:((value:number)=>void)}|undefined;
  let epoch=0,boundary:string|undefined;
  const restorePreview=()=>{const previous=previewOwner;previewOwner=undefined;previous?.notify?.(previous.value);};
  const isBlocked=()=>!!inputs().disabled||store.getState().pending;
  const resting=()=>{
    const p=inputs();
    return {preview:p.value,draft:formatStepValue(p.value,p.step)};
  };
  const commit=async(next:number)=>{
    const p=inputs(),requestEpoch=epoch,requestBoundary=boundary;
    if(p.disabled||store.getState().pending||!Number.isFinite(next))return;
    restorePreview();
    if(requestEpoch!==epoch||requestBoundary!==boundary||isBlocked())return;
    const clipped=clamp(next,p.min,p.max);
    if(Math.abs(clipped-p.value)<1e-10){
      store.setState({...resting(),editing:false,active:false});
      return;
    }
    store.setState({pending:true,editing:false,active:false,preview:clipped,draft:formatStepValue(clipped,p.step),error:undefined});
    try{
      if(requestEpoch!==epoch||requestBoundary!==boundary)return;
      await p.onCommit(clipped);
    }catch(error){
      if(requestEpoch===epoch)store.setState({error:error instanceof Error?error.message:"Could not apply value"});
    }finally{
      // The host supplies the committed value; never display a fabricated success.
      if(requestEpoch===epoch)store.setState({pending:false,...resting()});
    }
  };
  // Advances the drag; a fine/coarse switch re-anchors there instead of rescaling the whole drag.
  const calculate=(point:DragPoint)=>{
    if(!gesture)return undefined;
    const p=inputs();
    gesture=advancePrecisionGesture(gesture,point,{
      min:p.min,max:p.max,step:p.step,pixelsPerStep:SCRUB_PIXELS_PER_STEP,
      ...(p.detents===undefined?{}:{detents:p.detents}),
    });
    return {next:gesture.value,mode:gesture.mode};
  };
  const cancel=()=>{
    gesture=undefined;
    store.setState({active:false,mode:"normal",...resting()});
    restorePreview();
  };
  const model={
    begin(point:DragPoint){
      if(isBlocked())return;
      const p=inputs(),startEpoch=epoch,startBoundary=boundary;
      restorePreview();
      if(startEpoch!==epoch||startBoundary!==boundary||isBlocked())return;
      previewOwner={value:p.value,...(p.onPreview?{notify:p.onPreview}:{})};
      gesture=beginPrecisionGesture(point,p.value);
      store.setState({active:true,error:undefined,mode:"normal"});
    },
    move(point:DragPoint,touches:number){
      if(touches!==1){cancel();return;}
      if(isBlocked())return;
      const result=calculate(point);
      if(!result)return;
      const s=store.getState();
      if(s.preview!==result.next||s.mode!==result.mode){
        store.setState({preview:result.next,mode:result.mode,draft:formatStepValue(result.next,inputs().step)});
        previewOwner?.notify?.(result.next);
      }
    },
    release(point:DragPoint){
      if(!gesture||isBlocked())return;
      const result=calculate(point);
      gesture=undefined;
      store.setState({active:false,mode:"normal"});
      if(result)return commit(result.next);
      return undefined;
    },
    cancel,
    get dragging(){return gesture!==undefined;},
    nudge(direction:-1|1){
      if(isBlocked())return undefined;
      const p=inputs();
      return commit(scrubPrecision({min:p.min,max:p.max,step:p.step,startValue:p.value,deltaPixels:direction*SCRUB_PIXELS_PER_STEP,pixelsPerStep:SCRUB_PIXELS_PER_STEP}));
    },
    startEditing(){if(isBlocked())return;store.setState({editing:true,draft:formatStepValue(store.getState().preview,inputs().step)});},
    changeDraft(draft:string){if(isBlocked()||!store.getState().editing)return;store.setState({draft});},
    applyDraft(){
      const s=store.getState();
      if(!s.editing||isBlocked())return undefined;
      const text=s.draft.trim().replace(",",".");
      const entered=Number(text);
      if(!text||!Number.isFinite(entered)){
        store.setState({editing:false,...resting(),error:"Enter a valid number"});
        return undefined;
      }
      const p=inputs();
      return commit(snapTypedPrecision(entered,p));
    },
    /** Invalidate source/config work without destroying the mounted native input. */
    admit(nextBoundary:string){
      if(boundary===nextBoundary)return;
      boundary=nextBoundary;const admissionEpoch=++epoch;
      try{cancel();}finally{if(admissionEpoch===epoch)store.setState({...initialScrubberState(inputs().value,inputs().step)});}
    },
    invalidate(){const invalidationEpoch=++epoch;boundary=undefined;try{cancel();}finally{if(invalidationEpoch===epoch)store.setState({pending:false,editing:false,error:undefined});}},
    /** Each rendered handler retains its own admission boundary. */
    scoped(expected:string){
      const valid=()=>boundary===expected;
      return {
        begin:(point:DragPoint)=>{if(valid())model.begin(point);},
        move:(point:DragPoint,touches:number)=>{if(valid())model.move(point,touches);},
        release:(point:DragPoint)=>valid()?model.release(point):undefined,
        cancel:()=>{if(valid())model.cancel();},
        nudge:(direction:-1|1)=>valid()?model.nudge(direction):undefined,
        startEditing:()=>{if(valid())model.startEditing();},
        changeDraft:(draft:string)=>{if(valid())model.changeDraft(draft);},
        applyDraft:()=>valid()?model.applyDraft():undefined,
        get dragging(){return valid()&&model.dragging;},
      };
    },
    /** Follow a new controlled value unless the user is mid-adjustment. */
    sync(){
      const s=store.getState();
      if(!s.active&&!s.editing&&!s.pending)store.setState(resting());
    },
  };
  return model;
}
/** Handle returned by {@linkcode createScrubberModel}. */
export type ScrubberModel=ReturnType<typeof createScrubberModel>;
