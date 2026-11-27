import { useEffect, useRef } from "react";
import { Platform, View } from "react-native";
import { Host } from "@expo/ui";
import { SnackbarHost, type SnackbarHostRef } from "@expo/ui/jetpack-compose";
import { KitToastViewport, ToastProviderBase, toastAnnouncement, useToastSnapshot, useToastStore } from "./Toast.shared.tsx";
import { snackbarDuration } from "./toast-model.ts";
import type { ToastProviderProps, ToastViewportProps } from "./Toast.types.ts";
export { Toast, useToast } from "./Toast.shared.tsx";
export { createToastStore } from "./toast-model.ts";
export type {
  ToastAction, ToastApi, ToastInsets, ToastItem, ToastLive, ToastOptions, ToastPlacement, ToastProps,
  ToastProviderProps, ToastSnapshot, ToastStore, ToastStoreOptions, ToastTone, ToastViewportProps,
} from "./Toast.types.ts";

/**
 * Android: the queue drives a Material 3 `SnackbarHost` from `@expo/ui`.
 * Compose owns timing (and lengthens it when accessibility services ask for
 * more time), shows one snackbar at a time and queues the rest, so the store's
 * own timers are held while this viewport is mounted. A snackbar's result
 * removes its toast from the store; an action press runs `onPress` first.
 *
 * Limits of the Compose API: a snackbar that is already showing or queued in
 * Compose cannot be withdrawn, so `dismiss(id)` only removes it from the
 * store; replacing a toast by id queues a new snackbar; the message is the
 * title and description joined; tone has no color (the words carry it); and
 * every snackbar is announced politely by Compose, `alert` included.
 */
function SnackbarViewport({placement="bottom",insets,colorScheme,label:_label,className:_className,toastClassName:_toastClassName,unstyled:_unstyled,style,...rest}:ToastViewportProps) {
  const store=useToastStore();
  const {visible}=useToastSnapshot(store);
  const host=useRef<SnackbarHostRef|null>(null);
  const sent=useRef(new Map<string,number>());
  useEffect(()=>{
    store.pause("snackbar");
    return ()=>store.resume("snackbar");
  },[store]);
  useEffect(()=>{
    const snackbars=host.current;
    if(!snackbars)return;
    for(const toast of visible){
      if(sent.current.get(toast.id)===toast.revision)continue;
      sent.current.set(toast.id,toast.revision);
      const {id,revision,action}=toast;
      void snackbars.showSnackbar({
        message:toastAnnouncement(toast),withDismissAction:true,duration:snackbarDuration(toast.duration),
        ...(action?{actionLabel:action.label}:{}),
      }).then(result=>{
        if(result==="actionPerformed")action?.onPress();
        const current=store.getSnapshot().visible.find(item=>item.id===id);
        if(current?.revision===revision)store.dismiss(id);
      },()=>{});
    }
    for(const id of [...sent.current.keys()])if(!visible.some(toast=>toast.id===id))sent.current.delete(id);
  },[visible,store]);
  const edge=placement==="top"?insets?.top??0:insets?.bottom??0;
  return (
    <View {...rest} style={[{position:"absolute",left:0,right:0,[placement]:edge,pointerEvents:"box-none",
      paddingStart:insets?.start??0,paddingEnd:insets?.end??0},style]}>
      <Host matchContents={{vertical:true}} style={{width:"100%"}} {...(colorScheme===undefined?{}:{colorScheme})}>
        <SnackbarHost ref={host}/>
      </Host>
    </View>
  );
}

/**
 * Shows the provider's queue: Compose snackbars on Android, kit cards on iOS
 * (iOS has no system toast; the cards are announced with
 * `announceForAccessibility`).
 */
export function ToastViewport(props:ToastViewportProps) {
  return Platform.OS==="android"?<SnackbarViewport {...props}/>:<KitToastViewport {...props}/>;
}

/**
 * Owns a toast queue for its subtree and, by default, renders a
 * `ToastViewport` after the children. Read it with `useToast()`.
 */
export function ToastProvider(props:ToastProviderProps) {
  return <ToastProviderBase {...props} Viewport={ToastViewport}/>;
}
