/** One ephemeral preview lease; cancellation is delivered to its original host. */
export function createGradientPreviewOwner<T>(){
 let active:{boundary:string;notify:(value:T|undefined)=>void}|undefined;
 const clear=(boundary?:string)=>{if(!active||boundary!==undefined&&active.boundary!==boundary)return;const previous=active;active=undefined;previous.notify(undefined);};
 return {clear,publish(boundary:string,notify:(value:T|undefined)=>void,value:T){if(active&&(active.boundary!==boundary||active.notify!==notify))clear();active={boundary,notify};notify(value);}};
}
