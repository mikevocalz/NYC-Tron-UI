import {createContext,use,useEffect,useMemo,useRef,type ReactNode} from "react";
import {AccessibilityInfo,Platform,Text,View} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {initialA11yState,modalityAfterKey,queueAnnouncement,type A11yPreferences,type A11yState,type Politeness} from "./a11y-model.ts";

export type {A11yPreferences,InputModality,Politeness} from "./a11y-model.ts";
export {motionDuration} from "./a11y-model.ts";

interface A11yContextValue {
  readonly store:StoreApi<A11yState>;
  readonly announce:(text:string,politeness?:Politeness)=>void;
}
const A11yContext=createContext<A11yContextValue|undefined>(undefined);

/** Props for {@linkcode FocusAndA11yLayer}. */
export interface FocusAndA11yLayerProps {
  children:ReactNode;
  /** Starting values, e.g. from a test or a server-rendered hint. The platform overrides them once it reports. */
  initial?:Partial<A11yPreferences>;
}

type Sub={remove:()=>void};
type LayerState=A11yState&{readFailure?:{error:unknown}};
type MediaQuery={matches:boolean;addEventListener?:(t:"change",l:(e:{matches:boolean})=>void)=>void;removeEventListener?:(t:"change",l:(e:{matches:boolean})=>void)=>void};
type WebDocument={documentElement:{dataset:Record<string,string|undefined>};addEventListener:(t:string,l:(e:never)=>void,c?:boolean)=>void;removeEventListener:(t:string,l:(e:never)=>void,c?:boolean)=>void};
function unavailableQtPreference(error:unknown):boolean{
  const code=(error as {code?:string}|null)?.code;
  return code==="ERR_QT_ACCESSIBILITY_UNSUPPORTED"||code==="ERR_QT_ACCESSIBILITY_UNAVAILABLE";
}

/**
 * Mount once near the app root. It reads reduce motion, screen-reader state
 * and high contrast from the OS (and the browser's media queries on web),
 * tracks whether focus last moved by keyboard or pointer, and gives every
 * component below it {@linkcode useA11yPreferences} and
 * {@linkcode useAnnounce}.
 *
 * On web the input modality is also written to
 * `<html data-input-modality="keyboard|pointer">`, so the app's CSS can show
 * focus rings only for keyboard users across controls it does not own.
 * Announcements use the OS API on iOS and Android and a hidden live region on
 * web.
 */
