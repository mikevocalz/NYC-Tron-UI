import {useRef} from "react";
import {PanResponder,Pressable,Text,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {pointFromDrag,clamp,type Point2D} from "./precision.ts";
import {joinClasses} from "../../styles.ts";

type Local={width:number;height:number;active:boolean;preview:Point2D};
export interface InstrumentXYPadProps extends Omit<ViewProps,"children"> {
  x:number;
  y:number;
  label:string;
  disabled?:boolean;
  size?:number;
  step?:number;
  onPreview?:(point:Point2D)=>void;
  onCommit:(point:Point2D)=>void|Promise<unknown>;
  accentColor?:string;
  unstyled?:boolean;
  className?:string;
}
/** Multi-input pad with bounded normalized coordinates; no duplicate document state. */
export function InstrumentXYPad({
  x,y,label,disabled=false,size=180,step=0.05,onPreview,onCommit,accentColor="#818CF8",
  unstyled=false,className,onLayout,...rest
}:InstrumentXYPadProps){
  const latest=useRef({x,y,disabled,onPreview,onCommit});
  latest.current={x,y,disabled,onPreview,onCommit};
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({width:size,height:size,active:false,preview:{x,y}}));
  const store=local.current;
  const {width,height,active,preview}=useStore(store,s=>s);
  const position=active?preview:{x,y};
  const start=useRef<Point2D>({x,y});
  const commit=(next:Point2D)=>{
    const p=latest.current;
    store.setState({preview:next,active:false});
    if(!p.disabled&&(next.x!==p.x||next.y!==p.y))void p.onCommit(next);
  };
  const responder=useRef<ReturnType<typeof PanResponder.create>|null>(null);
  if(!responder.current)responder.current=PanResponder.create({
    onStartShouldSetPanResponder:()=>!latest.current.disabled,
    onMoveShouldSetPanResponder:()=>!latest.current.disabled,
    onPanResponderGrant:()=>{
      start.current={x:latest.current.x,y:latest.current.y};
      store.setState({active:true,preview:start.current});
    },
    onPanResponderMove:(_e,gesture)=>{
      const p=latest.current;
      if(p.disabled)return;
      const {width:w,height:h}=store.getState();
      const next=pointFromDrag(start.current,gesture.dx,gesture.dy,w,h);
      store.setState({preview:next});
      p.onPreview?.(next);
    },
    onPanResponderRelease:()=>commit(store.getState().preview),
    onPanResponderTerminate:()=>store.setState({active:false,preview:{x:latest.current.x,y:latest.current.y}}),
  });
  const nudge=(axis:"x"|"y",direction:-1|1)=>{
    if(disabled)return;
    const p={x,y};
    p[axis]=clamp(p[axis]+direction*step,0,1);
    commit(p);
  };
  return <View {...rest} {...{className:joinClasses("items-center gap-2",!unstyled&&"bg-surface-raised rounded-control p-3",className)}}>
    <Text {...{className:joinClasses(!unstyled&&"text-text font-semibold")}}>{label}</Text>
    <View {...responder.current.panHandlers}
      onLayout={e=>{
        const l=e.nativeEvent.layout;
        if(l.width>0&&l.height>0)store.setState({width:l.width,height:l.height});
        onLayout?.(e);
      }}
      accessibilityRole="adjustable"
      accessible accessibilityLabel={label+" X and Y controller"}
      accessibilityValue={{text:"X "+Math.round(position.x*100)+"%, Y "+Math.round(position.y*100)+"%"}}
      accessibilityState={{disabled}}
      style={{width:size,height:size,backgroundColor:"#15151C",borderWidth:1,borderColor:accentColor,opacity:disabled?0.45:1,overflow:"hidden"}}>
      <View pointerEvents="none" style={{position:"absolute",top:"50%",left:0,right:0,height:1,backgroundColor:accentColor,opacity:0.35}}/>
      <View pointerEvents="none" style={{position:"absolute",left:"50%",top:0,bottom:0,width:1,backgroundColor:accentColor,opacity:0.35}}/>
      <View pointerEvents="none" style={{position:"absolute",left:position.x*width-9,top:(1-position.y)*height-9,
        width:18,height:18,borderRadius:9,borderWidth:2,borderColor:accentColor,backgroundColor:"#EEF2FF"}}/>
    </View>
    <View style={{flexDirection:"row",gap:8,alignItems:"center"}}>
      <Pressable accessibilityRole="button" accessibilityLabel={"Decrease "+label+" X"} onPress={()=>nudge("x",-1)}
        style={{minHeight:44,minWidth:36,justifyContent:"center",alignItems:"center"}}><Text>←</Text></Pressable>
      <Text>X {Math.round(position.x*100)}% · Y {Math.round(position.y*100)}%</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={"Increase "+label+" X"} onPress={()=>nudge("x",1)}
        style={{minHeight:44,minWidth:36,justifyContent:"center",alignItems:"center"}}><Text>→</Text></Pressable>
    </View>
    <View style={{flexDirection:"row",gap:16}}>
      <Pressable accessibilityRole="button" accessibilityLabel={"Decrease "+label+" Y"} onPress={()=>nudge("y",-1)}
        style={{minHeight:44,minWidth:44,alignItems:"center",justifyContent:"center"}}><Text>↓</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={"Increase "+label+" Y"} onPress={()=>nudge("y",1)}
        style={{minHeight:44,minWidth:44,alignItems:"center",justifyContent:"center"}}><Text>↑</Text></Pressable>
    </View>
  </View>;
}
