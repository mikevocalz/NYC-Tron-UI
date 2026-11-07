import {createContext,useRef} from 'react';
/** Invalidate ephemeral gestures without remounting focused controls or product state. */
export const EditorInteractionScope=createContext<string|null>(null);
let nextInstance=0;
/** Compare cached document signatures by identity without reserializing a whole
 * timeline on every playback tick or nesting its data in child scope strings. */
export function useEditorBoundary(parts:readonly unknown[]):string{
 const ref=useRef<{id:number;version:number;parts:readonly unknown[]}|null>(null);
 ref.current??={id:++nextInstance,version:0,parts:[]};
 const current=ref.current;
 if(parts.length!==current.parts.length||parts.some((part,index)=>!Object.is(part,current.parts[index]))){current.parts=[...parts];current.version++;}
 return current.id+':'+current.version;
}
