import {useRef,type ReactNode} from "react";
import {I18nManager,PanResponder,Pressable,ScrollView,Text,View,type ViewProps} from "react-native";
import {joinClasses} from "../../styles.ts";
import {useLocalStore} from "../../useLocalStore.ts";
import {dragTargetIndex} from "../layers/layer-model.ts";
import {OFFICE_TOUCH_TARGET,PlusGlyph,officeKey,type OfficeKeyEvent} from "../office/office-controls.tsx";
import {SlideThumbnail} from "./SlideThumbnail.tsx";
import {SLIDE_DEFAULT_SIZE,slideLabel,type SlideObject,type SlideSize,type SlideSummary} from "./slide-model.ts";

/** Props for {@linkcode SlideFilmstrip}. Each action renders only when its callback is passed. */
export interface SlideFilmstripProps extends Omit<ViewProps,"children"> {
  readonly slides:readonly SlideSummary[];
  readonly selectedId?:string;
  readonly onSelect:(id:string)=>void;
  /** Moves a slide to `toIndex` (0-based). Drag, Alt+Up/Down and screen-reader actions call it once per move. */
  readonly onMove?:(id:string,toIndex:number)=>void|Promise<unknown>;
  /** Adds a slide after the selected one (or at the end). */
  readonly onAdd?:()=>void|Promise<unknown>;
  /** Removes a slide. Not offered when only one slide is left. */
  readonly onRemove?:(id:string)=>void|Promise<unknown>;
  readonly size?:SlideSize;
  readonly renderImage?:(src:string,object:SlideObject)=>ReactNode;
  /** Thumbnail width in points. @default 136 */
  readonly thumbnailWidth?:number;
  /**
   * `horizontal` lays slides out in a row for phones and short panes; drag and
   * Alt+Left/Right then reorder along it.
   * @default "vertical"
   */
  readonly orientation?:"vertical"|"horizontal";
  className?:string;
  unstyled?:boolean;
}

type Drag={id:string;from:number;to:number;dy:number};

/**
 * Vertical slide filmstrip (J-01): numbered thumbnails drawn from the slide's
 * objects, selection, reorder by the grip, Alt+Up/Down or screen-reader
 * actions, add, and remove (Delete key or action). A cancelled drag never
 * moves anything.
 */
