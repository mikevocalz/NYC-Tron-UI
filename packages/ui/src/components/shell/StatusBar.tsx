import {useLayoutEffect,useRef,type ReactNode} from "react";
import {Pressable,Text,View,type ViewProps} from "react-native";
import type {Rect2D} from "../overlays/popover-position.ts";
import {joinClasses} from "../styles.ts";
import {MenuButton} from "./MenuButton.tsx";
import {
  activityAnnouncement,formatElapsed,formatZoom,progressPercent,selectionSummary,stepZoom,
  type SelectionNoun,type StatusActivity,
} from "./status-model.ts";

export type {SelectionNoun,StatusActivity} from "./status-model.ts";

/** Zoom readout and controls for {@linkcode StatusBar}. */
export interface StatusZoom {
  /** Current zoom in percent. */
  readonly value:number;
  /** Menu choices and the stops the step buttons move between. @default [25,50,100,200,400] */
  readonly presets?:readonly number[];
  readonly onChange:(percent:number)=>void;
  /** Adds a "Fit to window" choice. The app computes the fit. */
  readonly onFit?:()=>void;
}
/** Measurement-unit picker for {@linkcode StatusBar}. */
export interface StatusUnits {
  readonly value:string;
  readonly options:readonly {readonly value:string;readonly label:string}[];
  readonly onChange:(value:string)=>void;
}

/** Props for {@linkcode StatusBar}. */
export interface StatusBarProps extends Omit<ViewProps,"children"> {
  scope?:string;revision?:string|number;disabled?:boolean;
  zoom?:StatusZoom;
  units?:StatusUnits;
  /** Selected object count. Omit when the editor has no selection concept. */
  selection?:{readonly count:number;readonly noun?:SelectionNoun};
  /** @default {kind:"idle"} */
  activity?:StatusActivity;
  /** Extra app items before the built-in ones, e.g. a page number. */
  children?:ReactNode;
  /** Window-space regions the zoom and unit menus may use. @default the whole window */
  usableRegions?:readonly Rect2D[];
  className?:string;
  unstyled?:boolean;
}

const DEFAULT_PRESETS=[25,50,100,200,400];

/**
 * Document status strip: selection count, render, save and recording state,
 * measurement units and zoom. Activity changes are announced politely once;
 * the recording clock and render percentage are not re-announced per tick.
 * Items wrap onto a second row in narrow panes instead of clipping, and
 * every control is at least 44pt.
 */
