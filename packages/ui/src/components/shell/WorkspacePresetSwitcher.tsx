import {useEffect,useRef,type ComponentRef} from "react";
import {Modal,Platform,Pressable,Text,View,type ViewProps} from "react-native";
import {createStore,type StoreApi} from "zustand/vanilla";
import {useStore} from "zustand";
import {Button} from "../Button.tsx";
import {TextField} from "../TextField.tsx";
import {announce} from "../forge/announce.ts";
import type {Rect2D} from "../overlays/popover-position.ts";
import {joinClasses} from "../styles.ts";
import {MenuButton,type CommandMenuItem} from "./MenuButton.tsx";
import {
  PRESET_NAME_MAX,copyName,presetActions,presetNameMessage,presetNameProblem,validatePresetList,
  type WorkspacePreset,
} from "./workspace-preset-model.ts";

export type {WorkspacePreset} from "./workspace-preset-model.ts";

/**
 * Props for {@linkcode WorkspacePresetSwitcher}. Each callback maps to one
 * action on the host's preset store; the switcher never edits presets itself.
 */
export interface WorkspacePresetSwitcherProps extends Omit<ViewProps,"children"> {
  presets:readonly WorkspacePreset[];
  activeId?:string;
  /** Switch to a preset. */
  onSelect:(id:string)=>void;
  /** Save the current layout as a new custom preset. `name` is trimmed and validated. */
  onSaveAs:(name:string)=>void;
  /** Rename a custom preset. `name` is trimmed and validated. */
  onRename:(id:string,name:string)=>void;
  /** Copy a preset (built-in or custom) into a new custom one. */
  onDuplicate:(id:string)=>void;
  /** Delete a custom preset, after the user confirmed. */
  onDelete:(id:string)=>void;
  /** Put a preset's layout back to its saved default. */
  onReset:(id:string)=>void;
  /**
   * The preset the host just deleted and can still restore. While set, an
   * "Undo delete" button shows beside the menu. The host clears it when the
   * undo window ends.
   */
  recentlyDeleted?:{readonly id:string;readonly name:string};
  /** Restore {@linkcode WorkspacePresetSwitcherProps.recentlyDeleted}. Without it no undo is offered. */
  onUndoDelete?:(id:string)=>void;
  /** Window-space regions the menu may use, from the foldable layout owner. */
  usableRegions?:readonly Rect2D[];
  className?:string;
  unstyled?:boolean;
}

type Dialog=
  | {kind:"save"|"rename";draft:string;submitted:boolean}
  | {kind:"delete"};
type Local={dialog:Dialog|undefined};

/**
 * Menu for workspace layout presets: the built-in edit, color, audio, review
 * and presentation layouts plus the user's own. Built-ins are read-only and
 * offer only "Reset to default"; custom presets can be renamed, duplicated
 * and deleted (with a confirmation, then an undo button when the host keeps
 * the deleted preset). Names are trimmed, unique ignoring case, and at most
 * 40 characters. The menu is the kit's {@linkcode MenuButton}.
 */
