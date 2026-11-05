import {useEffect,useMemo,useRef,type ComponentRef} from "react";
import {Modal,Platform,Pressable,ScrollView,Text,TextInput,View,type PressableProps,
 type TextInputKeyPressEvent} from "react-native";
import {useStore} from "zustand";
import {createStore,type StoreApi} from "zustand/vanilla";
import {TextField} from "../TextField.tsx";
import {joinClasses} from "../styles.ts";
import {placePopover,type Rect2D} from "./popover-position.ts";
import {cycleFocusTarget} from "./focus-cycle.ts";
import {useRestoreFocus} from "./focus-restore.ts";
import {filterCommands,nextActiveCommand,reconcileActiveCommand,validateCommands,
 type PaletteCommand} from "./command-filter.ts";
export type {PaletteCommand} from "./command-filter.ts";

export interface CommandPaletteProps{
 /** Controlled. The app owns the shortcut (for example Cmd/Ctrl+K) that sets this. */
 open:boolean;
 onOpenChange:(open:boolean)=>void;
 /** Called with the chosen command; the palette then closes itself through onOpenChange(false). */
 onSelect:(id:string)=>void;
 commands:readonly PaletteCommand[];
 /** Same coordinate space and rules as placePopover. */
 anchor:Rect2D;
 usableRegions:readonly Rect2D[];
 /** Accessible name of the dialog and the visible search label. */
 label?:string;
 placeholder?:string;
 emptyText?:string;
 width?:number;
 maxHeight?:number;
 className?:string;
 unstyled?:boolean;
 testID?:string;
}
type PaletteState={query:string;activeId:string|undefined};
type KeyEvent=Parameters<NonNullable<PressableProps["onKeyDown"]>>[0];
type KeyData={key:string;shiftKey?:boolean;altKey?:boolean;ctrlKey?:boolean;metaKey?:boolean};
const SEARCH="search";
const ROW_HEIGHT=56;

/**
 * Searchable command list placed with placePopover. Focus stays in the search
 * field while arrows move the highlighted result (the field carries the
 * listbox relationship), Enter runs it, Escape closes. Tab and Shift+Tab cycle
 * between the field and the enabled results without leaving the palette, and
 * focus returns to whatever opened it. Global shortcut registration is the
 * app's job.
 */
