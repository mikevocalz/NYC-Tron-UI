import {useRef} from "react";
import {PanResponder,Pressable,ScrollView,Text,TextInput,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {cancelPreview} from "../cancel-preview.ts";
import {joinClasses} from "../../styles.ts";
import {
 LAYER_TOUCH_TARGET,dragTargetIndex,formatOpacity,layerAccessibilityLabel,layerKindLabel,
 normalizeOpacity,opacityFromDrag,resolveRename,stepOpacity,validateLayers,type LayerRow,
} from "./layer-model.ts";

type OpacityPreview={id:string;value:number};
type Drag={id:string;from:number;to:number;dy:number};
type Rename={id:string;draft:string};
type Local={opacity:OpacityPreview|null;drag:Drag|null;rename:Rename|null};

/** Props for {@linkcode LayerStack}. Every layer value is controlled by the app. */
export interface LayerStackProps extends Omit<ViewProps,"children">{
 /** Layers top to bottom: index 0 is the topmost layer and the first row. */
 layers:readonly LayerRow[];
 /** Id of the selected layer, or `undefined` for no selection. */
 selectedId?:string;
 /** Called when a row is tapped or activated by a screen reader. */
 onSelect:(id:string)=>void;
 /** Called when the visibility control is toggled. */
 onToggleVisible:(id:string)=>void;
 /**
  * Called on every opacity change during a drag so the compositor can draw a
  * live preview. A cancelled drag calls it once more with the original value.
  */
 onOpacityPreview?:(id:string,value:number)=>void;
 /** Called once per completed opacity drag or screen-reader step, never per frame. */
 onOpacityCommit:(id:string,value:number)=>void|Promise<unknown>;
 /** Called once when a drag or move action lands a layer on a new index (0 = top). */
 onMove:(id:string,toIndex:number)=>void|Promise<unknown>;
 /** Called with the trimmed name when a rename is submitted. Blank or unchanged names are dropped. */
 onRename:(id:string,name:string)=>void|Promise<unknown>;
 /**
  * Fixed row height in points. Values below 44 are raised to 44.
  * @default 56
  */
 rowHeight?:number;
 /**
  * Screen-reader label for the list.
  * @default "Layers"
  */
 label?:string;
 /** @default "No layers" */
 emptyLabel?:string;
 /** Optional override; defaults to the theme's accent token. */
 accentColor?:string;
 className?:string;
 unstyled?:boolean;
}

/**
 * Controlled layer list for editors. Visibility, opacity, order, names and
 * selection all live in the app; the component holds only gesture previews.
 */
export function LayerStack({
 layers,selectedId,onSelect,onToggleVisible,onOpacityPreview,onOpacityCommit,onMove,onRename,
 rowHeight=56,label="Layers",emptyLabel="No layers",accentColor,className,unstyled=false,...rest
}:LayerStackProps){
 validateLayers(layers);
 const local=useRef<StoreApi<Local>|null>(null);
 if(!local.current)local.current=createStore<Local>(()=>({opacity:null,drag:null,rename:null}));
 const store=local.current;
 const drag=useStore(store,s=>s.drag);
 const height=Math.max(LAYER_TOUCH_TARGET,rowHeight);
 const styled=!unstyled;
 return <View {...rest} accessibilityLabel={label}
   {...{className:joinClasses("min-w-0 overflow-hidden",styled&&"rounded-control bg-surface-sunken",className)}}>
  {/* Scrolling is paused while a row is dragged so the handle keeps the gesture. */}
  <ScrollView scrollEnabled={drag===null} nestedScrollEnabled>
   {layers.length===0
    ?<Text {...{className:joinClasses(styled&&"text-text-muted")}} style={{padding:12}}>{emptyLabel}</Text>
    :layers.map((layer,index)=><LayerStackRow key={layer.id} store={store} layer={layer} index={index}
      count={layers.length} rowHeight={height} selected={layer.id===selectedId} styled={styled}
      accentColor={accentColor} onSelect={onSelect} onToggleVisible={onToggleVisible}
      onOpacityPreview={onOpacityPreview} onOpacityCommit={onOpacityCommit} onMove={onMove} onRename={onRename}/>)}
  </ScrollView>
 </View>;
}

type RowProps={
 store:StoreApi<Local>;layer:LayerRow;index:number;count:number;rowHeight:number;selected:boolean;
 styled:boolean;accentColor:string|undefined;
}&Pick<LayerStackProps,"onSelect"|"onToggleVisible"|"onOpacityPreview"|"onOpacityCommit"|"onMove"|"onRename">;

function LayerStackRow(props:RowProps){
 const {store,layer,index,count,rowHeight,selected,styled,accentColor}=props;
 const latest=useRef(props);
 latest.current=props;
 const opacityPreview=useStore(store,s=>s.opacity?.id===layer.id?s.opacity.value:undefined);
 const drag=useStore(store,s=>s.drag?.id===layer.id?s.drag:null);
 const rename=useStore(store,s=>s.rename?.id===layer.id?s.rename:null);
 const locked=layer.locked===true;
 const opacity=opacityPreview??layer.opacity;
 const trackWidth=useRef(0);
 const opacityStart=useRef(layer.opacity);

 const cancelOpacity=()=>{
  const p=latest.current;
  cancelPreview(p.layer.opacity,()=>store.setState({opacity:null}),
   value=>p.onOpacityPreview?.(p.layer.id,value));
 };
 const commitOpacity=(value:number)=>{
  const p=latest.current;
  store.setState({opacity:null});
  const next=normalizeOpacity(value);
  if(next!==p.layer.opacity)void p.onOpacityCommit(p.layer.id,next);
 };
 const opacityPan=useRef<ReturnType<typeof PanResponder.create>|null>(null);
 if(!opacityPan.current)opacityPan.current=PanResponder.create({
  onStartShouldSetPanResponder:()=>latest.current.layer.locked!==true,
  onMoveShouldSetPanResponder:()=>latest.current.layer.locked!==true,
  onPanResponderGrant:()=>{
   const p=latest.current;
   opacityStart.current=p.layer.opacity;
   store.setState({opacity:{id:p.layer.id,value:p.layer.opacity}});
  },
  onPanResponderMove:(_e,g)=>{
   const p=latest.current;
   const next=opacityFromDrag(opacityStart.current,g.dx,trackWidth.current);
   const current=store.getState().opacity;
   if(current?.id===p.layer.id&&current.value!==next){
    store.setState({opacity:{id:p.layer.id,value:next}});
    p.onOpacityPreview?.(p.layer.id,next);
   }
  },
  onPanResponderRelease:()=>{
   const current=store.getState().opacity;
   if(current?.id===latest.current.layer.id)commitOpacity(current.value);
  },
  onPanResponderTerminate:cancelOpacity,
  onPanResponderTerminationRequest:()=>false,
 });

 const move=(toIndex:number)=>{
  const p=latest.current;
  if(p.layer.locked||toIndex<0||toIndex>=p.count||toIndex===p.index)return;
  void p.onMove(p.layer.id,toIndex);
 };
 const dragPan=useRef<ReturnType<typeof PanResponder.create>|null>(null);
 if(!dragPan.current)dragPan.current=PanResponder.create({
  onStartShouldSetPanResponder:()=>latest.current.layer.locked!==true,
  onMoveShouldSetPanResponder:()=>latest.current.layer.locked!==true,
  onPanResponderGrant:()=>{
   const p=latest.current;
   store.setState({drag:{id:p.layer.id,from:p.index,to:p.index,dy:0}});
  },
  onPanResponderMove:(_e,g)=>{
   const p=latest.current;
   const current=store.getState().drag;
   if(current?.id!==p.layer.id)return;
   store.setState({drag:{...current,dy:g.dy,to:dragTargetIndex(current.from,g.dy,p.rowHeight,p.count)}});
  },
  onPanResponderRelease:()=>{
   const current=store.getState().drag;
   store.setState({drag:null});
   if(current?.id===latest.current.layer.id&&current.to!==current.from)move(current.to);
  },
  // A cancelled drag never reorders.
  onPanResponderTerminate:()=>store.setState({drag:null}),
  onPanResponderTerminationRequest:()=>false,
 });

 const startRename=()=>{
  if(!latest.current.layer.locked)store.setState({rename:{id:layer.id,draft:layer.name}});
 };
 const finishRename=()=>{
  const current=store.getState().rename;
  if(current?.id!==layer.id)return;
  store.setState({rename:null});
  const next=resolveRename(latest.current.layer.name,current.draft);
  if(next!==undefined)void latest.current.onRename(layer.id,next);
 };

 const stepActions=(direction:-1|1)=>{
  if(!locked)commitOpacity(stepOpacity(layer.opacity,direction));
 };
 const rowActions=[
  {name:"activate"},
  ...(!locked&&index>0?[{name:"moveUp",label:"Move up"}]:[]),
  ...(!locked&&index<count-1?[{name:"moveDown",label:"Move down"}]:[]),
  ...(!locked?[{name:"rename",label:"Rename"}]:[]),
 ];
 const accent=accentColor?{backgroundColor:accentColor}:null;
 const text=joinClasses(styled&&(layer.visible?"text-text":"text-text-muted"));
 const muted=joinClasses(styled&&"text-text-muted");
 const percent=Math.round(opacity*100);
 const dimmed={opacity:locked?0.45:1};

 return <View
   {...{className:joinClasses(styled&&"border-b border-border",styled&&(selected||drag)&&"bg-surface-raised")}}
   style={{height:rowHeight,flexDirection:"row",alignItems:"center",
    zIndex:drag?1:0,transform:drag?[{translateY:drag.dy}]:undefined}}>
  <View pointerEvents="none" {...{className:joinClasses(styled&&selected&&!accentColor&&"bg-accent")}}
   style={{position:"absolute",left:0,top:0,bottom:0,width:3,...(selected?accent:null)}}/>
  {/* Screen readers reorder through the row's move actions instead of this handle. */}
  <View {...dragPan.current.panHandlers} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden
   style={{width:LAYER_TOUCH_TARGET,height:LAYER_TOUCH_TARGET,alignItems:"center",justifyContent:"center",gap:3,...dimmed}}>
   {[0,1,2].map(i=><View key={i} {...{className:joinClasses(styled&&"bg-text-muted")}}
    style={{width:16,height:2,borderRadius:1}}/>)}
  </View>
  <Pressable accessibilityRole="switch" accessibilityLabel={"Show "+layer.name}
   accessibilityState={{checked:layer.visible}} onPress={()=>latest.current.onToggleVisible(layer.id)}
   {...{className:joinClasses(styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus")}}
   style={{width:LAYER_TOUCH_TARGET,height:LAYER_TOUCH_TARGET,alignItems:"center",justifyContent:"center"}}>
   <VisibilityGlyph visible={layer.visible} styled={styled}/>
  </Pressable>
  <View style={{flex:1,minWidth:0,height:LAYER_TOUCH_TARGET,justifyContent:"center"}}>
   {rename
    ?<TextInput autoFocus selectTextOnFocus accessibilityLabel={"Name for "+layer.name}
      value={rename.draft} returnKeyType="done"
      onChangeText={draft=>store.setState({rename:{id:layer.id,draft}})}
      onSubmitEditing={finishRename} onBlur={finishRename}
      onKeyPress={e=>{if(e.nativeEvent.key==="Escape")store.setState({rename:null});}}
      {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-sunken text-text")}}
      style={{minHeight:LAYER_TOUCH_TARGET,paddingHorizontal:8}}/>
    :<Pressable accessibilityRole="button" accessibilityLabel={layerAccessibilityLabel(layer,index,count)}
      accessibilityHint={locked?undefined:"Double tap to select. Long press to rename."}
      accessibilityState={{selected}} accessibilityActions={rowActions}
      onAccessibilityAction={e=>{
       const action=e.nativeEvent.actionName;
       if(action==="activate")latest.current.onSelect(layer.id);
       else if(action==="moveUp")move(index-1);
       else if(action==="moveDown")move(index+1);
       else if(action==="rename")startRename();
      }}
      onPress={()=>latest.current.onSelect(layer.id)} onLongPress={startRename}
      {...{className:joinClasses(styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus")}}
      style={{minHeight:LAYER_TOUCH_TARGET,justifyContent:"center",paddingHorizontal:4}}>
      <Text numberOfLines={1} {...{className:text}} style={{fontWeight:selected?"700":"500"}}>{layer.name}</Text>
      <Text numberOfLines={1} {...{className:muted}} style={{fontSize:12}}>
       {layerKindLabel(layer.kind)+(locked?", locked":"")}
      </Text>
     </Pressable>}
  </View>
  <View {...opacityPan.current.panHandlers}
   accessible accessibilityRole="adjustable" accessibilityLabel={layer.name+" opacity"}
   accessibilityValue={{min:0,max:100,now:percent,text:formatOpacity(opacity)}}
   accessibilityState={{disabled:locked}}
   accessibilityActions={[{name:"increment"},{name:"decrement"}]}
   onAccessibilityAction={e=>{
    if(e.nativeEvent.actionName==="increment")stepActions(1);
    if(e.nativeEvent.actionName==="decrement")stepActions(-1);
   }}
   style={{width:120,height:LAYER_TOUCH_TARGET,flexDirection:"row",alignItems:"center",gap:8,paddingRight:12,...dimmed}}>
   <View onLayout={e=>{trackWidth.current=e.nativeEvent.layout.width;}}
    {...{className:joinClasses(styled&&"bg-surface-raised")}}
    style={{flex:1,height:4,borderRadius:2,overflow:"hidden"}}>
    <View {...{className:joinClasses(styled&&!accentColor&&"bg-accent")}}
     style={{width:percent+"%",height:4,...accent}}/>
   </View>
   <Text {...{className:muted}} style={{width:40,textAlign:"right",fontVariant:["tabular-nums"],fontSize:12}}>
    {formatOpacity(opacity)}
   </Text>
  </View>
 </View>;
}

/** Eye-like ring: filled pupil when visible, struck through when hidden. */
function VisibilityGlyph({visible,styled}:{visible:boolean;styled:boolean}){
 return <View pointerEvents="none" style={{width:20,height:12,alignItems:"center",justifyContent:"center"}}>
  <View {...{className:joinClasses(styled&&(visible?"border-text":"border-text-muted"))}}
   style={{width:20,height:12,borderRadius:6,borderWidth:1.5,alignItems:"center",justifyContent:"center"}}>
   {visible?<View {...{className:joinClasses(styled&&"bg-text")}} style={{width:5,height:5,borderRadius:2.5}}/>:null}
  </View>
  {visible?null:<View {...{className:joinClasses(styled&&"bg-text-muted")}}
   style={{position:"absolute",width:24,height:1.5,transform:[{rotate:"-30deg"}]}}/>}
 </View>;
}
