import type {GestureResponderEvent,PanResponderCallbacks,PanResponderGestureState} from "react-native";
import type {DragTransportProps} from "./drag-transport.ts";

type Latest={readonly current:DragTransportProps};
const point=(event:GestureResponderEvent)=>({x:event.nativeEvent.pageX,y:event.nativeEvent.pageY});

/**
 * Responder callbacks for {@linkcode PanResponderDrag}. Reads `latest.current` on each
 * event so the responder survives re-renders with fresh callbacks.
 */
export function panResponderDragConfig(latest:Latest):PanResponderCallbacks {
  return {
    onStartShouldSetPanResponder:event=>!latest.current.disabled&&event.nativeEvent.touches.length===1,
    onPanResponderGrant:event=>latest.current.onBegin(point(event)),
    onPanResponderStart:event=>{if(event.nativeEvent.touches.length!==1)latest.current.onCancel();},
    onPanResponderMove:(event,state:PanResponderGestureState)=>latest.current.onMove(point(event),state.numberActiveTouches),
    onPanResponderRelease:event=>latest.current.onRelease(point(event)),
    onPanResponderTerminationRequest:()=>true,
    onPanResponderTerminate:()=>latest.current.onCancel(),
  };
}
