import { useEffect, useRef } from "react";
import { View } from "react-native";
import { DragDropContentView } from "expo-drag-drop-content-view";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { acceptsFile } from "./drop-model.ts";
import { DropZoneCopy, dropZoneClasses } from "./DropZone.shared.tsx";
import type { DropZoneProps } from "./DropZone.types.ts";

export type { DropAsset, DropAssets, DropZoneProps } from "./DropZone.types.ts";

type DropState={active:boolean};

/**
 * iOS and Android drop target over expo-drag-drop-content-view (optional peer,
 * needs a dev or production build; Expo Go does not include it). Drops come
 * from the system drag session: iPad and iPhone multitasking, Android split
 * screen and Samsung DeX. There is no browse control on native (see
 * FilePicker.native), so `browseLabel` and `disableObjectUrl` are ignored.
 * `accept` is applied to the dropped assets' names and types after the drop.
 */
export function DropZone({
  children,onDrop,onEnter,onExit,accept,allowedMimeTypes,includeBase64=false,
  disableObjectUrl:_disableObjectUrl,browseLabel:_browseLabel,onError:_onError,multiple:_multiple,disabled=false,
  title="Drop a file here",description,className,unstyled=false,style,...rest
}:DropZoneProps) {
  const storeRef=useRef<StoreApi<DropState>|null>(null);
  if(!storeRef.current)storeRef.current=createStore<DropState>(()=>({active:false}));
  const store=storeRef.current;
  const active=useStore(store,s=>s.active);
  // Unmounting the drop view on disable skips its onExit; end the drag here.
  useEffect(()=>{
    if(disabled&&store.getState().active){store.setState({active:false});onExit?.();}
  },[disabled,store,onExit]);
  const content=children??<DropZoneCopy title={title} description={description} unstyled={unstyled}/>;
  return (
    // No label on the container: iOS ignores it on a non-accessible view, and
    // making the view accessible would hide the content from VoiceOver. The
    // visible title is read in place.
    <View {...rest} style={style}
      {...{className:dropZoneClasses({active,disabled,unstyled,className})}}>
      {disabled ? content : (
        <DragDropContentView
          includeBase64={includeBase64}
          allowedMimeTypes={allowedMimeTypes}
          onEnter={()=>{store.setState({active:true});onEnter?.();}}
          onExit={()=>{store.setState({active:false});onExit?.();}}
          onDrop={({assets})=>{
            store.setState({active:false});
            onDrop?.({assets:assets.filter(a=>a.text!==undefined&&!a.uri
              ? !accept
              : acceptsFile({fileName:a.fileName,type:a.type},accept))});
          }}
          // Fills the well so the whole bordered area accepts the drop.
          style={{alignSelf:"stretch",alignItems:"center",justifyContent:"center",gap:12,flexGrow:1}}>
          {content}
        </DragDropContentView>
      )}
    </View>
  );
}
