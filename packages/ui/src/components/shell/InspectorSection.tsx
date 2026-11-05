import {use,useId,useMemo,type ReactNode} from "react";
import {Platform,Pressable,Switch,Text,View,type ViewProps} from "react-native";
import {useStore} from "zustand";
import {createStore} from "zustand/vanilla";
import {joinClasses} from "../styles.ts";
import {InspectorPanelContext,InspectorSectionContext} from "./inspector-context.ts";
import {matchingRowCount} from "./inspector-model.ts";

/** Props for {@linkcode InspectorSection}. */
export interface InspectorSectionProps extends Omit<ViewProps,"children"> {
  title:string;
  /** Controlled disclosure state. A search with matches inside shows the section open without changing it. */
  expanded:boolean;
  onExpandedChange:(expanded:boolean)=>void;
  /** With `onEnabledChange`, a switch in the header turns the whole group on or off. */
  enabled?:boolean;
  onEnabledChange?:(enabled:boolean)=>void;
  /** Restores the group's defaults. The Reset button shows only while `modified` is true. */
  onReset?:()=>void;
  /** @default true when `onReset` is given */
  modified?:boolean;
  children:ReactNode;
  className?:string;
  unstyled?:boolean;
}

// React Native Web passes var() through, so its switch takes the theme tokens.
// Native switches keep the platform's own colors.
const WEB_SWITCH_COLORS=Platform.OS==="web"?{
  trackColor:{true:"var(--color-primary)",false:"var(--color-border)"},
  thumbColor:"var(--color-surface-raised)",activeThumbColor:"var(--color-surface-raised)",
} as object:{};

// Fallback for a section rendered outside an InspectorPanel: nothing registers, so nothing filters.
const EMPTY_REGISTRY=createStore(()=>({rows:{}}));

/**
 * A collapsible group of properties. Sections nest, and nested ones indent.
 * The optional switch disables every row inside (rows and their editors get
 * `disabled` through {@linkcode PropertyRow}), and Reset restores the group's
 * defaults when something in it changed. While the inspector is filtered a
 * section with no matching row hides.
 */
export function InspectorSection({
  title,expanded,onExpandedChange,enabled,onEnabledChange,onReset,modified,children,className,unstyled=false,style,...rest
}:InspectorSectionProps){
  const styled=!unstyled;
  const id=useId();
  const panel=use(InspectorPanelContext);
  const parent=use(InspectorSectionContext);
  const disabled=parent.disabled||enabled===false;
  const path=useMemo(()=>[...parent.path,id],[parent.path,id]);
  const context=useMemo(()=>({path,disabled,depth:parent.depth+1}),[path,disabled,parent.depth]);
  const searching=!!panel?.query.trim();
  const matches=useStore(panel?.registry??EMPTY_REGISTRY,s=>matchingRowCount(s,id));
  const open=expanded||(searching&&matches>0);
  const showReset=!!onReset&&(modified??true);
  const indent=parent.depth*12;
  // A filtered-out section stays mounted (hidden) so its rows keep reporting whether they match.
  const hidden=searching&&matches===0;
  return <View {...rest} {...{role:"group",className:joinClasses(styled&&parent.depth===0&&"border-b border-border",className)}}
    accessibilityLabel={title} style={[hidden?{display:"none"}:null,style]}>
    {/* Indents are leading spacers, not paddingStart: React Native Web resolves start/end
        from I18nManager, not from the CSS direction a web app sets. */}
    <View style={{flexDirection:"row",alignItems:"center",minHeight:44,paddingHorizontal:4,gap:4}}>
      <View style={{width:4+indent}}/>
      <Pressable accessibilityRole="button" accessibilityLabel={title}
        accessibilityState={{expanded:open}} aria-expanded={open}
        onPress={()=>onExpandedChange(!expanded)}
        {...{className:joinClasses("min-h-11 flex-1 flex-row items-center gap-2",styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus")}}>
        <View pointerEvents="none" {...{className:joinClasses(styled&&"border-text-muted")}}
          style={{width:7,height:7,borderRightWidth:1.5,borderBottomWidth:1.5,transform:[{rotate:open?"45deg":"-45deg"}],marginHorizontal:4}}/>
        <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-sm font-semibold",styled&&(disabled?"text-text-muted":"text-text"))}}
          style={{flexShrink:1}}>{title}</Text>
      </Pressable>
      {showReset?<Pressable accessibilityRole="button" accessibilityLabel={"Reset "+title} onPress={onReset} disabled={parent.disabled}
        {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center",styled&&"rounded-control px-2 focus-visible:ring-2 focus-visible:ring-focus hover:bg-surface-sunken")}}>
        <Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>Reset</Text>
      </Pressable>:null}
      {/* React Native Web draws its switch thumb with physical offsets; under a CSS rtl
          direction the thumb leaves the track, so the web switch keeps ltr. */}
      {/* The switch itself is smaller than 44pt; this pointer-only wrapper extends its target. */}
      {onEnabledChange?<Pressable accessible={false} focusable={false} disabled={parent.disabled}
        onPress={()=>onEnabledChange(enabled===false)}
        style={{minHeight:44,minWidth:44,alignItems:"center",justifyContent:"center",
        ...(Platform.OS==="web"?{direction:"ltr" as const}:null)}}>
        <Switch accessibilityLabel={"Enable "+title} value={enabled!==false} disabled={parent.disabled}
          onValueChange={onEnabledChange} {...(styled?WEB_SWITCH_COLORS:{})}/>
      </Pressable>:null}
    </View>
    <InspectorSectionContext.Provider value={context}>
      <View aria-disabled={disabled||undefined} style={{display:open?"flex":"none",opacity:disabled?0.55:1,paddingBottom:open?6:0}}>
        {children}
      </View>
    </InspectorSectionContext.Provider>
  </View>;
}
