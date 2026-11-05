import {useEffect,useRef,type ComponentRef,type ReactNode} from "react";
import {Platform,View,type LayoutChangeEvent,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import type {FoldFeature,Rect} from "@nyc-tron/core/folds";
import {createDragController,type DragController} from "../gestures/drag-controller.ts";
import type {DragPoint,DragTransport} from "../gestures/drag-transport.ts";
import {PanResponderDrag} from "../gestures/PanResponderDrag.tsx";
import {joinClasses} from "../styles.ts";
import {shellKey} from "./shell-keys.ts";
import {
  hingeBands,mirrorBands,resolveSplit,sizeForEdge,startSizeFor,stepSplit,
  type HingeBand,type SplitAxis,type SplitLayout,type SplitLimits,
} from "./splitter-model.ts";

export type {SplitAxis} from "./splitter-model.ts";

/** Props for {@linkcode PaneSplitter}. */
export interface PaneSplitterProps extends Omit<ViewProps,"children"> {
  /** `horizontal` lays the panes side by side; `vertical` stacks them. */
  axis:SplitAxis;
  start:ReactNode;
  end:ReactNode;
  /** Controlled size, in points, of the pane named by `sizeEdge`. */
  size:number;
  /** Which pane `size` measures. Use `end` for a right or bottom dock that should keep its width. @default "start" */
  sizeEdge?:"start"|"end";
  /** Called during a drag with the resolved size. Preview only; never persist here. */
  onPreview?:(size:number)=>void;
  /** Exactly once per completed drag, keyboard step or screen-reader action. */
  onCommit:(size:number)=>void;
  /** @default 120 */
  minStart?:number;
  /** @default 120 */
  minEnd?:number;
  /** Accessible name of the divider, e.g. "Resize layers panel". */
  label:string;
  /**
   * Window-space fold and hinge features from the app's foldable layout owner.
   * The divider never rests on a hinge: it seats on it or moves clear.
   */
  features?:readonly FoldFeature[];
  /**
   * This splitter's window-space bounds, in the same units as `features`.
   * When omitted with features present, the splitter measures itself.
   */
  container?:Rect;
  /** Horizontal splits put the start pane on the right. @default false */
  isRTL?:boolean;
  /** Points moved per arrow key or screen-reader step. @default 16 */
  keyboardStep?:number;
  /** Divider thickness off a hinge. The touch target stays 44pt. @default 9 */
  dividerSize?:number;
  /** Pointer recogniser. @default PanResponderDrag */
  transport?:DragTransport;
  className?:string;
  startClassName?:string;
  endClassName?:string;
  dividerClassName?:string;
  unstyled?:boolean;
}

type Local={main:number;cross:number;window:Rect|undefined;preview:SplitLayout|undefined;focused:boolean};
const DRAG_SNAP=24;
// Web only: dragging the divider would otherwise select pane text.
const NO_SELECT=(Platform.OS==="web"?{userSelect:"none"}:{}) as object;
const cursorFor=(axis:SplitAxis)=>(Platform.OS==="web"?{cursor:axis==="horizontal"?"col-resize":"row-resize"}:{}) as object;

/**
 * Controlled two-pane split with a draggable divider (WAI-ARIA window
 * splitter). Both panes keep their minimum sizes, and on foldables the divider
 * never rests on a hinge: it seats on the hinge so neither pane draws under
 * it, or moves to the nearer side. Arrow keys step, Home and End jump to the
 * limits, Escape cancels a drag, and screen readers adjust it with increment
 * and decrement. Physical pane order is fixed, so hinge geometry stays
 * correct in right-to-left layouts.
 */
export function PaneSplitter({
  axis,start,end,size,sizeEdge="start",onPreview,onCommit,minStart=120,minEnd=120,label,
  features=[],container,isRTL=false,keyboardStep=16,dividerSize=9,transport:Transport=PanResponderDrag,
  className,startClassName,endClassName,dividerClassName,unstyled=false,style,onLayout,...rest
}:PaneSplitterProps){
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({main:0,cross:0,window:undefined,preview:undefined,focused:false}));
  const store=local.current;
  const main=useStore(store,s=>s.main);
  const measuredWindow=useStore(store,s=>s.window);
  const preview=useStore(store,s=>s.preview);
  const focused=useStore(store,s=>s.focused);
  const host=useRef<ComponentRef<typeof View>>(null);
  const horizontal=axis==="horizontal";
  const rtl=horizontal&&isRTL;

  const limits:SplitLimits={total:main,minStart,minEnd,divider:dividerSize};
  const frame=container??measuredWindow;
  const physical:HingeBand[]=features.length&&frame&&main>0
    ?hingeBands({...frame,[horizontal?"width":"height"]:main},features,axis):[];
  const bands=rtl?mirrorBands(physical,main):physical;
  const committed=main>0?resolveSplit(startSizeFor(size,sizeEdge,limits),limits,bands):undefined;
  const layout=preview??committed;

  const latest=useRef({layout:committed,limits,bands,size,sizeEdge,onPreview,onCommit,rtl,horizontal});
  latest.current={layout:committed,limits,bands,size,sizeEdge,onPreview,onCommit,rtl,horizontal};
  const gesture=useRef<{origin:DragPoint|undefined;from:number}>({origin:undefined,from:0});
  const controller=useRef<DragController|null>(null);
  if(!controller.current)controller.current=createDragController({
    disabled:()=>!latest.current.layout,
    start:()=>{gesture.current.from=latest.current.layout!.startSize;},
    move:point=>{
      const g=gesture.current,p=latest.current;
      if(!g.origin){g.origin=point;return;}
      const delta=(p.horizontal?point.x-g.origin.x:point.y-g.origin.y)*(p.rtl?-1:1);
      const next=resolveSplit(g.from+delta,p.limits,p.bands,DRAG_SNAP);
      store.setState({preview:next});
      p.onPreview?.(sizeForEdge(next,p.sizeEdge));
    },
    commit:()=>{
      const next=store.getState().preview;
      store.setState({preview:undefined});
      if(next)latest.current.onCommit(sizeForEdge(next,latest.current.sizeEdge));
    },
    cancel:()=>{
      store.setState({preview:undefined});
      latest.current.onPreview?.(latest.current.size);
    },
  });
  const drag=controller.current;
  useEffect(()=>()=>drag.cancel(),[drag]);

  const measure=()=>{
    if(!features.length||container)return;
    host.current?.measureInWindow?.((x,y,width,height)=>{
      if([x,y,width,height].every(Number.isFinite))store.setState({window:{x,y,width,height}});
    });
  };
  const onHostLayout=(event:LayoutChangeEvent)=>{
    const {width,height}=event.nativeEvent.layout;
    store.setState({main:horizontal?width:height,cross:horizontal?height:width});
    measure();
    onLayout?.(event);
  };
  const step=(direction:1|-1)=>{
    const p=latest.current;
    if(!p.layout)return;
    const next=stepSplit(p.layout,direction,keyboardStep,p.limits,p.bands);
    if(next.startSize!==p.layout.startSize)p.onCommit(sizeForEdge(next,p.sizeEdge));
  };
  const jump=(to:"min"|"max")=>{
    const p=latest.current;
    if(!p.layout)return;
    const next=resolveSplit(to==="min"?0:p.limits.total,p.limits,p.bands);
    if(next.startSize!==p.layout.startSize)p.onCommit(sizeForEdge(next,p.sizeEdge));
  };
  const onKeyDown=(event:unknown)=>{
    const k=shellKey(event);
    if(k.altKey||k.ctrlKey||k.metaKey)return;
    const forward=horizontal?(rtl?"ArrowLeft":"ArrowRight"):"ArrowDown";
    const back=horizontal?(rtl?"ArrowRight":"ArrowLeft"):"ArrowUp";
    if(k.key==="Escape"){drag.cancel();return;}
    if(k.key===forward)step(1);
    else if(k.key===back)step(-1);
    else if(k.key==="Home")jump("min");
    else if(k.key==="End")jump("max");
    else return;
    k.preventDefault();
  };

  const styled=!unstyled;
  const hi=layout?Math.max(minStart,main-minEnd-dividerSize):minStart;
  const now=Math.round(layout?.startSize??0);
  const startPane=<View key="start" {...{className:startClassName}}
    style={{[horizontal?"width":"height"]:layout?.startSize??0,overflow:"hidden",flexShrink:0,direction:isRTL?"rtl":"ltr"}}>{start}</View>;
  const endPane=<View key="end" {...{className:endClassName}} style={{flex:1,minWidth:0,minHeight:0,overflow:"hidden",direction:isRTL?"rtl":"ltr"}}>{end}</View>;
  const seated=(layout?.hinge??-1)>=0;
  const active=preview!==undefined;
  const line=joinClasses(styled&&(active?"border-accent":focused?"border-focus":"border-border"));
  // Drawn as a border: forced-colors mode drops backgrounds but keeps borders.
  const divider=<View key="divider" style={{[horizontal?"width":"height"]:layout?.dividerSize??dividerSize,
    alignItems:"center",justifyContent:"center",zIndex:1,flexShrink:0}}
    {...{className:joinClasses(styled&&seated&&"bg-surface-sunken",dividerClassName)}}>
    <View pointerEvents="none" {...{className:line}}
      style={horizontal
        ?{position:"absolute",top:0,bottom:0,left:"50%",width:0,borderLeftWidth:active||focused?3:1,marginLeft:active||focused?-1.5:-0.5}
        :{position:"absolute",left:0,right:0,top:"50%",height:0,borderTopWidth:active||focused?3:1,marginTop:active||focused?-1.5:-0.5}}/>
    <Transport disabled={!layout}
      onBegin={point=>{gesture.current.origin=point;drag.begin();}}
      onMove={(point,touches)=>{if(touches===1)drag.move(point);else drag.cancel();}}
      onRelease={()=>drag.release()}
      onCancel={()=>drag.cancel()}>
      <View collapsable={false}
        {...(Platform.OS==="web"
          ?{role:"separator","aria-orientation":horizontal?"vertical":"horizontal",focusable:true,onKeyDown}
          :{accessibilityRole:"adjustable" as const})}
        accessible accessibilityLabel={label}
        accessibilityHint="Drag, or use the arrow keys, to resize the panes."
        aria-valuemin={minStart} aria-valuemax={Math.round(hi)} aria-valuenow={now}
        aria-valuetext={`${now} points`}
        accessibilityActions={[{name:"increment",label:"Grow first pane"},{name:"decrement",label:"Shrink first pane"}]}
        onAccessibilityAction={event=>{
          if(event.nativeEvent.actionName==="increment")step(1);
          if(event.nativeEvent.actionName==="decrement")step(-1);
        }}
        onFocus={()=>store.setState({focused:true})}
        onBlur={()=>store.setState({focused:false})}
        {...{className:joinClasses(styled&&"focus-visible:outline-none")}}
        style={[{position:"absolute",...(horizontal
          ?{top:0,bottom:0,width:44,left:"50%",marginLeft:-22}
          :{left:0,right:0,height:44,top:"50%",marginTop:-22}),...NO_SELECT},cursorFor(axis)]}/>
    </Transport>
  </View>;
  // Physical order: the start pane is on the right only for a right-to-left horizontal split.
  const panes=rtl?[endPane,divider,startPane]:[startPane,divider,endPane];
  return <View {...rest} ref={host} onLayout={onHostLayout}
    {...{className:joinClasses("min-h-0 min-w-0",className)}}
    style={[{flex:1,flexDirection:horizontal?"row":"column",direction:"ltr"},active?NO_SELECT:null,style]}>
    {layout?panes:null}
  </View>;
}
