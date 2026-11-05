import { Pressable, Text } from "react-native";
import { joinClasses } from "../styles.ts";
import { filePickerRecipe, type FilePickerProps } from "./FilePicker.types.ts";

export type { FilePickerProps } from "./FilePicker.types.ts";

/**
 * Opens the browser's file chooser from a real button. The `<input type=file>`
 * is created on press and never rendered, so the control is the kit's
 * Pressable (keyboard, focus ring, 44pt target) rather than raw HTML UI.
 */
export function FilePicker({
  label,accept,multiple=false,disabled=false,onFiles,accessibilityHint,testID,
  className,labelClassName,unstyled=false,
}:FilePickerProps) {
  const open=()=>{
    if(disabled||typeof document==="undefined")return;
    const input=document.createElement("input");
    input.type="file";
    if(accept)input.accept=accept;
    input.multiple=multiple;
    // Attached while open: Safari ignores click() on a detached file input.
    input.style.display="none";
    // Safari before 16.4 fires no `cancel`, so the window regaining focus
    // after the chooser closes also removes the input. `change` can land
    // just after that focus, hence the delay.
    const done=()=>{input.remove();window.removeEventListener("focus",onFocus);};
    const onFocus=()=>setTimeout(()=>{if(!input.files?.length)done();},1000);
    input.addEventListener("change",()=>{
      const files=Array.from(input.files??[]);
      done();
      if(files.length)onFiles?.(files);
    },{once:true});
    input.addEventListener("cancel",done,{once:true});
    window.addEventListener("focus",onFocus,{once:true});
    document.body.appendChild(input);
    input.click();
  };
  // No receiver for the files: no button, rather than one that picks into nothing.
  if(!onFiles)return null;
  const styled=!unstyled;
  return (
    <Pressable onPress={open} disabled={disabled} testID={testID}
      accessibilityRole="button" accessibilityLabel={label} accessibilityHint={accessibilityHint}
      accessibilityState={{disabled}}
      {...{className:joinClasses(styled&&filePickerRecipe.root,disabled&&"opacity-50",className)}}>
      <Text {...{className:joinClasses(styled&&filePickerRecipe.label,labelClassName)}}>{label}</Text>
    </Pressable>
  );
}
