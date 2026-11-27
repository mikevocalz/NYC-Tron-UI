import { useLayoutEffect, useRef, type RefObject } from "react";
import { Platform } from "react-native";
import { applyAriaPatch, findAriaTarget, type AriaPatch } from "./expo-ui-web-model.ts";

/**
 * Web only: sets ARIA attributes on an element that an @expo/ui universal
 * component renders but gives no prop for (the hidden `<input>` of Switch
 * and Checkbox, the `<textarea>` of TextInput, the `<dialog>` of
 * BottomSheet). `ref` is a React Native Web host node next to that element;
 * `selector` finds it below the node, or above it with `"ancestor"`.
 *
 * Runs after every render, because the universal component may replace the
 * element. Does nothing on native hosts, where the node is not a DOM element.
 */
export function useWebAriaPatch(
  ref:RefObject<unknown>,selector:string,patch:AriaPatch,where:"descendant"|"ancestor"="descendant",
):void{
  const owned=useRef(new Set<string>());
  useLayoutEffect(()=>{
    if(Platform.OS!=="web")return;
    const target=findAriaTarget(ref.current,selector,where);
    if(target)applyAriaPatch(target,patch,owned.current);
  });
}
