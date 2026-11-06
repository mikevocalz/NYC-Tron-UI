import {useRef,type ComponentRef} from "react";
import {I18nManager,Platform,Pressable,ScrollView,Text,View,type ViewProps} from "react-native";
import type {Rect2D} from "../overlays/popover-position.ts";
import {joinClasses} from "../styles.ts";
import {MenuButton} from "./MenuButton.tsx";
import {SplitButton} from "./SplitButton.tsx";
import {nodeIsRTL,rovingTarget,shellKey} from "./shell-keys.ts";
import {inlineGalleryItems,ribbonTabLabel,validateRibbon,type RibbonCommand,type RibbonGallery,type RibbonTab} from "./ribbon-model.ts";

export type {RibbonButton,RibbonCommand,RibbonGallery,RibbonGalleryItem,RibbonGroup,RibbonSplit,RibbonTab} from "./ribbon-model.ts";

/** Props for {@linkcode RibbonTabs}. */
export interface RibbonTabsProps extends Omit<ViewProps,"children"> {
  /** Tabs in order. Include a contextual tab only while its selection is active. */
  tabs:readonly RibbonTab[];
  activeTabId:string;
  onTabChange:(id:string)=>void;
  /**
   * A command ran. For a split's flyout or a gallery, `itemId` names the
   * item; a split's primary action and plain buttons have none.
   */
  onCommand:(commandId:string,itemId?:string)=>void;
  /** Hides the command panel, leaving the tab row. Picking a tab while collapsed expands it. */
  collapsed?:boolean;
  onCollapsedChange?:(collapsed:boolean)=>void;
  /** Accessible name of the tab list. @default "Ribbon" */
  label?:string;
  usableRegions?:readonly Rect2D[];
  className?:string;
  unstyled?:boolean;
}

/**
 * Office-style command ribbon: a tab row (contextual tabs carry their group
 * name and an accent rule) over a panel of labelled command groups. Groups
 * hold buttons, toggles, {@linkcode SplitButton}s and inline galleries with
 * a "More" menu. Narrow panes scroll the panel horizontally instead of
 * dropping commands, and the panel can collapse to the tab row.
 */
