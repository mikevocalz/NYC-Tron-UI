/** Imperative gesture/measurement ownership, never serialized product state. */
export type DropToken=object;
export function createMeasuredDropOwner<T>(){
 let active:{token:DropToken;boundary:string;phase:'drag'|'drop';geometry?:T}|undefined;
 const current=(token:DropToken,boundary:string,phase?:'drag'|'drop')=>!!active&&active.token===token&&active.boundary===boundary&&(phase===undefined||active.phase===phase);
 return{
  begin(boundary:string){const token={};active={token,boundary,phase:'drag'};return token;},current,
  cancel(token?:DropToken){if(token!==undefined&&active?.token!==token)return false;active=undefined;return true;},
  record(token:DropToken,boundary:string,geometry:T){if(!current(token,boundary,'drag'))return false;active!.geometry=geometry;return true;},
  release(token:DropToken,boundary:string){if(!current(token,boundary,'drag'))return undefined;const geometry=active!.geometry;if(geometry===undefined){active=undefined;return undefined;}active!.phase='drop';return geometry;},
  finish(token:DropToken,boundary:string){if(!current(token,boundary))return false;active=undefined;return true;},
 };
}