export function SlideFilmstrip({
  slides,selectedId,onSelect,onMove,onAdd,onRemove,size=SLIDE_DEFAULT_SIZE,renderImage,thumbnailWidth=136,orientation="vertical",
  className,unstyled=false,...rest
}:SlideFilmstripProps){
  const styled=!unstyled;
  const [state,store]=useLocalStore<{drag:Drag|null}>(()=>({drag:null}));
  const horizontal=orientation==="horizontal";
  // Each slide's extent along the strip: what a drag distance is divided by to find the drop index.
  const rowHeight=horizontal?thumbnailWidth+40:thumbnailWidth*size.height/size.width+16;
  return <View {...rest} accessibilityLabel="Slides" {...{className:joinClasses("min-w-0",styled&&"bg-surface-sunken",className)}}
    style={[{gap:8,flexDirection:horizontal?"row":"column",alignItems:horizontal?"center":"stretch"},rest.style as object]}>
    <ScrollView horizontal={horizontal} scrollEnabled={state.drag===null} style={{flexShrink:1}}
      contentContainerStyle={horizontal?{paddingHorizontal:4,flexDirection:"row"}:{paddingVertical:4}}>
      {slides.map((slide,index)=><FilmstripRow key={slide.id} slide={slide} index={index} count={slides.length}
        selected={slide.id===selectedId} drag={state.drag?.id===slide.id?state.drag:null} store={store} rowHeight={rowHeight}
        thumbnailWidth={thumbnailWidth} size={size} renderImage={renderImage} styled={styled} horizontal={horizontal}
        onSelect={onSelect} onMove={onMove} onRemove={onRemove}/>)}
    </ScrollView>
    {onAdd?<Pressable accessibilityRole="button" accessibilityLabel="New slide" onPress={()=>void onAdd()}
      {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-raised focus-visible:ring-2 focus-visible:ring-focus")}}
      style={{minHeight:OFFICE_TOUCH_TARGET,minWidth:OFFICE_TOUCH_TARGET,flexDirection:"row",alignItems:"center",justifyContent:"center",gap:8,
        marginHorizontal:horizontal?4:8,paddingHorizontal:horizontal?10:0}}>
      <PlusGlyph styled={styled} size={12}/>
      {horizontal?null:<Text {...{className:joinClasses(styled&&"text-text text-sm")}}>New slide</Text>}
    </Pressable>:null}
  </View>;
}

type RowProps={
  slide:SlideSummary;index:number;count:number;selected:boolean;drag:Drag|null;
  store:{get:()=>{drag:Drag|null};set:(v:{drag:Drag|null})=>void};rowHeight:number;thumbnailWidth:number;size:SlideSize;
  renderImage:SlideFilmstripProps["renderImage"];styled:boolean;horizontal:boolean;
}&Pick<SlideFilmstripProps,"onSelect"|"onMove"|"onRemove">;

function FilmstripRow(props:RowProps){
  const {slide,index,count,selected,drag,store,rowHeight,thumbnailWidth,size,renderImage,styled,horizontal}=props;
  const latest=useRef(props);
  latest.current=props;
  const move=(to:number)=>{
    const p=latest.current;
    if(!p.onMove||to<0||to>=p.count||to===p.index)return;
    void p.onMove(p.slide.id,to);
  };
  const removable=props.onRemove!==undefined&&count>1;
  const remove=()=>{const p=latest.current;if(p.onRemove&&p.count>1)void p.onRemove(p.slide.id);};
  const pan=useRef<ReturnType<typeof PanResponder.create>|null>(null);
  if(!pan.current)pan.current=PanResponder.create({
    onStartShouldSetPanResponder:()=>latest.current.onMove!==undefined,
    onMoveShouldSetPanResponder:()=>latest.current.onMove!==undefined,
    onPanResponderGrant:()=>{const p=latest.current;store.set({drag:{id:p.slide.id,from:p.index,to:p.index,dy:0}});},
    onPanResponderMove:(_e,g)=>{
      const p=latest.current;
      const d=store.get().drag;
      if(d?.id!==p.slide.id)return;
      // Along a horizontal strip the start edge is the right edge in RTL.
      const along=p.horizontal?(I18nManager.isRTL?-g.dx:g.dx):g.dy;
      store.set({drag:{...d,dy:along,to:dragTargetIndex(d.from,along,p.rowHeight,p.count)}});
    },
    onPanResponderRelease:()=>{
      const d=store.get().drag;
      store.set({drag:null});
      if(d&&d.id===latest.current.slide.id&&d.to!==d.from)move(d.to);
    },
    onPanResponderTerminate:()=>store.set({drag:null}),
    onPanResponderTerminationRequest:()=>false,
  });
  const onKeyDown=(e:OfficeKeyEvent)=>{
    const {key,alt}=officeKey(e);
    let handled=true;
    const back=horizontal?(I18nManager.isRTL?"ArrowRight":"ArrowLeft"):"ArrowUp";
    const forward=horizontal?(I18nManager.isRTL?"ArrowLeft":"ArrowRight"):"ArrowDown";
    if(alt&&key===back)move(index-1);
    else if(alt&&key===forward)move(index+1);
    else if((key==="Delete"||key==="Backspace")&&removable)remove();
    else handled=false;
    if(handled)(e as unknown as {preventDefault?:()=>void}).preventDefault?.();
  };
  const actions=[
    {name:"activate"},
    ...(props.onMove&&index>0?[{name:"moveUp",label:"Move earlier"}]:[]),
    ...(props.onMove&&index<count-1?[{name:"moveDown",label:"Move later"}]:[]),
    ...(removable?[{name:"remove",label:"Delete slide"}]:[]),
  ];
  const shift=drag?(horizontal?[{translateX:I18nManager.isRTL?-drag.dy:drag.dy}]:[{translateY:drag.dy}]):undefined;
  return <View style={{...(horizontal?{width:rowHeight,flexDirection:"column-reverse",paddingVertical:4}:{height:rowHeight,flexDirection:"row",paddingHorizontal:4}),
    alignItems:"center",zIndex:drag?1:0,transform:shift}}>
    <View style={{...(horizontal?{flexDirection:"row",height:OFFICE_TOUCH_TARGET}:{width:28}),alignItems:"center",gap:6}}>
      <Text {...{className:joinClasses(styled&&(selected?"text-text":"text-text-muted"))}}
        style={{fontVariant:["tabular-nums"],fontSize:12,fontWeight:selected?"700":"400"}}>{index+1}</Text>
      {props.onMove?<View {...pan.current.panHandlers} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden
        style={{width:horizontal?OFFICE_TOUCH_TARGET:28,height:OFFICE_TOUCH_TARGET,alignItems:"center",justifyContent:"center",gap:3}}>
        {[0,1,2].map(i=><View key={i} {...{className:joinClasses(styled&&"bg-text-muted")}} style={{width:12,height:2,borderRadius:1}}/>)}
      </View>:null}
    </View>
    <Pressable accessibilityRole="button" accessibilityLabel={slideLabel(slide,index,count)} accessibilityState={{selected}}
      accessibilityActions={actions}
      onAccessibilityAction={e=>{
        const a=e.nativeEvent.actionName;
        if(a==="activate")latest.current.onSelect(slide.id);
        else if(a==="moveUp")move(index-1);
        else if(a==="moveDown")move(index+1);
        else if(a==="remove")remove();
      }}
      // React Native Web drops `selected` on buttons; aria-current marks the slide being edited there.
      onPress={()=>latest.current.onSelect(slide.id)} {...{onKeyDown,"aria-current":selected?"true":undefined}}
      {...{className:joinClasses(styled&&"rounded-control border-2 focus-visible:ring-2 focus-visible:ring-focus",
        styled&&(selected||drag?"border-accent":"border-border"))}}
      style={{padding:2,overflow:"hidden"}}>
      <SlideThumbnail slide={slide} width={thumbnailWidth} size={size} renderImage={renderImage} styled={styled}/>
    </Pressable>
  </View>;
}
