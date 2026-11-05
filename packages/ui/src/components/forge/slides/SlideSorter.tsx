import {useRef,type ReactNode} from "react";
import {I18nManager,Pressable,ScrollView,Text,View,type ViewProps} from "react-native";
import {joinClasses} from "../../styles.ts";
import {useLocalStore} from "../../useLocalStore.ts";
import {ToolButton,officeKey,type OfficeKeyEvent} from "../office/office-controls.tsx";
import {SlideThumbnail} from "./SlideThumbnail.tsx";
import {SLIDE_DEFAULT_SIZE,gridColumns,gridMove,moveBlock,nextSelection,slideLabel,type SlideObject,type SlideSize,type SlideSummary} from "./slide-model.ts";

/** Props for {@linkcode SlideSorter}. Selection is controlled; actions render only when their callbacks are passed. */
export interface SlideSorterProps extends Omit<ViewProps,"children"> {
  readonly slides:readonly SlideSummary[];
  readonly selectedIds:readonly string[];
  readonly onSelectionChange:(ids:string[])=>void;
  /** Opens a slide in the editor (double press or Enter). */
  readonly onOpen?:(id:string)=>void;
  /**
   * Applies a new deck order after the selection was moved as a block. The
   * host turns it into engine moves (`planMoves` gives single from/to steps).
   */
  readonly onReorder?:(order:string[])=>void|Promise<unknown>;
  /** Deletes the selected slides. Not offered when it would delete every slide. */
  readonly onRemove?:(ids:string[])=>void|Promise<unknown>;
  readonly size?:SlideSize;
  readonly renderImage?:(src:string,object:SlideObject)=>ReactNode;
  /** Smallest thumbnail width in points; columns are fitted to the measured width. @default 160 */
  readonly minThumbnailWidth?:number;
  className?:string;
  unstyled?:boolean;
}

const GAP=12;

/**
 * Slide sorter grid (J-02) with multiselect: a press selects one slide,
 * Cmd/Ctrl adds or removes, Shift selects a range, and "Select" mode makes
 * presses toggle on touch screens. The selection moves as a block to the
 * start, one place earlier or later, or the end. Arrow keys move focus in the
 * grid, Space toggles, Enter opens.
 */
