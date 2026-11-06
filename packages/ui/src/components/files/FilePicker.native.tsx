import {useRef} from "react";
import {Pressable,Text} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {joinClasses} from "../styles.ts";
import {filePickerRecipe,type FilePickerProps} from "./FilePicker.types.ts";

export type {FilePickerProps,NativeDocument,NativeDocumentSource} from "./FilePicker.types.ts";

/**
 * iOS and Android: a button that opens the OS document picker through
 * `documentSource` and hands the picked URIs to `onDocuments`. React Native
 * has no `File`, so this is a separate contract from web's `onFiles`; the
 * kit takes no picker dependency of its own.
 *
 * Without both `documentSource` and `onDocuments` it renders nothing, on
 * purpose: a button that opened nothing would be a dead control. While the
 * picker is open the button is busy, so a second tap cannot stack pickers.
 */
export function FilePicker({
  label,accept,multiple=false,disabled=false,documentSource,onDocuments,onError,accessibilityHint,testID,
  className,labelClassName,unstyled=false,
}:FilePickerProps){
  const local=useRef<StoreApi<{busy:boolean}>|null>(null);
  if(!local.current)local.current=createStore(()=>({busy:false}));
  const store=local.current;
  const busy=useStore(store,s=>s.busy);
  if(!documentSource||!onDocuments)return null;
  const blocked=disabled||busy;
  const open=async()=>{
    if(blocked)return;
    store.setState({busy:true});
    try{
      const documents=await documentSource.pick({...(accept?{accept}:{}),multiple});
      if(documents.length)onDocuments(documents);
    }catch(error){
      const failure=error instanceof Error?error:new Error(String(error));
      if(onError)onError(failure);else throw failure;
    }finally{
      store.setState({busy:false});
    }
  };
  const styled=!unstyled;
  return (
    <Pressable onPress={open} disabled={blocked} testID={testID}
      accessibilityRole="button" accessibilityLabel={label} accessibilityHint={accessibilityHint}
      accessibilityState={{disabled:blocked,busy}}
      {...{className:joinClasses(styled&&filePickerRecipe.root,blocked&&"opacity-50",className)}}>
      <Text {...{className:joinClasses(styled&&filePickerRecipe.label,labelClassName)}}>{label}</Text>
    </Pressable>
  );
}
