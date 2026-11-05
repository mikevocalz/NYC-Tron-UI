// Web key source: the document's keydown. The browser already delivers every
// key to the page, so there is nothing to register.
import type {KeySource,Subscription} from "./key-source.ts";

type DomKeyEvent={key:string;ctrlKey:boolean;metaKey:boolean;altKey:boolean;shiftKey:boolean;repeat:boolean;
  isComposing?:boolean;defaultPrevented:boolean;preventDefault():void};
type DomDocument={
  addEventListener(type:"keydown",listener:(e:DomKeyEvent)=>void):void;
  removeEventListener(type:"keydown",listener:(e:DomKeyEvent)=>void):void;
  activeElement?:{tagName?:string;isContentEditable?:boolean;getAttribute?(name:string):string|null}|null;
};

function documentOrUndefined():DomDocument|undefined{
  return (globalThis as {document?:DomDocument}).document;
}

/** True when focus is in an input, textarea, select or editable region. */
export function isEditableElement(el:DomDocument["activeElement"]):boolean{
  if(!el)return false;
  const tag=el.tagName?.toUpperCase();
  if(tag==="TEXTAREA"||tag==="SELECT")return true;
  if(tag==="INPUT"){
    const type=(el.getAttribute?.("type")??"text").toLowerCase();
    return !["button","checkbox","radio","range","color","file","submit","reset","image"].includes(type);
  }
  return el.isContentEditable===true;
}

const NO_OP:Subscription={remove(){}};

export const webKeySource:KeySource={
  addChordListener(listener){
    const doc=documentOrUndefined();
    if(!doc)return NO_OP;
    // A control that already handled the key (the shortcut recorder, a grid
    // cell) prevents default; IME composition keys belong to the field.
    const onKey=(e:DomKeyEvent)=>{
      if(e.defaultPrevented||e.isComposing)return;
      if(listener({key:e.key,ctrlKey:e.ctrlKey,metaKey:e.metaKey,altKey:e.altKey,shiftKey:e.shiftKey}))e.preventDefault();
    };
    doc.addEventListener("keydown",onKey);
    return {remove:()=>doc.removeEventListener("keydown",onKey)};
  },
  registerBindings:()=>NO_OP,
  isTextInputFocused:()=>isEditableElement(documentOrUndefined()?.activeElement),
};
