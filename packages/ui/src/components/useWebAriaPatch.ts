import { useLayoutEffect, useRef, type RefObject } from "react";
import { Platform } from "react-native";
import { applyAriaPatch, findAriaTarget, type AriaPatch, type AriaPatchOwned } from "./expo-ui-web-model.ts";

/**
 * Web only: sets ARIA attributes on an element that an @expo/ui universal
 * component renders but gives no prop for (the hidden `<input>` of Switch
 * and Checkbox, the `<textarea>` of TextInput, the `<dialog>` of
 * BottomSheet). `ref` is a React Native Web host node next to that element;
 * `selector` finds it below the node, or above it with `"ancestor"`.
 *
 * Runs after every render, because the universal component may replace the
 * element; a new element starts a fresh record of original values. Does
 * nothing on native hosts, where the node is not a DOM element.
 */
export function useWebAriaPatch(
  ref:RefObject<unknown>,selector:string,patch:AriaPatch,where:"descendant"|"ancestor"="descendant",
):void{
  const state=useRef<{target:unknown;owned:AriaPatchOwned}>({target:null,owned:new Map()});
  useLayoutEffect(()=>{
    if(Platform.OS!=="web")return;
    const target=findAriaTarget(ref.current,selector,where);
    if(!target)return;
    if(state.current.target!==target)state.current={target,owned:new Map()};
    applyAriaPatch(target,patch,state.current.owned);
  });
}