export function SlideSorter({
  slides,selectedIds,onSelectionChange,onOpen,onReorder,onRemove,size=SLIDE_DEFAULT_SIZE,renderImage,minThumbnailWidth=160,
  className,unstyled=false,...rest
}:SlideSorterProps){
  const styled=!unstyled;
  const [local,store]=useLocalStore(()=>({width:0,anchor:undefined as string|undefined,multi:false}));
  const refs=useRef(new Map<number,{focus?:()=>void}|null>());
  const order=slides.map(s=>s.id);
  const columns=gridColumns(local.width,minThumbnailWidth,GAP);
  const cell=local.width>0?Math.floor((local.width-GAP*(columns-1))/columns):minThumbnailWidth;
  const selected=new Set(selectedIds);
  const count=selected.size;
  const indexes=order.map((id,i)=>selected.has(id)?i:-1).filter(i=>i>=0);
  const first=indexes[0]??-1,last=indexes.at(-1)??-1;
  const reorder=(to:number)=>{
    if(!onReorder||count===0)return;
    const next=moveBlock(order,selectedIds,to);
    if(next.some((id,i)=>id!==order[i]))void onReorder(next);
  };
  const pick=(id:string,mode:"replace"|"toggle"|"range")=>{
    const r=nextSelection(order,selectedIds,local.anchor,id,mode);
    store.set(s=>({...s,anchor:r.anchor}));
    onSelectionChange(r.selected);
  };
  const muted=joinClasses(styled&&"text-text-muted text-sm");
  return <View {...rest} accessibilityLabel="Slide sorter" {...{className:joinClasses("min-w-0",className)}}
    style={[{gap:10},rest.style as object]}>
    <View style={{flexDirection:"row",alignItems:"center",gap:4,flexWrap:"wrap"}}>
      <ToolButton label="Select" checked={local.multi} styled={styled} accessibilityHint="Presses add or remove slides from the selection"
        onPress={()=>store.set(s=>({...s,multi:!s.multi}))}/>
      <Text accessibilityLiveRegion="polite" {...{className:muted}} style={{paddingHorizontal:6}}>
        {count===0?"No slides selected":count===1?"1 slide selected":count+" slides selected"}
      </Text>
      {onReorder?<>
        <ToolButton label="Move to start" disabled={count===0||last<count} styled={styled} onPress={()=>reorder(0)}/>
        <ToolButton label="Move earlier" disabled={count===0||first<=0} styled={styled} onPress={()=>reorder(first-1)}/>
        <ToolButton label="Move later" disabled={count===0||last>=order.length-1} styled={styled} onPress={()=>reorder(first+1)}/>
        <ToolButton label="Move to end" disabled={count===0||first>=order.length-count} styled={styled} onPress={()=>reorder(order.length)}/>
      </>:null}
      {onRemove?<ToolButton label={count>1?"Delete "+count+" slides":"Delete slide"} disabled={count===0||count>=order.length}
        styled={styled} onPress={()=>void onRemove(order.filter(id=>selected.has(id)))}/>:null}
    </View>
    <ScrollView onLayout={e=>store.set(s=>({...s,width:e.nativeEvent.layout.width}))}
      contentContainerStyle={{flexDirection:"row",flexWrap:"wrap",gap:GAP}}>
      {slides.map((slide,index)=>{
        const on=selected.has(slide.id);
        const onKeyDown=(e:OfficeKeyEvent)=>{
          const {key,shift,mod}=officeKey(e);
          const next=gridMove(index,key,columns,slides.length,I18nManager.isRTL);
          let handled=true;
          if(next!==undefined){
            refs.current.get(next)?.focus?.();
            if(shift)pick(order[next]!,"range");
          }
          else if(key===" ")pick(slide.id,"toggle");
          else if(key==="Enter"&&onOpen)onOpen(slide.id);
          else if(mod&&key.toLowerCase()==="a")onSelectionChange([...order]);
          else handled=false;
          if(handled)(e as unknown as {preventDefault?:()=>void}).preventDefault?.();
        };
        return <View key={slide.id} style={{width:cell,gap:4}}>
          <Pressable ref={node=>{refs.current.set(index,node as unknown as {focus?:()=>void}|null);}}
            accessibilityRole="checkbox" accessibilityLabel={slideLabel(slide,index,slides.length)} accessibilityState={{checked:on}}
            accessibilityHint={onOpen?"Double tap to select. Use the open action to edit.":undefined}
            accessibilityActions={onOpen?[{name:"activate"},{name:"open",label:"Open slide"}]:[{name:"activate"}]}
            onAccessibilityAction={e=>{if(e.nativeEvent.actionName==="open")onOpen?.(slide.id);else pick(slide.id,"toggle");}}
            onPress={e=>{
              const n=(e as unknown as {nativeEvent?:{shiftKey?:boolean;metaKey?:boolean;ctrlKey?:boolean}}).nativeEvent??{};
              pick(slide.id,n.shiftKey?"range":n.metaKey||n.ctrlKey||local.multi?"toggle":"replace");
            }}
            {...{onKeyDown,onDoubleClick:onOpen?()=>onOpen(slide.id):undefined}}
            {...{className:joinClasses(styled&&"rounded-control border-2 focus-visible:ring-2 focus-visible:ring-focus",
              styled&&(on?"border-accent":"border-border"))}}
            style={{padding:2,overflow:"hidden"}}>
            <SlideThumbnail slide={slide} width={cell-8} size={size} renderImage={renderImage} styled={styled}/>
            {on?<View {...{className:joinClasses(styled&&"bg-accent")}}
              style={{position:"absolute",top:6,end:6,width:20,height:20,borderRadius:10,alignItems:"center",justifyContent:"center"}}>
              <View {...{className:joinClasses(styled&&"border-surface-raised")}}
                style={{width:9,height:5,borderStartWidth:2,borderBottomWidth:2,transform:[{rotate:"-45deg"}],marginTop:-2}}/>
            </View>:null}
          </Pressable>
          <Text {...{className:muted}} style={{fontVariant:["tabular-nums"],textAlign:"center"}}>{index+1}</Text>
        </View>;
      })}
    </ScrollView>
  </View>;
}
