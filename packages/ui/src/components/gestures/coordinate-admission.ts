/** Coordinate changes consume active gestures without replacing native views. */
export function createCoordinateAdmission(){
 let boundary:string|undefined,active:string|undefined;
 return {
  admit(next:string){boundary=next;active=undefined;},
  invalidate(expected:string){if(boundary===expected){boundary=undefined;active=undefined;}},
  ready(expected:string){return boundary===expected;},
  begin(expected:string){if(boundary!==expected)return false;active=expected;return true;},
  current(expected:string){return boundary===expected&&active===expected;},
  finish(expected:string){const valid=boundary===expected&&active===expected;if(valid)active=undefined;return valid;},
  cancel(){active=undefined;},
 };
}
/** Restoring an old transient preview bypasses replacement-source write admission. */
export function createCoordinatePreviewOwner<T>(){
 let active:{boundary:string;notify:(value:T|null)=>void}|undefined,epoch=0;
 const clear=(expected?:string)=>{if(active&&expected!==undefined&&active.boundary!==expected)return;const old=active;active=undefined;epoch++;old?.notify(null);};
 return {clear,publish(boundary:string,notify:(value:T|null)=>void,value:T){
  if(active&&(active.boundary!==boundary||active.notify!==notify)){const previous=epoch;clear();if(epoch!==previous+1)return;}
  if(!active){active={boundary,notify};epoch++;}active.notify(value);
 }};
}
/** Raw preview callbacks may synchronously replace the source and its local state. */
export function finishCoordinateEdit<T>(current:()=>boolean,update:()=>T|undefined,clear:()=>void,commit:(result:T)=>unknown){
 if(!current())return;
 const result=update();
 if(result===undefined||!current())return;
 clear();
 if(!current())return;
 return commit(result);
}

/** Geometry observation belongs to the mounted source, independently of write availability. */
export function createMeasuredCoordinateOwner(){
 let boundary:string|undefined;
 return {
  admit(next:string){boundary=next;},
  invalidate(expected:string){if(boundary===expected)boundary=undefined;},
  measure(expected:string,width:number){return boundary===expected?(Number.isFinite(width)&&width>0?width:0):undefined;},
 };
}
