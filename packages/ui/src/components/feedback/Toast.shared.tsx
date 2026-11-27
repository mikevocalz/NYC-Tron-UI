// Behaviour adapted from NYC-MON packages/ui/Toast.tsx and ToastCard.tsx (MIT).
import { createContext, useContext, useEffect, useMemo, useRef, useSyncExternalStore, type ComponentType, type ReactNode } from "react";
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, Text, View, type ViewProps } from "react-native";
import { Button } from "../Button.tsx";
import { joinClasses } from "../styles.ts";
import { CloseGlyph, StatusGlyph } from "./glyphs.tsx";
import { createSystemFlag, type SystemFlag } from "./progress-model.ts";
import { createToastStore, type ToastItem, type ToastStore, type ToastTone } from "./toast-model.ts";
import type { ToastApi, ToastPlacement, ToastProps, ToastProviderProps, ToastViewportProps } from "./Toast.types.ts";

type KeyEvent=Parameters<NonNullable<ViewProps["onKeyDown"]>>[0];

const reducedMotion=createSystemFlag(
  ()=>AccessibilityInfo.isReduceMotionEnabled?.(),
  receive=>AccessibilityInfo.addEventListener?.("reduceMotionChanged",receive),
);
const screenReader=createSystemFlag(
  ()=>AccessibilityInfo.isScreenReaderEnabled?.(),
  receive=>AccessibilityInfo.addEventListener?.("screenReaderChanged",receive),
);
const useFlag=(flag:SystemFlag)=>useSyncExternalStore(flag.subscribe,flag.get,()=>false);

const ToastContext=createContext<ToastStore|null>(null);

/** The provider's store. Throws outside a ToastProvider. */
export function useToastStore():ToastStore{
  const store=useContext(ToastContext);
  if(!store)throw new Error("useToast and ToastViewport must be used inside a ToastProvider");
  return store;
}

/** `show` and `dismiss` for the nearest ToastProvider. Throws outside one. */
export function useToast():ToastApi{
  const store=useToastStore();
  return useMemo(()=>({show:store.show,dismiss:store.dismiss}),[store]);
}

/** The visible toasts and queue length, read from the external store. */
export function useToastSnapshot(store:ToastStore){
  return useSyncExternalStore(store.subscribe,store.getSnapshot,store.getSnapshot);
}

/** Spoken form of a toast, for platform announcements. */
export const toastAnnouncement=(toast:Pick<ToastItem,"title"|"description">)=>
  toast.description?`${toast.title}. ${toast.description}`:toast.title;

const tones:Record<ToastTone,string>={
  info:"border-info bg-surface-raised",
  success:"border-success bg-surface-raised",
  danger:"border-danger bg-surface-raised",
  neutral:"border-border bg-surface-sunken",
};

/**
 * Presentational toast card: drawn status mark, title, optional description,
 * one action and a 44pt close control. Tone shows in the border and the mark,
 * and the title carries the meaning in words, so color is never the only
 * signal. On its own it is a polite live region; inside ToastViewport the
 * viewport's regions announce it instead.
 */
