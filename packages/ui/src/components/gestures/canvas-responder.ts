import {PanResponder,Platform,type GestureResponderEvent,type PanResponderCallbacks,type PanResponderGestureState} from "react-native";

type Pointer = {
  pointerId:number;button:number;isPrimary?:boolean;clientX:number;clientY:number;pageX:number;pageY:number;
  altKey?:boolean;shiftKey?:boolean;ctrlKey?:boolean;metaKey?:boolean;
};
type Surface = {
  focus?(options?:{preventScroll?:boolean}):void;
  getBoundingClientRect():{left:number;top:number};
  setPointerCapture(id:number):void;
  releasePointerCapture(id:number):void;
  hasPointerCapture(id:number):boolean;
};
type PointerEvent = {
  nativeEvent:Pointer;currentTarget:Surface;
  preventDefault():void;
};

/**
 * Canvas gesture transport. Native keeps PanResponder. Web uses actual pointer
 * capture because RN Web deliberately excludes Alt/Ctrl mouse presses from its
 * responder system, while canvas tools need those modifiers for editing.
 * Pointer positions are normalized to the same local/page coordinate contract.
 */
export function createCanvasResponder(config:PanResponderCallbacks):ReturnType<typeof PanResponder.create>{
  if(Platform.OS!=="web")return PanResponder.create(config);
  let active:{id:number;surface:Surface;x:number;y:number;pageX:number;pageY:number}|undefined;
  const normalize=(event:PointerEvent):[GestureResponderEvent,PanResponderGestureState]=>{
    const n=event.nativeEvent,rect=event.currentTarget.getBoundingClientRect();
    const start=active??{x:n.clientX,y:n.clientY,pageX:n.pageX,pageY:n.pageY};
    const nativeEvent={...n,locationX:n.clientX-rect.left,locationY:n.clientY-rect.top,
      altKey:n.altKey,shiftKey:n.shiftKey,ctrlKey:n.ctrlKey,metaKey:n.metaKey,
      pageX:n.pageX,pageY:n.pageY,touches:[{pageX:n.pageX,pageY:n.pageY}]};
    const gesture={stateID:n.pointerId,moveX:n.pageX,moveY:n.pageY,x0:start.pageX,y0:start.pageY,
      dx:n.clientX-start.x,dy:n.clientY-start.y,vx:0,vy:0,numberActiveTouches:1};
    // These are event/coordinate adapters only; no native resource is fabricated.
    return [{nativeEvent,preventDefault:()=>event.preventDefault()} as unknown as GestureResponderEvent,gesture as PanResponderGestureState];
  };
  const release=()=>{
    const owner=active;active=undefined;
    if(owner?.surface.hasPointerCapture(owner.id))owner.surface.releasePointerCapture(owner.id);
  };
  const handlers={
    onPointerDown(event:PointerEvent){
      const n=event.nativeEvent;
      if(active){const args=normalize(event);args[1].numberActiveTouches=2;try{config.onPanResponderTerminate?.(...args);}finally{release();}return;}
      if(n.button!==0||n.isPrimary===false)return;
      const args=normalize(event);
      if(config.onStartShouldSetPanResponder?.(...args)===false)return;
      event.preventDefault();
      event.currentTarget.focus?.({preventScroll:true});
      active={id:n.pointerId,surface:event.currentTarget,x:n.clientX,y:n.clientY,pageX:n.pageX,pageY:n.pageY};
      event.currentTarget.setPointerCapture(n.pointerId);
      config.onPanResponderGrant?.(...normalize(event));
    },
    onPointerMove(event:PointerEvent){if(active?.id===event.nativeEvent.pointerId)config.onPanResponderMove?.(...normalize(event));},
    onPointerUp(event:PointerEvent){
      if(active?.id!==event.nativeEvent.pointerId)return;
      try{config.onPanResponderRelease?.(...normalize(event));}finally{release();}
    },
    onPointerCancel(event:PointerEvent){
      if(active?.id!==event.nativeEvent.pointerId)return;
      try{config.onPanResponderTerminate?.(...normalize(event));}finally{release();}
    },
    onLostPointerCapture(event:PointerEvent){
      if(active?.id!==event.nativeEvent.pointerId)return;
      try{config.onPanResponderTerminate?.(...normalize(event));}finally{release();}
    },
  };
  return {panHandlers:handlers as unknown as ReturnType<typeof PanResponder.create>["panHandlers"],getInteractionHandle:()=>undefined};
}
