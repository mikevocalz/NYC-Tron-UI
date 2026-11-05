import type {GestureResponderEvent,PanResponderCallbacks} from "react-native";

/** A point in the responder view's own coordinates (0,0 is its top-left corner). */
export interface LocalPoint {
  readonly x:number;
  readonly y:number;
}
/**
 * Callbacks for {@linkcode localPointerConfig}. Unlike `DragTransport`, which reports
 * page coordinates, these report points inside the view, for controls that map a
 * position to a value (a color disc, a seek bar, a clip edge).
 */
export interface LocalPointerHandlers {
  readonly disabled?:boolean;
  onBegin(point:LocalPoint):void;
  onMove(point:LocalPoint):void;
  onRelease(point:LocalPoint):void;
  /** OS termination, or a second pointer when {@linkcode LocalPointerHandlers.onPinch} is absent. */
  onCancel():void;
  /**
   * Two-pointer pinch. `scale` is the current pointer distance over the distance when
   * the second pointer landed; `center` is their midpoint. Once a pinch starts, the
   * gesture ends with {@linkcode LocalPointerHandlers.onPinchEnd} instead of a release.
   */
  onPinch?(scale:number,center:LocalPoint):void;
  onPinchEnd?():void;
}

type Latest={readonly current:LocalPointerHandlers};
type Touch={readonly pageX:number;readonly pageY:number};

/**
 * PanResponder callbacks that report view-local points. The grant point is
 * `locationX/Y`, which is relative to the touched view, so every child of the
 * responder view must set `pointerEvents="none"`. Later points add the page-space
 * travel to the grant point; `locationX` on a move would be measured from whatever
 * view the pointer is over.
 */
export function localPointerConfig(latest:Latest):PanResponderCallbacks{
  let origin={x:0,y:0,pageX:0,pageY:0};
  let pinch:{distance:number}|undefined;
  let live=false;
  const local=(pageX:number,pageY:number):LocalPoint=>({x:origin.x+pageX-origin.pageX,y:origin.y+pageY-origin.pageY});
  const touchesOf=(event:GestureResponderEvent):readonly Touch[]=>event.nativeEvent.touches??[];
  const end=()=>{live=false;pinch=undefined;};
  return {
    onStartShouldSetPanResponder:()=>!latest.current.disabled,
    onMoveShouldSetPanResponder:()=>!latest.current.disabled,
    onPanResponderGrant:event=>{
      const n=event.nativeEvent;
      origin={x:n.locationX,y:n.locationY,pageX:n.pageX,pageY:n.pageY};
      pinch=undefined;
      live=true;
      latest.current.onBegin({x:n.locationX,y:n.locationY});
    },
    onPanResponderMove:event=>{
      if(!live)return;
      const touches=touchesOf(event);
      if(touches.length>=2){
        const handlers=latest.current;
        if(!handlers.onPinch){end();handlers.onCancel();return;}
        const [a,b]=touches as [Touch,Touch];
        const distance=Math.hypot(b.pageX-a.pageX,b.pageY-a.pageY);
        if(!pinch){
          // The one-pointer gesture that started this is abandoned, not committed.
          handlers.onCancel();
          pinch={distance:Math.max(distance,1)};
        }
        handlers.onPinch(distance/pinch.distance,local((a.pageX+b.pageX)/2,(a.pageY+b.pageY)/2));
        return;
      }
      if(pinch)return;
      latest.current.onMove(local(event.nativeEvent.pageX,event.nativeEvent.pageY));
    },
    onPanResponderRelease:event=>{
      if(!live)return;
      const pinched=pinch!==undefined;
      end();
      if(pinched)latest.current.onPinchEnd?.();
      else latest.current.onRelease(local(event.nativeEvent.pageX,event.nativeEvent.pageY));
    },
    // A parent ScrollView must not take a granted drag; the OS still can.
    onPanResponderTerminationRequest:()=>false,
    onPanResponderTerminate:()=>{
      if(!live)return;
      const pinched=pinch!==undefined;
      end();
      if(pinched)latest.current.onPinchEnd?.();
      else latest.current.onCancel();
    },
    onShouldBlockNativeResponder:()=>true,
  };
}
