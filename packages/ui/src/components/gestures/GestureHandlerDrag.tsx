import {useMemo,useRef} from "react";
import {Gesture,GestureDetector} from "react-native-gesture-handler";
import type {DragTransportProps} from "./drag-transport.ts";
import {buildDragGesture} from "./gesture-handler-config.ts";

/**
 * {@linkcode DragTransport} backed by react-native-gesture-handler (optional peer,
 * >=3.4 <4). Recognition runs natively; callbacks run on JS. The app must mount
 * `GestureHandlerRootView` above it. Import this subpath only when the peer is installed.
 */
export function GestureHandlerDrag(props:DragTransportProps){
  const latest=useRef(props);
  latest.current=props;
  const disabled=!!props.disabled;
  const gesture=useMemo(()=>buildDragGesture(Gesture,latest,disabled),[disabled]);
  return <GestureDetector gesture={gesture}>{props.children}</GestureDetector>;
}