export function CommandPalette({open,onOpenChange,onSelect,commands,anchor,usableRegions,
 label="Command palette",placeholder="Type a command",emptyText="No matching commands",
 width=420,maxHeight=440,className,unstyled=false,testID}:CommandPaletteProps){
 validateCommands(commands);
 const styled=!unstyled;
 const local=useRef<StoreApi<PaletteState>|null>(null);
 if(!local.current)local.current=createStore<PaletteState>(()=>({query:"",activeId:undefined}));
 const store=local.current;
 const query=useStore(store,state=>state.query);
 const storedActive=useStore(store,state=>state.activeId);
 const results=useMemo(()=>filterCommands(commands,query),[commands,query]);
 const activeId=reconcileActiveCommand(results,storedActive);
 const field=useRef<ComponentRef<typeof TextInput>>(null);
 const rows=useRef(new Map<string,ComponentRef<typeof View>>());
 useRestoreFocus(open);
 // Every opening starts from an empty search.
 useEffect(()=>{if(open)store.setState({query:"",activeId:undefined});},[open,store]);

 const close=()=>onOpenChange(false);
 const run=(id:string|undefined)=>{
  const command=id?results.find(item=>item.id===id):undefined;
  if(!command||command.disabled)return;
  close();onSelect(command.id);
 };
 const stops=[SEARCH,...results.filter(item=>!item.disabled).map(item=>item.id)];
 const focusStop=(id:string|undefined)=>{
  if(id===SEARCH)field.current?.focus();
  else if(id)rows.current.get(id)?.focus();
 };
 const onKey=(data:KeyData,from:string,prevent:()=>void)=>{
  if(data.altKey||data.ctrlKey||data.metaKey)return;
  if(data.key==="Tab"){prevent();focusStop(cycleFocusTarget(stops,from,!!data.shiftKey));return;}
  if(from!==SEARCH)return;
  const next=nextActiveCommand(results,activeId,data.key);
  if(next){prevent();store.setState({activeId:next});}
 };
 const position=placePopover(anchor,usableRegions,width,
  Math.min(maxHeight,ROW_HEIGHT*Math.max(1,results.length)+96));
 const listId=(testID??"command-palette")+"-results";
 const optionId=(id:string)=>listId+"-"+id;

 return <Modal visible={open} transparent onRequestClose={close}
   animationType={Platform.OS==="web"?"none":"fade"} accessibilityViewIsModal>
  <View style={{flex:1}}>
   <Pressable accessibilityRole="button" accessibilityLabel="Close command palette" onPress={close}
     focusable={false}
     style={{position:"absolute",top:0,right:0,bottom:0,left:0,backgroundColor:"rgba(0,0,0,0.32)"}}/>
   <View testID={testID} role="dialog" aria-modal aria-label={label}
     {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-raised p-2 gap-2",className)}}
     style={{position:"absolute",left:position.x,top:position.y,width:position.width,
       maxHeight:position.height,overflow:"hidden"}}>
    <TextField id={listId+"-search"} label={label} ref={field} value={query} autoFocus
      placeholder={placeholder} autoCorrect={false} autoCapitalize="none"
      returnKeyType="go" submitBehavior="submit"
      // RN web reads only blurOnSubmit; without it Enter blurs the field and focus leaves the palette.
      {...{blurOnSubmit:false}}
      role="combobox" aria-expanded aria-controls={listId}
      {...{"aria-activedescendant":activeId?optionId(activeId):undefined,"aria-autocomplete":"list"}}
      onChangeText={text=>store.setState({query:text,activeId:undefined})}
      onSubmitEditing={()=>run(activeId)}
      onKeyPress={(event:TextInputKeyPressEvent)=>onKey(event.nativeEvent as KeyData,SEARCH,
        ()=>event.preventDefault())}/>
    <ScrollView keyboardShouldPersistTaps="handled" style={{flexShrink:1}}>
     <View nativeID={listId} aria-label={label+" results"}
      // RN web forwards listbox; core RN's Role union omits it and maps it to nothing on Android.
      {...{role:"listbox" as PressableProps["role"]}}>
      {results.length===0
       ? <Text accessibilityLiveRegion="polite" role="status"
          {...{className:joinClasses(styled&&"text-text-muted")}}
          style={{paddingHorizontal:12,paddingVertical:16}}>{emptyText}</Text>
       : results.map(command=>{
        const active=command.id===activeId;
        return <Pressable key={command.id} nativeID={optionId(command.id)} role="option"
          aria-selected={active} aria-disabled={!!command.disabled}
          accessibilityLabel={command.group?command.group+", "+command.label:command.label}
          accessibilityHint={command.description}
          accessibilityState={{disabled:!!command.disabled,selected:active}}
          disabled={command.disabled}
          ref={node=>{if(node)rows.current.set(command.id,node);else rows.current.delete(command.id);}}
          onPress={()=>run(command.id)}
          onHoverIn={()=>{if(!command.disabled)store.setState({activeId:command.id});}}
          {...{onKeyDown:(event:KeyEvent)=>onKey(event.nativeEvent as unknown as KeyData,command.id,
            ()=>{event.preventDefault();event.stopPropagation();})}}
          {...{className:joinClasses("rounded-control",styled&&(active?"bg-surface-sunken":"focus-visible:bg-surface-sunken"))}}
          style={{minHeight:ROW_HEIGHT,paddingHorizontal:12,paddingVertical:7,justifyContent:"center",
            opacity:command.disabled?0.4:1}}>
          <Text {...{className:joinClasses(styled&&(command.danger?"text-danger":"text-text"))}}
            style={{fontWeight:"600"}}>
           {command.group?<Text {...{className:joinClasses(styled&&"text-text-muted")}}>{command.group}  </Text>:null}
           {command.label}
          </Text>
          {command.description?<Text numberOfLines={1} {...{className:joinClasses(styled&&"text-text-muted")}}
            style={{fontSize:12}}>{command.description}</Text>:null}
         </Pressable>;
       })}
     </View>
    </ScrollView>
   </View>
  </View>
 </Modal>;
}
