import type {StyleProp,ViewStyle} from "react-native";
import TronNavigationViewNativeComponent from "./TronNavigationViewNativeComponent";

export interface Destination {
  readonly id:string;
  readonly label:string;
  readonly glyph?:string;
  readonly disabled?:boolean;
}
export interface TronNavigationViewProps {
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
/**
 * Controlled, Windows-only native WinUI 3 Fabric XAML island.
 * The app still owns routing, theme and nav state.
 */
export function TronNavigationView({
  items,footerItems=[],selectedId,paneMode="auto",paneOpen,
  paneTitle="",settingsVisible=false,onSelectionRequested,
  onPaneOpenRequested,onSettingsRequested,style
}:TronNavigationViewProps){
  validateDestinations(items,footerItems,selectedId);
  return <TronNavigationViewNativeComponent
    itemsJson={JSON.stringify(items)}
    footerItemsJson={JSON.stringify(footerItems)}
    selectedId={selectedId??""}
    paneMode={paneMode}
    paneOpen={paneOpen}
    paneTitle={paneTitle}
    settingsVisible={settingsVisible}
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
    style={[{width:paneMode==="expanded"?280:280,height:"100%"},style]}
  />;
}
