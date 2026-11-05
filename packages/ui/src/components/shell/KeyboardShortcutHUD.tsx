import {useEffect,useRef,type ComponentRef} from "react";
import {Modal,Platform,Pressable,ScrollView,Text,View} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {useRestoreFocus} from "../overlays/focus-restore.ts";
import {joinClasses} from "../styles.ts";
import {InspectorSearch} from "./InspectorSearch.tsx";
import {matchesQuery} from "./inspector-model.ts";
import {shellKey} from "./shell-keys.ts";
import {
  bindingFromChord,bindingKeycaps,bindingSpoken,findConflict,isAssignableBinding,normalizeBinding,
  type Binding,type ChordRecorder,type KeyChord,type ShortcutCommand,
} from "./shortcut-model.ts";

export type {Binding,ChordRecorder,KeyChord,ShortcutCommand} from "./shortcut-model.ts";
export {bindingFromChord,commandForChord} from "./shortcut-model.ts";

/** Props for {@linkcode KeyboardShortcutHUD}. */
export interface KeyboardShortcutHUDProps {
  visible:boolean;
  onDismiss:()=>void;
  commands:readonly ShortcutCommand[];
  /**
   * Customizable bindings: set (`binding`) or clear (`undefined`) one
   * command's shortcut. Without it the list is read-only.
   */
  onRebind?:(id:string,binding:Binding|undefined)=>void;
  /**
   * Hardware key source for recording on iOS and Android, where React
   * Native delivers no key events. Without it, native platforms list the
   * shortcuts read-only. Web records from the browser and ignores it.
   */
  recorder?:ChordRecorder;
  /** Apple keycaps (⌘ ⌥ ⇧). @default detected from the platform */
  apple?:boolean;
  /** @default "Keyboard shortcuts" */
  title?:string;
  className?:string;
  unstyled?:boolean;
}

type Local={query:string;capturing:string|undefined;pending:Binding|undefined;error:string|undefined};

/** True on iOS, macOS and Apple browsers. */
export function isApplePlatform():boolean{
  if(Platform.OS==="ios"||(Platform.OS as string)==="macos")return true;
  const nav=(globalThis as {navigator?:{platform?:string;userAgent?:string}}).navigator;
  return /Mac|iPhone|iPad/.test(nav?.platform??nav?.userAgent??"");
}

/**
 * Searchable list of every command and its shortcut, grouped by section.
 * With `onRebind` each row can record a new binding: press "Change", then
 * the keys. A binding needs Ctrl, Alt or Command (function keys excepted);
 * one already in use asks before replacing it; Escape cancels recording.
 * Recording reads hardware key events. React Native delivers them on web
 * only, so iOS and Android record through `recorder` and show the list
 * read-only without one.
 */