export function StatusBar({
  scope="status",revision=0,disabled=false,zoom,units,selection,activity={kind:"idle"},children,usableRegions,className,unstyled=false,style,...rest
}:StatusBarProps){
  const styled=!unstyled;
  const muted=joinClasses(styled&&"text-text-muted text-xs");
  const text=joinClasses(styled&&"text-text text-xs");
  const presets=zoom?.presets??DEFAULT_PRESETS;
  if(presets.length>1000||presets.some(p=>!Number.isFinite(p)||p<=0)||new Set(presets).size!==presets.length)throw new RangeError("Invalid zoom presets");
  if(units&&(units.options.length>256||units.options.some(o=>!o.value.trim()||o.value.length>256||!o.label.trim()||o.label.length>512)||new Set(units.options.map(o=>o.value)).size!==units.options.length))throw new RangeError("Invalid status units");
  const boundary=JSON.stringify([scope,revision,disabled]);
  const committed=useRef<{boundary:string;zoom:typeof zoom;units:typeof units}|null>(null);
  useLayoutEffect(()=>{committed.current={boundary,zoom,units};});
  useLayoutEffect(()=>()=>{committed.current=null;},[]);
  const current=()=>!disabled&&committed.current?.boundary===boundary?committed.current:null;
  const percent=activity.kind==="rendering"?progressPercent(activity.progress):undefined;
  const announcement=activityAnnouncement(activity);
  const unitLabel=units?.options.find(o=>o.value===units.value)?.label??units?.value;
  const step=(direction:1|-1)=>{
    const z=current()?.zoom;if(!z)return;
    const next=stepZoom(z.value,z.presets??DEFAULT_PRESETS,direction);
    if(next!==z.value)z.onChange(next);
  };
  const stepButton=(direction:1|-1)=>{
    const blocked=disabled||!zoom||stepZoom(zoom.value,presets,direction)===zoom.value;
    return <Pressable accessibilityRole="button" accessibilityLabel={direction>0?"Zoom in":"Zoom out"}
      disabled={blocked} accessibilityState={{disabled:blocked}} onPress={()=>step(direction)}
      {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center",styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus hover:bg-surface-raised",blocked&&"opacity-40")}}>
      <View pointerEvents="none" style={{width:12,height:12,alignItems:"center",justifyContent:"center"}}>
        <View {...{className:joinClasses(styled&&"border-text")}} style={{position:"absolute",width:12,height:0,borderTopWidth:1.5}}/>
        {direction>0?<View {...{className:joinClasses(styled&&"border-text")}} style={{position:"absolute",width:0,height:12,borderLeftWidth:1.5}}/>:null}
      </View>
    </Pressable>;
  };
  return <View {...rest} accessibilityLabel="Status"
    {...{className:joinClasses(styled&&"border-t border-border bg-surface-sunken px-2",className)}}
    style={[{flexDirection:"row",flexWrap:"wrap",alignItems:"center",columnGap:12,minHeight:44},style]}>
    {children}
    {selection?<Text {...{className:text}} style={{fontVariant:["tabular-nums"]}}
      accessibilityLiveRegion="polite">{selectionSummary(selection.count,selection.noun)}</Text>:null}
    <View style={{flexDirection:"row",alignItems:"center",gap:6,flexGrow:1,minWidth:0}}>
      {activity.kind==="recording"?<>
        <View {...{className:joinClasses(styled&&"border-danger")}} style={{width:8,height:8,borderRadius:4,borderWidth:4}}/>
        <Text accessibilityLiveRegion="polite" {...{className:text}}>{announcement}</Text>
        <Text {...{className:muted}} style={{fontVariant:["tabular-nums"]}}
          accessibilityLabel={"Elapsed "+formatElapsed(activity.elapsedMs)}>{formatElapsed(activity.elapsedMs)}</Text>
      </>:activity.kind==="rendering"?<>
        <Text accessibilityLiveRegion="polite" {...{className:text}}>{announcement}</Text>
        <View accessibilityRole="progressbar" accessibilityLabel={announcement}
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}
          {...{className:joinClasses(styled&&"rounded-control border border-border")}} style={{width:96,height:6,overflow:"hidden"}}>
          {/* The fill is a border so forced-colors mode still shows progress. */}
          <View {...{className:joinClasses(styled&&"border-accent")}} style={{width:percent===undefined?"35%":`${percent}%`,height:0,borderTopWidth:4}}/>
        </View>
        {percent!==undefined?<Text {...{className:muted}} style={{fontVariant:["tabular-nums"]}}>{percent}%</Text>:null}
      </>:activity.kind==="error"?<Text accessibilityLiveRegion="polite" {...{className:joinClasses(styled&&"text-danger text-xs")}}
        numberOfLines={2} style={{flexShrink:1}}>{announcement}</Text>
      :announcement?<Text accessibilityLiveRegion="polite" {...{className:muted}}>{announcement}</Text>:null}
    </View>
    {units?<MenuButton editScope={boundary} disabled={disabled} unstyled={unstyled} label={"Units: "+unitLabel} usableRegions={usableRegions}
      items={units.options.map(o=>({id:o.value,label:o.label,description:o.value===units.value?"Current":undefined}))}
      onSelect={value=>{const u=current()?.units;if(u&&u.value!==value&&u.options.some(o=>o.value===value))u.onChange(value);}}
      {...{className:joinClasses(styled&&"px-2 hover:bg-surface-raised")}}>
      <Text {...{className:text}}>{unitLabel}</Text>
    </MenuButton>:null}
    {zoom?<View style={{flexDirection:"row",alignItems:"center"}}>
      {stepButton(-1)}
      <MenuButton editScope={boundary} disabled={disabled} unstyled={unstyled} label={"Zoom "+formatZoom(zoom.value)} usableRegions={usableRegions} menuWidth={180}
        items={[...(zoom.onFit?[{id:"fit",label:"Fit to window"}]:[]),
          ...presets.map(p=>({id:String(p),label:formatZoom(p)}))]}
        onSelect={id=>{
          const z=current()?.zoom;if(!z)return;
          if(id==="fit")z.onFit?.();
          else if(Number(id)!==z.value&&(z.presets??DEFAULT_PRESETS).includes(Number(id)))z.onChange(Number(id));
        }}
        {...{className:joinClasses(styled&&"px-1 hover:bg-surface-raised")}}>
        <Text {...{className:text}} style={{fontVariant:["tabular-nums"],minWidth:44,textAlign:"center"}}>{formatZoom(zoom.value)}</Text>
      </MenuButton>
      {stepButton(1)}
    </View>:null}
  </View>;
}