export function FocusAndA11yLayer({children,initial}:FocusAndA11yLayerProps){
  const ref=useRef<StoreApi<LayerState>|null>(null);
  if(!ref.current)ref.current=createStore<LayerState>(()=>initialA11yState(initial));
  const store=ref.current;
  const announcement=useStore(store,s=>s.announcement);
  const readFailure=useStore(store,s=>s.readFailure);

  useEffect(()=>{
    let alive=true;
    const subs:Sub[]=[];
    const set=(patch:Partial<A11yPreferences>)=>{if(alive)store.setState(patch);};
    const fail=(error:unknown):never=>{
      alive=false;
      for(const sub of subs.splice(0)){
        try{sub.remove();}catch{/* Preserve the originating failure while releasing the other subscriptions. */}
      }
      throw error;
    };
    // An unsupported Qt preference keeps the app's initial value. It must not
    // prevent independent supported preferences from subscribing. Unexpected
    // Qt read failures outside those known codes reach the React error boundary.
    // Other platforms retain their existing rejected-read fallback.
    const read=(query:()=>Promise<boolean>|undefined,receive:(value:boolean)=>void)=>{
      try{query()?.then(receive,error=>{
        if(alive&&(String(Platform.OS)==="qnx"||String(Platform.OS)==="marathon")&&!unavailableQtPreference(error))store.setState({readFailure:{error}});
      });}catch(error){if(!unavailableQtPreference(error))fail(error);}
    };
    const listen=(event:"reduceMotionChanged"|"screenReaderChanged"|"darkerSystemColorsChanged"|"highTextContrastChanged",receive:(value:boolean)=>void)=>{
      try{subs.push(AccessibilityInfo.addEventListener(event,receive));}
      catch(error){if(!unavailableQtPreference(error))fail(error);}
    };
    read(()=>AccessibilityInfo.isReduceMotionEnabled?.(),v=>set({reduceMotion:v}));
    read(()=>AccessibilityInfo.isScreenReaderEnabled?.(),v=>set({screenReader:v}));
    listen("reduceMotionChanged",v=>set({reduceMotion:!!v}));
    listen("screenReaderChanged",v=>set({screenReader:!!v}));
    // React Native Web has no darker-colors or high-contrast-text API; web reads forced colors below.
    if(Platform.OS==="ios"){
      read(()=>AccessibilityInfo.isDarkerSystemColorsEnabled(),v=>set({highContrast:v}));
      listen("darkerSystemColorsChanged",v=>set({highContrast:!!v}));
    }
    if(Platform.OS==="android"||String(Platform.OS)==="qnx"||String(Platform.OS)==="marathon"){
      read(()=>AccessibilityInfo.isHighTextContrastEnabled(),v=>set({highContrast:v}));
      listen("highTextContrastChanged",v=>set({highContrast:!!v}));
    }
    if(Platform.OS==="web"){
      const g=globalThis as unknown as {matchMedia?:(q:string)=>MediaQuery;document?:WebDocument};
      const forced=g.matchMedia?.("(forced-colors: active)");
      const motion=g.matchMedia?.("(prefers-reduced-motion: reduce)");
      if(forced){
        set({highContrast:forced.matches});
        const l=(e:{matches:boolean})=>set({highContrast:e.matches});
        forced.addEventListener?.("change",l);
        subs.push({remove:()=>forced.removeEventListener?.("change",l)});
      }
      if(motion){
        set({reduceMotion:motion.matches});
        const l=(e:{matches:boolean})=>set({reduceMotion:e.matches});
        motion.addEventListener?.("change",l);
        subs.push({remove:()=>motion.removeEventListener?.("change",l)});
      }
      const doc=g.document;
      if(doc){
        const mark=(m:A11yState["inputModality"])=>{
          if(store.getState().inputModality!==m)set({inputModality:m});
          doc.documentElement.dataset.inputModality=m;
        };
        const onKey=(e:{key:string;ctrlKey?:boolean;metaKey?:boolean;altKey?:boolean})=>
          mark(modalityAfterKey(store.getState().inputModality,e.key,!!(e.ctrlKey||e.metaKey||e.altKey)));
        const onPointer=()=>mark("pointer");
        doc.addEventListener("keydown",onKey as never,true);
        doc.addEventListener("pointerdown",onPointer as never,true);
        subs.push({remove:()=>{doc.removeEventListener("keydown",onKey as never,true);doc.removeEventListener("pointerdown",onPointer as never,true);}});
      }
    }
    return ()=>{alive=false;subs.forEach(s=>s.remove());};
  },[store]);

  useEffect(()=>{
    if(announcement&&Platform.OS!=="web"){
      try{AccessibilityInfo.announceForAccessibility(announcement.text);}
      catch(error){if(!unavailableQtPreference(error))throw error;}
    }
  },[announcement]);

  const value=useMemo<A11yContextValue>(()=>({store,announce:(text,politeness)=>queueAnnouncement(store,text,politeness)}),[store]);
  if(readFailure)throw readFailure.error;
  return <A11yContext.Provider value={value}>
    {children}
    {Platform.OS==="web"?<View pointerEvents="none"
      // Visually hidden in place: an off-screen offset would widen the page in right-to-left layouts.
      style={{position:"absolute",width:1,height:1,overflow:"hidden",top:0,left:0,clipPath:"inset(50%)"} as object}>
      <Text key={announcement?.seq??0} accessibilityLiveRegion={announcement?.politeness??"polite"}
        {...{"aria-atomic":true}}>{announcement?.text??""}</Text>
    </View>:null}
  </A11yContext.Provider>;
}

function useLayer(name:string):A11yContextValue{
  const ctx=use(A11yContext);
  if(!ctx)throw new Error(`${name} needs a FocusAndA11yLayer above it`);
  return ctx;
}
/** Current accessibility preferences. Re-renders when one changes. Requires {@linkcode FocusAndA11yLayer}. */
export function useA11yPreferences():A11yPreferences{
  const {store}=useLayer("useA11yPreferences");
  const reduceMotion=useStore(store,s=>s.reduceMotion);
  const screenReader=useStore(store,s=>s.screenReader);
  const highContrast=useStore(store,s=>s.highContrast);
  const inputModality=useStore(store,s=>s.inputModality);
  return {reduceMotion,screenReader,highContrast,inputModality};
}
/** `announce(text, politeness?)` for screen readers. Requires {@linkcode FocusAndA11yLayer}. */
export function useAnnounce():(text:string,politeness?:Politeness)=>void{
  return useLayer("useAnnounce").announce;
}