export function RibbonTabs({
  tabs,activeTabId,onTabChange,onCommand,collapsed=false,onCollapsedChange,label="Ribbon",usableRegions,
  className,unstyled=false,style,...rest
}:RibbonTabsProps){
  validateRibbon(tabs);
  const styled=!unstyled;
  const refs=useRef<(ComponentRef<typeof Pressable>|null)[]>([]);
  const active=tabs.find(t=>t.id===activeTabId)??tabs[0];
  const activeIndex=active?tabs.indexOf(active):-1;
  const pick=(id:string)=>{
    if(id!==activeTabId)onTabChange(id);
    if(collapsed)onCollapsedChange?.(false);
  };
  const onKeyDown=(i:number)=>(event:unknown)=>{
    const k=shellKey(event);
    if(k.altKey||k.ctrlKey||k.metaKey)return;
    const next=rovingTarget(i,k.key,tabs.map(()=>false),"horizontal",nodeIsRTL(k.target)||I18nManager.isRTL);
    if(next===null)return;
    k.preventDefault();
    (refs.current[next] as unknown as {focus?:()=>void}|null)?.focus?.();
    pick(tabs[next]!.id);
  };
  const command=(c:RibbonCommand)=>{
    if(c.kind==="split")return <SplitButton key={c.id} label={c.label} icon={c.icon} items={c.items} disabled={c.disabled}
      usableRegions={usableRegions} unstyled={unstyled}
      onPress={()=>onCommand(c.id)} onSelect={item=>onCommand(c.id,item)}/>;
    if(c.kind==="gallery")return <Gallery key={c.id} gallery={c} styled={styled} usableRegions={usableRegions}
      onPick={item=>onCommand(c.id,item)}/>;
    const toggle=c.pressed!==undefined;
    return <Pressable key={c.id} accessibilityRole="button" accessibilityLabel={c.label} disabled={c.disabled}
      accessibilityState={{disabled:!!c.disabled,...(toggle?{selected:c.pressed}:{})}} aria-pressed={toggle?c.pressed:undefined}
      onPress={()=>onCommand(c.id)}
      {...{className:joinClasses("min-h-11 min-w-11 flex-row items-center gap-2 px-2",
        styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus",
        styled&&(c.pressed?"bg-primary/10 border border-focus":"hover:bg-surface-sunken"),c.disabled&&"opacity-40")}}>
      {c.icon?<View pointerEvents="none">{c.icon}</View>:null}
      <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-text text-sm")}}>{c.label}</Text>
    </Pressable>;
  };
  return <View {...rest} {...{className:joinClasses(styled&&"border-b border-border bg-surface-raised",className)}} style={style}>
    <View style={{flexDirection:"row",alignItems:"flex-end"}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flex:1}} contentContainerStyle={{paddingHorizontal:4}}>
        <View accessibilityRole="tablist" accessibilityLabel={label} style={{flexDirection:"row",alignItems:"flex-end",gap:2}}>
          {tabs.map((tab,i)=>{
            const selected=i===activeIndex;
            return <View key={tab.id} style={{alignItems:"stretch"}}>
              {tab.contextualGroup?<Text numberOfLines={1} {...{className:joinClasses(styled&&"text-accent text-xs font-semibold")}}
                style={{paddingHorizontal:12,paddingTop:2}} accessibilityElementsHidden importantForAccessibility="no">{tab.contextualGroup}</Text>:null}
              <Pressable ref={node=>{refs.current[i]=node;}} accessibilityRole="tab"
                accessibilityLabel={ribbonTabLabel(tab)} accessibilityState={{selected:selected&&!collapsed}} aria-selected={selected&&!collapsed}
                onPress={()=>pick(tab.id)}
                {...(Platform.OS==="web"?{onKeyDown:onKeyDown(i),tabIndex:selected?0:-1}:{})}
                {...{className:joinClasses("min-h-11 justify-center px-3",styled&&"focus-visible:ring-2 focus-visible:ring-focus",
                  styled&&tab.contextualGroup&&"border-t-2 border-accent")}}>
                <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-sm",styled&&(selected?"text-text font-semibold":"text-text-muted"))}}>{tab.label}</Text>
              </Pressable>
              {/* Selection rule is a border so forced colors keeps it. */}
              {/* Forced colors paints even transparent borders, so an unselected tab draws no rule at all. */}
              <View {...{className:joinClasses(styled&&selected&&!collapsed&&"border-primary")}}
                style={{height:selected&&!collapsed?0:3,borderTopWidth:selected&&!collapsed?3:0}}/>
            </View>;
          })}
        </View>
      </ScrollView>
      {onCollapsedChange?<Pressable accessibilityRole="button" accessibilityLabel={collapsed?"Show ribbon commands":"Hide ribbon commands"}
        aria-expanded={!collapsed} onPress={()=>onCollapsedChange(!collapsed)}
        {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center",styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus")}}>
        <View pointerEvents="none" {...{className:joinClasses(styled&&"border-text-muted")}}
          style={{width:8,height:8,borderRightWidth:1.5,borderBottomWidth:1.5,transform:[{rotate:collapsed?"45deg":"-135deg"}],marginTop:collapsed?-4:4}}/>
      </Pressable>:null}
    </View>
    {active&&!collapsed?<View accessibilityLabel={ribbonTabLabel(active)} {...{role:"tabpanel",className:joinClasses(styled&&"border-t border-border")}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{padding:4,gap:4,alignItems:"stretch"}}>
        {active.groups.map((group,gi)=><View key={group.id} style={{flexDirection:"row",gap:4}}>
          {gi>0?<View pointerEvents="none" {...{className:joinClasses(styled&&"border-border")}} style={{width:0,borderLeftWidth:1,marginVertical:4}}/>:null}
          <View accessibilityLabel={group.label} {...{role:"group"}} style={{paddingHorizontal:6,gap:2,justifyContent:"space-between"}}>
            <View style={{flexDirection:"row",alignItems:"center",gap:4}}>{group.commands.map(command)}</View>
            <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-text-muted text-xs")}} style={{textAlign:"center"}}>{group.label}</Text>
          </View>
        </View>)}
      </ScrollView>
    </View>:null}
  </View>;
}

function Gallery({gallery,styled,onPick,usableRegions}:{gallery:RibbonGallery;styled:boolean;onPick:(id:string)=>void;usableRegions?:readonly Rect2D[]}){
  const shown=inlineGalleryItems(gallery);
  return <View accessibilityLabel={gallery.label} {...{role:"radiogroup"}} style={{flexDirection:"row",alignItems:"center",gap:2}}>
    {shown.map(item=>{
      const on=item.id===gallery.selectedId;
      return <Pressable key={item.id} accessibilityLabel={item.label} {...{role:"radio"}} aria-checked={on}
        accessibilityState={{checked:on}} onPress={()=>onPick(item.id)}
        {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center",
          styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus",
          styled&&(on?"border border-focus bg-primary/10":"hover:bg-surface-sunken"))}}
        // Unselected items draw no border (forced colors would paint a transparent one); padding keeps the size.
        style={{padding:on&&styled?3:4}}>
        <View pointerEvents="none">{item.preview}</View>
      </Pressable>;
    })}
    {gallery.items.length>shown.length?<MenuButton label={`More ${gallery.label}`} usableRegions={usableRegions}
      items={gallery.items.map(i=>({id:i.id,label:i.label,description:i.id===gallery.selectedId?"Current":undefined}))}
      onSelect={onPick}>
      <Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>More</Text>
    </MenuButton>:null}
  </View>;
}
