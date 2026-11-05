import { useEffect, useRef, type ComponentRef } from "react";
import { View } from "react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { acceptsFile, dragDepth } from "./drop-model.ts";
import { DropZoneCopy, dropZoneClasses } from "./DropZone.shared.tsx";
import { FilePicker } from "./FilePicker.web.tsx";
import type { DropAsset, DropZoneProps } from "./DropZone.types.ts";

export type { DropAsset, DropAssets, DropZoneProps } from "./DropZone.types.ts";

function readDataUrl(file:File):Promise<string> {
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onerror=()=>reject(reader.error??new Error("Could not read "+file.name));
    reader.onload=()=>resolve(String(reader.result??""));
    reader.readAsDataURL(file);
  });
}
async function toAsset(file:File,includeBase64:boolean,disableObjectUrl:boolean):Promise<DropAsset> {
  const uri=disableObjectUrl?undefined:URL.createObjectURL(file);
  return {
    uri,type:file.type||"application/octet-stream",file,fileName:file.name,
    base64:includeBase64?await readDataUrl(file):undefined,
    release:uri?()=>URL.revokeObjectURL(uri):undefined,
  };
}

type DropState={active:boolean};

/**
 * Web drop target. React Native Web does not forward HTML drag events, so
 * the listeners attach to the view's own DOM node; nothing renders raw HTML.
 * The default content includes a FilePicker, the keyboard and pointer path
 * for people who cannot drag. Custom `children` must provide their own.
 *
 * expo-drag-drop-content-view's web build is not used: its 0.9.2 web bundle
 * ships JSX in a .js file, which Vite/Rolldown parse as plain JavaScript.
 */
export function DropZone({
  children,onDrop,onEnter,onExit,onError,multiple=false,accept,allowedMimeTypes,includeBase64=false,
  disableObjectUrl=false,disabled=false,title="Drop a file here",description,
  browseLabel="Choose a file",className,unstyled=false,...rest
}:DropZoneProps) {
  const host=useRef<ComponentRef<typeof View>>(null);
  const storeRef=useRef<StoreApi<DropState>|null>(null);
  if(!storeRef.current)storeRef.current=createStore<DropState>(()=>({active:false}));
  const store=storeRef.current;
  const active=useStore(store,s=>s.active);
  // Latest props for listeners that are attached once.
  const latest=useRef({onDrop,onEnter,onExit,onError,accept,allowedMimeTypes,includeBase64,disableObjectUrl,disabled});
  latest.current={onDrop,onEnter,onExit,onError,accept,allowedMimeTypes,includeBase64,disableObjectUrl,disabled};

  // A file that cannot be read is reported and skipped; the rest still arrive.
  const deliver=async(files:File[],text?:string)=>{
    const p=latest.current;
    const kept=files.filter(file=>acceptsFile({fileName:file.name,type:file.type},p.accept,p.allowedMimeTypes));
    const settled=await Promise.allSettled(kept.map(file=>toAsset(file,p.includeBase64,p.disableObjectUrl)));
    const assets:DropAsset[]=[];
    settled.forEach((result,i)=>{
      if(result.status==="fulfilled")assets.push(result.value);
      else p.onError?.(result.reason instanceof Error?result.reason:new Error("Could not read "+kept[i]!.name),kept[i]!);
    });
    if(!assets.length&&!files.length&&text&&!p.accept&&acceptsFile({type:"text"},undefined,p.allowedMimeTypes)){
      assets.push({type:"text",text});
    }
    p.onDrop?.({assets});
  };

  // Becoming disabled mid-drag ends the drag: the next one must report its own enter.
  const depthRef=useRef(0);
  useEffect(()=>{
    if(disabled&&store.getState().active){depthRef.current=0;store.setState({active:false});latest.current.onExit?.();}
  },[disabled,store]);

  useEffect(()=>{
    const node=host.current as unknown as HTMLElement|null;
    if(!node||typeof node.addEventListener!=="function")return;
    const edge=(next:{depth:number;edge:"enter"|"exit"|null})=>{
      depthRef.current=next.depth;
      if(next.edge==="enter"){store.setState({active:true});latest.current.onEnter?.();}
      if(next.edge==="exit"){store.setState({active:false});latest.current.onExit?.();}
    };
    // dragover and drop are always cancelled: a disabled zone must still stop
    // the browser from opening the dropped file in place of the app.
    const enter=(e:DragEvent)=>{if(latest.current.disabled)return;e.preventDefault();edge(dragDepth(depthRef.current,"enter"));};
    const over=(e:DragEvent)=>{
      e.preventDefault();
      if(e.dataTransfer)e.dataTransfer.dropEffect=latest.current.disabled?"none":"copy";
    };
    const leave=(e:DragEvent)=>{if(latest.current.disabled)return;e.preventDefault();edge(dragDepth(depthRef.current,"leave"));};
    const drop=(e:DragEvent)=>{
      e.preventDefault();
      if(latest.current.disabled)return;
      edge(dragDepth(depthRef.current,"drop"));
      const files=Array.from(e.dataTransfer?.files??[]);
      void deliver(files,e.dataTransfer?.getData("text/plain"));
    };
    node.addEventListener("dragenter",enter);
    node.addEventListener("dragover",over);
    node.addEventListener("dragleave",leave);
    node.addEventListener("drop",drop);
    return ()=>{
      node.removeEventListener("dragenter",enter);
      node.removeEventListener("dragover",over);
      node.removeEventListener("dragleave",leave);
      node.removeEventListener("drop",drop);
    };
  },[store]);

  return (
    <View {...rest} ref={host} role="group" aria-label={rest["aria-label"]??title}
      aria-disabled={disabled||undefined}
      {...{className:dropZoneClasses({active,disabled,unstyled,className})}}>
      {children ?? <DropZoneCopy title={title} description={description} unstyled={unstyled}
        browse={<FilePicker label={browseLabel} accept={accept} multiple={multiple} disabled={disabled}
          onFiles={files=>void deliver(files)}/>}/>}
    </View>
  );
}
