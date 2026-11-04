import {useRef,type ReactNode} from "react";
import {PanResponder,Text,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {moveCrop,resizeCrop,type CropRect,type CropCorner,validateCrop} from "./crop.ts";
import {joinClasses} from "../../styles.ts";

export interface ImageCropOverlayProps extends Omit<ViewProps,"children">{
 rect:CropRect;
 width:number;
 height:number;
 onPreview?:(rect:CropRect)=>void;
 onCommit:(rect:CropRect)=>void|Promise<unknown>;
 accentColor?:string;
 className?:string;
 unstyled?:boolean;
 children?:ReactNode;
}
type Local={preview:CropRect;active:boolean};
/** Native interactive crop overlay only. Call Prism to apply pixels non-destructively. */
export function ImageCropOverlay({
 rect,width,height,onPreview,onCommit,accentColor="#818CF8",className,unstyled=false,children,...rest
}:ImageCropOverlayProps){
 validateCrop(rect);
 if(![width,height].every(Number.isFinite)||width<=0||height<=0)throw new RangeError("Invalid crop viewport");
 const latest=useRef({rect,width,height,onPreview,onCommit});
 latest.current={rect,width,height,onPreview,onCommit};
 const local=useRef<StoreApi<Local>|null>(null);
 if(!local.current)local.current=createStore<Local>(()=>({preview:rect,active:false}));
 const store=local.current;
 const active=useStore(store,s=>s.active);
 const preview=useStore(store,s=>s.preview);
 const displayed=active?preview:rect;
 const gestureStart=useRef(rect);
 const announce=(next:CropRect)=>{
  store.setState({preview:next,active:true});
  latest.current.onPreview?.(next);
 };
 const commit=(next:CropRect)=>{
  store.setState({preview:next,active:false});
  if(JSON.stringify(next)!==JSON.stringify(latest.current.rect))void latest.current.onCommit(next);
 };
 const begin=()=>{gestureStart.current=latest.current.rect;store.setState({active:true,preview:gestureStart.current});};
 const drag=(dx:number,dy:number)=>announce(moveCrop(gestureStart.current,dx/latest.current.width,dy/latest.current.height));
 const pan=useRef<ReturnType<typeof PanResponder.create>|null>(null);
 if(!pan.current)pan.current=PanResponder.create({
   onStartShouldSetPanResponder:()=>true,onMoveShouldSetPanResponder:()=>true,
   onPanResponderGrant:begin,
   onPanResponderMove:(_e,g)=>drag(g.dx,g.dy),
   onPanResponderRelease:()=>commit(store.getState().preview),
   onPanResponderTerminate:()=>store.setState({active:false,preview:latest.current.rect}),
 });
 return <View {...rest} {...{className:joinClasses("overflow-hidden",className)}}
   accessibilityLabel="Crop canvas" style={[{width,height,position:"relative"},rest.style]}>
   {children}
   <View {...pan.current.panHandlers} accessible accessibilityRole="adjustable"
     accessibilityLabel="Move crop rectangle" accessibilityHint="Drag crop area, or use four resize handles"
     style={{position:"absolute",left:displayed.x*width,top:displayed.y*height,
       width:displayed.width*width,height:displayed.height*height,
       borderWidth:2,borderColor:accentColor,backgroundColor:"transparent"}}>
     <View pointerEvents="none" style={{position:"absolute",left:"33.33%",top:0,bottom:0,width:1,opacity:0.35,backgroundColor:accentColor}}/>
     <View pointerEvents="none" style={{position:"absolute",left:"66.66%",top:0,bottom:0,width:1,opacity:0.35,backgroundColor:accentColor}}/>
     <View pointerEvents="none" style={{position:"absolute",top:"33.33%",left:0,right:0,height:1,opacity:0.35,backgroundColor:accentColor}}/>
     <View pointerEvents="none" style={{position:"absolute",top:"66.66%",left:0,right:0,height:1,opacity:0.35,backgroundColor:accentColor}}/>
   </View>
   {(["nw","ne","sw","se"] as const).map(corner=><CropHandle key={corner} corner={corner} rect={displayed}
     width={width} height={height} accentColor={accentColor} onBegin={begin}
     onDrag={(dx,dy)=>announce(resizeCrop(gestureStart.current,corner,dx/width,dy/height))}
     onCommit={()=>commit(store.getState().preview)}
     onCancel={()=>store.setState({active:false,preview:latest.current.rect})}/>)}
   {!unstyled?<Text style={{position:"absolute",bottom:4,left:4,fontSize:11,color:accentColor}}>
     {Math.round(displayed.width*100)}% × {Math.round(displayed.height*100)}%
   </Text>:null}
 </View>;
}
type HandleProps={
 corner:CropCorner;rect:CropRect;width:number;height:number;accentColor:string;
 onBegin:()=>void;onDrag:(dx:number,dy:number)=>void;onCommit:()=>void;onCancel:()=>void;
};
function CropHandle({corner,rect,width,height,accentColor,onBegin,onDrag,onCommit,onCancel}:HandleProps){
 const latest=useRef({onBegin,onDrag,onCommit,onCancel});
 latest.current={onBegin,onDrag,onCommit,onCancel};
 const pan=useRef<ReturnType<typeof PanResponder.create>|null>(null);
 if(!pan.current)pan.current=PanResponder.create({
  onStartShouldSetPanResponder:()=>true,onMoveShouldSetPanResponder:()=>true,
  onPanResponderGrant:()=>latest.current.onBegin(),
  onPanResponderMove:(_e,g)=>latest.current.onDrag(g.dx,g.dy),
  onPanResponderRelease:()=>latest.current.onCommit(),
  onPanResponderTerminate:()=>latest.current.onCancel(),
 });
 const x=(corner.includes("w")?rect.x:rect.x+rect.width)*width;
 const y=(corner.includes("n")?rect.y:rect.y+rect.height)*height;
 return <View {...pan.current.panHandlers} accessible accessibilityRole="adjustable"
   accessibilityLabel={"Resize crop "+corner} accessibilityHint="Drag to resize"
   style={{position:"absolute",left:x-22,top:y-22,width:44,height:44,justifyContent:"center",alignItems:"center"}}>
   <View pointerEvents="none" style={{width:14,height:14,borderWidth:2,borderColor:accentColor,backgroundColor:"#F9FAFB"}}/>
 </View>;
}
