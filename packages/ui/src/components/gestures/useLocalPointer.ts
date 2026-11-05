import {useMemo,useRef} from "react";
import {PanResponder,type GestureResponderHandlers} from "react-native";
import {localPointerConfig,type LocalPointerHandlers} from "./local-pointer.ts";

/**
 * Responder handlers for one view, built once and fed the latest callbacks on
 * every event. Spread the result on the view that defines the local coordinate
 * space; see {@linkcode localPointerConfig} for the `pointerEvents` rule.
 */
export function useLocalPointer(handlers:LocalPointerHandlers):GestureResponderHandlers{
  const latest=useRef(handlers);
  latest.current=handlers;
  return useMemo(()=>PanResponder.create(localPointerConfig(latest)).panHandlers,[]);
}
