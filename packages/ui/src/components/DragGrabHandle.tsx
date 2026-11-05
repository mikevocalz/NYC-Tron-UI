import {useEffect,useRef,type ReactNode} from "react";
import {View,type ViewProps} from "react-native";
import {createDragController,type DragController} from "./gestures/drag-controller.ts";
import {keyboardKey,type DragPoint,type DragTransport,type KeyEventLike} from "./gestures/drag-transport.ts";
import {PanResponderDrag} from "./gestures/PanResponderDrag.tsx";
import {joinClasses} from "./styles.ts";

export type {DragPoint} from "./gestures/drag-transport.ts";

/** Props for {@linkcode DragGrabHandle}. */
export interface DragGrabHandleProps extends Omit<ViewProps,"children"|"accessibilityLabel"> {
  /** Screen-reader name, e.g. "Reorder Layer 2". */
  label:string;
  disabled?:boolean;
  /** A drag began. The app records what is being dragged. */
  onStart:()=>void;
  /** Preview only. Called for each one-pointer move; never commit here. */
  onMove:(point:DragPoint)=>void;
  /** Exactly once per completed drag. */
  onCommit:()=>void;
  /** Escape, termination, a second pointer or becoming disabled. The app restores its preview. */
  onCancel:()=>void;
  /** Pointer recogniser. @default PanResponderDrag */
  transport?:DragTransport;
  /** Glyph color override; defaults to the theme's muted text token. */
  color?:string;
  /** Replaces the default three-bar grip glyph. */
  children?:ReactNode;
  className?:string;
  unstyled?:boolean;
}

/**
 * Controlled 44x44 drag handle for docking, reordering and similar list moves. It
 * reports start, preview moves, one commit and cancellation; the app owns every
 * position and the resulting order.
 */
export function DragGrabHandle({
  label,disabled=false,onStart,onMove,onCommit,onCancel,transport:Transport=PanResponderDrag,
  color,children,className,unstyled=false,style,...rest
}:DragGrabHandleProps){
  const latest=useRef({disabled,onStart,onMove,onCommit,onCancel});
  latest.current={disabled,onStart,onMove,onCommit,onCancel};
  const controllerRef=useRef<DragController|null>(null);
  if(!controllerRef.current)controllerRef.current=createDragController({
    disabled:()=>latest.current.disabled,
    start:()=>latest.current.onStart(),
    move:point=>latest.current.onMove(point),
    commit:()=>latest.current.onCommit(),
    cancel:()=>latest.current.onCancel(),
  });
  const controller=controllerRef.current;
  useEffect(()=>()=>controller.cancel(),[controller]);
  const onKeyDown=(event:KeyEventLike)=>{if(keyboardKey(event)==="Escape")controller.cancel();};
  const bar=color?{backgroundColor:color}:null;
  const grip=children ?? <View pointerEvents="none" style={{gap:3}}>
    {[0,1,2].map(i=><View key={i} {...{className:joinClasses(!unstyled&&!color&&"bg-text-muted")}}
      style={{width:16,height:2,borderRadius:1,...bar}}/>)}
  </View>;
  return <Transport disabled={disabled}
    onBegin={()=>controller.begin()}
    onMove={(point,touches)=>{if(touches===1)controller.move(point);else controller.cancel();}}
    onRelease={()=>controller.release()}
    onCancel={()=>controller.cancel()}>
    <View {...rest} collapsable={false}
      {...{onKeyDown,className:joinClasses(!unstyled&&"rounded-control",className)}}
      accessible accessibilityLabel={label}
      accessibilityHint="Drag to move. Press Escape to cancel."
      accessibilityState={{disabled}}
      style={[{minWidth:44,minHeight:44,justifyContent:"center",alignItems:"center",opacity:disabled?0.4:1},style]}>
      {grip}
    </View>
  </Transport>;
}
