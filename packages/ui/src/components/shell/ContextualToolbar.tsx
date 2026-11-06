import {useRef,type ReactNode} from 'react';
import {Pressable,Text,View,type ViewProps} from 'react-native';
import {createStore,type StoreApi} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {Toolbar} from '../Toolbar.tsx';
import {joinClasses} from '../styles.ts';
import {webToggleProps} from '../forge/toggle-a11y.ts';
import {MenuButton} from './MenuButton.tsx';
import {itemsForSelection,splitOverflow,validateToolbarItems,overflowDescription,type ToolbarItemSpec} from './contextual-toolbar-model.ts';

/** An action shown by {@linkcode ContextualToolbar}. */
export interface ContextualToolbarItem extends ToolbarItemSpec {readonly icon?:ReactNode;}
/** Controlled selection actions; the host executes commands and owns errors. */
export interface ContextualToolbarProps extends Omit<ViewProps,'children'> {
 readonly items:readonly ContextualToolbarItem[];readonly selectionKind:string;readonly label:string;
 readonly onAction:(id:string)=>void;readonly isRTL?:boolean;className?:string;unstyled?:boolean;
}
/** Priority overflow on top of the shared toolbar/menu; selection is never duplicated. */
export function ContextualToolbar({items,selectionKind,label,onAction,isRTL=false,className,unstyled=false,style,...rest}:ContextualToolbarProps){
 validateToolbarItems(items);
 const local=useRef<StoreApi<{width:number;widths:Record<string,number>}>|null>(null);
 if(!local.current)local.current=createStore(()=>({width:0,widths:{}}));
 const store=local.current,width=useStore(store,s=>s.width),widths=useStore(store,s=>s.widths);
 const applicable=itemsForSelection(items,selectionKind);
 const split=splitOverflow(applicable,{widths,available:Math.max(0,width-16),gap:4,overflowWidth:64,fallbackWidth:96});
 const invoke=(id:string)=>{if(!applicable.find(i=>i.id===id)?.disabledReason)onAction(id);};
 const renderItem=(item:ContextualToolbarItem,measure=false)=><Pressable key={item.id}
  onLayout={measure?e=>{const w=e.nativeEvent.layout.width;if(store.getState().widths[item.id]!==w)store.setState(s=>({widths:{...s.widths,[item.id]:w}}));}:undefined}
  accessible={!measure} focusable={!measure} {...(measure?{tabIndex:-1}:{})} accessibilityRole="button" accessibilityLabel={item.label} accessibilityHint={item.disabledReason}
  {...(item.pressed===undefined?{}:webToggleProps(item.pressed))} accessibilityState={{disabled:!!item.disabledReason,...(item.pressed===undefined?{}:{selected:item.pressed})}}
  disabled={!!item.disabledReason} onPress={()=>invoke(item.id)}
  {...{className:joinClasses(!unstyled&&'rounded-control px-3 gap-2 flex-row items-center justify-center focus-visible:ring-2 focus-visible:ring-focus',!unstyled&&(item.pressed?'bg-primary':'bg-surface-raised'),item.disabledReason&&'opacity-50')}} style={{minWidth:44,minHeight:44,flexShrink:0}}>
  {item.icon}<Text {...{className:joinClasses(!unstyled&&(item.pressed?'text-on-primary':'text-text'))}}>{item.label}</Text>
 </Pressable>;
 return <View {...rest} onLayout={e=>store.setState({width:e.nativeEvent.layout.width})} style={[{minWidth:0,direction:isRTL?'rtl':'ltr'},style]} {...{className}}>
  <Toolbar density="compact" actionsLabel={label} unstyled={unstyled} actions={<>
   {applicable.filter(i=>split.visible.includes(i.id)).map(i=>renderItem(i))}
   {split.overflow.length?<MenuButton label="More actions" items={applicable.filter(i=>split.overflow.includes(i.id)).map(i=>({id:i.id,label:i.label,...(overflowDescription(i)?{description:overflowDescription(i)}:{}),disabled:!!i.disabledReason}))} onSelect={invoke} unstyled={unstyled}><Text {...{className:!unstyled?'text-text':undefined}}>More</Text></MenuButton>:null}
  </>}/>
  {applicable.filter(i=>!!i.disabledReason).map(i=><Text key={i.id} {...{className:!unstyled?'text-text-muted text-sm':undefined}}>{i.label}: {i.disabledReason}</Text>)}
  <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" aria-hidden style={{position:'absolute',height:0,overflow:'hidden',opacity:0,flexDirection:'row'}}>{applicable.map(i=>renderItem(i,true))}</View>
 </View>;
}