export function Toast({
  ref,tone="info",title,description,action,onDismiss,dismissLabel,live="status",icon,
  className,titleClassName,descriptionClassName,actionClassName,unstyled=false,...rest
}:ToastProps) {
  if(!title.trim())throw new TypeError("A toast needs a title in words");
  const styled=!unstyled;
  return (
    <View {...rest} ref={ref}
      {...(live==="off"?{}:{role:live,accessibilityLiveRegion:live==="alert"?"assertive" as const:"polite" as const})}
      {...{className:joinClasses("w-full flex-row items-start",
        styled&&"gap-3 rounded-card border ps-4 py-3",styled&&tones[tone],
        styled&&(onDismiss?"pe-1":"pe-4"),className)}}>
      <View {...{className:"pt-0.5"}}>{icon??<StatusGlyph tone={tone}/>}</View>
      <View {...{className:joinClasses("min-w-0 flex-1",styled&&"gap-1 py-px")}}>
        <Text {...{className:joinClasses(styled&&"text-sm font-semibold leading-5 text-text",titleClassName)}}>{title}</Text>
        {description ? <Text {...{className:joinClasses(styled&&"text-sm leading-5 text-text-muted",descriptionClassName)}}>{description}</Text> : null}
        {action ? (
          <View {...{className:joinClasses("self-start",styled&&"mt-2")}}>
            <Button title={action.label} variant="secondary" size="sm" onPress={action.onPress}
              unstyled={unstyled} {...(actionClassName===undefined?{}:{className:actionClassName})}/>
          </View>
        ) : null}
      </View>
      {onDismiss ? (
        <Pressable onPress={onDismiss} accessibilityRole="button" accessibilityLabel={dismissLabel??`Dismiss ${title}`}
          // Negative margins keep the 44pt target from growing the card.
          style={{marginVertical:-10,minWidth:44,minHeight:44}}
          {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center",
            styled&&"rounded-control hover:bg-surface-sunken active:opacity-70 focus-visible:ring-2 focus-visible:ring-focus")}}>
          <CloseGlyph/>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Fades and slides a card in from its edge; appears at once with reduce motion on. */
function ToastEnter({children,reduced,placement,onEscape}:{children:ReactNode;reduced:boolean;placement:ToastPlacement;onEscape:()=>void}) {
  const shown=useRef(new Animated.Value(reduced?1:0)).current;
  useEffect(()=>{
    if(reduced){shown.setValue(1);return;}
    const enter=Animated.timing(shown,{toValue:1,duration:180,easing:Easing.out(Easing.cubic),useNativeDriver:Platform.OS!=="web"});
    enter.start();
    return ()=>enter.stop();
  },[reduced,shown]);
  const onKeyDown=(event:KeyEvent)=>{
    const data=(event.nativeEvent??event) as unknown as {key?:string};
    if(data.key==="Escape"){event.preventDefault?.();event.stopPropagation?.();onEscape();}
  };
  const from=placement==="top"?-8:8;
  return (
    <Animated.View {...(Platform.OS==="web"?{onKeyDown}:{})}
      style={{width:"100%",opacity:shown,transform:[{translateY:shown.interpolate({inputRange:[0,1],outputRange:[from,0]})}]}}>
      {children}
    </Animated.View>
  );
}

/** Announces newly shown or replaced toasts on iOS, where live regions are not read. */
function useIosAnnouncements(visible:readonly ToastItem[]) {
  const said=useRef(new Map<string,number>());
  useEffect(()=>{
    if(Platform.OS!=="ios")return;
    for(const toast of visible){
      if(said.current.get(toast.id)===toast.revision)continue;
      said.current.set(toast.id,toast.revision);
      AccessibilityInfo.announceForAccessibilityWithOptions?.(toastAnnouncement(toast),{queue:toast.live==="status"});
    }
    for(const id of [...said.current.keys()])if(!visible.some(toast=>toast.id===id))said.current.delete(id);
  },[visible]);
}

/**
 * Kit viewport: shows the provider's visible toasts as cards over the app,
 * pinned to the top or bottom edge, with logical side padding and the safe
 * area insets you pass. Two persistent live regions (assertive for `alert`
 * toasts, polite for `status`) announce cards as they are added, which is
 * more reliable on web than mounting a new live region per card. Timers pause
 * while the pointer is over the viewport or focus is inside it (web). Escape
 * dismisses the focused toast (web). Toasts never take focus.
 */
export function KitToastViewport({
  placement="bottom",insets,label="Notifications",className,toastClassName,unstyled=false,colorScheme:_colorScheme,style,...rest
}:ToastViewportProps) {
  const store=useToastStore();
  const {visible}=useToastSnapshot(store);
  const reduced=useFlag(reducedMotion);
  useIosAnnouncements(visible);
  const edge=12+(placement==="top"?insets?.top??0:insets?.bottom??0);
  const render=(toast:ToastItem)=>(
    <ToastEnter key={toast.id} reduced={reduced} placement={placement} onEscape={()=>store.dismiss(toast.id)}>
      <Toast live="off" tone={toast.tone} title={toast.title}
        {...(toast.description===undefined?{}:{description:toast.description})}
        {...(toast.action===undefined?{}:{action:{label:toast.action.label,onPress:()=>{toast.action!.onPress();store.dismiss(toast.id);}}})}
        onDismiss={()=>store.dismiss(toast.id)} unstyled={unstyled}
        {...(toastClassName===undefined?{}:{className:toastClassName})}/>
    </ToastEnter>
  );
  const pause=Platform.OS==="web"?{
    onPointerEnter:()=>store.pause("hover"),onPointerLeave:()=>store.resume("hover"),
    onFocus:()=>store.pause("focus"),onBlur:()=>store.resume("focus"),
  }:{};
  const region={pointerEvents:"box-none" as const,width:"100%" as const,maxWidth:480,gap:8};
  return (
    <View {...rest} {...pause} role="region" aria-label={label}
      style={[{
        position:"absolute",left:0,right:0,[placement]:0,alignItems:"center",gap:8,pointerEvents:"box-none",
        paddingTop:placement==="top"?edge:0,paddingBottom:placement==="bottom"?edge:0,
        paddingStart:16+(insets?.start??0),paddingEnd:16+(insets?.end??0),
      },style]}
      {...{className:joinClasses(className)}}>
      <View role="alert" accessibilityLiveRegion="assertive" style={region}>
        {visible.filter(toast=>toast.live==="alert").map(render)}
      </View>
      <View role="status" accessibilityLiveRegion="polite" style={region}>
        {visible.filter(toast=>toast.live==="status").map(render)}
      </View>
    </View>
  );
}

/**
 * Shared provider body; each fork passes its own viewport. Creates one store
 * (unless `store` is given), stops its timers while unmounted, and holds them
 * while a screen reader runs when `persistForScreenReader` is on.
 */
export function ToastProviderBase({
  children,store:external,maxVisible,maxQueued,defaultDuration,viewport=true,placement,insets,viewportProps,
  persistForScreenReader=true,Viewport,
}:ToastProviderProps&{Viewport:ComponentType<ToastViewportProps>}) {
  const own=useRef<ToastStore|null>(null);
  if(!external&&!own.current)own.current=createToastStore({
    ...(maxVisible===undefined?{}:{maxVisible}),
    ...(maxQueued===undefined?{}:{maxQueued}),
    ...(defaultDuration===undefined?{}:{defaultDuration}),
  });
  const store=external??own.current!;
  useEffect(()=>{
    store.resume("detached");
    return ()=>store.pause("detached");
  },[store]);
  const reading=useFlag(screenReader);
  useEffect(()=>{
    if(!persistForScreenReader||!reading)return;
    store.pause("screen-reader");
    return ()=>store.resume("screen-reader");
  },[store,reading,persistForScreenReader]);
  return (
    <ToastContext.Provider value={store}>
      {children}
      {viewport ? <Viewport {...viewportProps} {...(placement===undefined?{}:{placement})} {...(insets===undefined?{}:{insets})}/> : null}
    </ToastContext.Provider>
  );
}
