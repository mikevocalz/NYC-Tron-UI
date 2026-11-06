// Web key source: the document's keydown. The browser already delivers every
// key to the page, so there is nothing to register.
import type {KeySource,Subscription} from "./key-source.ts";

type DomTarget={closest?(selector:string):unknown};
type DomKeyEvent={key:string;ctrlKey:boolean;metaKey:boolean;altKey:boolean;shiftKey:boolean;repeat:boolean;
  isComposing?:boolean;defaultPrevented:boolean;preventDefault():void;target?:DomTarget|null};
type DomDocument={
  addEventListener(type:"keydown",listener:(e:DomKeyEvent)=>void,capture?:boolean):void;
  removeEventListener(type:"keydown",listener:(e:DomKeyEvent)=>void,capture?:boolean):void;
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
    // Capture phase: React Native Web's TextInput stops every keydown from
    // bubbling, so a bubble listener would never see Mod+S typed in a field.
    // Capturing runs before page handlers, so a modal dialog (the shortcut
    // sheet recording a binding, an alert) keeps its own keys, and IME
    // composition keys stay with the field.
    const onKey=(e:DomKeyEvent)=>{
      if(e.defaultPrevented||e.isComposing)return;
      if(e.target?.closest?.('[aria-modal="true"]'))return;
      if(listener({key:e.key,ctrlKey:e.ctrlKey,metaKey:e.metaKey,altKey:e.altKey,shiftKey:e.shiftKey}))e.preventDefault();
    };
    doc.addEventListener("keydown",onKey,true);
    return {remove:()=>doc.removeEventListener("keydown",onKey,true)};
  },
  registerBindings:()=>NO_OP,
  isTextInputFocused:()=>isEditableElement(documentOrUndefined()?.activeElement),
};
