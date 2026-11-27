/*
 * Behaviour adapted from NYC-MON packages/ui/BottomSheet.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): Tron token classes instead of the
 * NYC-MON night facade, controlled `open` / `onOpenChange`, app-set snap
 * points, `dismissible`, and the web dialog named by the title.
 */
import {useCallback,useEffect,useImperativeHandle,useLayoutEffect,useRef,useState,type ComponentRef} from "react";
import {Platform,Pressable,ScrollView,Text,View} from "react-native";
import {BottomSheet,Host,RNHostView,type BottomSheetProps} from "@expo/ui";
import {joinClasses} from "../styles.ts";
import {useWebAriaPatch} from "../useWebAriaPatch.ts";
import {requireCloseLabel,requireSheetTitle,resolveSnapPoints} from "./sheet-model.ts";
import type {SheetProps} from "./Sheet.types.ts";

export type {SheetProps,SheetSnapPoint} from "./Sheet.types.ts";

/** Pointer travel, in CSS pixels, after which a web press counts as a drag (the sheet's own threshold). */
const DRAG_PX=8;
/** Android: time for the hidden Compose sheet to unmount before it is presented again. */
const REPRESENT_MS=500;

/**
 * SwiftUI's `interactiveDismissDisabled`, written as the plain modifier
 * config that `createModifier` from `@expo/ui/swift-ui/modifiers` returns.
 * Importing that module loads the native ExpoUI module, which throws on web,
 * so this file builds the config itself. Passed on iOS only.
 */
const HOLD_OPEN_IOS:NonNullable<BottomSheetProps["modifiers"]>=[{$type:"interactiveDismissDisabled",isDisabled:true}];

/**
 * Bottom sheet on @expo/ui's universal `BottomSheet` on every platform, the
 * way NYC-MON presents its sheets: a SwiftUI sheet on iOS, a Material 3
 * `ModalBottomSheet` on Android and an HTML `<dialog>` that slides up on
 * web. The platform owns the scrim, drag, snapping, motion (the web sheet
 * skips its slide under reduced motion), focus containment and safe area.
 *
 * Inside, a token-styled RN surface: the title as a level-2 heading, a 44pt
 * close button named by `closeLabel`, and a scrolling body. On web the
 * `<dialog>` is named by the title (it would otherwise read "Bottom sheet").
 * The header uses logical padding, so it mirrors in right-to-left layouts.
 *
 * `dismissible={false}` hides the grabber and leaves only the close button:
 * iOS holds the sheet with `interactiveDismissDisabled`; Android turns off
 * back and the backdrop; web ignores Escape and the backdrop. A swipe-down
 * cannot be refused on Android or web, so the sheet is presented again
 * (on Android its content remounts).
 */
export function Sheet({
  ref,open,onOpenChange,title,children,snapPoints,dismissible=true,closeLabel,closeIcon,colorScheme,testID,
  className,headerClassName,titleClassName,closeClassName,bodyClassName,unstyled=false,
}:SheetProps){
  const name=requireSheetTitle(title);
  const close=requireCloseLabel(closeLabel);
  const snaps=resolveSnapPoints(snapPoints);
  if(typeof dismissible!=="boolean")throw new TypeError("Sheet dismissible must be a boolean");
  const styled=!unstyled;
  const web=Platform.OS==="web",ios=Platform.OS==="ios";

  const latest=useRef({onOpenChange,dismissible});
  useLayoutEffect(()=>{latest.current={onOpenChange,dismissible};});

  // A refused swipe still hides the Android and web sheet: present it again.
  const [held,setHeld]=useState(false);
  useEffect(()=>{
    if(!held)return;
    const timer=setTimeout(()=>setHeld(false),web?0:REPRESENT_MS);
    return ()=>clearTimeout(timer);
  },[held,web]);

  // The web BottomSheet renders its <dialog> one commit after it is first
  // presented, so the content node arrives after this component's effects
  // ran. The callback ref stores it as layout state; the re-render it causes
  // applies the dialog name and attaches the drag listener.
  const root=useRef<ComponentRef<typeof View>|null>(null);
  const [node,setNode]=useState<ComponentRef<typeof View>|null>(null);
  const setRoot=useCallback((next:ComponentRef<typeof View>|null)=>{root.current=next;setNode(next);},[]);
  useImperativeHandle(ref,()=>node as ComponentRef<typeof View>,[node]);
  const dragged=useWebDrag(node,open&&web&&!dismissible);
  useWebAriaPatch(root,"dialog",{"aria-label":name},"ancestor");

  const onDismiss=()=>{
    const now=latest.current;
    if(now.dismissible){now.onOpenChange(false);return;}
    if(ios)return;
    const swiped=dragged.current;
    dragged.current=false;
    if(!web||swiped)setHeld(true);
  };

  const surface=(
    <View ref={setRoot} testID={testID} style={snaps?{flex:1}:undefined}
      {...{className:joinClasses("w-full min-w-0",snaps&&"flex-1",styled&&"bg-surface-raised",className)}}>
      <View style={{minHeight:44}}
        {...{className:joinClasses("flex-row items-center gap-3",styled&&"pe-2 ps-4 pt-2",headerClassName)}}>
        <Text accessibilityRole="header" role="heading" aria-level={2}
          {...{className:joinClasses("min-w-0 flex-1",styled&&"text-lg font-semibold leading-6 text-text",titleClassName)}}>{name}</Text>
        <Pressable onPress={()=>latest.current.onOpenChange(false)} accessibilityRole="button"
          accessibilityLabel={close} aria-label={close} testID={testID?testID+"-close":undefined}
          style={{minWidth:44,minHeight:44}}
          {...{className:joinClasses("h-11 w-11 shrink-0 items-center justify-center",
            styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus hover:bg-surface-sunken active:opacity-80 motion-reduce:transition-none",
            closeClassName)}}>
          <View aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
            {...{className:"items-center justify-center"}}>
            {closeIcon??<CloseGlyph/>}
          </View>
        </Pressable>
      </View>
      <ScrollView style={snaps?{flex:1}:{flexGrow:0,flexShrink:1}} keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...{contentContainerClassName:joinClasses(styled&&"px-4 pb-6 pt-2",bodyClassName)}}>
        {children}
      </ScrollView>
    </View>
  );

  const sheet=(
    <BottomSheet isPresented={open&&!held} onDismiss={onDismiss} snapPoints={snaps} contentPadding={0}
      showDragIndicator={dismissible} shouldDismissOnBackPress={dismissible} shouldDismissOnClickOutside={dismissible}
      containerColor={web?"var(--color-surface-raised)":undefined}
      modifiers={ios&&!dismissible?HOLD_OPEN_IOS:undefined}>
      <RNHostView matchContents={snaps?false:{vertical:true}}>{surface}</RNHostView>
    </BottomSheet>
  );
  // A Host only carries the color scheme; without one the universal sheet makes its own.
  return colorScheme&&!web?<Host matchContents colorScheme={colorScheme}>{sheet}</Host>:sheet;
}