export function WorkspacePresetSwitcher({
  presets,activeId,onSelect,onSaveAs,onRename,onDuplicate,onDelete,onReset,recentlyDeleted,onUndoDelete,
  usableRegions,className,unstyled=false,style,...rest
}:WorkspacePresetSwitcherProps){
  validatePresetList(presets);
  const saved=presets.find(p=>p.id===activeId);
  const active=saved??{id:"",name:"Custom layout",builtIn:true,modified:false};
  const local=useRef<StoreApi<Local>|null>(null);
  if(!local.current)local.current=createStore<Local>(()=>({dialog:undefined}));
  const store=local.current;
  const dialog=useStore(store,s=>s.dialog);
  const trigger=useRef<ComponentRef<typeof Pressable>>(null);
  const styled=!unstyled;
  const can=presetActions(saved);

  const undoable=recentlyDeleted&&onUndoDelete?recentlyDeleted:undefined;
  const lastUndo=useRef<string|undefined>(undefined);
  useEffect(()=>{
    if(!undoable||lastUndo.current===undoable.id){lastUndo.current=undoable?.id;return;}
    lastUndo.current=undoable.id;
    announce(`Deleted “${undoable.name}”. Undo is available.`);
  },[undoable]);

  const close=()=>{
    store.setState({dialog:undefined});
    // Focus goes back to the menu trigger, not to the menu item that opened the dialog.
    if(Platform.OS==="web")setTimeout(()=>(trigger.current as unknown as {focus?:()=>void}|null)?.focus?.(),0);
  };

  const items:CommandMenuItem[]=[
    ...presets.map(p=>({id:"preset:"+p.id,label:p.name,
      description:[p.builtIn?"Built-in":"Custom",p.id===activeId?"current":undefined,p.modified?"modified":undefined]
        .filter(Boolean).join(", ")})),
    {id:"action:save",label:"Save layout as new preset…"},
    {id:"action:duplicate",label:`Duplicate “${active.name}”`,disabled:!saved},
    {id:"action:rename",label:`Rename “${active.name}”…`,disabled:!can.canRename,
      ...(can.canRename?{}:{description:"Built-in presets keep their names"})},
    {id:"action:reset",label:`Reset “${active.name}” to default`,disabled:!can.canReset,
      ...(can.canReset?{}:{description:"Layout already matches the default"})},
    {id:"action:delete",label:`Delete “${active.name}”…`,danger:true,disabled:!can.canDelete,
      ...(can.canDelete?{}:{description:"Built-in presets can’t be deleted"})},
  ];
  const onMenu=(id:string)=>{
    if(id.startsWith("preset:")){const target=id.slice(7);if(target!==activeId)onSelect(target);return;}
    switch(id.slice(7)){
      case "save":store.setState({dialog:{kind:"save",draft:copyName(active.name,presets),submitted:false}});break;
      case "rename":store.setState({dialog:{kind:"rename",draft:active.name,submitted:false}});break;
      case "duplicate":onDuplicate(active.id);break;
      case "reset":onReset(active.id);break;
      case "delete":store.setState({dialog:{kind:"delete"}});break;
    }
  };

  const named=dialog&&dialog.kind!=="delete"?dialog:undefined;
  const problem=named?presetNameProblem(named.draft,presets,named.kind==="rename"?activeId:undefined):undefined;
  const submitName=()=>{
    if(!named)return;
    if(problem){store.setState({dialog:{...named,submitted:true}});return;}
    const name=named.draft.trim();
    if(named.kind==="save")onSaveAs(name);
    else if(name!==active.name)onRename(active.id,name);
    close();
  };

  const triggerLabel=`Workspace preset: ${active.name}${active.modified?", modified":""}`;
  return <View {...rest} {...{className:joinClasses("flex-row items-center gap-1",className)}} style={style}>
    <MenuButton ref={trigger} label={triggerLabel} items={items} onSelect={onMenu} menuWidth={280}
      {...(usableRegions?{usableRegions}:{})} unstyled={unstyled}
      {...{className:joinClasses("flex-row gap-2 px-3",styled&&"border border-border bg-surface-raised hover:bg-surface-sunken")}}>
      <Text numberOfLines={1} {...{className:joinClasses(styled&&"text-sm font-semibold text-text")}} style={{maxWidth:160}}>{active.name}</Text>
      {active.modified?<View pointerEvents="none" {...{className:joinClasses(styled&&"border-accent")}}
        style={{width:8,height:8,borderRadius:4,borderWidth:4}}/>:null}
      <Chevron styled={styled}/>
    </MenuButton>
    {undoable?<Button title="Undo delete" variant="ghost" size="md"
      accessibilityLabel={`Undo delete of “${undoable.name}”`} onPress={()=>onUndoDelete?.(undoable.id)}/>:null}
    <Modal visible={dialog!==undefined} transparent animationType={Platform.OS==="web"?"none":"fade"} onRequestClose={close}>
      <View style={{flex:1,alignItems:"center",justifyContent:"center",padding:16}} {...{className:styled?"bg-text/50":undefined}}>
        <View accessibilityViewIsModal {...{role:"dialog","aria-modal":true,
          "aria-label":dialog?.kind==="delete"?"Delete preset":dialog?.kind==="rename"?"Rename preset":"Save preset",
          className:joinClasses("w-full gap-4 p-5",styled&&"rounded-card border border-border bg-surface-raised")}}
          style={{maxWidth:420}}>
          {dialog?.kind==="delete"?<>
            <Text accessibilityRole="header" {...{className:joinClasses("text-start",styled&&"text-lg font-semibold text-text")}}>
              {`Delete “${active.name}”?`}</Text>
            <Text {...{className:joinClasses("text-start",styled&&"text-sm text-text-muted")}}>
              {onUndoDelete?"The preset and its layout are removed. You can undo this right after.":"The preset and its layout are removed for good."}</Text>
            <View style={{flexDirection:"row",justifyContent:"flex-end",gap:8,flexWrap:"wrap"}}>
              <Button title="Cancel" variant="secondary" onPress={close}/>
              <Button title="Delete" variant="danger" onPress={()=>{onDelete(active.id);close();}}/>
            </View>
          </>:named?<>
            <Text accessibilityRole="header" {...{className:joinClasses("text-start",styled&&"text-lg font-semibold text-text")}}>
              {named.kind==="save"?"Save layout as a new preset":`Rename “${active.name}”`}</Text>
            <TextField id="workspace-preset-name" label="Preset name" value={named.draft} autoFocus selectTextOnFocus
              maxLength={PRESET_NAME_MAX+20} returnKeyType="done" onSubmitEditing={submitName}
              onChangeText={draft=>store.setState({dialog:{...named,draft}})}
              {...(named.submitted&&problem?{errorText:presetNameMessage(problem,named.draft)}
                :{helperText:`Up to ${PRESET_NAME_MAX} characters.`})}/>
            <View style={{flexDirection:"row",justifyContent:"flex-end",gap:8,flexWrap:"wrap"}}>
              <Button title="Cancel" variant="secondary" onPress={close}/>
              <Button title={named.kind==="save"?"Save preset":"Rename"} onPress={submitName}/>
            </View>
          </>:null}
        </View>
      </View>
    </Modal>
  </View>;
}

function Chevron({styled}:{styled:boolean}){
  // Two strokes drawn as borders, so forced-colors mode keeps them.
  return <View pointerEvents="none" {...{className:joinClasses(styled&&"border-text-muted")}}
    style={{width:8,height:8,borderRightWidth:2,borderBottomWidth:2,transform:[{rotate:"45deg"}],marginTop:-4}}/>;
}
