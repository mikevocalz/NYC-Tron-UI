import {use,useEffect,useId,useRef,type ReactNode} from "react";
import {Pressable,Text,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {joinClasses} from "../styles.ts";
import {InspectorPanelContext,InspectorSectionContext} from "./inspector-context.ts";
import {matchesQuery,registerRow} from "./inspector-model.ts";

/** What a {@linkcode PropertyRow} tells its editor. */
export interface PropertyEditorState {
  /** The row or a section around it is switched off. Pass it to the editor. */
  readonly disabled:boolean;
  /** The selected objects disagree on this value. */
  readonly mixed:boolean;
  /** Accessible name for the editor, e.g. "Opacity, mixed values". */
  readonly editorLabel:string;
}

/**
 * Where a value comes from. `inherited` shows it is not set on this object;
 * `overridden` marks a local change and offers to revert it.
 */
export type PropertyOverride="inherited"|"overridden";

/** Props for {@linkcode PropertyRow}. */
export interface PropertyRowProps extends Omit<ViewProps,"children"> {
  label:string;
  /** The editor, or a function that receives the row state to pass on. */
  children:ReactNode|((state:PropertyEditorState)=>ReactNode);
  /** The selection holds different values. The row shows "Mixed" and the editor gets `mixed`. */
  mixed?:boolean;
  override?:PropertyOverride;
  /** With `override="overridden"`, shows "Revert" and calls this. */
  onRevert?:()=>void;
  /** Extra words the inspector search matches, e.g. ["alpha", "transparency"]. */
  keywords?:readonly string[];
  disabled?:boolean;
  /** Below this measured width the label sits above the editor. @default 300 */
  stackBelow?:number;
  className?:string;
  unstyled?:boolean;
}

/**
 * One labelled property: label, editor, mixed-value indicator and override
 * state. The label and editor sit side by side and stack in narrow panes.
 * Inside an {@linkcode InspectorPanel} the row hides when it does not match
 * the search, and inside a switched-off {@linkcode InspectorSection} its
 * editor is told it is disabled.
 */
export function PropertyRow({
  label,children,mixed=false,override,onRevert,keywords,disabled=false,stackBelow=300,className,unstyled=false,style,onLayout,...rest
}:PropertyRowProps){
  const styled=!unstyled;
  const id=useId();
  const panel=use(InspectorPanelContext);
  const section=use(InspectorSectionContext);
  const match=matchesQuery(panel?.query??"",label,keywords);
  const sectionsKey=section.path.join("\u0000");
  useEffect(()=>panel?registerRow(panel.registry,id,{sections:section.path,match}):undefined,
    // section.path is memoized per section; the joined key keeps this stable across renders.
    [panel?.registry,id,sectionsKey,match]);
  const local=useRef<StoreApi<{width:number}>|null>(null);
  if(!local.current)local.current=createStore<{width:number}>(()=>({width:0}));
  const width=useStore(local.current,s=>s.width);
  const stacked=width>0&&width<stackBelow;
  const off=disabled||section.disabled;
  const editorLabel=label+(mixed?", mixed values":"")+(override==="inherited"?", inherited":"");
  const editor=typeof children==="function"?children({disabled:off,mixed,editorLabel}):children;
  const indent=Math.max(0,section.depth-1)*12;
  return <View {...rest} onLayout={event=>{local.current!.setState({width:event.nativeEvent.layout.width});onLayout?.(event);}}
    {...{role:"group",className:joinClasses(className)}} accessibilityLabel={editorLabel}
    style={[{display:match?"flex":"none",flexDirection:"row",minHeight:44,paddingHorizontal:8,paddingVertical:4},style]}>
    <View style={{width:4+indent}}/>
    <View style={{flex:1,minWidth:0,flexDirection:stacked?"column":"row",alignItems:stacked?"stretch":"center",gap:stacked?4:8}}>
    <View style={{flexDirection:"row",alignItems:"center",gap:6,width:stacked?undefined:"38%",minWidth:0}}>
      {override==="overridden"?<View accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
        {...{className:joinClasses(styled&&"border-accent")}} style={{width:6,height:6,borderRadius:3,borderWidth:3}}/>:null}
      <Text numberOfLines={2} {...{className:joinClasses(styled&&"text-sm",styled&&(off||override==="inherited"?"text-text-muted":"text-text"))}}
        style={{flexShrink:1,fontStyle:override==="inherited"?"italic":"normal"}}>{label}</Text>
      {mixed?<Text {...{className:joinClasses(styled&&"rounded-control border border-border text-text-muted text-xs px-1")}}>Mixed</Text>:null}
    </View>
    <View style={{flex:1,flexDirection:"row",alignItems:"center",gap:4,minWidth:0}}>
      <View style={{flex:1,minWidth:0}}>{editor}</View>
      {override==="overridden"&&onRevert?<Pressable accessibilityRole="button" accessibilityLabel={"Revert "+label} disabled={off}
        onPress={onRevert}
        {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center",styled&&"rounded-control px-2 focus-visible:ring-2 focus-visible:ring-focus hover:bg-surface-sunken")}}>
        <Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>Revert</Text>
      </Pressable>:null}
    </View>
    </View>
  </View>;
}