export function KeyboardShortcutHUD({
  visible,onDismiss,commands,onRebind,recorder,apple=isApplePlatform(),title="Keyboard shortcuts",className,unstyled=false,
}:KeyboardShortcutHUDProps){
  const styled=!unstyled;
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({query:"",capturing:undefined,pending:undefined,error:undefined}));
  const store=local.current;
  const {query,capturing,pending,error}=useStore(store,s=>s);
  const recorder=useRef<ComponentRef<typeof View>>(null);
  // Move focus into the recorder once it has rendered, so the next keys reach it.
  useEffect(()=>{if(capturing)(recorder.current as unknown as {focus?:()=>void}|null)?.focus?.();},[capturing]);
  useRestoreFocus(visible);
  const web=Platform.OS==="web";
  const canRebind=!!onRebind&&(web||!!recorder);
  const shown=commands.filter(c=>matchesQuery(query,c.label,[...(c.keywords??[]),c.group??"",
    ...(c.binding?[bindingSpoken(c.binding,apple),...bindingKeycaps(c.binding,apple)]:[])]));
  const groups=[...new Set(shown.map(c=>c.group??""))];
  const stop=()=>store.setState({capturing:undefined,pending:undefined,error:undefined});
  const assign=(id:string,binding:Binding)=>{
    const conflict=findConflict(commands,id,binding);
    if(conflict)onRebind?.(conflict.id,undefined);
    onRebind?.(id,binding);
    stop();
  };
  // One path for both key sources: the browser keydown on web, `recorder` on native.
  const take=(id:string,chord:KeyChord)=>{
    const binding=bindingFromChord(chord,apple);
    if(!binding)return;
    if(!isAssignableBinding(binding)){
      store.setState({pending:undefined,error:`Add ${apple?"Command, Control or Option":"Ctrl or Alt"} so it does not fire while typing.`});
      return;
    }
    if(findConflict(commands,id,binding)){store.setState({pending:binding,error:undefined});return;}
    assign(id,binding);
  };
  const record=(id:string)=>(event:unknown)=>{
    const k=shellKey(event);
    k.preventDefault();k.stopPropagation();
    // Plain Escape cancels recording through the Modal's onRequestClose, which React Native
    // Web fires on keyup; stopping here would let that keyup close the whole sheet.
    if(k.key==="Escape"&&!k.ctrlKey&&!k.metaKey&&!k.altKey&&!k.shiftKey)return;
    take(id,{key:k.key,ctrlKey:k.ctrlKey,metaKey:k.metaKey,altKey:k.altKey,shiftKey:k.shiftKey});
  };
  // Native recording: the hardware source owns the keys while a row records. A plain
  // Escape arrives here too (no Modal keyup on native) and cancels.
  useEffect(()=>{
    if(web||!recorder||!capturing)return;
    const id=capturing;
    const sub=recorder.startRecording(chord=>{
      if(chord.key==="Escape"&&!chord.ctrlKey&&!chord.metaKey&&!chord.altKey&&!chord.shiftKey){stop();return;}
      take(id,chord);
    });
    return ()=>sub.remove();
  // take/stop read the store and props at call time; restart only when the recording row changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[web,recorder,capturing]);
  const keycaps=(binding:Binding)=><View style={{flexDirection:"row",gap:3}} accessibilityLabel={bindingSpoken(binding,apple)}>
    {bindingKeycaps(binding,apple).map((cap,i)=><Text key={i} accessibilityElementsHidden importantForAccessibility="no"
      {...{className:joinClasses(styled&&"rounded-control border border-border bg-surface-sunken text-text text-xs")}}
      style={{minWidth:22,paddingHorizontal:5,paddingVertical:2,textAlign:"center",fontVariant:["tabular-nums"]}}>{cap}</Text>)}
  </View>;
  const small=joinClasses("min-h-11 min-w-11 items-center justify-center px-2",styled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus hover:bg-surface-sunken");
  const row=(c:ShortcutCommand)=>{
    const active=capturing===c.id;
    const conflict=active&&pending?findConflict(commands,c.id,pending):undefined;
    const changed=c.defaultBinding!==undefined&&normalizeBinding(c.defaultBinding)!==(c.binding&&normalizeBinding(c.binding));
    return <View key={c.id} {...{className:joinClasses(styled&&"border-b border-border")}} style={{paddingVertical:4,gap:4}}>
      <View style={{flexDirection:"row",alignItems:"center",gap:8,minHeight:44,flexWrap:"wrap"}}>
        <Text {...{className:joinClasses(styled&&"text-text text-sm")}} style={{flex:1,minWidth:140}}>{c.label}</Text>
        {c.binding?keycaps(c.binding):<Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>Not set</Text>}
        {canRebind&&!active?<Pressable accessibilityRole="button" accessibilityLabel={"Change shortcut for "+c.label}
          onPress={()=>store.setState({capturing:c.id,pending:undefined,error:undefined})}
          {...{className:small}}><Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>Change</Text></Pressable>:null}
        {canRebind&&!active&&changed?<Pressable accessibilityRole="button" accessibilityLabel={"Reset shortcut for "+c.label}
          onPress={()=>{if(c.defaultBinding)assign(c.id,c.defaultBinding);}}
          {...{className:small}}><Text {...{className:joinClasses(styled&&"text-text-muted text-xs")}}>Reset</Text></Pressable>:null}
      </View>
      {active?<View style={{gap:6}}>
        <View ref={recorder} accessible accessibilityLabel={"Recording a shortcut for "+c.label+". Press the keys, or Escape to cancel."}
          {...{onKeyDown:record(c.id),focusable:true,className:joinClasses(styled&&"rounded-control border-2 border-focus bg-surface-sunken focus-visible:outline-none")}}
          style={{minHeight:44,justifyContent:"center",paddingHorizontal:10}}>
          {pending?keycaps(pending):<Text {...{className:joinClasses(styled&&"text-text text-sm")}}>
            {web?"Press the new shortcut, or Esc to cancel":"Press the new shortcut on the hardware keyboard, or Esc to cancel"}</Text>}
        </View>
        {error?<Text accessibilityLiveRegion="assertive" {...{className:joinClasses(styled&&"text-danger text-xs")}}>{error}</Text>:null}
        {conflict?<View style={{gap:4}}>
          <Text accessibilityLiveRegion="assertive" {...{className:joinClasses(styled&&"text-text text-xs")}}>
            {`${bindingSpoken(pending!,apple)} is already used by ${conflict.label}. Replacing it leaves ${conflict.label} without a shortcut.`}</Text>
          <View style={{flexDirection:"row",gap:8}}>
            <Pressable accessibilityRole="button" accessibilityLabel={"Replace shortcut for "+conflict.label} onPress={()=>assign(c.id,pending!)}
              {...{className:joinClasses(small,styled&&"bg-primary")}}><Text {...{className:joinClasses(styled&&"text-on-primary text-xs font-semibold")}}>Replace</Text></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Cancel" onPress={stop} {...{className:small}}>
              <Text {...{className:joinClasses(styled&&"text-text text-xs")}}>Cancel</Text></Pressable>
          </View>
        </View>:null}
      </View>:null}
    </View>;
  };
  return <Modal visible={visible} transparent animationType="none" onRequestClose={()=>{if(store.getState().capturing)stop();else onDismiss();}}
    // React Native Web makes the Modal itself the dialog; this names it.
    accessibilityViewIsModal {...{"aria-label":title}}>
    <View style={{flex:1,alignItems:"center",justifyContent:"center",padding:16}}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close shortcuts" focusable={false} onPress={onDismiss}
        style={{position:"absolute",top:0,right:0,bottom:0,left:0,backgroundColor:"rgba(0,0,0,0.32)"}}/>
      <View {...{className:joinClasses(styled&&"rounded-card border border-border bg-surface-raised",className)}}
        style={{width:"100%",maxWidth:560,maxHeight:"85%",overflow:"hidden",boxShadow:"0 12px 32px rgba(0,0,0,0.22)"}}>
        <View style={{flexDirection:"row",alignItems:"center",paddingHorizontal:16,paddingTop:8,gap:8}}>
          <Text accessibilityRole="header" {...{className:joinClasses(styled&&"text-text text-base font-semibold")}} style={{flex:1}}>{title}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onDismiss} {...{className:small}}>
            <View pointerEvents="none" style={{width:12,height:12,alignItems:"center",justifyContent:"center"}}>
              <View {...{className:joinClasses(styled&&"border-text")}} style={{position:"absolute",width:14,height:0,borderTopWidth:1.5,transform:[{rotate:"45deg"}]}}/>
              <View {...{className:joinClasses(styled&&"border-text")}} style={{position:"absolute",width:14,height:0,borderTopWidth:1.5,transform:[{rotate:"-45deg"}]}}/>
            </View>
          </Pressable>
        </View>
        <InspectorSearch label="Search shortcuts" query={query} onQueryChange={q=>store.setState({query:q})} unstyled={unstyled}
          summary={query.trim()?(shown.length?`${shown.length} ${shown.length===1?"shortcut":"shortcuts"}`:"No shortcuts match"):""}
          style={{paddingHorizontal:16,paddingTop:4}}/>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingHorizontal:16,paddingBottom:16}}>
          {groups.map(g=><View key={g||"_"} style={{paddingTop:8}}>
            {g?<Text accessibilityRole="header" {...{className:joinClasses(styled&&"text-text-muted text-xs font-semibold")}} style={{paddingVertical:4}}>{g}</Text>:null}
            {shown.filter(c=>(c.group??"")===g).map(row)}
          </View>)}
          {!shown.length?<Text {...{className:joinClasses(styled&&"text-text-muted text-sm")}} style={{paddingVertical:16}}>
            {`No command matches "${query.trim()}".`}</Text>:null}
        </ScrollView>
      </View>
    </View>
  </Modal>;
}