/** A drawn cross, so the kit needs no icon dependency. */
function CloseGlyph(){
  return (
    <View style={{width:16,height:16,alignItems:"center",justifyContent:"center"}}>
      <View style={{position:"absolute",width:16,height:2,borderRadius:1,transform:[{rotate:"45deg"}]}}
        {...{className:"bg-text"}}/>
      <View style={{position:"absolute",width:16,height:2,borderRadius:1,transform:[{rotate:"-45deg"}]}}
        {...{className:"bg-text"}}/>
    </View>
  );
}

/**
 * Web: whether the latest press on the sheet content moved far enough to be
 * a drag. Read when the sheet asks to close, to tell a refused swipe (which
 * leaves the web sheet squashed) from Escape or the backdrop (which do not).
 * A press ends on `pointerup` or `pointercancel`, so a mouse moving with no
 * button held never counts. The flag outlives the release for one task, long
 * enough for the sheet's own `pointerup` to ask to close, and is then
 * cleared so a later Escape or backdrop click is not taken for a swipe.
 * Listens only; it never stops or changes an event.
 */
type PointerTarget={
  addEventListener?:(t:string,f:(e:PointerEvent)=>void,o?:boolean)=>void;
  removeEventListener?:(t:string,f:(e:PointerEvent)=>void,o?:boolean)=>void;
};
function useWebDrag(node:unknown,active:boolean){
  const dragged=useRef(false);
  useEffect(()=>{
    if(!active)return;
    const el=node as PointerTarget|null;
    const win=globalThis as unknown as PointerTarget;
    if(!el?.addEventListener||!win.addEventListener)return;
    let start:number|null=null;
    let clear:ReturnType<typeof setTimeout>|undefined;
    const down=(event:PointerEvent)=>{
      if(clear!==undefined){clearTimeout(clear);clear=undefined;}
      start=event.clientY;dragged.current=false;
    };
    const move=(event:PointerEvent)=>{if(start!==null&&Math.abs(event.clientY-start)>=DRAG_PX)dragged.current=true;};
    const up=()=>{
      if(start===null)return;
      start=null;
      if(dragged.current)clear=setTimeout(()=>{clear=undefined;dragged.current=false;},0);
    };
    el.addEventListener("pointerdown",down);
    win.addEventListener("pointermove",move,true);
    win.addEventListener("pointerup",up,true);
    win.addEventListener("pointercancel",up,true);
    return ()=>{
      if(clear!==undefined)clearTimeout(clear);
      el.removeEventListener?.("pointerdown",down);
      win.removeEventListener?.("pointermove",move,true);
      win.removeEventListener?.("pointerup",up,true);
      win.removeEventListener?.("pointercancel",up,true);
      dragged.current=false;
    };
  },[active,node]);
  return dragged;
}
