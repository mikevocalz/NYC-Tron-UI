import type {StyleProp,ViewStyle} from "react-native";
import {useImperativeHandle,useRef,type ComponentRef,type Ref} from "react";
import TronNavigationViewNativeComponent,{Commands} from "./TronNavigationViewNativeComponent";
import {nativeIsRTL} from "./native-direction.ts";

export interface TronNavigationViewHandle {
  /** Returns whether a focus command reached a mounted native view, not a focus observation. */
  focusSelected(): boolean;
  /** Restore focus after closing the app-owned Settings surface. */
  focusSettings(): boolean;
}
export interface Destination {
  readonly id:string;
  readonly label:string;
  readonly glyph?:string;
  readonly disabled?:boolean;
}
export interface TronNavigationViewProps {
  readonly ref?:Ref<TronNavigationViewHandle>;
  readonly items:readonly Destination[];
  readonly footerItems?:readonly Destination[];
  readonly selectedId:string|null;
  readonly paneMode?:"auto"|"expanded"|"compact"|"minimal";
  readonly paneOpen:boolean;
  readonly paneTitle?:string;
  readonly settingsVisible?:boolean;
  readonly onSelectionRequested:(id:string)=>void;
  readonly onPaneOpenRequested:(open:boolean)=>void;
  readonly onSettingsRequested?:()=>void;
  /**
   * Called when the native NavigationView fails to initialize or rejects
   * a props update. Without a handler the error goes to console.error.
   */
  readonly onNativeError?:(error:Error)=>void;
  readonly style?:StyleProp<ViewStyle>;
}
export function validateDestinations(
  items:readonly Destination[],footer:readonly Destination[],selectedId:string|null
):void {
  const ids=new Set<string>();
  for(const d of [...items,...footer]){
    if(typeof d.id!=="string"||!d.id||typeof d.label!=="string"||!d.label.trim()||ids.has(d.id))
      throw new TypeError("Destination IDs and labels must be unique and nonempty");
    ids.add(d.id);
  }
  if(selectedId!==null&&!ids.has(selectedId))throw new RangeError("Selected destination is not in this navigation");
}
// WinUI NavigationView defaults: OpenPaneLength 320, CompactPaneLength 48.
// The island is the NavigationView's whole layout box, so a narrower island
// clips the open pane and a wider one leaves an empty content area beside it.
// "auto" adapts to the island width, not the window; in a sidebar-sized
// island it resolves to the minimal layout.
const OPEN_PANE_WIDTH=320;
const COMPACT_PANE_WIDTH=48;
/**
 * Controlled, Windows-only native WinUI 3 Fabric XAML island.
 * The app still owns routing, theme and nav state.
 */
export function TronNavigationView({
  items,footerItems=[],selectedId,paneMode="auto",paneOpen,
  paneTitle="",settingsVisible=false,onSelectionRequested,
  onPaneOpenRequested,onSettingsRequested,onNativeError,style,ref
}:TronNavigationViewProps){
  validateDestinations(items,footerItems,selectedId);
  const nativeRef=useRef<ComponentRef<typeof TronNavigationViewNativeComponent>>(null);
  useImperativeHandle(ref,()=>({
    focusSelected:()=>{if(!nativeRef.current)return false;Commands.focusSelected(nativeRef.current);return true;},
    focusSettings:()=>{if(!nativeRef.current)return false;Commands.focusSettings(nativeRef.current);return true;},
  }),[]);
  return <TronNavigationViewNativeComponent
    ref={nativeRef}
    itemsJson={JSON.stringify(items)}
    footerItemsJson={JSON.stringify(footerItems)}
    selectedId={selectedId??""}
    paneMode={paneMode}
    paneOpen={paneOpen}
    paneTitle={paneTitle}
    settingsVisible={settingsVisible}
    isRTL={nativeIsRTL(style)}
    onDestinationInvoked={e=>{
      const id=e.nativeEvent.id;
      if(id===selectedId)return;
      const target=[...items,...footerItems].find(d=>d.id===id);
      if(target&&!target.disabled)onSelectionRequested(id);
    }}
    onPaneOpenChanged={e=>{
      if(e.nativeEvent.open!==paneOpen)onPaneOpenRequested(e.nativeEvent.open);
    }}
    onSettingsInvoked={e=>{
      if(e.nativeEvent.id==="settings"&&settingsVisible)onSettingsRequested?.();
    }}
    onNativeError={e=>{
      const error=new Error("TronNavigationView native error: "+e.nativeEvent.message);
      if(onNativeError)onNativeError(error);
      else console.error(error);
    }}
    style={[{width:paneOpen?OPEN_PANE_WIDTH:COMPACT_PANE_WIDTH,height:"100%"},style]}
  />;
}
