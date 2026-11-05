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
    const done=()=>input.remove();
    input.addEventListener("change",()=>{
      const files=Array.from(input.files??[]);
      done();
      if(files.length)onFiles(files);
    },{once:true});
    input.addEventListener("cancel",done,{once:true});
    document.body.appendChild(input);
    input.click();
  };
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
