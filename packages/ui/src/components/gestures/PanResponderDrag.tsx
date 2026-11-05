import {cloneElement,useMemo,useRef} from "react";
import {PanResponder} from "react-native";
import type {DragTransportProps} from "./drag-transport.ts";
import {panResponderDragConfig} from "./pan-responder-config.ts";

/**
 * Default {@linkcode DragTransport}: React Native's responder system. Works on web
 * and native with no extra dependency. On native apps that already mount
 * `GestureHandlerRootView`, prefer {@linkcode GestureHandlerDrag}.
 */
export function PanResponderDrag(props:DragTransportProps){
  const latest=useRef(props);
  latest.current=props;
  const responder=useMemo(()=>PanResponder.create(panResponderDragConfig(latest)),[]);
  return cloneElement(props.children,responder.panHandlers);
}
