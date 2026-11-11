import {useRef,useLayoutEffect,type ComponentRef,type ReactNode} from "react";
import {I18nManager,Platform,Pressable,Text,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {joinClasses} from "../styles.ts";
import {nodeIsRTL,shellKey} from "./shell-keys.ts";
import {filterPresets,galleryColumns,gridFocusTarget,validatePresets,type PresetFilter} from "./preset-model.ts";

export type {PresetFilter} from "./preset-model.ts";

/** One preset in a {@linkcode PresetGallery}. */
export interface Preset {
  readonly id:string;
  readonly name:string;
  /** Rendered thumbnail of what the preset does. */
  readonly preview:ReactNode;
  readonly favorite?:boolean;
}

/** Props for {@linkcode PresetGallery}. */
export interface PresetGalleryProps extends Omit<ViewProps,"children"> {
  /** Accessible name of the gallery, e.g. "Color grade presets". */
  scope?:string;revision?:string|number;disabled?:boolean;
  label:string;
  presets:readonly Preset[];
  selectedId:string|undefined;
  onSelect:(id:string)=>void;
  /**
   * Live preview: the preset under the pointer or keyboard focus, then
   * `undefined` when it leaves, so the app can restore the selection.
   */
  onPreview?:(id:string|undefined)=>void;
  /** Adds a favorite toggle to each tile and the All / Favorites filter. */
  onFavoriteChange?:(id:string,favorite:boolean)=>void;
  /** @default "all" */
  filter?:PresetFilter;
  onFilterChange?:(filter:PresetFilter)=>void;
  /** Smallest tile width in points. @default 112 */
  minTileWidth?:number;
  className?:string;
  unstyled?:boolean;
}

type Local={width:number;focus:number};
const GAP=8;

/**
 * Controlled preset picker. Tiles fill as many columns as fit, show a live
 * preview on hover and keyboard focus (the app applies it temporarily), and
 * select on press. On web the grid is one Tab stop with arrow, Home and End
 * movement. Each tile can carry a favorite toggle, and the Favorites filter
 * explains how to add one when it is empty.
 */
export function PresetGallery({
  scope="preset-gallery",revision=0,disabled=false,label,presets,selectedId,onSelect,onPreview,onFavoriteChange,filter="all",onFilterChange,minTileWidth=112,
  className,unstyled=false,style,onLayout,...rest
}:PresetGalleryProps){
  validatePresets(presets);
  const styled=!unstyled;
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({width:0,focus:-1}));
  const store=local.current;
  const width=useStore(store,s=>s.width);
  const focus=useStore(store,s=>s.focus);
  const refs=useRef<(ComponentRef<typeof Pressable>|null)[]>([]);
  const shown=filterPresets(presets,filter);
  const columns=galleryColumns(width,minTileWidth,GAP);
  const tileWidth=width>0?(width-GAP*(columns-1))/columns:minTileWidth;
  const selectedIndex=shown.findIndex(p=>p.id===selectedId);
  const stop=focus>=0&&focus<shown.length?focus:selectedIndex>=0?selectedIndex:0;
  const boundary=JSON.stringify([scope,revision,disabled,filter]);
  const committed=useRef<{boundary:string;presets:typeof presets;onSelect:typeof onSelect;onPreview:typeof onPreview;onFavoriteChange:typeof onFavoriteChange;onFilterChange:typeof onFilterChange}|null>(null);
  const previewOwner=useRef<{scope:string;id:string}|null>(null);
  useLayoutEffect(()=>{committed.current={boundary,presets,onSelect,onPreview,onFavoriteChange,onFilterChange};});
  useLayoutEffect(()=>{previewOwner.current=null;store.setState({focus:-1});},[scope,revision,disabled,store]);
  useLayoutEffect(()=>{const owner=previewOwner.current;if(owner&&owner.scope===scope&&!shown.some(p=>p.id===owner.id)){previewOwner.current=null;committed.current?.onPreview?.(undefined);}},[filter,presets,scope]);
  useLayoutEffect(()=>()=>{committed.current=null;previewOwner.current=null;},[]);
  const current=()=>!disabled&&committed.current?.boundary===boundary?committed.current:null;
  const select=(id:string)=>{const p=current();if(p?.presets.some(v=>v.id===id))p.onSelect(id);};
  const preview=(id:string)=>{const p=current();if(p?.presets.some(v=>v.id===id)){previewOwner.current={scope,id};p.onPreview?.(id);}};
  const clearPreview=(id:string)=>{const p=current(),owner=previewOwner.current;if(p&&owner?.scope===scope&&owner.id===id){previewOwner.current=null;p.onPreview?.(undefined);}};
  const favorite=(id:string)=>{const p=current(),preset=p?.presets.find(v=>v.id===id);if(preset)p?.onFavoriteChange?.(id,!preset.favorite);};
  const onKeyDown=(i:number)=>(event:unknown)=>{
    if(!current())return;
    const k=shellKey(event);
    if(k.altKey||k.ctrlKey||k.metaKey)return;
    const next=gridFocusTarget(i,k.key,shown.length,columns,nodeIsRTL(k.target)||I18nManager.isRTL);
    if(next===null)return;
    k.preventDefault();
    store.setState({focus:next});
    (refs.current[next] as unknown as {focus?:()=>void}|null)?.focus?.();
  };
  const filterButton=(value:PresetFilter,text:string)=>{
    const on=filter===value;
    return <Pressable key={value} accessibilityRole="button" accessibilityLabel={text} aria-pressed={on}
      disabled={disabled} accessibilityState={{selected:on,disabled}} onPress={()=>{if(!on)current()?.onFilterChange?.(value);}}
      {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center px-3",
        styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus",
        styled&&(on?"bg-surface-raised border border-border":"hover:bg-surface-sunken"))}}>
      <Text {...{className:joinClasses(styled&&"text-sm",styled&&(on?"text-text font-semibold":"text-text-muted"))}}>{text}</Text>
    </Pressable>;
  };
  return <View {...rest} {...{className:joinClasses("gap-2",className)}} style={style}>
    {onFavoriteChange&&onFilterChange?<View style={{flexDirection:"row",gap:4}} accessibilityLabel={label+" filter"} {...{role:"group"}}>
      {filterButton("all","All")}
      {filterButton("favorites","Favorites")}
    </View>:null}
    <View accessibilityLabel={label} {...{role:"radiogroup"}}
      onLayout={event=>{store.setState({width:event.nativeEvent.layout.width});onLayout?.(event);}}
      style={{flexDirection:"row",flexWrap:"wrap",gap:GAP}}>
      {shown.map((preset,i)=>{
        const selected=preset.id===selectedId;
        return <View key={preset.id} style={{width:tileWidth}}>
          <Pressable ref={node=>{refs.current[i]=node;}} {...{role:"radio"}} aria-checked={selected}
            accessibilityLabel={preset.name+(preset.favorite?", favorite":"")} disabled={disabled} accessibilityState={{checked:selected,disabled}}
            onPress={()=>select(preset.id)}
            onHoverIn={()=>preview(preset.id)} onHoverOut={()=>clearPreview(preset.id)}
            onFocus={()=>{if(current()){store.setState({focus:i});preview(preset.id);}}} onBlur={()=>clearPreview(preset.id)}
            {...(Platform.OS==="web"?{onKeyDown:onKeyDown(i),tabIndex:!disabled&&i===stop?0:-1}:{})}
            {...{className:joinClasses("min-h-11 gap-1",styled&&"rounded-card focus-visible:ring-2 focus-visible:ring-focus",
              styled&&(selected?"border-2 border-focus bg-primary/10":"hover:bg-surface-sunken"))}}
            // Unselected tiles draw no border (forced colors would paint a transparent one); padding keeps the size.
            style={{padding:selected&&styled?2:4}}>
            <View pointerEvents="none" {...{className:joinClasses(styled&&"rounded-control bg-surface-sunken")}}
              style={{aspectRatio:4/3,overflow:"hidden",alignItems:"stretch"}}>{preset.preview}</View>
            <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-sm",styled&&(selected?"text-text font-semibold":"text-text"))}}
              style={{paddingHorizontal:4,paddingBottom:2}}>{preset.name}</Text>
          </Pressable>
          {onFavoriteChange?<Pressable accessibilityRole="button"
            accessibilityLabel={(preset.favorite?"Remove ":"Add ")+preset.name+(preset.favorite?" from favorites":" to favorites")}
            aria-pressed={!!preset.favorite} disabled={disabled} accessibilityState={{selected:!!preset.favorite,disabled}}
            onPress={()=>favorite(preset.id)}
            {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center",styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus")}}
            style={{position:"absolute",top:4,right:4}}>
            <Bookmark on={!!preset.favorite} styled={styled}/>
          </Pressable>:null}
        </View>;
      })}
    </View>
    {!shown.length?<View style={{paddingVertical:16,gap:4}}>
      <Text {...{className:joinClasses(styled&&"text-text text-sm")}}>{filter==="favorites"?"No favorite presets yet.":"No presets."}</Text>
      {filter==="favorites"?<Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>
        Use the bookmark on a preset to keep it here.</Text>:null}
    </View>:null}
  </View>;
}

/** Bookmark glyph from borders, so forced colors keeps it. Filled when on. */
function Bookmark({on,styled}:{on:boolean;styled:boolean}){
  return <View pointerEvents="none" style={{width:22,height:22,alignItems:"center",justifyContent:"center"}}>
    <View {...{className:joinClasses(styled&&"border-text bg-surface-raised")}}
      style={{width:14,height:18,borderWidth:1.5,borderBottomWidth:0,borderTopLeftRadius:2,borderTopRightRadius:2,overflow:"hidden"}}>
      {on?<View {...{className:joinClasses(styled&&"border-accent")}} style={{position:"absolute",left:1.5,right:1.5,top:1.5,height:0,borderTopWidth:13}}/>:null}
    </View>
    {/* The notch: a square turned 45 degrees, showing the surface through the ribbon's tail. */}
    <View {...{className:joinClasses(styled&&"border-text bg-surface-raised")}}
      style={{position:"absolute",bottom:1,width:8,height:8,borderLeftWidth:1.5,borderTopWidth:1.5,transform:[{rotate:"45deg"}]}}/>
  </View>;
}
