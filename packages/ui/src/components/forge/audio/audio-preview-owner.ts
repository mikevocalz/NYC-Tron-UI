/** A live audio preview is restored through the exact callback/value that began it. */
export function createAudioPreviewOwner<T>(){
 let generation=0;
 let active:{boundary:string;notify:(value:T)=>void;restore:T;identity:unknown}|undefined;
 const clear=(boundary?:string)=>{if(!active){if(boundary===undefined)generation++;return;}if(boundary!==undefined&&active.boundary!==boundary)return;const previous=active;active=undefined;generation++;previous.notify(previous.restore);};
 return{clear,publish(boundary:string,notify:(value:T)=>void,restore:T,value:T,identity:unknown=notify){
  if(active&&(active.boundary!==boundary||active.identity!==identity)){const before=generation;clear();if(generation!==before+1)return false;}
  if(!active){active={boundary,notify,restore,identity};generation++;}
  const lease=active;lease.notify(value);return active===lease;
 }};
}
/** Queued responders must match the admitted source and geometry. */
export function audioGestureCurrent(admitted:string|null,current:string,disabled:boolean){return admitted!==null&&admitted===current&&!disabled;}

export function audioResponderCurrent(admitted:string|null,current:string,disabled:boolean,admittedGesture:number|null,eventGesture:number){return audioGestureCurrent(admitted,current,disabled)&&admittedGesture!==null&&admittedGesture===eventGesture;}
